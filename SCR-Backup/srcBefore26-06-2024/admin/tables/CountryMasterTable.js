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

const CountryMasterTable = () => {

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



    // country update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setUpdateData({
            countryCode: '',
            countryName: '',
            status: '',

        })
        setupdateerr('');
    }
    const [updateData, setUpdateData] = useState({
        countryCode: '',
        countryName: '',
        status: '',

    })
    const changeUpdateForm = (e) => {

        const { name, value } = e.target;
        let newErrors = {};

        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const spaceCheck =/\s{2,}/g;
        if (name == "countryCode" && specialChars.test(value)) {
            newErrors.countryCode = "Special characters not allowed";
        } else if (name == "countryCode" && value.charAt(0) === ' ') {
            newErrors.countryCode = "First character cannot be a blank space";
        } else if (name == "countryName" && specialChars.test(value)) {
            newErrors.countryName = "Special characters not allowed";
        } else if (name == "countryName" && value.charAt(0) === ' ') {
            newErrors.countryName = "First character cannot be a blank space";
        }else if (name == "countryName" && spaceCheck.test(value)) {
            newErrors.countryName = "Multiple space not allow";
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
            const response = await fetch(APIURL + 'Admin/GetCountryByID', {
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
            "CountryID": 230,
            "ID": updateID,
            "CountryCode": updateData.countryCode?.toUpperCase(),
            "CountryName": updateData.countryName,
            "Status": updateData.status,
        }

        try {
            if (isUpdateValid()) {
                const response = await fetch(APIURL + 'Admin/UpdateCountry', {
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
                        setSearchText('');
                        setUpdateData({
                            countryCode: '',
                            countryName: '',
                        });
                        setSearchText('');
                        setToastDisplayed(false)
                    }, 2500)
                } else {
                    toast.warning(data.responseMessage)
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
    // country update end

    //countetr list api start
    const table_Data = async () => {
        try {
            const response = await fetch(APIURL + 'Admin/GetAllCountry', {
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
    //countetr list api end
    useEffect(() => {
        table_Data();
    }, [])
    const columns = [

       
        {
            name: 'Country Code',
            selector: row => row.countryCode,
            sortable: true,
            searchable: true,
            width: '30%',
        },
        {
            name: 'Country Name',
            selector: row => row.countryName,
            sortable: true,
            searchable: true,
            width: '40%',
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
                onClick={() => handleUpdate(row.id)}><i className="bi bi-pencil-square"></i></Link>
               

            </>
        },

    ];

    // add country form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setCountryForm({
            countryCode: "",
            title: "",

        })
        setformerr('');
    };

    const handleFormShow = () => setShowForm(true);
    const [countryForm, setCountryForm] = useState(
        {

            countryCode: "",
            title: "",

        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        let newErrors = {};

        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const spaceCheck =/\s{2,}/g;
        if (name == "countryCode" && specialChars.test(value)) {
            newErrors.countryCode = "Special characters not allowed";
        } else if (name == "countryCode" && value.charAt(0) === ' ') {
            newErrors.countryCode = "First character cannot be a blank space";
        } else if (name == "title" && specialChars.test(value)) {
            newErrors.title = "Special characters not allowed";
        } else if (name == "title" && value.charAt(0) === ' ') {
            newErrors.title = "First character cannot be a blank space";
        }else if (name == "title" && spaceCheck.test(value)) {
            newErrors.title = "Multiple space not allow";
        }
        else {
            setCountryForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setformerr(newErrors);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const application_data = {
            "CountryID": 230,
            "CountryCode": countryForm.countryCode?.toUpperCase(),
            "CountryName": countryForm.title,

        }
        const application_data_json = JSON.stringify(application_data);
        try {
            if (isValid()) {
                const application_responce = await fetch(APIURL + 'Admin/AddCountry', {
                    method: "Post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: application_data_json,

                });

                const data = await application_responce.json();
                setToastDisplayed(true)
                if (data.responseCode === '200') {
                    setCountryForm({
                        countryCode: "",
                        title: "",

                    })
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        handleFormClose();
                        setSearchText('');
                        table_Data();
                        setSearchText('');
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

    // add countryr form end

    // validation start
    const isValid = () => {

        const newErrors = {};
        let valid = true

        if (!countryForm.countryCode) {
            newErrors.countryCode = "Country code is required.";
            valid = false
        }
        if (!countryForm.title) {
            newErrors.title = "Country name is required.";
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

        if (!updateData.countryCode) {
            newErrors.countryCode = "Country code is required.";
            valid = false
        }

        if (!updateData.countryName) {
            newErrors.countryName = "Country name is required.";
            valid = false
        }
        setupdateerr(newErrors);
        return valid;


    }

    const filteredData = tableData?.filter(item =>
    (item.countryName?.toLowerCase().includes(searchText?.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchText)) ||
        item.countryCode?.toLowerCase().includes(searchText?.toLowerCase()) ||
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
                                    Add Country
                                </Button>
                            </div>

                        </div>
                    }
                />

            </>


            {/* CountryMaster Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div className="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Country</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">

                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="countryCode" className='fomcontrol text-uppercase' value={countryForm?.countryCode.trim()} placeholder="Country Code" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.countryCode ? (
                                        <span className="errormsg">
                                            {formerr?.countryCode}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="title" className='fomcontrol text-capitalize' value={countryForm.title} placeholder="Country Name" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.title ? (
                                        <span className="errormsg">
                                            {formerr?.title}
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

            {/* CountryMaster Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div className="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Update Country</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">

                                <div className="form-bx mb-4">
                                    <p className="form-label">Country Code</p>
                                    <label>
                                        <input type="text" name="countryCode" className='fomcontrol text-uppercase' value={updateData.countryCode?.trim()} placeholder="Country Code" onChange={(e) => { changeUpdateForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.countryCode ? (
                                        <span className="errormsg">
                                            {updateerr?.countryCode}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Country Name</p>
                                    <label>
                                        <input type="text" name="countryName" className='fomcontrol text-capitalize' placeholder="Country Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.countryName} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.countryName ? (
                                        <span className="errormsg">
                                            {updateerr?.countryName}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Select Status</p>
                                    <label>
                                        <select name="status" className="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData.status}>

                                            <option value="0">Inactive</option>
                                            <option value="1">Active</option>
                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                    {/* {errors === true && !updateData.name ? <small className="errormsg">Name is Required</small> : ''} */}
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

export default CountryMasterTable
