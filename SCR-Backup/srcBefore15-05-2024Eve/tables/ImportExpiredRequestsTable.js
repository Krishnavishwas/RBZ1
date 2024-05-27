import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import Modal from "react-bootstrap/Modal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterService, FilterOperator } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import ImportDashboardViewDetails from "../components/ImportDashboardViewDetails";

const ImportExpiredRequestsTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const PdfUsername = Storage.getItem("name");
  const PdfRolename = Storage.getItem("roleName");
  const bankID = Storage.getItem("bankID");

  const [ExportsapproveRequests, setExportsapproveRequests] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [tatHistory, setTatHistory] = useState([]);
  const [allcomment, setallcomment] = useState([]);
  const [Actiondata, setActiondata] = useState([]);
  const [noDataComment, setNoDataComment] = useState([]);
  const [loader, setLoader] = useState("");
  const [responceCount, setresponceCount] = useState([]);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const handleFormClose = () => setShowUpdateModal(false);

  FilterService.register("custom_activity", (value, filters) => {
    const [from, to] = filters ?? [null, null];
    if (from === null && to === null) return true;
    if (from !== null && to === null) return from <= value;
    if (from === null && to !== null) return value <= to;
    return from <= value && value <= to;
  });

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      companyName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      bankName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      expiringDate: {
        operator: FilterOperator.OR,
        constraints: [
          { value: null, matchMode: FilterMatchMode.DATE_IS },
          { value: null, matchMode: FilterMatchMode.DATE_AFTER },
        ],
      },
      tinNumber: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
      },
    });
    setGlobalFilterValue("");
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const filterNextSevenDays = (value) => {
    if (value != "all") {
      const nextDays = moment().subtract(value, "days").format("MM/DD/YYYY");
      const newdate = new Date(nextDays);
      let _filters = { ...filters };
      _filters["expiringDate"].constraints[0].value = new Date();
      _filters["expiringDate"].constraints[1].value = newdate;
      setFilters(_filters);
    } else {
      let _filters = { ...filters };
      _filters["expiringDate"].constraints[0].value = null;
      _filters["expiringDate"].constraints[1].value = null;
      setFilters(_filters);
    }
  };

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between">
        <div>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search"
            />
          </span>
        </div>
        <div className="form-bx">
          <select
            class="daySelect"
            aria-label="Large select example"
            onChange={(e) => filterNextSevenDays(e.target.value)}
          >
            <option value="all" selected>
              30 days
            </option>
            <option value="2">Today & Yesterday</option>
            <option value="7">7 Days</option>
            <option value="15">15 Days</option>
          </select>
        </div>
      </div>
    );
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
  const [tabCount, setTabCount] = useState("");
  const handleTabCount = async () => {
    await axios
      .post(APIURL + "ImportApplication/CountDataImport", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
        MenuName: "Expired",
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
    await axios
      .post(APIURL + "ImportApplication/GetExpiredDataByUserIDImport", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
        DataType: tabDepId,
        BankID: bankID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setExportsapproveRequests(getCustomers(res.data.responseData));
        }
      });
  };

  const getCustomers = (data) => {
    return [...(data || [])].map((d) => {
      d.expiringDate = new Date(d.expiringDate);
      return d;
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
      .post(APIURL + "ImportApplication/GetImportRequestInfoByApplicationID", {
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
          console.log("responceCount", res);
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
  useEffect(() => {
    handleData();
    handleTabCount();
    setExportsapproveRequests([]);
    initFilters();
  }, [tabDepId]);

  const tabHeader = (
    <div className="application-tab w-100 mt-4">
      <ul class="nav nav-pills mb-3">
        <li class="nav-item">
          <a
            class={tabDepId == "All" ? "nav-link active" : "nav-link"}
            onClick={() => handleClickTag("All")}
          >
            All Expired ({tabCount?.allDataCount})
          </a>
        </li>
        <li class="nav-item">
          <a
            class={tabDepId == "My" ? "nav-link active" : "nav-link"}
            onClick={() => handleClickTag("My")}
          >
            My Expired ({tabCount?.myDataCount})
          </a>
        </li>
        {/* <li class="nav-item">
          <a class={tabDepId == 'All' ? "nav-link active" : "nav-link"} onClick={() => handleClickTag('All')}>All Expired ()</a>
        </li>
        <li class="nav-item">
          <a class={tabDepId == 'My' ? "nav-link active" : "nav-link"} onClick={() => handleClickTag('My')}>My Expired ()</a>
        </li> */}
      </ul>
    </div>
  );

  return (
    <>
      {tabHeader}
      {ExportsapproveRequests?.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          <div>
            <DataTable
              value={ExportsapproveRequests}
              scrollable
              scrollHeight="500px"
              className="mt-4"
              paginator={ExportsapproveRequests.length > 10 ? true : false}
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
                field="expiringDate"
                header="Exp Date"
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

        </>
      )}
    </>
  );
};
export default ImportExpiredRequestsTable;
