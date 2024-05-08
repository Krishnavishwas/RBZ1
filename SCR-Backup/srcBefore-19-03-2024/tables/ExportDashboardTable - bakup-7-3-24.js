import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from "moment";
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import ExportDashboardViewDetails from "../components/ExportDashboardViewDetails";
import ExportDashboardEditDetails from "../components/ExportDashboardEditDetails";
import { toast } from "react-toastify";

const ExportDashboardTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");

  const [exportdata, setexportdata] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [allcomment, setallcomment]= useState([]);
  const [applicationstaus, setapplicationstaus] = useState("10");
 const [userRole, setUserrole] = useState([]);
 const [asignUser, setAsignUser] = useState([]);
 const [SupervisorRoleId, setSupervisorRoleId] = useState("");
  const [SupervisorNameID, setSupervisorNameId] = useState("");

  const csvLinkRef = useRef();

  const EditModalClose = () => setshowEditForm(false);
  const handleFormClose = () => setShowUpdateModal(false);

  const roleID = Storage.getItem("roleIDs");

  // ----- Start Code For Open Edit Popup
  const handleClickEditModal = () => {
    setshowEditForm(true);
  };
  // ----- End Code For Open Edit Popup

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    await axios
      .post(APIURL + "ExportApplication/GetExportApplications", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
      })
      .then((res) => { 
        if (res.data.responseCode === "200") {
          setexportdata(res.data.responseData);
        }else{
          setexportdata([])
        }
      });
  };
  // ----- End Code For Geting Table List Data


  // ---- start API code for Comment

   
  //---end API code for Comment


  // ----- Start Code For Table Heading Column
  const columns = [
    {
      name: "RBZ Reference Number",
      selector: (row) => row.rbzReferenceNumber,
      sortable: true,
      searchable: true,
      width: "310px",
      cell: (row)=>( 
        <span title={row.rbzReferenceNumber}>{row.rbzReferenceNumber}</span>
    )    },
    {
      name: "Applicant Name",
      selector: (row) => row.companyName || row.name,
      sortable: true,
      searchable: true,
      width: "300px",
      cell: (row) => (
        <>
          {row.userTypeID === 1 ? (
            <span>
              <i className="bi bi-c-circle-fill text-primary"></i>
              &nbsp;&nbsp;{row.companyName}
            </span>
          ) : row.userTypeID === 2 ? (
            <span>
              <i className="bi bi-person-circle"></i>
              &nbsp;&nbsp;{row.name}
            </span>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      name: "Submitted Date",
      selector: (row) => row.applicationSubmittedDate,
      sortable: true,
      width: "180px",
      cell:(row)=><span>{moment(row.applicationSubmittedDate).format('DD MMM YYYY')}</span>
    },

    {
      name: "Application Type",
      selector: (row) => row?.applicationType,
      cell: (row) => (
        <span title={row?.applicationType}>{row?.applicationType}</span>
      ),
      sortable: true,
      width: "320px",
    },
    {
      name: "Amount",
      selector: (row) => row?.amount,
      cell: (row) => (
        <span title={row?.amount}>
          <b>{row?.currencyCode}</b> {row?.amount}
        </span>
      ),
      sortable: true,
      width: "180px",
    },
    {
      name: "Status",
      selector: (row) =>
        row.status == 0 ? "Draft" : "Submitted to bank Analyst",
      sortable: true,
      width: "190px",
    },

    {
      name: "Action",
      // selector: row => row.Details,
      cell: (row) => [
        <Link
          onClick={() => {
            handleViewData(row.id);
            GetHandelDetail(row?.rbzReferenceNumber, row.id);
          }}
          className="mr-1"
        >
          <b>
            <i className="bi bi-eye"></i>
          </b>
        </Link>,
        <button
          key={row.title}
          onClick={() => {
            handleClickEditModal(row.title);
            GetHandelDetail(row?.rbzReferenceNumber, row.id);
            GetRoleHandle(applicationstaus)
          }}
          className="edit-btn"
        >
          <i className="bi bi-pencil"></i>
        </button>,
      ],
    },
  ];
  // ----- End Code For Table Heading Column

  // ----- Start Code For Open Poup
  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };
  // ----- End Code For Open Poup

  // ----- Start Code For Geting Table Data
  const GetHandelDetail = async (rbzrefnumber, id) => {
    await axios
      .post(APIURL + "ExportApplication/GetRequestInfoByApplicationID", {
        RBZReferenceNumber: `${rbzrefnumber}`,
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setApplicationDetail(res.data.responseData);
        } else {
          setApplicationmessage(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });

      await axios.post(APIURL + "ExportApplication/GetApplicationActivityByApplicationID",{
        ID:id
      })
      .then((res)=>{
        if(res.data.responseCode == 200){
          setallcomment(res.data.responseData)
        }
        else{
          setallcomment([])
        }
      })
      .catch((err)=>{
        console.log(err)
      })
  };
  // ----- End Code For Geting Table Data

  // ----- Start Code For Search Table Data
  const filteredData = exportdata?.filter(
    (item) =>
      item?.rbzReferenceNumber
        ?.toLowerCase()
        .includes(searchText?.toLowerCase()) ||
      item?.companyName?.toString().includes(searchText) ||
      item?.supervisorName?.toString().includes(searchText) ||
      item?.amount?.toString().includes(searchText) ||
      item?.name?.toString().includes(searchText) ||
      moment(item?.applicationSubmittedDate)
        .format("DD:MM:YYYY")
        ?.toString()
        .includes(searchText) ||
      item?.applicationType?.toString().includes(searchText) ||
      item?.currencyName?.toString().includes(searchText) ||
      item?.status?.toString().includes(searchText)
  );
  // ----- End Code For Search Table Data


  const ChangeApplicationStatus = (e) => {
    const values = e.target.value;
    setapplicationstaus(values);
  };

  

  const supervisorHangechange = (e) => {
    const { value } = e.target;
    GetRoleHandle()
    if (value == "") {
      setSupervisorNameId("");
      setSupervisorRoleId("");
      
    } else {
      // const { name, id } = JSON?.parse(value);

      // setSupervisorNameId(name);
      setSupervisorRoleId(value);
    }
  };

  const GetRoleHandle = async(id)=>{  
    await axios.post(APIURL + "Master/GetRoles",{
      RoleID:roleID,
      Status:applicationstaus
    })
    .then((res)=>{
      console.log("res--roles", res)
      if(res.data.responseCode == 200){
        setUserrole(res.data.responseData) 
        axios.post(APIURL + "User/GetUsersByRoleID",{
          RoleID:SupervisorRoleId,
          UserID:useId         
        })
        .then((res)=>{
          console.log("res--users", res)
          if(res.data.responseCode == 200){
            setAsignUser(res.data.responseData)
          }
          else{
            setAsignUser([])
          }
        })
        .catch((err)=>{
          console.log(err)
        })

      }
      else{
        setUserrole([])
        setAsignUser([])
      }
    })
    .catch((err)=>{
      console.log(err)
    })

  }
  console.log("SupervisorRoleId", SupervisorRoleId)
  console.log("asignUser", asignUser)
  console.log("userRole", userRole)

  useEffect(() => {
    handleData();
  }, []);

console.log("applicationDetail", applicationDetail)

  return (
    <>
      {exportdata.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          <DataTable
            defaultSortFieldId={3}
            defaultSortAsc={false}
            columns={columns}
            data={filteredData}
            paginationRowsPerPageOptions={[10, 50, 100]}
            pagination
            highlightOnHover
            className="exporttable"
            dense
            subHeader
            subHeaderComponent={
              <div className="tablesearch">
                <div className="tablesearch_bx">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                {/* <div className="table-btn-bx">
                                    <button onClick={handleExportExcel} disabled={!filteredData.length}>
                                        Export to Excel
                                    </button>
                                </div> */}
              </div>
            }
          />

          <Modal
            show={showUpdateModal}
            onHide={handleFormClose}
            backdrop="static"
            className="max-width-600"
          >
            <div className="application-box">
              <div className="login_inner">
                <div class="login_form ">
                  <h5>
                    {" "}
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title>View Export Request</Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ExportDashboardViewDetails
                      applicationDetail={applicationDetail}
                      // applicationmessage={applicationmessage}
                      handleFormClose={handleFormClose}
                      allcomment={allcomment}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            show={showEditForm}
            onHide={EditModalClose}
            backdrop="static"
            className="max-width-600"
          >
            <div className="application-box">
              <div className="login_inner">
                <div class="login_form ">
                  <h5> 
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title>Edit Export Request --   {applicationDetail?.rbzReferenceNumber
          ? applicationDetail.rbzReferenceNumber  : ""}</Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ExportDashboardEditDetails
                      applicationDetail={applicationDetail}
                      setApplicationDetail={setApplicationDetail}
                      EditModalClose={EditModalClose} 
                      setexportdata={setexportdata}
                      handleData={handleData}
                      allcomment={allcomment}
                      GetRoleHandle={GetRoleHandle}
                      supervisorHangechange={supervisorHangechange}
                      SupervisorNameID={SupervisorNameID}
                      SupervisorRoleId={SupervisorRoleId}
                      setUserrole={setUserrole}
                      userRole={userRole}
                      asignUser={asignUser}
                      ChangeApplicationStatus={ChangeApplicationStatus}
                      applicationstaus={applicationstaus}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default ExportDashboardTable;
