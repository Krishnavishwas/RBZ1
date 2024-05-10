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

const CompanyMasterTable = () => {

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
                handleDltClose();
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
        title: '',
        code: '',
        bpnnumber: "",
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
    console.log("updateData", updateData);
    const handleUpdateData = async () => {
        const updateValue = {
            "ID": updateID,
            "CurrencyCode": updateData.currencyCode,
            "CurrencyName": updateData.currencyName,
            "CurrencyRate": updateData.currencyRate,
            "Status": updateData.status,
        }

        try {
            if (updateData.currencyCode != "" && updateData.currencyName != "" && updateData.currencyRate != "") {
                const response = await fetch(APIURL + 'Admin/UpdateCurrency', {
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
                        UpdateModalClose();
                        table_Data();
                        setToastDisplayed(false)
                    }, 2500)
                }
            } else {
                setErrors(true)
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
            name: '#',
            selector: row => row.id,
            sortable: true,
            searchable: true,
        },
        {
            name: 'Title',
            selector: row => row.currencyCode,
            sortable: true,
            searchable: true,
        },
        {
            name: 'Code',
            selector: row => row.currencyName,
            sortable: true,
            searchable: true,
        },
        {
            name: 'BPN Number',
            selector: row => row.currencyRate,
            sortable: true,
            searchable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            searchable: true,
            cell: row => <span>{row.status === 1 ? <span className="badge rounded-pill bg-success">Active</span> : <span className="badge rounded-pill bg-warning text-dark">Inactive</span>}</span>,
        },
        {
            name: 'Action',
            cell: row => <> <Link to="" className="me-2"
                onClick={() => handleUpdate(row.id)}><i class="bi bi-pencil-square"></i></Link>
                <Link to="" className=""
                    onClick={() => handleDeleteShow(row.id, row.currencyName)}><i class="bi bi-trash"></i></Link>

            </>
        },

    ];


    // Sector Master form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => setShowForm(false);
    const handleFormShow = () => setShowForm(true);
    const [currencyForm, setCurrencyForm] = useState(
        {
            title: "",
            currencyName: "",
            rate: "",
        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        setCurrencyForm((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const application_data = {
            "CurrencyCode": currencyForm.title,
            "CurrencyName": currencyForm.currencyName,
            "CurrencyRate": currencyForm.rate
        }
        const application_data_json = JSON.stringify(application_data);
        try {
            if (currencyForm.title != "" && currencyForm.CurrencyName != "" && currencyForm.rate != "") {
                const application_responce = await fetch(APIURL + 'Admin/AddCurrency', {
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


    // application form end
    // const filteredData = tableData.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())

    // );


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
                    data={tableData}
                    pagination
                    highlightOnHover
                    dense
                    fixedHeader
                    subHeader
                    subHeaderComponent={
                        <div className="tablesearch justify-content-end">
                            {/* <div className="tablesearch_bx">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div> */}
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
                                    Add Company
                                </Button>
                            </div>

                        </div>
                    }
                />

            </>


            {/* CompanyMaster Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Company Master</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="title" className={errors === true && !currencyForm.title ? 'error' : 'fomcontrol'} placeholder="Title" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !currencyForm.title ? <small class="errormsg">Title is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="code" className={errors === true && !currencyForm.currencyName ? 'error' : 'fomcontrol'} placeholder="Code" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !currencyForm.currencyName ? <small class="errormsg">Code is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="number" name="bpnnumber" className={errors === true && !currencyForm.rate ? 'error' : 'fomcontrol'} placeholder="BPN Number" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !currencyForm.rate ? <small class="errormsg">BPN number is required</small> : ''}
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
            {/* CompanyMaster delete modal */}
            < Modal show={showDltModal} onHide={handleDltClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Delete Confirmation!</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">

                            <Modal.Body>Are you sure you want to delete these Currency <b>{currencyMaster.name}</b>..?</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleDltClose}>
                                    Close
                                </Button>
                                <Button variant="danger" onClick={handleDeleteItem}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </div>
                    </div>
                </div>
            </Modal >
            {/* CompanyMaster Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Update Company Master</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="title" className={errors === true && !updateData.currencyCode ? 'error' : 'fomcontrol'} placeholder="Title" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.title} />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !updateData.currencyCode ? <small class="errormsg">Title is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="code" className={errors === true && !updateData.currencyName ? 'error' : 'fomcontrol'} placeholder="Code" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.code} />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !updateData.currencyName ? <small class="errormsg">Code is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="number" name="bpnnumber" className={errors === true && !updateData.currencyRate ? 'error' : 'fomcontrol'} placeholder="BPN Number" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.bpnnumber} />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !updateData.currencyRate ? <small class="errormsg">BPN number is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <select name="status" class="form-select form-select-sm" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData.status}>

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

export default CompanyMasterTable
