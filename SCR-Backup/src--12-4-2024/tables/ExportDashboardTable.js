import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { FilterMatchMode, FilterService } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import moment from "moment";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import ExportDashboardViewDetails from "../components/ExportDashboardViewDetails";
import ExportDashboardEditDetails from "../components/ExportDashboardEditDetails";
import { TailSpin } from "react-loader-spinner";
const ExportDashboardTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const roleID = Storage.getItem("roleIDs");
  const roleName = Storage.getItem("roleName");

  const [exportdata, setexportdata] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [allcomment, setallcomment] = useState([]);
  const [applicationstaus, setapplicationstaus] = useState(
    applicationDetail?.applicationStatus
      ? `${applicationDetail?.applicationStatus}`
      : "0"
  );
  const [nextlevelvalue, setnextlevelvalue] = useState(""); //
  const [userRole, setUserrole] = useState([]);
  const [tatHistory, setTatHistory] = useState([]);
  const [asignUser, setAsignUser] = useState([]);
  const [SupervisorRoleId, setSupervisorRoleId] = useState("");
  const [AssignUserID, setAssignUserID] = useState("");
  const [Actiondata, setActiondata] = useState([]);
  const [selectedAppliation, setSelectedAppliation] = useState(null);
  const [showDelegateModal, setshowDelegateModal] = useState(false);
  const [delegateComment, setDelegateComment] = useState("");
  const [delegateNote, setDelegateNote] = useState("");
  const [delegateUserID, setDelegateUserID] = useState("");
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [checkdeligateuser, setcheckdeligateuser] = useState(0)
  const [data, setData] = useState([]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [delegateAsignUser, setDelegateAsignUser] = useState([]);
  const [noDataComment, setNoDataComment] = useState([]);
  const [showdataLoader, setshowdataloader] = useState(false);
  const [responceCount, setresponceCount]= useState([])
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    companyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bankName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tinNumber: { value: null, matchMode: FilterMatchMode.IN },
  });

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
              onClick={() => {handleClickDelegateModal(); setcheckdeligateuser(!checkdeligateuser)}}
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
            GetHandelDetail(rowData?.rbzReferenceNumber, rowData.id);
            GetApplicationCount(rowData.id)
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
            handleData();
            GetApplicationCount(rowData.id)
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

  const amountwithCurrency = (rowData) => {
    return (
      <span>
        {rowData.currencyCode}&nbsp;{rowData.amount}
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

  const EditModalClose = () => {
    setshowEditForm(false);
    // setapplicationstaus("0");
    setnextlevelvalue("");
  };
  const handleFormClose = () => setShowUpdateModal(false);

  // ----- Start Code For Open Edit Popup
  const handleClickEditModal = () => {
    setshowEditForm(true);
  };
  // ----- End Code For Open Edit Popup

  // ----- Start Code For Open delegate Popup
  const handleClickDelegateModal = () => {
    setshowDelegateModal(true);
  };
  const DelegateModalClose = () => {
    setshowDelegateModal(false);
    // setapplicationstaus("0");
    setnextlevelvalue("");
    setDelegateAsignUser([]);
    setDelegateComment("");
    setDelegateNote("");
    setSelectedAppliation(null);
  };
  // ----- End Code For Open delegate Popup

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    // setshowdataloader(true) 
    setLoading(true);
    await axios
      .post(APIURL + "ExportApplication/GetExportApplications", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setLoading(false);
          setData(res.data.responseData);
          setexportdata(res.data.responseData);

          setTimeout(()=>{
            // setshowdataloader(false)
          },2500)
          
        } else {
          setData([]);
          setLoading(false);
          setexportdata([]);
          // setshowdataloader(false)
        }
      });
  };
  // ----- End Code For Geting Table List Data

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
      // setSupervisorRoleId(value);
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

  const delegatechangeRole = () => {
    axios
      .post(APIURL + "User/GetUsersByRoleID", {
        RoleID: roleID,
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
 
  const supervisorHangechange = (e) => {
    const { name, value } = e.target;
    if (value == "") {
      setAssignUserID(null);
    } else {
      setAssignUserID(value);
    }
  };
  // ---- start API code for Comment

  //---end API code for Comment

  // ----- Start Code For Open Poup
  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };
  // ----- End Code For Open Poup

  // ----- Start Code For Geting Table Data
  const GetHandelDetail = async (rbzrefnumber, id) => {
    setshowdataloader(true) 
    await axios
      .post(APIURL + "ExportApplication/GetRequestInfoByApplicationID", {
        RBZReferenceNumber: `${rbzrefnumber}`,
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setApplicationDetail(res.data.responseData); 

          setTimeout(()=>{
            setshowdataloader(false) 
          },2000)
          // setshowdataloader(false)
        } else {
          setApplicationmessage(res.data.responseMessage); 
          // setshowdataloader(false)
        }
      })
      .catch((err) => {
        console.log(err);
        // setshowdataloader(false)
      });


      await axios
      .post(
        APIURL + "ExportApplication/GetCommentsInfoByRoleID",{
          ApplicationID: id,
        }
      )
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
      .post(
        // APIURL + "ExportApplication/GetApplicationActivityByApplicationID",
        // APIURL + "ExportApplication/ExportApplicationActivityByApplicationID",
        APIURL + "ExportApplication/GetNewComments",
        {
          ID: id,
        }
      )
      .then((res) => {
        if (res.data.responseCode == 200) {
          setallcomment(res.data.responseData);
          // setshowdataloader(false)
        } else {
          setallcomment([]);
          // setshowdataloader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        // setshowdataloader(false)
      });
 
     
       
    await axios
      .post(APIURL + "ExportApplication/GetApplicationHistory", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setTatHistory(res.data.responseData);
          // setshowdataloader(false)
        } else {
          setTatHistory([]);
          // setshowdataloader(false)
        }
      })
      .catch((err) => {
        // setshowdataloader(false)
        console.log(err);
      });

    await axios
      .post(APIURL + "ExportApplication/GetApplicationActionsByApplicationID", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setActiondata(res.data.responseData);
          // setshowdataloader(false)
        } else {
          setActiondata([]);
          // setshowdataloader(false)
        }
      })
      .catch((err) => {
        console.log(err);
        // setshowdataloader(false)
      });
  };

  const GetApplicationCount = async (id)=>{ 
    await axios
    .post(
      APIURL + "ExportApplication/CountByApplicationID",{
        ApplicationID: id,
      }
    )
    .then((res) => {  
      if (res.data.responseCode == 200) {
        console.log("responceCount", res)
        setresponceCount(res.data.responseData);
      } else {
        setresponceCount({});
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

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

  useEffect(() => {
    handleData();
  }, []);

  const delegateValues = selectedAppliation?.map((v) => {
    return {
      ApplicationID: v.id,
      status: v.status,
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
      .post(APIURL + "ExportApplication/BulkDelegate", delegateValues)
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

  return (
    <>
      {loading == false && data?.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          {loading == true ? (
            <label className="outerloader2">
              {" "}
              <span className="loader"></span>
              <span className="loaderwait">Please Wait...</span>
            </label>
          ) : (
            <div>
              <DataTable
                value={data}
                scrollable
                scrollHeight="500px"
                className={roleID >= 5 || roleID == 3 ? "mt-1" : "mt-1 tablehideth"}
                selection={selectedAppliation}
                onSelectionChange={(e) => setSelectedAppliation(e.value)}
                paginator
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
                    style={{ width: "40px", cursor:"pointer" }}
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
            </div>
          )}
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
                      // applicationmessage={applicationmessage}
                      handleFormClose={handleFormClose}
                      allcomment={allcomment}
                      tatHistory={tatHistory}
                      Actiondata={Actiondata}
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
                      <Modal.Title>
                        Edit Export Request --{" "} 
                        <big>
                          {applicationDetail?.rbzReferenceNumber
                            ? applicationDetail.rbzReferenceNumber
                            : ""}
                        </big>
                      </Modal.Title>
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

export default ExportDashboardTable;
