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
    const csvLinkRef = useRef();
    const [errors, setErrors] = useState(false);
    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };

    const [showDltModal, setShowDltModal] = useState(false);
    const handleDltClose = () => setShowDltModal(false);

    const [countryMaster, setCountryMaster] = useState({
        id: '',
        name: '',

    });
    const handleDeleteShow = (id, name) => {
        setShowDltModal(true);
        setCountryMaster({
            id: id,
            name: name

        });
    }

    const handleDeleteItem = async () => {
        const table_id = {
            "id": countryMaster.id,
            "Status": 90
        }
        try {
            const responce = await fetch(APIURL + 'Admin/DeleteCountry', {
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
    const UpdateModalClose = () => setShowUpdateModal(false);
    // const updateModalShow = () => setShowUpdateModal(true);
    const [updateData, setUpdateData] = useState({
        countryCode: '',
        countryName: '',
        status: '',

    })
    const changeUpdateForm = (e) => {

        const { name, value } = e.target;
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
            "CountryCode": updateData.countryCode,
            "CountryName": updateData.countryName,
            "Status": updateData.status,
        }

        try {
            if (updateData.countryCode != "" && updateData.countryName) {
                const response = await fetch(APIURL + 'Admin/UpdateCountry', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateValue)
                });

                const data = await response.json();

                if (data.responseCode === '200') {
                    setUpdateData({
                        countryCode: '',
                        countryName: '',
                        status: '',

                    });
                    setErrors(false)
                    setToastDisplayed(true)
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        UpdateModalClose();
                        table_Data();
                        setToastDisplayed(false)
                    }, 2500)
                } else {
                    toast.warning(data.responseMessage)
                }
            } else {

                setErrors(true)
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    // countryMaster update end
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
    useEffect(() => {
        table_Data();
    }, [])
    const columns = [

        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
            searchable: true,
            width: '15%',
        },
        {
            name: 'Country Code',
            selector: row => row.countryCode,
            sortable: true,
            searchable: true,
            width: '25%',
        },
        {
            name: 'Title',
            selector: row => row.countryName,
            sortable: true,
            searchable: true,
            width: '35%',
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
                <Link to="" className=""
                    onClick={() => handleDeleteShow(row.id, row.countryName)}><i class="bi bi-trash"></i></Link>

            </>
        },

    ];

    // country Master form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => setShowForm(false);
    const handleFormShow = () => setShowForm(true);
    const [countryForm, setCountryForm] = useState(
        {

            countryCode: "",
            title: "",

        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        setCountryForm((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const application_data = {
            "CountryID": 230,
            "CountryCode": countryForm.countryCode,
            "CountryName": countryForm.title,

        }
        const application_data_json = JSON.stringify(application_data);
        try {
            if (countryForm.title != "" && countryForm.countryCode) {
                const application_responce = await fetch(APIURL + 'Admin/AddCountry', {
                    method: "Post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: application_data_json,

                });

                const data = await application_responce.json();
                if (data.responseCode === '200') {
                    setCountryForm({

                        countryCode: "",
                        title: "",

                    })
                    setErrors(false)
                    setToastDisplayed(true)
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        handleFormClose();
                        table_Data();
                        setToastDisplayed(false);
                    }, 2500)

                } else {

                    toast.warning(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        handleFormClose();
                        table_Data();
                        setToastDisplayed(false);
                    }, 2500)
                }
            }
            else {

                setErrors(true)
            }
        } catch (error) {
            console.log("Fetching Error", error)
        }
    };

    // Sector Master form end

    const filteredData = tableData.filter(item => item.countryName?.toLowerCase().includes(searchText?.toLowerCase()) ||
    item.countryCode?.toLowerCase().includes(searchText?.toLowerCase())

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
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Country Master</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">

                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="countryCode" className={errors === true && !countryForm.countryCode ? 'error' : 'fomcontrol'} placeholder="Country Code" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !countryForm.countryCode ? <small class="errormsg">Country code is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="title" className={errors === true && !countryForm.title ? 'error' : 'fomcontrol'} placeholder="Title" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !countryForm.title ? <small class="errormsg">Title is required</small> : ''}
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
            {/* CountryMaster delete modal */}
            < Modal show={showDltModal} onHide={handleDltClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Delete Confirmation!</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">

                            <Modal.Body>Are you sure you want to delete Currency <b>{countryMaster.name}</b>?</Modal.Body>
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
            {/* CountryMaster Form update modal */}
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
                                <p className="form-label">Country Code</p>
                                    <label>
                                        <input type="text" name="countryCode" className={errors === true && !updateData.countryCode ? 'error' : 'fomcontrol'} placeholder="Country Code" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.countryCode} />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !updateData.countryCode ? <small class="errormsg">Country code  is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                <p className="form-label">Title</p>
                                    <label>
                                        <input type="text" name="countryName" className={errors === true && !updateData.countryName ? 'error' : 'fomcontrol'} placeholder="Title" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.countryName} />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !updateData.countryName ? <small class="errormsg">Title is required</small> : ''}
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

export default CountryMasterTable
