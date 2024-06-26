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

const BankMasterTable = () => {

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

    const [bankMaster, setBankMaster] = useState({
        id: '',
        name: '',

    });
    const handleDeleteShow = (id, name) => {
        setShowDltModal(true);
        setBankMaster({
            id: id,
            name: name

        });
    }

    const handleDeleteItem = async () => {
        const table_id = {
            "id": bankMaster.id,
            "Status": 90
        }
        try {
            const responce = await fetch(APIURL + 'Admin/DeleteBank', {
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

    // BankMaster update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setErrors(false);
    }

    const [updateData, setUpdateData] = useState({
        bankCode: "",
        bankName: "",
        bankAddress1: "",
        bankAddress2: "",
        bankAddress3: "",
        approvalLetter: "",
        nameForSign: "",
        designationForSign: "",
        signatureImage: "",
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
            const response = await fetch(APIURL + 'Admin/GetBankByID', {
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
            "BankCode": updateData.bankCode,
            "BankName": updateData.bankName,
            "BankAddress1": updateData.bankAddress1,
            "BankAddress2": updateData.bankAddress2,
            "BankAddress3": updateData.bankAddress3,
            "NameForSign": "",
            "DesignationForSign": "",
            "SignatureImage": "",
            "Status": updateData.status,
        }

        try {
            if (updateData.bankCode != "" && updateData.bankName != "" && updateData.bankAddress1 != "") {
                const response = await fetch(APIURL + 'Admin/UpdateBank', {
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
                        setUpdateData({
                            bankCode: "",
                            bankName: "",
                            bankAddress1: "",
                            bankAddress2: "",
                            bankAddress3: "",
                        })
                        setErrors(false)
                    }, 2500)
                }
                else {
                    toast.warning(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        UpdateModalClose();
                        table_Data();
                        setToastDisplayed(false)
                        setUpdateData({
                            bankCode: "",
                            bankName: "",
                            bankAddress1: "",
                            bankAddress2: "",
                            bankAddress3: "",
                        })
                        setErrors(false)
                    }, 2500)
                }
            } else {
                setErrors(true)
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    // bank update end
    const table_Data = async () => {
        try {
            const response = await fetch(APIURL + 'Admin/GetAllBanks', {
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
            width: '5%',
        },

        {
            name: 'Bank Code',
            selector: row => row.bankCode,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'Bank Name',
            selector: row => row.bankName,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'Address1 Line',
            selector: row => row.bankAddress1,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'Address2 Line',
            selector: row => row.bankAddress2,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'Address3 Line',
            selector: row => row.bankAddress3,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'ApprovalLetterHeaderImage',
            selector: row => row.bpnNumber,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'Name For Sign',
            selector: row => row.bpnNumber,
            sortable: true,
            searchable: true,
            width: '10%',
        },
        {
            name: 'Designation For Sign',
            selector: row => row.bpnNumber,
            sortable: true,
            searchable: true,
            width: '7%',
        },
        {
            name: 'Signature Image',
            selector: row => row.bpnNumber,
            sortable: true,
            searchable: true,
            width: '8%',
        },


        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            searchable: true,
            width: '5%',
            cell: row => <span>{row.status === 1 ? <span className="badge rounded-pill bg-success">Active</span> : <span className="badge rounded-pill bg-warning text-dark">Inactive</span>}</span>,
        },
        {
            name: 'Action',
            width: '5%',
            cell: row => <> <Link to="" className="me-2"
                onClick={() => handleUpdate(row.id)}><i class="bi bi-pencil-square"></i></Link>
                <Link to="" className=""
                    onClick={() => handleDeleteShow(row.id, row.bankName)}><i class="bi bi-trash"></i></Link>

            </>
        },

    ];


    // Sector Master form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setErrors(false);
    };
    const handleFormShow = () => setShowForm(true);
    const [bankForm, setBankForm] = useState(
        {
            BankCode: "",
            BankName: "",
            BankAddress1: "",
            BankAddress2: "",
            BankAddress3: "",

        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        setBankForm((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const application_data = {
            "BankCode": bankForm.BankCode,
            "BankName": bankForm.BankName,
            "BankAddress1": bankForm.BankAddress1,
            "BankAddress2": bankForm.BankAddress2,
            "BankAddress3": bankForm.BankAddress3,
            "ApprovalLetter": "",
            "NameForSign": "",
            "DesignationForSign": "",
            "SignatureImage": "",
        }
        const application_data_json = JSON.stringify(application_data);
        try {
            if (bankForm.BankCode != "" && bankForm.BankName != "" && bankForm.BankAddress1 != "") {
                const application_responce = await fetch(APIURL + 'Admin/AddBank', {
                    method: "Post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: application_data_json,

                });

                const data = await application_responce.json();
                if (data.responseCode === '200') {
                    setBankForm({
                        BankCode: "",
                        BankName: "",
                        BankAddress1: "",
                        BankAddress2: "",
                        BankAddress3: "",

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
            else {

                setErrors(true)
            }
        } catch (error) {
            console.log("Fetching Error", error)
        }
    };

    // BankMaster form end

    const filteredData = tableData?.filter(item =>
    (item.bankName?.toLowerCase().includes(searchText.toLowerCase()) ||
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
                    className="bankDataTable"
                    columns={columns}
                    data={filteredData}
                    defaultSortFieldId={1}
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
                                    Add Bank
                                </Button>
                            </div>

                        </div>
                    }
                />

            </>


            {/* BankMaster Form modal */}
            <Modal show={showForm} onHide={handleFormClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Add Bank</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">

                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="BankCode" className={errors === true && !bankForm.BankCode ? 'error' : 'fomcontrol'} placeholder="Bank Code" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !bankForm.BankCode ? <small class="errormsg">Bank code is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="BankName" className={errors === true && !bankForm.BankName ? 'error' : 'fomcontrol'} placeholder="Bank Name" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !bankForm.BankName ? <small class="errormsg">Bank name is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="BankAddress1" className={errors === true && !bankForm.BankAddress1 ? 'error' : 'fomcontrol'} placeholder="Address Line1" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !bankForm.BankAddress1 ? <small class="errormsg">Address is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="BankAddress2" placeholder="Address Line2" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="BankAddress3" placeholder="Address Line3" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>

                                </div>
                                {/* <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="approvalLetter" placeholder="Approval Letter HeaderImage" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="nameForSign" placeholder="Name For Sign" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="designationForSign" placeholder="Signature For Sign" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="signatureImage" placeholder="Signature Image" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>

                                </div> */}
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
            {/* BankMaster delete modal */}
            < Modal show={showDltModal} onHide={handleDltClose} backdrop="static">
                <div className="application-box">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Delete Confirmation!</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">

                            <Modal.Body>Are you sure you want to delete Bank <b>{bankMaster.name}</b>?</Modal.Body>
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
            {/* BankMaster Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Update Bank</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="bankCode" className={errors === true && !updateData.bankCode ? 'error' : 'fomcontrol'} placeholder="Bank Code" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.bankCode} />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !updateData.bankCode ? <small class="errormsg">Bank code is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="bankName" className={errors === true && !updateData.bankName ? 'error' : 'fomcontrol'} placeholder="Bank Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.bankName} />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !updateData.bankName ? <small class="errormsg">Bank name is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="bankAddress1" className={errors === true && !updateData.bankAddress1 ? 'error' : 'fomcontrol'} placeholder="Address Line1" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.bankAddress1} />
                                        <span className='sspan'></span>
                                    </label>
                                    {errors === true && !updateData.bankAddress1 ? <small class="errormsg">Address is required</small> : ''}
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="bankAddress2" className="" placeholder="Address Line2" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.bankAddress2} />
                                        <span className='sspan'></span>
                                    </label>

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="bankAddress3" className="" placeholder="Address Line3" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.bankAddress3} />
                                        <span className='sspan'></span>
                                    </label>

                                </div>
                                {/* <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="approvalLetter" placeholder="Approval Letter Header Image" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.approvalLetter} />
                                        <span className='sspan'></span>
                                    </label>
                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="nameForSign" placeholder="Name For Sign" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.nameForSign} />
                                        <span className='sspan'></span>
                                    </label>

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="designationForSign" placeholder="Designation For Sign" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.designationForSign} />
                                        <span className='sspan'></span>
                                    </label>

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="signatureImage" placeholder="Signature Image" onChange={(e) => { changeUpdateForm(e) }} required value={updateData.signatureImage} />
                                        <span className='sspan'></span>
                                    </label>

                                </div> */}
                                <div className="form-bx mb-4">
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

export default BankMasterTable
