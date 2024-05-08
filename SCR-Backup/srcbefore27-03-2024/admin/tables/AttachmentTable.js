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

    //department Api
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

    // application api start with dpt id start
    const [applicationData, setApplicationData] = useState([])
    const application_Data = async () => {
        const depy_data = {
            "DepartmentID": attachmentForm.depID ? attachmentForm.depID : updateData?.departmentID
            // "DepartmentID": attachmentForm.depID
        }
        const application_data_json = JSON.stringify(depy_data);
        
        try {
            const response = await fetch(APIURL + 'Master/GetApplicationTypesByDepartmentID', {
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
            setApplicationData(data.responseData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    
    // application api start with dpt id end

    // application data start
    // const [applicationData, setApplicationData] = useState([])
    // const application_Data = async () => {
    //     try {
    //         const response = await fetch(APIURL + 'Admin/GetAllApplicationType', {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         const data = await response.json();
    //         setApplicationData(data.responseData)

    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }

    // }
    // application data end 


    // Attachment update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setUpdateData({
            name: '',
            applicationTypeID: "",
            applicationSubTypeID: "",
            status: '',
        })
        setupdateerr('');
    }

    const [updateData, setUpdateData] = useState({

        name: '',
        departmentID: '',
        applicationTypeID: "",
        applicationSubTypeID: "",
        status: '',

    })
    const changeUpdateForm = (e) => {
        const { name, value } = e.target;
        if (name == "departmentID") {
            updateData.applicationTypeID = ""
        }
        if (name == "applicationTypeID") {
            updateData.applicationSubTypeID = ""
        }
        let newErrors = {};

        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "name" && specialChars.test(value)) {
            newErrors.name = "Special characters not allowed";
        } else if (name == "name" && value.charAt(0) === ' ') {
            newErrors.name = "First character cannot be a blank space";
        } else if (name == "name" && spaceCheck.test(value)) {
            newErrors.name = "Multiple space not allow";
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

        const updateValue = {
            "ID": updateID,
            "Name": updateData.name,
            "ApplicationTypeID": updateData.applicationTypeID,
            "ApplicationSubTypeID": updateData.applicationSubTypeID ? updateData.applicationSubTypeID : "0",
            //  "ApplicationSubTypeID": updateData.applicationSubTypeID,
            "Status": updateData.status
        }
        try {
            if (isUpdateValid()) {
                const response = await fetch(APIURL + 'Admin/UpdateAttachment', {
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
                        setUpdateData({
                            name: '',
                            applicationTypeID: "",
                            applicationSubTypeID: "",

                        })
                        setSearchText('');
                        UpdateModalClose();
                        table_Data();
                        setToastDisplayed(false)
                    }, 2500)
                }
                else {
                    toast.warning(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {

                        setToastDisplayed(false)
                    }, 2500)
                }

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    // Attachment update end
    // depID on CLick
    const [tabDepId, setTabDepId] = useState("1");

    const handleClickTag = (id) => {
        setTabDepId(id)

    }

    // Attachment list api start
    const table_Data = async () => {
        const deptID = {
            "DepartmentID": tabDepId
        }
        try {
            const response = await fetch(APIURL + 'Admin/GetAllAttachment', {
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
    // Attachment list api end
    const columns = [
        {
            name: 'Attachment Name',
            selector: row => row.name,
            sortable: true,
            searchable: true,
            width: '20%',
        },

        {
            name: 'Application Category Name',
            selector: row => row.applicationTypeName,
            sortable: true,
            searchable: true,
            width: '30%',
        },
        {
            name: 'Application Sub Category Name',
            selector: function (row) {
                return row.applicationSubTypeName ? row.applicationSubTypeName : "_";
            },
            sortable: true,
            searchable: true,
            width: '30%',
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

            </>
        },
    ];
    // Attachment form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setAttachmentForm({
            name: '',
            ApplicationTypeID: '',
            ApplicationSubTypeID: ''
        })
        setformerr('');
    };
    const handleFormShow = () => setShowForm(true);
    const [attachmentForm, setAttachmentForm] = useState(
        {
            name: '',
            depID: '',
            ApplicationTypeID: '',
            ApplicationSubTypeID: ''
        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;

        if (name == "depID") {
            attachmentForm.ApplicationTypeID = ""
        } else if (name == "ApplicationTypeID") {
            attachmentForm.ApplicationSubTypeID = ""
        }
        let newErrors = {};
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "name" && specialChars.test(value)) {
            newErrors.name = "Special characters not allowed";
        } else if (name == "name" && value.charAt(0) === ' ') {
            newErrors.name = "First character cannot be a blank space";
        } else if (name == "name" && spaceCheck.test(value)) {
            newErrors.name = "Multiple space not allow";
        }
        else {

            setAttachmentForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setformerr(newErrors);

    }

    // subapplication api witch application id start
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


    // subapplication api witch application id start

    //add attachment api start
    const handleSubmit = async (e) => {
        e.preventDefault();
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
                setToastDisplayed(true)
                if (data.responseCode === '200') {
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        setAttachmentForm({
                            name: '',
                            ApplicationTypeID: '',
                            ApplicationSubTypeID: ''
                        })
                        handleFormClose();
                        table_Data();
                        setSearchText('');
                        setToastDisplayed(false);
                    }, 2500)

                } else {
                    setToastDisplayed(true)
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
    //add attachment api end
    // Validation start
    const isValid = () => {
        const newErrors = {};
        let valid = true

        if (!attachmentForm.name) {
            newErrors.name = "Attachment name is required.";
            valid = false
        }
        if (!attachmentForm.depID) {
            newErrors.depID = "Please select department.";
            valid = false
        }
        if (!attachmentForm.ApplicationTypeID) {
            newErrors.ApplicationTypeID = "Please select application category name.";
            valid = false
        }
        if (subApplicationData !== null && !attachmentForm.ApplicationSubTypeID) {
            newErrors.ApplicationSubTypeID = "Please select application sub category name.";
            valid = false
        }
        // if (!attachmentForm.ApplicationSubTypeID) {
        //     newErrors.ApplicationSubTypeID = "Please select sub application";
        //     valid = false
        // }

        setformerr(newErrors);
        return valid;


    }

    // validation update start
    const isUpdateValid = () => {

        const newErrors = {};
        let valid = true

        if (!updateData.name) {
            newErrors.name = "Attachment name is required.";
            valid = false
        }
        if (!updateData.departmentID) {
            newErrors.departmentID = "Please select department.";
            valid = false
        }
        if (!updateData.applicationTypeID) {
            newErrors.applicationTypeID = "Please select application category name.";
            valid = false
        }
        if (subApplicationData !== null && !updateData.applicationSubTypeID) {
            newErrors.applicationSubTypeID = "Please select application sub category name.";
            valid = false
        }
        // if (!updateData.applicationSubTypeID) {
        //     newErrors.applicationSubTypeID = "Please select sub application";
        //     valid = false
        // }
        setupdateerr(newErrors);
        return valid;
    }



    // validation end

    const filteredData = tableData?.filter(item =>
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
    }, [attachmentForm.depID, updateData.departmentID, attachmentForm.ApplicationTypeID, updateData.applicationTypeID, tabDepId])

    return (
        <>
            <>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    defaultSortFieldId={1}
                    defaultSortAsc={true}
                    pagination
                    persistTableHead={true}
                    highlightOnHover
                    paginationRowsPerPageOptions={[10, 50, 100]}
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
                                        Add Attachment
                                    </Button>
                                </div>

                            </div>
                            <div className="application-tab w-100 mt-4">
                                <ul class="nav nav-pills mb-3">
                                    <li class="nav-item">
                                        <a class={tabDepId == 1 ? "nav-link active" : "nav-link"} onClick={(e) => handleClickTag(1)}>Exports</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class={tabDepId == 2 ? "nav-link active" : "nav-link"} onClick={(e) => handleClickTag(2)}>Imports</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class={tabDepId == 3 ? "nav-link active" : "nav-link"} onClick={(e) => handleClickTag(3)}>Foreign Investments</a>
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
                                        <input type="text" name="name" className='fomcontrol text-capitalize' value={attachmentForm?.name} placeholder="Attachment Name" onChange={(e) => { changeHandelForm(e) }} required />
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
                                                departmentData?.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.departmentName}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.depID ? (
                                        <span className="errormsg">
                                            {formerr?.depID}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <select name="ApplicationTypeID" class="" aria-label="Large select example" onChange={(e) => { changeHandelForm(e) }} value={attachmentForm.ApplicationTypeID}>
                                            <option value="" selected>Select Application Category Name</option>
                                            {attachmentForm.depID && (
                                                applicationData?.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            )}
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
                                            <option value="" selected>Select Application Sub Category Name</option>
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

            {/* Attachment Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Update Attachment</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">


                                <div className="form-bx mb-4">
                                    <p className="form-label">Attachment Name</p>
                                    <label>
                                        <input type="text" name="name" className='fomcontrol text-capitalize' placeholder="Attachment Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.name} />
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
                                        <select name="departmentID" disabled class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData?.departmentID}>
                                            <option value="" selected>Select Department</option>
                                            {
                                                departmentData?.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.departmentName}</option>
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
                                    <p className="form-label">Select Application Category Name</p>
                                    <label>
                                        <select name="applicationTypeID" disabled class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData.applicationTypeID}>
                                            <option value="" selected>Select Application Category Name</option>
                                            {updateData?.departmentID && (
                                                applicationData?.map((item) => {
                                                    return (
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            )}


                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.applicationTypeID ? (
                                        <span className="errormsg">
                                            {updateerr?.applicationTypeID}
                                        </span>
                                    ) : ""}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Select Application Sub Category Name</p>
                                    <label>
                                        <select name="applicationSubTypeID" disabled class="" aria-label="Large select example" value={updateData?.applicationSubTypeID} onChange={(e) => { changeUpdateForm(e) }} >
                                            <option value="" selected>Select Application Sub Category Name</option>
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
                                    {updateerr?.applicationSubTypeID ? (
                                        <span className="errormsg">
                                            {updateerr?.applicationSubTypeID}
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

export default AttachmentTable
