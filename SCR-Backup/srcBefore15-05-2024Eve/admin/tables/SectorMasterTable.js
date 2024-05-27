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

const SectorMasterTable = () => {

    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState([]);
    const [toastDisplayed, setToastDisplayed] = useState(false);
    const csvLinkRef = useRef();
    const [formerr, setformerr] = useState();
    const [updateerr, setupdateerr] = useState();
    const [errors, setErrors] = useState(false);
    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };



    // sector update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setUpdateData({
            sectorCode: '',
            sectorName: '',
            status: '',

        })
        setupdateerr('');
    }

    const [updateData, setUpdateData] = useState({
        sectorCode: '',
        sectorName: '',
        status: '',

    })
    const changeUpdateForm = (e) => {

        const { name, value } = e.target;

        let newErrors = {};

        const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        // const specialChars = /[^\w\s&,_%-]/;
        const specialChars = /[^\w\s&,-]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "sectorName" && specialChars.test(value)) {
            newErrors.sectorName = "Special characters not allowed.";
        } else if (name == "sectorName" && value.charAt(0) === ' ') {
            newErrors.sectorName = "First character cannot be a blank space.";
        } else if (name == "sectorName" && spaceCheck.test(value)) {
            newErrors.sectorName = "Multiple space not allow.";
        } else if (name == "sectorName" && (specialCharsOLD.test(value.charAt(0)))) {
            newErrors.sectorName = "First special character is not allowed.";
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

            const response = await fetch(APIURL + 'Admin/GetSectorByID', {
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
            "SectorCode": '',
            "SectorName": updateData.sectorName.toUpperCase(),
            "Status": updateData.status,
        }

        try {
            if (isUpdateValid()) {
                const response = await fetch(APIURL + 'Admin/UpdateSector', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateValue)
                });

                const data = await response.json();
                setToastDisplayed(true)
                if (data.responseCode === '200') {

                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        UpdateModalClose();
                        table_Data();
                        setUpdateData({
                            sectorCode: '',
                            sectorName: '',
                        });
                        setSearchText('');
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
    // sector  update end

    // sector  list api start
    const table_Data = async () => {
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
            setTableData(data.responseData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    // sector  list api end
    useEffect(() => {
        table_Data();
    }, [])
    const columns = [



        {
            name: 'Sector Name',
            selector: row => row.sectorName,
            sortable: true,
            searchable: true,
            width: '60%',
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
            width: '20%',
            cell: row => <> <Link to="" className="me-2"
                onClick={() => handleUpdate(row.id)}><i class="bi bi-pencil-square"></i></Link>


            </>
        },

    ];


    // add Sector form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setformerr('');
        setSectorMasterForm({
            title: "",
            SectorName: "",
        });

    };
    const handleFormShow = () => setShowForm(true);
    const [sectorMasterForm, setSectorMasterForm] = useState(
        {
            title: "",
            SectorName: "",
        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        let newErrors = {};

        const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        // const specialChars = /[^\w\s&,_%-]/;
        const specialChars = /[^\w\s&,-]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "SectorName" && specialChars.test(value)) {
            newErrors.SectorName = "Special characters not allowed.";
        } else if (name == "SectorName" && value.charAt(0) === ' ') {
            newErrors.SectorName = "First character cannot be a blank space.";
        } else if (name == "SectorName" && spaceCheck.test(value)) {
            newErrors.SectorName = "Multiple space not allow.";
        } else if (name == "SectorName" && (specialCharsOLD.test(value.charAt(0)))) {
            newErrors.SectorName = "First special character is not allowed.";
        }

        else {
            setSectorMasterForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setformerr(newErrors);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const application_data = {
            "SectorCode": '',
            "SectorName": sectorMasterForm.SectorName.toUpperCase()
        }
        const application_data_json = JSON.stringify(application_data);
        try {
            if (isValid()) {
                const application_responce = await fetch(APIURL + 'Admin/AddSector', {
                    method: "Post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: application_data_json,

                });

                const data = await application_responce.json();
                setToastDisplayed(true)
                if (data.responseCode === '200') {
                    setSectorMasterForm({
                        title: "",
                        SectorName: "",
                    })
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        handleFormClose();
                        table_Data();
                        setSearchText('');
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
            console.log("Fetching Error", error)
        }
    };

    // Sector Master form end



    // validation start
    const isValid = () => {
        const newErrors = {};
        let valid = true

        if (!sectorMasterForm.SectorName) {
            newErrors.SectorName = "Sector name is required.";
            valid = false
        }
        setformerr(newErrors);
        return valid;


    }
    // validation end
    // validation update start
    const isUpdateValid = () => {
        const newErrors = {};
        let valid = true

        // if (!updateData.sectorCode) {
        //     newErrors.sectorCode = "Title is required";
        //     valid = false
        // }

        if (!updateData.sectorName) {
            newErrors.sectorName = "Sector name is required.";
            valid = false
        }
        setupdateerr(newErrors);
        return valid;


    }

    const filteredData = tableData?.filter(item =>
    (item.sectorName?.toLowerCase().includes(searchText?.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchText)) ||
        item.sectorCode?.toLowerCase().includes(searchText?.toLowerCase()) ||
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
                    persistTableHead={true}
                    defaultSortAsc={true}
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
                                    Add Sector
                                </Button>
                            </div>

                        </div>
                    }
                />

            </>


            {/* SectorMaster Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Sector</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                {/* <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="title" className='fomcontrol' value={sectorMasterForm?.title} placeholder="Title" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.title ? (
                                        <span className="errormsg">
                                            {formerr?.title}
                                        </span>
                                    ) : ""}

                                </div> */}
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="SectorName" className='fomcontrol text-uppercase' onKeyDown={(e) => {
                                            if (e.key === "_") {
                                                e.preventDefault();
                                            }
                                        }} value={sectorMasterForm?.SectorName} placeholder="Sector Name" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.SectorName ? (
                                        <span className="errormsg">
                                            {formerr?.SectorName}
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

            {/* sectorMaster Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Update Sector</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                {/* <div className="form-bx mb-4">
                                    <p className="form-label">Title</p>
                                    <label>
                                        <input type="text" name="sectorCode" className='fomcontrol' placeholder="Title" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.sectorCode} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.sectorCode && (
                                        <span className="errormsg">
                                            {updateerr?.sectorCode}
                                        </span>
                                    )}


                                </div> */}
                                <div className="form-bx mb-4">
                                    <p className="form-label">Sector Name</p>
                                    <label>
                                        <input type="text" name="sectorName" className='fomcontrol text-uppercase' onKeyDown={(e) => {
                                            if (e.key === "_") {
                                                e.preventDefault();
                                            }
                                        }} placeholder="Sector Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.sectorName} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.sectorName ? (
                                        <span className="errormsg">
                                            {updateerr?.sectorName}
                                        </span>
                                    ) : ""}

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

export default SectorMasterTable
