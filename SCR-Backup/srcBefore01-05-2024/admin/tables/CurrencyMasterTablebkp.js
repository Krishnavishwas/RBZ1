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

const CurrencyMasterTable = () => {

    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState([]);
    const [rateerr, setrateerr] = useState('')
    const [toastDisplayed, setToastDisplayed] = useState(false);
    const [formerr, setformerr] = useState();
    const [updateerr, setupdateerr] = useState();
    const csvLinkRef = useRef();
    const [errors, setErrors] = useState(false);
    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };

    const [showDltModal, setShowDltModal] = useState(false);
    const handleDltClose = () => setShowDltModal(false);

    const [currencyMaster, setCurrencyMaster] = useState({
        id: '',
        name: '',

    });
    const handleDeleteShow = (id, name) => {
        setShowDltModal(true);
        setCurrencyMaster({
            id: id,
            name: name

        });
    }

    const handleDeleteItem = async () => {
        const table_id = {
            "id": currencyMaster.id,
            "Status": 90
        }
        try {
            const responce = await fetch(APIURL + 'Admin/DeleteCurrency', {
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
        setErrors(false);
        setrateerr("")
    }
    // const updateModalShow = () => setShowUpdateModal(true);
    const [updateData, setUpdateData] = useState({
        currencyCode: '',
        currencyName: '',
        currencyRate: "",
        status: '',

    })
    const changeUpdateForm = (e) => {

        const { name, value } = e.target;
        let newErrors = {};

        const specialChars = /[!@#$%^&*(),.?":{}|<>]/;

        if (name == "currencyCode" && specialChars.test(value)) {
            newErrors.currencyCode = "Special characters not allowed";
        }

        else if (name == "currencyCode" && value.charAt(0) === ' ') {
            newErrors.currencyCode = "First character cannot be a blank space";
        }
        else if (name == "currencyName" && specialChars.test(value)) {
            newErrors.currencyName = "Special characters not allowed";
        }

        else if (name == "currencyName" && value.charAt(0) === ' ') {
            newErrors.currencyName = "First character cannot be a blank space";
        }
        else if (name == "currencyRate" && specialChars.test(value)) {
            newErrors.currencyRate = "Special characters not allowed";
        }

        else if (name == "currencyRate" && value.charAt(0) === ' ') {
            newErrors.currencyRate = "First character cannot be a blank space";
        }
        else if(name === 'currencyRate' && (value < 0)){
            newErrors.currencyRate = "Please enter greater than 0";
        }
        else {

            setUpdateData((prevState) => ({
                ...prevState,
                [name]: value
    
            }));
        }
        setupdateerr(newErrors);
        // if (name === 'currencyRate' && (value < 0)) {

        //     setrateerr("Please enter greater than 0")
        // }
        // else {
        //     setrateerr("")
        // }

       
    }
    const [updateID, setUpdateID] = useState("")
    const handleUpdate = async (id) => {
        setShowUpdateModal(true);
        setUpdateID(id)
        const TableId = {
            "id": id
        }

        try {
            const response = await fetch(APIURL + 'Admin/GetCurrencyByID', {
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
            "CurrencyCode": updateData.currencyCode,
            "CurrencyName": updateData.currencyName,
            "CurrencyRate": updateData.currencyRate,
            "Status": updateData.status,
        }

        try {
            if (isUpdateValid()) {
            // if (updateData.currencyCode !== "" && updateData.currencyName !== "" && updateData.currencyRate !== "" && updateData.currencyRate > 0) {
                const response = await fetch(APIURL + 'Admin/UpdateCurrency', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateValue)
                });

                const data = await response.json();
                if (data.responseCode === '200') {
                    setUpdateData({
                        currencyCode: '',
                        currencyName: '',
                        currencyRate: "",
                        status: '',

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
                }
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    // applicationtype update end
    const table_Data = async () => {
        try {
            const response = await fetch(APIURL + 'Admin/GetAllCurrency', {
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
    useEffect(() => {
        table_Data();
    }, [])
    const columns = [

        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'Title',
            selector: row => row.currencyCode,
            sortable: true,
            searchable: true,
            width: '20%',
        },
        {
            name: 'Currency',
            selector: row => row.currencyName,
            sortable: true,
            searchable: true,
            width: '25%',
        },
        {
            name: 'Rate',
            selector: row => row.currencyRate,
            sortable: true,
            searchable: true,
            width: '20%',
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
                onClick={() => handleUpdate(row.id)}><i class="bi bi-pencil-square"></i></Link>
                {/* <Link to="" className=""
                    onClick={() => handleDeleteShow(row.id, row.currencyName)}><i class="bi bi-trash"></i></Link> */}

            </>
        },

    ];


    // Sector Master form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
      
        setformerr('');
    };
    const handleFormShow = () => setShowForm(true);

    const [currencyForm, setCurrencyForm] = useState(
        {
            title: "",
            currencyName: "",
            rate: "",
        }
    )

    console.log("currencyForm", currencyForm)

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        console.log("name-----", name)
        let newErrors = {}; 

        const specialChars = /[!@#$%^&*(),.?":{}|<>]/;

        if (name == "title" && specialChars.test(value)) {
            newErrors.title = "Special characters not allowed";
        }

        else if (name == "title" && value.charAt(0) === ' ') {
            newErrors.title = "First character cannot be a blank space";
        }
        else if (name == "currencyName" && specialChars.test(value)) {
            newErrors.currencyName = "Special characters not allowed";
        }

        else if (name == "currencyName" && value.charAt(0) === ' ') {
            newErrors.currencyName = "First character cannot be a blank space";
        }
        
 
        else if (name === 'rate' && (value <= 0)) {
            newErrors.rate = "Please enter greater than 0";
        } 
        else {

            setCurrencyForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setformerr(newErrors);




        // if (name === 'rate' && (value <= 0)) {

        //     setrateerr("Please enter greater than 0")
        // }
        // else {
        //     setrateerr("")
        // }

    }

    console.log("formerr", formerr)
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const application_data = {
            "CurrencyCode": currencyForm.title,
            "CurrencyName": currencyForm.currencyName,
            "CurrencyRate": currencyForm.rate
        }
        const application_data_json = JSON.stringify(application_data);
        try {
            if (isValid()) {
                // if (currencyForm.title !== "" && currencyForm.currencyName !== "" && currencyForm.rate !== "" && currencyForm.rate > 0) {
                const application_responce = await fetch(APIURL + 'Admin/AddCurrency', {
                    method: "Post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: application_data_json,

                });

                const data = await application_responce.json();
                if (data.responseCode === '200') {
                    setCurrencyForm({
                        title: "",
                        currencyName: "",
                        rate: "",
                    });

                    setToastDisplayed(true)
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        handleFormClose();
                        table_Data();
                        setToastDisplayed(false);
                    }, 2500)

                }
                else {

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

    // Sector Master form end
    // validation start
    const isValid = () => {
        const newErrors = {};
        let valid = true
        if (!currencyForm.title) {
            newErrors.title = "Title is required";
            valid = false
        }
        if (!currencyForm.currencyName) {
            newErrors.currencyName = "Currency name is required";
            valid = false
        }

        if (!currencyForm.rate  ) {
            newErrors.rate = "Currency rate is required";
            valid = false
        } else if(currencyForm.rate < 0){
            newErrors.rate = "Please enter greater than 0";
            valid = false
        }
        setformerr(newErrors);
        return valid;


    }

    // validation update start
    const isUpdateValid = () => {
        const newErrors = {};
        let valid = true

        if (!updateData.currencyCode) {
            newErrors.currencyCode = "Title is required";
            valid = false
        }

        if (!updateData.currencyName) {
            newErrors.currencyName = "Currency name is required";
            valid = false
        }
        if (!updateData.currencyRate) {
            newErrors.currencyRate = "Rate is required";
            valid = false
        }
        setupdateerr(newErrors);
        return valid;


    }
    // validation end
    // validation end

    const filteredData = tableData.filter(item => item.currencyName?.toLowerCase().includes(searchText?.toLowerCase()) ||
        item.currencyCode?.toLowerCase().includes(searchText?.toLowerCase())

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
                    className="customTable"
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
                                    Add Currency
                                </Button>
                            </div>

                        </div>
                    }
                />

            </>


            {/* currencyMaster Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Currency Master</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="title" className='fomcontrol' value={currencyForm.title} placeholder="Title" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.title && (
                                        <span className="errormsg">
                                            {formerr?.title}
                                        </span>
                                    )}

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="currencyName" className='fomcontrol' value={currencyForm.currencyName} placeholder="Currency name" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.currencyName && (
                                        <span className="errormsg">
                                            {formerr?.currencyName}
                                        </span>
                                    )}

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="number" name="rate" min="1" className='fomcontrol' placeholder="Rate" 
                                         onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.rate ? (
                                        <span className="errormsg">
                                            {formerr?.rate}
                                        </span>
                                    ): ""}

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
            {/* currencyMaster delete modal */}
            < Modal show={showDltModal} onHide={handleDltClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Delete Confirmation!</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">

                            <Modal.Body>Are you sure you want to delete Currency <b>{currencyMaster.name}</b>?</Modal.Body>
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
            {/* currencyMaster Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Update Currency Master</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <p className="form-label">Title</p>
                                    <label>
                                        <input type="text" name="currencyCode" className='fomcontrol' placeholder="Title" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.currencyCode} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.currencyCode && (
                                        <span className="errormsg">
                                            {updateerr?.currencyCode}
                                        </span>
                                    )}
                                    
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Currency Name</p>
                                    <label>
                                        <input type="text" name="currencyName" className='fomcontrol' placeholder="Currency Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.currencyName} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.currencyName && (
                                        <span className="errormsg">
                                            {updateerr?.currencyName}
                                        </span>
                                    )}
                                    
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Currency Rate</p>
                                    <label>
                                        <input type="number" name="currencyRate" className={errors === true && !updateData.currencyRate ? 'error' : 'fomcontrol'} placeholder="Currency Rate" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.currencyRate} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.currencyRate && (
                                        <span className="errormsg">
                                            {updateerr?.currencyRate}
                                        </span>
                                    )}
                                    {/* {errors === true && !updateData.currencyRate ? <small class="errormsg">Currency rate is required</small> :
                                        rateerr ? <small class="errormsg">{rateerr} </small> : ''} */}
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

export default CurrencyMasterTable
