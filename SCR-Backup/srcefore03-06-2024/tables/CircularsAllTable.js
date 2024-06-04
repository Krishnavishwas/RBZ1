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
import jsPDF from "jspdf";
import logo from "../rbz_LOGO.png";
import ExportCircularViewDetails from '../components/ExportCircularViewDetails'
import ExportCircularsEditForm from '../components/ExportCircularsEditForm'
import { TailSpin } from "react-loader-spinner";

const CircularsAllTable = () => {
    const useId = Storage.getItem("userID");
    const rollId = Storage.getItem("roleIDs");
    const roleID = Storage.getItem("roleIDs");
    const roleName = Storage.getItem("roleName");
    const bankId = Storage.getItem("bankID")
    const PdftargetRef = useRef();
    const PdfPrivewRef = useRef();
    const PdfPrivewsupervisorRef = useRef();
    const CoverigLetterRef = useRef(null);
    const [CricularRequests, setCricularRequests] = useState([]);

    const [showEditForm, setshowEditForm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [applicationDetail, setApplicationDetail] = useState({});
    const [applicationmessage, setApplicationmessage] = useState("");

    const [searchText, setSearchText] = useState("");
    const [allcomment, setallcomment] = useState([]);
    const [applicationstaus, setapplicationstaus] = useState(
        applicationDetail?.analystRecommendation
            ? `${applicationDetail?.analystRecommendation}`
            : "0"
    );
    const [nextlevelvalue, setnextlevelvalue] = useState("");
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
    const [responceCount, setresponceCount] = useState([])
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
                        GetHandelDetail(rowData?.circularReferenceNumber, rowData.id);
                        GetApplicationCount(rowData.id)
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.color = "var(--primary-color)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = "";
                    }}
                ></i>
                {roleID == 2 || roleID == 3 ?
                    <button
                        type="button"
                        className="login "
                        style={{
                            border: "unset",
                            backgroundColor: "transparent"
                        }}
                        onClick={() => {
                            GetHandelDetail(rowData?.circularReferenceNumber, rowData.id);
                            GetHandelDetailPDF(rowData?.circularReferenceNumber)
                        }}

                    >
                        <i class="pi pi-download p-2 nav-link" style={{ padding: '12px', cursor: 'pointer' }}></i>
                    </button> :
                    ""
                    // <i
                    //     className="pi pi-user-edit"
                    //     style={{ cursor: "pointer" }}
                    //     key={rowData.title}
                    //     onClick={() => {
                    //         handleClickEditModal(rowData.title);
                    //         GetHandelDetail(rowData?.circularReferenceNumber, rowData.id);
                    //         GetRoleHandle(applicationstaus);
                    //         handleData();
                    //         GetApplicationCount(rowData.id)
                    //     }}
                    //     onMouseEnter={(e) => {
                    //         e.target.style.color = "var(--primary-color)";
                    //     }}
                    //     onMouseLeave={(e) => {
                    //         e.target.style.color = "";
                    //     }}
                    // ></i>


                }
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


    const releasingDate = (rowData) => {
        return (
            <span>
                {moment(rowData.releasingDate).format("DD MMM YYYY")}
            </span>
        );
    };
    const statusNameData = (rowData) => {
        return (
            <span>
                {rowData?.statusName ? rowData?.statusName : "_"}
            </span>
        )
    }
  
    const header = renderHeader();

    const EditModalClose = () => {
        setshowEditForm(false);
        // setapplicationstaus("0");
        setnextlevelvalue("");
    };
    const handleFormClose = () => {
        setShowUpdateModal(false)
    }

    // ----- Start Code For Open Edit Popup
    const handleClickEditModal = () => {
        setAssignUserID(null)
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
        if (roleID == 2 || roleID == 3) {
            await axios
                .post(APIURL + "Circular/GetCircularDataByBankID", {
                    // UserID: useId.replace(/"/g, ""),
                    BankID: bankId,
                })
                .then((res) => {
                    if (res.data.responseCode === "200") {
                        setLoading(false);
                        setData(res.data.responseData);


                    } else {
                        setData([]);
                        setLoading(false);

                    }
                });
        }
        else {
            await axios
                .post(APIURL + "Circular/GetCircularDataByUserID", {
                    UserID: useId.replace(/"/g, ""),
                    Status:"200"

                })
                .then((res) => {
                    if (res.data.responseCode === "200") {
                        setLoading(false);
                        setData(res.data.responseData);
                        setCricularRequests(res.data.responseData);

                        setTimeout(() => {
                            // setshowdataloader(false)
                        }, 2500)

                    } else {
                        setData([]);
                        setLoading(false);
                        setCricularRequests([]);
                        // setshowdataloader(false)
                    }
                });
        }
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
                    DepartmentID: "2"
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
        console.log("id----------", id);
        setshowdataloader(true)
        await axios
            .post(APIURL + "Circular/GetCircularDataByID", {
                ID: id,
            })
            .then((res) => {
                if (res.data.responseCode === "200") {
                    setApplicationDetail(res.data.responseData);

                    setTimeout(() => {
                        setshowdataloader(false)
                    }, 2000)
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
                APIURL + "Circular/GetCommentsInfoByRoleIDCircular", {
                CircularID: id,
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
                APIURL + "Circular/GetNewCommentsCircular",
                // APIURL + "Circular/GetCircularDataByID",
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
            .post(APIURL + "Circular/GetCircularActionsByCircularID", {
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

    const GetApplicationCount = async (id) => {
        await axios
            .post(
                APIURL + "ExportApplication/CountByApplicationID", {
                ApplicationID: id,
            }
            )
            .then((res) => {
                if (res.data.responseCode == 200) {
                    // console.log("responceCount", res)
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
    const filteredData = CricularRequests?.filter(
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
    // pdf code start
    console.log("applicationDetail----", applicationDetail);
    const GetHandelDetailPDF = async (circularReferenceNumber) => {
        console.log("applicationDetail");
        setBtnLoader(true);
        setTimeout(() => {
            const doc = new jsPDF({
                format: "a4",
                unit: "pt",
            });
            const addHeader = (doc) => {
                const pageCount = doc.internal.getNumberOfPages();
                const headerpositionfromleft =
                    (doc.internal.pageSize.width - 10) / 4;
                for (var i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.addImage(
                        logo,
                        "png",
                        70,
                        10,
                        80,
                        80,
                        "DMS-RBZ",
                        "NONE",
                        0
                    );
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
            const refpdfview =
                PdfPrivewsupervisorRef
            doc.html(refpdfview.current, {
                x: 12,
                y: 12,
                width: 513,
                height: doc.internal.pageSize.getHeight(),
                margin: [110, 80, 60, 35],
                windowWidth: 1000,
                pagebreak: true,
                async callback(doc) {
                    addHeader(doc);

                    doc.setProperties({
                        title: `${applicationDetail?.circularReferenceNumber}`,
                    });
                    var blob = doc.output("blob");
                    window.open(URL.createObjectURL(blob), "_blank");
                },
            });

            // axios
            //     .post(APIURL + "Admin/GetBankByID", {
            //         id: applicationDetail?.bankID,
            //     })
            //     .then((response) => {
            //         if (response.data.responseCode === "200") {
            //             if (
            //                 response.data.responseData?.headerFooterData["0"]?.fileType ==
            //                 "HeaderFile"
            //             ) {
            //                 var headerImage =
            //                     response.data.responseData.headerFooterData["0"].filePath;
            //                 var headerImagewidth =
            //                     response.data.responseData.headerFooterData["0"].imageWidth;
            //             } else {
            //                 var headerImage = "";
            //             }
            //             if (
            //                 response.data.responseData?.headerFooterData["1"]?.fileType ==
            //                 "FooterFile"
            //             ) {
            //                 var footerImage =
            //                     response.data.responseData.headerFooterData["1"].filePath;
            //                 var footerImagewidth =
            //                     response.data.responseData.headerFooterData["1"].imageWidth;
            //             } else {
            //                 var footerImage = "";
            //             }

            //             const addHeader = (doc) => {
            //                 if (roleID != 3) {
            //                     const pageCount = doc.internal.getNumberOfPages();
            //                     const headerpositionfromleft =
            //                         (doc.internal.pageSize.width - 10) / 4;
            //                     for (var i = 1; i <= pageCount; i++) {
            //                         doc.setPage(i);
            //                         doc.addImage(
            //                             logo,
            //                             "png",
            //                             70,
            //                             10,
            //                             80,
            //                             80,
            //                             "DMS-RBZ",
            //                             "NONE",
            //                             0
            //                         );
            //                         doc.setFontSize(8);
            //                         doc.text(
            //                             "Reserve Bank of Zimbabwe. 80 Samora Machel Avenue, P.O. Box 1283, Harare, Zimbabwe.",
            //                             headerpositionfromleft + 50,
            //                             40
            //                         );
            //                         doc.text(
            //                             "Tel: 263 242 703000, 263 8677000477 | Website:www.rbz.co.zw",
            //                             headerpositionfromleft + 100,
            //                             50
            //                         );
            //                     }
            //                 } else {
            //                     if (headerImage != "") {
            //                         const pageCount = doc.internal.getNumberOfPages();
            //                         var pagewidth = doc.internal.pageSize.width;
            //                         if (pagewidth > headerImagewidth) {
            //                             var diff = parseInt(pagewidth) - parseInt(headerImagewidth);
            //                             var positionLeft = parseInt(diff / 2);
            //                         } else {
            //                             var positionLeft = 250;
            //                         }

            //                         for (var i = 1; i <= pageCount; i++) {
            //                             doc.setPage(i);
            //                             doc.addImage(
            //                                 headerImage,
            //                                 "png",
            //                                 positionLeft,
            //                                 10,
            //                                 80,
            //                                 80,
            //                                 "Header",
            //                                 "NONE",
            //                                 0
            //                             );
            //                         }
            //                     } else {
            //                         doc.setFont("helvetica", "bold");
            //                         doc.setFontSize(20);
            //                         doc.text("Final Letter", 250, 40);
            //                     }
            //                 }
            //             };

            //             const addWaterMark = (doc) => {
            //                 const pageCount = doc.internal.getNumberOfPages();
            //                 for (var i = 1; i <= pageCount; i++) {
            //                     doc.setPage(i);
            //                     doc.setTextColor("#cccaca");
            //                     doc.saveGraphicsState();
            //                     doc.setGState(new doc.GState({ opacity: 0.4 }));
            //                     doc.setFont("helvetica", "normal");
            //                     doc.setFontSize(80);
            //                     //doc.text("PREVIEW", 50, 150, {align: 'center', baseline: 'middle'})
            //                     doc.text(
            //                         doc.internal.pageSize.width / 3,
            //                         doc.internal.pageSize.height / 2,
            //                         "Preview",
            //                         { angle: 45 }
            //                     );
            //                     doc.restoreGraphicsState();
            //                 }
            //             };
            //             doc.setFont("helvetica", "normal");
            //             doc.setFontSize(3);
            //             let docWidth = doc.internal.pageSize.getWidth();
            //             const refpdfview =
            //                 roleID == 3 && nextlevelvalue == 10
            //                     ? PdfPrivewsupervisorRef
            //                     : roleID == 3 && nextlevelvalue == ""
            //                         ? CoverigLetterRef
            //                         : PdfPrivewRef;
            //             doc.html(refpdfview.current, {
            //                 x: 12,
            //                 y: 12,
            //                 width: 513,
            //                 height: doc.internal.pageSize.getHeight(),
            //                 margin: [110, 80, 60, 35],
            //                 windowWidth: 1000,
            //                 pagebreak: true,
            //                 async callback(doc) {
            //                     addHeader(doc);
            //                     addWaterMark(doc);
            //                     doc.setProperties({
            //                         title: `${applicationDetail?.rbzReferenceNumber}`,
            //                     });
            //                     var blob = doc.output("blob");
            //                     window.open(URL.createObjectURL(blob), "_blank");
            //                 },
            //             });
            //             setBtnLoader(false);
            //         } else {
            //             var headerImage = "";
            //             var footerImage = "";
            //         }
            //     });
        }, 1500);
    };
    // pdf code end
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
                        paginator={data.length > 10 ? true : false}
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

                        <Column
                            field="circularReferenceNumber"
                            header="Reference Number"
                            sortable
                            style={{ width: "300px" }}
                        ></Column>
                        <Column
                            field="name"
                            header="Name"
                            sortable
                            style={{ width: "220px" }}

                        ></Column>
                     
                        <Column
                            field="subject"
                            header="Subject"
                            sortable
                            style={{ width: "220px" }}
                        ></Column>
                        <Column
                            field="releasingDate"
                            header="Releasing Date"
                            sortable
                            body={releasingDate}
                            style={{ width: "240px" }}
                        ></Column>
                        <Column
                            field="statusName"
                            header="Status"
                            sortable
                            body={statusNameData}
                            style={{ width: "180px" }}
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

            {/* circular view modal start */}
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
                                        <big>{applicationDetail?.circularReferenceNumber}</big>
                                    </Modal.Title>
                                </Modal.Header>
                            </h5>
                        </div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <ExportCircularViewDetails
                                    applicationDetail={applicationDetail}
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
            {/* circular view modal close */}

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
                                        Edit Cricular Export Request --{" "}
                                        <big>
                                            {applicationDetail?.circularReferenceNumber
                                                ? applicationDetail.circularReferenceNumber
                                                : ""}
                                        </big>
                                    </Modal.Title>
                                </Modal.Header>
                            </h5>
                        </div>
                        <div className="login_form_panel">
                            <Modal.Body className="p-0">
                                <ExportCircularsEditForm
                                    applicationDetail={applicationDetail}
                                    setApplicationDetail={setApplicationDetail}
                                    EditModalClose={EditModalClose}
                                    setCricularRequests={setCricularRequests}
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

            {/* pdf generate code start */}
            <div className="login_inner" style={{ display: "none" }}>
                <div className="login_form_panel" style={{ display: "none" }}>
                    <div
                        ref={PdfPrivewsupervisorRef}
                        className="p-5"
                        style={{ position: "relative" }}
                    >
                        <table width="100%">
                            <tr>
                                <td
                                    style={{
                                        marginBottom: "0px",
                                        color: "#000",
                                        fontSize: "18px",
                                        fontWeight: "800",
                                    }}
                                >
                                    Reference Number
                                </td>
                                <td>
                                    <p
                                        style={{
                                            marginBottom: "0px",
                                            color: "#000",
                                            fontSize: "18px",
                                            textAlign: "left",
                                            fontWeight: "800",
                                            letterSpacing: "0.01px",
                                        }}
                                    >
                                        {applicationDetail?.circularReferenceNumber}

                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td

                                    style={{
                                        color: "#000",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        letterSpacing: "0.01px",
                                    }}
                                >
                                    Releasing Date


                                </td>
                                <td

                                    style={{
                                        color: "#000",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        letterSpacing: "0.01px",
                                    }}
                                >
                                    {moment(
                                        applicationDetail?.releasingDate
                                    ).format("DD MMMM YYYY")}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td

                                    style={{
                                        color: "#000",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        letterSpacing: "0.01px",
                                    }}
                                >
                                    To

                                </td>
                                <td>
                                    <p
                                        style={{
                                            color: "#000",
                                            fontSize: "18px",
                                            fontWeight: "800",

                                            marginBottom: "0px",
                                            letterSpacing: "0.01px",
                                        }}
                                    >
                                        {applicationDetail?.bankData?.map((item) => {
                                            return (
                                                <span
                                                    style={{
                                                        marginBottom: "3px",
                                                        letterSpacing: "0.01px",
                                                        fontSize: "18px",
                                                        fontWeight: "400",
                                                        padding: "0px 5px",
                                                        color: "#000",

                                                    }}
                                                >
                                                    {item?.bankName},
                                                </span>
                                            );
                                        })}

                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td

                                    style={{
                                        color: "#000",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        letterSpacing: "0.01px",
                                    }}
                                >
                                    Title

                                </td>
                                <td>
                                    <p
                                        style={{
                                            color: "#000",
                                            fontSize: "18px",
                                            fontWeight: "800",

                                            marginBottom: "0px",
                                            letterSpacing: "0.01px",
                                        }}
                                    >
                                        {applicationDetail?.name},
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td

                                    style={{
                                        color: "#000",
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        letterSpacing: "0.01px",
                                    }}
                                >
                                    Subject

                                </td>
                                <td>
                                    <p
                                        style={{
                                            color: "#000",
                                            fontSize: "18px",
                                            fontWeight: "800",

                                            marginBottom: "0px",
                                            letterSpacing: "0.01px",
                                        }}
                                    >
                                        {applicationDetail?.subject},
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <table width="100%">
                                        <tr>
                                            <td colSpan="2">
                                                <table width="100%">
                                                    <tr>
                                                        <td
                                                            style={{
                                                                color: "#000",
                                                                fontSize: "18px",
                                                                fontWeight: "400",
                                                            }}
                                                        >
                                                            <div>
                                                                <span
                                                                    style={{
                                                                        fontWeight: "800",
                                                                        padding: "15px 0px 15px",
                                                                    }}
                                                                >
                                                                    Content
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="tableEditorData"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: applicationDetail?.content
                                                                        ? applicationDetail?.content
                                                                        : "N/A",
                                                                }}
                                                                style={{
                                                                    paddingBottom: "60px",
                                                                    letterSpacing: "0.01px",
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                color: "#000",
                                                                fontSize: "18px",
                                                                fontWeight: "400",
                                                            }}
                                                        >
                                                            <div>
                                                                <span
                                                                    style={{
                                                                        fontWeight: "800",
                                                                        padding: "15px 0px 15px",
                                                                    }}
                                                                >
                                                                    Attachment
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="tableEditorData"

                                                            >
                                                                {applicationDetail?.attachedFiles?.map((item) => {
                                                                    return (
                                                                        <p
                                                                            style={{
                                                                                marginBottom: "3px",
                                                                                letterSpacing: "0.01px",
                                                                                fontSize: "18px",
                                                                                fontWeight: "400",
                                                                                padding: "0px 5px",
                                                                                color: "#000",

                                                                            }}
                                                                        >
                                                                            {item?.filePath}
                                                                        </p>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td
                                                colSpan="2"
                                                style={{
                                                    color: "#000",
                                                    fontSize: "18px",
                                                    fontWeight: "400",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#000",
                                                        fontSize: "18px",
                                                        fontWeight: "400",
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    {" "}
                                                    Yours Sincerely,
                                                </span>
                                                <img
                                                    src={
                                                        applicationDetail?.getUserData?.filePath
                                                            ? applicationDetail?.getUserData.filePath
                                                            : applicationDetail.filePath
                                                    }
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
                                                        fontSize: "14px",
                                                        fontWeight: "400",
                                                        padding: "15px 0px 3px",
                                                        lineHeight: "13px",
                                                        letterSpacing: "0.01px",
                                                    }}
                                                >
                                                    SHreya
                                                </p>
                                                <p
                                                    style={{
                                                        marginBottom: "0px",
                                                        color: "#000",
                                                        fontSize: "14px",
                                                        fontWeight: "400",
                                                        padding: "5px 0px",
                                                        lineHeight: "13px",
                                                        letterSpacing: "0.01px",
                                                    }}
                                                >
                                                    singh
                                                </p>
                                                <h3
                                                    style={{
                                                        color: "#000",
                                                        fontSize: "18px",
                                                        fontWeight: "800",
                                                    }}
                                                >
                                                    EXCHANGE &nbsp; CONTROL
                                                </h3>
                                                <div
                                                    style={{
                                                        marginBottom: "0px",
                                                        color: "#000",
                                                        fontSize: "18px",
                                                        fontWeight: "400",
                                                        padding: "25px 0px 5px",
                                                        lineHeight: "13px",
                                                        display: "flex",
                                                    }}
                                                >
                                                    {applicationDetail?.copiedResponses?.length >
                                                        0 ? (
                                                        <>
                                                            <p
                                                                style={{
                                                                    marginBottom: "0px",
                                                                    fontSize: "18px",
                                                                    fontWeight: "400",
                                                                    paddingRight: "10px",
                                                                    letterSpacing: "0.01px",
                                                                }}
                                                            >
                                                                CC:
                                                            </p>
                                                            <div>
                                                                Bank
                                                                {/* {selectedBanks.map((item) => {
                                          return (
                                            <p
                                              style={{
                                                marginBottom: "3px",
                                                letterSpacing: "0.01px",
                                                fontSize: "18px",
                                                fontWeight: "400",
                                              }}
                                            >
                                              {item.name}
                                            </p>
                                          );
                                        })} */}
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
            </div>
            {/* pdf generate code end */}
        </>

    );
};

export default CircularsAllTable;
