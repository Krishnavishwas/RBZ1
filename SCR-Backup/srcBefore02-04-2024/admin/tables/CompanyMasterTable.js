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
    const [formerr, setformerr] = useState();
    const [updateerr, setupdateerr] = useState();
    const csvLinkRef = useRef();
    const [errors, setErrors] = useState(false);
    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };

    // company update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setUpdateData({
            companyCode: '',
            companyName: '',
            companyAddress1: '',
            bpnNumber: "",
            tinNumber: "",
            status: '',

        })
        setupdateerr('');
    }
 
    const [updateData, setUpdateData] = useState({
        companyCode: '',
        companyName: '',
        companyAddress1: '',
        bpnNumber: "",
        tinNumber: "",
        status: '',

    })
    const changeUpdateForm = (e) => {

        const { name, value } = e.target;
        let newErrors = {};

        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const specialAddressChars = /[!@#$%^&*(),.?":{}|<>`~]/;
        const tb = /[!@#$%^&*(),.?":{}|<>]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "companyCode" && specialChars.test(value)) {
            newErrors.companyCode = "Special characters not allowed";
        } else if (name == "companyCode" && value.charAt(0) === ' ') {
            newErrors.companyCode = "First character cannot be a blank space";
        } else if (name == "companyCode" && spaceCheck.test(value)) {
            newErrors.companyCode = "Multiple space not allow";
        } else if (
            name == "companyAddress1" &&
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
            newErrors.companyAddress1 = "Special characters not allowed.";
        } else if (name == "companyAddress1" && value.charAt(0) === ' ') {
            newErrors.companyAddress1 = "First character cannot be a blank space";
        } else if (name == "companyAddress1" && spaceCheck.test(value)) {
            newErrors.companyAddress1 = "Multiple space not allow";
        }else if (name == "companyName" && specialChars.test(value)) {
            newErrors.companyName = "Special characters not allowed";
        } else if (name == "companyName" && value.charAt(0) === ' ') {
            newErrors.companyName = "First character cannot be a blank space";
        } else if (name == "companyName" && spaceCheck.test(value)) {
            newErrors.companyName = "Multiple space not allow";
        } else if (name == "bpnNumber" && (tb.test(value) ||
            value?.includes("_") ||
            value?.includes("+") ||
            value?.includes("=") ||
            value?.includes("'") ||
            value?.includes(";") ||
            value?.includes("[") ||
            value?.includes("]") ||
            value?.includes("]"))) {
            newErrors.bpnNumber = "Special characters not allowed";
        } else if (name == "bpnNumber" && value.charAt(0) === ' ') {
            newErrors.bpnNumber = "First character cannot be a blank space";
        } else if (name == "tinNumber" && (tb.test(value) ||
            value?.includes("_") ||
            value?.includes("+") ||
            value?.includes("=") ||
            value?.includes("'") ||
            value?.includes(";") ||
            value?.includes("[") ||
            value?.includes("]") ||
            value?.includes("]"))) {
            newErrors.tinNumber = "Special characters not allowed";
        } else if (name == "tinNumber" && value.charAt(0) === ' ') {
            newErrors.tinNumber = "First character cannot be a blank space";
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
            const response = await fetch(APIURL + 'Admin/GetCompanyByID', {
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
            "CompanyCode": updateData.companyCode.toUpperCase(),
            "CompanyName": updateData.companyName,
            "CompanyAddress1":updateData.companyAddress1,
            "BPNNumber": updateData.bpnNumber?.toUpperCase(),
            "TINNumber": updateData.tinNumber?.toUpperCase(),
            "Status": updateData.status,
        }

        try {
            if (isUpdateValid()) {
                const response = await fetch(APIURL + 'Admin/UpdateCompany', {
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
                            companyCode: '',
                            companyName: '',
                            companyAddress1: '',
                            bpnNumber: "",
                            tinNumber: "",
                        })
                        setSearchText('');
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
            console.error('Error fetching data:', error);
        }

    }
    // company update end
    // company list api start
    const table_Data = async () => {
        try {
            const response = await fetch(APIURL + 'Admin/GetAllCompanies', {
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
    // company list api end
    useEffect(() => {
        table_Data();
    }, [])
    const columns = [

        

        {
            name: 'Company Code',
            selector: row => row.companyCode,
            sortable: true,
            searchable: true,
            width: '250px',
        },
        {
            name: 'Company Name',
            selector: row => row.companyName,
            sortable: true,
            searchable: true,
            width: '250px',
        },
      
        {
            name: 'BPN Number',
            selector: row => row.bpnNumber,
            sortable: true,
            searchable: true,
            width: '250px',
            cell: row => (row.bpnNumber !== null ? row.bpnNumber : "-")
            // cell: row => row.bpnNumber
        },
        {
            name: 'TIN Number',
            selector: row => row.tinNumber,
            sortable: true,
            searchable: true,
            width: '200px',
            cell: row => (row.tinNumber !== null ? row.tinNumber : "-")
            // cell: row => row.tinNumber
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            searchable: true,
            width: '120px',
            cell: row => <span>{row.status === 1 ? <span className="badge rounded-pill bg-success">Active</span> : <span className="badge rounded-pill bg-warning text-dark">Inactive</span>}</span>,
        },
        {
            name: 'Action',
            width: '80px',
            cell: row => <> <Link to="" className="me-2"
                onClick={() => handleUpdate(row.id)}><i class="bi bi-pencil-square"></i></Link>

            </>
        },

    ];


    // add Sector Master form start
    const [showForm, setShowForm] = useState(false);
    const handleFormClose = () => {
        setShowForm(false);
        setformerr('');
        setCompanyForm({
            companyCode: "",
            companyName: "",
            companyAddress1:"",
            bpnnumber: "",
            TINNumber: "",

        })
    };
    const handleFormShow = () => setShowForm(true);
    const [companyForm, setCompanyForm] = useState(
        {
            companyCode: "",
            companyName: "",
            companyAddress1:"",
            bpnnumber: "",
            TINNumber: "",

        }
    )

    const changeHandelForm = (e) => {
        const { name, value } = e.target;
        let newErrors = {};
        
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const tb = /[!@#$%^&*(),.?":{}|<>]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "companyName" && specialChars.test(value)) {
            newErrors.companyName = "Special characters not allowed";
        } else if (name == "companyName" && value.charAt(0) === ' ') {
            newErrors.companyName = "First character cannot be a blank space";
        } else if (name == "companyName" && spaceCheck.test(value)) {
            newErrors.companyName = "Multiple space not allow";
        } else if (name == "companyCode" && specialChars.test(value)) {
            newErrors.companyCode = "Special characters not allowed";
        } else if (name == "companyCode" && value.charAt(0) === ' ') {
            newErrors.companyCode = "First character cannot be a blank space";
        } else if (name == "companyCode" && spaceCheck.test(value)) {
            newErrors.companyCode = "Multiple space not allow";
        } else if (
            name == "companyAddress1" &&
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
            newErrors.companyAddress1 = "Special characters not allowed.";
        } else if (name == "companyAddress1" && value.charAt(0) === ' ') {
            newErrors.companyAddress1 = "First character cannot be a blank space";
        } else if (name == "companyAddress1" && spaceCheck.test(value)) {
            newErrors.companyAddress1 = "Multiple space not allow";
        }
        else if (name == "TINNumber" && (tb.test(value) ||
            value?.includes("_") ||
            value?.includes("+") ||
            value?.includes("=") ||
            value?.includes("'") ||
            value?.includes(";") ||
            value?.includes("[") ||
            value?.includes("]") ||
            value?.includes("]"))) {
            newErrors.TINNumber = "Special characters not allowed";
        }

        else if (name == "TINNumber" && value.charAt(0) === ' ') {
            newErrors.TINNumber = "First character cannot be a blank space";
        }
        else if (name == "bpnnumber" && (tb.test(value) ||
            value?.includes("_") ||
            value?.includes("+") ||
            value?.includes("=") ||
            value?.includes("'") ||
            value?.includes(";") ||
            value?.includes("[") ||
            value?.includes("]") ||
            value?.includes("]"))) {
            newErrors.bpnnumber = "Special characters not allowed";
        }

        else if (name == "bpnnumber" && value.charAt(0) === ' ') {
            newErrors.bpnnumber = "First character cannot be a blank space";
        }

        else {

            setCompanyForm((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
        setformerr(newErrors);
    }



    const handleSubmit = async (e) => {
        e.preventDefault();

        const application_data = {
            "CompanyCode": companyForm.companyCode.toUpperCase(),
            "CompanyName": companyForm.companyName,
            "BPNNumber": companyForm.bpnnumber.toUpperCase(),
            "TINNumber": companyForm.TINNumber.toUpperCase(),
            "CompanyAddress1": companyForm.companyAddress1,
        }
    
        const application_data_json = JSON.stringify(application_data);
        try {
            if (isValid()) {
                const application_responce = await fetch(APIURL + 'Admin/AddCompany', {
                    method: "Post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: application_data_json,

                });

                const data = await application_responce.json();
                setToastDisplayed(true)
                if (data.responseCode === '200') {
                    setCompanyForm({
                        companyCode: "",
                        companyName: "",
                        companyAddress1:"",
                        bpnnumber: "",
                        TINNumber: "",
                    })
                    toast.success(data.responseMessage, { autoClose: 2000 })
                    setTimeout(() => {
                        handleFormClose();
                        table_Data();
                        setSearchText('');
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

    // add Sector Master form end

    // validation start
    const isValid = () => {
        const newErrors = {};
        let valid = true

        if (!companyForm.companyCode) {
            newErrors.companyCode = "Company code is required."
            valid = false
        }else if (companyForm.companyCode.trim().length < 3) {
            newErrors.companyCode = "Company code allow minimum 3 charecter";
            valid = false;
          }
        if (!companyForm.companyName) {
            newErrors.companyName = "Company name is required.";
            valid = false
        }
        if (!companyForm.companyAddress1) {
            newErrors.companyAddress1 = "Company address is required.";
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

        if (!updateData.companyCode) {
            newErrors.companyCode = "Company code is required.";
            valid = false
        }else if (updateData.companyCode.trim().length < 3) {
            newErrors.companyCode = "Company code allow minimum 3 charecter";
            valid = false;
          }
        if (!updateData.companyAddress1) {
            newErrors.companyAddress1 = "Company address is required.";
            valid = false
        }
      
        if (!updateData.companyName) {
            newErrors.companyName = "Company name is required.";
            valid = false
        }
        setupdateerr(newErrors);
        return valid;


    }
    // validation end
    // application form end
    const filteredData = tableData?.filter(item => item.companyName?.toLowerCase().includes(searchText?.toLowerCase()) ||
        (item.companyCode?.toLowerCase().includes(searchText?.toLowerCase()) ||
            (item.id && item.id.toString().includes(searchText)) ||
            item.bpnNumber?.toLowerCase().includes(searchText?.toLowerCase()) ||
            item.tinNumber?.toLowerCase().includes(searchText?.toLowerCase()) ||
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
                    striped
                    paginationRowsPerPageOptions={[10, 50, 100]}
                    highlightOnHover
                    dense
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
                                <Modal.Title>Add Company</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="companyCode" className='fomcontrol text-uppercase' value={companyForm?.companyCode} placeholder="Company Code" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.companyCode ? (
                                        <span className="errormsg">
                                            {formerr?.companyCode}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="companyName" className='fomcontrol text-capitalize' value={companyForm?.companyName} placeholder="Company Name" onChange={(e) => { changeHandelForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.companyName ? (
                                        <span className="errormsg">
                                            {formerr?.companyName}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <textarea name="companyAddress1" className='fomcontrol' value={companyForm?.companyAddress1} placeholder="Company Address" onChange={(e) => { changeHandelForm(e) }} required ></textarea>
                                        <span className='sspan'></span>
                                    </label>
                                    {formerr?.companyAddress1 ? (
                                        <span className="errormsg">
                                            {formerr?.companyAddress1}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="bpnnumber" className='fomcontrol text-uppercase' placeholder="BPN Number" onChange={(e) => { changeHandelForm(e) }} value={companyForm?.bpnnumber.trim()} required />
                                        <span className='sspan'></span>
                                        {formerr?.bpnnumber ? (
                                            <span className="errormsg">
                                                {formerr?.bpnnumber}
                                            </span>
                                        ) : ""}
                                    </label>

                                </div>
                                <div className="form-bx mb-4">
                                    <label>
                                        <input type="text" name="TINNumber" className='fomcontrol text-uppercase' placeholder="TIN Number" onChange={(e) => { changeHandelForm(e) }} value={companyForm?.TINNumber.trim()} required />
                                        <span className='sspan'></span>
                                        {formerr?.TINNumber ? (
                                            <span className="errormsg">
                                                {formerr?.TINNumber}
                                            </span>
                                        ) : ""}
                                    </label>

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

            {/* CompanyMaster Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Update Company</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <p className="form-label">Company Code</p>
                                    <label>
                                        <input type="text" name="companyCode" className='fomcontrol text-uppercase' value={updateData?.companyCode} placeholder="Company Code" onChange={(e) => { changeUpdateForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.companyCode ? (
                                        <span className="errormsg">
                                            {updateerr?.companyCode}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Company Name</p>
                                    <label>
                                        <input type="text" name="companyName" className='fomcontrol text-capitalize' value={updateData?.companyName} placeholder="Company Name" onChange={(e) => { changeUpdateForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.companyName ? (
                                        <span className="errormsg">
                                            {updateerr?.companyName}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Company Address</p>
                                    <label>
                                    <textarea  name="companyAddress1" className='fomcontrol' placeholder="Company Address" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.companyAddress1} ></textarea>
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.companyAddress1 ? (
                                        <span className="errormsg">
                                            {updateerr?.companyAddress1}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">BPN Number</p>
                                    <label>
                                        <input type="text" name="bpnNumber" className='fomcontrol text-uppercase' placeholder="BPN Number" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.bpnNumber?.trim()} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.bpnNumber ? (
                                        <span className="errormsg">
                                            {updateerr?.bpnNumber}
                                        </span>
                                    ) : ""}

                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">TIN Number</p>
                                    <label>
                                        <input type="text" name="tinNumber" className='fomcontrol text-uppercase' placeholder="TIN Number" value={updateData?.tinNumber?.trim()} onChange={(e) => { changeUpdateForm(e) }} required />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.tinNumber ? (
                                        <span className="errormsg">
                                            {updateerr?.tinNumber}
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

export default CompanyMasterTable
