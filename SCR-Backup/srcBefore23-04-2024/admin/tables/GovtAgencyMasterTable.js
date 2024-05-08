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

const GovtAgencyMasterTable = () => {

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


    // GovernmentAgency update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setUpdateData({

            agencyName: '',
            status: '',
            agencyAddress1: '',


        })
        setupdateerr('');
    }
    const [updateData, setUpdateData] = useState({

        agencyName: '',
        status: '',
        agencyAddress1: '',


    })
    const changeUpdateForm = (e) => {

        const { name, value } = e.target;
        let newErrors = {};

        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "agencyName" && specialChars.test(value)) {
            newErrors.agencyName = "Special characters not allowed.";
        } else if (name == "agencyName" && value.charAt(0) === ' ') {
            newErrors.agencyName = "First character cannot be a blank space.";
        } else if (name == "agencyName" && spaceCheck.test(value)) {
            newErrors.agencyName = "Multiple space not allow.";
        } else if (name == "agencyAddress1" && value.charAt(0) === ' ') {
            newErrors.agencyAddress1 = "First character cannot be a blank space.";
        } else if (name == "agencyAddress1" && spaceCheck.test(value)) {
            newErrors.agencyAddress1 = "Multiple space not allow.";
        } else if (
            name == "agencyAddress1" &&
            (value.includes("$") ||
                value.includes("@") ||
                value.includes("`") ||
                value.includes("|") ||
                value.includes("~") ||
                value.includes(",") ||
                value.includes(">") ||
                value.includes("<") ||
                value.includes("*") ||
                value.includes("&") ||
                value.includes("%") ||
                value.includes("#") ||
                value.includes("+") ||
                value.includes("?") ||
                value.includes("!") ||
                value.includes(";") ||
                value.includes("=") ||
                value.includes('"') ||
                value.includes(`'`) ||
                value.includes("/") ||
                value.includes("}") ||
                value.includes("{") ||
                value.includes("^") ||
                value.includes("\\") ||
                value.includes("]") ||
                value.includes("["))
        ) {
            newErrors.address1 = "Special characters not allowed.";
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
            const response = await fetch(APIURL + 'Admin/GetGovtAgencyByID', {
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
            "AgencyCode": "",
            "AgencyName": updateData.agencyName,
            "AgencyAddress1": updateData.agencyAddress1,
            "Status": updateData.status,
        }

        try {
            if (isUpdateValid()) {
                const response = await fetch(APIURL + 'Admin/UpdateGovtAgency', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateValue)
                });

                const data = await response.json();
                setToastDisplayed(true)
                if (data.responseCode === '200') {

                    setErrors(false)

                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        UpdateModalClose();
                        table_Data();
                        setUpdateData({
                            agencyName: '',
                            agencyAddress1: '',
                        })
                        setSearchText('');
                        setToastDisplayed(false)
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
    // GovtAgency update end

    // GovtAgency list api start
    const table_Data = async () => {
        try {
            const response = await fetch(APIURL + 'Admin/GetAllGovtAgency', {
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
    // GovtAgency list api end
    useEffect(() => {
        table_Data();
    }, [])
    const columns = [


        {
            name: 'Goverment Agency Name',
            selector: row => row.agencyName,
            sortable: true,
            searchable: true,
            width: '70%',
        },

        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            searchable: true,
            width: '15%',
            cell: row => <span>{row.status === 1 ? <span className="badge rounded-pill bg-success">Active</span> : <span className="badge rounded-pill bg-warning text-dark">Inactive</span>}</span>,
        },
        {
            name: 'Action',
            width: '15%',
            cell: row => <> <Link to="" className="me-2"
                onClick={() => handleUpdate(row.id)}><i class="bi bi-pencil-square"></i></Link>


            </>
        },

    ];

    // GovernmentAgency form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setgovtAgencyForm({
            title: "",
            address1: "",

        });
        setformerr('');
    };
    const handleFormShow = () => setShowForm(true);
    const [govtAgencyForm, setgovtAgencyForm] = useState(
        {
            title: "",
            address1: "",

        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        let newErrors = {};

        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const spaceCheck = /\s{2,}/g;

        if (name == "title" && specialChars.test(value)) {
            newErrors.title = "Special characters not allowed.";
        } else if (name == "title" && value.charAt(0) === ' ') {
            newErrors.title = "First character cannot be a blank space.";
        } else if (name == "title" && spaceCheck.test(value)) {
            newErrors.title = "Multiple space not allow.";
        } else if (name == "address1" && value.charAt(0) === ' ') {
            newErrors.address1 = "First character cannot be a blank space.";
        } else if (name == "address1" && spaceCheck.test(value)) {
            newErrors.address1 = "Multiple space not allow.";
        } else if (
            name == "address1" &&
            (value.includes("$") ||
                value.includes("@") ||
                value.includes("`") ||
                value.includes("|") ||
                //   value.includes(" ") ||
                value.includes("~") ||
                //   value.includes(":") ||
                value.includes(",") ||
                value.includes(">") ||
                value.includes("<") ||
                //   value.includes("(") ||
                //   value.includes(")") ||
                value.includes("*") ||
                value.includes("&") ||
                value.includes("%") ||
                value.includes("#") ||
                value.includes("+") ||
                value.includes("?") ||
                value.includes("!") ||
                value.includes(";") ||
                value.includes("=") ||
                value.includes('"') ||
                value.includes(`'`) ||
                value.includes("/") ||
                value.includes("}") ||
                value.includes("{") ||
                value.includes("^") ||
                value.includes("\\") ||
                value.includes("]") ||
                value.includes("["))
        ) {
            newErrors.address1 = "Special characters not allowed.";
        }

        else {

            setgovtAgencyForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setformerr(newErrors);

    }



    const handleSubmit = async (e) => {
        e.preventDefault();

        const application_data = {
            "AgencyCode": "",
            "AgencyName": govtAgencyForm.title,
            "AgencyAddress1": govtAgencyForm.address1
        }
        const application_data_json = JSON.stringify(application_data);
     
        try {
            if (isValid()) {
                const application_responce = await fetch(APIURL + 'Admin/AddGovtAgency', {
                    method: "Post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: application_data_json,

                });

                const data = await application_responce.json();
                setToastDisplayed(true)
                if (data.responseCode === '200') {
                    setgovtAgencyForm({
                        title: "",
                        address1: "",

                    })
                    setErrors(false)

                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        handleFormClose();
                        setSearchText('');
                        table_Data();
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

    // GovernmentAgency form end

    // validation start
    const isValid = () => {
        const newErrors = {};
        let valid = true

        if (!govtAgencyForm.title) {
            newErrors.title = "Goverment agency name is required.";
            valid = false
        }
        if (!govtAgencyForm.address1) {
            newErrors.address1 = "Goverment agency address is required.";
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

        if (!updateData.agencyName) {
            newErrors.agencyName = "Goverment agency name is required.";
            valid = false
        }
        if (!updateData.agencyAddress1) {
            newErrors.agencyAddress1 = "Goverment agency address is required.";
            valid = false
        }


        setupdateerr(newErrors);
        return valid;


    }

    // application form end
    const filteredData = tableData?.filter(item =>
    (item.agencyName.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchText)) ||
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
                    pagination
                    persistTableHead={true}
                    defaultSortFieldId={1}
                    defaultSortAsc={true}
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
                                    Add Government Agency
                                </Button>
                            </div>

                        </div>
                    }
                />

            </>


            {/* GovtAgencyMaster Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Government Agency</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="title" className='fomcontrol text-capitalize' value={govtAgencyForm?.title} placeholder="Goverment Agency Name" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.title ? (
                                        <span className="errormsg">
                                            {formerr?.title}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <textarea name="address1" className='fomcontrol ' value={govtAgencyForm?.address1} placeholder="Goverment Agency Address" onChange={(e) => { changeHandelForm(e) }} required ></textarea>
                                        {/* <input type="text" name="address1" className='fomcontrol text-capitalize' value={govtAgencyForm?.address1} placeholder="Goverment Agency Name" onChange={(e) => { changeHandelForm(e) }} required /> */}
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.address1 ? (
                                        <span className="errormsg">
                                            {formerr?.address1}
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

            {/* GovtAgencyMaster Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Update Government Agency</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <p className="form-label">Goverment Agency Name</p>
                                    <label>
                                        <input type="text" name="agencyName" className='fomcontrol text-capitalize' placeholder="Goverment Agency Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.agencyName} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.agencyName ? (
                                        <span className="errormsg">
                                            {updateerr?.agencyName}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Goverment Agency Address</p>
                                    <label>
                                        <textarea name="agencyAddress1" className='fomcontrol' value={updateData?.agencyAddress1} placeholder="Goverment Agency Address" onChange={(e) => { changeUpdateForm(e) }} required ></textarea>
                                        {/* <input type="text" name="agencyName" className='fomcontrol text-capitalize' placeholder="Goverment Agency Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.agencyName} /> */}
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.agencyAddress1 ? (
                                        <span className="errormsg">
                                            {updateerr?.agencyAddress1}
                                        </span>
                                    ) : ""}

                                </div>

                                <div className="form-bx mb-4">
                                    <p className="form-label">Select Status</p>
                                    <label>
                                        <select name="status" class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData?.status}>

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

export default GovtAgencyMasterTable
