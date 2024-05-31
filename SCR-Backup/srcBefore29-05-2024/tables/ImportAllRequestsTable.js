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
import ImportDashboardViewDetails from "../components/ImportDashboardViewDetails";

const ImportAllRequestsTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const bankID = Storage.getItem("bankID");
  const PdftargetRef = useRef();
  const [ExportsapproveRequests, setExportsapproveRequests] = useState([]);
  const [ExportsapproveAllRequests, setExportsapproveAllRequests] = useState(
    []
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [tatHistory, setTatHistory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allcomment, setallcomment] = useState([]);
  const [noDataComment, setNoDataComment] = useState([]);
  const [responceCount, setresponceCount] = useState([]);

  const handleFormClose = () => setShowUpdateModal(false);
  const [loader, setLoader] = useState("");
  const [pageLoader, setPageLoader] = useState("");
  const csvLinkRef = useRef();
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
        {rowData.filePath != null ? (
          loader == rowData?.id ? (
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
          ) : rowData?.filePath != null ? (
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
          )
        ) : (
          " "
        )}
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
      .post(APIURL + "ImportApplication/CountDataImport", {
        UserID: useId?.replace(/"/g, ""),
        RoleID: rollId,
        MenuName: "AllRequest",
        BankID: bankID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setTabCount(res.data.responseData);
        }
      });
  };

  const handleData = async () => {
    setPageLoader(true);
    await axios
      .post(APIURL + "ImportApplication/GetImportDatabyUserID", {
        UserID: useId.replace(/"/g, ""),
        Status: "101",
        RoleID: rollId,
        DataType: "All",
        BankID: bankID,
        LowerLimit: "0",
        UpperLimit: "10",
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setPageLoader(false);
          // setExportsapproveRequests(res.data.responseData);
          setExportsapproveAllRequests(res.data.responseData);
        } else if (res.data.responseMessage === "No data") {
          setPageLoader(false);
        }
      });
  };
  //--request tab data start
  const handlereqData = async () => {
    setPageLoader(true);
    await axios
      .post(APIURL + "ImportApplication/GetImportDatabyUserID", {
        UserID: useId.replace(/"/g, ""),
        Status: "101",
        RoleID: rollId,
        DataType: "My",
        BankID: bankID,
        LowerLimit: "0",
        UpperLimit: "10",
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setPageLoader(false);
          setExportsapproveRequests(res.data.responseData);
        } else if (res.data.responseMessage === "No data") {
          setPageLoader(false);
        }
      });
  };
  //--request tab data end
  // ----- End Code For Geting Table List Data

  // ----- Start Code For Open Poup
  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };
  // ----- End Code For Open Poup

  // ----- Start Code For Geting Table Data
  const GetHandelDetail = async (rbzrefnumber, id) => {
    setLoading(true);
    await axios
      .post(APIURL + "ImportApplication/GetImportRequestInfoByApplicationID", {
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

    // --------------------------vishwas start----------------------------
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
    //---------------------------vishwas end------------------------------
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
          setresponceCount([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // ----- End Code For Geting Table Data

  // ----- Start Code For Search Table Data
  const filteredData = ExportsapproveRequests?.filter(
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
  //------tabs state start
  const [tabDepId, setTabDepId] = useState("All");

  const handleClickTag = (id) => {
    setTabDepId(id);
  };
  //------tabs state end

  const tabHeader = (
    <div className="application-tab w-100 mt-4">
      <ul className="nav nav-pills mb-3">
        <li className="nav-item">
          <a
            class={tabDepId == "All" ? "nav-link active" : "nav-link"}
            onClick={() => handleClickTag("All")}
          >
            All Request ({tabCount?.allDataCount})
          </a>
        </li>
        <li className="nav-item">
          <a
            class={tabDepId == "My" ? "nav-link active" : "nav-link"}
            onClick={() => handleClickTag("My")}
          >
            My Request ({tabCount?.myDataCount})
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
    if (tabDepId == "All") {
      axios
        .post(APIURL + "ImportApplication/GetImportDatabyUserID", {
          UserID: useId.replace(/"/g, ""),
          Status: "101",
          RoleID: rollId,
          DataType: "All",
          BankID: bankID,
          LowerLimit: event.rows * event.page,
          UpperLimit: event.rows,
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
            setpaginationModalShow(false);
            setExportsapproveAllRequests(res.data.responseData);
          }
        });
    } else {
      axios
        .post(APIURL + "ImportApplication/GetImportDatabyUserID", {
          UserID: useId.replace(/"/g, ""),
          Status: "101",
          RoleID: rollId,
          DataType: "My",
          BankID: bankID,
          LowerLimit: event.rows * event.page,
          UpperLimit: event.rows,
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
            setExportsapproveRequests(res.data.responseData);
          }
        });
    }
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
    handlereqData();
    handleTabCount();
    setExportsapproveRequests([]);
    setExportsapproveAllRequests([]);
  }, [tabDepId]);

  return (
    <>
      {tabHeader}
      {pageLoader == true ? (
        <label className="outerloader2">
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : ExportsapproveAllRequests?.length == 0 ||
        ExportsapproveRequests?.length == 0 ? (
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
            <>
              <div className="pagination-top pagination-top-right">
                {/* <Paginator  className="custom-pagination" first={first} rows={rows} totalRecords={tabDepId == "All" ? tabCount?.allDataCount : tabCount?.myDataCount} rowsPerPageOptions={[10, 50, 100]} onPageChange={onPageChange} /> */}
              </div>
              <div className="clear"></div>
              <DataTable
                className="primeDatatTable"
                //value={slicedData}
                value={
                  tabDepId == "All"
                    ? ExportsapproveAllRequests
                    : ExportsapproveRequests
                }
                scrollable
                scrollHeight="600px"
                // paginator={ExportsapproveRequests?.length > 10 ? true : false}
                rowHover
                filters={filters}
                // paginatorPosition={"both"}
                // paginatorLeft
                // rows={10}
                dataKey="id"
                // rowsPerPageOptions={[10, 50, 100]}
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
            </>
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

          {/* loader modal start */}
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
          {/* loader modal end */}
        </>
      )}
    </>
  );
};
export default ImportAllRequestsTable;
