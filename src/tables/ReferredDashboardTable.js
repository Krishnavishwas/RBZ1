import React, { useState, useRef, useEffect } from "react";
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
import { TailSpin } from "react-loader-spinner";
import { Paginator } from "primereact/paginator";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import ImportOtherDepartmentViewDetails from "../components/ImportOtherDepartmentViewDetails";
import ImportOtherDepartmentEditDetails from "../components/ImportOtherDepartmentEditDetails";
import ExportOtherDepartmentEditDetails from "../components/ExportOtherDepartmentEditDetails";
import ExportOtherDepartmentViewDetails from "../components/ExportOtherDepartmentViewDetails";
import FINOtherDepartmentViewDetails from "../components/FINOtherDepartmentViewDetails";
import FINOtherDepartmentEditDetails from "../components/FINOtherDepartmentEditDetails";

const ReferredDashboardTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const bankID = Storage.getItem("bankID");
  const menuname = Storage.getItem("menuname");

  const DeptID =
    menuname === "Exports"
      ? "2"
      : menuname === "Imports"
      ? "3"
      : menuname === "Foreign Investments"
      ? "4"
      : menuname === "Inspectorate"
      ? "5"
      : "";

  const [ExportsapproveRequests, setExportsapproveRequests] = useState([]);
  const [ExportsapproveAllRequests, setExportsapproveAllRequests] = useState(
    []
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showExportUpdateModal, setExportShowUpdateModal] = useState(false);
  const [showFINUpdateModal, setFINShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [tatHistory, setTatHistory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allcomment, setallcomment] = useState([]);
  const [noDataComment, setNoDataComment] = useState([]);
  const [userRole, setUserrole] = useState([]);
  const [responceCount, setresponceCount] = useState([]);
  const [nextlevelvalue, setnextlevelvalue] = useState("");
  const [showdataLoader, setshowdataloader] = useState(false);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showExportEditForm, setshowExportEditForm] = useState(false);
  const [showFINEditForm, setshowFINEditForm] = useState(false);
  const [AssignUserID, setAssignUserID] = useState("");
  const [asignUser, setAsignUser] = useState([]);
  const [Actiondata, setActiondata] = useState([]);

  const [applicationstaus, setapplicationstaus] = useState(
    applicationDetail?.applicationStatus
      ? `${applicationDetail?.applicationStatus}`
      : "0"
  );
  const [SupervisorRoleId, setSupervisorRoleId] = useState("");
  const [loader, setLoader] = useState("");
  const [pageLoader, setPageLoader] = useState("");
  const [tabDepId, setTabDepId] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    companyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bankName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tinNumber: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const csvLinkRef = useRef();
  FilterService.register("custom_activity", (value, filters) => {
    const [from, to] = filters ?? [null, null];
    if (from === null && to === null) return true;
    if (from !== null && to === null) return from <= value;
    if (from === null && to !== null) return value <= to;
    return from <= value && value <= to;
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleFormClose = () => {
    if (tabDepId == "2") {
      setExportShowUpdateModal(false);
    } else if (tabDepId == "3") {
      setShowUpdateModal(false);
    } else if (tabDepId == "4") {
      setFINShowUpdateModal(false);
    }
  };

  const action = (rowData) => {
    return (
      <>
        <i
          className="pi pi-eye"
          style={{ padding: "12px", cursor: "pointer" }}
          onClick={() => {
            handleViewData(rowData.id);
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

        <i
          className="pi pi-user-edit"
          style={{ cursor: "pointer" }}
          key={rowData.title}
          onClick={() => {
            handleClickEditModal(rowData.title);
            GetHandelDetail(rowData?.rbzReferenceNumber, rowData.id);
            GetRoleHandle(applicationstaus);
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

  const GetRoleHandle = async (id) => {
    setUserrole([]);
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: rollId,
        Status: `${id}`,
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

  const supervisorHangechangeRole = (e) => {
    const { value } = e.target;
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
          DepartmentID: "3",
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

  const supervisorHangechange = (e) => {
    const { name, value } = e.target;
    if (value == "") {
      setAssignUserID(null);
    } else {
      setAssignUserID(value);
    }
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

  const amountwithCurrency = (rowData) => {
    return (
      <span>
        {rowData.currencyCode}&nbsp;{rowData.amount?.toLocaleString()}
      </span>
    );
  };

  const submittedDate = (rowData) => {
    return (
      <span>
        {moment(rowData.applicationSubmittedDate).format("DD MMM YYYY")}
      </span>
    );
  };

  const handleData = async () => {
    setPageLoader(true);
    await axios
      .post(APIURL + "ReferredApplication/GetReferredApplications", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
        DepartmentID: tabDepId,
        ReferredDepartmentID: DeptID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setPageLoader(false);
          setExportsapproveRequests(res.data.responseData);
        } else if (res.data.responseCode === "401") {
          setExportsapproveRequests([]);
          setPageLoader(false);
        }
      });
  };

  useEffect(() => {
    setTabDepId(DeptID == "2" ? "3" : "2");
    handleData();
  }, [DeptID]);

  const handleViewData = (id) => {
    if (tabDepId == "2") {
      setExportShowUpdateModal(true);
    } else if (tabDepId == "3") {
      setShowUpdateModal(true);
    } else if (tabDepId == "4") {
      setFINShowUpdateModal(true);
    }
  };

  const handleClickEditModal = () => {
    if (tabDepId == "2") {
      setshowExportEditForm(true);
    } else if (tabDepId == "3") {
      setshowEditForm(true);
    } else if (tabDepId == "4") {
      setshowFINEditForm(true);
    }
  };

  const EditModalClose = () => {
    if (tabDepId == "2") {
      setshowExportEditForm(false);
    } else if (tabDepId == "3") {
      setshowEditForm(false);
    } else if (tabDepId == "4") {
      setshowFINEditForm(false);
    }
    setnextlevelvalue("");
    setapplicationstaus("0");
  };

  const GetHandelDetail = async (rbzrefnumber, id) => {
    setLoading(true);
    await axios
      .post(APIURL + "ReferredApplication/GetReferredInfoByApplicationID", {
        RBZReferenceNumber: `${rbzrefnumber}`,
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setLoading(false);
          setApplicationDetail(res.data.responseData);
        } else {
          setLoading(false);
          setApplicationmessage(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "ReferredApplication/GetNewCommentsReferred", {
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
      .post(APIURL + "ReferredApplication/GetReferredApplicationHistory", {
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
      .post(APIURL + "ReferredApplication/GetReferredActionsByApplicationID", {
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
      .post(APIURL + "ReferredApplication/GetReferredCommentsInfoByRoleID", {
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
      .post(APIURL + "ReferredApplication/CountByApplicationIDReferred", {
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

  //------tabs state start
  const tabHeader = (
    <div className="application-tab w-100 mt-4">
      <ul className="nav nav-pills mb-3">
        {DeptID !== "2" && (
          <li className="nav-item">
            <a
              className={tabDepId == "2" ? "nav-link active" : "nav-link"}
              onClick={() => setTabDepId("2")}
            >
              Exports
            </a>
          </li>
        )}
        {DeptID !== "3" && (
          <li className="nav-item">
            <a
              className={tabDepId == "3" ? "nav-link active" : "nav-link"}
              onClick={() => setTabDepId("3")}
            >
              Imports
            </a>
          </li>
        )}
        {DeptID !== "4" && (
          <li className="nav-item">
            <a
              className={tabDepId == "4" ? "nav-link active" : "nav-link"}
              onClick={() => setTabDepId("4")}
            >
              Foreign Investments
            </a>
          </li>
        )}
        {DeptID !== "5" && (
          <li className="nav-item">
            <a
              className={tabDepId == "5" ? "nav-link active" : "nav-link"}
              onClick={() => setTabDepId("5")}
            >
              Inspectorate
            </a>
          </li>
        )}
      </ul>
    </div>
  );

  const renderHeader = () => {
    return (
      <div className="d-flex align-items-center justify-content-between">
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

  const header = renderHeader();

  useEffect(() => {
    handleData();
    setExportsapproveRequests([]);
  }, [tabDepId]);

  return (
    <>
      {tabHeader}
      {pageLoader == true ? (
        <label className="outerloader2">
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : ExportsapproveRequests?.length == 0 ||
        ExportsapproveRequests?.length == 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          {loading == true ? (
            <label className="outerloader2">
              <span className="loader"></span>
              <span className="loaderwait">Please Wait...</span>
            </label>
          ) : (
            <>
              <div className="pagination-top pagination-top-right"></div>
              <div className="clear"></div>
              <DataTable
                value={ExportsapproveRequests}
                scrollable
                scrollHeight="600px"
                rowHover
                filters={filters}
                paginator={ExportsapproveRequests.length > 10 ? true : false}
                paginatorPosition={"both"}
                paginatorLeft
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
                <Column
                  field="applicationType"
                  header="Application Type"
                  sortable
                  style={{ width: "200px" }}
                ></Column>
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
                  alignFrozen="right"
                  body={action}
                ></Column>
              </DataTable>
            </>
          )}

          {/* Import View and Edit popup start */}
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
                        View Import Referred Request --{" "}
                        <big>{applicationDetail?.rbzReferenceNumber}</big>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ImportOtherDepartmentViewDetails
                      applicationDetail={applicationDetail}
                      handleFormClose={handleFormClose}
                      allcomment={allcomment}
                      tatHistory={tatHistory}
                      noDataComment={noDataComment}
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
                              applicationDetail?.parentApplicationID == 0
                                ? "col-md-12"
                                : "col-md-6"
                            }
                            style={{ alignItems: "center" }}
                          >
                            Edit Import Referred Request --{" "}
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
                    <ImportOtherDepartmentEditDetails
                      applicationDetail={applicationDetail}
                      setApplicationDetail={setApplicationDetail}
                      EditModalClose={EditModalClose}
                      setImportData={setExportsapproveRequests}
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
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>
          {/* Import View and Edit popup end */}

          {/* Export View and Edit popup start */}
          <Modal
            show={showExportUpdateModal}
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
                        View Export Referred Request --{" "}
                        <big>{applicationDetail?.rbzReferenceNumber}</big>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ExportOtherDepartmentViewDetails
                      applicationDetail={applicationDetail}
                      handleFormClose={handleFormClose}
                      allcomment={allcomment}
                      tatHistory={tatHistory}
                      noDataComment={noDataComment}
                      responceCount={responceCount}
                      showdataLoader={loading}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            show={showExportEditForm}
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
                              applicationDetail?.parentApplicationID == 0
                                ? "col-md-12"
                                : "col-md-6"
                            }
                            style={{ alignItems: "center" }}
                          >
                            Edit Export Referred Request --{" "}
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
                    <ExportOtherDepartmentEditDetails
                      applicationDetail={applicationDetail}
                      setApplicationDetail={setApplicationDetail}
                      EditModalClose={EditModalClose}
                      setImportData={setExportsapproveRequests}
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
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>
          {/* Export View and Edit popup end */}

          {/* FIN View and Edit popup start */}
          <Modal
            show={showFINUpdateModal}
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
                        View Foreign Investments Referred Request --{" "}
                        <big>{applicationDetail?.rbzReferenceNumber}</big>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <FINOtherDepartmentViewDetails
                      applicationDetail={applicationDetail}
                      handleFormClose={handleFormClose}
                      allcomment={allcomment}
                      tatHistory={tatHistory}
                      noDataComment={noDataComment}
                      responceCount={responceCount}
                      showdataLoader={loading}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            show={showFINEditForm}
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
                              applicationDetail?.parentApplicationID == 0
                                ? "col-md-12"
                                : "col-md-6"
                            }
                            style={{ alignItems: "center" }}
                          >
                            Edit Foreign Investments Referred Request --{" "}
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
                    <FINOtherDepartmentEditDetails
                      applicationDetail={applicationDetail}
                      setApplicationDetail={setApplicationDetail}
                      EditModalClose={EditModalClose}
                      setImportData={setExportsapproveRequests}
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
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>
          {/* FIN View and Edit popup end */}
        </>
      )}
    </>
  );
};
export default ReferredDashboardTable;
