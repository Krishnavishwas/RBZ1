import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import Modal from "react-bootstrap/Modal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterService } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import ExportDashboardViewDetails from "../components/ExportDashboardViewDetails";
import ExportDashboardRenewEditDetails from "../components/ExportDashboardRenewEditDetails";

const ExportCompletedReturnTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const bankID = Storage.getItem("bankID");
  const menuname = Storage.getItem("menuname");
  const submenuname = Storage.getItem("submenuname");

  const [data, setData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [tatHistory, setTatHistory] = useState([]);
  const [allcomment, setallcomment] = useState([]);
  const [Actiondata, setActiondata] = useState([]);
  const [noDataComment, setNoDataComment] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [nextlevelvalue, setnextlevelvalue] = useState("");
  const [responceCount, setresponceCount] = useState([]);
  const [exportdata, setexportdata] = useState([]);
  const [showdataLoader, setshowdataloader] = useState(false);
  const [userRole, setUserrole] = useState([]);
  const [AssignUserID, setAssignUserID] = useState("");
  const [SupervisorRoleId, setSupervisorRoleId] = useState("");
  const [asignUser, setAsignUser] = useState([]);
  const [IsDeferred, setIsDeferred] = useState("0");
  const [applicationstaus, setapplicationstaus] = useState(
    applicationDetail?.applicationStatus
      ? `${applicationDetail?.applicationStatus}`
      : "0"
  );

  const handleFormClose = () => setShowUpdateModal(false);

  FilterService.register("custom_activity", (value, filters) => {
    const [from, to] = filters ?? [null, null];
    if (from === null && to === null) return true;
    if (from !== null && to === null) return from <= value;
    if (from === null && to !== null) return value <= to;
    return from <= value && value <= to;
  });

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    companyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bankName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tinNumber: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
      </div>
    );
  };

  const handleClickEditModal = () => {
    setshowEditForm(true);
  };

  const EditModalClose = () => {
    setshowEditForm(false);
    setnextlevelvalue("");
  };

  const action = (rowData) => {
    return (
      <>
        <i
          className="pi pi-eye"
          style={{ padding: "12px", cursor: "pointer" }}
          onClick={() => {
            console.log("data===?", data);
            handleViewData(rowData.id); //modal open
            GetHandelDetail(rowData?.rbzReferenceNumber, rowData.id);
            GetApplicationCount(rowData.id);
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "var(--primary-color)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "";
          }}
        ></i>
      </>
    );
  };

  const applicantName = (rowData) => {
    return (
      <>
        {rowData.applicantType === 1 ? (
          <span>
            <i className="bi bi-c-circle-fill text-primary"></i>
            &nbsp;&nbsp;{rowData.companyName}
          </span>
        ) : rowData.applicantType === 2 ? (
          <span>
            <i className="bi bi-person-circle"></i>
            &nbsp;&nbsp;{rowData.name}
          </span>
        ) : (
          ""
        )}
      </>
    );
  };

  const submittedDate = (rowData) => {
    return (
      <span>
        {moment(rowData.applicationSubmittedDate).format("DD MMM YYYY")}
      </span>
    );
  };

  const amountwithCurrency = (rowData) => {
    return (
      <span>
        {rowData.currencyCode}&nbsp;{rowData.amount?.toLocaleString()}
      </span>
    );
  };

  const header = renderHeader();

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    await axios
      .post(APIURL + "ExportApplication/CompletedReturnsExport", {
        UserID: useId.replace(/"/g, ""),
        Status: "10",
        RoleID: rollId,
        DataType: "All",
        BankID: bankID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setData(res.data.responseData);
        }
      });
  };

  // ----- End Code For Geting Table List Data

  // ----- Start Code For Open Poup
  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };
  // ----- End Code For Open Poup

  // ----- Start Code For Geting Table Data
  const GetHandelDetail = async (rbzrefnumber, id) => {
    await axios
      // .post(APIURL + "ExportApplication/GetRequestInfoByApplicationID", {
      .post(APIURL + "ReturnApplication/GetReturnInfoByApplicationID", {
        ID: id,
        // RBZReferenceNumber: `${rbzrefnumber}`,
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

    await axios
      // .post(APIURL + "ExportApplication/GetNewComments", {
      .post(APIURL + "ReturnApplication/GetNewCommentsReturns", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setallcomment(res.data.responseData);
        } else {
          setallcomment([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      // .post(APIURL + "ExportApplication/GetApplicationHistory", {
      .post(APIURL + "ReturnApplication/GetApplicationHistoryReturns", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setTatHistory(res.data.responseData);
        } else {
          setTatHistory([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      // .post(APIURL + "ExportApplication/GetApplicationActionsByApplicationID", {
      .post(APIURL + "ReturnApplication/GetActionsByApplicationIDReturns", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setActiondata(res.data.responseData);
        } else {
          setActiondata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // --------------------------vishwas start----------------------------
    await axios
      // .post(APIURL + "ExportApplication/GetCommentsInfoByRoleID", {
      .post(APIURL + "ReturnApplication/GetCommentsInfoByRoleIDReturns", {
        ApplicationID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setNoDataComment(res.data.responseData);
        } else {
          setNoDataComment([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //---------------------------vishwas end------------------------------
  };

  const GetApplicationCount = async (id) => {
    await axios
      // .post(APIURL + "ExportApplication/CountByApplicationID", {
      .post(APIURL + "ReturnApplication/CountByApplicationIDReturns", {
        ApplicationID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setresponceCount(res.data.responseData);
        } else {
          setresponceCount([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ----- End Code For Geting Table Data

  // ----- Start Code For Search Table Data
  const filteredData = data?.filter(
    (item) =>
      item?.rbzReferenceNumber
        ?.toLowerCase()
        .includes(searchText?.toLowerCase()) ||
      item?.name?.toLowerCase().toString().includes(searchText) ||
      item?.supervisorName?.toLowerCase().toString().includes(searchText) ||
      item?.amount?.toString().includes(searchText) ||
      item?.statusName?.toLowerCase().toString().includes(searchText) ||
      moment(item?.applicationSubmittedDate)
        .format("DD:MM:YYYY")
        ?.toString()
        .includes(searchText) ||
      item?.applicationType?.toLowerCase().toString().includes(searchText) ||
      item?.currencyName?.toLowerCase().toString().includes(searchText)
  );
  // ----- End Code For Search Table Data

  useEffect(() => {
    handleData();
    setData([]);
  }, []);

  const supervisorHangechangeBankuser = (e) => {
    const { value } = e.target;
    if (value == "") {
      setAssignUserID("");
      setSupervisorRoleId("");
    } else {
      const { userID, roleID } = JSON?.parse(value);
      setAssignUserID(userID);
      setSupervisorRoleId(roleID);
    }
  };

  const supervisorHangechangeRole = (e) => {
    const { name, value } = e.target;
    if (value == "90A" || value == "") {
      setAssignUserID("");
      setSupervisorRoleId("");
      setAsignUser([]);
    } else {
      axios
        .post(APIURL + "User/GetUsersByRoleID", {
          RoleID:
            value == "10" || value == "40" || value == "25" || value == "30"
              ? parseInt(rollId) + 1
              : value == "15" ||
                value == "5" ||
                value == "6" ||
                value == "7" ||
                value == "8"
              ? value
              : rollId,
          DepartmentID: "2",
          UserID: useId.replace(/"/g, ""),
        })
        .then((res) => {
          if (res.data.responseCode == 200) {
            setAsignUser(res.data.responseData);
          } else {
            setSupervisorRoleId("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const supervisorHangechange = (e) => {
    const { name, value } = e.target;
    if (value == "") {
      setAssignUserID(null);
    } else {
      setAssignUserID(value);
    }
  };

  const GetRoleHandle = async (id) => {
    setUserrole([]);
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: rollId,
        Status: `${id}`,
        DepartmentID: "7",
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setUserrole(res.data.responseData);
        } else {
          setUserrole([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {data?.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          <div>
            <DataTable
              value={data}
              scrollable
              scrollHeight="600px"
              className="mt-4"
              paginator={data.length > 10 ? true : false}
              filters={filters}
              paginatorPosition={"both"}
              paginatorLeft
              rowHover
              rows={10}
              dataKey="id"
              rowsPerPageOptions={[10, 50, 100]}
              globalFilterFields={[
                "rbzReferenceNumber",
                "name",
                "companyName",
                "applicationType",
                "amount",
                "statusName",
              ]}
              emptyMessage="No Data found."
              header={header}
            >
              <Column
                field="rbzReferenceNumber"
                header="RBZ Reference Number"
                sortable
                style={{ width: "220px" }}
              ></Column>
              <Column
                field="companyName"
                header="Applicant Name"
                sortable
                style={{ width: "220px" }}
                body={applicantName}
              ></Column>
              <Column
                field="applicationSubmittedDate"
                header="Submitted Date"
                sortable
                style={{ width: "140px" }}
                body={submittedDate}
              ></Column>
              {/* <Column
                field="applicationType"
                header="Application Type"
                sortable
                style={{ width: "200px" }}
              ></Column> */}
              <Column
                field=""
                header="Amount"
                sortable
                body={amountwithCurrency}
                style={{ width: "150px" }}
              ></Column>
              <Column
                field="statusName"
                header="Status"
                sortable
                style={{ width: "200px" }}
              ></Column>
              <Column
                field=""
                header="Action"
                style={{ width: "200px" }}
                frozen
                // alignFrozen="right"
                body={action}
              ></Column>
            </DataTable>
          </div>

          <Modal
            show={showUpdateModal}
            onHide={handleFormClose}
            backdrop="static"
            className="max-width-600"
          >
            <div className="application-box">
              <div className="login_inner">
                <div className="login_form ">
                  <h5>
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title>
                        View Export Request --{" "}
                        <big>{applicationDetail?.rbzReferenceNumber}</big>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ExportDashboardViewDetails
                      applicationDetail={applicationDetail}
                      handleFormClose={handleFormClose}
                      allcomment={allcomment}
                      noDataComment={noDataComment}
                      tatHistory={tatHistory}
                      Actiondata={Actiondata}
                      responceCount={responceCount}
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
                <div className="login_form ">
                  <h5>
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title style={{ width: "100%" }}>
                        <div className="row">
                          <div
                            className={
                              applicationDetail?.parentApplicationID == 0 &&
                              applicationDetail?.referredApplicationID == 0
                                ? "col-md-12"
                                : "col-md-6"
                            }
                            style={{ alignItems: "center" }}
                          >
                            Edit{" "}
                            {menuname === "Exports" &&
                            submenuname === "Pending Returns"
                              ? "Returns"
                              : ""}{" "}
                            Export Request --{" "}
                            <big>
                              {applicationDetail?.rbzReferenceNumber
                                ? applicationDetail.rbzReferenceNumber
                                : ""}
                            </big>
                          </div>
                        </div>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ExportDashboardRenewEditDetails
                      applicationDetail={applicationDetail}
                      setApplicationDetail={setApplicationDetail}
                      EditModalClose={EditModalClose}
                      setexportdata={setexportdata}
                      handleData={handleData}
                      showdataLoader={showdataLoader}
                      allcomment={allcomment}
                      GetRoleHandle={GetRoleHandle}
                      setapplicationstaus={setapplicationstaus}
                      applicationstaus={applicationstaus}
                      setnextlevelvalue={setnextlevelvalue}
                      nextlevelvalue={nextlevelvalue}
                      asignUser={asignUser}
                      userRole={userRole}
                      responceCount={responceCount}
                      setAsignUser={setAsignUser}
                      supervisorHangechange={supervisorHangechange}
                      supervisorHangechangeBankuser={
                        supervisorHangechangeBankuser
                      }
                      tatHistory={tatHistory}
                      AssignUserID={AssignUserID}
                      setAssignUserID={setAssignUserID}
                      Actiondata={Actiondata}
                      SupervisorRoleId={SupervisorRoleId}
                      supervisorHangechangeRole={supervisorHangechangeRole}
                      setSupervisorRoleId={setSupervisorRoleId}
                      noDataComment={noDataComment}
                      IsDeferred={IsDeferred}
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
export default ExportCompletedReturnTable;
