import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import Modal from "react-bootstrap/Modal";
import ExportDashboardViewDetails from "../components/ExportDashboardViewDetails";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterService } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { Paginator } from "primereact/paginator";
import Spinner from "react-bootstrap/Spinner";
import ExportDashboardRenewEditDetails from "../components/ExportDashboardRenewEditDetails";
const ExportDeferredRequestsTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const PdfUsername = Storage.getItem("name");
  const PdfRolename = Storage.getItem("roleName");
  const bankID = Storage.getItem("bankID");
  const PdftargetRef = useRef();
  const csvLinkRef = useRef();

  const [ExportsDeferredRequests, setExportsDeferredRequests] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [tatHistory, setTatHistory] = useState([]);
  const [allcomment, setallcomment] = useState([]);
  const handleFormClose = () => setShowUpdateModal(false);
  const [noDataComment, setNoDataComment] = useState([]);
  const [pageLoader, setPageLoader] = useState("");
  const [loader, setLoader] = useState("");
  const [responceCount, setresponceCount] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [userRole, setUserrole] = useState([]);
  const [nextlevelvalue, setnextlevelvalue] = useState("");
  const [exportdata, setexportdata] = useState([]);
  const [showdataLoader, setshowdataloader] = useState(false);
  const [applicationstaus, setapplicationstaus] = useState(
    applicationDetail?.applicationStatus
      ? `${applicationDetail?.applicationStatus}`
      : "0"
  );
  const [asignUser, setAsignUser] = useState([]);
  const [AssignUserID, setAssignUserID] = useState("");
  const [SupervisorRoleId, setSupervisorRoleId] = useState("");
  const [Actiondata, setActiondata] = useState([]);
  const [IsDeferred, setIsDeferred] = useState("1");

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
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleClickEditModal = () => {
    setshowEditForm(true);
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

  const EditModalClose = () => {
    setshowEditForm(false);
    setnextlevelvalue("");
  };

  const supervisorHangechange = (e) => {
    const { name, value } = e.target;
    if (value == "") {
      setAssignUserID(null);
    } else {
      setAssignUserID(value);
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
              ? // ? parseInt(roleID) - 1
                value
              : rollId,
          UserID: useId.replace(/"/g, ""),
          DepartmentID: "2",
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

  const action = (rowData) => {
    return (
      <>
        <div className="d-flex align-items-center">
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
          {loader == rowData?.id ? (
            <TailSpin
              visible={true}
              height="20"
              width="20"
              color="#5e62a1"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            <>
              {rollId == 2 || rollId == 4 ? (
                <i
                  class="bi bi-copy"
                  style={{
                    padding: "10px 5px",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  key={rowData.title}
                  onClick={() => {
                    handleClickEditModal(rowData.title);
                    GetHandelDetail(rowData?.rbzReferenceNumber, rowData.id);
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
              ) : (
                ""
              )}
              {rowData?.filePath != null ? (
                <Link
                  style={{ color: "#4b5563" }}
                  target="_blank"
                  // rel="noopener noreferrer"
                  to={rowData?.filePath}
                >
                  <i
                    className="pi pi-download p-2 nav-link"
                    style={{ padding: "12px", cursor: "pointer" }}
                  ></i>
                </Link>
              ) : (
                ""
              )}
            </>
          )}
        </div>
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

  // ----- Start Code For Geting Table List Data
  const [tabCount, setTabCount] = useState("");
  const handleTabCount = async () => {
    await axios
      .post(APIURL + "ExportApplication/CountData", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
        MenuName: "Deferred",
        BankID: bankID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setTabCount(res.data.responseData);
        }
      });
  };

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    setPageLoader(true);
    await axios
      .post(APIURL + "ExportApplication/GetExportDatabyUserID", {
        UserID: useId.replace(/"/g, ""),
        Status: "40",
        RoleID: rollId,
        DataType: tabDepId,
        BankID: bankID,
        LowerLimit: "0",
        UpperLimit: "10",
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setPageLoader(false);
          setExportsDeferredRequests(res.data.responseData);
        } else if (res.data.responseMessage === "No data") {
          setPageLoader(false);
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
      .post(APIURL + "ExportApplication/GetRequestInfoByApplicationID", {
        RBZReferenceNumber: `${rbzrefnumber}`,
        ID: id,
      })
      .then((res) => {
        setLoading(true);
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
      .post(APIURL + "ExportApplication/GetNewComments", {
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
      .post(APIURL + "ExportApplication/GetApplicationHistory", {
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
      .post(APIURL + "ExportApplication/GetApplicationActionsByApplicationID", {
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
      .post(APIURL + "ExportApplication/GetCommentsInfoByRoleID", {
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
      .post(APIURL + "ExportApplication/CountByApplicationID", {
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
  const filteredData = ExportsDeferredRequests?.filter(
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
  const [tabDepId, setTabDepId] = useState("All");
  const handleClickTag = (id) => {
    setTabDepId(id);
  };
  //------tabs state end

  const tabHeader = (
    <div className="application-tab w-100 mt-4">
      <ul class="nav nav-pills mb-3">
        <li class="nav-item">
          <a
            class={tabDepId == "All" ? "nav-link active" : "nav-link"}
            onClick={(e) => handleClickTag("All")}
          >
            All Deferred ({tabCount?.allDataCount})
          </a>
        </li>
        <li class="nav-item">
          <a
            class={tabDepId == "My" ? "nav-link active" : "nav-link"}
            onClick={(e) => handleClickTag("My")}
          >
            My Deferred ({tabCount?.myDataCount})
          </a>
        </li>
      </ul>
    </div>
  );

  // pagination click loader start
  const [paginationModalShow, setpaginationModalShow] = useState(false);
  const handlePaginationModalClose = () => setpaginationModalShow(false);

  // pagination click loader end
  ///--------pagination start
  const [first, setFirst] = useState("");
  const [rows, setRows] = useState(10);

  const onPageChange = (event) => {
    setpaginationModalShow(true);
    setFirst(event.first);
    setRows(event.rows);

    axios
      .post(APIURL + "ExportApplication/GetExportDatabyUserID", {
        UserID: useId.replace(/"/g, ""),
        Status: "40",
        RoleID: rollId,
        DataType: tabDepId,
        BankID: bankID,
        LowerLimit: event.rows * event.page,
        UpperLimit: event.rows,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setpaginationModalShow(false);
          setExportsDeferredRequests(res.data.responseData);
        }
      });
  };

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
        <div>
          {tabDepId == "All" && tabCount?.allDataCount >= 9 ? (
            <Paginator
              className="custom-pagination"
              first={first}
              rows={rows}
              totalRecords={tabCount?.allDataCount}
              rowsPerPageOptions={[10, 50, 100, 500, 1000]}
              onPageChange={onPageChange}
            />
          ) : (
            " "
          )}
          {tabDepId == "My" && tabCount?.myDataCount >= 9 ? (
            <Paginator
              className="custom-pagination"
              first={first}
              rows={rows}
              totalRecords={tabCount?.myDataCount}
              rowsPerPageOptions={[10, 50, 100, 500, 1000]}
              onPageChange={onPageChange}
            />
          ) : (
            " "
          )}
        </div>
      </div>
    );
  };

  const header = renderHeader();
  useEffect(() => {
    handleData();
    handleTabCount();
    setExportsDeferredRequests([]);
  }, [tabDepId]);

  return (
    <>
      {tabHeader}
      {pageLoader == true ? (
        <label className="outerloader2">
          {" "}
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : ExportsDeferredRequests?.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          <div>
            <DataTable
              className="primeDatatTable"
              value={ExportsDeferredRequests}
              scrollable
              scrollHeight="600px"
              // className="mt-4"
              // paginator={ExportsDeferredRequests.length > 10 ? true : false}
              filters={filters}
              // paginatorPosition={"both"}
              // paginatorLeft
              rowHover
              // rows={10}
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
            {tabDepId == "All" && tabCount?.allDataCount >= 9 ? (
              <Paginator
                className="custom-pagination"
                first={first}
                rows={rows}
                totalRecords={tabCount?.allDataCount}
                rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                onPageChange={onPageChange}
              />
            ) : (
              " "
            )}
            {tabDepId == "My" && tabCount?.myDataCount >= 9 ? (
              <Paginator
                className="custom-pagination"
                first={first}
                rows={rows}
                totalRecords={tabCount?.myDataCount}
                rowsPerPageOptions={[10, 50, 100, 500, 1000]}
                onPageChange={onPageChange}
              />
            ) : (
              " "
            )}
          </div>

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
                      noDataComment={noDataComment}
                      tatHistory={tatHistory}
                      responceCount={responceCount}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            size="sm"
            show={paginationModalShow}
            onHide={handlePaginationModalClose}
            backdrop="static"
            keyboard={false}
            centered
            className="paginationLoader"
          >
            <Modal.Body>
              <Spinner animation="border" size="md" />
              <p>Please wait loading data.</p>
            </Modal.Body>
          </Modal>
        </>
      )}

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
                  supervisorHangechangeBankuser={supervisorHangechangeBankuser}
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
  );
};
export default ExportDeferredRequestsTable;
