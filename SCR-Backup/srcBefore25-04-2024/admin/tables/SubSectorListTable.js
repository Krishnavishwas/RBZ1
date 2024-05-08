import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Link } from 'react-router-dom'
import { APIURL } from "../../constant";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

const SubSectorListTable = () => {

    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState([]);
    const [toastDisplayed, setToastDisplayed] = useState(false);
    const [formerr, setformerr] = useState();
    const [updateerr, setupdateerr] = useState();
    const csvLinkRef = useRef();
    const [errors, setErrors] = useState(false);
    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };


    // sector data start
    const [sectorData, setSectorData] = useState([])
    const sector_Data = async () => {
        try {
            const response = await fetch(APIURL + 'Admin/GetAllSector', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSectorData(data.responseData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    // sector data end



    // subsector update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setupdateerr('');
        setUpdateData({
            subSectorName: '',
            sectorID: '',
            status: '',

        });
    }

    const [updateData, setUpdateData] = useState({
        subSectorName: '',
        sectorID: '',
        status: '',

    })
    const changeUpdateForm = (e) => {

        const { name, value } = e.target;
        let newErrors = {};

        const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        // const specialChars = /[^\w\s&,_%-]/;
        const specialChars = /[^\w\s&,-]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "subSectorName" && specialChars.test(value)) {
            newErrors.subSectorName = "Special characters not allowed.";
        } else if (name == "subSectorName" && value.charAt(0) === ' ') {
            newErrors.subSectorName = "First character cannot be a blank space.";
        } else if (name == "subSectorName" && spaceCheck.test(value)) {
            newErrors.subSectorName = "Multiple space not allow.";
        } else if (name == "subSectorName" && (specialCharsOLD.test(value.charAt(0)))) {
            newErrors.subSectorName = "First special character is not allowed.";
        }

        else {

            setUpdateData((prevState) => ({
                ...prevState,
                [name]: value

            }));
        }
        setupdateerr(newErrors);

    }



    const [updateID, setUpdateID] = useState("")
    const handleUpdate = async (id) => {
        setShowUpdateModal(true);
        setUpdateID(id)
        const TableId = {
            "id": id
        }

        try {
            const response = await fetch(APIURL + 'Admin/GetSubSectorByID', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(TableId)
            });

            const data = await response.json();
            setUpdateData(data.responseData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    const handleUpdateData = async () => {
        const updateValue = {
            "ID": updateID,
            "SectorID": updateData.sectorID,
            "SectorCode": "",
            "SubSectorName": updateData.subSectorName,
            "Status": updateData.status,
        }

        try {

            if (isUpdateValid()) {
                const response = await fetch(APIURL + 'Admin/UpdateSubSector', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateValue)
                });

                const data = await response.json();
                setToastDisplayed(true);
                if (data.responseCode === '200') {
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        UpdateModalClose();
                        table_Data();
                        setSearchText('');
                        setSelectSectorId({
                            SectorID: '0',
                        })
                        sector_Data();
                        setSectorData([]);
                        setUpdateData({
                            subSectorName: '',
                            sectorID: '',
                        });
                        setToastDisplayed(false);
                    }, 2500)
                }
                else {
                    toast.warning(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {

                        table_Data();
                        setToastDisplayed(false);

                    }, 2500)
                }
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    // sub sector  update end
    const [selectSectorId, setSelectSectorId] = useState({
        SectorID: '0',
    })
    const [not, setnot] = useState(false)
    const handleSector = (e) => {
        const { name, value } = e.target;
     
        setSelectSectorId((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }   
    // sub sector  list api start
    const table_Data = async () => {
        const sectorid = {
            "SectorID": selectSectorId.SectorID,
        }
        try {
            const response = await fetch(APIURL + 'Admin/GetAllSubSector', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sectorid)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTableData(data.responseData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    // sub sector  list api end
    useEffect(() => {
        table_Data();
        sector_Data();
    }, [selectSectorId.SectorID])
    const columns = [


      
        {
            name: 'Subsector Name',
            selector: row => row.subSectorName,
            sortable: true,
            searchable: true,
            width: '35%',
        },
        {
            name: 'Sector Name',
            selector: row => row.sectorName,
            sortable: true,
            searchable: true,
            width: '35%',
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            searchable: true,
            width: '20%',
            cell: row => <span>{row.status === 1 ? <span className="badge rounded-pill bg-success">Active</span> : <span className="badge rounded-pill bg-warning text-dark">Inactive</span>}</span>,
        },
        {
            name: 'Action',
            width: '10%',
            cell: row => <> <Link to="" className="me-2"
                onClick={() => handleUpdate(row.id)}><i class="bi bi-pencil-square"></i></Link>


            </>
        },

    ];


    // Sector Master form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setsubSectorForm({
            title: "",
            SectorID: "",
        });
        setformerr('');
    };
    const handleFormShow = () => setShowForm(true);
    const [subSectorForm, setsubSectorForm] = useState(
        {
            title: "",
            SectorID: "",
        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        let newErrors = {};

        const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        // const specialChars = /[^\w\s&,_%-]/;
        const specialChars = /[^\w\s&,-]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "title" && specialChars.test(value)) {
            newErrors.title = "Special characters not allowed.";
        } else if (name == "title" && value.charAt(0) === ' ') {
            newErrors.title = "First character cannot be a blank space.";
        } else if (name == "title" && spaceCheck.test(value)) {
            newErrors.title = "Multiple space not allow.";
        } else if (name == "title" && (specialCharsOLD.test(value.charAt(0)))) {
            newErrors.title = "First special character is not allowed.";
        }

        else {

            setsubSectorForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setformerr(newErrors);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const application_data = {
            "SectorID": subSectorForm.SectorID,
            "SubSectorName": subSectorForm.title,
            "SubSectorCode": "",
        }
        const application_data_json = JSON.stringify(application_data);
        try {
            if (isValid()) {
                const application_responce = await fetch(APIURL + 'Admin/AddSubSector', {
                    method: "Post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: application_data_json,

                });
                const data = await application_responce.json();
               
                setToastDisplayed(true);
                if (data.responseCode === '200') {
                    setsubSectorForm({
                        title: "",
                        SectorID: "",
                    });
                    
                   
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        handleFormClose();
                        table_Data();
                        setSearchText('');
                        setSelectSectorId({
                            SectorID: '0',
                        })
                        sector_Data();
                        setSectorData([]);
                        setToastDisplayed(false);
                    }, 2500)

                } else {
                    toast.warning(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        table_Data();
                        setToastDisplayed(false);
                    }, 2500)
                }
            }
        } catch (error) {
            console.log("Fetching Error", error)
        }
    };

    // Sector Master form end

    // validation start

    const isValid = () => {
        const newErrors = {};
        let valid = true

        if (!subSectorForm.title) {
            newErrors.title = "Subsector name is required.";
            valid = false
        }

        if (!subSectorForm.SectorID) {
            newErrors.SectorID = "Please select sector name.";
            valid = false
        }
        setformerr(newErrors);
        return valid;
    }

    // validation end
    const isUpdateValid = () => {
        const newErrors = {};
        let valid = true

        if (!updateData.subSectorName) {
            newErrors.subSectorName = "Subsector name is required.";
            valid = false
        }

        if (!updateData.sectorID) {
            newErrors.sectorID = "Please select sector name.";
            valid = false
        }
        setupdateerr(newErrors);
        return valid;
    }

    const filteredData = tableData?.filter(item =>
    (item.sectorName?.toLowerCase().includes(searchText?.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchText)) ||
        item.subSectorName?.toLowerCase().includes(searchText?.toLowerCase()) ||
        (item.status == "1" ? "Active" : "Inactive").toLowerCase().includes(searchText?.toLowerCase()))

    );

    // const handleExportExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(filteredData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Movie Data");
    //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //     const excelData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    //     FileSaver.saveAs(excelData, "movie_data.xlsx");
    // };

    return (
        <>
            <>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    defaultSortFieldId={1}
                    defaultSortAsc={true}
                    persistTableHead={true}
                    pagination
                    paginationRowsPerPageOptions={[10, 50, 100]}
                    highlightOnHover
                    dense
                    striped
                    fixedHeader
                    subHeader
                    subHeaderComponent={
                        <div className="admintablesearch">
                            <div className="tablesearch_bx">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                            <div className="filtet-sector">
                                <label>
                                    <select name="SectorID" class="" aria-label="Large select example" onChange={(e) => handleSector(e)}>
                                        <option value="0" selected>Select Sector Name</option>
                                        {
                                            sectorData?.map((item) => {
                                                return (
                                                    <option value={item.id}>{item.sectorName}</option>
                                                )
                                            })
                                        }


                                    </select>
                                    <span className='sspan'></span>
                                </label>


                            </div>
                            <div className="table-btn-bx">
                                {/* <CSVLink
                                data={filteredData}
                                filename={"movie_data.csv"}
                                className="hidden"
                                ref={csvLinkRef} 
                            >
                                Export to CSV
                            </CSVLink> */}
                                {/* <button onClick={handleExportExcel} disabled>Export to Excel</button> */}
                                <Button
                                    onClick={handleFormShow}
                                >
                                    Add Subsector
                                </Button>
                            </div>

                        </div>
                    }
                />

            </>
            {/* SubSectorList Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Subsector</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="title" className='fomcontrol text-capitalize' value={subSectorForm?.title} placeholder="Subsector Name" onChange={(e) => { changeHandelForm(e) }} onKeyDown={(e) => {
                                            if (e.key === "_") {
                                                e.preventDefault();
                                            }
                                        }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.title ? (
                                        <span className="errormsg">
                                            {formerr?.title}
                                        </span>
                                    ) : ""}

                                </div>
                                {/* <div className="form-bx mb-2">
                                    <label>
                                        <input type="text" name="SectorName" className={errors === true && !sectorMasterForm.SectorName ? 'error' : 'fomcontrol'} placeholder="SectorName" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !sectorMasterForm.SectorName ? <small class="errormsg">SectorName is Required</small> : ''}
                                </div> */}
                                <div className="form-bx mb-4">
                                    <label>
                                        <select name="SectorID" class="" aria-label="Large select example" onChange={(e) => { changeHandelForm(e) }}>
                                            <option value="" selected>Select Sector Name</option>
                                            {
                                                sectorData?.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.sectorName}</option>
                                                    )
                                                })
                                            }


                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.SectorID ? (
                                        <span className="errormsg">
                                            {formerr?.SectorID}
                                        </span>
                                    ) : ""}

                                </div>
                            </Modal.Body>
                            <Modal.Footer className="p-0">
                                <Button variant="primary" onClick={handleSubmit} disabled={toastDisplayed ? true : false}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </div>
                    </div>
                </div>
            </Modal >
            {/* SubSectorList Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title> Update Subsector</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                {/* <div className="form-bx mb-3">
                                    <label>
                                        <input type="text" name="sectorCode" className={errors === true && !updateData.sectorCode ? 'error' : 'fomcontrol'} placeholder="Title" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.sectorCode} />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !updateData.sectorCode ? <small class="errormsg">Title is Required</small> : ''}
                                </div> */}
                                <div className="form-bx mb-4">
                                    <p className="form-label">Subsector Name</p>
                                    <label>
                                        <input type="text" name="subSectorName" className='fomcontrol text-capitalize' placeholder="Subsector Name" onChange={(e) => { changeUpdateForm(e) }} onKeyDown={(e) => {
                                            if (e.key === "_") {
                                                e.preventDefault();
                                            }
                                        }} required value={updateData?.subSectorName} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.subSectorName ? (
                                        <span className="errormsg">
                                            {updateerr?.subSectorName}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Select Sector Name</p>
                                    <label>
                                        <select name="sectorID" class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData.sectorID}>
                                            <option value="" selected>Select Sector Name</option>
                                            {
                                                sectorData?.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.sectorName}</option>
                                                    )
                                                })
                                            }


                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.sectorID ? (
                                        <span className="errormsg">
                                            {updateerr?.sectorID}
                                        </span>
                                    ) : ""}
                                    {/* {errors === true && !updateData.name ? <small class="errormsg">Name is Required</small> : ''} */}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Select Status</p>
                                    <label>
                                        <select name="status" class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData.status}>

                                            <option value="0">Inactive</option>
                                            <option value="1">Active</option>
                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {/* {errors === true && !updateData.name ? <small class="errormsg">Name is Required</small> : ''} */}
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="p-0">
                                <Button variant="primary" onClick={handleUpdateData} disabled={toastDisplayed ? true : false}>
                                    Update
                                </Button>
                            </Modal.Footer>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default SubSectorListTable
