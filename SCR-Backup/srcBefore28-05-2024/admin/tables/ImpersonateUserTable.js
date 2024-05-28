import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { APIURL } from "../../constant";
import axios from "axios";
import { toast } from "react-toastify";
import { Storage } from "../../login/Storagesetting";
import Modal from 'react-bootstrap/Modal';

import Menubar from "../../navbar/Menubar";
const ImpersonateUserTable = () => {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState("");
    const [tableData, setTableData] = useState([]);
    const [userDetails, setUserDetails] = useState({
        user: '',
        pass: ''
    })
    const [loginModalShow, setloginModalShow] = useState(false);
    const handleLoginModalClose = () => setloginModalShow(false);
    const handleLoginModalShow = () => setloginModalShow(true);
    const handleUserLoginData = (loginUser, loginPass) => {
        setloginModalShow(true);
        setUserDetails({
            user: loginUser,
            pass: loginPass
        })
        console.log(loginUser, loginPass);
    }
    const { getMenudata } = Menubar();
    console.log("userDetails", userDetails);
    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };

    // approve user list api start
    const table_Data = async () => {
        const Status = {
            Status: "10",
        };
        try {
            const response = await fetch(APIURL + "User/GetImpersonateUsers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Status),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setTableData(data.responseData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    // approve list api end
    // -------- login api start

    const handleLoginApi = async () => {
        await axios.post(APIURL + 'User/UserLogin', {
            userName: userDetails.user,
            password: userDetails.pass,
        })
            .then((res) => {

                if (res.data.responseCode === "200") {
                    Storage.setItem('userID', JSON.stringify(res.data.responseData.userID));
                    Storage.setItem('userName', JSON.stringify(res.data.responseData.userName));
                    Storage.setItem('applicantType', JSON.stringify(res.data.responseData.applicantType));
                    Storage.setItem('name', JSON.stringify(res.data.responseData.name));
                    Storage.setItem('roleIDs', JSON.stringify(res.data.responseData.roleID));
                    Storage.setItem('roleName', JSON.stringify(res.data.responseData.roleName));
                    Storage.setItem('bankID', JSON.stringify(res.data.responseData.bankID));
                    Storage.setItem('bankName', JSON.stringify(res.data.responseData.bankName));
                    getMenudata(
                        res.data.responseData.roleID,
                        res.data.responseData.loginToken,
                        res.data.responseData.userID
                    );
                    sessionStorage.setItem("menuname", "Exports")
                    sessionStorage.setItem("submenuname", "Dashboard")
                    toast.success(res.data.responseMessage);
                    setTimeout(() => {
                        navigate('/BankADLADashboard');
                        handleLoginModalClose()
                        // window.open('/BankADLADashboard', '_blank');
                    }, 5000)
                }
            })
    }
    // --------- Login api end
    useEffect(() => {
        table_Data();

    }, []);

    const columns = [
        {
            name: "User Name",
            selector: (row) => row.userName,
            sortable: true,
            searchable: true,
            width: "18%",
        },
        {
            name: "Full Name",
            // selector: (row) => row.bankName,
            selector: function (row) {
                return row.name ? row.name : "_"
            },
            sortable: true,
            searchable: true,
            width: "18%",
        },
        {
            name: "Email Address",
            selector: function (row) {
                return row.emailID ? row.emailID : "_";
            },
            sortable: true,
            searchable: true,
            width: "20%",
        },
        {
            name: "Contact Number",
            selector: function (row) {
                return row.phoneNumber ? row.phoneNumber : "_";
            },
            sortable: true,
            searchable: true,
            width: "17%",
        },
        {
            name: "Registration Type",
            selector: function (row) {
                return row.applyingFor ? row.applyingFor : "_";
            },
            sortable: true,
            searchable: true,
            width: "17%",
        },
        {
            name: "Action",
            width: "10%",
            cell: (row) => (
                <>
                    {/* <p onClick={() => handleLoginApi(row.userName, row.password)} className="impersonateLoginBtn">
                        login
                    </p> */}
                    <button className="impersonateLoginBtn" onClick={() => handleUserLoginData(row.userName, row.password)}>
                        login
                    </button>

                </>
            ),
        },
    ];
    // validation start
    // console.log("tableData", tableData);
    // validation end
    const filteredData = tableData?.filter((item) =>
        item.name?.toLowerCase().includes(searchText.toLowerCase())
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

            {/* login conformation modal start */}
            <Modal className="impersonateLogin" show={loginModalShow} onHide={handleLoginModalClose} backdrop="static" centered>
                <Modal.Header>
                    {/* <Modal.Title>Modal heading</Modal.Title> */}
                    <div><i class="bi bi-exclamation-circle"></i></div>
                </Modal.Header>
                <Modal.Body>Do you want to impersonate the user?</Modal.Body>
                <Modal.Footer>
                    <button className="btn impNoBtn" onClick={handleLoginModalClose}>
                        No
                    </button>
                    <button className="btn impyesBtn" onClick={() => handleLoginApi()}>
                        Yes
                    </button>
                </Modal.Footer>
            </Modal>
            {/* login conformation modal end */}
        </>
    );
};

export default ImpersonateUserTable;
