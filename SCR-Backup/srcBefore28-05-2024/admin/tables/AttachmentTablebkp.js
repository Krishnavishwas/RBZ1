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

const AttachmentTable = () => {

    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState([]);
    const [toastDisplayed, setToastDisplayed] = useState(false);
    const [formerr, setformerr] = useState();
    const [updateerr, setupdateerr] = useState();
    const [errors, setErrors] = useState(false);
    const csvLinkRef = useRef();

    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };

    const [showDltModal, setShowDltModal] = useState(false);
    const handleDltClose = () => setShowDltModal(false);

    const [attachment, setAttachment] = useState({
        name: '',
        id: ''
    });

    // application data start
    const [applicationData, setApplicationData] = useState([])
    const application_Data = async () => {
        try {
            const response = await fetch(APIURL + 'Admin/GetAllApplicationType', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setApplicationData(data.responseData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    // application data end 

    const handleDeleteShow = (id, name) => {
        alert(id)
        setShowDltModal(true);
        setAttachment({
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
            "id": attachment.id,
            "Status": 90
        }
        try {
            const responce = await fetch(APIURL + 'Admin/DeleteAttachment', {
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

    // Attachment update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setupdateerr('');
    }
    // const updateModalShow = () => setShowUpdateModal(true);
    const [updateData, setUpdateData] = useState({

        name: '',
        applicationTypeID: "",
        applicationSubTypeID: "",
        status: '',

    })
    const changeUpdateForm = (e) => {
        const { name, value } = e.target;
        console.log("value", value);
        setUpdateData((prevState) => ({
            ...prevState,
            [name]: value

        }));

    }

    const [updateID, setUpdateID] = useState("")
    const handleUpdate = async (id) => {
        setShowUpdateModal(true);
        setUpdateID(id)
        const TableId = {
            "id": id
        }

        try {
            const response = await fetch(APIURL + 'Admin/GetAttachmentByID', {
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
        const validationErrors = isUpdateValid();

        if (validationErrors && Object.keys(validationErrors)?.length === 0) {
            // Form is valid, handle form submission here
            console.log("Form submitted successfully!");
        } else {
            // Form is invalid, display validation errors
            console.log("Validation Errors:", errors);
            setErrors(validationErrors);

            return false;
        }
        const updateValue = {
            "ID": updateID,
            "Name": updateData.name,
            "ApplicationTypeID": updateData.applicationTypeID,
            "ApplicationSubTypeID": updateData.applicationSubTypeID ? updateData.applicationSubTypeID : "0",
            "Status": updateData.status
        }
        try {

            const response = await fetch(APIURL + 'Admin/UpdateAttachment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateValue)
            });

            const data = await response.json();
            if (data.responseCode === '200') {

                setToastDisplayed(true)
                toast.success(data.responseMessage, { autoClose: 2000 })
                setTimeout(() => {
                    setUpdateData({
                        name: '',
                        applicationTypeID: "",
                        applicationSubTypeID: "",
                        status: '',
                    })
                    UpdateModalClose();
                    table_Data();
                    setToastDisplayed(false)
                }, 2500)
            }
            else {
                toast.warning(data.responseMessage, { autoClose: 2000 })
            }


        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    // Attachment update end
    const table_Data = async () => {
        try {
            const response = await fetch(APIURL + 'Admin/GetAllAttachment', {
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
    const columns = [

        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'Application',
            selector: row => row.applicationTypeName,
            sortable: true,
            searchable: true,
            width: '25%',
        },
        {
            name: 'Sub Application',
            selector: function (row) {
                return row.applicationSubTypeName ? row.applicationSubTypeName : "_";
            },
            sortable: true,
            searchable: true,
            width: '25%',
        },
        {
            name: 'Attachment Name',
            selector: row => row.name,
            sortable: true,
            searchable: true,
            width: '20%',
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            searchable: true,
            width: '10%',
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
    // Attachment form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setformerr('');
    };
    const handleFormShow = () => setShowForm(true);
    const [attachmentForm, setAttachmentForm] = useState(
        {
            name: '',
            ApplicationTypeID: '',
            ApplicationSubTypeID: ''
        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        let newErrors = {};
        // if (name == "ApplicationTypeID") {
        //     attachmentForm.ApplicationSubTypeID = ""
        // }
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        if (name == "name" && specialChars.test(value)) {
            newErrors.name = "Special characters not allowed";
        }

        else if (name == "name" && value.charAt(0) === ' ') {
            newErrors.name = "First character cannot be a blank space";
        }
        else {

            setAttachmentForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setformerr(newErrors);
       
        // subApplication_Data()
    }
    // subapplication data start
    const [subApplicationData, setSubApplicationData] = useState([])
    const subApplication_Data = async () => {
        const application_data = {
            "ID": attachmentForm.ApplicationTypeID ? attachmentForm.ApplicationTypeID : updateData.applicationTypeID
        }
        const application_data_json = JSON.stringify(application_data);

        try {
            const response = await fetch(APIURL + 'Admin/GetSubApplicationTypeByApplicationTypeID', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: application_data_json
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSubApplicationData(data.responseData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    // subapplication data end 
    const handleSubmit = async (e) => {
        e.preventDefault();
        // check validation
       

       
        const application_data = {
            "Name": attachmentForm.name,
            "ApplicationTypeID": attachmentForm.ApplicationTypeID,
            "ApplicationSubTypeID": attachmentForm.ApplicationSubTypeID ? attachmentForm.ApplicationSubTypeID : "0"
        }
        const application_data_json = JSON.stringify(application_data);
        try {
            if (isValid()) {
            const application_responce = await fetch(APIURL + 'Admin/AddAttachment', {
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
                    setAttachmentForm({
                        name: '',
                        ApplicationTypeID: '',
                        ApplicationSubTypeID: ''
                    })
                    handleFormClose();
                    table_Data();
                    setToastDisplayed(false);
                }, 2500)

            } else {
                setToastDisplayed(true)
                toast.warning(data.responseMessage, { autoClose: 2000 })
                setTimeout(() => {
                    handleFormClose();
                    table_Data();
                    setToastDisplayed(false);
                }, 2500)
            }
        }
        } catch (error) {
            console.log("Fetching Error", error)
        }
    };

    // Validation start
    const isValid = () => {
        const newErrors = {};
        let valid = true

        if (!attachmentForm.name) {
            newErrors.name = "Name is required";
            valid = false
        }
        if (!attachmentForm.ApplicationTypeID) {
            newErrors.ApplicationTypeID = "Please select application";
            valid = false
        }

        if (!attachmentForm.ApplicationSubTypeID) {
            newErrors.ApplicationSubTypeID = "Please select sub application";
            valid = false
        }

        setformerr(newErrors);
        return valid;


    }
    // update validatiom
    const isUpdateValid = () => {
        let errors = {};


        if (!updateData.name) {
            errors.name = "Name is required";
        }
        if (!updateData.applicationTypeID) {
            errors.applicationTypeID = "Please select application";
        }
        if (subApplicationData !== null && updateData.applicationSubTypeID?.length == 0) {
            errors.applicationSubTypeID = "Please select Subapplication";
        }

        return errors;
    }
    // validation end

    const filteredData = tableData.filter(item =>
    (item.name?.toLowerCase().includes(searchText?.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchText)) ||
        item.applicationTypeName?.toLowerCase().includes(searchText?.toLowerCase()) ||
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
    useEffect(() => {
        table_Data();
        departmentApi();
        application_Data();
        subApplication_Data();

    }, [attachmentForm.ApplicationTypeID, updateData.applicationTypeID])


    return (
        <>
            <>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    defaultSortFieldId={1}
                    defaultSortAsc={true}
                    pagination
                    highlightOnHover
                    paginationRowsPerPageOptions={[10, 50, 100]}
                    dense
                    striped
                    fixedHeader
                    subHeader
                    subHeaderComponent={
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
                                    Add Attachment
                                </Button>
                            </div>

                        </div>
                    }
                />

            </>


            {/* Attachment  Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Attachment</Modal.Title>
                            </Modal.Header>
                        </h5></div>
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
                                        <select name="ApplicationTypeID" class="" aria-label="Large select example" onChange={(e) => { changeHandelForm(e) }} value={attachmentForm.ApplicationTypeID}>
                                            <option value="" selected>Select Application</option>
                                            {
                                                applicationData.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.ApplicationTypeID ? (
                                        <span className="errormsg">
                                            {formerr?.ApplicationTypeID}
                                        </span>
                                    ) : ""}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <select name="ApplicationSubTypeID" class="" aria-label="Large select example" onChange={(e) => { changeHandelForm(e) }} value={attachmentForm.ApplicationSubTypeID}>
                                            <option value="" selected>Select Sub Application</option>
                                            {attachmentForm.ApplicationTypeID && subApplicationData && subApplicationData.length > 0 && (
                                                subApplicationData.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.ApplicationSubTypeID ? (
                                        <span className="errormsg">
                                            {formerr?.ApplicationSubTypeID}
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
            {/* delete modal */}
            < Modal show={showDltModal} onHide={handleDltClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Delete Confirmation!</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body>Are you sure you want to delete  Attachment <b>{attachment.name}</b>?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleDltClose}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleDeleteItem}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </div>
                    </div>
                </div>
            </Modal >
            {/* Attachment Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title> Update Attachment</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">


                                <div className="form-bx mb-4">
                                    <p className="form-label">Name</p>
                                    <label>
                                        <input type="text" name="name" className='fomcontrol' placeholder="Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.name} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateData?.name && updateData?.name.length > 0 ? "" : errors?.name && (
                                        <span className="errormsg">
                                            {errors?.name}
                                        </span>
                                    )}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Select Application</p>
                                    <label>
                                        <select name="applicationTypeID" class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData.applicationTypeID}>
                                            <option value="" selected>Select Application</option>
                                            {
                                                applicationData.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }


                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {updateData.applicationTypeID && updateData.applicationTypeID.length > 0 ? "" : errors?.applicationTypeID && (
                                        <span className="errormsg">
                                            {errors?.applicationTypeID}
                                        </span>
                                    )}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Select Sub Application</p>
                                    <label>
                                        <select name="applicationSubTypeID" class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData.applicationSubTypeID}>
                                            <option value="" selected>Select Sub Application</option>
                                            {updateData.applicationTypeID && subApplicationData && subApplicationData.length > 0 && (
                                                subApplicationData.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))
                                            )}

                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {updateData.applicationSubTypeID && updateData.applicationSubTypeID.length > 0 ? "" : errors?.applicationSubTypeID && (
                                        <span className="errormsg">
                                            {errors?.applicationSubTypeID}
                                        </span>
                                    )}
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

export default AttachmentTable
