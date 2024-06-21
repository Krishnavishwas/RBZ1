import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import moment from "moment";
import { toast } from "react-toastify";
import Select from "react-select";
import UpdatePopupMessage from "./UpdatePopupMessage";
import "react-quill/dist/quill.snow.css";
import logo from "../rbz_LOGO.png";
import Modal from "react-bootstrap/Modal";
import "suneditor/dist/css/suneditor.min.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TailSpin } from "react-loader-spinner";
import jsPDF from "jspdf";
import ExportDashboardViewDetails from "./ExportDashboardViewDetails";

const ExportDashboardRenewEditDetails = ({
  applicationDetail,
  setApplicationDetail,
  EditModalClose,
  handleData,
  allcomment,
  applicationstaus,
  setapplicationstaus,
  GetRoleHandle,
  userRole,
  asignUser,
  SupervisorRoleId,
  SupervisorNameID,
  supervisorHangechangeBankuser,
  supervisorHangechange,
  supervisorHangechangeRole,
  setAsignUser,
  AssignUserID,
  setAssignUserID,
  setSupervisorRoleId,
  setnextlevelvalue,
  nextlevelvalue,
  tatHistory,
  Actiondata,
  showdataLoader,
  noDataComment,
  responceCount,
  GetHandelDetail,
  IsDeferred,
}) => {
  const ratevalue = applicationDetail?.rate;

  const fileInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const {
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData,
    Supervisors,
    masterBank,
  } = ExportformDynamicField();

  const BPNCodeRef = useRef(null);
  const TINRef = useRef(null);
  const amountRef = useRef(null);
  const applicantRef = useRef(null);
  const BeneficiaryNameRef = useRef(null);
  const applicantCommentsRef = useRef(null);
  const applicantReferenceNumberRef = useRef(null);
  // const applicantYearRef = useRef(null);
  const applicationTypeRef = useRef(null);
  const assignedToRef = useRef(null);
  const companyNameRef = useRef(null);
  const currencyRef = useRef(null);
  const govtAgencieRef = useRef(null);
  const applicationPurposeRef = useRef(null);
  const relatedexchangeControlNumberRef = useRef(null);
  const sectorRef = useRef(null);
  const subsectorRef = useRef(null);
  const typeExporterRef = useRef(null);
  const rateRef = useRef(null);
  const usdEquivalentRef = useRef(null);
  const dateExpirydisplayRef = useRef(null);
  const optionExpirydisplayRef = useRef(null);
  const CoverigLetterRef = useRef(null);
  const FrequencyRef = useRef(null);
  const FrequencyDateRef = useRef(null);
  const bankSupervisorRef = useRef(null);
  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const bankName = Storage.getItem("bankName");
  const roleID = Storage.getItem("roleIDs");
  const menuname = Storage.getItem("menuname");
  const submenuname = Storage.getItem("submenuname");

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState(null);
  const [checksectorchange, setchecksectorchange] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [geninfoTab, setgeninfoTab] = useState(true);
  const [recomdAnalyst, setRecomdAnalyst] = useState("121");
  const [selectedBanks, setSelectedBanks] = useState(null);
  const [registerusertype, setregisterusertype] = useState(
    applicationDetail?.userTypeID
  );
  const [files, setFiles] = useState([]);
  const [otherfiles, setOtherfiles] = useState([
    { filename: "File Upload", upload: "" },
  ]);
  const [userfiles, setuserFiles] = useState([]);
  const [otheruserfiles, setOtheruserfiles] = useState([]);
  const [sharefile, setsharefile] = useState([]);
  const [errors, setErrors] = useState({});
  const [ValidateShow, setValidateShow] = useState(false);
  const [applicationType, setapplicationType] = useState([]);
  const [subsectorData, setsubsectorData] = useState([]);
  const [checkSupervisor, setcheckSupervisor] = useState(
    roleID == 4 ? true : false
  );
  const [attachmentData, setAttachmentData] = useState([
    { filename: "File Upload", upload: "" },
  ]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [value, setValue] = useState("Company Name");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [Description, setDescription] = useState("");
  const [updatepopup, setupdatepopup] = useState(false);
  const [ExpiringDate, setExpiringDate] = useState(new Date());
  const [asignnextLeveldata, setasignnextLeveldata] = useState({
    Notes: "",
    Comment: "",
  });
  const [loader, setLoader] = useState(false);
  const [DateExpiryOption, setDateExpiryOption] = useState("");
  const [defaultnoExpiry, setdefaultnoExpiry] = useState("0");
  const [IsReturnOption, setIsReturnOption] = useState("");
  const [AllFrequency, setAllFrequency] = useState([]);
  const [getFrequencyID, setGetFrequencyID] = useState("0");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [IsReturn, setIsReturn] = useState("0");
  const [IsReturnExpiringDate, setIsReturnExpiringDate] = useState(new Date());
  const [DateExpirydisplay, setDateExpirydisplay] = useState("");
  const [curRate, setCurrate] = useState();
  const [delDataFile, setDelDataFiles] = useState([]);
  const [userRoleRecordofficer, setuserRoleRecordofficer] = useState([]);
  const [selectuserRoleRecordofficer, setselectuserRoleRecordofficer] =
    useState("");
  const [ValidateRBZ, setValidateRBZ] = useState([]);
  const [getalluser, setGetalluser] = useState([]);
  const [getBlankFile, setgetBlankFile] = useState([]);
  const [viewShareFile, setviewShareFile] = useState([]);
  const [geninfoFile, setgeninfoFile] = useState([]);
  const [allcommentRenew, setallcomment] = useState([]);
  const [newData, setnewData] = useState([]);
  const [SubmitBtnLoader, setSubmitBtnLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationmessage, setApplicationmessage] = useState("");
  const [tatHistoryRenew, setTatHistory] = useState([]);
  const [noDataCommentRenew, setNoDataComment] = useState([]);
  const [responceCountRenew, setresponceCount] = useState([]);
  const [PendingReturnComment, setPendingReturnComment] = useState("");
  const [PendingReturnNote, setPendingReturnNote] = useState("");
  const [ValidateChange, setValidateChange] = useState({
    relatedexchangeControlNumber: "",
  });

  const applicationNumber = applicationDetail.rbzReferenceNumber;

  const handleFormClose = () => setShowUpdateModal(false);

  const heading = "Application Submitted Successfully!";
  const para = "Export application request submitted successfully!";
  const heading1 = "Returns Submitted Successfully!";
  const para1 = " Export returns request submitted successfully!";

  const ChangeApplicationStatus = (e) => {
    const values = e.target.value;
    setapplicationstaus(values);
  };

  const handleUserRole = (e) => {
    const value = e.target.value;
    setSupervisorRoleId(value);
  };

  const ChangeNextlevelHandle = (e) => {
    const value = e.target.value;
    setSupervisorRoleId("");
    setSupervisorRoleId("");
    setnextlevelvalue(value);
    setAsignUser([]);
  };

  useEffect(() => {
    if (applicationDetail?.applicationTypeID) {
      axios
        .post(APIURL + "Master/GetAttachmentData", {
          ApplicationTypeID: applicationDetail?.applicationTypeID,
          ApplicationSubTypeID: "0",
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setgetBlankFile(res.data.responseData);
          } else {
            setgetBlankFile([]);
          }
        });
    }
  }, [applicationDetail]);

  const GetApplicationTypes = async () => {
    await axios
      .post(APIURL + "Master/GetApplicationTypesByDepartmentID", {
        DepartmentID: "2",
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setapplicationType(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    GetApplicationTypes();
    if (applicationDetail?.subSector) {
      axios
        .post(APIURL + "Master/GetSubSectorBySectorID", {
          SectorID: parseInt(applicationDetail.sector),
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setsubsectorData(res.data.responseData);
          } else {
            setsubsectorData([]);
            console.log(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [applicationDetail.sector]);

  useEffect(() => {
    setIsReturn(
      applicationDetail?.isReturnNeeded
        ? `${applicationDetail?.isReturnNeeded}`
        : "0"
    );
    setIsReturnOption(
      applicationDetail?.isReturnNeeded
        ? `${applicationDetail?.isReturnNeeded}`
        : "0"
    );
    setGetFrequencyID(
      applicationDetail?.returnFrequencyType
        ? `${applicationDetail?.returnFrequencyType}`
        : "0"
    );
    setIsReturnExpiringDate(
      applicationDetail?.returnDate ? applicationDetail?.returnDate : new Date()
    );
    setdefaultnoExpiry(applicationDetail?.expiringDate ? "1" : "0");
    setDateExpiryOption(applicationDetail?.expiringDate ? "1" : "0");
    setDateExpirydisplay(applicationDetail?.expiringDate ? "0" : "1");

    const bankdtata = applicationDetail?.copiedResponses?.map((items, i) => {
      return {
        name: items.bankName,
        code: items.bankID,
      };
    });

    setExpiringDate(
      applicationDetail?.expiringDate
        ? applicationDetail?.expiringDate
        : new Date()
    );

    setSelectedBanks(bankdtata);

    if (applicationDetail?.isReturnNeeded == 1) {
      axios
        .post(APIURL + "Master/GetAllFrequencies")
        .then((res) => {
          if (res.data.responseCode == 200) {
            setAllFrequency(res.data.responseData);
          } else {
            setAllFrequency([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [applicationDetail]);

  const formatecopyresponse = selectedBanks?.map((item) => {
    return item.code;
  });

  const copyresponse = selectedBanks?.map((res) => ({
    ApplicationID: applicationDetail?.id,
    BankID: res?.code,
    CopyingResponse: 1,
    CopiedResponse: formatecopyresponse?.join(),
  }));

  const changeHandelForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    let newErrors = {};
    let valid = true;

    if (name == "applicationPurpose" && value.charAt(0) === " ") {
      newErrors.applicationPurpose = "First character cannot be a blank space";
      valid = false;
    } else if (name == "applicant" && value.charAt(0) === " ") {
      newErrors.applicant = "First character cannot be a blank space";
      valid = false;
    } else if (name == "applicant" && specialChars.test(value)) {
      newErrors.applicant = "Special characters not allowed";
      valid = false;
    } else if (name == "applicantComment" && value.charAt(0) === " ") {
      newErrors.applicantComment = "First character cannot be a blank space";
      valid = false;
    } else if (name == "beneficiaryName" && value.charAt(0) === " ") {
      newErrors.beneficiaryName = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "beneficiaryName" &&
      (specialChars.test(value) ||
        /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0)))
    ) {
      newErrors.beneficiaryName = "Special characters not allowed";
      valid = false;
    } else if (name == "tinNumber" && value.charAt(0) === " ") {
      newErrors.tinNumber = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "tinNumber" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("]"))
    ) {
      newErrors.tinNumber = "Special characters not allowed";
      valid = false;
    } else if (name == "bpnCode" && value.charAt(0) === " ") {
      newErrors.bpnCode = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "bpnCode" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("]"))
    ) {
      newErrors.bpnCode = "Special characters not allowed";
      valid = false;
    } else if (
      name == "applicantReferenceNumber" &&
      (value.charAt(0) === " " || value.charAt(0) == "/")
    ) {
      newErrors.applicantReferenceNumber =
        "First character cannot be a blank space or / ";
      valid = false;
    } else if (
      name == "applicantReferenceNumber" &&
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)
    ) {
      newErrors.applicantReferenceNumber = "Special characters not allowed";
      valid = false;
    } else if (
      name == "relatedexchangeControlNumber" &&
      value.charAt(0) === " "
    ) {
      newErrors.relatedexchangeControlNumber =
        "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "relatedexchangeControlNumber" &&
      specialChars.test(value)
    ) {
      newErrors.relatedexchangeControlNumber = "Special characters not allowed";
      valid = false;
    } else {
      setErrors({});
      setApplicationDetail((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    setErrors(newErrors);

    if (name === "sector") {
      axios
        .post(APIURL + "Master/GetSubSectorBySectorID", {
          SectorID: value,
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setchecksectorchange(true);
            setsubsectorData(res.data.responseData);
          } else {
            setsubsectorData([]);
            console.log(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (name == "subSector") {
      setchecksectorchange(false);
    }

    if (name === "currency" && value != "") {
      axios
        .post(APIURL + "Master/GetRateByCurrencyID", {
          Id: value,
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setCurrate(res.data.responseData.currencyRate);
          } else {
            setCurrate([]);
            console.log(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (name === "applicationTypeID") {
      axios
        .post(APIURL + "Master/GetAttachmentData", {
          ApplicationTypeID: value != "" ? value : -1,
          ApplicationSubTypeID: "0",
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setAttachmentData(res.data.responseData);
          } else {
            setAttachmentData([]);
            setFiles([]);
            setuserFiles([]);
            setOtheruserfiles([]);
            setOtherfiles([]);
            setOtherfilesupload([]);
          }
        });
    }
  };

  const HandleDateCurrRate = (e) => {
    axios
      .post(APIURL + "Master/GetRateByCurrencyID", {
        Id: applicationDetail.currency,
      })
      .then((res) => {
        if (res.data.responseCode == "200") {
          setCurrate(res.data.responseData.currencyRate);
        } else {
          setCurrate([]);
          console.log(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    HandleDateCurrRate();
  }, [curRate]);

  const removefileImage = (label) => {
    const updatedUserFile = files?.filter((item, i) => item?.label != label);
    setFiles(updatedUserFile);
  };

  const clearInputFile = (index) => {
    if (fileInputRefs[index].current) fileInputRefs[index].current.value = "";
  };

  const action = (rowData) => {
    return bankName.replace(/"/g, "") == rowData?.bankName ? (
      <>
        <i
          className="pi pi-eye p-0"
          style={{ padding: "12px", cursor: "pointer" }}
          onClick={() => {
            handleViewData(rowData.id);
            GetHandelDetailRenew(rowData?.rbzReferenceNumber, rowData.id);
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
    ) : (
      <i
        className="pi pi-eye p-0"
        style={{ padding: "12px", cursor: "pointer" }}
        onClick={() => {
          handleViewData(rowData.id);
          GetHandelDetailRenew(rowData?.rbzReferenceNumber, rowData.id);
          GetApplicationCount(rowData.id);
        }}
        onMouseEnter={(e) => {
          e.target.style.color = "var(--primary-color)";
        }}
        onMouseLeave={(e) => {
          e.target.style.color = "";
        }}
      ></i>
    );
  };

  const amountData = (rowData) => {
    return (
      <span>
        {bankName.replace(/"/g, "") == rowData?.bankName
          ? rowData.amount + rowData.currencyCode
          : "--"}
      </span>
    );
  };

  const createdDate = (rowData) => {
    return <span>{moment(rowData?.createdDate).format("DD MMM YYYY")}</span>;
  };

  const applicantNAME = (rowData) => {
    return <span>{rowData?.name ? rowData?.name : "N/A"}</span>;
  };

  const renderFooter = () => {
    return (
      <div className="flex justify-content-end">
        <button
          className="validateCrossIcon"
          onClick={() => setValidateShow(false)}
        >
          <i className="bi bi-x-circle"></i>
        </button>
      </div>
    );
  };
  const footer = renderFooter();

  const GetHandelDetailRenew = async (rbzrefnumber, id) => {
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

  const handleViewData = (id) => {
    setShowUpdateModal(true);
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

  useEffect(() => {
    GetApplicationTypes();
  }, []);

  /* PDF Preview code starts */
  const GetHandelDetailPDF = async () => {
    setBtnLoader(true);
    setTimeout(() => {
      const doc = new jsPDF({
        format: "a4",
        unit: "pt",
      });

      const addHeader = (doc) => {
        const pageCount = doc.internal.getNumberOfPages();
        const headerpositionfromleft = (doc.internal.pageSize.width - 10) / 4;
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

      const addWaterMark = (doc) => {
        const pageCount = doc.internal.getNumberOfPages();
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setTextColor("#e4e4e4");
          doc.setFontSize(80);
          doc.text(
            doc.internal.pageSize.width / 3,
            doc.internal.pageSize.height / 2,
            "Preview",
            { angle: 45 }
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
          addWaterMark(doc);
          doc.setProperties({
            title: `${applicationDetail?.rbzReferenceNumber}`,
          });
          var blob = doc.output("blob");
          window.open(URL.createObjectURL(blob), "_blank");
        },
      });
      setBtnLoader(false);
    }, 1500);
  };

  const HandleNextleveldata = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    const specialCharsnote = /[!@#$%^*|<>]/;
    let newErrors = {};
    let valid = true;
    if (name == "Notes" && value.charAt(0) === " ") {
      newErrors.Notes = "First character cannot be a blank space";
      valid = false;
    } else if (name == "Comment" && value.charAt(0) === " ") {
      newErrors.Comment = "First character cannot be a blank space";
      valid = false;
    } else {
      setErrors({});
      setasignnextLeveldata((pre) => ({
        ...pre,
        [name]: value,
      }));
    }
    setErrors(newErrors);
  };

  const getRoleHandle = async () => {
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: "4",
        Status: "35",
        DepartmentID:"2"
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setuserRoleRecordofficer(res.data.responseData);
        } else {
          setuserRoleRecordofficer([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validatePECANForm = () => {
    let valid = true;
    const newErrors = {};
    if (ValidateChange.relatedexchangeControlNumber.trim().length < 4) {
      newErrors.relatedexchangeControlNumber =
        "Reference Number allow minimum 4 numbers";
      valid = false;
    } else if (ValidateChange.relatedexchangeControlNumber.trim().length > 6) {
      newErrors.relatedexchangeControlNumber =
        "Reference Number allow maximum 6 numbers";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const changeHandelFormValidate = (e) => {
    const { name, value } = e.target;
    const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;
    let newErrors = {};
    let valid = true;
    if (name == "recNumber" && specialChars.test(value)) {
      newErrors.relatedexchangeControlNumber = "Special characters not allowed";
      valid = false;
    } else if (name == "recNumber" && value == " ") {
      newErrors.relatedexchangeControlNumber =
        "First character cannot be a blank space";
      valid = false;
    } else {
      setValidateChange({ ...ValidateChange, [name]: value });
    }
    setErrors(newErrors);
  };

  const handleValidateRBZ = () => {
    if (validatePECANForm()) {
      setLoader(true);
      axios
        .post(APIURL + "ExportApplication/ValidateRBZReferenceNumber", {
          RBZReferenceNumber:
            ValidateChange.relatedexchangeControlNumber.trim(),
        })
        .then((res) => {
          setErrors({});
          setValidateShow(true);
          setLoader(false);
          if (res.data.responseCode == "200") {
            setValidateRBZ(res.data.responseData);
          } else {
            setValidateRBZ([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const supervisorHangechangeRoleRecordofficer = (e) => {
    const value = e.target.value;
    setErrors({});
    setselectuserRoleRecordofficer(value);
    setAssignUserID("");
    setSupervisorRoleId("");
    if (bankSupervisorRef.current) bankSupervisorRef.current.value = "";
    if (value == "") {
      setGetalluser([]);
    } else {
      axios
        .post(APIURL + "User/GetUsersByRoleID", {
          RoleID: value,
          DepartmentID: "3",
          UserID: UserID.replace(/"/g, ""),
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setGetalluser(res.data.responseData);
          } else {
            setGetalluser([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleuserByrecordOfficer = (e) => {
    const value = e.target.value;
    if (value == "") {
      setAssignUserID("");
      setSupervisorRoleId("");
    } else {
      setAssignUserID(value);
      setSupervisorRoleId(selectuserRoleRecordofficer);
      setErrors({});
    }
  };

  useEffect(() => {
    getRoleHandle();
  }, []);

  const convertedRate =
    parseFloat(curRate ? curRate : ratevalue) *
    parseFloat(applicationDetail?.amount);

  const handleuserAddMore = (e) => {
    setOtheruserfiles([...otheruserfiles, null]);
  };

  const handleFileChange = (e, label) => {
    const file = e.target.files[0];
    const index = files?.findIndex((item) => item.label === label);
    if (index !== -1) {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, label };
        return newFiles;
      });
    } else {
      setFiles((prevFiles) => [...prevFiles, { file, label }]);
    }
  };

  const HandleFileUpload = (e, label, indx) => {
    const file = e.target.files[0];
    const index = files?.findIndex((item, i) => i === indx);
    if (index !== -1) {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, label };
        return newFiles;
      });
    } else {
      setFiles((prevFiles) => [...prevFiles, { file, label }]);
    }
  };

  const handleuserFileChange = (e, id) => {
    const file = e.target.files[0];
    const index = userfiles?.findIndex((item) => item.id === id);
    if (index !== -1) {
      setuserFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, id };
        return newFiles;
      });
    } else {
      setuserFiles((prevFiles) => [...prevFiles, { file, id }]);
    }
  };

  const handleOthrefile = (e, id) => {
    const otherfile = e.target.files[0];
    setOtherfilesupload([...otherfilesupload, { otherfile, id }]);
  };

  const handleAddMore = (e) => {
    setOtherfiles([...otherfiles, null]);
  };

  const handleFIleview = () => {
    axios
      .post(APIURL + "ExportApplication/GetSharedFileData", {
        ID: applicationDetail.id,
      })
      .then((res) => {
        if (res.data.responseCode == "200") {
          setviewShareFile(res.data.responseData);
        } else {
          setviewShareFile([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post(APIURL + "ExportApplication/GetFilesByApplicationID", {
        ID: applicationDetail.id,
      })
      .then((res) => {
        if (res.data.responseCode == "200") {
          setgeninfoFile(res.data.responseData);
        } else {
          setgeninfoFile([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleFIleview();
  }, [applicationDetail]);

  const HandelSupervisorcheck = () => {
    setcheckSupervisor(!checkSupervisor);
  };

  useEffect(() => {
    if (checkSupervisor == false) setAssignUserID("");
  }, [checkSupervisor]);

  const HandelSupervisorcheckSelect = () => {
    setcheckSupervisor(!checkSupervisor);
    if (roleID == 3 && checkSupervisor == false) {
      setAssignUserID("0");
      setDescription("");
      setnextlevelvalue("");
      setapplicationstaus("");
    }
    if (roleID == 3 && checkSupervisor == true) {
      setAssignUserID("");
      setapplicationstaus("");
      setDescription("");
    }
  };

  const getNextvaluesupervisor = (e) => {
    const value = e.target.checked;
    if (value == false) {
      setnextlevelvalue("");
    }
    setapplicationstaus("");
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    const numericRegex = /\d/;
    if (applicationDetail.applicationPurpose === "") {
      newErrors.applicationPurpose = "Purpose of the application is required";
      valid = false;
    }
    if (
      applicationDetail.applicantType == "1" &&
      applicationDetail.companyName == "" &&
      !getCompanyName
    ) {
      newErrors.companyName = "Company name is required";
      valid = false;
    }
    if (applicationDetail.applicationTypeID === "") {
      newErrors.applicationTypeID = "Application type is required";
      valid = false;
    }

    if (
      bankID == "" &&
      registerusertype === "3" &&
      applicationDetail.govtAgencie === ""
    ) {
      newErrors.govtAgencie = "Government agencies name is required";
      valid = false;
    }
    if (
      applicationDetail.applicantType == "2" &&
      applicationDetail.applicant == ""
    ) {
      newErrors.applicant = "Applicant name is required";
      valid = false;
    }

    if (AssignUserID == "" && checkSupervisor == true && roleID == 2) {
      newErrors.assignedTo = "Bank Supervisor is required";
      valid = false;
    }

    if (
      selectuserRoleRecordofficer == "" &&
      checkSupervisor == true &&
      roleID == 4
    ) {
      newErrors.selectuserRoleRecordofficer = "Role is required";
      valid = false;
    }
    if (AssignUserID == "" && checkSupervisor == true && roleID == 4) {
      newErrors.AssignUserID = "User is required";
      valid = false;
    }

    if (applicationDetail.currency === "") {
      newErrors.currency = "Currency is required";
      valid = false;
    }
    if (applicationDetail.amount === "") {
      newErrors.amount = "Amount is required";
      valid = false;
    }
    if (applicationDetail.applicationType === "") {
      newErrors.applicationType = "Application Type number is required";
      valid = false;
    }
    if (applicationDetail.sector === "") {
      newErrors.sector = "Sector is required";
      valid = false;
    }
    if (
      (applicationDetail.subSector === "" || checksectorchange === true) &&
      applicationDetail.sector != 2
    ) {
      newErrors.subSector = "Sub sector is required";
      valid = false;
    }
    if (applicationDetail.applicantComment === "") {
      newErrors.applicantComment = "Applicant comments is required";
      valid = false;
    }
    if (
      checkSupervisor == true &&
      (AssignUserID == "" || AssignUserID == null) &&
      recomdAnalyst != "121"
    ) {
      newErrors.assignedTo = "Bank supervisor is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const filtertin_bpn = companies?.find((company) => {
    if (company.id === getCompanyName?.value) {
      return {
        getbpn: company.bpnNumber,
        gettin: company.tinNumber,
      };
    }
  });

  const vOption = masterBank?.map((res) => ({
    name: res.bankName,
    code: res.id,
  }));

  const PdftargetRef = useRef();

  const closePopupHandle = () => {
    if (menuname === "Exports" && submenuname === "Pending Returns") {
      navigate("/PendingReturns");
    } else {
      navigate("/BankADLADashboard");
    }
    EditModalClose();
    handleData();
    setupdatepopup(false);
    setApplicationDetail({});
    setSupervisorRoleId("");
    setAssignUserID("");
    setselectuserRoleRecordofficer("");
    if (BPNCodeRef.current) BPNCodeRef.current.value = "";
    if (TINRef.current) TINRef.current.value = "";
    if (amountRef.current) amountRef.current.value = "";
    if (applicantRef.current) applicantRef.current.value = "";
    if (applicantCommentsRef.current) applicantCommentsRef.current.value = "";
    if (BeneficiaryNameRef.current) BeneficiaryNameRef.current.value = "";
    if (applicantReferenceNumberRef.current)
      applicantReferenceNumberRef.current.value = "";
    // if(applicantYearRef.current) applicantYearRef.current.value = '';
    if (applicationTypeRef.current) applicationTypeRef.current.value = "";
    if (assignedToRef.current) assignedToRef.current.value = "";
    if (companyNameRef.current) companyNameRef.current.value = "";
    if (currencyRef.current) currencyRef.current.value = "";
    if (govtAgencieRef.current) govtAgencieRef.current.value = "";

    if (applicationPurposeRef.current) applicationPurposeRef.current.value = "";
    if (relatedexchangeControlNumberRef.current)
      relatedexchangeControlNumberRef.current.value = "";
    if (sectorRef.current) sectorRef.current.value = "";
    if (subsectorRef.current) subsectorRef.current.value = "";

    if (typeExporterRef.current) typeExporterRef.current.value = "";
    if (usdEquivalentRef.current) usdEquivalentRef.current.value = "";

    if (rateRef.current) rateRef.current.value = "";

    if (FrequencyDateRef.current) FrequencyDateRef.current.value = "";
    if (FrequencyRef.current) FrequencyRef.current.value = "";
  };

  // Code start for save form
  const HandleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    let shareformData = new FormData();
    if (validateForm()) {
      setSubmitBtnLoader(true);
      await axios
        .post(APIURL + "ExportApplication/CreateExportApplication", {
          RBZReferenceNumber: applicationDetail?.rbzReferenceNumber,
          ID: applicationDetail?.id,
          DepartmentID: "2",
          UserID: UserID.replace(/"/g, ""),
          RoleID: roleID,
          AssignedTo:
            roleID >= 3 && AssignUserID == ""
              ? ""
              : AssignUserID
              ? AssignUserID
              : UserID.replace(/"/g, ""),
          BankID: applicationDetail?.bankID,
          CompanyID:
            (applicationDetail?.applicantType == "1" ||
              applicationDetail?.userTypeID == "1") &&
            applicationDetail?.bankID !== ""
              ? getCompanyName
                ? getCompanyName.value
                : applicationDetail?.companyID
              : "",
          ApplicationPurpose: applicationDetail?.applicationPurpose,
          UserTypeID: applicationDetail?.applicantType,
          ApplicantType: applicationDetail?.applicantType,
          Name: applicationDetail?.name,
          BeneficiaryName: applicationDetail?.beneficiaryName,
          BPNCode:
            filtertin_bpn || filtertin_bpn != undefined
              ? filtertin_bpn?.bpnNumber?.toUpperCase()
              : applicationDetail?.bpnCode,
          TINNumber:
            filtertin_bpn || filtertin_bpn != undefined
              ? filtertin_bpn?.tinNumber?.toUpperCase()
              : applicationDetail?.tinNumber,
          ApplicantReferenceNumber:
            applicationDetail?.applicantReferenceNumber?.toUpperCase(),
          ApplicationTypeID: applicationDetail?.applicationTypeID,
          Currency: applicationDetail?.currency,
          Amount: applicationDetail?.amount,
          Rate: !curRate ? applicationDetail?.rate : curRate,
          USDEquivalent: convertedRate
            ? convertedRate
            : applicationDetail?.usdEquivalent,
          RECNumber: applicationDetail?.recNumber?.toUpperCase(),
          Sector: applicationDetail?.sector,
          SubSector: applicationDetail?.subSector,
          ApplicantComment: applicationDetail?.applicantComment,
          ApplicationDate: startDate
            ? startDate
            : applicationDetail?.applicationDate,
          Comment: asignnextLeveldata.Comment,
          AssignedToRoleID: SupervisorRoleId
            ? SupervisorRoleId
            : AssignUserID && SupervisorRoleId == "" && nextlevelvalue != "20"
            ? parseInt(roleID) + 1
            : roleID,
          IsDeferred: IsDeferred,
          Notes: asignnextLeveldata.Notes,
          ExpiringDate: defaultnoExpiry == "0" ? "" : ExpiringDate,
          ApplicationStatus: applicationstaus,
          ParentApplicationID: applicationDetail?.id,
          ActionStatus:
            (AssignUserID == "" || AssignUserID == null) &&
            roleID != 5 &&
            roleID != 2 &&
            roleID != 4
              ? "100"
              : nextlevelvalue,
          Description: Description
            ? Description
            : applicationDetail?.analystDescription,
          IsReturnNeeded: IsReturn,
          ReturnFrequencyType: IsReturn == "1" ? getFrequencyID : "",
          ReturnDate:
            IsReturn == "1" && getFrequencyID == "1"
              ? IsReturnExpiringDate
              : "",
          CopiedResponse: formatecopyresponse?.join(),
        })
        .then(async (res) => {
          if (res.data.responseCode === "200") {
            let x = delDataFile?.map((v) => {
              return {
                id: v?.id,
                fileName: v?.fileName,
                label: v?.label.includes("Old")
                  ? v?.label
                  : "Old" + " " + v?.label,
                filePath: v?.filePath,
                departmentID: 2,
                applicationID: res.data.responseData?.id,
              };
            });
            await axios
              .post(APIURL + "File/RenewFiles", x)
              .then((res) => console.log("Success"))
              .catch((err) => console.log("RenewFiles Error - ", err));

            Storage.setItem(
              "generatedNumber",
              res.data.responseData.rbzReferenceNumber
            );
            const fileupload = userfiles.length > 0 ? userfiles : files;
            for (let i = 0; i < fileupload?.length; i++) {
              formData.append("files", fileupload[i].file);
              formData.append("Label", fileupload[i].label);
            }
            formData.append(
              "ApplicationActivityID",
              res.data.responseData?.applicationActivityID
            );
            formData.append(
              "RBZReferenceNumber",
              applicationDetail?.rbzReferenceNumber
            );
            formData.append("ApplicationID", res.data.responseData?.id);
            formData.append("DepartmentID", "2");
            formData.append("UserID", UserID.replace(/"/g, ""));
            axios
              .post(ImageAPI + "File/UploadFile", formData)
              .then((res) => {})
              .catch((err) => {
                console.log("file Upload ", err);
              });

            axios
              .post(APIURL + "ExportApplication/CopyingResponses", copyresponse)
              .then((resposnse) => {})
              .catch((error) => {
                console.log("error", error);
              });

            for (let i = 0; i < sharefile?.length; i++) {
              shareformData.append("files", sharefile[i].file);
              shareformData.append("fileInfoID", sharefile[i].fileInfoID);
            }
            shareformData.append(
              "RBZReferenceNumber",
              applicationDetail?.rbzReferenceNumber
            );
            shareformData.append("ApplicationID", applicationDetail?.id);
            shareformData.append("IsSharedDoc", "1");
            shareformData.append("DepartmentID", "2");
            shareformData.append("UserID", UserID.replace(/"/g, ""));

            axios
              .post(ImageAPI + "File/UploadSharedDocs", shareformData)
              .then((res) => {})
              .catch((err) => {
                console.log("sharefile Upload ", err);
              });
            handleData();
            setSupervisorRoleId("");
            setupdatepopup(true);
            setSubmitBtnLoader(false);
            setAssignUserID("");
            setselectuserRoleRecordofficer("");
          } else {
            toast.error(res.data.responseMessage);
            setSubmitBtnLoader(false);
          }
        })
        .catch((err) => {
          setSubmitBtnLoader(false);
          console.log(err);
          setupdatepopup(false)
        });
    } else {
      if (!toastDisplayed) {
        toast.warning("Please fill all fields");
      }
      setToastDisplayed(true);
      setSubmitBtnLoader(false);
    }
  };

  const HandleSubmitPendingReturns = async (e) => {
    try {
      e.preventDefault();
      let formData = new FormData();
      setSubmitBtnLoader(true);
      await axios
        .post(APIURL + "ReturnApplication/CreateReturnApplication", {
          ID: applicationDetail?.id,
          RoleID: roleID,
          UserID: UserID.replace(/"/g, ""),
          DepartmentID: "2",
          Status: "300",
          AssignedToRoleID: SupervisorRoleId
            ? SupervisorRoleId
            : AssignUserID && SupervisorRoleId == "" && nextlevelvalue != "20"
            ? parseInt(roleID) + 1
            : roleID,
          AssignedTo:
            roleID >= 3 && AssignUserID == ""
              ? ""
              : AssignUserID
              ? AssignUserID
              : UserID.replace(/"/g, ""),
          Comment: PendingReturnComment,
          Notes: PendingReturnNote,
        })
        .then((res) => {
          for (let i = 0; i < files?.length; i++) {
            formData.append("files", files[i].file);
            formData.append("Label", files[i].label);
          }
          formData.append(
            "ApplicationActivityID",
            res.data.responseData?.applicationActivityID
          );
          formData.append(
            "RBZReferenceNumber",
            applicationDetail?.rbzReferenceNumber
          );
          formData.append("ApplicationID", res.data.responseData?.id);
          formData.append("DepartmentID", "7");
          formData.append("UserID", UserID.replace(/"/g, ""));
          axios
            .post(ImageAPI + "File/UploadFile", formData)
            .then((res) => {
              console.log("success");
            })
            .catch((err) => {
              console.log("file Upload ", err);
            });
            Storage.setItem(
              "generatedNumber",
              res.data.responseData.rbzReferenceNumber
            );
          handleData();
          setSupervisorRoleId("");
          setupdatepopup(true);
          setSubmitBtnLoader(false);
          setAssignUserID("");
          setselectuserRoleRecordofficer("");
        });
    } catch (error) {
      console.log("CreateReturnApplication - error --", error);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  const handleChangecompany = (selectedOption) => {
    setgetCompanyName(selectedOption);
  };

  const handleInputChangecompany = (input) => {
    setInputValue(input);
    if (input?.length >= 3) {
      const filteredOptions = companies
        ?.filter((company) =>
          company?.companyName?.toLowerCase().includes(input.toLowerCase())
        )
        ?.map((company) => ({
          value: company?.id,
          label: company?.companyName,
        }));
      setOptions(filteredOptions?.length > 0 ? filteredOptions : []);
    } else {
      setOptions([]);
    }
  };

  const handleClear = () => {
    setValue(null);
    setInputValue("");
    setOptions([]);
  };

  useEffect(() => {
    if (toastDisplayed) {
      setTimeout(() => {
        setToastDisplayed(false);
      }, 1500);
    }
  }, [toastDisplayed]);

  const CCValue = applicationDetail?.copiedResponses?.length
    ? applicationDetail?.copiedResponses?.map((v, i) => (
        <li key={i}>{v.bankName}</li>
      ))
    : null;

  useEffect(() => {
    let newData1 = getBlankFile?.filter((blankFile) => {
      return !geninfoFile?.some(
        (infoFile) => infoFile.label === blankFile.name
      );
    });
    setDelDataFiles(geninfoFile);
    setnewData(newData1);
  }, [applicationDetail, geninfoFile, allcomment]);

  const handleRemovfile = (id) => {
    let newData1 = delDataFile?.filter((blankFile) => {
      return blankFile.id !== id;
    });
    setDelDataFiles(newData1);
  };

  return (
    <>
      {showdataLoader == true || !noDataComment?.length ? (
        <label className="outerloader2">
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : (
        <>
          <h5
            className={
              geninfoTab
                ? "section_top_subheading mt-0 py-3 btn-collapse_active cursorpointer"
                : "section_top_subheading mt-0 py-3 cursorpointer"
            }
            onClick={() => setgeninfoTab(!geninfoTab)}
          >
            General Info{" "}
            <span className="btn-collapse">
              <i className="bi bi-caret-down-fill"></i>
            </span>
          </h5>
          <form>
            <div className={geninfoTab ? "customtab" : "d-none"}>
              <div className="inner_form_new ">
                <label className="controlform">User</label>
                <div className="form-bx">
                  <label>
                    <input
                      type="text"
                      name="user"
                      value={applicationDetail.userName?.replace(/"/g, "")}
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>

              {bankName != "null" && (
                <div className="inner_form_new ">
                  <label className="controlform">Name of Bank</label>

                  <div className="form-bx">
                    <label>
                      <input
                        type="text"
                        value={
                          roleID == 2
                            ? bankName.replace(/"/g, "")
                            : applicationDetail?.bankName
                        }
                        disabled
                      />
                      <span className="sspan"></span>
                    </label>
                  </div>
                </div>
              )}

              <div className="inner_form_new ">
                <label className="controlform">
                  Purpose of the Application
                </label>

                <div className="form-bx">
                  <label>
                    <textarea
                      name="applicationPurpose"
                      ref={applicationPurposeRef}
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      placeholder="Purpose of the Application"
                      className={errors.applicationPurpose ? "error" : ""}
                      value={applicationDetail.applicationPurpose}
                      disabled={
                        (roleID == 2 || roleID == 4) &&
                        menuname === "Exports" &&
                        submenuname !== "Pending Returns"
                          ? false
                          : true
                      }
                    />
                    <span className="sspan"></span>
                    {errors.applicationPurpose ? (
                      <small className="errormsg">
                        {errors.applicationPurpose}
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Type of Exporter</label>
                <div className="form-bx-radio mt-4">
                  <label>
                    <input
                      type="radio"
                      checked={
                        applicationDetail?.applicantType === 1 ? true : false
                      }
                      disabled={
                        applicationDetail?.applicantType === 1 &&
                        menuname === "Exports" &&
                        submenuname !== "Pending Returns"
                          ? false
                          : true
                      }
                    />{" "}
                    <span>Corporate</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={
                        applicationDetail?.applicantType === 2 ? true : false
                      }
                      disabled={
                        applicationDetail?.applicantType === 2 &&
                        menuname === "Exports" &&
                        submenuname !== "Pending Returns"
                          ? false
                          : true
                      }
                    />{" "}
                    <span>Individual</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="exporterType"
                      checked={
                        applicationDetail?.applicantType === 3 ? true : false
                      }
                      disabled
                    />{" "}
                    <span>Government Agencies</span>
                  </label>
                </div>
              </div>

              {applicationDetail?.applicantType == "1" && bankID != "" ? (
                <>
                  <div className="inner_form_new ">
                    <label className="controlform">Company Name</label>
                    <div className="form-bx">
                      <Select
                        placeholder={
                          applicationDetail.companyName
                            ? applicationDetail.companyName
                            : "Select company name"
                        }
                        value={getCompanyName}
                        onChange={handleChangecompany}
                        onInputChange={handleInputChangecompany}
                        options={options}
                        isSearchable
                        noOptionsMessage={({ inputValue }) =>
                          inputValue?.length >= 3
                            ? "No company found"
                            : "Please provide at least 3 characters for auto search of Company Name"
                        }
                        onMenuClose={handleClear}
                        className="selectinput"
                        isDisabled={
                          (roleID == 2 || roleID == 4) &&
                          menuname === "Exports" &&
                          submenuname !== "Pending Returns"
                            ? false
                            : true
                        }
                      />

                      {errors.companyName ? (
                        <small className="errormsg2">
                          {errors.companyName}
                        </small>
                      ) : (
                        ""
                      )}

                      <small className="informgs">
                        {" "}
                        Please provide at least 3 characters for auto search of
                        Company Name.
                      </small>
                    </div>
                  </div>

                  <div className="inner_form_new ">
                    <label className="controlform">TIN Number</label>
                    <div className="form-bx">
                      <label>
                        <input
                          type="text"
                          name="tinNumber"
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          placeholder="TIN Number"
                          value={
                            filtertin_bpn?.tinNumber
                              ? filtertin_bpn?.tinNumber
                              : applicationDetail?.tinNumber
                          }
                          className="text-uppercase"
                          disabled
                        />
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}

              {applicationDetail?.applicantType == "2" && bankID != "" ? (
                <>
                  <div className="inner_form_new ">
                    <label className="controlform">Applicant</label>
                    <div className="form-bx">
                      <label>
                        <input
                          type="text"
                          ref={applicantRef}
                          name="name"
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          placeholder="Applicant"
                          value={applicationDetail?.name}
                          className={
                            errors.applicant && applicationDetail?.name === ""
                              ? "error"
                              : ""
                          }
                          disabled={
                            (roleID == 2 || roleID == 4) &&
                            menuname === "Exports" &&
                            submenuname !== "Pending Returns"
                              ? false
                              : true
                          }
                        />
                        <span className="sspan"></span>
                        {errors.applicant && applicationDetail.name === "" ? (
                          <small className="errormsg">{errors.applicant}</small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}

              {applicationDetail?.applicantType == "1" && bankID != "" ? (
                <div className="inner_form_new ">
                  <label className="controlform">BPN Code</label>

                  <div className="form-bx">
                    <label>
                      <input
                        ref={BPNCodeRef}
                        type="text"
                        min={0}
                        name="bpnCode"
                        value={
                          filtertin_bpn?.bpnNumber
                            ? filtertin_bpn?.bpnNumber?.trim()
                            : applicationDetail?.bpnCode
                        }
                        onChange={(e) => {
                          changeHandelForm(e);
                        }}
                        placeholder="BPN Code"
                        className={
                          errors.bpnCode
                            ? "error text-uppercase"
                            : "text-uppercase"
                        }
                        disabled
                      />
                      <span className="sspan"></span>
                      {errors.bpnCode ? (
                        <small className="errormsg">{errors.bpnCode}</small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                ""
              )}

              {bankID == "" ? (
                <div className="inner_form_new ">
                  <label className="controlform">Government Agencies</label>

                  <div className="form-bx">
                    <label>
                      <select
                        ref={govtAgencieRef}
                        name="govtAgencie"
                        onChange={(e) => {
                          changeHandelForm(e);
                        }}
                        className={
                          errors.govtAgencie &&
                          applicationDetail?.govtAgencie === ""
                            ? "error"
                            : ""
                        }
                        disabled={
                          (roleID == 2 || roleID == 4) &&
                          menuname === "Exports" &&
                          submenuname !== "Pending Returns"
                            ? false
                            : true
                        }
                      >
                        <option value="">
                          Select Government Agencies Name
                        </option>
                        {GovernmentAgencies?.map((item, index) => {
                          return (
                            <option value={item.id} key={index}>
                              {item.agencyName}
                            </option>
                          );
                        })}
                      </select>
                      <span className="sspan"></span>
                      {errors.govtAgencie &&
                      applicationDetail?.govtAgencie === "" ? (
                        <small className="errormsg">{errors.govtAgencie}</small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="inner_form_new ">
                <label className="controlform">
                  Applicant Reference Number
                </label>

                <div className="form-bx">
                  <label>
                    <input
                      ref={applicantReferenceNumberRef}
                      type="text"
                      name="applicantReferenceNumber"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      placeholder="Applicant Reference Number"
                      className={
                        errors.applicantReferenceNumber
                          ? "error text-uppercase"
                          : "text-uppercase"
                      }
                      value={
                        applicationDetail?.applicantReferenceNumber
                          ? applicationDetail?.applicantReferenceNumber
                          : ""
                      }
                      disabled={
                        (roleID == 2 || roleID == 4) &&
                        menuname === "Exports" &&
                        submenuname !== "Pending Returns"
                          ? false
                          : true
                      }
                    />
                    <span className="sspan"></span>
                    {errors.applicantReferenceNumber ? (
                      <small className="errormsg">
                        {errors.applicantReferenceNumber}
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Application Date</label>

                <div className="form-bx">
                  <DatePicker
                    closeOnScroll={(e) => e.target === document}
                    selected={
                      startDate ? startDate : applicationDetail?.applicationDate
                    }
                    onChange={(date) => setStartDate(date)}
                    peekNextMonth
                    showMonthDropdown
                    maxDate={new Date()}
                    minDate="01/01/2018"
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MMM/yyyy"
                    disabled={
                      (roleID == 2 || roleID == 4) &&
                      menuname === "Exports" &&
                      submenuname !== "Pending Returns"
                        ? false
                        : true
                    }
                    onKeyDown={(e) => {
                      const key = e.key;
                      const allowedKeys = /[0-9\/]/;
                      if (
                        !allowedKeys.test(key) &&
                        key !== "Backspace" &&
                        key !== "Delete"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />

                  <span className="sspan"></span>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Application Type</label>

                <div className="form-bx">
                  <label>
                    <select
                      ref={applicationTypeRef}
                      name="applicationTypeID"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      className={errors.applicationTypeID ? "error" : ""}
                      disabled={
                        (roleID == 2 || roleID == 4) &&
                        menuname === "Exports" &&
                        submenuname !== "Pending Returns"
                          ? false
                          : true
                      }
                    >
                      <option value="">Select Application Type</option>
                      {applicationType?.map((item, ind) => {
                        return (
                          <option
                            key={item.id}
                            value={item.id}
                            selected={
                              applicationDetail?.applicationTypeID === item?.id
                            }
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                    <span className="sspan"></span>
                    {errors.applicationType ? (
                      <small className="errormsg">
                        {errors.applicationType}
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="inner_form_new">
                    <label className="controlform">Currency</label>

                    <div className="form-bx">
                      <label>
                        <select
                          ref={currencyRef}
                          name="currency"
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          className={
                            errors.currency &&
                            applicationDetail?.currency === ""
                              ? "error"
                              : ""
                          }
                          disabled={
                            (roleID == 2 || roleID == 4) &&
                            menuname === "Exports" &&
                            submenuname !== "Pending Returns"
                              ? false
                              : true
                          }
                        >
                          <option value="">Select Currency</option>
                          {currency?.map((cur, ind) => {
                            return (
                              <option
                                key={cur.id}
                                value={cur.id}
                                selected={applicationDetail?.currency == cur.id}
                              >
                                {cur.currencyCode}
                              </option>
                            );
                          })}
                        </select>
                        <span className="sspan"></span>
                        {errors.currency &&
                        applicationDetail.currency === "" ? (
                          <small className="errormsg">{errors.currency}</small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="inner_form_new-sm">
                    <label className="controlform-sm">Amount</label>
                    <div className="form-bx-sm">
                      <label>
                        <input
                          ref={amountRef}
                          type="number"
                          min={0}
                          name="amount"
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          value={applicationDetail?.amount}
                          placeholder="Amount"
                          className={
                            errors.amount && applicationDetail?.amount === ""
                              ? "error"
                              : ""
                          }
                          disabled={
                            (roleID == 2 || roleID == 4) &&
                            menuname === "Exports" &&
                            submenuname !== "Pending Returns"
                              ? false
                              : true
                          }
                        />
                        <span className="sspan"></span>
                        {errors.amount && applicationDetail?.amount === "" ? (
                          <small className="errormsg">{errors.amount}</small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="inner_form_new-sm">
                    <label className="controlform-sm">Rate</label>
                    <div className="form-bx-sm">
                      <label>
                        <input
                          ref={rateRef}
                          type="text"
                          name="rate"
                          value={curRate}
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          placeholder="Rate"
                          disabled
                        />
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">USD Equivalent</label>
                <div className="form-bx">
                  <label>
                    <input
                      ref={usdEquivalentRef}
                      type="text"
                      name="usdEquivalent"
                      value={
                        applicationDetail?.currency && applicationDetail?.amount
                          ? convertedRate == NaN
                            ? applicationDetail?.usdEquivalent
                            : convertedRate.toFixed(2)
                          : convertedRate == 0
                          ? convertedRate.toFixed(2)
                          : "USD Equivalent"
                      }
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      placeholder="USD Equivalent"
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">
                  Related Exchange Control Reference Number
                </label>
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex">
                      <div className="form-bx">
                        <label>
                          <input
                            ref={relatedexchangeControlNumberRef}
                            type="text"
                            min={0}
                            name="relatedexchangeControlNumber"
                            value={
                              ValidateChange.relatedexchangeControlNumber
                                ? ValidateChange.relatedexchangeControlNumber.trim()
                                : applicationDetail?.recNumber
                            }
                            defaultValue={applicationDetail?.rbzReferenceNumber}
                            onChange={(e) => {
                              changeHandelFormValidate(e);
                            }}
                            placeholder="Related Exchange Control Reference Number"
                            className={
                              errors.relatedexchangeControlNumber
                                ? "error text-uppercase"
                                : "text-uppercase"
                            }
                            disabled={
                              (roleID == 2 || roleID == 4) &&
                              menuname === "Exports" &&
                              submenuname !== "Pending Returns"
                                ? false
                                : true
                            }
                          />
                          <span className="sspan"></span>
                          {errors.relatedexchangeControlNumber ? (
                            <small className="errormsg">
                              {errors.relatedexchangeControlNumber}
                            </small>
                          ) : (
                            ""
                          )}
                        </label>
                        {loader == true ? (
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
                        ) : ValidateShow == true ? (
                          <div className="card validatepecanfield">
                            {ValidateRBZ.length > 0 ? (
                              <DataTable
                                value={ValidateRBZ}
                                scrollable
                                scrollHeight="500px"
                                paginator={
                                  ValidateRBZ?.length > 10 ? true : false
                                }
                                rowHover
                                paginatorRight
                                rows={10}
                                dataKey="id"
                                rowsPerPageOptions={[10, 50, 100]}
                                emptyMessage="No Data found."
                                footer={footer}
                              >
                                <Column
                                  field="rbzReferenceNumber"
                                  header="RBZ Reference Number"
                                  style={{ minWidth: "200px" }}
                                ></Column>
                                <Column
                                  field="name"
                                  header="Applicant Name"
                                  style={{ minWidth: "180px" }}
                                  body={applicantNAME}
                                ></Column>
                                <Column
                                  field="bankName"
                                  header="Bank Name"
                                  style={{ minWidth: "150px" }}
                                ></Column>
                                <Column
                                  field="applicationType"
                                  header="Application Type"
                                  style={{ minWidth: "250px" }}
                                ></Column>
                                <Column
                                  field="amount"
                                  header="Amount"
                                  style={{ minWidth: "150px" }}
                                  body={amountData}
                                ></Column>
                                <Column
                                  field="statusName"
                                  header="Status"
                                  style={{ minWidth: "200px" }}
                                ></Column>
                                <Column
                                  field="createdDate"
                                  header="Submitted Date"
                                  style={{ minWidth: "150px" }}
                                  body={createdDate}
                                ></Column>
                                <Column
                                  field=""
                                  header="Action"
                                  style={{ minWidth: "100px" }}
                                  frozen
                                  alignFrozen="right"
                                  body={action}
                                ></Column>
                              </DataTable>
                            ) : (
                              <div className="d-flex justify-content-between align-items-center p-2">
                                <p className="mb-0">No Data</p>
                                <button
                                  className="validateCrossIcon"
                                  onClick={() => setValidateShow(false)}
                                >
                                  <i className="bi bi-x-circle"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          " "
                        )}
                      </div>
                      <button
                        type="button"
                        className="primrybtn v-button"
                        onClick={(e) => handleValidateRBZ(e)}
                        disabled={
                          menuname === "Exports" &&
                          submenuname === "Pending Returns"
                            ? true
                            : false
                        }
                      >
                        Validate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Sector</label>
                <div className="form-bx">
                  <label>
                    <select
                      ref={sectorRef}
                      name="sector"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      className={
                        errors.sector && applicationDetail?.sector === ""
                          ? "error"
                          : ""
                      }
                      disabled={
                        (roleID == 2 || roleID == 4) &&
                        menuname === "Exports" &&
                        submenuname !== "Pending Returns"
                          ? false
                          : true
                      }
                    >
                      <option value="">Select Sector</option>
                      {sectorData?.map((item, ind) => {
                        return (
                          <option
                            key={item.id}
                            value={item.id}
                            selected={applicationDetail?.sector === item.id}
                          >
                            {item.sectorName}
                          </option>
                        );
                      })}
                    </select>
                    <span className="sspan"></span>
                    {errors.sector && applicationDetail?.sector === "" ? (
                      <small className="errormsg">{errors.sector}</small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>

              <div className="inner_form_new">
                <label className="controlform">Subsector</label>
                <div className="form-bx">
                  <label>
                    <select
                      ref={subsectorRef}
                      name="subSector"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      disabled={
                        applicationDetail.sector === "" ||
                        ((roleID == 2 || roleID == 4) &&
                          menuname === "Exports" &&
                          submenuname !== "Pending Returns")
                          ? false
                          : true
                      }
                      className={errors.subSector ? "error" : ""}
                    >
                      <option value="">Subsector</option>
                      {subsectorData?.map((item, index) => {
                        return (
                          <option
                            key={item.id}
                            value={item.id}
                            selected={applicationDetail?.subSector == item.id}
                          >
                            {item.subSectorName}
                          </option>
                        );
                      })}
                    </select>
                    <span className="sspan"></span>
                    {errors.subSector ? (
                      <small className="errormsg">{errors.subSector}</small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Applicant Comments</label>
                <div className="form-bx">
                  <label>
                    <textarea
                      ref={applicantCommentsRef}
                      name="applicantComment"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      placeholder="Applicant Comments"
                      className={errors.applicantComment ? "error" : ""}
                      value={applicationDetail.applicantComment}
                      disabled={
                        (roleID == 2 || roleID == 4) &&
                        menuname === "Exports" &&
                        submenuname !== "Pending Returns"
                          ? false
                          : true
                      }
                    />
                    <span className="sspan"></span>
                    {errors.applicantComment ? (
                      <small className="errormsg">
                        {errors.applicantComment}
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>

              <div className={roleID == 4 ? "d-none" : "inner_form_new "}>
                <label className="controlform">Submit To Next Level </label>
                <input
                  type="checkbox"
                  onChange={HandelSupervisorcheck}
                  checked={checkSupervisor}
                  disabled={roleID == 2 ? false : true}
                />
              </div>

              {checkSupervisor === true && roleID == 2 ? (
                <div className="inner_form_new ">
                  <label className="controlform">Bank Supervisor</label>
                  <div className="form-bx">
                    <label>
                      <select
                        ref={bankSupervisorRef}
                        name="assignedTo"
                        onChange={supervisorHangechangeBankuser}
                        className={
                          errors.assignedTo && !AssignUserID ? "error" : ""
                        }
                      >
                        <option value="">Select Bank Supervisor</option>
                        {Supervisors?.map((item, index) => {
                          return (
                            <option
                              key={index}
                              value={JSON?.stringify(item)}
                              selected={
                                item.userID == applicationDetail?.assignedTo
                              }
                            >
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                      <span className="sspan"></span>
                      {errors.bankSupervisor &&
                      applicationDetail.bankSupervisor === "" ? (
                        <small className="errormsg">
                          {errors.bankSupervisor}
                        </small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                ""
              )}

              {checkSupervisor == true && roleID == 4 ? (
                <div className="inner_form_new ">
                  <label className="controlform">
                    RBZ Record Officer Submit to
                  </label>
                  <div className="form-bx">
                    <label>
                      <select
                        name="SupervisorRoleId"
                        onChange={(e) => {
                          supervisorHangechangeRoleRecordofficer(e);
                        }}
                      >
                        <option value="">Select Role</option>
                        {userRole?.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>
                              {item.designation}
                            </option>
                          );
                        })}
                      </select>
                      <span className="sspan"></span>
                      {errors.selectuserRoleRecordofficer &&
                      selectuserRoleRecordofficer === "" ? (
                        <small className="errormsg">Role is required</small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                ""
              )}

              {checkSupervisor == true && roleID == 4 && getalluser?.length ? (
                <div className="w-100">
                  <div className="inner_form_new">
                    <label className="controlform">User</label>
                    <div className="form-bx">
                      <label>
                        <select
                          ref={bankSupervisorRef}
                          name="bankSupervisor"
                          onChange={(e) => {
                            handleuserByrecordOfficer(e);
                          }}
                          className={
                            errors.bankSupervisor &&
                            applicationDetail.bankSupervisor === ""
                              ? "error"
                              : ""
                          }
                        >
                          <option value="" selected>
                            Select User
                          </option>
                          {getalluser?.map((item, index) => {
                            return (
                              <option key={item.id} value={item.userID}>
                                {item.name}
                              </option>
                            );
                          })}
                        </select>
                        <span className="sspan"></span>
                        {errors.bankSupervisor &&
                        applicationDetail.bankSupervisor === "" ? (
                          <small className="errormsg">User is required</small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}

              <h5 className="section_top_subheading mt-2">Attachments</h5>

              {applicationDetail?.fileName || applicationDetail?.filePath ? (
                <div className="attachemt_form-bx">
                  <label
                    style={{
                      background: "#d9edf7",
                      padding: "9px 3px",
                      border: "0px",
                    }}
                  >
                    {applicationDetail?.fileName ? (
                      <span style={{ fontWeight: "500" }}>
                        {applicationDetail?.fileName}
                      </span>
                    ) : (
                      <span style={{ fontWeight: "500" }}>Cover Letter</span>
                    )}
                  </label>
                  {applicationDetail?.filePath ? (
                    <span className="filename">
                      <Link
                        to={applicationDetail?.filePath}
                        target="_blank"
                        className={
                          applicationDetail?.filePath
                            ? "viewbtn_file"
                            : "viewbtn_file pe-none"
                        }
                      >
                        View File
                      </Link>
                    </span>
                  ) : (
                    <span className="disabletext">Not Found</span>
                  )}
                </div>
              ) : (
                ""
              )}

              {delDataFile?.length ? (
                delDataFile?.map((items, index) => {
                  return (
                    <div className="attachemt_form-bx  mt-2" key={items.id}>
                      <label
                        style={{
                          background: "#d9edf7",
                          padding: "9px 3px",
                          border: "0px",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>
                          {items.label ? items.label : items.name}
                        </span>
                      </label>

                      <span className="filename">
                        <Link
                          className="viewbtn_file"
                          to={items?.filePath}
                          target="_blank"
                        >
                          View File
                        </Link>
                      </span>

                      {(roleID == 2 || roleID == 4) &&
                      menuname === "Exports" &&
                      submenuname !== "Pending Returns" ? (
                        <button
                          type="button"
                          onClick={(e) => handleRemovfile(items?.id)}
                          className="remove-file"
                        >
                          Remove
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })
              ) : applicationDetail?.filePath != null ||
                applicationDetail?.filePath != "" ? (
                ""
              ) : (
                <div className="text-center">File Not Found</div>
              )}

              {menuname === "Exports" &&
                submenuname !== "Pending Returns" &&
                getBlankFile?.map((items, index) => {
                  return (
                    <div className="attachemt_form-bx" key={items.id}>
                      <label
                        style={{
                          background: "#d9edf7",
                          padding: "9px 3px",
                          border: "0px",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>
                          {" "}
                          {items.name}{" "}
                        </span>
                      </label>
                      <div className="browse-btn">
                        Browse{" "}
                        <input
                          type="file"
                          onChange={(e) =>
                            HandleFileUpload(
                              e,
                              items.label ? items.label : items.name
                            )
                          }
                        />
                      </div>
                      <span className="filename">
                        {files.find((f) => f.label === items?.name)?.file
                          ?.name || "No file chosen"}
                      </span>

                      {files?.length &&
                      files?.find((f) => f.label === items.name)?.file?.name ? (
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => removefileImage(items?.name)}
                        >
                          Remove
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              {menuname === "Exports" &&
                submenuname !== "Pending Returns" &&
                otherfiles.map((file, index) => (
                  <div
                    key={"other" + (index + 1)}
                    className="attachemt_form-bx"
                  >
                    <label
                      style={{
                        background: "#d9edf7",
                        padding: "9px 3px",
                        border: "0px",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}>
                        {" "}
                        Other File {index + 1}{" "}
                      </span>
                    </label>
                    <div className="browse-btn">
                      Browse{" "}
                      <input
                        type="file"
                        onChange={(e) => {
                          handleFileChange(e, "other" + (index + 1));
                        }}
                      />
                    </div>
                    <span className="filename">
                      {files.find((f) => f.label === "other" + (index + 1))
                        ?.file?.name || "No file chosen"}
                    </span>

                    {files?.length &&
                    files?.find((f) => f.label == "other" + (index + 1))?.file
                      ?.name ? (
                      <button
                        type="button"
                        className="remove-file"
                        onClick={() => removefileImage("other" + (index + 1))}
                      >
                        Remove
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              {menuname === "Exports" &&
              submenuname !== "Pending Returns" &&
              files?.length ? (
                <button
                  type="button"
                  className="addmore-btn mb-2"
                  onClick={(e) => handleAddMore(e)}
                >
                  {" "}
                  Add More File{" "}
                </button>
              ) : (
                ""
              )}

              {menuname === "Exports" && submenuname === "Pending Returns" ? (
                <>
                <h5 className="section_top_subheading mt-2">Pending Returns</h5>
                  <div className="inner_form_new ">
                    <label className="controlform">Returns Notes</label>
                    <div className="form-bx">
                      <label>
                        <textarea
                          ref={applicantCommentsRef}
                          name="applicantComment"
                          onChange={(e) => {
                            setPendingReturnNote(e.target.value);
                          }}
                          placeholder="Returns Notes"
                          value={PendingReturnNote}
                          disabled={roleID == 2 ? false : true}
                        />
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>
                  <div className="inner_form_new ">
                    <label className="controlform">
                      Returns Comments
                    </label>
                    <div className="form-bx">
                      <label>
                        <textarea
                          ref={applicantCommentsRef}
                          name="applicantComment"
                          onChange={(e) => {
                            setPendingReturnComment(e.target.value);
                          }}
                          placeholder="Returns Comments"
                          value={PendingReturnComment}
                          disabled={roleID == 2 ? false : true}
                        />
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>

                  {otherfiles.map((file, index) => (
                    <div
                      key={index == "0" ? "Attachment" : `Other File ${index}`}
                      className="attachemt_form-bx"
                    >
                      <label
                        style={{
                          background: "#d9edf7",
                          padding: "9px 3px",
                          border: "0px",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>
                          {index == "0" ? "Attachment" : `Other File ${index}`}
                        </span>
                      </label>
                      <div className="browse-btn">
                        Browse{" "}
                        <input
                          type="file"
                          ref={fileInputRefs[index]}
                          onChange={(e) => {
                            handleFileChange(
                              e,
                              index == "0"
                                ? "Attachment"
                                : `Other File ${index}`
                            );
                          }}
                        />
                      </div>
                      <span className="filename">
                        {files.find(
                          (f) =>
                            f.label ===
                            (index == "0"
                              ? "Attachment"
                              : `Other File ${index}`)
                        )?.file?.name || "No file chosen"}
                      </span>

                      {files?.length &&
                      files?.find(
                        (f) =>
                          f.label ===
                          (index == "0" ? "Attachment" : `Other File ${index}`)
                      )?.file?.name ? (
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => {
                            removefileImage(
                              index == "0"
                                ? "Attachment"
                                : `Other File ${index}`
                            );
                            clearInputFile(index);
                          }}
                        >
                          Remove
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="addmore-btn mb-2"
                    onClick={(e) => handleAddMore(e)}
                  >
                    Add More File{" "}
                  </button>
                </>
              ) : (
                ""
              )}
            </div>

            <div className="form-footer mt-5 mb-3">
              <button
                type="reset"
                onClick={(e) => {
                  EditModalClose(e);
                }}
                className="register"
              >
                Close
              </button>

              <div>
                {roleID > 5 && recomdAnalyst == "121" ? (
                  <>
                    <button
                      type="button"
                      className="login m-end-4"
                      onClick={() => GetHandelDetailPDF()}
                      disabled={btnLoader}
                    >
                      {btnLoader ? (
                        <span className="loaderwait">Please Wait...</span>
                      ) : (
                        <span>Preview PDF</span>
                      )}
                    </button>
                  </>
                ) : (
                  ""
                )}

                {menuname === "Exports" && submenuname === "Pending Returns" ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      HandleSubmitPendingReturns(e);
                    }}
                    disabled={
                      (!checkSupervisor && roleID == 2) ||
                      (checkSupervisor && !AssignUserID && roleID == 4) ||
                      (menuname === "Exports" &&
                        submenuname === "Pending Returns" &&
                        !PendingReturnComment) ||
                      (menuname === "Exports" &&
                        submenuname === "Pending Returns" &&
                        !PendingReturnNote) || !files.length
                        ? true
                        : false
                    }
                    className="login"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      HandleSubmit(e);
                    }}
                    disabled={
                      (!checkSupervisor && roleID == 2) ||
                      (checkSupervisor && !AssignUserID && roleID == 4)
                        ? true
                        : false
                    }
                    className="login"
                  >
                    Submit{" "}
                  </button>
                )}
              </div>
            </div>

            {updatepopup == true && (menuname === "Exports" && submenuname === "Pending Returns") ? (
              <UpdatePopupMessage
                heading={heading1}
                para={para1}
                // applicationNumber={applicationNumber}
                closePopupHandle={closePopupHandle}
              ></UpdatePopupMessage>
            ) : 
              updatepopup == true ? <UpdatePopupMessage
              heading={heading}
              para={para}
              applicationNumber={applicationNumber}
              closePopupHandle={closePopupHandle}
            ></UpdatePopupMessage> : ""
            }
          </form>
          {/* view model start */}
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
                      handleFormClose={handleFormClose}
                      allcomment={allcommentRenew}
                      tatHistory={tatHistoryRenew}
                      noDataComment={noDataCommentRenew}
                      responceCount={responceCountRenew}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>
          {/* view modal end */}
        </>
      )}
    </>
  );
};

export default ExportDashboardRenewEditDetails;
