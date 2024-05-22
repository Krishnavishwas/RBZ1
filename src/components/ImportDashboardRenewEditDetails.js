import React, { useEffect, useRef, useState } from "react";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import UpdatePopupMessage from "./UpdatePopupMessage";
import "suneditor/dist/css/suneditor.min.css";
import { toast } from "react-toastify";
import logo from "../rbz_LOGO.png";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";

const ImportDashboardRenewEditDetails = ({
  applicationDetail,
  setApplicationDetail,
  EditModalClose,
  handleData,
  userRole,
  noDataComment,
  setapplicationstaus,
  showdataLoader,
  setSupervisorRoleId,
  supervisorHangechangeBankuser,
  SupervisorRoleId,
  AssignUserID,
  setAssignUserID,
  GetRoleHandle,
  Actiondata,
  responceCount,
  allcomment,
  SupervisorNameID,
  setnextlevelvalue,
  nextlevelvalue,
  supervisorHangechangeRole,
  supervisorHangechange,
  setAsignUser,
  asignUser,
  applicationstaus,
  tatHistory,
  IsDeferred,
}) => {
  const {
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData,
    masterBank,
    ImpSupervisors,
    applicantName,
    countries,
  } = ExportformDynamicField();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6] }],
      [{ font: [] }],
      [{ size: ["small", "large", "huge"] }],
      [{ color: [] }],
      [{ background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["bold", "italic", "underline"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "+1" },
        { indent: "-1" },
      ],
    ],
  };

  const navigate = useNavigate();

  const PdftargetRef = useRef();
  const PdfPrivewRef = useRef();
  const CoverigLetterRef = useRef(null);
  const BPNCodeRef = useRef(null);
  const TINRef = useRef(null);
  const amountRef = useRef(null);
  const applicantRef = useRef(null);
  const BeneficiaryNameRef = useRef(null);
  const applicantCommentsRef = useRef(null);
  const assignedToRef = useRef(null);
  const applicationTypeRef = useRef(null);
  const bankSupervisorRef = useRef(null);
  const companyNameRef = useRef(null);
  const currencyRef = useRef(null);
  const govtAgencieRef = useRef(null);
  const sectorRef = useRef(null);
  const subsectorRef = useRef(null);
  const typeExporterRef = useRef(null);
  const rateRef = useRef(null);
  const usdEquivalentRef = useRef(null);
  const PECANNumberRef = useRef(null);
  const FrequencyRef = useRef(null);
  const FrequencyDateRef = useRef(null);
  const dateExpirydisplayRef = useRef(null);
  const optionExpirydisplayRef = useRef(null);

  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const userName = Storage.getItem("userName");
  const bankName = Storage.getItem("bankName");
  const PdfUsername = Storage.getItem("name");
  const PdfRolename = Storage.getItem("roleName");
  const bankidcheck = bankID !== "" ? "1" : "3";
  const roleID = Storage.getItem("roleIDs");

  const [attachmentData, setAttachmentData] = useState([
    { filename: "File Upload", upload: "" },
  ]);
  const [selectuserRoleRecordofficer, setselectuserRoleRecordofficer] =
    useState("");
  const [otherfiles, setOtherfiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedBanks, setSelectedBanks] = useState(null);
  const [userRoleRecordofficer, setuserRoleRecordofficer] = useState([]);
  const [sharefile, setsharefile] = useState([]);
  const [registerusertype, setregisterusertype] = useState(bankidcheck);
  const [subsectorData, setsubsectorData] = useState([]);
  const [checkSupervisor, setcheckSupervisor] = useState(roleID == 4 ? true : false);
  const [curRate, setCurrate] = useState();
  const [DateExpirydisplay, setDateExpirydisplay] = useState("");  
  const [updatepopup, setupdatepopup] = useState(false); 
  const [btnLoader, setBtnLoader] = useState(false);   
  const [inputValue, setInputValue] = useState("");
  const [viewShareFile, setviewShareFile] = useState([]);
  const [applicationType, setapplicationType] = useState([]);
  const [asignnextLeveldata, setasignnextLeveldata] = useState({
    Notes: "",
    Comment: "",
  });
  const [getCompanyName, setgetCompanyName] = useState();
  const [geninfoTab, setgeninfoTab] = useState( true );
  const [options, setOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [newData, setnewData] = useState([]);
  const [getCompanyId, setgetCompanyId] = useState("");
  const [geninfoFile, setgeninfoFile] = useState([]);
  const [getBlankFile, setgetBlankFile] = useState([]);
  const [otheruserfiles, setOtheruserfiles] = useState([]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [supervisordecision, setsupervisordecision] = useState(false);
  const [Description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [IsReturnOption, setIsReturnOption] = useState("");
  const [IsReturndisplay, setIsReturndisplay] = useState("");
  const [userfiles, setuserFiles] = useState([]);
  const [IsReturnExpiringDate, setIsReturnExpiringDate] = useState(new Date());
  const [ExpiringDate, setExpiringDate] = useState(new Date());
  const [DateExpiryOption, setDateExpiryOption] = useState("");
  const [defaultnoExpiry, setdefaultnoExpiry] = useState("0");
  const [recomdAnalyst, setRecomdAnalyst] = useState("121");
  const [IsReturn, setIsReturn] = useState("0");
  const [checksectorchange, setchecksectorchange] = useState(false);
  const [getFrequencyID, setGetFrequencyID] = useState("0");
  const [AllFrequency, setAllFrequency] = useState([]);
  const [getalluser, setGetalluser] = useState([]);
  const [othersharefile, setOthersharefile] = useState([]);
  const [delDataFile, setDelDataFiles] = useState([]);
  const [SubmitBtnLoader, setSubmitBtnLoader] = useState(false);
  const [ImportForm, setImporttForm] = useState({
    user: "",
    bankName: bankName,
    purposeApplication: "",
    pecaNumber: "",
    typeExporter: "",
    BeneficiaryName: "",
    baneficiaryCountry: "",
    govtAgencie: "",
    BPNCode: "",
    TINNumber: "",
    applicant: "",
    applicantReferenceNumber: "",
    applicationType: "",
    exporterType: registerusertype,
    currency: "",
    amount: "",
    rate: "",
    usdEquivalent: "",
    relatedexchangeControlNumber: "",
    sector: "",
    subSector: "",
    applicantComments: "",
    bankSupervisor: "",
  });
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
  const fileInputRefsother = [
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

  const heading = "Application Submitted Successfully!";
  const para = "Import application request submitted successfully!";

  const ratevalue = applicationDetail?.rate;

  const convertedRate =
    parseFloat(curRate ? curRate : ratevalue) *
    parseFloat(applicationDetail?.amount);

  const changeHandelForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    let newErrors = {};
    let valid = true;
    if (name == "applicant" && value.charAt(0) === " ") {
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
      name == "pecaNumber" &&
      (value.charAt(0) === " " || value.charAt(0) == "/")
    ) {
      newErrors.PECANNumber = "First character cannot be a blank space or / ";
      valid = false;
    } else if (
      name == "pecaNumber" &&
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)
    ) {
      newErrors.PECANNumber = "Special characters not allowed";
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

    if (name === "applicationType") {
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

  const ChangeApplicationStatus = (e) => {
    const values = e.target.value;
    setapplicationstaus(values);
  };

  const handleChangecompany = (selectedOption) => {
    setgetCompanyName(selectedOption);
  };

  const closePopupHandle = () => {
    navigate("/ImportDashboard");
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
    if (applicationTypeRef.current) applicationTypeRef.current.value = "";
    if (assignedToRef.current) assignedToRef.current.value = "";
    if (companyNameRef.current) companyNameRef.current.value = "";
    if (currencyRef.current) currencyRef.current.value = "";
    if (govtAgencieRef.current) govtAgencieRef.current.value = "";
    if (sectorRef.current) sectorRef.current.value = "";
    if (subsectorRef.current) subsectorRef.current.value = "";
    if (typeExporterRef.current) typeExporterRef.current.value = "";
    if (usdEquivalentRef.current) usdEquivalentRef.current.value = "";
    if (rateRef.current) rateRef.current.value = "";
    if (FrequencyDateRef.current) FrequencyDateRef.current.value = "";
    if (FrequencyRef.current) FrequencyRef.current.value = "";
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

  const handleFIleview = () => {
    axios
      .post(APIURL + "ImportApplication/GetSharedFileDataImport", {
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
      .post(APIURL + "ImportApplication/GetImportFilesByApplicationID", {
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

  const handleClear = () => {
    setValue(null);
    setInputValue("");
    setOptions([]);
  };

  const HandelSupervisorcheck = () => {
    setcheckSupervisor(!checkSupervisor);
    if (roleID == 3 && checkSupervisor == true) {
      setAssignUserID("0");
    } else if (roleID == 3 && checkSupervisor == false) {
      setAssignUserID("");
    }
    setAssignUserID("");
    setSupervisorRoleId("");
    setselectuserRoleRecordofficer("");
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

  const clearInputFile = (index) => {
    if (fileInputRefs[index].current) fileInputRefs[index].current.value = "";
  };

  const clearInputFileother = (index) => {
    if (fileInputRefsother[index]?.current)
      fileInputRefsother[index].current.value = "";
  };

  const removefileImage = (label) => {
    const updatedUserFile = files?.filter((item, i) => item?.label != label);
    setFiles(updatedUserFile);
  };

  const handleAddMore = (e) => {
    setOtherfiles([...otherfiles, null]);
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

  const getRoleHandle = async () => {
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: "4",
        Status: "35",
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

  useEffect(() => {
    getRoleHandle();
  }, []);

  const getNextvaluesupervisor = (e) => {
    const value = e.target.checked;
    if (value == false) {
      setnextlevelvalue("");
    }
    setapplicationstaus("");
  };

  const ChangeNextlevelHandle = (e) => {
    const value = e.target.value;
    setSupervisorRoleId("");
    setnextlevelvalue(value);
    setAsignUser([]);
  };

  const handleUserRole = (e) => {
    const value = e.target.value;
    setSupervisorRoleId(value);
  };

  const removeUserImage = (index, id) => {
    const updatedUserFile = userfiles?.filter((item) => item.id !== id);
    setuserFiles(updatedUserFile);
  };

  const handleuserAddMore = (e) => {
    setOtheruserfiles([...otheruserfiles, null]);
  };

  const handleOthrefile = (e, id) => {
    const otherfile = e.target.files[0];
    setOtherfilesupload([...otherfilesupload, { otherfile, id }]);
  };

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
          doc.setTextColor("#cccaca");
          doc.saveGraphicsState();
          doc.setGState(new doc.GState({ opacity: 0.4 }));
          doc.setFont("helvetica", "normal");
          doc.setFontSize(80);
          doc.text(
            doc.internal.pageSize.width / 3,
            doc.internal.pageSize.height / 2,
            "Preview",
            { angle: 45 }
          );
          doc.restoreGraphicsState();
        }
      };
      doc.setFont("helvetica", "normal");
      doc.setFontSize(3);
      let docWidth = doc.internal.pageSize.getWidth();
      doc.html(PdfPrivewRef.current, {
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

  const GetApplicationTypes = async () => {
    await axios
      .post(APIURL + "Master/GetApplicationTypesByDepartmentID", {
        DepartmentID: "3",
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

  const onShow = () => {
    setTimeout(() => {
      let selectAllCheckbox = document.querySelector(
        ".p-multiselect-header > .p-multiselect-select-all"
      );
      if (selectAllCheckbox) {
        let selectAllSpan = document.createElement("span");
        selectAllSpan.className = "select_all";
        selectAllSpan.textContent = "Select All";
        selectAllCheckbox.after(selectAllSpan);
      }
    }, 0);
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

  const HandleIsReturnOption = (e) => {
    const { name, value } = e.target;
    setIsReturnOption(e.target.value);
    setIsReturn(value);
    if (value == 0) {
      setIsReturndisplay("");
      setIsReturnExpiringDate(new Date());
      setGetFrequencyID("");
      if (FrequencyRef.current) FrequencyRef.current.value = "";
      if (FrequencyDateRef.current) FrequencyDateRef.current = "";
    } else {
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
  };

  const handleshareFileChange = (e, id) => {
    const file = e.target.files[0];
    const index = userfiles?.findIndex((item) => item.id === id);
    if (index !== -1) {
      setsharefile((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, id };
        return newFiles;
      });
    } else {
      setsharefile((prevFiles) => [...prevFiles, { file, id }]);
    }
  };

  const handlesharefileAddMore = (e) => {
    setOthersharefile([...othersharefile, null]);
  };

  const removeshareImage = (index, id) => {
    const updatedShareFile = sharefile?.filter((item) => item.id !== id);
    setsharefile(updatedShareFile);
  };

  const formatecopyresponse = selectedBanks?.map((item) => {
    return item.code;
  });

  const copyresponse = selectedBanks?.map((res) => ({
    ApplicationID: applicationDetail?.id,
    BankID: res?.code,
    CopyingResponse: 1,
    CopiedResponse: formatecopyresponse?.join(),
  }));

  const SelectReturnFrequency = (e) => {
    const { name, value } = e.target;
    if (value == 1) {
      setGetFrequencyID(value);
      setIsReturnExpiringDate(new Date());
    } else {
      setGetFrequencyID(value);
      setIsReturnExpiringDate(new Date());
    }
  };

  const HandleDateExpiryOption = (e) => {
    const { name, value } = e.target;
    setDateExpiryOption(e.target.value);
    setdefaultnoExpiry(value);
    if (value == 0) {
      setDateExpirydisplay("");
      if (dateExpirydisplayRef.current) dateExpirydisplayRef.current.value = "";
      if (optionExpirydisplayRef.current) optionExpirydisplayRef.current = "";
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    if (
      applicationDetail.applicantType == "1" &&
      applicationDetail.companyName == "" &&
      !getCompanyName
    ) {
      newErrors.companyName = "Company Name is required";
      valid = false;
    }
    if (applicationDetail.applicationTypeID === "") {
      newErrors.applicationTypeID = "Nature of Application is required";
      valid = false;
    }
    if (
      AssignUserID == "" &&
      roleID >= 5 &&
      checkSupervisor == true &&
      recomdAnalyst != "121"
    ) {
      newErrors.assignUserID = "User is required";
      valid = false;
    }
    if (
      supervisordecision == true &&
      (applicationstaus == "" || applicationstaus == "0") &&
      roleID == 3 &&
      nextlevelvalue != 20
    ) {
      newErrors.supervisordecision = "Decision is required";
      valid = false;
    }
    if (nextlevelvalue == "" && roleID == 3 && supervisordecision == false) {
      newErrors.supervisoraction = "Action is required";
    }
    if (
      (Description == " " ||
        Description == null ||
        Description == "<p><br></p>" ||
        !Description ||
        Description == "<h1><br></h1>" ||
        Description == "<h2><br></h2>") &&
      applicationDetail?.analystDescription == null &&
      roleID == 5
    ) {
      newErrors.Description = "Description is required";
      valid = false;
    }
    if (
      (checkSupervisor == false &&
        nextlevelvalue == "" &&
        roleID == 3 &&
        Description == "") ||
      (roleID == 3 && nextlevelvalue == "") ||
      (nextlevelvalue == "10" && Description == "") ||
      (Description == "" && supervisordecision == true)
    ) {
      newErrors.Description = "Description is required";
      valid = false;
    }
    if (
      checkSupervisor == false &&
      roleID == 3 &&
      AssignUserID == "" &&
      nextlevelvalue == 20
    ) {
      newErrors.Descsupervisruser = "User is required";
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
      applicationDetail.name == ""
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
    if (
      DateExpirydisplay == 0 &&
      DateExpiryOption == 1 &&
      (ExpiringDate === "" || ExpiringDate == null)
    ) {
      newErrors.ExpiringDate = "Expiry Date is required";
      valid = false;
    }
    if (
      IsReturn == 1 &&
      getFrequencyID == 1 &&
      (IsReturnExpiringDate === "" || IsReturnExpiringDate == null)
    ) {
      newErrors.IsReturnExpiringDate = "Frequency Date is required";
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
      newErrors.applicationType = "Nature of Application number is required";
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

  const HandleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    if (validateForm()) {
      setSubmitBtnLoader(true);
      await axios
        .post(APIURL + "ImportApplication/CreateImportApplication", {
          UserID: UserID.replace(/"/g, ""),
          RoleID: roleID,
          DepartmentID: "3",
          ID: applicationDetail?.id,
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
          RBZReferenceNumber: applicationDetail?.rbzReferenceNumber,
          UserTypeID: applicationDetail?.applicantType,
          ApplicantType: applicationDetail?.applicantType,
          Name: applicationDetail?.name,
          BeneficiaryName: applicationDetail?.beneficiaryName,
          PECANumber: applicationDetail.pecaNumber,
          BPNCode:
            filtertin_bpn || filtertin_bpn != undefined
              ? filtertin_bpn?.bpnNumber?.toUpperCase()
              : applicationDetail?.bpnCode,
          ApplicationTypeID: applicationDetail?.applicationTypeID,
          Currency: applicationDetail?.currency,
          Amount: applicationDetail?.amount,
          Rate: !curRate ? applicationDetail?.rate : curRate,
          USDEquivalent: convertedRate
            ? convertedRate
            : applicationDetail?.usdEquivalent,
          Sector: applicationDetail?.sector,
          SubSector: applicationDetail?.subSector,
          ApplicantComment: applicationDetail?.applicantComment,
          ApplicationDate: startDate
            ? startDate
            : applicationDetail?.applicationDate,
          TINNumber:
            filtertin_bpn || filtertin_bpn != undefined
              ? filtertin_bpn?.tinNumber?.toUpperCase()
              : applicationDetail?.tinNumber,
          BeneficiaryCountry: applicationDetail?.baneficiaryCountry,
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
                departmentID: 3,
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
              res.data.responseData.rbzReferenceNumber
            );
            formData.append("ApplicationID", res.data.responseData.id);
            formData.append("DepartmentID", "3");
            formData.append("UserID", UserID.replace(/"/g, ""));
            axios
              .post(ImageAPI + "File/UploadFile", formData)
              .then((res) => {
                console.log("Uploaded");
              })
              .catch((err) => {
                console.log("file Upload ", err);
              });
            setupdatepopup(true);
            setSubmitBtnLoader(false);
            setAssignUserID("");
            setselectuserRoleRecordofficer("");
          } else {
            setSubmitBtnLoader(false);
            toast.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          setSubmitBtnLoader(false);
          console.log(err);
        });
    } else {
      if (!toastDisplayed) {
        toast.warning("Please fill all mandatory fields");
      }
      setToastDisplayed(true);
    }
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
                    <input value={applicationDetail?.userName} disabled />
                  </label>
                </div>
              </div>
              <div className="inner_form_new ">
                <label className="controlform">Name of Bank</label>
                <div className="form-bx">
                  <label>
                    <input
                      type="text"
                      name="user"
                      value={
                        roleID == 2
                          ? bankName.replace(/"/g, "")
                          : applicationDetail?.bankName == null &&
                            applicationDetail?.roleID == 4
                          ? "N/A"
                          : applicationDetail?.bankName
                      }
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Application Date</label>
                <div className="form-bx">
                  <DatePicker
                    closeOnScroll={(e) => e.target === document}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    peekNextMonth
                    showMonthDropdown
                    dateFormat="dd/MMM/yyyy"
                    minDate="01/01/2018"
                    maxDate={new Date()}
                    showYearDropdown
                    dropdownMode="select"
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
                <label className="controlform">
                  Prior Exchange Control Authority Number(PECAN)
                </label>
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex">
                      <div className="form-bx">
                        <label>
                          <input
                            ref={PECANNumberRef}
                            type="text"
                            name="pecaNumber"
                            onChange={(e) => {
                              changeHandelForm(e);
                            }}
                            value={applicationDetail?.pecaNumber}
                            className={
                              errors.PECANNumber
                                ? "text-uppercase error"
                                : "text-uppercase"
                            }
                          />
                          <span className="sspan"></span>
                          {errors.PECANNumber ? (
                            <small className="errormsg">
                              {errors.PECANNumber}
                            </small>
                          ) : (
                            ""
                          )}
                        </label>
                      </div>
                      <button type="button" className="primrybtn  v-button">
                        Validate
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3 text-right"></div>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Type of Importer</label>
                <div className="form-bx-radio mt-4">
                  {applicantTypes?.map((item, index) => {
                    return (
                      <>
                        <label key={index}>
                          <input
                            type="radio"
                            ref={typeExporterRef}
                            onChange={(e) => {
                              changeHandelForm(e);
                            }}
                            name="importType"
                            value={item.id}
                            checked={
                              applicationDetail?.applicantType == item?.id
                            }
                            disabled={
                              bankID != "" && item.id === 3
                                ? true
                                : bankidcheck === "3"
                                ? true
                                : false
                            }
                          />
                          <span>{item.name}</span>
                        </label>
                      </>
                    );
                  })}
                </div>
              </div>

              {/* {registerusertype === "1" && bankID !== "" ? ( */}
              {applicationDetail?.applicantType == "1" && bankID != "" ? (
                <>
                  {/* <div className="inner_form_new ">
              <label className="controlform">Company Name</label>
              <div className="form-bx">
                <SearchableDropdown
                  options={companies}
                  label="companyName"
                  id={companies[value]}
                  selectedVal={value}
                  handleChange={(val) => {
                    setValue(val);
                  }}
                />
                {errors.companyName &&
                (getCompanyName === "Company Name" ||
                  getCompanyName == null) ? (
                  <small className="errormsg">{errors.companyName}</small>
                ) : (
                  ""
                )}
                <small className="informgs">
                  Please provide at least 3 characters for auto search of
                  Company Name.
                </small>
              </div>
            </div> */}

                  <div className="inner_form_new ">
                    <label className="controlform">Company Name</label>
                    <div className="form-bx">
                      <Select
                        placeholder={
                          applicationDetail.companyName
                            ? applicationDetail.companyName
                            : "Select Company Name"
                        }
                        value={getCompanyName}
                        onChange={handleChangecompany}
                        onInputChange={handleInputChangecompany}
                        options={options}
                        isSearchable
                        noOptionsMessage={({ inputValue }) =>
                          inputValue?.length >= 3
                            ? "No Company found"
                            : "Please provide at least 3 characters for auto search of Company Name"
                        }
                        onMenuClose={handleClear}
                        className="selectinput"
                        isDisabled={
                          roleID == 2 ||
                          roleID == 3 ||
                          applicationDetail?.roleID == 4
                            ? false
                            : true
                        }
                      />
                      {errors.companyName &&
                      (getCompanyName === "Company Name" ||
                        getCompanyName == null) ? (
                        <small className="errormsg">{errors.companyName}</small>
                      ) : (
                        ""
                      )}
                      <small className="informgs">
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
                          name="TINNumber"
                          placeholder={applicationDetail?.tinNumber}
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          disabled
                          value={
                            ImportForm.TINNumber
                              ? ImportForm.TINNumber?.trim()
                              : "N/A"
                          }
                          className={
                            errors.BPNCode
                              ? "error text-uppercase"
                              : "text-uppercase"
                          }
                        />
                        <span className="sspan"></span>
                        {errors.TINNumber ? (
                          <small className="errormsg">{errors.TINNumber}</small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="inner_form_new ">
                    <label className="controlform">BPN Code</label>
                    <div className="form-bx">
                      <label>
                        <input
                          ref={BPNCodeRef}
                          type="text"
                          name="BPNCode"
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          disabled
                          value={ImportForm.BPNCode?.trim()}
                          placeholder={applicationDetail?.bpnCode}
                          className={
                            errors.BPNCode
                              ? "error text-uppercase"
                              : "text-uppercase"
                          }
                        />
                        <span className="sspan"></span>
                        {errors.BPNCode ? (
                          <small className="errormsg">{errors.BPNCode}</small>
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

              {applicationDetail?.applicantType == "2" && bankID !== "" ? (
                <>
                  <div className="inner_form_new ">
                    <label className="controlform">Applicant</label>
                    <div className="form-bx">
                      <label>
                        <input
                          type="text"
                          ref={applicantRef}
                          name="applicant"
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          placeholder={applicationDetail?.name}
                          value={ImportForm.applicant}
                          className={errors.applicant ? "error" : ""}
                        />
                        <span className="sspan"></span>
                        {errors.applicant || ImportForm.applicant === "" ? (
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

              <div className="inner_form_new ">
                <label className="controlform">Nature of Application</label>
                <div className="form-bx">
                  <label>
                    <select
                      ref={applicationTypeRef}
                      name="applicationTypeID"
                      placeholder={applicationDetail?.applicationTypeID}
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      disabled={
                        roleID == 2 ||
                        roleID == 3 ||
                        applicationDetail?.roleID == 4
                          ? false
                          : true
                      }
                      className={
                        errors.applicationType &&
                        ImportForm.applicationType === ""
                          ? "error"
                          : ""
                      }
                    >
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
                    {errors.applicationType &&
                    ImportForm.applicationType === "" ? (
                      <small className="errormsg">
                        {errors.applicationType}
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Beneficiary Name</label>
                <div className="form-bx">
                  <label>
                    <input
                      type="text"
                      ref={BeneficiaryNameRef}
                      name="beneficiaryName"
                      placeholder="Beneficiary Name"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      value={applicationDetail?.beneficiaryName}
                    />
                    <span className="sspan"></span>
                    {errors.BeneficiaryName ||
                    ImportForm.BeneficiaryName === "" ? (
                      <small className="errormsg">
                        {errors.BeneficiaryName}
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Beneficiary Country</label>
                <div className="form-bx">
                  <label>
                    <select
                      name="baneficiaryCountry"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                    >
                      <option value="">
                        {applicationDetail?.beneficiaryCountryName
                          ? applicationDetail?.beneficiaryCountryName
                          : "Select Beneficiary Country"}
                      </option>
                      {countries?.map((item, ind) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.countryName}
                          </option>
                        );
                      })}
                    </select>
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>

              {bankID === "" ? (
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
                          errors.govtAgencie && ImportForm.govtAgencie === ""
                            ? "error"
                            : ""
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
                      {errors.govtAgencie && ImportForm.govtAgencie === "" ? (
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
                            errors.currency && ImportForm.currency === ""
                              ? "error"
                              : ""
                          }
                        >
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
                        {errors.currency && ImportForm.currency === "" ? (
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
                          onKeyDown={(event) => {
                            const blockedKeys = ['e', 'E', '-', '+'];
                            if (blockedKeys.includes(event.key)) {
                                event.preventDefault();
                            }
                        }}
                          placeholder={applicationDetail?.amount}
                          className={
                            errors.amount && applicationDetail.amount === ""
                              ? "error"
                              : ""
                          }
                        />
                        <span className="sspan"></span>
                        {errors.amount && applicationDetail.amount === "" ? (
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
                          // value={
                          //   applicationDetail?.currency
                          //     ? curRate
                          //       ? curRate
                          //       : applicationDetail.rate
                          //     : "Rate"
                          // }
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
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
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
                        errors.sector && ImportForm.sector === "" ? "error" : ""
                      }
                    >
                      {sectorData?.map((item, ind) => {
                        return (
                          <option
                            key={item.id}
                            value={item.id}
                            selected={applicationDetail?.sector == item.id}
                          >
                            {item.sectorName}
                          </option>
                        );
                      })}
                    </select>
                    <span className="sspan"></span>
                    {errors.sector && ImportForm.sector === "" ? (
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
                        (roleID == 2 ||
                        roleID == 3 ||
                        applicationDetail?.roleID == 4
                          ? false
                          : true)
                          ? true
                          : false
                      }
                      className={
                        errors.subSector && ImportForm.subSector === ""
                          ? "error"
                          : ""
                      }
                    >
                      <option value="">Select Subsector</option>
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
                    {errors.subSector && ImportForm.subSector === "" ? (
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
                      name="applicantComments"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      placeholder={applicationDetail?.applicantComment}
                      className={errors.applicantComments ? "error" : ""}
                    />
                    <span className="sspan"></span>
                    {errors.applicantComments ||
                    ImportForm.applicantComments === "" ? (
                      <small className="errormsg">
                        {errors.applicantComments}
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

              {checkSupervisor === true && roleID == 2  ? (
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
                        {ImpSupervisors?.map((item, index) => {
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
                      ImportForm.bankSupervisor === "" ? (
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
            <label className="controlform">RBZ Record Officer Submit to</label>
            <div className="form-bx">
              <label>
                <select
                  name="SupervisorRoleId"
                  onChange={(e) => {
                    supervisorHangechangeRoleRecordofficer(e);
                  }}
                  // className={
                  //   errors.assignedTo && !SupervisorRoleId
                  //     ? "error"
                  //     : ""
                  // }
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
                {errors.selectuserRoleRecordofficer && selectuserRoleRecordofficer === "" ? (
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
                      errors.bankSupervisor && applicationDetail.bankSupervisor === ""
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
                  {errors.bankSupervisor && applicationDetail.bankSupervisor === "" ? (
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

              <h5 className="section_top_subheading">Attachments</h5>
              {applicationDetail?.fileName || applicationDetail?.filePath ? (
                <div
                  className={
                    applicationDetail?.filePath != null
                      ? "attachemt_form-bx"
                      : "d-none"
                  }
                >
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

                      {roleID == 2 || roleID == 3 ? (
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

              {getBlankFile?.map((items, index) => {
                return (
                  <div className="attachemt_form-bx" key={items.id}>
                    <label
                      style={{
                        background: "#d9edf7",
                        padding: "9px 3px",
                        border: "0px",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}> {items.name} </span>
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
                      {files.find((f) => f.label === items?.name)?.file?.name ||
                        "No file chosen"}
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

              {otherfiles.map((file, index) => (
                <div key={"other" + (index + 1)} className="attachemt_form-bx">
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
                    {files.find((f) => f.label === "other" + (index + 1))?.file
                      ?.name || "No file chosen"}
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

              {files?.length ? (
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
                <button
                  type="button"
                  onClick={(e) => {
                    HandleSubmit(e);
                  }}
                  disabled={
                    (!checkSupervisor && roleID == 4) ||
                    (checkSupervisor && !AssignUserID && roleID == 4)
                      ? true
                      : false
                  }
                  className="login"
                >
                  Submit{" "}
                </button>
              </div>

              {updatepopup === true ? (
                <UpdatePopupMessage
                  heading={heading}
                  para={para}
                  closePopupHandle={closePopupHandle}
                ></UpdatePopupMessage>
              ) : (
                ""
              )}
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default ImportDashboardRenewEditDetails;
