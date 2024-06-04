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

const SubApplicationTypeTable = () => {

    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState([]);
    const [toastDisplayed, setToastDisplayed] = useState(false);
    const [formerr, setformerr] = useState();
    const [updateerr, setupdateerr] = useState();
    const csvLinkRef = useRef();

    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };



    const [updateData, setUpdateData] = useState({

        name: '',
        departmentID: '',
        applicationTypeID: "",
        status: '',

    })
    const [applicationSubTypeForm, setApplicationSubTypeForm] = useState(
        {
            name: '',
            depID: '',
            ApplicationTypeID: '',
        }
    )


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
            "DepartmentID": applicationSubTypeForm.depID ? applicationSubTypeForm.depID : updateData?.departmentID
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

    // sub application update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setUpdateData({

            name: '',
            departmentID: '',
            applicationTypeID: "",
            status: '',

        });
        setupdateerr('');
    }

    const changeUpdateForm = (e) => {


        const { name, value } = e.target;
        if (name === "departmentID") {
            updateData.applicationTypeID = "";
        }
        let newErrors = {};
        const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        // const specialChars = /[^\w\s&,_%-]/;
        const specialChars = /[^\w\s&,-]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "name" && specialChars.test(value)) {
            newErrors.name = "Special characters not allowed.";
        } else if (name == "name" && value.charAt(0) === ' ') {
            newErrors.name = "First character cannot be a blank space.";
        } else if (spaceCheck.test(value)) {
            newErrors.name = "Multiple space not allow.";
        }else if (name == "name" && (specialCharsOLD.test(value.charAt(0)))) {
            newErrors.name = "First special character is not allowed.";
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
            const response = await fetch(APIURL + 'Admin/GetSubApplicationTypeByID', {
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
            "ApplicationTypeID": updateData.applicationTypeID,
            "Status": updateData.status
        }

        try {

            if (isUpdateValid()) {
                const response = await fetch(APIURL + 'Admin/UpdateSubApplicationType', {
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
                            name: '',
                            departmentID: '',
                            applicationTypeID: "",
                        });
                        setSearchText('');
                        setToastDisplayed(false)
                    }, 2500)
                }
                else {
                    toast.warning(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {

                        table_Data();

                        setToastDisplayed(false)
                    }, 2500)
                }
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    // sub application update end
    // depID on CLick
    const [tabDepId, setTabDepId] = useState("1");

    const handleClickTag = (id) => {
        setTabDepId(id)

    }
    

    // sub application list api start
    const table_Data = async () => {
        const deptID = {
            "DepartmentID": tabDepId
        }
       
        try {
            const response = await fetch(APIURL + 'Admin/GetAllSubApplicationType', {
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

    // sub application list api end
    const columns = [
        {
            name: 'Application Sub Category Name',
            selector: row => row.name,
            sortable: true,
            searchable: true,
            width: '40%',
        },

        {
            name: 'Application Category Name',
            selector: row => row.applicationTypeName,
            sortable: true,
            searchable: true,
            width: '40%',
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


    // add subapplication form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setApplicationSubTypeForm({
            name: '',
            depID: '',
            ApplicationTypeID: '',
        })
        setformerr('');
    };
    const handleFormShow = () => setShowForm(true);
    const changeHandelForm = (e) => {
        const { name, value } = e.target;

               
        if (name == "depID") {
            applicationSubTypeForm.ApplicationTypeID = ""
        }
        const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        let newErrors = {};
    //  const specialChars = /[^\w\s&,_%-]/;
    const specialChars = /[^\w\s&,-]/;
//  console.log("98989898",value.length == 1);
        const spaceCheck = /\s{2,}/g;
        if (name == "name" && specialChars.test(value)) {
            newErrors.name = "Special characters not allowed.";
        }else if (name == "name" && value.charAt(0) === ' ') {
            newErrors.name = "First character cannot be a blank space.";
        } else if (spaceCheck.test(value)) {
            newErrors.name = "Multiple space not allow.";
        }else if (name == "name" && (specialCharsOLD.test(value.charAt(0)))) {
           
            newErrors.name = "First special character is not allowed.";
        }
        else {

            setApplicationSubTypeForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setformerr(newErrors);

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const application_data = {
            "Name": applicationSubTypeForm.name,
            "ApplicationTypeID": applicationSubTypeForm.ApplicationTypeID
        }

        const application_data_json = JSON.stringify(application_data);
        try {
            if (isValid()) {
                const application_responce = await fetch(APIURL + 'Admin/AddSubApplicationType', {
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
                        handleFormClose();
                        table_Data();
                        setToastDisplayed(false);
                        setSearchText('');
                        setApplicationSubTypeForm({
                            name: '',
                            depID: '',
                            ApplicationTypeID: '',
                        })

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
    // add subapplication form end
    useEffect(() => {
        table_Data();
        departmentApi();
        application_Data();
    }, [applicationSubTypeForm.depID, updateData.departmentID, tabDepId])

    // validation start
    const isValid = () => {
        const newErrors = {};
        let valid = true

        if (!applicationSubTypeForm.name) {
            newErrors.name = "Application sub category name is required.";
            valid = false
        }
        if (!applicationSubTypeForm.depID) {
            newErrors.depID = "Please select department.";
            valid = false
        }

        if (!applicationSubTypeForm.ApplicationTypeID) {
            newErrors.ApplicationTypeID = "Please select application category name.";
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

        if (!updateData.name) {
            newErrors.name = "Application sub category name is required.";
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

        setupdateerr(newErrors);
        return valid;


    }
    // validation end
    // applicationtype update end 

 
    const filteredData = tableData?.filter(item =>
    (item?.name?.toLowerCase().includes(searchText?.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchText)) ||
        item?.departmentName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.applicationTypeName?.toLowerCase().includes(searchText.toLowerCase()) ||
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
                    persistTableHead={true}
                    defaultSortFieldId={1}
                    defaultSortAsc={true}
                    pagination
                    paginationRowsPerPageOptions={[10, 50, 100]}
                    highlightOnHover
                    dense
                    striped
                    fixedHeader 
                    // noDataComponent="Text msg here" 
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
                                        Add Application Sub Category
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

            {/* Application subType Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Application Sub Category</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="name" className='fomcontrol text-capitalize' value={applicationSubTypeForm?.name} placeholder="Application Sub Category Name" onChange={(e) => { changeHandelForm(e) }} onKeyDown={(e) => {
                                            if (e.key === "_") {
                                                e.preventDefault();
                                            }
                                        }}  required />
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
                                        <select name="ApplicationTypeID" value={applicationSubTypeForm.ApplicationTypeID} class="" aria-label="Large select example" onChange={(e) => { changeHandelForm(e) }}>
                                            <option value="" selected>Select Application Category Name</option>
                                            {applicationSubTypeForm.depID && (
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

            {/* Application Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title> Update Application Sub Category</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <p className="form-label">Application Sub Category Name</p>
                                    <label>
                                        <input type="text" name="name" className='fomcontrol text-capitalize' placeholder="Application Sub Category Name" onChange={(e) => { changeUpdateForm(e) }} onKeyDown={(e) => {
                                            if (e.key === "_") {
                                                e.preventDefault();
                                            }
                                        }} required value={updateData.name} />
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
                                        <select name="departmentID" class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData?.departmentID} disabled>
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
                                        <select name="applicationTypeID" class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData?.applicationTypeID} disabled>
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

export default SubApplicationTypeTable
