import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import ApplicationTypeForm from "../components/ApplicationTypeForm";
import { Link } from 'react-router-dom'
import { APIURL } from "../../constant";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

const ApplicationTypeTable = () => {

    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState([])
    const [toastDisplayed, setToastDisplayed] = useState(false);
    const [formerr, setformerr] = useState();
    const [updateerr, setupdateerr] = useState();

    const csvLinkRef = useRef();

    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };

    const [showDltModal, setShowDltModal] = useState(false);
    const handleDltClose = () => setShowDltModal(false);

    const [application, setApplication] = useState({
        name: '',
        id: ''
    });
    const handleDeleteShow = (id, name) => {
        setShowDltModal(true);
        setApplication({
            name: name,
            id: id
        });
    }
    const [departmentData, setDepartmentData] = useState([])

    const departmentApi = async () => {
        try {
            const responce = await fetch(APIURL + 'Master/GetDepartmentData', {
                method: "Post",
                headers: {
                    "content-type": "application/json"
                },
            })
            const data = await responce.json();
            setDepartmentData(data.responseData)

        } catch (error) {
            console.log("Fetch Data", error);
        }
    }

    const handleDeleteItem = async () => {
        const table_id = {
            "id": application.id,
            "Status": 90
        }
        try {
            const responce = await fetch(APIURL + 'Admin/DeleteApplicationType', {
                method: "Post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(table_id)
            })
            table_Data()
            const dltData = await responce.json();
            if (dltData.responseCode === '200') {

                setToastDisplayed(true)
                toast.success(dltData.responseMessage, { autoClose: 2000 })
                setTimeout(() => {
                    handleDltClose();
                    table_Data();
                    setToastDisplayed(false)
                }, 2500)
            }

        } catch (error) {
            console.log("Error delete data:", error);
        }
    }

    // applicationtype update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setupdateerr('');
    }
    // const updateModalShow = () => setShowUpdateModal(true);
    const [updateData, setUpdateData] = useState({

        name: '',
        departmentID: '',
        status: '',

    })
    const changeUpdateForm = (e) => {

        const { name, value } = e.target;

        // let newErrors = {};

        // const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        // if (name == "name" && specialChars.test(value)) {
        //     newErrors.name = "Special characters not allowed";
        // }

        // else if (name == "name" && value.charAt(0) === ' ') {
        //     newErrors.name = "First character cannot be a blank space";
        // }
        // else {

        setUpdateData((prevState) => ({
            ...prevState,
            [name]: value

        }));
        let nam = (name == "name" ? value : null);
        let dptID = (name == "departmentID" ? value : null);

        isUpdateValid(nam, dptID)

        // }
        // setupdateerr(newErrors);


    }
    const [updateID, setUpdateID] = useState("")
    const handleUpdate = async (id) => {
        setShowUpdateModal(true);
        setUpdateID(id)
        const TableId = {
            "id": id
        }

        try {
            const response = await fetch(APIURL + 'Admin/GetApplicationTypeByID', {
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
            "id": updateID,
            "Name": updateData.name,
            "DepartmentID": updateData.departmentID,
            "status": updateData.status
        }
        try {
            if (isUpdateValid(updateData.name, updateData.departmentID)) {
                const response = await fetch(APIURL + 'Admin/UpdateApplicationType', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateValue)
                });

                const data = await response.json();

                if (data.responseCode === '200') {
                    setUpdateData({
                        name: '',
                        depID: '',

                    })

                    setToastDisplayed(true)
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        UpdateModalClose();
                        table_Data();
                        setToastDisplayed(false)
                    }, 2500)
                }
                else {
                    toast.warning(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        UpdateModalClose();
                        table_Data();
                        setUpdateData({
                            name: '',
                            depID: '',

                        })
                        setToastDisplayed(false)
                    }, 2500)
                }

            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    const [tabDepId, setTabDepId] = useState("1");

    const handleClickTag = (id) => {
        setTabDepId(id)

    }

    // applicationtype update end
    const table_Data = async () => {
        const deptID = {
            "DepartmentID": tabDepId
        }
        try {
            const response = await fetch(APIURL + 'Admin/GetAllApplicationTypeByDepartment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deptID)
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
    useEffect(() => {
        table_Data();
        departmentApi();
    }, [tabDepId])
    const columns = [

        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            searchable: true,
            width: '40%',
        },
        {
            name: 'Department',
            selector: row => row.departmentName,
            sortable: true,
            searchable: true,
            width: '25%',
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
            width: '10%',
            cell: row => <> <Link to="" className="me-2"
                onClick={() => handleUpdate(row.id, row.name)}><i class="bi bi-pencil-square"></i></Link>
                {/* <Link to="" className=""
                    onClick={() => handleDeleteShow(row.id, row.name)}><i class="bi bi-trash"></i></Link> */}

            </>
        },

    ];


    // application form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setformerr('');
    };

    const handleFormShow = () => setShowForm(true);
    const [applicationTypeForm, setApplicationTypeForm] = useState(
        {
            name: '',
            depID: '',
        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        // let newErrors = {};

        // const specialChars =  /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        // if (name == "name" && specialChars.test(value)) {

        //     newErrors.name = "Special characters not allowed";
        // }

        // else if (name == "name" && value.charAt(0) === ' ') {
        //    console.log("shailesh99",value);
        //     newErrors.name = "First character cannot be a blank space";
        // }

        // else {

        setApplicationTypeForm((prevState) => ({

            ...prevState,
            [name]: value

        }));


        isValid(name == 'name' ? value : null);
        // isValid(value);
        // }

        // setformerr(newErrors);

    }

    const handleSubmit = async (e) => {

        e.preventDefault();


        const application_data = {
            "Name": applicationTypeForm.name,
            "DepartmentID": applicationTypeForm.depID
        }
        const application_data_json = JSON.stringify(application_data);

        try {

            if (isValid(applicationTypeForm.name)) {
                const application_responce = await fetch(APIURL + 'Admin/AddApplicationType', {
                    method: "Post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: application_data_json,

                });

                const data = await application_responce.json();
                if (data.responseCode === '200') {

                    setToastDisplayed(true)
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        setToastDisplayed(false)
                        handleFormClose();
                        table_Data();
                        setApplicationTypeForm({
                            name: '',
                            depID: '',
                        })
                    }, 2500)

                } else {

                    toast.warning(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        handleFormClose();
                        table_Data();
                        setToastDisplayed(false);
                        setApplicationTypeForm({
                            name: '',
                            depID: '',
                        })
                    }, 2500)
                }
            }


        } catch (error) {
            console.log("Fetching Error", error)
        }
    };


    // validation start
    const isValid = (na) => {

        let name = applicationTypeForm.name ? applicationTypeForm.name : na;

        const newErrors = {};
        let valid = true
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (!name) {
            newErrors.name = "Name is required";
            valid = false
        } else if (name == "name" || specialChars.test(name)) {
            newErrors.name = "Special characters not allowed";
            valid = false
        } else if (name.charAt(0) === ' ') {
            newErrors.name = "First character cannot be a blank space";
            valid = false
        }
        else {
            newErrors.name = null;
            valid = true
        }
        if (!applicationTypeForm.depID) {
            newErrors.depID = "Please select department";
            valid = false
        }
        setformerr(newErrors);
        return valid;


    }
    // validation end

    // validation update start
    const isUpdateValid = (na, depId) => {
        // let name = updateData.name ? updateData.name : na;
        let name = na != null ? na : updateData.name;
        depId = depId != null ? depId : updateData.departmentID;

        // depId =  updateData.departmentID ? updateData.departmentID : depId

        const newErrors = {};
        let valid = true
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (!name) {
            newErrors.name = "Name is required";
            valid = false
        } else if (specialChars.test(name)) {
            newErrors.name = "Special characters not allowed";
            valid = false
        } else if (name.charAt(0) === ' ') {
            newErrors.name = "First character cannot be a blank space";
            valid = false
        } else {
            newErrors.name = null;
            valid = true
        }
        //  console.log("22222",depId , updateData.departmentID);
        //  if (!depId || !updateData.departmentID) {
        if (!depId) {
            newErrors.departmentID = "Please select department";
            valid = false
        }
        setupdateerr(newErrors);
        return valid;


    }
    // validation end
    // console.log("updateerr",updateerr);

    const filteredData = tableData?.filter(item => item.name?.toLowerCase().includes(searchText?.toLowerCase()) ||
        item.departmentName?.toLowerCase().includes(searchText?.toLowerCase())

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
                    paginationRowsPerPageOptions={[10, 50, 100]}
                    highlightOnHover
                    dense
                    striped
                    fixedHeader
                    subHeader
                    subHeaderComponent={
                        <>
                            <div className="admintablesearch">
                                <div className="tablesearch_bx">
                                    <input
                                        type="text"
                                        placeholder="Search..."
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
                                        Add Application
                                    </Button>
                                </div>

                            </div>
                            <div className="application-tab w-100 mt-4">
                                <ul class="nav nav-pills mb-3">
                                    <li class="nav-item">
                                        <a class={tabDepId == 1 ? "nav-link active" : "nav-link"} onClick={(e) => handleClickTag(1)}>Export</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class={tabDepId == 2 ? "nav-link active" : "nav-link"} onClick={(e) => handleClickTag(2)}>Import</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class={tabDepId == 3 ? "nav-link active" : "nav-link"} onClick={(e) => handleClickTag(3)}>Foreign Investment</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class={tabDepId == 4 ? "nav-link active" : "nav-link"} onClick={(e) => handleClickTag(4)}>Inspectorate</a>
                                    </li>
                                </ul>

                            </div>
                        </>
                    }
                />

            </>


            {/* Application Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">

                    <div className="login_inner">
                        <div class="login_form ">
                            <h5> <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Application Master</Modal.Title>
                            </Modal.Header></h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="name" className='fomcontrol' placeholder="Name" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.name ? (
                                        <span className="errormsg">
                                            {formerr?.name}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <select name="depID" class="" aria-label="Large select example" onChange={(e) => { changeHandelForm(e) }}>
                                            <option value="" selected>Select Department</option>
                                            {
                                                departmentData.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.departmentName}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {applicationTypeForm.depID && applicationTypeForm.depID.length > 0 ? "" : formerr?.depID && (
                                        <span className="errormsg">
                                            {formerr?.depID}
                                        </span>
                                    )}

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
            {/* delete modal */}
            < Modal show={showDltModal} onHide={handleDltClose} backdrop="static">
                <div className="application-box">

                    <div className="login_inner">
                        <div class="login_form ">
                            <h5> <Modal.Header closeButton className="p-0">
                                <Modal.Title>Delete Confirmation!</Modal.Title>
                            </Modal.Header></h5>
                        </div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">Are you sure you want to delete Application <b>{application.name}</b>?</Modal.Body>
                            <Modal.Footer className="p-0">
                                <Button variant="secondary" onClick={handleDltClose}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleDeleteItem} >
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </div>
                    </div>
                </div>
            </Modal >
            {/* Application Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form ">
                            <h5><Modal.Header closeButton className="p-0">
                                <Modal.Title>Update Application Master</Modal.Title>
                            </Modal.Header></h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">

                                <div className="form-bx mb-4">
                                    <p className="form-label">Name</p>
                                    <label>

                                        <input type="text" name="name" className='fomcontrol' placeholder="Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.name} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.name ? (
                                        <span className="errormsg">
                                            {updateerr?.name}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Select Department</p>
                                    <label>

                                        <select name="departmentID" class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.departmentID} >
                                            <option value="" selected>Select Department</option>
                                            {
                                                departmentData.map((item) => {
                                                    return (
                                                        <option value={item.id} selected={item.id === updateData.departmentID ? true : false}>{item.departmentName}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.departmentID ? (
                                        <span className="errormsg">
                                            {updateerr?.departmentID}
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
                                    Submit
                                </Button>
                            </Modal.Footer>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ApplicationTypeTable
