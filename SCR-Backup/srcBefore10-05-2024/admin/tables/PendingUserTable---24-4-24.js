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

const PendingUserTable = () => {

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


    // GovernmentAgency update start

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const UpdateModalClose = () => {
        setShowUpdateModal(false);
        setUpdateData({
            name: '',
            emailID: '',
            phoneNumber: '',
            address: '',
            identificationNumber: '',
            applyingFor: '',
            status: '',
        });
        setMenuChekedVal([]);
        setUserChekedVal([]);
        setupdateerr('');
    }
    const [updateData, setUpdateData] = useState({

        name: '',
        emailID: '',
        phoneNumber: '',
        address: '',
        identificationNumber: '',
        userName: '',
        applyingFor: '',
        status: '',

    })

    const [menuChekedVal, setMenuChekedVal] = useState([]);
    const [userChekedVal, setUserChekedVal] = useState([]);

    const changeUpdateForm = (e) => {

        const { name, value } = e.target;
        let newErrors = {};

        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        const spaceCheck = /\s{2,}/g;
        if (name == "address" && value.charAt(0) === ' ') {
            newErrors.address = "First character cannot be a blank space";
        } else if (name == "address" && spaceCheck.test(value)) {
            newErrors.address = "Multiple space not allow";
        } else if (
            name == "address" &&
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
            newErrors.address = "Special characters not allowed.";
        }

        else {

            setUpdateData((prevState) => ({
                ...prevState,
                [name]: value

            }));
        }
        setupdateerr(newErrors);

    }


    //on chnage dept value

    const changeDptFrom = (menuID) => {
        setMenuChekedVal((prevUserCheckedVal) => {
            const isChecked = prevUserCheckedVal?.some(
                (role) => role.menuID === menuID
            );
            if (isChecked) {
                return prevUserCheckedVal
                    ? prevUserCheckedVal.filter((role) => role.menuID !== menuID)
                    : [];
            } else {
                const selectedMenu = depData?.find((role) => role.id === menuID);
                return selectedMenu
                    ? [
                        ...(prevUserCheckedVal || []),
                        { menuID: selectedMenu.id, menuName: selectedMenu.menuName },
                    ]
                    : prevUserCheckedVal || [];
            }
        });
    };

    const changeUserGrpFrom = (roleId) => {
        setUserChekedVal((prevUserCheckedVal) => {
            const isChecked = prevUserCheckedVal?.some(
                (role) => role.roleID === roleId
            );
            if (isChecked) {
                return prevUserCheckedVal
                    ? prevUserCheckedVal.filter((role) => role.roleID !== roleId)
                    : [];
            } else {
                const selectedRole = userGrp?.find((role) => role.id === roleId);
                return selectedRole
                    ? [
                        ...(prevUserCheckedVal || []),
                        { roleID: selectedRole.id, roleName: selectedRole.name },
                    ]
                    : prevUserCheckedVal || [];
            }
        });
    };

    const [updateID, setUpdateID] = useState("")

    const handleUpdate = async (id) => {
        setShowUpdateModal(true);
        setUpdateID(id)
        const TableId = {
            "UserID": id
        }

        try {
            const response = await fetch(APIURL + 'User/GetUserDetailsByUserID', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(TableId)
            });

            const data = await response.json();
            setUpdateData(data.responseData);
            setMenuChekedVal(data.responseData.menuModelData);
            setUserChekedVal(data.responseData.roleModelData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }

    const [depData, setDepData] = useState([]);
    const [userGrp, setUserGrp] = useState([]);
    // Associated Department api start 
    const dep_data = async () => {
        try {
            const responce = await fetch(APIURL + 'Admin/GetAllMenu', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await responce.json();
            setDepData(data.responseData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    // Associated Department api end 
    // user Grp api start 
    const userGrp_data = async () => {
        try {
            const responce = await fetch(APIURL + 'Master/GetMasterRoles', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await responce.json();
            setUserGrp(data.responseData)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    // user Grp api end 
    const handleUpdateData = async () => {

        const updateValue = {
            ID: updateData.id,
            Name: updateData.name,
            RBZReferenceNumber: updateData.applyingFor,
            EmailID: updateData.emailID,
            PhoneNumber: updateData.phoneNumber,
            Address: updateData.address,
            IdentificationNumber: updateData.identificationNumber,
            userName:updateData.userName,
            UserID: updateID,
            Status: updateData.status,
            MenuModelData: menuChekedVal?.map((data) => {
                return { MenuID: data.menuID };
            }),
            RoleModelData: userChekedVal?.map((data) => {
                return { RoleID: data.roleID };
            }),
        }
        try {
            const response = await fetch(APIURL + 'User/UpdateUsers', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateValue)
            });
            const data = await response.json();
            setToastDisplayed(true)
            if (data.responseCode === '200') {

                setErrors(false)

                toast.success(data.responseMessage, { autoClose: 2000 })
                setTimeout(() => {
                    UpdateModalClose();
                    table_Data();
                    setUpdateData({
                        name: '',
                        emailID: '',
                        phoneNumber: '',
                        address: '',
                        identificationNumber: '',
                        applyingFor: '',
                    })
                    setMenuChekedVal([]);
                    setUserChekedVal([]);
                    setSearchText('');
                    setToastDisplayed(false)
                }, 2500)
            }
            else {
                toast.warning(data.responseMessage, { autoClose: 2000 })
                setTimeout(() => {
                    table_Data();
                    setToastDisplayed(false);
                }, 2500)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    // approve update end



    // approve user list api start 
    const table_Data = async () => {
        const Status = {
            "Status": "30"
        }
        try {
            const response = await fetch(APIURL + 'User/GetActiveInactiveUsers', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Status)
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
    // approve list api end
    useEffect(() => {
        table_Data();
        dep_data();
        userGrp_data()
    }, [])
   
    const columns = [

        // {
        //     name: 'ID',
        //     selector: row => row.id,
        //     sortable: true,
        //     searchable: true,
        //     width: '10%',
        // },
        {
            name: 'User Name',
            selector: row => row.name,
            sortable: true,
            searchable: true,
            width: '18%',
        },
        {
            name: 'Bank Name',
            selector:function(row){
                return row.bankName ? row.bankName : "_"
            },
            sortable: true,
            searchable: true,
            width: '18%',
        },
        {
            name: 'Email Address',
            selector: function (row) {
                return row.emailID ? row.emailID : "_"
            },
            sortable: true,
            searchable: true,
            width: '20%',
        },
        {
            name: 'Contact Number',
            selector: function (row) {
                return row.phoneNumber ? row.phoneNumber : "_"
            },
            sortable: true,
            searchable: true,
            width: '17%',
        },
        {
            name: 'Registration Type',
            selector: function (row) {
                return row.applyingFor ? row.applyingFor : "_"
            },
            sortable: true,
            searchable: true,
            width: '17%',
        },

        {
            name: 'Action',
            width: '10%',
            cell: row => <> <Link to="" className="me-2"
                onClick={() => handleUpdate(row.userID)}><i class="bi bi-pencil-square"></i></Link>


            </>
        },

    ];

    // application form end
    const filteredData = tableData?.filter(item =>
    (item.name?.toLowerCase().includes(searchText.toLowerCase())

    )
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
                    persistTableHead={true}
                    defaultSortFieldId={1}
                    defaultSortAsc={false}
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
                                {/* <Button
                                    onClick={handleFormShow}
                                >
                                    Add Government Agency
                                </Button> */}
                            </div>

                        </div>
                    }
                />

            </>

            {/* Approve USer Form update modal */}
            <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
                <div className="application-box editmodal-change user-verScroll">
                    <div className="login_inner">
                        <div class="login_form "><h5>
                            <Modal.Header closeButton className="p-0">
                                <Modal.Title>Pending User</Modal.Title>
                            </Modal.Header>
                        </h5></div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <div className="form-bx mb-4">
                                    <p className="form-label">Full Name</p>
                                    <label>
                                        <input type="text" name="name" className='formcontrol' disabled placeholder="Full Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.name} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.name ? (
                                        <span className="errormsg">
                                            {updateerr?.name}
                                        </span>
                                    ) : ""}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Bank Name</p>
                                    <label>
                                        <input type="text" name="bankName" className='formcontrol' disabled placeholder="Bank Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.bankName} />
                                        <span className='sspan'></span>
                                    </label>
                                   
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Email Address</p>
                                    <label>
                                        <input type="email" name="emailID" className='formcontrol' disabled placeholder="Email Address" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.emailID} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.emailID ? (
                                        <span className="errormsg">
                                            {updateerr?.emailID}
                                        </span>
                                    ) : ""}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Address</p>
                                    <label>
                                        <textarea name="address" className='formcontrol' placeholder="Address" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.address}></textarea>
                                    </label>
                                    {updateerr?.address ? (
                                        <span className="errormsg">
                                            {updateerr?.address}
                                        </span>
                                    ) : ""}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Contact Number</p>
                                    <label>
                                        <input type="number" name="phoneNumber" className='formcontrol' disabled placeholder="Contact Number" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.phoneNumber} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.phoneNumber ? (
                                        <span className="errormsg">
                                            {updateerr?.phoneNumber}
                                        </span>
                                    ) : ""}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">National Identification Number</p>
                                    <label>
                                        <input type="text" name="identificationNumber" className='formcontrol' placeholder="National Identifier Number" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.identificationNumber} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.identificationNumber ? (
                                        <span className="errormsg">
                                            {updateerr?.identificationNumber}
                                        </span>
                                    ) : ""}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">User Name</p>
                                    <label>
                                        <input type="text" name="userName" className='formcontrol' disabled placeholder="User Name" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.userName} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.userName ? (
                                        <span className="errormsg">
                                            {updateerr?.userName}
                                        </span>
                                    ) : ""}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Registration Type</p>
                                    <label>
                                        <input type="text" name="applyingFor" className='formcontrol' placeholder="Registration Type" onChange={(e) => { changeUpdateForm(e) }} required value={updateData?.applyingFor} />
                                        <span className='sspan'></span>
                                    </label>
                                    {updateerr?.applyingFor ? (
                                        <span className="errormsg">
                                            {updateerr?.applyingFor}
                                        </span>
                                    ) : ""}
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Select Status</p>
                                    <label>
                                        <select name="status" class="" aria-label="Large select example" onChange={(e) => { changeUpdateForm(e) }} value={updateData?.status}>
                                            <option value="30">Pending</option>
                                            <option value="10">Approved</option>
                                            <option value="20">Not Approved</option>
                                        </select>
                                        <span className='sspan'></span>
                                    </label>
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Associated Department</p>
                                    <div className="checkbox-Box">
                                        {
                                            depData?.map((item, index) => {
                                                return (
                                                    <div className="deptInner-box d-flex mb-2" key={index}>
                                                        <input
                                                            type="checkbox"
                                                            id={`role_${item.id}`}
                                                            name={item.menuName}
                                                            value={item.id}
                                                            checked={menuChekedVal?.some(
                                                                (selectedRole) => selectedRole.menuID === item.id
                                                            )}
                                                            onChange={() =>
                                                                changeDptFrom(item.id)
                                                            } />
                                                        <span htmlFor={`role_${item.id}`}>{item.menuName}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                        {/* <div className="deptInner-box d-flex mb-2">
                                            <input type="checkbox" id="import" name="import" value="import" />
                                            <span for="import">Import</span>
                                        </div> */}

                                    </div>
                                </div>
                                <div className="form-bx mb-4">
                                    <p className="form-label">Select User Group</p>
                                    <div className="checkbox-Box">
                                        {
                                            userGrp?.map((item) => {
                                                return (
                                                    <div className="deptInner-box d-flex mb-2" >
                                                        <input
                                                            type="checkbox"
                                                            id={`role_${item.id}`}
                                                            name={item.designation}
                                                            value={item.id}
                                                            checked={userChekedVal?.some(
                                                                (selectedRole) => selectedRole.roleID === item.id
                                                            )}
                                                            onChange={() => changeUserGrpFrom(item.id)} />
                                                        <span htmlFor={`role_${item.id}`}>{item.designation}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                        {/* <div className="deptInner-box d-flex mb-2">
                                            <input type="checkbox" id="IndividualORCompany" name="IndividualORCompany" value="IndividualORCompany" />
                                            <span for="IndividualORCompany">IndividualORCompany</span>
                                        </div> */}

                                    </div>
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

export default PendingUserTable
