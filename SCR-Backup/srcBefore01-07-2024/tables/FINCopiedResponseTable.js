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

const FINCopiedResponseTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const PdfUsername = Storage.getItem("name");
  const PdfRolename = Storage.getItem("roleName");
  const bankID = Storage.getItem("bankID");
  const csvLinkRef = useRef();


  const [FINCopiedResponse, setFINCopiedResponse] = useState([]);
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
  const [loading, setLoading] = useState(false);
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
      .post(APIURL + "FINApplication/CountDataFIN", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
        MenuName: "Approved",
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
      .post(APIURL + "FINApplication/GetCopiedResApplicationDataByUserIDFIN", {
        UserID: useId.replace(/"/g, ""),
        Status: "10",
        RoleID: rollId,
        DataType: "All",
        BankID: bankID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
            setFINCopiedResponse(res.data.responseData);
        }
      });
  };

  // ----- End Code For Geting Table List Data

  // ----- Start Code For Table Heading Column
  const columns = [
    {
      name: "RBZ Reference Number",
      selector: (row) => row.rbzReferenceNumber,
      sortable: true,
      searchable: true,
      width: "300px",
      cell: (row) => (
        <span title={row.rbzReferenceNumber}>{row.rbzReferenceNumber}</span>
      ),
    },
    {
      name: "Applicant Name",
      selector: (row) => row.companyName || row.name,
      sortable: true,
      searchable: true,
      cell: (row) => (
        <>
          {row.applicantType === 1 ? (
            <span title={row.companyName}>
              <i className="bi bi-c-circle text-primary"></i>
              &nbsp;&nbsp;{row.companyName}
            </span>
          ) : row.applicantType === 2 ? (
            <span title={row.name}>
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
      width: "170px",
      selector: (row) => row.applicationSubmittedDate,
      sortable: true,
      cell: (row) => (
        <span
          title={moment(row.applicationSubmittedDate).format("DD MMM YYYY")}
        >
          {moment(row.applicationSubmittedDate).format("DD MMM YYYY")}
        </span>
      ),
    },
    {
      name: "Application Type",
      selector: (row) => row.applicationType,
      sortable: true,
      cell: (row) => (
        <span title={row.applicationType}>{row.applicationType}</span>
      ),
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      searchable: true,
      width: "150px",
      cell: (row) => (
        <span title={row.currencyCode + " " + row.amount}>
          <strong>{row.currencyCode}</strong>&nbsp;{row.amount}
        </span>
      ),
    },
    {
      name: "Status",
      width: "100px",
      selector: (row) => row.statusName,
      sortable: true,
      cell: (row) => <span title={row.statusName}>{row.statusName}</span>,
    },
    // {
    //   name: "Action",
    //   width: "90px",
    //   cell: (row) => [
    //     <Link
    //       onClick={() => {
    //         handleViewData(row?.id);
    //         GetHandelDetail(row?.rbzReferenceNumber, row.id);
    //       }}
    //       className="mr-1"
    //     >
    //       <b>
    //         <i className="bi bi-eye"></i>
    //       </b>
    //     </Link>,
    //   ],
    // },
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
      .post(APIURL + "FINApplication/GetFINRequestInfoByApplicationID", {
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
      .post(APIURL + "FINApplication/GetFINNewComments", {
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
      .post(APIURL + "FINApplication/GetFINApplicationHistory", {
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
      .post(APIURL + "FINApplication/GetFINApplicationActionsByApplicationID", {
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

    // --------------------------vishwas start----------------------------
    await axios
      .post(APIURL + "FINApplication/GetFINCommentsInfoByRoleID", {
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
      .post(APIURL + "FINApplication/CountByApplicationIDFIN", {
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
  const filteredData = FINCopiedResponse?.filter(
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
    handleTabCount();
    setFINCopiedResponse([]);
  }, []);

  return (
    <>
      {FINCopiedResponse?.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          <div>
            <DataTable
              value={FINCopiedResponse}
              scrollable
              scrollHeight="600px"
              className="mt-4"
              paginator={FINCopiedResponse.length > 10 ? true : false}
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
                        View Foreign Investment Request --{" "}
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
export default FINCopiedResponseTable;