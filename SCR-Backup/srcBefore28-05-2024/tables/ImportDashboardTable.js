import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import moment from "moment";
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import ImportDashboardViewDetails from "../components/ImportDashboardViewDetails";
import ImportDashboardEditDetails from "../components/ImportDashboardEditDetails";
import { Column } from "primereact/column";
import { TailSpin } from "react-loader-spinner";
import { FilterMatchMode, FilterService } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";

const ImportDashboardTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const roleName = Storage.getItem("roleName");

  const [importData, setImportData] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tatHistory, setTatHistory] = useState([]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [allcomment, setallcomment] = useState([]);
  const [delegateComment, setDelegateComment] = useState("");
  const [delegateNote, setDelegateNote] = useState("");
  const [asignUser, setAsignUser] = useState([]);
  const [Actiondata, setActiondata] = useState([]);
  const [noDataComment, setNoDataComment] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [applicationstaus, setapplicationstaus] = useState(
    applicationDetail?.applicationStatus
      ? `${applicationDetail?.applicationStatus}`
      : "0"
  );
  const [showDelegateModal, setshowDelegateModal] = useState(false);
  const [checkdeligateuser, setcheckdeligateuser] = useState(0);
  const [selectedAppliation, setSelectedAppliation] = useState(null);
  const [responceCount, setresponceCount] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [userRole, setUserrole] = useState([]);
  const [geninfoFile, setgeninfoFile] = useState([]);
  const [showdataLoader, setshowdataloader] = useState(false);
  const [nextlevelvalue, setnextlevelvalue] = useState("");
  const [delegateUserID, setDelegateUserID] = useState("");
  const [delegateAsignUser, setDelegateAsignUser] = useState([]);
  const [SupervisorRoleId, setSupervisorRoleId] = useState("");
  const [AssignUserID, setAssignUserID] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    companyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bankName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tinNumber: { value: null, matchMode: FilterMatchMode.IN },
  });
  const roleID = Storage.getItem("roleIDs");

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

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
        {roleID >= 5 || roleID == 3 ? (
          <div
            className="form-footer mt-0 d-block text-end bulkdelegateBtn"
            style={{ float: "left", marginLeft: "20px" }}
          >
            <button
              type="button"
              style={{ float: "left", borderRadius: "5px" }}
              onClick={() => {
                handleClickDelegateModal();
                setcheckdeligateuser(!checkdeligateuser);
              }}
              className="login"
              disabled={selectedAppliation?.length ? false : true}
            >
              Bulk Delegate
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const action = (rowData) => {
    return (
      <>
        <i
          className="pi pi-eye"
          style={{
            padding: "10px 5px",
            marginRight: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            handleViewData(rowData.id);
            GetHandelDetail(rowData.id, rowData?.rbzReferenceNumber);
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
            GetHandelDetail(rowData.id, rowData?.rbzReferenceNumber);
            GetRoleHandle(applicationstaus);
            handleData();
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
        {rowData.applicantType === 1 || rowData.userTypeID === 1 ? (
          <span>
            <i className="bi bi-c-circle-fill text-primary"></i>
            &nbsp;&nbsp;{rowData.companyName}
          </span>
        ) : rowData.applicantType === 2 || rowData.userTypeID == 2 ? (
          <span>
            <i className="bi bi-person-circle"></i>
            &nbsp;&nbsp;{rowData.name}
          </span>
        ) : (
          "--"
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

  const header = renderHeader();

  const handleClickDelegateModal = () => {
    setshowDelegateModal(true);
  };

  useEffect(() => {
    setapplicationstaus(
      applicationDetail?.analystRecommendation
        ? applicationDetail?.analystRecommendation
        : "0"
    );
  }, [applicationDetail]);

  const GetRoleHandle = async (id) => {
    setUserrole([]);
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: roleID,
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

  const GetApplicationCount = async (id) => {
    await axios
      .post(APIURL + "ImportApplication/CountByApplicationIDImport", {
        ApplicationID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setresponceCount(res.data.responseData);
        } else {
          setresponceCount({});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    await axios
      .post(APIURL + "ImportApplication/GetImportApplications", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setLoading(false);
          setImportData(res.data.responseData);
        }
      });
  };
  // ----- End Code For Geting Table List Data

  // ----- Start Code For Table Heading Column

  // ----- End Code For Table Heading Column

  // ----- Start Code For Open Poup
  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };

  const EditModalClose = () => {
    setshowEditForm(false);
    setnextlevelvalue("");
  };
  const handleFormClose = () => setShowUpdateModal(false);

  // ----- Start Code For Open Edit Popup
  const handleClickEditModal = () => {
    setshowEditForm(true);
  };
  // ----- End Code For Open Poup

  // ----- Start Code For Geting Table Data
  const GetHandelDetail = async (id) => {
    setshowdataloader(true);
    await axios
      .post(APIURL + "ImportApplication/GetImportRequestInfoByApplicationID", {
        ID: `${id}`,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setApplicationDetail(res.data.responseData);
          setgeninfoFile(res.data.responseData?.attachedFiles);
          setTimeout(() => {
            setshowdataloader(false);
          }, 2000);
        } else {
          setApplicationmessage(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "ImportApplication/GetImportApplicationHistory", {
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
      .post(APIURL + "ImportApplication/GetImportCommentsInfoByRoleID", {
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

    await axios
      .post(APIURL + "ImportApplication/GetNewCommentsImport", {
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
      .post(APIURL + "ImportApplication/GetActionsByApplicationID", {
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
  };
  // ----- End Code For Geting Table Data

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
              ? parseInt(roleID) + 1
              : value == "15" ||
                value == "5" ||
                value == "6" ||
                value == "7" ||
                value == "8"
              ? // ? parseInt(roleID) - 1
                value
              : roleID,
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

  useEffect(() => {
    handleData();
  }, []);

  const filteredData = importData?.filter(
    (item) =>
      item?.rbzReferenceNumber
        ?.toLowerCase()
        .includes(searchText?.toLowerCase()) ||
      item?.name?.toLowerCase().toString().includes(searchText) ||
      item?.supervisorName?.toLowerCase().toString().includes(searchText) ||
      item?.amount?.toString().includes(searchText) ||
      item?.name?.toLowerCase().toString().includes(searchText) ||
      moment(item?.applicationSubmittedDate)
        .format("DD:MM:YYYY")
        ?.toString()
        .includes(searchText) ||
      item?.applicationType?.toLowerCase().toString().includes(searchText) ||
      item?.currencyName?.toLowerCase().toString().includes(searchText)
  );

  const delegatechangeRole = () => {
    axios
      .post(APIURL + "User/GetUsersByRoleID", {
        RoleID: roleID,
        DepartmentID: "3",
        UserID: useId.replace(/"/g, ""),
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setDelegateAsignUser(res.data.responseData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    delegatechangeRole();
  }, [checkdeligateuser]);

  const delegateValues = selectedAppliation?.map((v) => {
    return {
      ApplicationID: v.id,
      // status: v.status,
      status:
        roleID == 3
          ? "270"
          : roleID == 5
          ? "240"
          : roleID == 6
          ? "245"
          : roleID == 7
          ? "250"
          : roleID == 8
          ? "255"
          : roleID == 9
          ? "260"
          : "",
      AssignedTo: delegateUserID,
      RoleID: roleID,
      AssignedToRoleID: roleID,
      Notes: delegateNote,
      Comment: delegateComment,
      CreatedBy: useId.replace(/"/g, ""),
    };
  });

  const delegateSubmit = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    axios
      .post(APIURL + "ImportApplication/BulkDelegateImport", delegateValues)
      .then((res) => {
        if (res.data.responseCode == 200) {
          setBtnLoader(false);
          DelegateModalClose();
          handleData();
          setDelegateAsignUser([]);
          setDelegateComment("");
          setDelegateNote("");
          setSelectedAppliation(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const DelegateModalClose = () => {
    setshowDelegateModal(false);
    setnextlevelvalue("");
    setDelegateAsignUser([]);
    setDelegateComment("");
    setDelegateNote("");
    setSelectedAppliation(null);
  };

  // OLD
  const [showOldModal, setShowOldModal] = useState(false);
  const [oldApplicationDetail, setOldApplicationDetail] = useState({});
  const [oldNoDataComment, setOldNoDataComment] = useState([]);
  const [oldAllcomment, setOldAllcomment] = useState([]);
  const [oldTatHistory, setOldTatHistory] = useState([]);
  const [oldActiondata, setOldActiondata] = useState([]);
  const [oldResponceCount, setOldResponceCount] = useState([]);
  const [showOldDataLoader, setShowOldDataLoader] = useState(false);

  const handleOldClose = () => setShowOldModal(false);

  const handleOldViewData = (id) => {
    setShowOldModal(true);
  };

  const GetOldHandelDetail = async (id) => {
    setShowOldDataLoader(true);
    await axios
      .post(APIURL + "ImportApplication/GetImportRequestInfoByApplicationID", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setOldApplicationDetail(res.data.responseData);
          setTimeout(() => {
            setShowOldDataLoader(false);
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "ImportApplication/GetImportCommentsInfoByRoleID", {
        ApplicationID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setOldNoDataComment(res.data.responseData);
        } else {
          setOldNoDataComment([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "ImportApplication/GetNewCommentsImport", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setOldAllcomment(res.data.responseData);
        } else {
          setOldAllcomment([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "ImportApplication/GetImportApplicationHistory", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setOldTatHistory(res.data.responseData);
        } else {
          setOldTatHistory([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "ImportApplication/GetActionsByApplicationID", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setOldActiondata(res.data.responseData);
        } else {
          setOldActiondata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const GetOldApplicationCount = async (id) => {
    await axios
      .post(APIURL + "ImportApplication/CountByApplicationIDImport", {
        ApplicationID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setOldResponceCount(res.data.responseData);
        } else {
          setOldResponceCount({});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Fetch Referred to Other Department data
  const [referredDataTrue, setreferredDataTrue] = useState(false);
  const [RODLoader, setRODLoader] = useState(false);
  const [referredData, setReferredData] = useState({});

  const GetReferredData = async (id) => {
    try {
      setRODLoader(true);
      await axios
        .post(APIURL + "ImportApplication/GetReferredImportApplicationByID", {
          ID: id,
        })
        .then((res) => {
          if (res.data.responseCode == 200) {
            setReferredData(res.data.responseData);
            setRODLoader(false);
          } else {
            setReferredData({});
            setRODLoader(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setRODLoader(false);
          setreferredDataTrue(false);
        });
    } catch (error) {
      console.log("GetReferredImportApplicationByID error - ", error);
    }
  };

  return (
    <>
      {loading === true ? (
        <label className="outerloader2">
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : (
        <>
          <DataTable
            value={filteredData}
            scrollable
            scrollHeight="500px"
            className={roleID >= 5 || roleID == 3 ? "mt-1" : "mt-1 tablehideth"}
            selection={selectedAppliation}
            onSelectionChange={(e) => setSelectedAppliation(e.value)}
            paginator={filteredData.length > 10 ? true : false}
            filters={filters}
            selectionMode="checkbox"
            paginatorPosition={"both"}
            paginatorLeft
            rows={10}
            dataKey="id"
            rowHover
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
            {roleID >= 5 || roleID == 3 ? (
              <Column
                selectionMode="multiple"
                style={{ width: "40px", cursor: "pointer" }}
                exportable={false}
              ></Column>
            ) : (
              ""
            )}
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
              header="Nature of Application"
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
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title>
                        View Import Request --{" "}
                        <big>{applicationDetail?.rbzReferenceNumber}</big>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ImportDashboardViewDetails
                      applicationDetail={applicationDetail}
                      applicationmessage={applicationmessage}
                      handleFormClose={handleFormClose}
                      allcomment={allcomment}
                      tatHistory={tatHistory}
                      geninfoFile={geninfoFile}
                      noDataComment={noDataComment}
                      showdataLoader={showdataLoader}
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
                            Edit Import Request --{" "}
                            <big>
                              {applicationDetail?.rbzReferenceNumber
                                ? applicationDetail.rbzReferenceNumber
                                : ""}
                            </big>
                          </div>
                          <div
                            className={
                              applicationDetail &&
                              applicationDetail?.parentApplicationID == 0
                                ? "d-none"
                                : "col-md-6 text-center"
                            }
                          >
                            <button
                              className={
                                applicationDetail?.parentApplicationID
                                  ? "btn btn-light viewcopybtn"
                                  : "d-none"
                              }
                              onClick={() => {
                                handleOldViewData(
                                  applicationDetail?.parentApplicationID
                                );
                                GetOldHandelDetail(
                                  applicationDetail?.parentApplicationID
                                );
                                GetOldApplicationCount(
                                  applicationDetail?.parentApplicationID
                                );
                              }}
                            >
                              View Old Application
                            </button>
                          </div>
                          <div
                            className={
                              applicationDetail &&
                              applicationDetail?.referredApplicationID == 0
                                ? "d-none"
                                : "col-md-6 text-center"
                            }
                          >
                            <button
                              className={
                                applicationDetail?.referredApplicationID
                                  ? "btn btn-light viewcopybtn"
                                  : "d-none"
                              }
                              onClick={() => {
                                referredDataTrue == false &&
                                  GetReferredData(
                                    applicationDetail?.referredApplicationID
                                  );
                                setreferredDataTrue(!referredDataTrue);
                              }}
                            >
                              View Other Department Response
                            </button>
                            <div
                              className={
                                referredDataTrue == true
                                  ? "tooltip-bx"
                                  : "d-none"
                              }
                            >
                              {RODLoader === true ? (
                                <label className="outerloader2">
                                  <span className="loader"></span>
                                  <span className="loaderwait">
                                    Please Wait...
                                  </span>
                                </label>
                              ) : (
                                <>
                                  <div className="toolinner">
                                    <label>Decision</label>{" "}
                                    <p>{referredData.statusName}</p>
                                  </div>
                                  <div className="toolinner">
                                    <label>Recommendation</label>{" "}
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: referredData.description
                                          ? referredData.description
                                          : "N/A",
                                      }}
                                    />
                                  </div>
                                  <div className="toolinner">
                                    <label>Note</label>{" "}
                                    <p>{referredData.notes}</p>
                                  </div>
                                  <div className="toolinner">
                                    <label>Comment</label>{" "}
                                    <p>{referredData.comment}</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ImportDashboardEditDetails
                      applicationDetail={applicationDetail}
                      setApplicationDetail={setApplicationDetail}
                      EditModalClose={EditModalClose}
                      setImportData={setImportData}
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

          <Modal
            show={showOldModal}
            onHide={handleOldClose}
            backdrop="static"
            className="max-width-600 oldModal-full"
          >
            <div className="application-box">
              <div className="login_inner">
                <div className="login_form ">
                  <h5>
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title>
                        View Old Export Request --{" "}
                        <big>{oldApplicationDetail?.rbzReferenceNumber}</big>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ImportDashboardViewDetails
                      applicationDetail={oldApplicationDetail}
                      handleFormClose={handleOldClose}
                      allcomment={oldAllcomment}
                      tatHistory={oldTatHistory}
                      Actiondata={oldActiondata}
                      noDataComment={oldNoDataComment}
                      showdataLoader={showOldDataLoader}
                      responceCount={oldResponceCount}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            show={showDelegateModal}
            onHide={DelegateModalClose}
            backdrop="static"
            className="max-width-400"
          >
            <div className="application-box">
              <form onSubmit={delegateSubmit}>
                <div className="login_inner">
                  <div className="login_form ">
                    <h5>
                      <Modal.Header closeButton className="p-0">
                        <Modal.Title>Bulk Delegate</Modal.Title>
                      </Modal.Header>
                    </h5>
                  </div>
                  <div className="login_form_panel">
                    <Modal.Body className="p-0">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="inner_form_new">
                            <label className="controlformV">
                              {roleName ? roleName.replace(/"/g, "") : "User"}
                            </label>
                            <div className="form-bxV">
                              <label>
                                <select
                                  name="AssignUserID"
                                  className=""
                                  onChange={(e) =>
                                    setDelegateUserID(e.target.value)
                                  }
                                >
                                  <option value="">
                                    Select{" "}
                                    {roleName
                                      ? roleName.replace(/"/g, "")
                                      : "User"}
                                  </option>
                                  {delegateAsignUser?.map((item, index) => {
                                    return (
                                      <option key={index} value={item.userID}>
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                                <span className="sspan"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="inner_form_new">
                            <label className="controlformV">
                              Notes <b className="text-danger">*</b>
                            </label>
                            <div className="form-bxV">
                              <label>
                                <textarea
                                  placeholder="Delegate Notes"
                                  name="delegateNote"
                                  onChange={(e) =>
                                    setDelegateNote(e.target.value)
                                  }
                                  required
                                />
                                <span className="sspan"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="inner_form_new">
                            <label className="controlformV">
                              Comments <b className="text-danger">*</b>
                            </label>
                            <div className="form-bxV">
                              <label>
                                <textarea
                                  placeholder="Delegate Comments"
                                  name="delegateComment"
                                  onChange={(e) =>
                                    setDelegateComment(e.target.value)
                                  }
                                  required
                                />
                                <span className="sspan"></span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                  </div>
                  <Modal.Footer className="mt-0">
                    <div className="form-footer mt-0 justify-content-center">
                      <button
                        type="submit"
                        // onClick={() => delegateSubmit()}
                        className="login"
                        disabled={delegateUserID !== "" ? false : true}
                      >
                        <span className="d-flex align-items-center justify-content-center">
                          Submit &nbsp;
                          {btnLoader ? (
                            <TailSpin
                              visible={true}
                              height="18"
                              width="18"
                              color="#fff"
                              ariaLabel="tail-spin-loading"
                              radius="1"
                              wrapperStyle={{}}
                              wrapperClass=""
                            />
                          ) : (
                            ""
                          )}
                        </span>
                      </button>
                    </div>
                  </Modal.Footer>
                </div>
              </form>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default ImportDashboardTable;
