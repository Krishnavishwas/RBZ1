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
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import logo from "../rbz_LOGO.png";
import NoSign from "../NoSign.png";
import { TailSpin } from "react-loader-spinner";
import jsPDF from "jspdf";
import CircularsRequestForm from "../components/CircularsRequestForm";
import CircularsEditForm from "../components/CircularsEditForm";
const CircularsTable = () => {
    const useId = Storage.getItem("userID");
    const rollId = Storage.getItem("roleIDs");
    const bankID = Storage.getItem("bankID");
    const PdftargetRef = useRef();

    const [CricularRequests, setCricularRequests] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [applicationDetail, setApplicationDetail] = useState({});
    const [circularForm, setCircularForm] = useState(false)
    const [cricularFormShow, setCricularFormShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const editModalClose = () => setEditModalShow(false)
    const handleEditModalShow = () => setEditModalShow(true);
    const cricularFormClose = () => setCricularFormShow(false);
    const handleCricularFormShow = () => setCricularFormShow(true);
    const [applicationmessage, setApplicationmessage] = useState("");
    const [tatHistory, setTatHistory] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [allcomment, setallcomment] = useState([]);
    const [noDataComment, setNoDataComment] = useState([]);
    const [responceCount, setresponceCount] = useState([]);

    const handleFormClose = () => setShowUpdateModal(false);
    const [loader, setLoader] = useState("");
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
    const [circularDataId, setCircularDataId] = useState('')
    const handleCircularDataId = (id) => {
        setCircularDataId(id)
    }
    console.log("circularDataId",circularDataId);
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
                </span>{rollId > 4 ? 
                <div className="form-footer mt-0 justify-content-end">
                    <button
                        type="button"
                        className="login text-end"
                        onClick={(e) => handleCricularFormShow()}
                    >
                        Add Circular
                    </button>
                </div>
                : " " }
            </div>
        );
    };

    const action = (rowData) => {
        //  console.log("rowDataACTION", rowData);
        return (
            <>
                {/* <i
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
                ></i> */}
                <i
                    className="pi pi-user-edit"
                    style={{ padding: "12px", cursor: "pointer" }}
                    onClick={() => {
                        handleEditModalShow(rowData.id);
                        handleCircularDataId(rowData.id);
                    }}
                    aria-disabled
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


    const amountwithCurrency = (rowData) => {
        return (
            <span>
                {rowData.currencyCode}&nbsp;{rowData.amount}
            </span>
        );
    };

    const releasingDate = (rowData) => {
        return (
            <span>
                {moment(rowData.releasingDate).format("DD MMM YYYY")}
            </span>
        );
    };

    const header = renderHeader();

    // ----- Start Code For Geting Table List Data
    const [tabCount, setTabCount] = useState("");
    const handleTabCount = async () => {
        await axios
            .post(APIURL + "ExportApplication/CountData", {
                UserID: useId.replace(/"/g, ""),
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
        await axios
            .post(APIURL + "Circular/GetCircularDataByUserID", {
                UserID: useId.replace(/"/g, ""),

            })
            .then((res) => {
                if (res.data.responseCode === "200") {
                    setCricularRequests(res.data.responseData);
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
        setLoading(true);
        await axios
            .post(APIURL + "ExportApplication/GetRequestInfoByApplicationID", {
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
                            format: "a4",
                            unit: "pt",
                        });

                        const addFooters = (doc) => {
                            const pageCount = doc.internal.getNumberOfPages();

                            const footerpositionfromleft = doc.internal.pageSize.width - 10;
                            const footerpositionfromTop = doc.internal.pageSize.height - 10;
                            doc.setFont("helvetica", "italic");
                            doc.setFontSize(8);
                            for (var i = 1; i <= pageCount; i++) {
                                doc.setPage(i);
                                doc.text(
                                    "Page " + String(i) + " of " + String(pageCount),
                                    footerpositionfromleft,
                                    footerpositionfromTop,
                                    {
                                        align: "right",
                                    }
                                );
                            }
                        };

                        const addHeader = (doc) => {
                            const pageCount = doc.internal.getNumberOfPages();
                            const headerpositionfromleft =
                                (doc.internal.pageSize.width - 10) / 4;
                            for (var i = 1; i <= pageCount; i++) {
                                doc.setPage(i);
                                doc.addImage(logo, "png", 70, 10, 80, 80, "DMS-RBZ", "NONE", 0);
                                doc.setFontSize(8);
                                doc.text(
                                    "Reserve Bank of Zimbabwe. 80 Samora Machel Avenue, P.O. Box 1283, Harare, Zimbabwe.",
                                    headerpositionfromleft + 50,
                                    40
                                );
                                doc.text(
                                    "Tel: 263 242 703000, 263 8677000477 | Website:www.rbz.co.zw",
                                    headerpositionfromleft + 100,
                                    50
                                );
                            }
                        };

                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(3);
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
                        setLoader();
                    }, 1500);
                } else {
                    setApplicationmessage(res.data.responseMessage);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // ----- Start Code For Search Table Data
    const filteredData = CricularRequests?.filter(
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
        setCricularRequests([]);
    }, [tabDepId]);
    //   const tabHeader = (
    //     <div className="application-tab w-100 mt-4">
    //       <ul className="nav nav-pills mb-3">
    //         <li className="nav-item">
    //           <a
    //             class={tabDepId == "All" ? "nav-link active" : "nav-link"}
    //             onClick={() => handleClickTag("All")}
    //           >
    //             All Request 
    //           </a>
    //         </li>
    //         <li className="nav-item">
    //           <a
    //             class={tabDepId == "My" ? "nav-link active" : "nav-link"}
    //             onClick={() => handleClickTag("My")}
    //           >
    //             My Request 
    //           </a>
    //         </li>
    //       </ul>
    //     </div>
    //   );
    console.log("CricularRequests",CricularRequests);
    return (
        <>

            {loading == true && CricularRequests?.length == 0 ? (
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
                        // ---- pdfdata start
                        <>

                            {/* //---- pdfdata end  */}
                            <div>
                                <DataTable
                                    value={CricularRequests}
                                    scrollable
                                    scrollHeight="500px"
                                    // className="mt-4"
                                    paginator
                                    rowHover
                                    filters={filters}
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
                                        field="circularReferenceNumber"
                                        header="Circular Reference Number"
                                        sortable
                                        style={{ width: "220px" }}
                                    ></Column>
                                    <Column
                                        field="name"
                                        header="Name"
                                        sortable
                                        style={{ width: "220px" }}

                                    ></Column>
                                    <Column
                                        field="content"
                                        header="Content"
                                        sortable
                                        style={{ width: "220px" }}

                                    ></Column>

                                    <Column
                                        field="subject"
                                        header="Subject"
                                        sortable
                                        style={{ width: "200px" }}
                                    ></Column>
                                    <Column
                                        field="releasingDate"
                                        header="Releasing Date"
                                        sortable
                                        style={{ width: "140px" }}
                                        body={releasingDate}
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
                                            responceCount={responceCount}
                                        />
                                    </Modal.Body>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    {/* {circularForm ? <CricularRequestForm /> : " "} */}

                    {/* circular form modal start */}
                    <Modal
                        backdrop="static"
                        className="max-width-600"
                        show={cricularFormShow}
                        onHide={cricularFormClose}>
                        <div className="application-box">
                            <div className="login_inner">
                                <div className="login_form ">
                                    <h5>
                                        <Modal.Header closeButton className="p-0">
                                            <Modal.Title>
                                                Circular Request From

                                            </Modal.Title>
                                        </Modal.Header>
                                    </h5>
                                </div>
                                <div className="login_form_panel">
                                    <Modal.Body className="p-0">
                                        <CircularsRequestForm
                                            handleFormClose={cricularFormClose}
                                            handleCircularListData = {handleData}
                                        />
                                    </Modal.Body>
                                </div>
                            </div>
                        </div>

                        {/* <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body> */}

                    </Modal>
                    {/* circular form modal end */}

                    {/* circular Edit form modal start */}
                    <Modal
                        backdrop="static"
                        className="max-width-600"
                        show={editModalShow}
                        onHide={editModalClose}>
                        <div className="application-box">
                            <div className="login_inner">
                                <div className="login_form ">
                                    <h5>
                                        <Modal.Header closeButton className="p-0">
                                            <Modal.Title>
                                                Edit Cricular Request From

                                            </Modal.Title>
                                        </Modal.Header>
                                    </h5>
                                </div>
                                <div className="login_form_panel">
                                    <Modal.Body className="p-0">

                                        <CircularsEditForm 
                                        handleEditModalClose={editModalClose} 
                                        circularID = {circularDataId}
                                        handleCircularListData = {handleData}
                                        />
                                    </Modal.Body>
                                </div>
                            </div>
                        </div>

                        {/* <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body> */}

                    </Modal>
                    {/* circular Edit form modal end */}
                </>
            )}
        </>
    );
};

export default CircularsTable;
