import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterService } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import ExportDashboardViewDetails from "../components/ExportDashboardViewDetails";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import logo from "../rbz_LOGO.png";
import NoSign from "../NoSign.png";
import { TailSpin } from "react-loader-spinner";

import jsPDF from 'jspdf';

const ExportRejectedRequestsTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const PdfUsername = Storage.getItem("name");
  const PdfRolename = Storage.getItem("roleName");
  const bankID = Storage.getItem("bankID");
  const PdftargetRef = useRef();
  const csvLinkRef = useRef();

  const [ExportsRejectedRequests, setExportsRejectedRequests] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [allcomment, setallcomment] = useState([]);
  const [tatHistory, setTatHistory] = useState([]);
  const [noDataComment, setNoDataComment] = useState([]);
  const handleFormClose = () => setShowUpdateModal(false);
  const [loader, setLoader] = useState("");
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

  const amountwithCurrency = (rowData) => {
    return (
      <span>
        {rowData.currencyCode}&nbsp;{rowData.amount}
      </span>
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
            <i
              className="pi pi-download p-2 nav-link"
              style={{ padding: "12px", cursor: "pointer" }}
              onClick={() => {
                GetHandelDetailPDF(rowData?.rbzReferenceNumber, rowData?.id);
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "var(--primary-color)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "";
              }}
            ></i>
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

  const header = renderHeader();

  // ----- Start Code For Geting Table List Data
  const [tabCount, setTabCount] = useState('');
  const handleTabCount = async () => {
    await axios
      .post(APIURL + "ExportApplication/CountData", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
        MenuName: "NotApproved",
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
      .post(APIURL + "ExportApplication/GetExportDatabyUserID", {
        UserID: useId.replace(/"/g, ""),
        Status: "30",
        RoleID: rollId,
        DataType: tabDepId,
        BankID: bankID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setExportsRejectedRequests(res.data.responseData);
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
          setApplicationDetail(res?.data?.responseData);
        } else {
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

      // --------------------------vishwas start----------------------------
      await axios
      .post(
        APIURL + "ExportApplication/GetCommentsInfoByRoleID",
        {
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
      //---------------------------vishwas end------------------------------
  };

  const GetHandelDetailPDF = async (rbzrefnumber, id) => {
    setLoader(id);
    await axios
      .post(APIURL + "ExportApplication/GetRequestInfoByApplicationID", {
        RBZReferenceNumber: `${rbzrefnumber}`,
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setApplicationDetail(res.data.responseData);
          setTimeout(() => {

            const doc = new jsPDF({
              format: 'a4',
              unit: 'pt',
            });  

            const addFooters = doc => {
              const pageCount = doc.internal.getNumberOfPages();
              
              const footerpositionfromleft = doc.internal.pageSize.width-10;
              const footerpositionfromTop = doc.internal.pageSize.height-10;              
              doc.setFont('helvetica', 'italic')
              doc.setFontSize(8)
              for (var i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.text('Page ' + String(i) + ' of ' + String(pageCount), footerpositionfromleft, footerpositionfromTop, {
                  align: 'right'
                })
              }
            }

            const addHeader = doc => {
              const pageCount = doc.internal.getNumberOfPages();
              const headerpositionfromleft = (doc.internal.pageSize.width-10)/4;
              for (var i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.addImage(logo, 'png', 70, 10, 80, 80, 'DMS-RBZ','NONE', 0)
                doc.setFontSize(8)
                doc.text("Reserve Bank of Zimbabwe. 80 Samora Machel Avenue, P.O. Box 1283, Harare, Zimbabwe.", headerpositionfromleft + 50, 40);
                doc.text("Tel: 263 242 703000, 263 8677000477 | Website:www.rbz.co.zw", headerpositionfromleft + 100, 50);                                           
              }
            } 

            doc.setFont('helvetica', 'normal')
            doc.setFontSize(3)
            let docWidth = doc.internal.pageSize.getWidth();
            doc.html(PdftargetRef.current, { 
              x: 12,
              y: 12,
              width: docWidth,
              height: doc.internal.pageSize.getHeight(),
              margin: [110, 10, 40, 0],
              windowWidth: 1000,
              pagebreak: true,
              async callback(doc) {
                addHeader(doc);              
                addFooters(doc);
                doc.save(`${rbzrefnumber}`);
              },
            });

            //generatePDF(PdftargetRef, { filename: `${rbzrefnumber}`, Pdfoption });
            setLoader("");
          }, 1500);
        } else {
          setApplicationmessage(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // ----- End Code For Geting Table Data

  // ----- Start Code For Search Table Data
  const filteredData = ExportsRejectedRequests?.filter(
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
  // ----- End Code For Search Table Data

  //------tabs state start
  const [tabDepId, setTabDepId] = useState("All");

  const handleClickTag = (id) => {
    setTabDepId(id)
  }
  //------tabs state end
  useEffect(() => {
    handleData();
    handleTabCount();
    setExportsRejectedRequests([]);
  }, [tabDepId]);
  const tabHeader = (
    <div className="application-tab w-100 mt-4">
      <ul class="nav nav-pills mb-3">
        <li class="nav-item">
          <a class={tabDepId == 'All' ? "nav-link active" : "nav-link"} onClick={() => handleClickTag('All')}>All Not Approved ({tabCount?.allDataCount})</a>
        </li>
        <li class="nav-item">
          <a class={tabDepId == 'My' ? "nav-link active" : "nav-link"} onClick={() => handleClickTag('My')}>My Not Approved ({tabCount?.myDataCount})</a>
        </li>

      </ul>
    </div>
  );
  return (
    <>
      {tabHeader}
      {ExportsRejectedRequests?.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          <div
            style={{
              opacity: "0",
              height: "0px",
              overflow: "hidden",
            }}
          >
            <div
              ref={PdftargetRef}
              className="p-5 page-break"
              style={{ position: "relative" }}
            >
              {/* <h6 className="text_preview">Preview</h6> */}
              <table>                
                <tr>
                  <td                    
                    style={{
                      marginBottom: "0px",
                      color: "#000",
                      fontSize: "19px",
                      fontWeight: "800",
                    }}
                  >
                    Exchange Control Ref
                    <br />
                    Previous Exchange Control Ref
                  </td>
                  <td>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "#000",
                        fontSize: "19px",
                        textAlign: "left",
                        fontWeight: "800",
                      }}
                    >
                      : {applicationDetail?.rbzReferenceNumber}
                      <br />: N/A
                    </p>
                  </td>
                </tr>
                <tr><td>&nbsp;</td></tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "19px",
                      fontWeight: "400",
                    }}
                  >
                    {moment(applicationDetail?.applicationSubmittedDate).format(
                      "DD MMMM YYYY"
                    )}
                  </td>
                </tr>
                <tr><td>&nbsp;</td></tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "19px",
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
                    <u className="text-uppercase" style={{ fontWeight: "800", fontSize: "19px", }}>
                      {applicationDetail?.bankCity != null ||
                      applicationDetail?.bankCity != ""
                        ? applicationDetail?.bankCity
                        : ""}
                    </u>
                  </td>
                </tr>
                <tr><td colSpan="2">&nbsp;</td></tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "19px",
                      fontWeight: "400",
                    }}
                  >
                    Dear {applicationDetail?.applicantType == 1 ? applicationDetail?.companyName : applicationDetail?.applicantType == 2 ? applicationDetail?.name : applicationDetail?.applicantType == 3 ? applicationDetail?.agencyName : " "},
                  </td>
                </tr>
                <tr><td>&nbsp;</td></tr>
                <tr>
                  <td colSpan="2">
                    <table width="100%">
                      <tr>
                        <td colSpan="2">
                          <p
                            style={{
                              color: "#000",
                              fontSize: "19px",
                              fontWeight: "600",
                              borderBottom: "1px solid #000",
                              marginBottom: "0px",
                            }}
                          >
                            RE: {applicationDetail?.applicationType}
                          </p>
                        </td>
                      </tr>
                      <tr><td>&nbsp;</td></tr>
                      <tr>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "400",
                          }}
                        >
                          Exporter
                        </td>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "800",
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
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "400",
                          }}
                        >
                          Date Submitted
                        </td>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "800",
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
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "400",
                          }}
                        >
                          Currency and Amount
                        </td>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "800",
                          }}
                        >
                          :{" "}
                          <span
                            style={{
                              minWidth: "45px",
                              display: "inline-block",
                              paddingRight: "5px",
                              fontWeight: "800",
                            }}
                          >
                            {applicationDetail?.currencyCode}
                          </span>
                          <span style={{ fontSize: "19px",fontWeight: "800", }}>
                            {applicationDetail?.amount}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "400",
                          }}
                        >
                          USD Equivalent
                        </td>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "800",
                          }}
                        >
                          :{" "}
                          <span
                            style={{
                              minWidth: "45px",
                              display: "inline-block",
                              paddingRight: "5px",
                              fontWeight: "800",
                            }}
                          >
                            USD
                          </span>
                          <span style={{ fontSize: "19px", fontWeight: "800", }}>
                            {applicationDetail?.usdEquivalent}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "400",
                          }}
                        >
                          Status/Decision
                        </td>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "800",
                          }}
                        >
                          : {applicationDetail?.statusName}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "400",
                          }}
                        >
                          Expiry Date
                        </td>
                        <td                          
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "800",
                          }}
                        >
                          :{" "}
                          {applicationDetail?.expiringDate == null ||
                          applicationDetail?.expiringDate == "" ||
                          applicationDetail?.expiringDate ==
                            "0001-01-01T00:00:00"
                            ? "N/A"
                            : moment(applicationDetail?.expiringDate).format(
                                "DD MMMM YYYY"
                              )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontSize: "19px",
                            fontWeight: "400",
                            color: "#000",
                          }}
                        >
                          Returns Frequency
                        </td>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "800",
                          }}
                        >
                          :{" "}
                          {applicationDetail?.returnFrequencyName == null ||
                          applicationDetail?.returnFrequencyName == ""
                            ? "N/A"
                            : applicationDetail?.returnFrequencyName}
                        </td>
                      </tr>
                      {applicationDetail?.returnFrequencyName == "Once" ? (
                        <tr>
                          <td
                            style={{
                              fontSize: "19px",
                              fontWeight: "400",
                              color: "#000",
                            }}
                          >
                            Returns Date
                          </td>
                          <td
                            style={{
                              color: "#000",
                              fontSize: "19px",
                              fontWeight: "800",
                            }}
                          >
                            :{" "}
                            {applicationDetail?.returnDate == null ||
                            applicationDetail?.returnDate == "" ||
                            applicationDetail?.returnDate ==
                              "0001-01-01T00:00:00"
                              ? "N/A"
                              : moment(applicationDetail?.returnDate).format(
                                  "DD MMMM YYYY"
                                )}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                    </table>
                  </td>
                </tr>
                <tr><td>&nbsp;</td></tr>
                <tr>
                  <td className="p-0" colSpan="2">
                    <table>
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            color: "#000",
                            fontSize: "19px",
                            fontWeight: "600",
                            textDecoration: "underline",
                          }}
                        >
                          Response/Conditions
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <table>
                            <tr>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "19px",
                                  fontWeight: "400",
                                }}
                              >
                                <div                                  
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
                            fontSize: "19px",
                            fontWeight: "400",
                          }}
                        >
                          <span
                            style={{
                              color: "#000",
                              fontSize: "19px",
                              fontWeight: "400",
                              display: "inline-block",
                            }}
                          >
                            {" "}
                            Yours Sincerely,
                          </span>
                          <img
                            src={applicationDetail?.getUserData?.filePath ? applicationDetail?.getUserData.filePath : NoSign}
                            alt="Signature"
                            style={{
                              width: "120px",
                              height: "50px",
                              display: "block",
                              objectFit: "contain",
                            }}
                          />
                          <p
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "19px",
                              fontWeight: "400",
                              padding: "15px 0px 3px",
                              lineHeight: "13px",
                            }}
                          >
                            {applicationDetail?.getUserData?.name
                              ? applicationDetail?.getUserData?.name
                              : "N/A"}
                          </p>
                          <p
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "19px",
                              fontWeight: "400",
                              padding: "5px 0px",
                              lineHeight: "13px",
                            }}
                          >
                            {applicationDetail?.getUserData?.roleName
                              ? applicationDetail?.getUserData?.roleName
                              : "N/A"}
                          </p>
                          <h3
                            style={{
                              color: "#000",
                              fontSize: "19px",
                              fontWeight: "600",
                              textDecoration: "underline",
                            }}
                          >
                            EXCHANGE &nbsp; CONTROL
                          </h3>
                          <div
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "19px",
                              fontWeight: "400",
                              lineHeight: "13px",
                            }}
                          >
                            {applicationDetail?.copiedResponses?.length > 0 ? (
                              <>
                                <p
                                  style={{
                                    marginBottom: "0px",
                                    fontSize: "19px",
                                    fontWeight: "400",
                                    paddingRight: "10px",
                                  }}
                                >
                                  CC:
                                </p>
                                <div>
                                  {applicationDetail?.copiedResponses.map(
                                    (item) => {
                                      return (
                                        <p
                                          style={{
                                            marginBottom: "3px",
                                            fontSize: "19px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          {item.bankName}
                                        </p>
                                      );
                                    }
                                  )}
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div>

      
          <div>

            <DataTable
              value={ExportsRejectedRequests}
              scrollable
              scrollHeight="500px"
              // className="mt-4"
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
                      noDataComment={noDataComment}
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

export default ExportRejectedRequestsTable;
