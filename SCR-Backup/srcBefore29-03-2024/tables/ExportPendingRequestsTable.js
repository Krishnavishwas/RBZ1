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
import ExportDashboardViewDetails from "../components/ExportDashboardViewDetails";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import logo from "../rbz_LOGO.png";
import dummysign from "../dummy_sign.png";

const ExportPendingRequestsTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");

  const [ExportsPendingRequests, setExportsPendingRequests] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [allcomment, setallcomment] = useState([]);
  const [tatHistory, setTatHistory] = useState([]);
  const handleFormClose = () => setShowUpdateModal(false);

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
  const PdftargetRef = useRef();
  const Pdfoption = {
    method: "open",
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.SMALL,
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      orientation: "landscape",
    },
    canvas: {
      mimeType: "image/png",
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };

  const action = (rowData) => {
    return (
      <>
        <i
          className="pi pi-eye"
          style={{ padding: "12px", cursor: "pointer" }}
          onClick={() => {
            handleViewData(rowData.id);
            GetHandelDetail(rowData?.rbzReferenceNumber, rowData?.id);
          }}
          aria-disabled
          onMouseEnter={(e) => {
            e.target.style.color = "var(--primary-color)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "";
          }}
        ></i>
        {/* <i
          className="pi pi-download p-2 nav-link"
          style={{ padding: "12px", cursor: "pointer" }}
          onClick={() => {
            GetHandelDetail(rowData?.rbzReferenceNumber, rowData?.id);
            generatePDF(PdftargetRef, { filename: "page.pdf", Pdfoption });
          }}
          aria-disabled
          onMouseEnter={(e) => {
            e.target.style.color = "var(--primary-color)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "";
          }}
        ></i> */}
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

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    await axios
      .post(APIURL + "ExportApplication/GetExportDatabyUserID", {
        UserID: useId.replace(/"/g, ""),
        Status: "50",
        RoleID: rollId,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setExportsPendingRequests(res.data.responseData);
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
      .post(
        APIURL + "ExportApplication/GetApplicationActivityByApplicationID",
        {
          ID: id,
        }
      )
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
  };
  // ----- End Code For Geting Table Data

  // ----- Start Code For Search Table Data
  const filteredData = ExportsPendingRequests?.filter(
    (item) =>
      item?.rbzReferenceNumber
        ?.toLowerCase()
        .includes(searchText?.toLowerCase()) ||
      item?.statusName?.toLowerCase().toString().includes(searchText) ||
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
  // ----- End Code For Search Table Data

  useEffect(() => {
    handleData();
  }, []);

  return (
    <>
      {ExportsPendingRequests?.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          {/* <div
            style={{
              opacity: "0",
              height: "0px",
              overflow: "hidden",
            }}
          >
            <div
              ref={PdftargetRef}
              className="p-5 mx-auto"
              style={{ position: "relative" }}
            >
              <h6 className="text_preview">Preview</h6>
              <table width="100%" className="pdfTable">
                <tr>
                  <td width="25%">
                    <p
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginBottom: "0px",
                        marginLeft: "auto",
                      }}
                    >
                      <img src={logo} alt="logo" className="w-100" />
                    </p>
                  </td>
                  <td className="align-middle" width="75%">
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "#000",
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >
                      Reserve Bank of Zimbabwe. 80 Samora Machel Avenue, P.O.
                      Box 1283, Harare, Zimbabwe.
                    </p>
                    <p
                      style={{
                        // marginBottom: "0px",
                        color: "#000",
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >
                      Tel: 263 242 703000, 263 8677000477, Website:
                      www.rbz.co.zw
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    width="20%"
                    style={{
                      marginBottom: "0px",
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Exchange Control Ref
                    <br />
                    Previous Exchange Control Ref
                  </td>
                  <td width="80%">
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "#000",
                        fontSize: "14px",
                        textAlign: "left",
                        fontWeight: "600",
                      }}
                    >
                      : {applicationDetail?.rbzReferenceNumber}
                      <br />: N/A
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    {moment(applicationDetail?.applicationSubmittedDate).format(
                      "DD MMMM YYYY"
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    The Head - Exchange Control
                    <br />
                    {applicationDetail?.bankName}
                    <br />
                    {applicationDetail?.bankAddress1 != null ||
                    applicationDetail?.bankAddress1 != ""
                      ? applicationDetail?.bankAddress1 + "," + " "
                      : ""}
                    {applicationDetail?.bankAddress2 != null ||
                    applicationDetail?.bankAddress2 != ""
                      ? applicationDetail?.bankAddress2 + "," + " "
                      : ""}
                    {applicationDetail?.bankAddress3 != null ||
                    applicationDetail?.bankAddress3 != ""
                      ? applicationDetail?.bankAddress3
                      : ""}
                    <br />
                    <u className="text-uppercase" style={{ fontWeight: "600" }}>
                      {applicationDetail?.bankCity != null ||
                      applicationDetail?.bankCity != ""
                        ? applicationDetail?.bankCity
                        : ""}
                    </u>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    Dear Sir/Madam,
                  </td>
                </tr>
                <tr>
                  <td className="p-0" colSpan="2">
                    <table width="100%" className="return-tables">
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            padding: "5px 15px 15px",
                          }}
                        >
                          <p
                            style={{
                              color: "#000",
                              fontSize: "16px",
                              fontWeight: "600",
                              borderBottom: "1px solid #000",
                              marginBottom: "0px",
                            }}
                          >
                            RE: EXTENSION OF ACQUITTAL PERIOD FOR ADVANCE
                            PAYMENTS
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="25%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "400",
                          }}
                        >
                          Exporter
                        </td>
                        <td
                          width="75%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          :{" "}
                          {applicationDetail?.companyName != null
                            ? applicationDetail?.companyName
                            : applicationDetail?.name}
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="25%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "400",
                          }}
                        >
                          Date Submitted
                        </td>
                        <td
                          width="75%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          :{" "}
                          {moment(
                            applicationDetail?.applicationSubmittedDate
                          ).format("DD MMMM YYYY")}
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="25%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "400",
                          }}
                        >
                          Currency and Amount
                        </td>
                        <td
                          width="75%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          : {applicationDetail?.currencyCode}
                          &nbsp;
                          {applicationDetail?.amount}
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="25%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "400",
                          }}
                        >
                          USD Equivalent
                        </td>
                        <td
                          width="75%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          : USD &nbsp;
                          {applicationDetail?.usdEquivalent}
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="25%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "400",
                          }}
                        >
                          Status/Decision
                        </td>
                        <td
                          width="75%"
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "600",
                          }}
                        >
                          : {applicationDetail?.statusName}
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="25%"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "400",
                          }}
                        >
                          Expiry Date
                        </td>
                        <td
                          width="75%"
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "600",
                          }}
                        >
                          :{" "}
                          {applicationDetail?.expiringDate == null ||
                          applicationDetail?.expiringDate == ""
                            ? "N/A"
                            : applicationDetail?.expiringDate}
                        </td>
                      </tr>
                      <tr>
                        <td
                          width="25%"
                          style={{
                            fontSize: "16px",
                            fontWeight: "400",
                            color: "#000",
                          }}
                        >
                          Returns Frequency
                        </td>
                        <td
                          width="75%"
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "600",
                          }}
                        >
                          :{" "}
                          {applicationDetail?.returnFrequencyName == null ||
                          applicationDetail?.returnFrequencyName == ""
                            ? "N/A"
                            : applicationDetail?.returnFrequencyName}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td className="p-0" colSpan="2">
                    <table>
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "600",
                            textDecoration: "underline",
                            padding: "15px 15px 15px",
                          }}
                        >
                          Response/Conditions
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2" className="p-0">
                          <table width="100%">
                            <tr>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "16px",
                                  fontWeight: "400",
                                }}
                              >
                                <div
                                  className="header_content"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      applicationDetail?.analystDescription,
                                  }}
                                />
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: "400",
                            padding: "5px 15px 15px",
                          }}
                        >
                          Yours Sincerely,
                          <img
                            src={dummysign}
                            alt="Signature"
                            style={{
                              width: "120px",
                              height: "50px",
                              borderBottom: "2px dotted #000",
                              display: "block",
                              objectFit: "contain",
                            }}
                          />
                          <p
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "14px",
                              fontWeight: "400",
                              padding: "10px 0px",
                            }}
                          >
                            deputydirector7
                          </p>
                          <h3
                            style={{
                              color: "#000",
                              fontSize: "16px",
                              fontWeight: "600",
                              textDecoration: "underline",
                            }}
                          >
                            EXCHANGE CONTROL
                          </h3>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div> */}

          <div>
            <DataTable
              value={ExportsPendingRequests}
              scrollable
              scrollHeight="500px"
              className="mt-4"
              paginator
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
                style={{
                  minWidth: "80px",
                  maxWidth: "140px",
                  overflowWrap: "anywhere",
                }}
              ></Column>
              <Column
                field="companyName"
                header="Applicant Name"
                sortable
                style={{ minWidth: "200px" }}
                body={applicantName}
              ></Column>
              <Column
                field="applicationSubmittedDate"
                header="Submitted Date"
                sortable
                style={{
                  minWidth: "100px",
                  maxWidth: "100px",
                  overflowWrap: "anywhere",
                }}
                body={submittedDate}
              ></Column>
              <Column
                field="applicationType"
                header="Application Type"
                sortable
                style={{
                  minWidth: "130px",
                  maxWidth: "160px",
                  overflowWrap: "anywhere",
                }}
              ></Column>
              <Column
                field=""
                header="Amount"
                sortable
                body={amountwithCurrency}
                style={{
                  minWidth: "100px",
                  maxWidth: "120px",
                  overflowWrap: "anywhere",
                }}
              ></Column>
              <Column
                field="statusName"
                header="Status"
                sortable
                style={{
                  minWidth: "100px",
                  maxWidth: "100px",
                  overflowWrap: "anywhere",
                }}
              ></Column>
              <Column
                field=""
                header="Action"
                style={{
                  minWidth: "100px",
                  maxWidth: "100px",
                  overflowWrap: "anywhere",
                }}
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

export default ExportPendingRequestsTable;
