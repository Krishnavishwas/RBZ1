import React, { useEffect, useRef, useState } from "react";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import Select from "react-select";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import UpdatePopupMessage from "./UpdatePopupMessage";
import "suneditor/dist/css/suneditor.min.css";
import { toast } from "react-toastify";
import logo from "../rbz_LOGO.png";
import ReactQuill from "react-quill";
import NoSign from "../NoSign.png";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import { MultiSelect } from "primereact/multiselect";

const ImportDashboardEditDetails = ({
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
}) => {
  const {
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData,
    masterBank,
    Supervisors,
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
  const [checkSupervisor, setcheckSupervisor] = useState(false);
  const [curRate, setCurrate] = useState();
  const [DateExpirydisplay, setDateExpirydisplay] = useState("");
  const [banksuperTab, setbanksuperTab] = useState(roleID == 3 ? true : false);
  const [recordTab, setrecordTab] = useState(roleID == 4 ? true : false);
  const [updatepopup, setupdatepopup] = useState(false);
  const [analystTab, setanalystTab] = useState(roleID == 5 ? true : false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sranalystTab, setsranalystTab] = useState(roleID == 6 ? true : false);
  const [principalanalystTab, setprincipalanalystTab] = useState(
    roleID == 7 ? true : false
  );
  const [deputyTab, setdeputyTab] = useState(roleID == 8 ? true : false);
  const [director, setdirector] = useState(roleID == 9 ? true : false);
  const [inputValue, setInputValue] = useState("");
  const [viewShareFile, setviewShareFile] = useState([]);
  const [applicationType, setapplicationType] = useState([]);
  const [asignnextLeveldata, setasignnextLeveldata] = useState({
    Notes: "",
    Comment: "",
  });
  const [getCompanyName, setgetCompanyName] = useState();
  const [geninfoTab, setgeninfoTab] = useState(roleID == 2 ? true : false);
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

  const heading = "Updated Successfully!";
  const para = "Import request updated successfully!";
  const applicationNumber = applicationDetail.rbzReferenceNumber;

  // const convertedRate = curRate * parseFloat(applicationDetail.amount);
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
    }
    else {
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
    setnewData(newData1);
  }, [applicationDetail, geninfoFile, allcomment]);

  const handleRemovfile = (id) => {
    axios
      .post(APIURL + "File/DeleteFile", {
        ID: id,
      })
      .then((res) => {
        handleFIleview();
      })
      .catch((error) => {
        console.log("FileRemove Error", error);
      });
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
      newErrors.applicationTypeID = "Application type is required";
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

  const HandleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    let shareformData = new FormData();

    if (validateForm()) {
      setSubmitBtnLoader(true);
      await axios
        .post(APIURL + "ImportApplication/UpdateImportApplication", {
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
          DepartmentID: "3",
          RBZReferenceNumber: applicationDetail?.rbzReferenceNumber,
          UserTypeID: applicationDetail?.userTypeID,
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
          UserID: UserID.replace(/"/g, ""),
          RoleID: roleID,
          Comment: asignnextLeveldata.Comment,
          AssignedToRoleID: SupervisorRoleId
            ? SupervisorRoleId
            : AssignUserID && SupervisorRoleId == "" && nextlevelvalue != "20"
            ? parseInt(roleID) + 1
            : roleID,
          Notes: asignnextLeveldata.Notes,
          ExpiringDate: defaultnoExpiry == "0" ? "" : ExpiringDate,
          ApplicationStatus:
            roleID == 5
              ? applicationstaus
              : nextlevelvalue == "" && roleID != 5
              ? applicationstaus
              : applicationDetail?.analystRecommendation,
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
        .then((res) => {
          if (res.data.responseCode === "200") {
            if (roleID == 2 || roleID == 4 || roleID == 5) {
              setupdatepopup(true);
            }
            if (
              (AssignUserID == "" || AssignUserID == null) &&
              roleID != 5 &&
              roleID != 2 &&
              roleID != 4
            ) {
              setTimeout(() => {
                const doc = new jsPDF({
                  format: "a4",
                  unit: "pt",
                });
                axios
                  .post(APIURL + "Admin/GetBankByID", {
                    id: applicationDetail?.bankID,
                  })
                  .then((response) => {
                    if (response.data.responseCode === "200") {
                      if (
                        response.data.responseData?.headerFooterData["0"]
                          ?.fileType == "HeaderFile"
                      ) {
                        var headerImage =
                          response.data.responseData.headerFooterData["0"]
                            .filePath;
                        var headerImagewidth =
                          response.data.responseData.headerFooterData["0"]
                            .imageWidth;
                      } else {
                        var headerImage = "";
                      }
                      if (
                        response.data.responseData?.headerFooterData["1"]
                          ?.fileType == "FooterFile"
                      ) {
                        var footerImage =
                          response.data.responseData.headerFooterData["1"]
                            .filePath;
                        var footerImagewidth =
                          response.data.responseData.headerFooterData["1"]
                            .imageWidth;
                      } else {
                        var footerImage = "";
                      }

                      const addFooters = (doc) => {
                        if (roleID != 3) {
                          const pageCount = doc.internal.getNumberOfPages();
                          const footerpositionfromleft =
                            doc.internal.pageSize.width - 10;
                          const footerpositionfromTop =
                            doc.internal.pageSize.height - 10;
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
                        } else {
                          if (footerImage != "") {
                            const footerpositionfromTop =
                              doc.internal.pageSize.height - 90;
                            const pageCount = doc.internal.getNumberOfPages();

                            var pagewidth = doc.internal.pageSize.width;
                            if (pagewidth > footerImagewidth) {
                              var diff =
                                parseInt(pagewidth) -
                                parseInt(footerImagewidth);
                              var positionLeftFooter = parseInt(diff / 2);
                            } else {
                              var positionLeftFooter = 250;
                            }
                            for (var i = 1; i <= pageCount; i++) {
                              doc.setPage(i);
                              doc.addImage(
                                footerImage,
                                "png",
                                positionLeftFooter,
                                footerpositionfromTop,
                                150,
                                80,
                                "Footer",
                                "NONE",
                                0
                              );
                            }
                          }
                        }
                      };
                      const addHeader = (doc) => {
                        if (roleID != 3) {
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
                        } else {
                          if (headerImage != "") {
                            const pageCount = doc.internal.getNumberOfPages();
                            var pagewidth = doc.internal.pageSize.width;
                            if (pagewidth > headerImagewidth) {
                              var diff =
                                parseInt(pagewidth) -
                                parseInt(headerImagewidth);
                              var positionLeft = parseInt(diff / 2);
                            } else {
                              var positionLeft = 250;
                            }
                            for (var i = 1; i <= pageCount; i++) {
                              doc.setPage(i);
                              doc.addImage(
                                headerImage,
                                "png",
                                positionLeft,
                                10,
                                80,
                                80,
                                "Header",
                                "NONE",
                                0
                              );
                            }
                          } else {
                            doc.setFont("helvetica", "bold");
                            doc.setFontSize(20);
                            doc.text("Final Letter", 250, 40);
                          }
                        }
                      };
                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(3);
                      let docWidth = doc.internal.pageSize.getWidth();
                      doc
                        .html(PdftargetRef.current, {
                          width: 513,
                          height: doc.internal.pageSize.getHeight(),
                          margin: [110, 80, 60, 35],
                          windowWidth: 1000,
                          pagebreak: true,
                          async callback(doc) {
                            addHeader(doc);
                            addFooters(doc);
                            const blobPDF = doc.output("datauristring");
                            let formData = new FormData();
                            formData.append("UserID", UserID.replace(/"/g, ""));
                            formData.append("FileType", "FinalResponsePDF");
                            formData.append("Label", "Final Response");
                            formData.append(
                              "RBZReferenceNumber",
                              applicationDetail?.rbzReferenceNumber
                            );
                            formData.append(
                              "ApplicationID",
                              applicationDetail?.id
                            );
                            formData.append("PdfData", blobPDF);
                            axios
                              .post(ImageAPI + "File/UploadPdf", formData)
                              .then((res) => {
                                if (res.data.responseCode == "Success") {
                                  setSupervisorRoleId("");
                                  setupdatepopup(true);
                                  setSubmitBtnLoader(false);
                                  setAssignUserID("");
                                  setselectuserRoleRecordofficer("");
                                } else {
                                  setupdatepopup(true);
                                }
                              })
                              .catch((error) => {
                                setSubmitBtnLoader(false);
                                console.log("DATA SAVE ERROR--", error);
                              });
                          },
                        })
                        .then(async (response) => {
                          console.log("response-- pdf", response);
                        })
                        .catch((error) => {
                          setSubmitBtnLoader(false);
                          console.log("pdferror--", error);
                        });
                    }
                  });
              }, 1500);
            } else {
              if (roleID == 3 && nextlevelvalue == "10") {
                setTimeout(async () => {
                  const doc = new jsPDF({
                    format: "a4",
                    unit: "pt",
                  });
                  await axios
                    .post(APIURL + "Admin/GetBankByID", {
                      id: applicationDetail?.bankID,
                    })
                    .then(async (response) => {
                      if (response.data.responseCode === "200") {
                        if (
                          response.data.responseData?.headerFooterData["0"]
                            ?.fileType == "HeaderFile"
                        ) {
                          var headerImage =
                            response.data.responseData.headerFooterData["0"]
                              .filePath;
                          var headerImagewidth =
                            response.data.responseData.headerFooterData["0"]
                              .imageWidth;
                        } else {
                          var headerImage = "";
                        }
                        if (
                          response.data.responseData?.headerFooterData["1"]
                            ?.fileType == "FooterFile"
                        ) {
                          var footerImage =
                            response.data.responseData.headerFooterData["1"]
                              .filePath;
                          var footerImagewidth =
                            response.data.responseData.headerFooterData["1"]
                              .imageWidth;
                        } else {
                          var footerImage = "";
                        }
                        const addFooters = (doc) => {
                          if (footerImage != "") {
                            const footerpositionfromTop =
                              doc.internal.pageSize.height - 90;
                            const pageCount = doc.internal.getNumberOfPages();

                            var pagewidth = doc.internal.pageSize.width;
                            if (pagewidth > footerImagewidth) {
                              var diff =
                                parseInt(pagewidth) -
                                parseInt(footerImagewidth);
                              var positionLeftFooter = parseInt(diff / 2);
                            } else {
                              var positionLeftFooter = 250;
                            }
                            for (var i = 1; i <= pageCount; i++) {
                              doc.setPage(i);
                              doc.addImage(
                                footerImage,
                                "png",
                                positionLeftFooter,
                                footerpositionfromTop,
                                150,
                                80,
                                "Footer",
                                "NONE",
                                0
                              );
                            }
                          }
                        };
                        const addHeader = (doc) => {
                          if (headerImage != "") {
                            const pageCount = doc.internal.getNumberOfPages();
                            var pagewidth = doc.internal.pageSize.width;
                            if (pagewidth > headerImagewidth) {
                              var diff =
                                parseInt(pagewidth) -
                                parseInt(headerImagewidth);
                              var positionLeft = parseInt(diff / 2);
                            } else {
                              var positionLeft = 250;
                            }
                            for (var i = 1; i <= pageCount; i++) {
                              doc.setPage(i);
                              doc.addImage(
                                headerImage,
                                "png",
                                positionLeft,
                                10,
                                80,
                                80,
                                "Header",
                                "NONE",
                                0
                              );
                            }
                          } else {
                            doc.setFont("helvetica", "bold");
                            doc.setFontSize(20);
                            doc.text("Cover Letter", 250, 40);
                          }
                        };
                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(3);
                        let docWidth = doc.internal.pageSize.getWidth();
                        await doc
                          .html(CoverigLetterRef.current, {
                            width: 513,
                            height: doc.internal.pageSize.getHeight(),
                            margin: [110, 80, 60, 35],
                            windowWidth: 1000,
                            pagebreak: true,
                            async callback(doc) {
                              addHeader(doc);
                              addFooters(doc);
                              const blobPDF = doc.output("datauristring");
                              let formData = new FormData();
                              formData.append(
                                "UserID",
                                UserID.replace(/"/g, "")
                              );
                              formData.append("FileType", "LetterHeadPDF");
                              formData.append("Label", "CoverLetter");
                              formData.append(
                                "RBZReferenceNumber",
                                applicationDetail?.rbzReferenceNumber
                              );
                              formData.append(
                                "ApplicationID",
                                applicationDetail?.id
                              );
                              formData.append("PdfData", blobPDF);
                              await axios
                                .post(ImageAPI + "File/UploadPdf", formData)
                                .then(async (res) => {
                                  if (res.data.responseCode == "Success") {
                                    setSupervisorRoleId("");
                                    setupdatepopup(true);
                                    setSubmitBtnLoader(false);
                                    setAssignUserID("");
                                    setselectuserRoleRecordofficer("");
                                  } else {
                                    setupdatepopup(true);
                                  }
                                })
                                .catch((error) =>
                                  console.log("DATA SAVE ERROR--", error)
                                );
                            },
                          })
                          .then(async (response) => {})
                          .catch((error) => console.log("pdferror--", error));
                      }
                    });
                  setBtnLoader(false);
                }, 1500);
              } else {
                setupdatepopup(true);
                setSubmitBtnLoader(false);
              }
            }
            const fileupload = userfiles.length > 0 ? userfiles : files;
            for (let i = 0; i < fileupload?.length; i++) {
              formData.append("files", fileupload[i].file);
              formData.append("Label", fileupload[i].label);
            }
            formData.append(
              "ApplicationActivityID",
              roleID == 2 || roleID == 3
                ? ""
                : res.data.responseData?.applicationActivityID
            );
            formData.append(
              "RBZReferenceNumber",
              applicationDetail?.rbzReferenceNumber
            );
            formData.append("ApplicationID", applicationDetail?.id);
            formData.append("DepartmentID", "3");
            formData.append("UserID", UserID.replace(/"/g, ""));
            axios
              .post(ImageAPI + "File/UploadFile", formData)
              .then((res) => {
                console.log("UploadFile");
              })
              .catch((err) => {
                setSubmitBtnLoader(false);
                console.log("file Upload ", err);
              });
            axios
              .post(APIURL + "ExportApplication/CopyingResponses", copyresponse)
              .then((resposnse) => {
                console.log("CopyingResponses");
              })
              .catch((error) => {
                setSubmitBtnLoader(false);
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
            shareformData.append("UserID", UserID.replace(/"/g, ""));
            axios
              .post(ImageAPI + "File/UploadSharedDocs", shareformData)
              .then((res) => {
                console.log("UploadSharedDocs");
              })
              .catch((err) => {
                setSubmitBtnLoader(false);
                console.log("sharefile Upload ", err);
              });
            handleData();
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
                          value={ImportForm.TINNumber?.trim()}
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
                <label className="controlform">Application Type</label>
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
                      // placeholder={applicationDetail?.beneficiaryName}
                      // value={ImportForm.BeneficiaryName}
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
                          {/* <option value="">{ImportForm?.currencyCode}</option> */}
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
                  {/* end form-bx  */}
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
                  {/* end form-bx  */}
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
                          // value={
                          //   ImportForm?.currency
                          //     ? curRate
                          //     : applicationDetail?.rate
                          // }
                          value={
                            applicationDetail?.currency
                              ? curRate
                                ? curRate
                                : applicationDetail.rate
                              : "Rate"
                          }
                          // onChange={(e) => {
                          //   changeHandelForm(e);
                          // }}
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
                          <option key={item.id} value={item.id} selected={applicationDetail?.sector == item.id}>
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

              {roleID < 3 ? (
                <div className="inner_form_new ">
                  <label className="controlform">Submit To Next Level </label>
                  <input
                    type="checkbox"
                    onChange={HandelSupervisorcheck}
                    checked={checkSupervisor}
                    disabled={roleID == 2 ? false : true}
                  />
                </div>
              ) : (
                ""
              )}

              {checkSupervisor === true ? (
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
                        // onChange={(e) => {
                        //   changeHandelForm(e);
                        // }}
                        // className={
                        //   errors.bankSupervisor &&
                        //   ImportForm.bankSupervisor === ""
                        //     ? "error"
                        //     : ""
                        // }
                      >
                        <option value="">Select Bank Supervisor</option>
                        {Supervisors?.map((item, index) => {
                          return (
                            // <option key={index} value={item.userID}>
                            //   {item.name}
                            // </option>
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

              {roleID == 2 || roleID == 3 || applicationDetail?.roleID == 4
                ? newData?.map((items, index) => {
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
                            {items.name}{" "}
                          </span>
                        </label>
                        <div className="browse-btn">
                          Browse{" "}
                          <input
                            type="file"
                            ref={fileInputRefs[index]}
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
                        files?.find((f) => f.label === items.name)?.file
                          ?.name ? (
                          <button
                            type="button"
                            className="remove-file"
                            onClick={() => {
                              removefileImage(items?.name);
                              clearInputFile(index);
                            }}
                          >
                            Remove
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })
                : ""}

              {geninfoFile?.length ? (
                geninfoFile?.map((items, index) => {
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

              {roleID == 2 || roleID == 3 || applicationDetail?.roleID == 4
                ? otherfiles?.map((file, index) => (
                    <div
                      key={"other file" + (index + 1)}
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
                          Other File {index + 1}{" "}
                        </span>
                      </label>
                      <div className="browse-btn">
                        Browse{" "}
                        <input
                          ref={fileInputRefsother[index]}
                          type="file"
                          onChange={(e) => {
                            handleFileChange(e, "other file" + (index + 1));
                          }}
                        />
                      </div>
                      <span className="filename">
                        {files.find(
                          (f) => f.label === "other file" + (index + 1)
                        )?.file?.name || "No file chosen"}
                      </span>

                      {files?.length &&
                      files?.find((f) => f.label == "other file" + (index + 1))
                        ?.file?.name ? (
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => {
                            removefileImage("other file" + (index + 1));
                            clearInputFileother(index);
                          }}
                        >
                          Remove
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ))
                : ""}

              {roleID == 2 || roleID == 3 || applicationDetail?.roleID == 4 ? (
                <button
                  type="button"
                  className="addmore-btn mb-2"
                  onClick={(e) => handleAddMore(e)}
                >
                  Add More File{" "}
                </button>
              ) : (
                ""
              )}
            </div>

            {applicationDetail?.roleID !== 4 ? (
              <>
                <h5
                  className={
                    banksuperTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setbanksuperTab(!banksuperTab)}
                >
                  Bank Supervisor{" "}
                  {responceCount?.map((item, i) => {
                    if (item?.id == 3)
                      return (
                        <>
                          {item?.count == 0 ? (
                            ""
                          ) : (
                            <span className="counter-tab">{item?.count}</span>
                          )}
                        </>
                      );
                  })}
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>
                <div className={banksuperTab ? "customtab" : "d-none"}>
                  {allcomment?.map((cur, i) => {
                    if (cur.assignedToRoleID == 3) {
                      return (
                        <ul
                          className={
                            cur?.applicationActivityData?.length >= 1
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          <li
                            className={roleID == 3 ? "nav-item" : "d-none"}
                            role="presentation"
                          >
                            <button
                              className={
                                roleID == 3
                                  ? "nav-link w-100 border-radius0 active"
                                  : "nav-link w-100 border-radius0"
                              }
                              id="banksupervisrotab"
                              data-bs-toggle="tab"
                              data-bs-target="#banksupervisrotab-justified-home"
                              type="button"
                              role="tab"
                              aria-controls="home"
                              aria-selected="true"
                            >
                              Action
                            </button>
                          </li>

                          {cur?.applicationActivityData
                            ?.slice()
                            ?.reverse()
                            .map((items, index) => {
                              return (
                                <li className="nav-item" role="presentation">
                                  <button
                                    className={
                                      index == 0 && roleID > 3
                                        ? "nav-link w-100 border-radius0 active"
                                        : "nav-link border-radius0 w-100 "
                                    }
                                    id={"banksupervisrotab" + index}
                                    data-bs-toggle="tab"
                                    data-bs-target={
                                      "#banksupervisrotab-justified-home" +
                                      index
                                    }
                                    type="button"
                                    role="tab"
                                    aria-controls="home"
                                    aria-selected="true"
                                  >
                                    Response{" "}
                                    {cur?.applicationActivityData?.length -
                                      index}
                                  </button>
                                </li>
                              );
                            })}
                        </ul>
                      );
                    }
                  })}
                  {noDataComment?.map((data, i) => {
                    if (data.roleID == 3 && data.isDataAvailable == 0) {
                      return (
                        <div
                          className={
                            banksuperTab && roleID != 3 ? "customtab" : "d-none"
                          }
                          key={i}
                        >
                          <div className="text-center">No Data Found</div>
                        </div>
                      );
                    }
                  })}

                  <div className="tab-content pt-2">
                    <div
                      className={
                        roleID == 3
                          ? "tab-pane fade show active"
                          : "tab-pane fade show "
                      }
                      id="banksupervisrotab-justified-home"
                      role="tabpanel"
                      aria-labelledby="banksupervisrotab"
                    >
                      <>
                        {Actiondata?.map((cur) => {
                          const firstItem = cur?.applicationActivityData?.[0];
                          if (cur?.assignedToRoleID === 3 && firstItem) {
                            return (
                              <div className="bakgroundaction">
                                <div key={firstItem.actionID}>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="inner_form_new">
                                        <label className="controlform">
                                          Action Type
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                firstItem?.actionStatusName ==
                                                  "Approved" ||
                                                firstItem?.actionStatusName ==
                                                  "Reject" ||
                                                firstItem?.actionStatusName ==
                                                  "Cancelled"
                                                  ? "Assigned" ||
                                                    firstItem?.actionStatusName ==
                                                      "Draft"
                                                  : firstItem?.actionStatusName
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          User{" "}
                                          <i
                                            className="bi bi-info-circle icons-info"
                                            title={`Role : ${firstItem?.actionRoleName}`}
                                          ></i>
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={firstItem?.actionUserName}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          {firstItem?.actionStatusName ==
                                            "Approved" ||
                                          firstItem?.actionStatusName ==
                                            "Reject" ||
                                          firstItem?.actionStatusName ==
                                            "Cancelled"
                                            ? "Assigned"
                                            : firstItem?.actionStatusName}{" "}
                                          Date
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={moment(
                                                firstItem?.createdDate
                                              ).format("DD/MMM/yyyy")}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionNotes
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Note
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionNotes}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionComment
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Comment
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionComment}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}

                        <div className="row">
                          <div className="col-md-12  position-relative">
                            <div
                              className={
                                roleID == 3 ? "inner_form_new " : "d-none"
                              }
                            >
                              <label className="controlform">Next Action</label>
                              <div className="row">
                                <div className="col-md-12  position-relative">
                                  <div className="hidden-toggles">
                                    <input
                                      type="radio"
                                      id="supervisorassignto"
                                      onChange={(e) => {
                                        setcheckSupervisor(true);
                                        setsupervisordecision(false);
                                        supervisorHangechangeRole(e);
                                        ChangeNextlevelHandle(e);
                                        setAssignUserID("0");
                                        GetRoleHandle(10);
                                        setapplicationstaus("0");
                                      }}
                                      name="nextactionana"
                                      className="hidden-toggles__input"
                                      value="10"
                                    />
                                    <label
                                      for="supervisorassignto"
                                      className="hidden-toggles__label"
                                    >
                                      Assign
                                    </label>
                                    <input
                                      type="radio"
                                      id="supervisordecisionredio"
                                      name="nextactionana"
                                      onChange={(e) => {
                                        setcheckSupervisor(false);
                                        setsupervisordecision(true);
                                        setnextlevelvalue("");
                                        setAssignUserID("");
                                      }}
                                      className="hidden-toggles__input"
                                    />
                                    <label
                                      for="supervisordecisionredio"
                                      className="hidden-toggles__label"
                                    >
                                      Decision
                                    </label>
                                    <input
                                      type="radio"
                                      id="supervisorDelegate"
                                      onChange={(e) => {
                                        ChangeNextlevelHandle(e);
                                        setsupervisordecision(false);
                                        supervisorHangechangeRole(e);
                                        GetRoleHandle(20);
                                        getNextvaluesupervisor(e);
                                        setcheckSupervisor(false);
                                        setAssignUserID("");
                                      }}
                                      name="nextactionana"
                                      value="20"
                                      className="hidden-toggles__input"
                                    />
                                    <label
                                      for="supervisorDelegate"
                                      className="hidden-toggles__label"
                                    >
                                      Delegate
                                    </label>
                                  </div>
                                  {errors.supervisoraction &&
                                  nextlevelvalue == "" &&
                                  supervisordecision == false ? (
                                    <small className="error-decision">
                                      {errors.supervisoraction}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-2">
                          <div className="col-md-12">
                            {checkSupervisor == false &&
                            roleID == 3 &&
                            nextlevelvalue == 20 ? (
                              <>
                                <div className="inner_form_new">
                                  <label className="controlform">User</label>

                                  <div className="form-bx">
                                    <label>
                                      <select
                                        ref={assignedToRef}
                                        name="AssignUserID"
                                        onChange={(e) =>
                                          supervisorHangechange(e)
                                        }
                                        className={
                                          errors.assignUserID && !AssignUserID
                                            ? "error"
                                            : ""
                                        }
                                      >
                                        <option value="">
                                          {nextlevelvalue == "20"
                                            ? "Select User"
                                            : "Select Senior Analyst"}
                                        </option>
                                        {asignUser?.map((item, index) => {
                                          return (
                                            <option
                                              key={index}
                                              value={item.userID}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        })}
                                      </select>
                                      <span className="sspan"></span>
                                      {errors.Descsupervisruser &&
                                      !AssignUserID ? (
                                        <small className="errormsg">
                                          {errors.Descsupervisruser}
                                        </small>
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
                          </div>
                        </div>

                        {roleID == 3 &&
                        nextlevelvalue == "" &&
                        supervisordecision == true ? (
                          <>
                            <div
                              className={
                                roleID == 3
                                  ? "inner_form_new align-items-center"
                                  : "d-none"
                              }
                            >
                              <label className="controlform">Decision</label>
                              <div className="row">
                                <div className="col-md-12 position-relative">
                                  <div className="hidden-toggles">
                                    <input
                                      type="radio"
                                      id="srcoloration-Approvedvedsr"
                                      value="10"
                                      onChange={(e) => {
                                        ChangeApplicationStatus(e);
                                        GetRoleHandle(10);
                                      }}
                                      name="applicationstaussr"
                                      className="hidden-toggles__input"
                                      checked={
                                        applicationstaus == "10" ? true : false
                                      }
                                    />
                                    <label
                                      for="srcoloration-Approvedvedsr"
                                      className="hidden-toggles__label"
                                    >
                                      Approved
                                    </label>

                                    <input
                                      type="radio"
                                      id="srcoloration-Rejected"
                                      value="30"
                                      onChange={(e) => {
                                        ChangeApplicationStatus(e);
                                      }}
                                      name="applicationstaussr"
                                      className="hidden-toggles__input"
                                      checked={
                                        applicationstaus == "30" ? true : false
                                      }
                                    />
                                    <label
                                      for="srcoloration-Rejected"
                                      className="hidden-toggles__label"
                                    >
                                      Rejected
                                    </label>

                                    <input
                                      type="radio"
                                      id="srcoloration-Deferred"
                                      onChange={(e) => {
                                        ChangeApplicationStatus(e);
                                      }}
                                      name="applicationstaussr"
                                      value="40"
                                      className="hidden-toggles__input"
                                      checked={
                                        applicationstaus == "40" ? true : false
                                      }
                                    />
                                    <label
                                      for="srcoloration-Deferred"
                                      className="hidden-toggles__label"
                                    >
                                      Deferred
                                    </label>

                                    <input
                                      type="radio"
                                      id="srcoloration-Cancelled"
                                      onChange={(e) => {
                                        ChangeApplicationStatus(e);
                                      }}
                                      name="applicationstaussr"
                                      value="25"
                                      className="hidden-toggles__input"
                                      checked={
                                        applicationstaus == "25" ? true : false
                                      }
                                    />
                                    <label
                                      for="srcoloration-Cancelled"
                                      className="hidden-toggles__label"
                                    >
                                      Cancelled
                                    </label>
                                  </div>
                                  {errors.supervisordecision &&
                                  (applicationstaus == "" ||
                                    applicationstaus == "0") ? (
                                    <small className="error-decision">
                                      {errors.supervisordecision}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}

                        <div
                          className={
                            (checkSupervisor == false &&
                              nextlevelvalue == "" &&
                              roleID == 3) ||
                            (roleID == 3 && nextlevelvalue == "") ||
                            nextlevelvalue == "10" ||
                            supervisordecision == true
                              ? "inner_form_new align-items-start mt-2"
                              : "d-none"
                          }
                        >
                          <label className="controlform">Recommendation</label>
                          <div className="form-bx">
                            <div className="mt-2 py-1">
                              <SunEditor
                                setContents={
                                  Description
                                    ? Description
                                    : applicationDetail?.analystDescription
                                }
                                onChange={(newcomment) =>
                                  setDescription(newcomment)
                                }
                                setOptions={{
                                  buttonList: [
                                    ["undo", "redo"],
                                    ["fontSize"],
                                    [
                                      "bold",
                                      "underline",
                                      "italic",
                                      "strike",
                                      "subscript",
                                      "superscript",
                                    ],
                                    ["fontColor", "hiliteColor"],
                                    ["align", "list", "lineHeight"],
                                    ["outdent", "indent"],

                                    [
                                      "table",
                                      "horizontalRule",
                                      "link",
                                      "image",
                                      "video",
                                    ],
                                    ["preview", "print"],
                                    ["removeFormat"],
                                  ],
                                  defaultTag: "div",
                                  minHeight: "120px",
                                  showPathLabel: false,
                                }}
                              />
                              <span className="sspan"></span>
                              {(errors.Description && Description == "") ||
                              Description == "<p><br></p>" ? (
                                <small
                                  className="errormsg"
                                  style={{ bottom: "-13px" }}
                                >
                                  {errors.Description}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          className={roleID == 3 ? "inner_form_new " : "d-none"}
                        >
                          <label className="controlform">Notes</label>
                          <div className="form-bx">
                            <label>
                              <textarea
                                name="Notes"
                                onChange={(e) => {
                                  HandleNextleveldata(e);
                                }}
                                placeholder="Notes"
                                className={errors.Notes ? "error" : ""}
                                value={asignnextLeveldata.Notes}
                              />
                              <span className="sspan"></span>
                              {errors.Notes ? (
                                <small className="errormsg">
                                  {errors.Notes}
                                </small>
                              ) : (
                                ""
                              )}
                            </label>
                          </div>
                        </div>

                        <div
                          className={roleID == 3 ? "inner_form_new " : "d-none"}
                        >
                          <label className="controlform">Comments</label>
                          <div className="form-bx">
                            <label>
                              <textarea
                                name="Comment"
                                onChange={(e) => {
                                  HandleNextleveldata(e);
                                }}
                                placeholder="Comments"
                                className={errors.Comment ? "error" : ""}
                                value={asignnextLeveldata.Comment}
                              />
                              <span className="sspan"></span>
                              {errors.Comment ? (
                                <small className="errormsg">
                                  {errors.Comment}
                                </small>
                              ) : (
                                ""
                              )}
                            </label>
                          </div>
                        </div>
                      </>
                    </div>

                    {allcomment?.map((cur) => {
                      return cur?.applicationActivityData
                        ?.slice()
                        ?.reverse()
                        .map((item, index) => {
                          if (cur?.assignedToRoleID == 3) {
                            return (
                              <>
                                <div
                                  key={index}
                                  className={
                                    index == 0 && roleID != 3
                                      ? "tab-pane fade show active"
                                      : "tab-pane fade show  "
                                  }
                                  id={
                                    "banksupervisrotab-justified-home" + index
                                  }
                                  role="tabpanel"
                                  aria-labelledby={"banksupervisrotab" + index}
                                >
                                  <div className="bakgroundaction">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Action Type
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.actionStatusName ==
                                                    "Approved" ||
                                                  item?.actionStatusName ==
                                                    "Reject" ||
                                                  item?.actionStatusName ==
                                                    "Cancelled"
                                                    ? "Assigned"
                                                    : item?.actionStatusName
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            User{" "}
                                            {item?.actionRoleName != null ? (
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${
                                                  item?.actionRoleName
                                                    ? item?.actionRoleName
                                                    : "N/A"
                                                }`}
                                              ></i>
                                            ) : (
                                              ""
                                            )}
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.actionUserName
                                                    ? item?.actionUserName
                                                    : "N/A"
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            {item?.actionStatusName} Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.createdDate
                                                    ? moment(
                                                        item?.createdDate
                                                      ).format("DD/MMM/yyyy")
                                                    : "N/A"
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionNotes
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Note
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              item?.actionNotes
                                                ? item?.actionNotes
                                                : "N/A"
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionComment
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Comment
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              item?.actionComment
                                                ? item?.actionComment
                                                : "N/A"
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className={
                                      item?.description
                                        ? "inner_form_new "
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: item?.description
                                            ? item?.description
                                            : "N/A",
                                        }}
                                        className="analyst_desc"
                                      ></div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          value={
                                            item?.notes ? item?.notes : "N/A"
                                          }
                                          disabled
                                        ></textarea>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Comments
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          value={
                                            item?.comment
                                              ? item?.comment
                                              : "N/A"
                                          }
                                          disabled
                                        ></textarea>
                                      </label>
                                    </div>
                                  </div>

                                  <div class="row">
                                    <div class="col-md-6">
                                      <div class="inner_form_new ">
                                        <label class="controlform">
                                          Action
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              class=""
                                              disabled
                                              value={
                                                item?.assignedAction ==
                                                  "Approved" ||
                                                item?.assignedAction ==
                                                  "Reject" ||
                                                item?.assignedAction ==
                                                  "Cancelled"
                                                  ? "Assigned"
                                                  : item?.assignedAction
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <div class="inner_form_new ">
                                        <label class="controlform">
                                          Assigned To Role
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              class=""
                                              disabled
                                              value={
                                                item?.roleName
                                                  ? item?.roleName
                                                  : "N/A"
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        });
                    })}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {roleID >= 4 && applicationDetail?.roleID != 4 ? (
              <>
                <h5
                  className={
                    recordTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setrecordTab(!recordTab)}
                >
                  Record Officer{" "}
                  {responceCount?.map((item, i) => {
                    if (item?.id == 4)
                      return (
                        <>
                          {item?.count == 0 ? (
                            ""
                          ) : (
                            <span className="counter-tab">{item?.count}</span>
                          )}
                        </>
                      );
                  })}
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>

                <div className={recordTab ? "customtab" : "d-none"}>
                  {Actiondata?.map((cur) => {
                    const firstItem = cur?.applicationActivityData?.[0];
                    if (cur?.assignedToRoleID === 4 && firstItem) {
                      return (
                        <div className="bakgroundaction">
                          <div key={firstItem.actionID}>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="inner_form_new">
                                  <label className="controlform">
                                    Action Type
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <input
                                        type="text"
                                        className=""
                                        disabled
                                        value={
                                          firstItem?.actionStatusName ==
                                            "Approved" ||
                                          firstItem?.actionStatusName ==
                                            "Reject" ||
                                          firstItem?.actionStatusName ==
                                            "Cancelled"
                                            ? "Assigned" ||
                                              firstItem?.actionStatusName ==
                                                "Draft"
                                            : firstItem?.actionStatusName
                                        }
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-3">
                                <div className="inner_form_new-sm">
                                  <label className="controlform-sm">
                                    User{" "}
                                    <i
                                      className="bi bi-info-circle icons-info"
                                      title={`Role : ${firstItem?.actionRoleName}`}
                                    ></i>
                                  </label>
                                  <div className="form-bx-sm">
                                    <label>
                                      <input
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionUserName}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-3">
                                <div className="inner_form_new-sm">
                                  <label className="controlform-sm">
                                    {firstItem?.actionStatusName ==
                                      "Approved" ||
                                    firstItem?.actionStatusName == "Reject" ||
                                    firstItem?.actionStatusName == "Cancelled"
                                      ? "Assigned"
                                      : firstItem?.actionStatusName}{" "}
                                    Date
                                  </label>
                                  <div className="form-bx-sm">
                                    <label>
                                      <input
                                        type="text"
                                        className=""
                                        disabled
                                        value={moment(
                                          firstItem?.createdDate
                                        ).format("DD/MMM/yyyy")}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                firstItem?.actionNotes
                                  ? "inner_form_new"
                                  : "d-none"
                              }
                            >
                              <label className="controlform">Action Note</label>
                              <div className="form-bx">
                                <label>
                                  <textarea
                                    type="text"
                                    className=""
                                    disabled
                                    value={firstItem?.actionNotes}
                                  />
                                </label>
                              </div>
                            </div>
                            <div
                              className={
                                firstItem?.actionComment
                                  ? "inner_form_new"
                                  : "d-none"
                              }
                            >
                              <label className="controlform">
                                Action Comment
                              </label>
                              <div className="form-bx">
                                <label>
                                  <textarea
                                    type="text"
                                    className=""
                                    disabled
                                    value={firstItem?.actionComment}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                  {allcomment?.map((cur, i) => {
                    return cur?.applicationActivityData?.map((item, index) => {
                      if (cur?.assignedToRoleID == 4) {
                        return (
                          <>
                            <div className="inner_form_new ">
                              <label className="controlform">Notes</label>
                              <div className="form-bx">
                                <label>
                                  <textarea
                                    name="Notes"
                                    placeholder="Notes"
                                    className=""
                                    disabled
                                  >
                                    {item?.notes}
                                  </textarea>
                                </label>
                              </div>
                            </div>
                            <div className="inner_form_new ">
                              <label className="controlform">Comments</label>
                              <div className="form-bx">
                                <label>
                                  <textarea
                                    name="Notes"
                                    placeholder="Comments"
                                    className=""
                                    disabled
                                  >
                                    {item?.comment}
                                  </textarea>
                                </label>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="inner_form_new ">
                                  <label className="controlform">
                                    Assigned To Role
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <input
                                        type="text"
                                        className=""
                                        disabled
                                        value={
                                          item?.roleName
                                            ? item?.roleName
                                            : "N/A"
                                        }
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="inner_form_new-sm ">
                                  <label className="controlform-sm">
                                    Assigned To User
                                  </label>
                                  <div className="form-bx-sm">
                                    <label>
                                      <input
                                        type="text"
                                        className=""
                                        disabled
                                        value={
                                          item?.assignedToName
                                            ? item?.assignedToName
                                            : "N/A"
                                        }
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      }
                    });
                  })}
                  {noDataComment?.map((data, i) => {
                    if (data.roleID == 4 && data.isDataAvailable == 0) {
                      return (
                        <div
                          className={
                            recordTab && roleID != 4 ? "customtab" : "d-none"
                          }
                          key={i}
                        >
                          <div className="text-center">No Data Found</div>
                        </div>
                      );
                    }
                  })}

                  <div className={roleID == 4 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Submit To Next Level</label>
                    <input
                      type="checkbox"
                      onChange={HandelSupervisorcheck}
                      checked={checkSupervisor}
                    />
                  </div>

                  {checkSupervisor == true && roleID == 4 ? (
                    <>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="inner_form_new ">
                            <label className="controlform">Role</label>
                            <div className="form-bx">
                              <label>
                                <select
                                  name="SupervisorRoleId"
                                  onChange={(e) => {
                                    supervisorHangechangeRoleRecordofficer(e);
                                  }}
                                >
                                  <option value="">Select Role</option>
                                  {userRoleRecordofficer?.map((item, index) => {
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
                                  <small className="errormsg">
                                    Role is required
                                  </small>
                                ) : (
                                  ""
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="inner_form_new-sm">
                            <label className="controlform-sm">User</label>
                            <div className="form-bx-sm">
                              <label>
                                <select
                                  ref={assignedToRef}
                                  name="assignedTo"
                                  onChange={(e) => {
                                    handleuserByrecordOfficer(e);
                                  }}
                                  className={errors.assignedTo ? "error" : ""}
                                >
                                  <option value="" selected>
                                    Select User
                                  </option>
                                  {getalluser?.map((item, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item.userID}
                                        selected={
                                          AssignUserID == item.userID
                                            ? true
                                            : false
                                        }
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                                <span className="sspan"></span>
                                {errors.AssignUserID && !SupervisorNameID ? (
                                  <small className="errormsg">
                                    User is required
                                  </small>
                                ) : (
                                  ""
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className={roleID == 4 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Notes</label>
                    <div className="form-bx">
                      <label>
                        <textarea
                          name="Notes"
                          onChange={(e) => {
                            HandleNextleveldata(e);
                          }}
                          placeholder="Notes"
                          className={errors.Notes ? "error" : ""}
                          value={asignnextLeveldata.Notes}
                        />
                        <span className="sspan"></span>
                        {errors.Notes ? (
                          <small className="errormsg">{errors.Notes}</small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>

                  <div className={roleID == 4 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Comments</label>
                    <div className="form-bx">
                      <label>
                        <textarea
                          name="Comment"
                          onChange={(e) => {
                            HandleNextleveldata(e);
                          }}
                          placeholder="Comments"
                          className={errors.Comment ? "error" : ""}
                          value={asignnextLeveldata.Comment}
                        />
                        <span className="sspan"></span>
                        {errors.Comment ? (
                          <small className="errormsg">{errors.Comment}</small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {roleID >= 4 ? (
              <>
                <h5
                  className={
                    analystTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setanalystTab(!analystTab)}
                >
                  Analyst{" "}
                  {responceCount?.map((item, i) => {
                    if (item?.id == 5)
                      return (
                        <>
                          {item?.count == 0 ? (
                            ""
                          ) : (
                            <span className="counter-tab">{item?.count}</span>
                          )}
                        </>
                      );
                  })}
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>

                <div className={analystTab ? "customtab" : "d-none"}>
                  {allcomment?.map((cur, i) => {
                    if (cur.assignedToRoleID == 5) {
                      return (
                        <ul
                          className={
                            cur?.applicationActivityData?.length >= 1
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          <li
                            className={roleID == 5 ? "nav-item" : "d-none"}
                            role="presentation"
                          >
                            <button
                              className={
                                roleID == 5
                                  ? "nav-link w-100 border-radius0 active"
                                  : "nav-link w-100 border-radius0"
                              }
                              id="analyst"
                              data-bs-toggle="tab"
                              data-bs-target="#analyst-justified-home"
                              type="button"
                              role="tab"
                              aria-controls="home"
                              aria-selected="true"
                            >
                              Action
                            </button>
                          </li>

                          {cur?.applicationActivityData
                            ?.slice()
                            ?.reverse()
                            .map((items, index) => {
                              return (
                                <li className="nav-item" role="presentation">
                                  <button
                                    className={
                                      index == 0 && roleID > 5
                                        ? "nav-link w-100 border-radius0 active"
                                        : "nav-link border-radius0 w-100 "
                                    }
                                    id={"analyst" + index}
                                    data-bs-toggle="tab"
                                    data-bs-target={
                                      "#analyst-justified-home" + index
                                    }
                                    type="button"
                                    role="tab"
                                    aria-controls="home"
                                    aria-selected="true"
                                  >
                                    Response{" "}
                                    {cur?.applicationActivityData?.length -
                                      index}
                                  </button>
                                </li>
                              );
                            })}
                        </ul>
                      );
                    }
                  })}

                  <div className="tab-content pt-2">
                    <div
                      className={
                        roleID == 5
                          ? "tab-pane fade show active"
                          : "tab-pane fade show "
                      }
                      id="analyst-justified-home"
                      role="tabpanel"
                      aria-labelledby="analyst"
                    >
                      {Actiondata?.map((cur) => {
                        const firstItem = cur?.applicationActivityData?.[0];
                        if (cur?.assignedToRoleID === 5 && firstItem) {
                          return (
                            <div className="bakgroundaction">
                              <div key={firstItem.actionID}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Action Type
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              firstItem?.actionStatusName ==
                                                "Approved" ||
                                              firstItem?.actionStatusName ==
                                                "Reject" ||
                                              firstItem?.actionStatusName ==
                                                "Cancelled" ||
                                              firstItem?.actionStatusName ==
                                                "Draft"
                                                ? "Assigned"
                                                : firstItem?.actionStatusName
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        User{" "}
                                        <i
                                          className="bi bi-info-circle icons-info"
                                          title={`Role : ${firstItem?.actionRoleName}`}
                                        ></i>
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={firstItem?.actionUserName}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        {firstItem?.actionStatusName ==
                                          "Approved" ||
                                        firstItem?.actionStatusName ==
                                          "Reject" ||
                                        firstItem?.actionStatusName ==
                                          "Cancelled"
                                          ? "Assigned"
                                          : firstItem?.actionStatusName}{" "}
                                        Date
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              firstItem?.createdDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionNotes
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Note
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionNotes}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionComment
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Comment
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionComment}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}

                      <div
                        className={
                          roleID == 5
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">
                          Analyst Recommendation
                        </label>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="colorationApprovedvedanalista"
                                value="10"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                  GetRoleHandle(10);
                                }}
                                name="applicationstausana"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "10" ? true : false
                                }
                              />
                              <label
                                for="colorationApprovedvedanalista"
                                className="hidden-toggles__label"
                              >
                                Approved
                              </label>

                              <input
                                type="radio"
                                id="colorationRejectedanalyst"
                                value="30"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                  GetRoleHandle(30);
                                }}
                                name="applicationstausana"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="colorationRejectedanalyst"
                                className="hidden-toggles__label"
                              >
                                Rejected
                              </label>

                              <input
                                type="radio"
                                id="colorationDeferredanalyst"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                  GetRoleHandle(40);
                                }}
                                name="applicationstausana"
                                value="40"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="colorationDeferredanalyst"
                                className="hidden-toggles__label"
                              >
                                Deferred
                              </label>

                              <input
                                type="radio"
                                id="colorationCancelledanalyst"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                  GetRoleHandle(25);
                                }}
                                name="applicationstausana"
                                value="25"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="colorationCancelledanalyst"
                                className="hidden-toggles__label"
                              >
                                Cancelled
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 5
                            ? "inner_form_new align-items-start mt-2"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Recommendation</label>
                        <div className="form-bx">
                          <div className="mt-2 py-1">
                            <SunEditor
                              setContents={
                                Description
                                  ? Description
                                  : applicationDetail?.analystDescription
                              }
                              onChange={(newcomment) =>
                                setDescription(newcomment)
                              }
                              setOptions={{
                                buttonList: [
                                  ["undo", "redo"],
                                  ["font", "fontSize"],
                                  [
                                    "bold",
                                    "underline",
                                    "italic",
                                    "strike",
                                    "subscript",
                                    "superscript",
                                  ],
                                  ["fontColor", "hiliteColor"],
                                  ["align", "list", "lineHeight"],
                                  ["outdent", "indent"],

                                  [
                                    "table",
                                    "horizontalRule",
                                    "link",
                                    "image",
                                    "video",
                                  ],
                                  ["preview", "print"],
                                  ["removeFormat"],
                                ],
                                defaultTag: "div",
                                minHeight: "120px",
                                showPathLabel: false,
                              }}
                            />

                            <span className="sspan"></span>
                            {(errors.Description && Description == "") ||
                            Description == "<p><br></p>" ? (
                              <small
                                className="errormsg"
                                style={{ bottom: "-13px" }}
                              >
                                {errors.Description}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 5
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Next Action</label>
                        <div className="row">
                          <div className="col-md-12 my-2">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="asignto"
                                onChange={(e) => {
                                  setcheckSupervisor(true);
                                  supervisorHangechangeRole(e);
                                  ChangeNextlevelHandle(e);
                                  GetRoleHandle(10);
                                }}
                                name="nextactionana"
                                className="hidden-toggles__input"
                                value="10"
                              />
                              <label
                                for="asignto"
                                className="hidden-toggles__label"
                              >
                                Assign
                              </label>

                              {roleID == 5 ? (
                                ""
                              ) : (
                                <>
                                  <input
                                    type="radio"
                                    id="coloration-Refer"
                                    onChange={(e) => {
                                      ChangeApplicationStatus(e);
                                      setcheckSupervisor(true);
                                      supervisorHangechangeRole(e);
                                      GetRoleHandle(15);
                                    }}
                                    name="nextactionana"
                                    value="15"
                                    className="hidden-toggles__input"
                                  />
                                  <label
                                    for="coloration-Refer"
                                    className="hidden-toggles__label"
                                  >
                                    Refer Back
                                  </label>
                                </>
                              )}
                              <input
                                type="radio"
                                id="coloration-Delegationaaa"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(20);
                                }}
                                name="nextactionana"
                                value="20"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="coloration-Delegationaaa"
                                className="hidden-toggles__label"
                              >
                                Delegate
                              </label>

                              <input
                                type="radio"
                                id="coloration-Department"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(35);
                                }}
                                name="nextactionana"
                                value="35"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="coloration-Department"
                                className="hidden-toggles__label"
                              >
                                Referred to Other Department
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col-md-7 d-none">
                          {checkSupervisor == true && roleID == 5 ? (
                            <>
                              <div className="inner_form_new">
                                <label className="controlform">Role</label>
                                <div className="form-bx">
                                  <label>
                                    <select
                                      ref={assignedToRef}
                                      name="SupervisorRoleId"
                                      onChange={(e) => {
                                        supervisorHangechangeRole(e);
                                        handleUserRole(e);
                                      }}
                                      className={
                                        errors.assignedTo && !SupervisorRoleId
                                          ? "error"
                                          : ""
                                      }
                                    >
                                      <option value="90A">Select Role</option>
                                      {userRole?.map((item, index) => {
                                        return (
                                          <option key={index} value={item.id}>
                                            {item.designation}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <span className="sspan"></span>
                                    {errors.assignedTo && !SupervisorRoleId ? (
                                      <small className="errormsg">
                                        Senior Analyst is required{" "}
                                      </small>
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
                        </div>

                        <div className="col-md-12">
                          {checkSupervisor == true && roleID == 5 ? (
                            <>
                              <div className="inner_form_new">
                                <label className="controlform">
                                  {nextlevelvalue == "20"
                                    ? "User"
                                    : "Submit To Senior Analyst"}
                                </label>

                                <div className="form-bx">
                                  <label>
                                    <select
                                      ref={assignedToRef}
                                      name="AssignUserID"
                                      onChange={(e) => supervisorHangechange(e)}
                                      className={
                                        errors.assignUserID && !AssignUserID
                                          ? "error"
                                          : ""
                                      }
                                    >
                                      <option value="">
                                        {nextlevelvalue == "20"
                                          ? "Select User"
                                          : "Select Senior Analyst"}
                                      </option>
                                      {asignUser?.map((item, index) => {
                                        return (
                                          <option
                                            key={index}
                                            value={item.userID}
                                          >
                                            {item.name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <span className="sspan"></span>
                                    {errors.assignUserID && !AssignUserID ? (
                                      <small className="errormsg">
                                        {errors.assignUserID}
                                      </small>
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
                        </div>
                      </div>

                      {attachmentData?.map((items, index) => {
                        return (
                          <div
                            className="attachemt_form-bx  mt-2"
                            key={items.id}
                          >
                            <label
                              style={{
                                background: "#d9edf7",
                                padding: "9px 3px",
                                border: "0px",
                              }}
                            >
                              <span style={{ fontWeight: "500" }}>
                                {items.filename}
                              </span>
                            </label>
                            <div className="browse-btn">
                              Browse
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleuserFileChange(e, "analyst" + index)
                                }
                              />
                            </div>
                            <span className="filename">
                              {userfiles?.find(
                                (f) => f.id === "analyst" + index
                              )?.file?.name || "No file chosen"}
                            </span>
                            {userfiles?.length &&
                            userfiles?.find((f) => f.id === "analyst" + index)
                              ?.file?.name ? (
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() =>
                                  removeUserImage(index, "analyst" + index)
                                }
                              >
                                Remove
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}

                      {otheruserfiles?.map((file, index) => (
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
                           Other File {index + 1}
                            
                          </label>
                          <div className="browse-btn">
                            Browse{" "}
                            <input
                              type="file"
                              onChange={(e) => {
                                handleuserFileChange(e, "other" + index);
                                handleOthrefile(e, `other ${index}`);
                              }}
                            />
                          </div>
                          <span className="filename">
                            {userfiles?.find((f) => f.id === "other" + index)
                              ?.file?.name || "No file chosen"}
                          </span>
                          {userfiles?.length &&
                          userfiles?.find((f) => f.id === "other" + index)?.file
                            ?.name ? (
                            <button
                              type="button"
                              className="remove-file"
                              onClick={() =>
                                removeUserImage(index, "other" + index)
                              }
                            >
                              Remove
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}

                      {otheruserfiles?.length || userfiles?.length ? (
                        <div className="attachemt_form-bx">
                          <label style={{ border: "0px" }}>{""}</label>
                          <button
                            type="button"
                            className="addmore-btn mt-0"
                            onClick={(e) => handleuserAddMore(e)}
                          >
                            {" "}
                            Add More File{" "}
                          </button>
                        </div>
                      ) : (
                        ""
                      )}

                      <div
                        className={roleID == 5 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Notes"
                            : nextlevelvalue == "20"
                            ? "Delegate Notes"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Notes"
                            : nextlevelvalue == "15"
                            ? "Refer Back Notes"
                            : "Notes"}
                        </label>
                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Notes"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Notes"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Notes"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Notes"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Notes"
                                  : "Notes"
                              }
                              className={errors.Notes ? "error" : ""}
                              value={asignnextLeveldata.Notes}
                            />
                            <span className="sspan"></span>
                            {errors.Notes ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign notes is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate notes is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department notes is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer back notes is required"
                                  : "Notes is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>

                      <div
                        className={roleID == 5 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Comments"
                            : nextlevelvalue == "20"
                            ? "Delegate Comments"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Comments"
                            : nextlevelvalue == "15"
                            ? "Refer Back Comments"
                            : "Comments"}
                        </label>

                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Comment"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Comments"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Comments"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Comments"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Comments"
                                  : "Comments"
                              }
                              className={errors.Comment ? "error" : ""}
                              value={asignnextLeveldata.Comment}
                            />
                            <span className="sspan"></span>
                            {errors.Comment ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign comments is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate comments is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department comments is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back comments is required"
                                  : "Comments is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new align-items-center">
                        <label className="controlform">CC To</label>
                        <div className=" cccto">
                          <div className="flex justify-content-center multiSelect">
                            <MultiSelect
                              value={selectedBanks}
                              onChange={(e) => setSelectedBanks(e.value)}
                              options={vOption}
                              optionLabel="name"
                              onShow={onShow}
                              placeholder="Select Banks"
                              // maxSelectedLabels={3}
                              className="w-full md:w-20rem"
                              display="chip"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 5
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Is Return Needed?</label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="YesIsReturnana"
                            name="IsReturnana"
                            onChange={(e) => HandleIsReturnOption(e)}
                            className="hidden-toggles__input"
                            checked={IsReturn == "1"}
                            value="1"
                          />
                          <label
                            for="YesIsReturnana"
                            className="hidden-toggles__label"
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="IsReturnana"
                            id="NoIsReturnana"
                            className="hidden-toggles__input"
                            onChange={(e) => HandleIsReturnOption(e)}
                            value="0"
                            checked={IsReturn == "0"}
                          />
                          <label
                            for="NoIsReturnana"
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 5 && IsReturnOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Return Frequency
                            </label>
                            <div className="form-bx">
                              <label>
                                <select
                                  name="ReturnFrequency"
                                  onChange={(e) => SelectReturnFrequency(e)}
                                >
                                  <option
                                    value="0"
                                    selected={IsReturn == 0 ? true : false}
                                    defaultChecked
                                  >
                                    Select Frequency
                                  </option>
                                  {AllFrequency?.map((item, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item.id}
                                        selected={
                                          getFrequencyID == item.id &&
                                          getFrequencyID != ""
                                            ? true
                                            : false
                                        }
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 5 &&
                              IsReturn == "1" &&
                              getFrequencyID == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Frequency Date
                            </label>
                            <div className="form-bx-sm">
                              <DatePicker
                                ref={FrequencyDateRef}
                                placeholderText="Select Frequency Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={IsReturnExpiringDate}
                                onChange={(date) =>
                                  setIsReturnExpiringDate(date)
                                }
                                peekNextMonth
                                showMonthDropdown
                                maxDate={new Date("03-31-2027")}
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
                                onKeyDown={(e) => {
                                  const key = e.key;
                                  const allowedKeys = /[0-9\/]/; // Allow numbers and '/'
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
                              {errors.IsReturnExpiringDate &&
                              (IsReturnExpiringDate ==
                                "Select Frequency Date " ||
                                IsReturnExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.IsReturnExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 5
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">
                          Is Expiry Required ?
                        </label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="exprqana"
                            name="dateexpityana"
                            onChange={(e) => HandleDateExpiryOption(e)}
                            className="hidden-toggles__input"
                            checked={defaultnoExpiry == "1"}
                            value="1"
                          />
                          <label
                            for="exprqana"
                            className="hidden-toggles__label"
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="dateexpityana"
                            id="noexpana"
                            className="hidden-toggles__input"
                            onChange={(e) => {
                              HandleDateExpiryOption(e);
                              setExpiringDate(null);
                            }}
                            value="0"
                            checked={defaultnoExpiry == "0"}
                          />
                          <label
                            for="noexpana"
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 5 && DateExpiryOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Define Expiry Date
                            </label>

                            <div
                              className={
                                DateExpiryOption == "1"
                                  ? "hidden-toggles"
                                  : "d-none"
                              }
                            >
                              <input
                                type="radio"
                                ref={dateExpirydisplayRef}
                                id="defineddateana"
                                className="hidden-toggles__input"
                                name="dateExpirydisplayana"
                                onChange={(e) =>
                                  setDateExpirydisplay(e.target.value)
                                }
                                value="0"
                                checked={
                                  DateExpirydisplay != "" &&
                                  DateExpirydisplay == "0" &&
                                  DateExpiryOption == "1"
                                }
                              />{" "}
                              <label
                                for="defineddateana"
                                className="hidden-toggles__label"
                              >
                                Specific Date
                              </label>
                              <input
                                type="radio"
                                ref={optionExpirydisplayRef}
                                id="rerpetualdate"
                                name="dateExpirydisplayana"
                                onChange={(e) => {
                                  setDateExpirydisplay(e.target.value);
                                  setExpiringDate(null);
                                }}
                                className="hidden-toggles__input"
                                value="1"
                                checked={
                                  DateExpirydisplay == "1" &&
                                  DateExpiryOption == "1"
                                }
                              />
                              <label
                                for="rerpetualdate"
                                className="hidden-toggles__label"
                              >
                                Perpetual
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 5 &&
                              DateExpirydisplay == "0" &&
                              DateExpiryOption == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Expiry Date
                            </label>
                            <div className="form-bx-sm">
                              <DatePicker
                                placeholderText="Select Expiry Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={ExpiringDate}
                                onChange={(date) => setExpiringDate(date)}
                                peekNextMonth
                                showMonthDropdown
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
                                onKeyDown={(e) => {
                                  const key = e.key;
                                  const allowedKeys = /[0-9\/]/; // Allow numbers and '/'
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
                              {errors.ExpiringDate &&
                              (ExpiringDate == "Select Expiring Date " ||
                                ExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.ExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {allcomment?.map((cur) => {
                      return cur?.applicationActivityData
                        ?.slice()
                        ?.reverse()
                        .map((item, index) => {
                          if (cur?.assignedToRoleID == 5) {
                            return (
                              <>
                                <div
                                  key={index}
                                  className={
                                    index == 0 && roleID != 5
                                      ? "tab-pane fade show active"
                                      : "tab-pane fade show  "
                                  }
                                  id={"analyst-justified-home" + index}
                                  role="tabpanel"
                                  aria-labelledby={"analyst" + index}
                                >
                                  <div className="bakgroundaction">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Action Type
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.actionStatusName ==
                                                    "Approved" ||
                                                  item?.actionStatusName ==
                                                    "Reject" ||
                                                  item?.actionStatusName ==
                                                    "Cancelled"
                                                    ? "Assigned" ||
                                                      item?.actionStatusName ==
                                                        "Draft"
                                                    : item?.actionStatusName
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            User{" "}
                                            <i
                                              className="bi bi-info-circle icons-info"
                                              title={`Role : ${item?.actionRoleName}`}
                                            ></i>
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={item?.actionUserName}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            {item?.actionStatusName ==
                                              "Approved" ||
                                            item?.actionStatusName ==
                                              "Reject" ||
                                            item?.actionStatusName ==
                                              "Cancelled"
                                              ? "Assigned"
                                              : item?.actionStatusName}{" "}
                                            Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  item?.createdDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionNotes
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Note
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={item?.actionNotes}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionComment
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Comment
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={item?.actionComment}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Analyst Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              applicationDetail?.analystRecommendationName,
                                          }}
                                          className="disabled"
                                          disabled
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new">
                                    <label className="controlform">
                                      Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: item?.description
                                              ? item?.description
                                              : "N/A",
                                          }}
                                          disabled
                                          className="disabled viewdiscription"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          disabled
                                        >
                                          {item?.notes}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Comments
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Comments"
                                          className=""
                                          disabled
                                        >
                                          {item?.comment}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Attachments
                                    </label>
                                    <div className="form-bx">
                                      {item?.filesData?.length ? (
                                        item?.filesData?.map((items, index) => {
                                          return (
                                            <div
                                              className="attachemt_form-bx mb-0 width-80"
                                              key={items.id}
                                            >
                                              <label className="mb-2 mb-0 pt-2 pb-2">
                                                {items?.fileName
                                                  ? items?.fileName
                                                  : `FileUpload ${index}`}
                                              </label>
                                              <div
                                                className={
                                                  roleID == 2 || roleID == 3
                                                    ? "browse-btn"
                                                    : "d-none"
                                                }
                                              >
                                                Browse{" "}
                                                <input
                                                  type="file"
                                                  onChange={(e) =>
                                                    handleFileChange(
                                                      e,
                                                      items.id
                                                    )
                                                  }
                                                />
                                              </div>
                                              <span className="filename">
                                                <Link
                                                  to={items?.filePath}
                                                  target="_blank"
                                                  className="viewbtn"
                                                >
                                                  View File
                                                </Link>
                                              </span>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <label className="notfound">
                                          File Not Found
                                        </label>
                                      )}
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul className="nalist">
                                          {item?.copiedResponseData?.length ? (
                                            item?.copiedResponseData?.map(
                                              (res) => {
                                                return <li>{res?.bankName}</li>;
                                              }
                                            )
                                          ) : (
                                            <li className="disabletext">N/A</li>
                                          )}
                                        </ul>
                                      </label>
                                    </div>
                                  </div>

                                  <div class="row">
                                    <div class="col-md-12">
                                      <div class="inner_form_new ">
                                        <label class="controlform">
                                          Action
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              class=""
                                              disabled
                                              value={
                                                item?.assignedAction ==
                                                  "Approved" ||
                                                item?.assignedAction ==
                                                  "Reject" ||
                                                item?.assignedAction ==
                                                  "Cancelled"
                                                  ? "Assigned"
                                                  : item?.assignedAction
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.isReturnNeeded == 0 ||
                                            item?.isReturnNeeded == null
                                              ? "No"
                                              : item?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {item.isReturnNeeded == 1 &&
                                  item?.returnFrequencyType == 1 &&
                                  item?.returnFrequencyName == "Once" ? (
                                    <div className="row">
                                      <div className="col-md-7">
                                        <div className="inner_form_new align-item-center">
                                          <label className="controlform">
                                            Return Frequency
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnFrequencyName
                                                    ? item?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-5">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnDate ||
                                                  !item?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        item?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : item.isReturnNeeded == 1 &&
                                    item?.returnFrequencyType !== 1 ? (
                                    <div className="col-md-12">
                                      <div className="inner_form_new align-item-center">
                                        <label className="controlform">
                                          Return Frequency
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.returnFrequencyName
                                                  ? item?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Define Expiry Date
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.expiringDate
                                              ? moment(
                                                  item?.expiringDate
                                                ).format("DD/MMM/YYYY")
                                              : "N/A"
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div
                                    className={
                                      item?.assignedToName == null &&
                                      item?.assignedToName == null
                                        ? "d-none"
                                        : "row"
                                    }
                                  >
                                    <div className="col-md-6">
                                      <div className="inner_form_new ">
                                        <label className="controlform">
                                          Assigned To Role
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.roleName
                                                  ? item?.roleName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="inner_form_new-sm ">
                                        <label className="controlform-sm">
                                          Assigned To User
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.assignedToName
                                                  ? item?.assignedToName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        });
                    })}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {noDataComment?.map((data, i) => {
              if (data.roleID == 5 && data.isDataAvailable == 0) {
                return (
                  <div
                    className={
                      analystTab && roleID != 5 ? "customtab" : "d-none"
                    }
                    key={i}
                  >
                    <div className="text-center">No Data Found</div>
                  </div>
                );
              }
            })}

            {roleID >= 4 ? (
              <>
                <h5
                  className={
                    sranalystTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setsranalystTab(!sranalystTab)}
                >
                  Senior Analyst{" "}
                  {responceCount?.map((item, i) => {
                    if (item?.id == 6)
                      return (
                        <>
                          {item?.count == 0 ? (
                            ""
                          ) : (
                            <span className="counter-tab">{item?.count}</span>
                          )}
                        </>
                      );
                  })}
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>

                <div className={sranalystTab ? "customtab" : "d-none"}>
                  {allcomment?.map((cur, i) => {
                    if (cur.assignedToRoleID == 6) {
                      return (
                        <ul
                          className={
                            cur?.applicationActivityData?.length >= 1
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          <li
                            className={roleID == 6 ? "nav-item" : "d-none"}
                            role="presentation"
                          >
                            <button
                              className={
                                roleID == 6
                                  ? "nav-link w-100 border-radius0 active"
                                  : "nav-link w-100 border-radius0"
                              }
                              id="sranalystab"
                              data-bs-toggle="tab"
                              data-bs-target="#sranalystab-justified-home"
                              type="button"
                              role="tab"
                              aria-controls="home"
                              aria-selected="true"
                            >
                              Action
                            </button>
                          </li>

                          {cur?.applicationActivityData
                            ?.slice()
                            ?.reverse()
                            .map((items, index) => {
                              return (
                                <li className="nav-item" role="presentation">
                                  <button
                                    className={
                                      index == 0 && roleID != 6
                                        ? "nav-link w-100 border-radius0 active"
                                        : "nav-link border-radius0 w-100 "
                                    }
                                    id={"sranalystab" + index}
                                    data-bs-toggle="tab"
                                    data-bs-target={
                                      "#sranalystab-justified-home" + index
                                    }
                                    type="button"
                                    role="tab"
                                    aria-controls="home"
                                    aria-selected="true"
                                  >
                                    Response{" "}
                                    {cur?.applicationActivityData?.length -
                                      index}
                                  </button>
                                </li>
                              );
                            })}
                        </ul>
                      );
                    }
                  })}
                  {noDataComment?.map((data, i) => {
                    if (data.roleID == 6 && data.isDataAvailable == 0) {
                      return (
                        <div
                          className={
                            sranalystTab && roleID != 6 ? "customtab" : "d-none"
                          }
                          key={i}
                        >
                          <div className="text-center">No Data Found</div>
                        </div>
                      );
                    }
                  })}

                  <div className="tab-content pt-2">
                    <div
                      className={
                        roleID == 6
                          ? "tab-pane fade show active"
                          : "tab-pane fade show "
                      }
                      id="sranalystab-justified-home"
                      role="tabpanel"
                      aria-labelledby="sranalystab"
                    >
                      {Actiondata?.map((cur) => {
                        const firstItem = cur?.applicationActivityData?.[0];
                        if (cur?.assignedToRoleID === 6 && firstItem) {
                          return (
                            <div className="bakgroundaction">
                              <div key={firstItem.actionID}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Action Type
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          {" "}
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              firstItem?.actionStatusName ==
                                                "Approved" ||
                                              firstItem?.actionStatusName ==
                                                "Reject" ||
                                              firstItem?.actionStatusName ==
                                                "Cancelled"
                                                ? "Assigned" ||
                                                  firstItem?.actionStatusName ==
                                                    "Draft"
                                                : firstItem?.actionStatusName
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        User{" "}
                                        <i
                                          className="bi bi-info-circle icons-info"
                                          title={`Role : ${firstItem?.actionRoleName}`}
                                        ></i>
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          {" "}
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={firstItem?.actionUserName}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        {firstItem?.actionStatusName ==
                                          "Approved" ||
                                        firstItem?.actionStatusName ==
                                          "Reject" ||
                                        firstItem?.actionStatusName ==
                                          "Cancelled"
                                          ? "Assigned"
                                          : firstItem?.actionStatusName}{" "}
                                        Date
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              firstItem?.createdDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionNotes
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Note
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionNotes}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionComment
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Comment
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionComment}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}

                      <div
                        className={
                          roleID == 6
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Next Action</label>
                        <div className="row">
                          <div className="col-md-12 my-2">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="srrecomndByAnalyst"
                                onClick={() => {
                                  setRecomdAnalyst("121");
                                  setnextlevelvalue("");
                                  setAssignUserID("");
                                  setSupervisorRoleId("");
                                  setAsignUser([]);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextaction"
                                className={
                                  applicationDetail?.analystRecommendation ==
                                    "" ||
                                  applicationDetail?.analystRecommendation ==
                                    "0"
                                    ? "d-none"
                                    : "hidden-toggles__input"
                                }
                                value="121"
                                checked={recomdAnalyst == "121" ? true : false}
                              />
                              <label
                                for="srrecomndByAnalyst"
                                className={
                                  applicationDetail?.analystRecommendation ==
                                    "" ||
                                  applicationDetail?.analystRecommendation ==
                                    "0"
                                    ? "d-none"
                                    : "hidden-toggles__label"
                                }
                              >
                                As Recommended by Analyst
                              </label>

                              <input
                                type="radio"
                                id="srasignto"
                                onChange={(e) => {
                                  setcheckSupervisor(true);
                                  supervisorHangechangeRole(e);
                                  ChangeNextlevelHandle(e);
                                  GetRoleHandle(10);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                onClick={() => setRecomdAnalyst("")}
                                name="nextaction"
                                className="hidden-toggles__input"
                                value="10"
                              />
                              <label
                                for="srasignto"
                                className="hidden-toggles__label"
                              >
                                Assign
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Refer"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(15);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                onClick={() => setRecomdAnalyst("")}
                                name="nextaction"
                                value="15"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="srcoloration-Refer"
                                className="hidden-toggles__label"
                              >
                                Refer Back
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Delegation"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(20);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                onClick={() => setRecomdAnalyst("")}
                                name="nextaction"
                                value="20"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="srcoloration-Delegation"
                                className="hidden-toggles__label"
                              >
                                Delegate
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Department"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(35);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                onClick={() => setRecomdAnalyst("")}
                                name="nextaction"
                                value="35"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="srcoloration-Department"
                                className="hidden-toggles__label"
                              >
                                Referred to Other Department
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={checkSupervisor == true ? "row" : "d-none"}
                      >
                        <div className="col-md-12 d-flex c-gap">
                          <div
                            className={nextlevelvalue == 15 ? "w-50" : "d-none"}
                          >
                            {checkSupervisor == true && roleID == 6 ? (
                              <>
                                <div className="inner_form_new">
                                  <label className="controlform">Role</label>
                                  <div className="form-bx">
                                    <label>
                                      <select
                                        ref={assignedToRef}
                                        name="SupervisorRoleId"
                                        onChange={(e) => {
                                          supervisorHangechangeRole(e);
                                          handleUserRole(e);
                                        }}
                                        className={
                                          errors.assignedTo && !SupervisorRoleId
                                            ? "error"
                                            : ""
                                        }
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
                                      {errors.assignedTo &&
                                      !SupervisorRoleId ? (
                                        <small className="errormsg">
                                          Role is required{" "}
                                        </small>
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
                          </div>
                          <div
                            className={nextlevelvalue == 15 ? "w-50" : "w-100"}
                          >
                            {roleID == 6 && recomdAnalyst != "121" ? (
                              <>
                                <div className="inner_form_new">
                                  <label className="controlform">User</label>
                                  <div className="form-bx">
                                    <label>
                                      <select
                                        ref={assignedToRef}
                                        name="AssignUserID"
                                        onChange={(e) =>
                                          supervisorHangechange(e)
                                        }
                                        className={
                                          errors.assignUserID && !AssignUserID
                                            ? "error"
                                            : ""
                                        }
                                      >
                                        <option value="">Select User</option>
                                        {asignUser?.map((item, index) => {
                                          return (
                                            <option
                                              key={index}
                                              value={item.userID}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        })}
                                      </select>
                                      <span className="sspan"></span>
                                      {errors.assignUserID && !AssignUserID ? (
                                        <small className="errormsg">
                                          {errors.assignUserID}
                                        </small>
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
                          </div>
                        </div>
                      </div>

                      {attachmentData?.map((items, index) => {
                        return (
                          <div
                            className="attachemt_form-bx  mt-2"
                            key={items.id}
                          >
                            <label
                              style={{
                                background: "#d9edf7",
                                padding: "9px 3px",
                                border: "0px",
                              }}
                            >
                              <span style={{ fontWeight: "500" }}>
                                {items.filename}
                              </span>
                            </label>
                            <div className="browse-btn">
                              Browse
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleuserFileChange(e, "analyst" + index)
                                }
                              />
                            </div>
                            <span className="filename">
                              {userfiles?.find(
                                (f) => f.id === "analyst" + index
                              )?.file?.name || "No file chosen"}
                            </span>
                            {userfiles?.length &&
                            userfiles?.find((f) => f.id === "analyst" + index)
                              ?.file?.name ? (
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() =>
                                  removeUserImage(index, "analyst" + index)
                                }
                              >
                                Remove
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}

                      {otheruserfiles?.map((file, index) => (
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
                            
                              Other File
                              {index + 1}
                             
                          </label>
                          <div className="browse-btn">
                            Browse{" "}
                            <input
                              type="file"
                              onChange={(e) => {
                                handleuserFileChange(e, "other" + index);
                                handleOthrefile(e, `other ${index}`);
                              }}
                            />
                          </div>
                          <span className="filename">
                            {userfiles?.find((f) => f.id === "other" + index)
                              ?.file?.name || "No file chosen"}
                          </span>
                          {userfiles?.length &&
                          userfiles?.find((f) => f.id === "other" + index)?.file
                            ?.name ? (
                            <button
                              type="button"
                              className="remove-file"
                              onClick={() =>
                                removeUserImage(index, "other" + index)
                              }
                            >
                              Remove
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}

                      {otheruserfiles?.length || userfiles?.length ? (
                        <div className="attachemt_form-bx">
                          <label style={{ border: "0px" }}>{""}</label>
                          <button
                            type="button"
                            className="addmore-btn mt-0"
                            onClick={(e) => handleuserAddMore(e)}
                          >
                            Add More File{" "}
                          </button>
                        </div>
                      ) : (
                        ""
                      )}

                      <div
                        className={
                          roleID == 6
                            ? "inner_form_new align-items-start mt-2"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Recommendation</label>
                        <div className="form-bx">
                          <div className="mt-2 py-1">
                            <SunEditor
                              setContents={
                                Description
                                  ? Description
                                  : applicationDetail?.analystDescription
                              }
                              onChange={(newcomment) =>
                                setDescription(newcomment)
                              }
                              setOptions={{
                                buttonList: [
                                  ["undo", "redo"],
                                  ["font", "fontSize"],
                                  [
                                    "bold",
                                    "underline",
                                    "italic",
                                    "strike",
                                    "subscript",
                                    "superscript",
                                  ],
                                  ["fontColor", "hiliteColor"],
                                  ["align", "list", "lineHeight"],
                                  ["outdent", "indent"],
                                  [
                                    "table",
                                    "horizontalRule",
                                    "link",
                                    "image",
                                    "video",
                                  ],
                                  ["preview", "print"],
                                  ["removeFormat"],
                                ],
                                defaultTag: "div",
                                minHeight: "120px",
                                showPathLabel: false,
                              }}
                            />
                            <span className="sspan"></span>
                            {(errors.Description && Description == "") ||
                            Description == "<p><br></p>" ? (
                              <small
                                className="errormsg"
                                style={{ bottom: "-13px" }}
                              >
                                {errors.Description}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={roleID == 6 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Notes"
                            : nextlevelvalue == "20"
                            ? "Delegate Notes"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Notes"
                            : nextlevelvalue == "15"
                            ? "Refer Back Notes"
                            : "Notes"}
                        </label>

                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Notes"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Notes"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Notes"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Notes"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Notes"
                                  : "Notes"
                              }
                              className={errors.Notes ? "error" : ""}
                              value={asignnextLeveldata.Notes}
                            />
                            <span className="sspan"></span>
                            {errors.Notes ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign notes is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate notes is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department notes is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer back notes is required"
                                  : "Notes is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>

                      <div
                        className={roleID == 6 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Comments"
                            : nextlevelvalue == "20"
                            ? "Delegate Comments"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Comments"
                            : nextlevelvalue == "15"
                            ? "Refer Back Comments"
                            : "Comments"}
                        </label>

                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Comment"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Comments"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Comments"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Comments"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Comments"
                                  : "Comments"
                              }
                              className={errors.Comment ? "error" : ""}
                              value={asignnextLeveldata.Comment}
                            />
                            <span className="sspan"></span>
                            {errors.Comment ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign comments is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate comments is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department comments is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer back comments is required"
                                  : "Comments is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new align-items-center">
                        <label className="controlform">CC To</label>
                        <div className=" cccto">
                          <div className="flex justify-content-center multiSelect">
                            <MultiSelect
                              value={selectedBanks}
                              onChange={(e) => setSelectedBanks(e.value)}
                              options={vOption}
                              onShow={onShow}
                              optionLabel="name"
                              placeholder="Select Banks"
                              display="chip"
                              className="w-full md:w-20rem"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          (roleID == 6 && nextlevelvalue == "") ||
                          recomdAnalyst == "121"
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Decision</label>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="srcoloration-Approvedvedsr"
                                value="10"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                  GetRoleHandle(10);
                                }}
                                name="applicationstaussr"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "10" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Approvedvedsr"
                                className="hidden-toggles__label"
                              >
                                Approved
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Rejected"
                                value="30"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstaussr"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "30" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Rejected"
                                className="hidden-toggles__label"
                              >
                                Rejected
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Deferred"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstaussr"
                                value="40"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "40" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Deferred"
                                className="hidden-toggles__label"
                              >
                                Deferred
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Cancelled"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstaussr"
                                value="25"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "25" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Cancelled"
                                className="hidden-toggles__label"
                              >
                                Cancelled
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 6
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Is Return Needed?</label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="YesIsReturnsr"
                            name="IsReturnsr"
                            onChange={(e) => HandleIsReturnOption(e)}
                            className="hidden-toggles__input"
                            checked={IsReturn == "1"}
                            value="1"
                          />
                          <label
                            for={IsReturn == "1" ? "" : "YesIsReturnsr"}
                            className="hidden-toggles__label"
                            id={IsReturn}
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="IsReturnsr"
                            id="NoIsReturnsr"
                            className="hidden-toggles__input"
                            onChange={(e) => HandleIsReturnOption(e)}
                            value="0"
                            checked={IsReturn == "0"}
                          />
                          <label
                            for="NoIsReturnsr"
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 6 && IsReturnOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Return Frequency
                            </label>
                            <div className="form-bx">
                              <label>
                                <select
                                  name="ReturnFrequency"
                                  onChange={(e) => SelectReturnFrequency(e)}
                                >
                                  <option value="0" defaultChecked>
                                    Select Frequency
                                  </option>
                                  {AllFrequency?.map((item, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item.id}
                                        selected={
                                          getFrequencyID == item.id &&
                                          getFrequencyID != ""
                                            ? true
                                            : false
                                        }
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 6 &&
                              IsReturn == "1" &&
                              getFrequencyID == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Frequency Date
                            </label>
                            <div className="form-bx-sm">
                              <DatePicker
                                ref={FrequencyDateRef}
                                placeholderText="Select Frequency Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={IsReturnExpiringDate}
                                onChange={(date) =>
                                  setIsReturnExpiringDate(date)
                                }
                                peekNextMonth
                                showMonthDropdown
                                maxDate={new Date("03-31-2027")}
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
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
                              {errors.IsReturnExpiringDate &&
                              (IsReturnExpiringDate ==
                                "Select Frequency Date " ||
                                IsReturnExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.IsReturnExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 6
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">
                          Is Expiry Required ?
                        </label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="exprqsr"
                            name="dateexpitysr"
                            onChange={(e) => HandleDateExpiryOption(e)}
                            className="hidden-toggles__input"
                            checked={defaultnoExpiry == "1"}
                            value="1"
                          />
                          <label
                            for={defaultnoExpiry == "1" ? "" : "exprqsr"}
                            className="hidden-toggles__label"
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="dateexpitysr"
                            id="noexpsr"
                            className="hidden-toggles__input"
                            onChange={(e) => {
                              HandleDateExpiryOption(e);
                              setExpiringDate(null);
                            }}
                            value="0"
                            checked={defaultnoExpiry == "0"}
                          />
                          <label
                            for={defaultnoExpiry == "0" ? "" : "noexpsr"}
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 6 && DateExpiryOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Define Expiry Date
                            </label>

                            <div
                              className={
                                DateExpiryOption == "1"
                                  ? "hidden-toggles"
                                  : "d-none"
                              }
                            >
                              <input
                                type="radio"
                                ref={dateExpirydisplayRef}
                                id="defineddatesr"
                                className="hidden-toggles__input"
                                name="dateExpirydisplaysr"
                                onChange={(e) =>
                                  setDateExpirydisplay(e.target.value)
                                }
                                value="0"
                                checked={
                                  DateExpirydisplay != "" &&
                                  DateExpirydisplay == "0" &&
                                  DateExpiryOption == "1"
                                }
                              />{" "}
                              <label
                                for="defineddatesr"
                                className="hidden-toggles__label"
                              >
                                Specific Date
                              </label>
                              <input
                                type="radio"
                                ref={optionExpirydisplayRef}
                                id="rerpetualdatesr"
                                name="dateExpirydisplaysr"
                                onChange={(e) => {
                                  setDateExpirydisplay(e.target.value);
                                  setExpiringDate(null);
                                }}
                                className="hidden-toggles__input"
                                value="1"
                                checked={
                                  DateExpirydisplay == "1" &&
                                  DateExpiryOption == "1"
                                }
                              />
                              <label
                                for="rerpetualdatesr"
                                className="hidden-toggles__label"
                              >
                                Perpetual
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 6 &&
                              DateExpirydisplay == "0" &&
                              DateExpiryOption == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Expiry Date
                            </label>
                            <div className="form-bx-sm">
                              <DatePicker
                                placeholderText="Select Expiry Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={ExpiringDate}
                                onChange={(date) => setExpiringDate(date)}
                                peekNextMonth
                                showMonthDropdown
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
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
                              {errors.ExpiringDate &&
                              (ExpiringDate == "Select Expiring Date " ||
                                ExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.ExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {allcomment?.map((cur) => {
                      return cur?.applicationActivityData
                        ?.slice()
                        ?.reverse()
                        .map((item, index) => {
                          if (cur?.assignedToRoleID == 6) {
                            return (
                              <>
                                <div
                                  key={index}
                                  className={
                                    index == 0 && roleID != 6
                                      ? "tab-pane fade show active"
                                      : "tab-pane fade show  "
                                  }
                                  id={"sranalystab-justified-home" + index}
                                  role="tabpanel"
                                  aria-labelledby={"sranalystab" + index}
                                >
                                  <div className="bakgroundaction">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Action Type
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.actionStatusName ==
                                                    "Approved" ||
                                                  item?.actionStatusName ==
                                                    "Reject" ||
                                                  item?.actionStatusName ==
                                                    "Cancelled"
                                                    ? "Assigned" ||
                                                      item?.actionStatusName ==
                                                        "Draft"
                                                    : item?.actionStatusName
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            User{" "}
                                            <i
                                              className="bi bi-info-circle icons-info"
                                              title={`Role : ${item?.actionRoleName}`}
                                            ></i>
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={item?.actionUserName}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            {item?.actionStatusName ==
                                              "Approved" ||
                                            item?.actionStatusName ==
                                              "Reject" ||
                                            item?.actionStatusName ==
                                              "Cancelled"
                                              ? "Assigned"
                                              : item?.actionStatusName}{" "}
                                            Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  item?.createdDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionNotes
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Note
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={item?.actionNotes}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionComment
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Comment
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={item?.actionComment}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Senior Analyst Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          name="Notes"
                                          className=""
                                          disabled
                                          value={
                                            applicationDetail?.analystRecommendationName
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new">
                                    <label className="controlform">
                                      Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: item?.description
                                              ? item?.description
                                              : "N/A",
                                          }}
                                          disabled
                                          className="disabled viewdiscription"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          disabled
                                        >
                                          {item?.notes ? item?.notes : "N/A"}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Comments
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          disabled
                                        >
                                          {item?.comment
                                            ? item?.comment
                                            : "N/A"}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Attachments
                                    </label>
                                    <div className="form-bx">
                                      {item?.filesData?.length ? (
                                        item?.filesData?.map((items, index) => {
                                          return (
                                            <div
                                              className="attachemt_form-bx mb-0 width-80"
                                              key={items.id}
                                            >
                                              <label className="mb-2 mb-0 pt-2 pb-2">
                                                {items?.fileName
                                                  ? items?.fileName
                                                  : `FileUpload ${index}`}
                                              </label>
                                              <div
                                                className={
                                                  roleID == 2 || roleID == 3
                                                    ? "browse-btn"
                                                    : "d-none"
                                                }
                                              >
                                                Browse{" "}
                                                <input
                                                  type="file"
                                                  onChange={(e) =>
                                                    handleFileChange(
                                                      e,
                                                      items?.id
                                                    )
                                                  }
                                                />
                                              </div>
                                              <span className="filename">
                                                <Link
                                                  to={items?.filePath}
                                                  target="_blank"
                                                  className="viewbtn"
                                                >
                                                  View File
                                                </Link>
                                              </span>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <label className="notfound">
                                          File Not Found
                                        </label>
                                      )}
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul className="nalist">
                                          {item?.copiedResponseData?.length ? (
                                            item?.copiedResponseData?.map(
                                              (res) => {
                                                return <li>{res?.bankName}</li>;
                                              }
                                            )
                                          ) : (
                                            <li className="disabletext">N/A</li>
                                          )}
                                        </ul>
                                      </label>
                                    </div>
                                  </div>

                                  <div class="row">
                                    <div class="col-md-12">
                                      <div class="inner_form_new ">
                                        <label class="controlform">
                                          Action
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              class=""
                                              disabled
                                              value={
                                                item?.assignedAction ==
                                                  "Approved" ||
                                                item?.assignedAction ==
                                                  "Reject" ||
                                                item?.assignedAction ==
                                                  "Cancelled"
                                                  ? "Assigned"
                                                  : item?.assignedAction
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.isReturnNeeded == 0 ||
                                            item?.isReturnNeeded == null
                                              ? "No"
                                              : item?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {item?.isReturnNeeded == 1 &&
                                  item?.returnFrequencyType == 1 &&
                                  item?.returnFrequencyName == "Once" ? (
                                    <div className="row">
                                      <div className="col-md-7">
                                        <div className="inner_form_new align-item-center">
                                          <label className="controlform">
                                            Return Frequency
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnFrequencyName
                                                    ? item?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-5">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnDate ||
                                                  !item?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        item?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : item.isReturnNeeded == 1 &&
                                    item?.returnFrequencyType !== 1 ? (
                                    <div className="col-md-12">
                                      <div className="inner_form_new align-item-center">
                                        <label className="controlform">
                                          Return Frequency
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.returnFrequencyName
                                                  ? item?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Define Expiry Date
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.expiringDate
                                              ? moment(
                                                  item?.expiringDate
                                                ).format("DD/MMM/YYYY")
                                              : "N/A"
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div
                                    className={
                                      item?.assignedToName == null &&
                                      item?.assignedToName == null
                                        ? "d-none"
                                        : "row"
                                    }
                                  >
                                    <div className="col-md-6">
                                      <div className="inner_form_new ">
                                        <label className="controlform">
                                          Assigned To Role
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.roleName
                                                  ? item?.roleName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="inner_form_new-sm ">
                                        <label className="controlform-sm">
                                          Assigned To User
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.assignedToName
                                                  ? item?.assignedToName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        });
                    })}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {roleID >= 4 ? (
              <>
                <h5
                  className={
                    principalanalystTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setprincipalanalystTab(!principalanalystTab)}
                >
                  Principal Analyst{" "}
                  {responceCount?.map((item, i) => {
                    if (item?.id == 7)
                      return (
                        <>
                          {item?.count == 0 ? (
                            ""
                          ) : (
                            <span className="counter-tab">{item?.count}</span>
                          )}
                        </>
                      );
                  })}
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>

                <div className={principalanalystTab ? "customtab" : "d-none"}>
                  {allcomment?.map((cur, i) => {
                    if (cur.assignedToRoleID == 7) {
                      return (
                        <ul
                          className={
                            cur?.applicationActivityData?.length >= 1
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          <li
                            className={roleID == 7 ? "nav-item" : "d-none"}
                            role="presentation"
                          >
                            <button
                              className={
                                roleID == 7
                                  ? "nav-link w-100 border-radius0 active"
                                  : "nav-link w-100 border-radius0"
                              }
                              id="pranalyst"
                              data-bs-toggle="tab"
                              data-bs-target="#pranalyst-justified-home"
                              type="button"
                              role="tab"
                              aria-controls="home"
                              aria-selected="true"
                            >
                              Action
                            </button>
                          </li>

                          {cur?.applicationActivityData
                            ?.slice()
                            ?.reverse()
                            .map((items, index) => {
                              return (
                                <li className="nav-item" role="presentation">
                                  <button
                                    className={
                                      index == 0 && roleID != 7
                                        ? "nav-link w-100 border-radius0 active"
                                        : "nav-link border-radius0 w-100 "
                                    }
                                    id={"pranalyst" + index}
                                    data-bs-toggle="tab"
                                    data-bs-target={
                                      "#pranalyst-justified-home" + index
                                    }
                                    type="button"
                                    role="tab"
                                    aria-controls="home"
                                    aria-selected="true"
                                  >
                                    Response{" "}
                                    {cur?.applicationActivityData?.length -
                                      index}
                                  </button>
                                </li>
                              );
                            })}
                        </ul>
                      );
                    }
                  })}
                  {noDataComment?.map((data, i) => {
                    if (data.roleID == 7 && data.isDataAvailable == 0) {
                      return (
                        <div
                          className={
                            principalanalystTab && roleID != 7
                              ? "customtab"
                              : "d-none"
                          }
                          key={i}
                        >
                          <div className="text-center">No Data Found</div>
                        </div>
                      );
                    }
                  })}

                  <div className="tab-content pt-2">
                    <div
                      className={
                        roleID == 7
                          ? "tab-pane fade show active"
                          : "tab-pane fade show "
                      }
                      id="pranalyst-justified-home"
                      role="tabpanel"
                      aria-labelledby="pranalyst"
                    >
                      {Actiondata?.map((cur) => {
                        const firstItem = cur?.applicationActivityData?.[0];
                        if (cur?.assignedToRoleID === 7 && firstItem) {
                          return (
                            <div className="bakgroundaction">
                              <div key={firstItem.actionID}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Action Type
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              firstItem?.actionStatusName ==
                                                "Approved" ||
                                              firstItem?.actionStatusName ==
                                                "Reject" ||
                                              firstItem?.actionStatusName ==
                                                "Cancelled" ||
                                              firstItem?.actionStatusName ==
                                                "Draft"
                                                ? "Assigned"
                                                : firstItem?.actionStatusName
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        User{" "}
                                        <i
                                          className="bi bi-info-circle icons-info"
                                          title={`Role : ${firstItem?.actionRoleName}`}
                                        ></i>
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={firstItem?.actionUserName}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        {firstItem?.actionStatusName ==
                                          "Approved" ||
                                        firstItem?.actionStatusName ==
                                          "Reject" ||
                                        firstItem?.actionStatusName ==
                                          "Cancelled"
                                          ? "Assigned"
                                          : firstItem?.actionStatusName}{" "}
                                        Date
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              firstItem?.createdDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionNotes
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Note
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      {" "}
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionNotes}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionComment
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Comment
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      {" "}
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionComment}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}

                      <div
                        className={
                          roleID == 7
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Next Action</label>
                        <div className="row">
                          <div className="col-md-12 my-2">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="prcoloration-recomndByAnalyst"
                                onClick={() => {
                                  setRecomdAnalyst("121");
                                  setnextlevelvalue("");
                                  setAssignUserID("");
                                  setSupervisorRoleId("");
                                  setAsignUser([]);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactionprincipal"
                                className={
                                  applicationDetail?.analystRecommendation ==
                                    "" ||
                                  applicationDetail?.analystRecommendation ==
                                    "0"
                                    ? "d-none"
                                    : "hidden-toggles__input"
                                }
                                value="121"
                                checked={recomdAnalyst == "121" ? true : false}
                              />
                              <label
                                for="prcoloration-recomndByAnalyst"
                                className={
                                  applicationDetail?.analystRecommendation ==
                                    "" ||
                                  applicationDetail?.analystRecommendation ==
                                    "0"
                                    ? "d-none"
                                    : "hidden-toggles__label"
                                }
                              >
                                As Recommended by Analyst
                              </label>

                              <input
                                type="radio"
                                id="prasignto"
                                onChange={(e) => {
                                  setcheckSupervisor(true);
                                  supervisorHangechangeRole(e);
                                  ChangeNextlevelHandle(e);
                                  GetRoleHandle(10);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                onClick={() => setRecomdAnalyst("")}
                                name="nextactionprincipal"
                                className="hidden-toggles__input"
                                value="10"
                              />
                              <label
                                for="prasignto"
                                className="hidden-toggles__label"
                              >
                                Assign
                              </label>

                              <input
                                type="radio"
                                id="prcoloration-Refer"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(15);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                onClick={() => setRecomdAnalyst("")}
                                name="nextactionprincipal"
                                value="15"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="prcoloration-Refer"
                                className="hidden-toggles__label"
                              >
                                Refer Back
                              </label>

                              <input
                                type="radio"
                                id="prcoloration-Delegation"
                                onClick={() => setRecomdAnalyst("")}
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(20);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactionprincipal"
                                value="20"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="prcoloration-Delegation"
                                className="hidden-toggles__label"
                              >
                                Delegate
                              </label>

                              <input
                                type="radio"
                                id="prcoloration-Department"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(35);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactionprincipal"
                                onClick={() => setRecomdAnalyst("")}
                                value="35"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="srcoloration-Department"
                                className="hidden-toggles__label"
                              >
                                Referred to Other Department
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={checkSupervisor == true ? "row" : "d-none"}
                      >
                        <div className="col-md-12 d-flex c-gap">
                          <div
                            className={nextlevelvalue == 15 ? "w-50" : "d-none"}
                          >
                            {checkSupervisor == true &&
                            roleID == 7 &&
                            recomdAnalyst != "121" ? (
                              <>
                                <div className="inner_form_new">
                                  <label className="controlform">Role</label>

                                  <div className="form-bx">
                                    <label>
                                      <select
                                        ref={assignedToRef}
                                        name="SupervisorRoleId"
                                        onChange={(e) => {
                                          supervisorHangechangeRole(e);
                                          handleUserRole(e);
                                        }}
                                        className={
                                          errors.assignedTo && !SupervisorRoleId
                                            ? "error"
                                            : ""
                                        }
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
                                      {errors.assignedTo &&
                                      !SupervisorRoleId ? (
                                        <small className="errormsg">
                                          Role is required{" "}
                                        </small>
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
                          </div>

                          <div
                            className={nextlevelvalue == 15 ? "w-50" : "w-100"}
                          >
                            {roleID == 7 && recomdAnalyst != "121" ? (
                              <>
                                <div className="inner_form_new">
                                  <label className="controlform">User</label>

                                  <div className="form-bx">
                                    <label>
                                      <select
                                        ref={assignedToRef}
                                        name="AssignUserID"
                                        onChange={(e) =>
                                          supervisorHangechange(e)
                                        }
                                        className={
                                          errors.assignUserID && !AssignUserID
                                            ? "error"
                                            : ""
                                        }
                                      >
                                        <option value="">Select User</option>
                                        {asignUser?.map((item, index) => {
                                          return (
                                            <option
                                              key={index}
                                              value={item.userID}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        })}
                                      </select>
                                      <span className="sspan"></span>
                                      {errors.assignUserID && !AssignUserID ? (
                                        <small className="errormsg">
                                          {errors.assignUserID}
                                        </small>
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
                          </div>
                        </div>
                      </div>

                      {attachmentData?.map((items, index) => {
                        return (
                          <div
                            className="attachemt_form-bx  mt-2"
                            key={items.id}
                          >
                            <label
                              style={{
                                background: "#d9edf7",
                                padding: "9px 3px",
                                border: "0px",
                              }}
                            >
                              <span style={{ fontWeight: "500" }}>
                                {items.filename}
                              </span>
                            </label>
                            <div className="browse-btn">
                              Browse
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleuserFileChange(e, "analyst" + index)
                                }
                              />
                            </div>
                            <span className="filename">
                              {userfiles?.find(
                                (f) => f.id === "analyst" + index
                              )?.file?.name || "No file chosen"}
                            </span>
                            {userfiles?.length &&
                            userfiles?.find((f) => f.id === "analyst" + index)
                              ?.file?.name ? (
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() =>
                                  removeUserImage(index, "analyst" + index)
                                }
                              >
                                Remove
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}

                      {otheruserfiles?.map((file, index) => (
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
                             
                              Other File
                              {index + 1}
                            
                          </label>
                          <div className="browse-btn">
                            Browse{" "}
                            <input
                              type="file"
                              onChange={(e) => {
                                handleuserFileChange(e, "other" + index);
                                handleOthrefile(e, `other ${index}`);
                              }}
                            />
                          </div>
                          <span className="filename">
                            {userfiles?.find((f) => f.id === "other" + index)
                              ?.file?.name || "No file chosen"}
                          </span>

                          {userfiles?.length &&
                          userfiles?.find((f) => f.id === "other" + index)?.file
                            ?.name ? (
                            <button
                              type="button"
                              className="remove-file"
                              onClick={() =>
                                removeUserImage(index, "other" + index)
                              }
                            >
                              Remove
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}

                      {otheruserfiles?.length || userfiles?.length ? (
                        <div className="attachemt_form-bx">
                          <label style={{ border: "0px" }}>{""}</label>
                          <button
                            type="button"
                            className="addmore-btn mt-0"
                            onClick={(e) => handleuserAddMore(e)}
                          >
                            Add More File{" "}
                          </button>
                        </div>
                      ) : (
                        ""
                      )}

                      <div
                        className={
                          roleID == 7
                            ? "inner_form_new align-items-start mt-2"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Recommendation</label>
                        <div className="form-bx">
                          <div className="mt-2 py-1">
                            <SunEditor
                              setContents={
                                Description
                                  ? Description
                                  : applicationDetail?.analystDescription
                              }
                              onChange={(newcomment) =>
                                setDescription(newcomment)
                              }
                              setOptions={{
                                buttonList: [
                                  ["undo", "redo"],
                                  ["font", "fontSize"],
                                  [
                                    "bold",
                                    "underline",
                                    "italic",
                                    "strike",
                                    "subscript",
                                    "superscript",
                                  ],
                                  ["fontColor", "hiliteColor"],
                                  ["align", "list", "lineHeight"],
                                  ["outdent", "indent"],

                                  [
                                    "table",
                                    "horizontalRule",
                                    "link",
                                    "image",
                                    "video",
                                  ],
                                  ["preview", "print"],
                                  ["removeFormat"],
                                ],
                                defaultTag: "div",
                                minHeight: "120px",
                                showPathLabel: false,
                              }}
                            />
                            <span className="sspan"></span>
                            {errors.Description && !Description ? (
                              <small className="errormsg">
                                {errors.Description}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={roleID == 7 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Notes"
                            : nextlevelvalue == "20"
                            ? "Delegate Notes"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Notes"
                            : nextlevelvalue == "15"
                            ? "Refer Back Notes"
                            : "Notes"}
                        </label>

                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Notes"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Notes"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Notes"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Notes"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Notes"
                                  : "Notes"
                              }
                              className={errors.Notes ? "error" : ""}
                              value={asignnextLeveldata.Notes}
                            />
                            <span className="sspan"></span>
                            {errors.Notes ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign notes is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate notes is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department notes is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer back notes is required"
                                  : "Notes is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                      {/* end form-bx  */}

                      <div
                        className={roleID == 7 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Comments"
                            : nextlevelvalue == "20"
                            ? "Delegate Comments"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Comments"
                            : nextlevelvalue == "15"
                            ? "Refer Back Comments"
                            : "Comments"}
                        </label>

                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Comment"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Comments"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Comments"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Comments"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Comments"
                                  : "Comments"
                              }
                              className={errors.Comment ? "error" : ""}
                              value={asignnextLeveldata.Comment}
                            />
                            <span className="sspan"></span>
                            {errors.Comment ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign comments is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate comments is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department comments is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer back comments is required"
                                  : "Comments is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new align-items-center">
                        <label className="controlform">CC To</label>
                        <div className=" cccto">
                          <div className="flex justify-content-center multiSelect">
                            <MultiSelect
                              value={selectedBanks}
                              onChange={(e) => setSelectedBanks(e.value)}
                              options={vOption}
                              onShow={onShow}
                              optionLabel="name"
                              placeholder="Select Banks"
                              display="chip"
                              className="w-full md:w-20rem"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 7
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Is Return Needed?</label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="YesIsReturnpr"
                            name="IsReturnpr"
                            onChange={(e) => HandleIsReturnOption(e)}
                            className="hidden-toggles__input"
                            checked={IsReturn == "1"}
                            value="1"
                          />
                          <label
                            for={IsReturn == "1" ? "" : "YesIsReturnpr"}
                            className="hidden-toggles__label"
                            id={IsReturn}
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="IsReturnpr"
                            id="NoIsReturnpr"
                            className="hidden-toggles__input"
                            onChange={(e) => HandleIsReturnOption(e)}
                            value="0"
                            checked={IsReturn == "0"}
                          />
                          <label
                            for="NoIsReturnpr"
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 7 && IsReturnOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Return Frequency
                            </label>
                            <div className="form-bx">
                              <label>
                                <select
                                  name="ReturnFrequency"
                                  onChange={(e) => SelectReturnFrequency(e)}
                                >
                                  <option value="0" defaultChecked>
                                    Select Frequency
                                  </option>
                                  {AllFrequency?.map((item, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item.id}
                                        selected={
                                          getFrequencyID == item.id &&
                                          getFrequencyID != ""
                                            ? true
                                            : false
                                        }
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 7 &&
                              IsReturn == "1" &&
                              getFrequencyID == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Frequency Date
                            </label>
                            <div className="form-bx-sm">
                              <DatePicker
                                ref={FrequencyDateRef}
                                placeholderText="Select Frequency Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={IsReturnExpiringDate}
                                onChange={(date) =>
                                  setIsReturnExpiringDate(date)
                                }
                                peekNextMonth
                                showMonthDropdown
                                maxDate={new Date("03-31-2027")}
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
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
                              {errors.IsReturnExpiringDate &&
                              (IsReturnExpiringDate ==
                                "Select Frequency Date " ||
                                IsReturnExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.IsReturnExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 7
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">
                          Is Expiry Required ?
                        </label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="exprqprs"
                            name="dateexpityprs"
                            onChange={(e) => HandleDateExpiryOption(e)}
                            className="hidden-toggles__input"
                            checked={defaultnoExpiry == "1"}
                            value="1"
                          />
                          <label
                            for="exprqprs"
                            className="hidden-toggles__label"
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="dateexpityprs"
                            id="noexpprs"
                            className="hidden-toggles__input"
                            onChange={(e) => {
                              HandleDateExpiryOption(e);
                              setExpiringDate(null);
                            }}
                            value="0"
                            checked={defaultnoExpiry == "0"}
                          />
                          <label
                            for="noexpprs"
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 7 && DateExpiryOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Define Expiry Date
                            </label>

                            <div
                              className={
                                DateExpiryOption == "1"
                                  ? "hidden-toggles"
                                  : "d-none"
                              }
                            >
                              <input
                                type="radio"
                                ref={dateExpirydisplayRef}
                                id="defineddatepr"
                                className="hidden-toggles__input"
                                name="dateExpirydisplaypr"
                                onChange={(e) =>
                                  setDateExpirydisplay(e.target.value)
                                }
                                value="0"
                                checked={
                                  DateExpirydisplay != "" &&
                                  DateExpirydisplay == "0" &&
                                  DateExpiryOption == "1"
                                }
                              />{" "}
                              <label
                                for="defineddatepr"
                                className="hidden-toggles__label"
                              >
                                Specific Date
                              </label>
                              <input
                                type="radio"
                                ref={optionExpirydisplayRef}
                                id="rerpetualdatepr"
                                name="dateExpirydisplaypr"
                                onChange={(e) => {
                                  setDateExpirydisplay(e.target.value);
                                  setExpiringDate(null);
                                }}
                                className="hidden-toggles__input"
                                value="1"
                                checked={
                                  DateExpirydisplay == "1" &&
                                  DateExpiryOption == "1"
                                }
                              />
                              <label
                                for="rerpetualdatepr"
                                className="hidden-toggles__label"
                              >
                                Perpetual
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 7 &&
                              DateExpirydisplay == "0" &&
                              DateExpiryOption == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Expiry Date
                            </label>

                            <div className="form-bx-sm">
                              <DatePicker
                                placeholderText="Select Expiry Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={ExpiringDate}
                                onChange={(date) => setExpiringDate(date)}
                                peekNextMonth
                                showMonthDropdown
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
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
                              {errors.ExpiringDate &&
                              (ExpiringDate == "Select Expiring Date " ||
                                ExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.ExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          (roleID == 7 && nextlevelvalue == "") ||
                          recomdAnalyst == "121"
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Decision</label>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="srcoloration-Approvedved3"
                                value="10"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                  GetRoleHandle(10);
                                }}
                                name="applicationstausprs"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "10" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Approvedved3"
                                className="hidden-toggles__label"
                              >
                                Approved
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Rejected"
                                value="30"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstausprs"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "30" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Rejected"
                                className="hidden-toggles__label"
                              >
                                Rejected
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Deferred"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstausprs"
                                value="40"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "40" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Deferred"
                                className="hidden-toggles__label"
                              >
                                Deferred
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Cancelled"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstausprs"
                                value="25"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "25" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Cancelled"
                                className="hidden-toggles__label"
                              >
                                Cancelled
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {allcomment?.map((cur) => {
                      return cur?.applicationActivityData
                        ?.slice()
                        ?.reverse()
                        .map((item, index) => {
                          if (cur?.assignedToRoleID == 7) {
                            return (
                              <>
                                <div
                                  key={index}
                                  className={
                                    index == 0 && roleID != 7
                                      ? "tab-pane fade show active"
                                      : "tab-pane fade show  "
                                  }
                                  id={"pranalyst-justified-home" + index}
                                  role="tabpanel"
                                  aria-labelledby={"pranalyst" + index}
                                >
                                  <div className="bakgroundaction">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Action Type
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.actionStatusName ==
                                                    "Approved" ||
                                                  item?.actionStatusName ==
                                                    "Reject" ||
                                                  item?.actionStatusName ==
                                                    "Cancelled" ||
                                                  item?.actionStatusName ==
                                                    "Draft"
                                                    ? "Assigned"
                                                    : item?.actionStatusName
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            User{" "}
                                            <i
                                              className="bi bi-info-circle icons-info"
                                              title={`Role : ${item?.actionRoleName}`}
                                            ></i>
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={item?.actionUserName}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            {item?.actionStatusName ==
                                              "Approved" ||
                                            item?.actionStatusName ==
                                              "Reject" ||
                                            item?.actionStatusName ==
                                              "Cancelled"
                                              ? "Assigned"
                                              : item?.actionStatusName}{" "}
                                            Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  item?.createdDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionNotes
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Note
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={
                                              item?.actionNotes
                                                ? item?.actionNotes
                                                : "N/A"
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionComment
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Comment
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={item?.actionComment}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Principal Analyst Recommendations
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          name="Notes"
                                          className=""
                                          disabled
                                          value={
                                            applicationDetail?.analystRecommendationName
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new">
                                    <label className="controlform">
                                      Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: item?.description
                                              ? item?.description
                                              : "N/A",
                                          }}
                                          disabled
                                          className="disabled viewdiscription"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          disabled
                                        >
                                          {item?.notes ? item?.notes : "N/A"}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Comments
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Comments"
                                          className=""
                                          disabled
                                        >
                                          {item?.comment
                                            ? item?.comment
                                            : "N/A"}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Attachments
                                    </label>
                                    <div className="form-bx">
                                      {item?.filesData?.length ? (
                                        item?.filesData?.map((items, index) => {
                                          return (
                                            <div
                                              className="attachemt_form-bx mb-0 width-80"
                                              key={items.id}
                                            >
                                              <label className="mb-2 mb-0 pt-2 pb-2">
                                                {items?.fileName
                                                  ? items?.fileName
                                                  : `FileUpload ${index}`}
                                              </label>
                                              <div
                                                className={
                                                  roleID == 2 || roleID == 3
                                                    ? "browse-btn"
                                                    : "d-none"
                                                }
                                              >
                                                Browse{" "}
                                                <input
                                                  type="file"
                                                  onChange={(e) =>
                                                    handleFileChange(
                                                      e,
                                                      items.id
                                                    )
                                                  }
                                                />
                                              </div>
                                              <span className="filename">
                                                <Link
                                                  to={items?.filePath}
                                                  target="_blank"
                                                  className="viewbtn"
                                                >
                                                  View File
                                                </Link>
                                              </span>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <label className="notfound">
                                          File Not Found
                                        </label>
                                      )}
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul className="nalist">
                                          {item?.copiedResponseData?.length ? (
                                            item?.copiedResponseData?.map(
                                              (res) => {
                                                return <li>{res?.bankName}</li>;
                                              }
                                            )
                                          ) : (
                                            <li className="disabletext">N/A</li>
                                          )}
                                        </ul>
                                      </label>
                                    </div>
                                  </div>
                                  <div class="row">
                                    <div class="col-md-12">
                                      <div class="inner_form_new ">
                                        <label class="controlform">
                                          Action
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              class=""
                                              disabled
                                              value={
                                                item?.assignedAction ==
                                                  "Approved" ||
                                                item?.assignedAction ==
                                                  "Reject" ||
                                                item?.assignedAction ==
                                                  "Cancelled"
                                                  ? "Assigned"
                                                  : item?.assignedAction
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.isReturnNeeded == 0 ||
                                            item?.isReturnNeeded == null
                                              ? "No"
                                              : item?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {item.isReturnNeeded == 1 &&
                                  item?.returnFrequencyType == 1 &&
                                  item?.returnFrequencyName == "Once" ? (
                                    <div className="row">
                                      <div className="col-md-7">
                                        <div className="inner_form_new align-item-center">
                                          <label className="controlform">
                                            Return Frequency
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnFrequencyName
                                                    ? item?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-5">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnDate ||
                                                  !item?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        item?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : item.isReturnNeeded == 1 &&
                                    item?.returnFrequencyType !== 1 ? (
                                    <div className="col-md-12">
                                      <div className="inner_form_new align-item-center">
                                        <label className="controlform">
                                          Return Frequency
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.returnFrequencyName
                                                  ? item?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Define Expiry Date
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.expiringDate
                                              ? moment(
                                                  item?.expiringDate
                                                ).format("DD/MMM/YYYY")
                                              : "N/A"
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div
                                    className={
                                      item?.assignedToName == null &&
                                      item?.assignedToName == null
                                        ? "d-none"
                                        : "row"
                                    }
                                  >
                                    <div className="col-md-6">
                                      <div className="inner_form_new ">
                                        <label className="controlform">
                                          Assigned To Role
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.roleName
                                                  ? item?.roleName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="inner_form_new-sm ">
                                        <label className="controlform-sm">
                                          Assigned To User
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.assignedToName
                                                  ? item?.assignedToName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        });
                    })}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {roleID >= 4 ? (
              <>
                <h5
                  className={
                    deputyTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setdeputyTab(!deputyTab)}
                >
                  Deputy Director{" "}
                  {responceCount?.map((item, i) => {
                    if (item?.id == 8)
                      return (
                        <>
                          {item?.count == 0 ? (
                            ""
                          ) : (
                            <span className="counter-tab">{item?.count}</span>
                          )}
                        </>
                      );
                  })}
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>

                <div className={deputyTab ? "customtab" : "d-none"}>
                  {allcomment?.map((cur, i) => {
                    if (cur.assignedToRoleID == 8) {
                      return (
                        <ul
                          className={
                            cur?.applicationActivityData?.length >= 1
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          <li
                            className={roleID == 8 ? "nav-item" : "d-none"}
                            role="presentation"
                          >
                            <button
                              className={
                                roleID == 8
                                  ? "nav-link w-100 border-radius0 active"
                                  : "nav-link w-100 border-radius0"
                              }
                              id="deputy"
                              data-bs-toggle="tab"
                              data-bs-target="#deputy-justified-home"
                              type="button"
                              role="tab"
                              aria-controls="home"
                              aria-selected="true"
                            >
                              Action
                            </button>
                          </li>

                          {cur?.applicationActivityData
                            ?.slice()
                            ?.reverse()
                            .map((items, index) => {
                              return (
                                <li className="nav-item" role="presentation">
                                  <button
                                    className={
                                      index == 0 && roleID != 8
                                        ? "nav-link w-100 border-radius0 active"
                                        : "nav-link border-radius0 w-100 "
                                    }
                                    id={"deputy" + index}
                                    data-bs-toggle="tab"
                                    data-bs-target={
                                      "#deputy-justified-home" + index
                                    }
                                    type="button"
                                    role="tab"
                                    aria-controls="home"
                                    aria-selected="true"
                                  >
                                    Response{" "}
                                    {cur?.applicationActivityData?.length -
                                      index}
                                  </button>
                                </li>
                              );
                            })}
                        </ul>
                      );
                    }
                  })}
                  {noDataComment?.map((data, i) => {
                    if (data.roleID == 8 && data.isDataAvailable == 0) {
                      return (
                        <div
                          className={
                            deputyTab && roleID != 8 ? "customtab" : "d-none"
                          }
                          key={i}
                        >
                          <div className="text-center">No Data Found</div>
                        </div>
                      );
                    }
                  })}
                  <div className="tab-content pt-2">
                    <div
                      className={
                        roleID == 8
                          ? "tab-pane fade show active"
                          : "tab-pane fade show "
                      }
                      id="deputy-justified-home"
                      role="tabpanel"
                      aria-labelledby="deputy"
                    >
                      {Actiondata?.map((cur) => {
                        const firstItem = cur?.applicationActivityData?.[0];
                        if (cur?.assignedToRoleID === 8 && firstItem) {
                          return (
                            <div className="bakgroundaction">
                              <div key={firstItem.actionID}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Action Type
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              firstItem?.actionStatusName ==
                                                "Approved" ||
                                              firstItem?.actionStatusName ==
                                                "Reject" ||
                                              firstItem?.actionStatusName ==
                                                "Cancelled" ||
                                              firstItem?.actionStatusName ==
                                                "Draft"
                                                ? "Assigned"
                                                : firstItem?.actionStatusName
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        User{" "}
                                        <i
                                          className="bi bi-info-circle icons-info"
                                          title={`Role : ${firstItem?.actionRoleName}`}
                                        ></i>
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={firstItem?.actionUserName}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        {firstItem?.actionStatusName ==
                                          "Approved" ||
                                        firstItem?.actionStatusName ==
                                          "Reject" ||
                                        firstItem?.actionStatusName ==
                                          "Cancelled"
                                          ? "Assigned"
                                          : firstItem?.actionStatusName}{" "}
                                        Date
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              firstItem?.createdDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionNotes
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Note
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionNotes}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionComment
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Comment
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionComment}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}

                      <div
                        className={
                          roleID == 8
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Next Action</label>
                        <div className="row">
                          <div className="col-md-12 my-2">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="deptyrecomndByAnalyst"
                                onClick={() => {
                                  setRecomdAnalyst("121");
                                  setnextlevelvalue("");
                                  setAssignUserID("");
                                  setSupervisorRoleId("");
                                  setAsignUser([]);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactiondupty"
                                className={
                                  applicationDetail?.analystRecommendation ==
                                    "" ||
                                  applicationDetail?.analystRecommendation ==
                                    "0"
                                    ? "d-none"
                                    : "hidden-toggles__input"
                                }
                                value="121"
                                checked={recomdAnalyst == "121" ? true : false}
                              />
                              <label
                                for="deptyrecomndByAnalyst"
                                className={
                                  applicationDetail?.analystRecommendation ==
                                    "" ||
                                  applicationDetail?.analystRecommendation ==
                                    "0"
                                    ? "d-none"
                                    : "hidden-toggles__label"
                                }
                              >
                                As Recommended by Analyst
                              </label>

                              <input
                                type="radio"
                                id="deptyasignto"
                                onChange={(e) => {
                                  setcheckSupervisor(true);
                                  supervisorHangechangeRole(e);
                                  ChangeNextlevelHandle(e);
                                  GetRoleHandle(10);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                onClick={() => setRecomdAnalyst("")}
                                name="nextactiondupty"
                                className="hidden-toggles__input"
                                value="10"
                              />
                              <label
                                for="deptyasignto"
                                className="hidden-toggles__label"
                              >
                                Assign
                              </label>

                              <input
                                type="radio"
                                id="deptyasignto-Refer"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(15);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactiondupty"
                                onClick={() => setRecomdAnalyst("")}
                                value="15"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="deptyasignto-Refer"
                                className="hidden-toggles__label"
                              >
                                Refer Back
                              </label>

                              <input
                                type="radio"
                                id="deptyasignto-Delegation"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(20);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactiondupty"
                                onClick={() => setRecomdAnalyst("")}
                                value="20"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="deptyasignto-Delegation"
                                className="hidden-toggles__label"
                              >
                                Delegate
                              </label>

                              <input
                                type="radio"
                                id="deptyasignto-Department"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(35);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactiondupty"
                                onClick={() => setRecomdAnalyst("")}
                                value="35"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="deptyasignto-Department"
                                className="hidden-toggles__label"
                              >
                                Referred to Other Department
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={checkSupervisor == true ? "row" : "d-none"}
                      >
                        <div className="col-md-12 d-flex c-gap">
                          <div
                            className={nextlevelvalue == 15 ? "w-50" : "d-none"}
                          >
                            {checkSupervisor == true && roleID == 8 ? (
                              <>
                                <div className="inner_form_new">
                                  <label className="controlform">Role</label>

                                  <div className="form-bx">
                                    <label>
                                      <select
                                        ref={assignedToRef}
                                        name="SupervisorRoleId"
                                        onChange={(e) => {
                                          supervisorHangechangeRole(e);
                                          handleUserRole(e);
                                        }}
                                        className={
                                          errors.assignedTo && !SupervisorRoleId
                                            ? "error"
                                            : ""
                                        }
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
                                      {errors.assignedTo &&
                                      !SupervisorRoleId ? (
                                        <small className="errormsg">
                                          Role is required{" "}
                                        </small>
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
                          </div>
                          <div
                            className={nextlevelvalue == 15 ? "w-50" : "w-100"}
                          >
                            {roleID == 8 && recomdAnalyst != "121" ? (
                              <>
                                <div className="inner_form_new">
                                  <label className="controlform">User</label>
                                  <div className="form-bx">
                                    <label>
                                      <select
                                        ref={assignedToRef}
                                        name="AssignUserID"
                                        onChange={(e) =>
                                          supervisorHangechange(e)
                                        }
                                        className={
                                          errors.assignUserID && !AssignUserID
                                            ? "error"
                                            : ""
                                        }
                                      >
                                        <option value="">Select User</option>
                                        {asignUser?.map((item, index) => {
                                          return (
                                            <option
                                              key={index}
                                              value={item.userID}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        })}
                                      </select>
                                      <span className="sspan"></span>
                                      {errors.assignUserID && !AssignUserID ? (
                                        <small className="errormsg">
                                          {errors.assignUserID}
                                        </small>
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
                          </div>
                        </div>
                      </div>

                      {attachmentData?.map((items, index) => {
                        return (
                          <div
                            className="attachemt_form-bx  mt-2"
                            key={items.id}
                          >
                            <label
                              style={{
                                background: "#d9edf7",
                                padding: "9px 3px",
                                border: "0px",
                              }}
                            >
                              <span style={{ fontWeight: "500" }}>
                                {items.filename}dffdfdsd
                              </span>
                            </label>
                            <div className="browse-btn">
                              Browse
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleuserFileChange(e, "analyst" + index)
                                }
                              />
                            </div>
                            <span className="filename">
                              {userfiles?.find(
                                (f) => f.id === "analyst" + index
                              )?.file?.name || "No file chosen"}
                            </span>
                            {userfiles?.length &&
                            userfiles?.find((f) => f.id === "analyst" + index)
                              ?.file?.name ? (
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() =>
                                  removeUserImage(index, "analyst" + index)
                                }
                              >
                                Remove
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}

                      {otheruserfiles?.map((file, index) => (
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
                           
                              Other File
                              {index + 1}
                            
                          </label>
                          <div className="browse-btn">
                            Browse{" "}
                            <input
                              type="file"
                              onChange={(e) => {
                                handleuserFileChange(e, "other" + index);
                              }}
                            />
                          </div>
                          <span className="filename">
                            {userfiles?.find((f) => f.id === "other" + index)
                              ?.file?.name || "No file chosen"}
                          </span>

                          {userfiles?.length &&
                          userfiles?.find((f) => f.id === "other" + index)?.file
                            ?.name ? (
                            <button
                              type="button"
                              className="remove-file"
                              onClick={() =>
                                removeUserImage(index, "other" + index)
                              }
                            >
                              Remove
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}

                      {otheruserfiles?.length || userfiles?.length ? (
                        <div className="attachemt_form-bx">
                          <label style={{ border: "0px" }}>{""}</label>
                          <button
                            type="button"
                            className="addmore-btn mt-0"
                            onClick={(e) => handleuserAddMore(e)}
                          >
                            Add More File{" "}
                          </button>
                        </div>
                      ) : (
                        ""
                      )}

                      <div
                        className={roleID == 8 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">Recommendation</label>
                        <div className="form-bx">
                          <div className="mt-2 py-1">
                            <SunEditor
                              setContents={
                                Description
                                  ? Description
                                  : applicationDetail?.analystDescription
                              }
                              onChange={(newcomment) =>
                                setDescription(newcomment)
                              }
                              setOptions={{
                                buttonList: [
                                  ["undo", "redo"],
                                  ["font", "fontSize"],
                                  [
                                    "bold",
                                    "underline",
                                    "italic",
                                    "strike",
                                    "subscript",
                                    "superscript",
                                  ],
                                  ["fontColor", "hiliteColor"],
                                  ["align", "list", "lineHeight"],
                                  ["outdent", "indent"],

                                  [
                                    "table",
                                    "horizontalRule",
                                    "link",
                                    "image",
                                    "video",
                                  ],
                                  ["preview", "print"],
                                  ["removeFormat"],
                                ],
                                defaultTag: "div",
                                minHeight: "120px",
                                showPathLabel: false,
                              }}
                            />
                            <span className="sspan"></span>
                            {errors.Description && !Description ? (
                              <small className="errormsg">
                                {errors.Description}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={roleID == 8 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Notes"
                            : nextlevelvalue == "20"
                            ? "Delegate Notes"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Notes"
                            : nextlevelvalue == "15"
                            ? "Refer Back Notes"
                            : "Notes"}
                        </label>

                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Notes"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Notes"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Notes"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Notes"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Notes"
                                  : "Notes"
                              }
                              className={errors.Notes ? "error" : ""}
                              value={asignnextLeveldata.Notes}
                            />
                            <span className="sspan"></span>
                            {errors.Notes ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign notes is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate notes is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department notes is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer back notes is required"
                                  : "Notes is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                      {/* end form-bx  */}

                      <div
                        className={roleID == 8 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Comments"
                            : nextlevelvalue == "20"
                            ? "Delegate Comments"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Comments"
                            : nextlevelvalue == "15"
                            ? "Refer Back Comments"
                            : "Comments"}
                        </label>

                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Comment"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Comments"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Comments"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Comments"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Comments"
                                  : "Comments"
                              }
                              className={errors.Comment ? "error" : ""}
                              value={asignnextLeveldata.Comment}
                            />
                            <span className="sspan"></span>
                            {errors.Comment ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign comments is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate comments is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department comments is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer back comments is required"
                                  : "Comments is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new align-items-center">
                        <label className="controlform">CC To</label>
                        <div className=" cccto">
                          <div className="flex justify-content-center multiSelect">
                            <MultiSelect
                              value={selectedBanks}
                              onChange={(e) => setSelectedBanks(e.value)}
                              options={vOption}
                              onShow={onShow}
                              optionLabel="name"
                              placeholder="Select Banks"
                              display="chip"
                              className="w-full md:w-20rem"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 8
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Is Return Needed?</label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="YesIsReturndpd"
                            name="IsReturnpd"
                            onChange={(e) => HandleIsReturnOption(e)}
                            className="hidden-toggles__input"
                            checked={IsReturn == "1"}
                            value="1"
                          />
                          <label
                            for="YesIsReturndpd"
                            className="hidden-toggles__label"
                            id={IsReturn}
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="IsReturnpd"
                            id="NoIsReturndpd"
                            className="hidden-toggles__input"
                            onChange={(e) => HandleIsReturnOption(e)}
                            value="0"
                            checked={IsReturn == "0"}
                          />
                          <label
                            for={IsReturn == "0" ? "" : "NoIsReturndpd"}
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 8 && IsReturnOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Return Frequency
                            </label>
                            <div className="form-bx">
                              <label>
                                <select
                                  name="ReturnFrequency"
                                  onChange={(e) => SelectReturnFrequency(e)}
                                >
                                  <option value="0" defaultChecked>
                                    Select Frequency
                                  </option>
                                  {AllFrequency?.map((item, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item.id}
                                        selected={
                                          getFrequencyID == item.id &&
                                          getFrequencyID != ""
                                            ? true
                                            : false
                                        }
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 8 &&
                              IsReturn == "1" &&
                              getFrequencyID == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Frequency Date
                            </label>
                            <div className="form-bx-sm">
                              <DatePicker
                                ref={FrequencyDateRef}
                                placeholderText="Select Frequency Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={IsReturnExpiringDate}
                                onChange={(date) =>
                                  setIsReturnExpiringDate(date)
                                }
                                peekNextMonth
                                showMonthDropdown
                                maxDate={new Date("03-31-2027")}
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
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
                              {errors.IsReturnExpiringDate &&
                              (IsReturnExpiringDate ==
                                "Select Frequency Date " ||
                                IsReturnExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.IsReturnExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 8
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">
                          Is Expiry Required ?
                        </label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="exprqdp"
                            name="dateexpitydp"
                            onChange={(e) => HandleDateExpiryOption(e)}
                            className="hidden-toggles__input"
                            checked={defaultnoExpiry == "1"}
                            value="1"
                          />
                          <label
                            for={defaultnoExpiry == "1" ? "" : "exprqdp"}
                            className="hidden-toggles__label"
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="dateexpitydp"
                            id="noexpdp"
                            className="hidden-toggles__input"
                            onChange={(e) => {
                              HandleDateExpiryOption(e);
                              setExpiringDate(null);
                            }}
                            value="0"
                            checked={defaultnoExpiry == "0"}
                          />
                          <label
                            for={defaultnoExpiry == "0" ? "" : "noexpdp"}
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 8 && DateExpiryOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Define Expiry Date
                            </label>

                            <div
                              className={
                                DateExpiryOption == "1"
                                  ? "hidden-toggles"
                                  : "d-none"
                              }
                            >
                              <input
                                type="radio"
                                ref={dateExpirydisplayRef}
                                id="defineddatedp"
                                className="hidden-toggles__input"
                                name="dateExpirydisplaydp"
                                onChange={(e) =>
                                  setDateExpirydisplay(e.target.value)
                                }
                                value="0"
                                checked={
                                  DateExpirydisplay != "" &&
                                  DateExpirydisplay == "0" &&
                                  DateExpiryOption == "1"
                                }
                              />{" "}
                              <label
                                for="defineddatedp"
                                className="hidden-toggles__label"
                              >
                                Specific Date
                              </label>
                              <input
                                type="radio"
                                ref={optionExpirydisplayRef}
                                id="rerpetualdatedp"
                                name="dateExpirydisplaydp"
                                onChange={(e) => {
                                  setDateExpirydisplay(e.target.value);
                                  setExpiringDate(null);
                                }}
                                className="hidden-toggles__input"
                                value="1"
                                checked={
                                  DateExpirydisplay == "1" &&
                                  DateExpiryOption == "1"
                                }
                              />
                              <label
                                for="rerpetualdatedp"
                                className="hidden-toggles__label"
                              >
                                Perpetual
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 8 &&
                              DateExpirydisplay == "0" &&
                              DateExpiryOption == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Expiry Date
                            </label>

                            <div className="form-bx-sm">
                              <DatePicker
                                placeholderText="Select Expiry Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={ExpiringDate}
                                onChange={(date) => setExpiringDate(date)}
                                peekNextMonth
                                showMonthDropdown
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
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
                              {errors.ExpiringDate &&
                              (ExpiringDate == "Select Expiring Date " ||
                                ExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.ExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          (roleID == 8 && nextlevelvalue == "") ||
                          recomdAnalyst == "121"
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Decision</label>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="srcoloration-Approvedved4"
                                value="10"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                  GetRoleHandle(10);
                                }}
                                name="applicationstausdp"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "10" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Approvedved4"
                                className="hidden-toggles__label"
                              >
                                Approved
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Rejected"
                                value="30"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstausdp"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "30" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Rejected"
                                className="hidden-toggles__label"
                              >
                                Rejected
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Deferred"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstausdp"
                                value="40"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "40" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Deferred"
                                className="hidden-toggles__label"
                              >
                                Deferred
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Cancelled"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstausdp"
                                value="25"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "25" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Cancelled"
                                className="hidden-toggles__label"
                              >
                                Cancelled
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {allcomment?.map((cur) => {
                      return cur?.applicationActivityData
                        ?.slice()
                        ?.reverse()
                        .map((item, index) => {
                          if (cur?.assignedToRoleID == 8) {
                            return (
                              <>
                                <div
                                  key={index}
                                  className={
                                    index == 0 && roleID != 8
                                      ? "tab-pane fade show active"
                                      : "tab-pane fade show  "
                                  }
                                  id={"deputy-justified-home" + index}
                                  role="tabpanel"
                                  aria-labelledby={"deputy" + index}
                                >
                                  <div className="bakgroundaction">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Action Type
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.actionStatusName ==
                                                    "Approved" ||
                                                  item?.actionStatusName ==
                                                    "Reject" ||
                                                  item?.actionStatusName ==
                                                    "Cancelled" ||
                                                  item?.actionStatusName ==
                                                    "Draft"
                                                    ? "Assigned"
                                                    : item?.actionStatusName
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            User{" "}
                                            <i
                                              className="bi bi-info-circle icons-info"
                                              title={`Role : ${item?.actionRoleName}`}
                                            ></i>
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={item?.actionUserName}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="col-md-3">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            {item?.actionStatusName ==
                                              "Approved" ||
                                            item?.actionStatusName ==
                                              "Reject" ||
                                            item?.actionStatusName ==
                                              "Cancelled"
                                              ? "Assigned"
                                              : item?.actionStatusName}{" "}
                                            Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  item?.createdDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionNotes
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Note
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={item?.actionNotes}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionComment
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Comment
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={item?.actionComment}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Deputy Director Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          disabled
                                          value={
                                            applicationDetail?.analystRecommendationName
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new">
                                    <label className="controlform">
                                      Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: item?.description
                                              ? item?.description
                                              : "N/A",
                                          }}
                                          disabled
                                          className="disabled viewdiscription"
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          disabled
                                        >
                                          {item?.notes ? item?.notes : "N/A"}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Comments
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          disabled
                                        >
                                          {item?.comment
                                            ? item?.comment
                                            : "N/A"}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Attachments
                                    </label>
                                    <div className="form-bx">
                                      {item?.filesData?.length ? (
                                        item?.filesData?.map((items, index) => {
                                          return (
                                            <div
                                              className="attachemt_form-bx mb-0 width-80"
                                              key={items.id}
                                            >
                                              <label className="mb-2 mb-0 pt-2 pb-2">
                                                {/* {items.filename} */}
                                                {items?.fileName
                                                  ? items?.fileName
                                                  : `FileUpload ${index}`}
                                              </label>
                                              <div
                                                className={
                                                  roleID == 2 || roleID == 3
                                                    ? "browse-btn"
                                                    : "d-none"
                                                }
                                              >
                                                Browse{" "}
                                                <input
                                                  type="file"
                                                  onChange={(e) =>
                                                    handleFileChange(
                                                      e,
                                                      items.id
                                                    )
                                                  }
                                                />
                                              </div>
                                              <span className="filename">
                                                <Link
                                                  to={items?.filePath}
                                                  target="_blank"
                                                  className="viewbtn"
                                                >
                                                  View File
                                                </Link>
                                              </span>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <label className="notfound">
                                          File Not Found
                                        </label>
                                      )}
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul className="nalist">
                                          {item?.copiedResponseData?.length ? (
                                            item?.copiedResponseData?.map(
                                              (res) => {
                                                return <li>{res?.bankName}</li>;
                                              }
                                            )
                                          ) : (
                                            <li className="disabletext">N/A</li>
                                          )}
                                        </ul>
                                      </label>
                                    </div>
                                  </div>

                                  <div class="row">
                                    <div class="col-md-12">
                                      <div class="inner_form_new ">
                                        <label class="controlform">
                                          Action
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              class=""
                                              disabled
                                              value={
                                                item?.assignedAction ==
                                                  "Approved" ||
                                                item?.assignedAction ==
                                                  "Reject" ||
                                                item?.assignedAction ==
                                                  "Cancelled"
                                                  ? "Assigned"
                                                  : item?.assignedAction
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.isReturnNeeded == 0 ||
                                            item?.isReturnNeeded == null
                                              ? "No"
                                              : item?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {item.isReturnNeeded == 1 &&
                                  item?.returnFrequencyType == 1 &&
                                  item?.returnFrequencyName == "Once" ? (
                                    <div className="row">
                                      <div className="col-md-7">
                                        <div className="inner_form_new align-item-center">
                                          <label className="controlform">
                                            Return Frequency
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnFrequencyName
                                                    ? item?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-5">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnDate ||
                                                  !item?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        item?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : item.isReturnNeeded == 1 &&
                                    item?.returnFrequencyType !== 1 ? (
                                    <div className="col-md-12">
                                      <div className="inner_form_new align-item-center">
                                        <label className="controlform">
                                          Return Frequency
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.returnFrequencyName
                                                  ? item?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Define Expiry Date
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.expiringDate
                                              ? moment(
                                                  item?.expiringDate
                                                ).format("DD/MMM/YYYY")
                                              : "N/A"
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      item?.assignedToName == null &&
                                      item?.assignedToName == null
                                        ? "d-none"
                                        : "row"
                                    }
                                  >
                                    <div className="col-md-6">
                                      <div className="inner_form_new ">
                                        <label className="controlform">
                                          Assigned To Role
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.roleName
                                                  ? item?.roleName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="inner_form_new-sm ">
                                        <label className="controlform-sm">
                                          Assigned To User
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.assignedToName
                                                  ? item?.assignedToName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        });
                    })}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {roleID >= 4 ? (
              <>
                <h5
                  className={
                    director
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setdirector(!director)}
                >
                  Director{" "}
                  {responceCount?.map((item, i) => {
                    if (item?.id == 9)
                      return (
                        <>
                          {item?.count == 0 ? (
                            ""
                          ) : (
                            <span className="counter-tab">{item?.count}</span>
                          )}
                        </>
                      );
                  })}
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>

                <div className={director ? "customtab mb-3" : "d-none"}>
                  {allcomment?.map((cur, i) => {
                    if (cur.assignedToRoleID == 9) {
                      return (
                        <ul
                          className={
                            cur?.applicationActivityData?.length >= 1
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          <li
                            className={roleID == 9 ? "nav-item" : "d-none"}
                            role="presentation"
                          >
                            <button
                              className={
                                roleID == 9
                                  ? "nav-link w-100 border-radius0 active"
                                  : "nav-link w-100 border-radius0"
                              }
                              id="director"
                              data-bs-toggle="tab"
                              data-bs-target="#director-justified-home"
                              type="button"
                              role="tab"
                              aria-controls="home"
                              aria-selected="true"
                            >
                              Action
                            </button>
                          </li>

                          {cur?.applicationActivityData
                            ?.slice()
                            ?.reverse()
                            .map((items, index) => {
                              return (
                                <li className="nav-item" role="presentation">
                                  <button
                                    className={
                                      index == 0 && roleID != 9
                                        ? "nav-link w-100 border-radius0 active"
                                        : "nav-link border-radius0 w-100 "
                                    }
                                    id={"director" + index}
                                    data-bs-toggle="tab"
                                    data-bs-target={
                                      "#director-justified-home" + index
                                    }
                                    type="button"
                                    role="tab"
                                    aria-controls="home"
                                    aria-selected="true"
                                  >
                                    Response{" "}
                                    {cur?.applicationActivityData?.length -
                                      index}
                                  </button>
                                </li>
                              );
                            })}
                        </ul>
                      );
                    }
                  })}
                  {noDataComment?.map((data, i) => {
                    if (data.roleID == 9 && data.isDataAvailable == 0) {
                      return (
                        <div
                          className={
                            director && roleID != 9 ? "customtab" : "d-none"
                          }
                          key={i}
                        >
                          <div className="text-center">No Data Found</div>
                        </div>
                      );
                    }
                  })}

                  <div className="tab-content pt-2 mb-2">
                    <div
                      className={
                        roleID == 9
                          ? "tab-pane fade show active"
                          : "tab-pane fade show "
                      }
                      id="director-justified-home"
                      role="tabpanel"
                      aria-labelledby="director"
                    >
                      {Actiondata?.map((cur) => {
                        const firstItem = cur?.applicationActivityData?.[0];
                        if (cur?.assignedToRoleID === 9 && firstItem) {
                          return (
                            <div className="bakgroundaction">
                              <div key={firstItem.actionID}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Action Type
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          {" "}
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              firstItem?.actionStatusName ==
                                                "Approved" ||
                                              firstItem?.actionStatusName ==
                                                "Reject" ||
                                              firstItem?.actionStatusName ==
                                                "Cancelled" ||
                                              firstItem?.actionStatusName ==
                                                "Draft"
                                                ? "Assigned"
                                                : firstItem?.actionStatusName
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        User{" "}
                                        <i
                                          className="bi bi-info-circle icons-info"
                                          title={`Role : ${firstItem?.actionRoleName}`}
                                        ></i>
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={firstItem?.actionUserName}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm">
                                      <label className="controlform-sm">
                                        {firstItem?.actionStatusName ==
                                          "Approved" ||
                                        firstItem?.actionStatusName ==
                                          "Reject" ||
                                        firstItem?.actionStatusName ==
                                          "Cancelled"
                                          ? "Assigned"
                                          : firstItem?.actionStatusName}{" "}
                                        Date
                                      </label>
                                      <div className="form-bx-sm">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              firstItem?.createdDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionNotes
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Note
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionNotes}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div
                                  className={
                                    firstItem?.actionComment
                                      ? "inner_form_new"
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Comment
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <textarea
                                        type="text"
                                        className=""
                                        disabled
                                        value={firstItem?.actionComment}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}

                      <div
                        className={
                          roleID == 9
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Next Action</label>
                        <div className="row">
                          <div className="col-md-12 my-2">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="direcotsrecomndByAnalyst"
                                name="nextactionbuton"
                                onClick={() => {
                                  setRecomdAnalyst("121");
                                  setnextlevelvalue("");
                                  setAssignUserID("");
                                  setSupervisorRoleId("");
                                  setAsignUser([]);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                className={
                                  applicationDetail?.analystRecommendation ==
                                    "" ||
                                  applicationDetail?.analystRecommendation ==
                                    "0"
                                    ? "d-none"
                                    : "hidden-toggles__input"
                                }
                                value="121"
                                checked={recomdAnalyst == "121" ? true : false}
                              />
                              <label
                                for="direcotsrecomndByAnalyst"
                                className={
                                  applicationDetail?.analystRecommendation ==
                                    "" ||
                                  applicationDetail?.analystRecommendation ==
                                    "0"
                                    ? "d-none"
                                    : "hidden-toggles__label"
                                }
                              >
                                As Recommended by Analyst
                              </label>

                              <input
                                type="radio"
                                id="direcotsRefer"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(15);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactionbuton"
                                onClick={() => setRecomdAnalyst("")}
                                value="15"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="direcotsRefer"
                                className="hidden-toggles__label"
                              >
                                Refer Back
                              </label>

                              <input
                                type="radio"
                                id="direcotsDelegation"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(20);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactionbuton"
                                onClick={() => setRecomdAnalyst("")}
                                value="20"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="direcotsDelegation"
                                className="hidden-toggles__label"
                              >
                                Delegate
                              </label>

                              <input
                                type="radio"
                                id="direcotsDepartment"
                                onChange={(e) => {
                                  ChangeNextlevelHandle(e);
                                  supervisorHangechangeRole(e);
                                  setcheckSupervisor(true);
                                  GetRoleHandle(35);
                                  setapplicationstaus(
                                    applicationDetail?.analystRecommendation
                                  );
                                }}
                                name="nextactionbuton"
                                onClick={() => setRecomdAnalyst("")}
                                value="35"
                                className="hidden-toggles__input"
                              />
                              <label
                                for="direcotsDepartment"
                                className="hidden-toggles__label"
                              >
                                Referred to Other Department
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={checkSupervisor == true ? "row" : "d-none"}
                      >
                        <div className="col-md-12 d-flex c-gap">
                          <div
                            className={nextlevelvalue == 15 ? "w-50" : "d-none"}
                          >
                            {checkSupervisor == true && roleID == 9 ? (
                              <>
                                <div className="inner_form_new">
                                  <label className="controlform">Role</label>

                                  <div className="form-bx">
                                    <label>
                                      <select
                                        ref={assignedToRef}
                                        name="SupervisorRoleId"
                                        onChange={(e) => {
                                          supervisorHangechangeRole(e);
                                          handleUserRole(e);
                                        }}
                                        className={
                                          errors.assignedTo && !SupervisorRoleId
                                            ? "error"
                                            : ""
                                        }
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
                                      {errors.assignedTo &&
                                      !SupervisorRoleId ? (
                                        <small className="errormsg">
                                          Role is required{" "}
                                        </small>
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
                          </div>

                          <div
                            className={nextlevelvalue == 15 ? "w-50" : "w-100"}
                          >
                            {roleID == 9 && recomdAnalyst != "121" ? (
                              <>
                                <div className="inner_form_new">
                                  <label className="controlform">User</label>

                                  <div className="form-bx">
                                    <label>
                                      <select
                                        ref={assignedToRef}
                                        name="AssignUserID"
                                        onChange={(e) =>
                                          supervisorHangechange(e)
                                        }
                                        className={
                                          errors.assignUserID && !AssignUserID
                                            ? "error"
                                            : ""
                                        }
                                      >
                                        <option value="">Select User</option>
                                        {asignUser?.map((item, index) => {
                                          return (
                                            <option
                                              key={index}
                                              value={item.userID}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        })}
                                      </select>
                                      <span className="sspan"></span>
                                      {errors.assignUserID && !AssignUserID ? (
                                        <small className="errormsg">
                                          {errors.assignUserID}
                                        </small>
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
                          </div>
                        </div>
                      </div>

                      {attachmentData?.map((items, index) => {
                        return (
                          <div
                            className="attachemt_form-bx  mt-2"
                            key={items.id}
                          >
                            <label
                              style={{
                                background: "#d9edf7",
                                padding: "9px 3px",
                                border: "0px",
                              }}
                            >
                              <span style={{ fontWeight: "500" }}>
                                {items.filename}
                              </span>
                            </label>
                            <div className="browse-btn">
                              Browse
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleuserFileChange(e, "analyst" + index)
                                }
                              />
                            </div>
                            <span className="filename">
                              {userfiles?.find(
                                (f) => f.id === "analyst" + index
                              )?.file?.name || "No file chosen"}
                            </span>
                            {userfiles?.length &&
                            userfiles?.find((f) => f.id === "analyst" + index)
                              ?.file?.name ? (
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() =>
                                  removeUserImage(index, "analyst" + index)
                                }
                              >
                                Remove
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}

                      {otheruserfiles?.map((file, index) => (
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
                            
                              Other File
                              {index + 1}
                            
                          </label>
                          <div className="browse-btn">
                            Browse{" "}
                            <input
                              type="file"
                              onChange={(e) => {
                                handleuserFileChange(e, "other" + index);
                                handleOthrefile(e, `other ${index}`);
                              }}
                            />
                          </div>
                          <span className="filename">
                            {userfiles?.find((f) => f.id === "other" + index)
                              ?.file?.name || "No file chosen"}
                          </span>

                          {userfiles?.length &&
                          userfiles?.find((f) => f.id === "other" + index)?.file
                            ?.name ? (
                            <button
                              type="button"
                              className="remove-file"
                              onClick={() =>
                                removeUserImage(index, "other" + index)
                              }
                            >
                              Remove
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      ))}

                      {otheruserfiles?.length || userfiles?.length ? (
                        <div className="attachemt_form-bx">
                          <label style={{ border: "0px" }}>{""}</label>
                          <button
                            type="button"
                            className="addmore-btn mt-0"
                            onClick={(e) => handleuserAddMore(e)}
                          >
                            {" "}
                            Add More File{" "}
                          </button>
                        </div>
                      ) : (
                        ""
                      )}

                      <div
                        className={
                          roleID == 9
                            ? "inner_form_new align-items-start mt-2"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Recommendation</label>
                        <div className="form-bx">
                          <div className="mt-2 py-1">
                            <ReactQuill
                              theme="snow"
                              value={
                                Description
                                  ? Description
                                  : applicationDetail?.analystDescription
                              }
                              modules={modules}
                              readOnly={false}
                              preserveWhitespace
                              onChange={(newcomment) =>
                                setDescription(newcomment)
                              }
                            />
                            <span className="sspan"></span>
                            {(errors.Description && Description == "") ||
                            Description == "<p><br></p>" ? (
                              <small
                                className="errormsg"
                                style={{ bottom: "-13px" }}
                              >
                                {errors.Description}
                              </small>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={roleID == 9 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Notes"
                            : nextlevelvalue == "20"
                            ? "Delegate Notes"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Notes"
                            : nextlevelvalue == "15"
                            ? "Refer Back Notes"
                            : "Notes"}
                        </label>

                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Notes"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Notes"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Notes"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Notes"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Notes"
                                  : "Notes"
                              }
                              className={errors.Notes ? "error" : ""}
                              value={asignnextLeveldata.Notes}
                            />
                            <span className="sspan"></span>
                            {errors.Notes ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign notes is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate notes is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department notes is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer back notes is required"
                                  : "Notes is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>

                      <div
                        className={roleID == 9 ? "inner_form_new " : "d-none"}
                      >
                        <label className="controlform">
                          {nextlevelvalue == "10"
                            ? "Assign Comments"
                            : nextlevelvalue == "20"
                            ? "Delegate Comments"
                            : nextlevelvalue == "35"
                            ? "Referred to Other Department Comments"
                            : nextlevelvalue == "15"
                            ? "Refer Back Comments"
                            : "Comments"}
                        </label>

                        <div className="form-bx">
                          <label>
                            <textarea
                              name="Comment"
                              onChange={(e) => {
                                HandleNextleveldata(e);
                              }}
                              placeholder={
                                nextlevelvalue == "10"
                                  ? "Assign Comments"
                                  : nextlevelvalue == "20"
                                  ? "Delegate Comments"
                                  : nextlevelvalue == "35"
                                  ? "Referred to Other Department Comments"
                                  : nextlevelvalue == "15"
                                  ? "Refer Back Comments"
                                  : "Comments"
                              }
                              className={errors.Comment ? "error" : ""}
                              value={asignnextLeveldata.Comment}
                            />
                            <span className="sspan"></span>
                            {errors.Comment ? (
                              <small className="errormsg">
                                {nextlevelvalue == "10"
                                  ? "Assign comments is required"
                                  : nextlevelvalue == "20"
                                  ? "Delegate comments is required"
                                  : nextlevelvalue == "35"
                                  ? "Referred to other department comments is required"
                                  : nextlevelvalue == "15"
                                  ? "Refer back comments is required"
                                  : "Comments is required"}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new align-items-center">
                        <label className="controlform">CC To</label>
                        <div className=" cccto">
                          <div className="flex justify-content-center multiSelect">
                            <MultiSelect
                              value={selectedBanks}
                              onChange={(e) => setSelectedBanks(e.value)}
                              options={vOption}
                              onShow={onShow}
                              optionLabel="name"
                              placeholder="Select Banks"
                              display="chip"
                              className="w-full md:w-20rem"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 9
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Is Return Needed?</label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="YesIsReturndr"
                            name="IsReturndr"
                            onChange={(e) => HandleIsReturnOption(e)}
                            className="hidden-toggles__input"
                            checked={IsReturn == "1"}
                            value="1"
                          />
                          <label
                            for="YesIsReturndr"
                            className="hidden-toggles__label"
                            id={IsReturn}
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="IsReturndr"
                            id="NoIsReturndr"
                            className="hidden-toggles__input"
                            onChange={(e) => HandleIsReturnOption(e)}
                            value="0"
                            checked={IsReturn == "0"}
                          />
                          <label
                            for="NoIsReturndr"
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 9 && IsReturnOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Return Frequency
                            </label>
                            <div className="form-bx">
                              <label>
                                <select
                                  name="ReturnFrequency"
                                  onChange={(e) => SelectReturnFrequency(e)}
                                >
                                  <option value="0" defaultChecked>
                                    Select Frequency
                                  </option>
                                  {AllFrequency?.map((item, index) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item.id}
                                        selected={
                                          getFrequencyID == item.id &&
                                          getFrequencyID != ""
                                            ? true
                                            : false
                                        }
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 9 &&
                              IsReturn == "1" &&
                              getFrequencyID == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Frequency Date
                            </label>
                            <div className="form-bx-sm">
                              <DatePicker
                                ref={FrequencyDateRef}
                                placeholderText="Select Frequency Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={IsReturnExpiringDate}
                                onChange={(date) =>
                                  setIsReturnExpiringDate(date)
                                }
                                peekNextMonth
                                showMonthDropdown
                                maxDate={new Date("03-31-2027")}
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
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
                              {errors.IsReturnExpiringDate &&
                              (IsReturnExpiringDate ==
                                "Select Frequency Date " ||
                                IsReturnExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.IsReturnExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 9
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">
                          Is Expiry Required ?
                        </label>
                        <div className="hidden-toggles">
                          <input
                            type="radio"
                            id="exprqdr"
                            name="dateexpitydr"
                            onChange={(e) => HandleDateExpiryOption(e)}
                            className="hidden-toggles__input"
                            checked={defaultnoExpiry == "1"}
                            value="1"
                          />
                          <label
                            for={defaultnoExpiry == "1" ? "" : "exprqdr"}
                            className="hidden-toggles__label"
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            name="dateexpitydr"
                            id="noexpdr"
                            className="hidden-toggles__input"
                            onChange={(e) => {
                              HandleDateExpiryOption(e);
                              setExpiringDate(null);
                            }}
                            value="0"
                            checked={defaultnoExpiry == "0"}
                          />
                          <label
                            for={defaultnoExpiry == "0" ? "" : "noexpdr"}
                            className="hidden-toggles__label"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div
                            className={
                              roleID == 9 && DateExpiryOption == "1"
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">
                              Define Expiry Date
                            </label>

                            <div
                              className={
                                DateExpiryOption == "1"
                                  ? "hidden-toggles"
                                  : "d-none"
                              }
                            >
                              <input
                                type="radio"
                                ref={dateExpirydisplayRef}
                                id="defineddatedr"
                                className="hidden-toggles__input"
                                name="dateExpirydisplaydr"
                                onChange={(e) =>
                                  setDateExpirydisplay(e.target.value)
                                }
                                value="0"
                                checked={
                                  DateExpirydisplay != "" &&
                                  DateExpirydisplay == "0" &&
                                  DateExpiryOption == "1"
                                }
                              />{" "}
                              <label
                                for="defineddatedr"
                                className="hidden-toggles__label"
                              >
                                Specific Date
                              </label>
                              <input
                                type="radio"
                                ref={optionExpirydisplayRef}
                                id="rerpetualdatedr"
                                name="dateExpirydisplaydr"
                                onChange={(e) => {
                                  setDateExpirydisplay(e.target.value);
                                  setExpiringDate(null);
                                }}
                                className="hidden-toggles__input"
                                value="1"
                                checked={
                                  DateExpirydisplay == "1" &&
                                  DateExpiryOption == "1"
                                }
                              />
                              <label
                                for="rerpetualdatedr"
                                className="hidden-toggles__label"
                              >
                                Perpetual
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div
                            className={
                              roleID == 9 &&
                              DateExpirydisplay == "0" &&
                              DateExpiryOption == "1"
                                ? "inner_form_new-sm"
                                : "d-none"
                            }
                          >
                            <label className="controlform-sm">
                              Expiry Date
                            </label>

                            <div className="form-bx-sm">
                              <DatePicker
                                placeholderText="Select Expiry Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={ExpiringDate}
                                onChange={(date) => setExpiringDate(date)}
                                peekNextMonth
                                showMonthDropdown
                                minDate={new Date()}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="dd/MMM/yyyy"
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
                              {errors.ExpiringDate &&
                              (ExpiringDate == "Select Expiring Date " ||
                                ExpiringDate == null) ? (
                                <small
                                  className="errormsg"
                                  style={{ marginBottom: "9px" }}
                                >
                                  {errors.ExpiringDate}
                                </small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          (roleID == 9 && nextlevelvalue == "") ||
                          recomdAnalyst == "121"
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">Decision</label>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="hidden-toggles">
                              <input
                                type="radio"
                                id="srcoloration-Approvedved5"
                                value="10"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                  GetRoleHandle(10);
                                }}
                                name="applicationstausdir"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "10" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Approvedved5"
                                className="hidden-toggles__label"
                              >
                                Approved
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Rejected"
                                value="30"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstausdir"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "30" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Rejected"
                                className="hidden-toggles__label"
                              >
                                Rejected
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Deferred"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstausdir"
                                value="40"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "40" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Deferred"
                                className="hidden-toggles__label"
                              >
                                Deferred
                              </label>

                              <input
                                type="radio"
                                id="srcoloration-Cancelled"
                                onChange={(e) => {
                                  ChangeApplicationStatus(e);
                                }}
                                name="applicationstausdir"
                                value="25"
                                className="hidden-toggles__input"
                                checked={
                                  applicationstaus == "25" ? true : false
                                }
                              />
                              <label
                                for="srcoloration-Cancelled"
                                className="hidden-toggles__label"
                              >
                                Cancelled
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {allcomment?.map((cur, indexcomment) => {
                      return cur?.applicationActivityData
                        ?.slice()
                        ?.reverse()
                        ?.map((item, index) => {
                          if (cur?.assignedToRoleID == 9) {
                            return (
                              <>
                                <div
                                  key={index}
                                  className={
                                    index == 0 && roleID != 9
                                      ? "tab-pane fade show active"
                                      : "tab-pane fade show  "
                                  }
                                  id={"director-justified-home" + index}
                                  role="tabpanel"
                                  aria-labelledby={"director" + index}
                                >
                                  <div className="bakgroundaction">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Action Type
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.actionStatusName ==
                                                    "Approved" ||
                                                  item?.actionStatusName ==
                                                    "Reject" ||
                                                  item?.actionStatusName ==
                                                    "Cancelled" ||
                                                  item?.actionStatusName ==
                                                    "Draft"
                                                    ? "Assigned"
                                                    : item?.actionStatusName
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionUserNam
                                            ? "col-md-3"
                                            : "d-none"
                                        }
                                      >
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            User{" "}
                                            <i
                                              className="bi bi-info-circle icons-info"
                                              title={`Role : ${item?.actionRoleName}`}
                                            ></i>
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={item?.actionUserName}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionUserNam
                                            ? "col-md-3"
                                            : "col-md-6"
                                        }
                                      >
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            {item?.actionStatusName ==
                                              "Approved" ||
                                            item?.actionStatusName ==
                                              "Reject" ||
                                            item?.actionStatusName ==
                                              "Cancelled"
                                              ? "Assigned"
                                              : item?.actionStatusName}{" "}
                                            Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  item?.createdDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionNotes
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Note
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={item?.actionNotes}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.actionComment
                                          ? "inner_form_new "
                                          : "d-none"
                                      }
                                    >
                                      <label className="controlform">
                                        Action Comment
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            disabled
                                            value={item?.actionComment}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new">
                                    <label className="controlform">
                                      Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html: item?.description
                                              ? item?.description
                                              : "N/A",
                                          }}
                                          disabled
                                          className="disabled viewdiscription"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          disabled
                                        >
                                          {item?.notes}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Comments
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Comments"
                                          className=""
                                          disabled
                                        >
                                          {item?.comment}
                                        </textarea>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Attachments
                                    </label>
                                    <div className="form-bx">
                                      {item?.filesData?.length ? (
                                        item?.filesData?.map((items, index) => {
                                          return (
                                            <div
                                              className="attachemt_form-bx mb-0 width-80"
                                              key={items.id}
                                            >
                                              <label className="mb-2 mb-0 pt-2 pb-2">
                                                {items?.fileName
                                                  ? items?.fileName
                                                  : `FileUpload ${index}`}
                                              </label>
                                              <div
                                                className={
                                                  roleID == 2 || roleID == 3
                                                    ? "browse-btn"
                                                    : "d-none"
                                                }
                                              >
                                                Browse{" "}
                                                <input
                                                  type="file"
                                                  onChange={(e) =>
                                                    handleFileChange(
                                                      e,
                                                      items.id
                                                    )
                                                  }
                                                />
                                              </div>
                                              <span className="filename">
                                                <Link
                                                  to={items?.filePath}
                                                  target="_blank"
                                                  className="viewbtn"
                                                >
                                                  View File
                                                </Link>
                                              </span>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <label className="notfound">
                                          File Not Found
                                        </label>
                                      )}
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul className="nalist">
                                          {item?.copiedResponseData?.length ? (
                                            item?.copiedResponseData?.map(
                                              (res) => {
                                                return <li>{res?.bankName}</li>;
                                              }
                                            )
                                          ) : (
                                            <li className="disabletext">N/A</li>
                                          )}
                                        </ul>
                                      </label>
                                    </div>
                                  </div>
                                  <div class="row">
                                    <div class="col-md-12">
                                      <div class="inner_form_new ">
                                        <label class="controlform">
                                          Action
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              class=""
                                              disabled
                                              value={
                                                item?.assignedAction ==
                                                  "Approved" ||
                                                item?.assignedAction ==
                                                  "Reject" ||
                                                item?.assignedAction ==
                                                  "Cancelled"
                                                  ? "Assigned"
                                                  : item?.assignedAction
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.isReturnNeeded == 0 ||
                                            item?.isReturnNeeded == null
                                              ? "No"
                                              : item?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {item.isReturnNeeded == 1 &&
                                  item?.returnFrequencyType == 1 &&
                                  item?.returnFrequencyName == "Once" ? (
                                    <div className="row">
                                      <div className="col-md-7">
                                        <div className="inner_form_new align-item-center">
                                          <label className="controlform">
                                            Return Frequency
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnFrequencyName
                                                    ? item?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-5">
                                        <div className="inner_form_new-sm">
                                          <label className="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.returnDate ||
                                                  !item?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        item?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : item.isReturnNeeded == 1 &&
                                    item?.returnFrequencyType !== 1 ? (
                                    <div className="col-md-12">
                                      <div className="inner_form_new align-item-center">
                                        <label className="controlform">
                                          Return Frequency
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.returnFrequencyName
                                                  ? item?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Define Expiry Date
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            item?.expiringDate
                                              ? moment(
                                                  item?.expiringDate
                                                ).format("DD/MMM/YYYY")
                                              : "N/A"
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      item?.assignedToName == null &&
                                      item?.assignedToName == null
                                        ? "d-none"
                                        : "row"
                                    }
                                  >
                                    <div className="col-md-6">
                                      <div className="inner_form_new ">
                                        <label className="controlform">
                                          Assigned To Role
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.roleName
                                                  ? item?.roleName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="inner_form_new-sm ">
                                        <label className="controlform-sm">
                                          Assigned To User
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                item?.assignedToName
                                                  ? item?.assignedToName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }
                        });
                    })}
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            <>
              <h5 className={roleID > 3 ? "section_top_subheading mt-3 py-3 btn-collapse_active " : "d-none"}>
                Application History
              </h5>

              <div className={roleID > 3 ? "tab-content" : "d-none"}>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">User Type</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Receive Date</th>
                        <th scope="col">Submit Date</th>
                        <th scope="col">Turn Around Days</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {tatHistory?.length
                        ? tatHistory?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.roleName}</td>
                                <td>{item.name ? item.name : "--"}</td>
                                <td>
                                  {item.createdDate
                                    ? moment(item.createdDate).format(
                                        "DD/MMM/yyyy hh:mm A"
                                      )
                                    : "--"}
                                </td>
                                <td>
                                  {item.submittedDate
                                    ? moment(item.submittedDate).format(
                                        "DD/MMM/yyyy hh:mm A"
                                      )
                                    : "--"}
                                </td>
                                <td>
                                  {item.workinG_DAYS}{" "}
                                  {item.workinG_DAYS > 1 ? "Days" : "Day"}{" "}
                                </td>
                              </tr>
                            );
                          })
                        : "No History Found"}
                    </tbody>
                  </table>
                </div>
              </div>
            </>

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
                {(roleID > 5 && recomdAnalyst == "121") ||
                (roleID == 3 && applicationstaus && applicationstaus != 0) ? (
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

                <button
                  type="button"
                  onClick={(e) => {
                    HandleSubmit(e);
                  }}
                  className="login"
                  disabled={
                    ((applicationstaus == 3 ||
                      AssignUserID == "" ||
                      AssignUserID == null ||
                      Description == "" ||
                      Description == null ||
                      !Description) &&
                      applicationDetail?.analystDescription == null &&
                      roleID == 5) ||
                    updatepopup == true ||
                    (AssignUserID == "" && roleID == 4) ||
                    (nextlevelvalue == "" && roleID == 5) ||
                    ((applicationstaus == "0" || applicationstaus == "") &&
                      roleID == 5) ||
                    SubmitBtnLoader == true
                      ? true
                      : false
                  }
                >
                  {(roleID > 5 &&
                    nextlevelvalue != "15" &&
                    nextlevelvalue != "20" &&
                    nextlevelvalue != "35" &&
                    recomdAnalyst == "121") ||
                  (roleID == 3 &&
                    checkSupervisor == false &&
                    nextlevelvalue == "")
                    ? "Submit & Close"
                    : "Submit"}{" "}
                  {SubmitBtnLoader == true ? (
                    <div className="smallloader"></div>
                  ) : (
                    ""
                  )}
                </button>
              </div>

              <div className="login_inner" style={{ display: "none" }}>
                <div className="login_form_panel" style={{ display: "none" }}>
                  <div
                    ref={PdftargetRef}
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
                          Exchange &nbsp; Control &nbsp; Ref
                          <br />
                          Previous &nbsp; Exchange &nbsp; Control &nbsp; Ref
                        </td>
                        <td>
                          <p
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "18px",
                              textAlign: "left",
                              fontWeight: "800",
                            }}
                          >
                            : {applicationDetail?.rbzReferenceNumber}
                            <br />: N/A
                          </p>
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
                            fontWeight: "600",
                          }}
                        >
                          {moment(
                            applicationDetail?.applicationSubmittedDate
                          ).format("DD MMMM YYYY")}
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
                            fontWeight: "600",
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
                          <span
                            style={{
                              borderBottom: "1px solid #000",
                              fontWeight: "800",
                              fontSize: "18px",
                            }}
                            className="text-uppercase"
                          >
                            {applicationDetail?.bankCity != null ||
                            applicationDetail?.bankCity != ""
                              ? applicationDetail?.bankCity
                              : ""}
                          </span>
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
                            fontWeight: "600",
                          }}
                        >
                          Dear{" "}
                          {applicationDetail?.applicantType == 1
                            ? applicationDetail?.companyName
                            : applicationDetail?.applicantType == 2
                            ? applicationDetail?.name
                            : applicationDetail?.applicantType == 3
                            ? applicationDetail?.agencyName
                            : " "}
                          ,
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
                                <p
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    borderBottom: "1px solid #000",
                                    marginBottom: "0px",
                                  }}
                                >
                                  RE &nbsp;:&nbsp;{" "}
                                  {applicationDetail?.applicationType}
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
                                  fontWeight: "400",
                                }}
                              >
                                Exporter
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
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
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                Date Submitted
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
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
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                Currency and Amount
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
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
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.amount}
                                </span>
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
                                USD &nbsp; Equivalent
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
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
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.usdEquivalent}
                                </span>
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
                                Status/Decision
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
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
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                Expiry Date
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                }}
                              >
                                :{" "}
                                {applicationDetail?.expiringDate == null ||
                                applicationDetail?.expiringDate == "" ||
                                applicationDetail?.expiringDate ==
                                  "0001-01-01T00:00:00"
                                  ? "N/A"
                                  : moment(
                                      applicationDetail?.expiringDate
                                    ).format("DD MMMM YYYY")}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  color: "#000",
                                }}
                              >
                                Returns Frequency
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                }}
                              >
                                :{" "}
                                {applicationDetail?.returnFrequencyName ==
                                  null ||
                                applicationDetail?.returnFrequencyName == ""
                                  ? "N/A"
                                  : applicationDetail?.returnFrequencyName}
                              </td>
                            </tr>
                            {applicationDetail?.returnFrequencyName ==
                            "Once" ? (
                              <tr>
                                <td
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "400",
                                    color: "#000",
                                  }}
                                >
                                  Returns Date
                                </td>
                                <td
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  :{" "}
                                  {applicationDetail?.returnDate == null ||
                                  applicationDetail?.returnDate == "" ||
                                  applicationDetail?.returnDate ==
                                    "0001-01-01T00:00:00"
                                    ? "N/A"
                                    : moment(
                                        applicationDetail?.returnDate
                                      ).format("DD MMMM YYYY")}
                                </td>
                              </tr>
                            ) : (
                              ""
                            )}
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <table>
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
                                          Response &nbsp;/&nbsp; Conditions
                                        </span>
                                      </div>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: Description
                                            ? Description
                                            : applicationDetail?.analystDescription,
                                        }}
                                      />
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
                                  Yours Sincerely,
                                </span>
                                <img
                                  src={
                                    applicationDetail?.getUserData?.filePath
                                      ? applicationDetail?.getUserData.filePath
                                      : NoSign
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
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <p
                                  style={{
                                    marginBottom: "0px",
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "5px 0px",
                                    lineHeight: "13px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename.replace(/"/g, "")
                                    : "N/A"}
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
                                        }}
                                      >
                                        CC:
                                      </p>
                                      <div>
                                        {selectedBanks?.map((item) => {
                                          return (
                                            <p
                                              style={{
                                                marginBottom: "3px",

                                                fontSize: "18px",
                                                fontWeight: "400",
                                              }}
                                            >
                                              {item.name}
                                            </p>
                                          );
                                        })}
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
              {/* pdf-preview data end */}

              {/* Covering letter data start Arun Verma */}
              <div className="login_inner" style={{ display: "none" }}>
                <div className="login_form_panel" style={{ display: "none" }}>
                  <div
                    ref={CoverigLetterRef}
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
                          Exchange &nbsp; Control &nbsp; Ref
                          <br />
                          Previous &nbsp; Exchange &nbsp; Control &nbsp; Ref
                        </td>
                        <td>
                          <p
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "18px",
                              textAlign: "left",
                              fontWeight: "800",
                            }}
                          >
                            : {applicationDetail?.rbzReferenceNumber}
                            <br />: N/A
                          </p>
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
                            fontWeight: "600",
                          }}
                        >
                          {moment(
                            applicationDetail?.applicationSubmittedDate
                          ).format("DD MMMM YYYY")}
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
                            fontWeight: "600",
                          }}
                        >
                          The Head - Exchange Control
                          <br />
                          Reserve Bank of Zimbabwe
                          <br />
                          80 Samora Machel Avenue
                          <br />
                          P.O. Box 1283
                          <br />
                          Harare
                          <br />
                          <span
                            style={{
                              borderBottom: "1px solid #000",
                              fontWeight: "800",
                              fontSize: "18px",
                            }}
                            className="text-uppercase"
                          >
                            Zimbabwe
                          </span>
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
                            fontWeight: "600",
                          }}
                        >
                          Dear Sir/Madam,
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
                                <p
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    borderBottom: "1px solid #000",
                                    marginBottom: "0px",
                                  }}
                                >
                                  RE &nbsp;:&nbsp;{" "}
                                  {applicationDetail?.applicationType}
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
                                  fontWeight: "400",
                                }}
                              >
                                Date Submitted
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                }}
                              >
                                :{" "}
                                {moment(
                                  applicationDetail?.applicationSubmittedDate
                                ).format("DD MMMM YYYY")}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <table>
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
                                          Notes &nbsp;/&nbsp; Description
                                        </span>
                                      </div>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: asignnextLeveldata
                                            ? // ? asignnextLeveldata.Notes
                                              Description
                                            : "",
                                        }}
                                      />
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
                                      : NoSign
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
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <p
                                  style={{
                                    marginBottom: "0px",
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "5px 0px",
                                    lineHeight: "13px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.bankName}
                                </h3>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              {/* cover letter data end Arun Verma */}

              <div className="login_inner" style={{ display: "none" }}>
                <div className="login_form_panel" style={{ display: "none" }}>
                  <div
                    ref={PdfPrivewRef}
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
                          Exchange &nbsp; Control &nbsp; Ref
                          <br />
                          Previous &nbsp; Exchange &nbsp; Control &nbsp; Ref
                        </td>
                        <td>
                          <p
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "18px",
                              textAlign: "left",
                              fontWeight: "800",
                            }}
                          >
                            : {applicationDetail?.rbzReferenceNumber}
                            <br />: N/A
                          </p>
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
                            fontWeight: "600",
                          }}
                        >
                          {moment(
                            applicationDetail?.applicationSubmittedDate
                          ).format("DD MMMM YYYY")}
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
                            fontWeight: "600",
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
                          <span
                            style={{
                              borderBottom: "1px solid #000",
                              fontWeight: "800",
                              fontSize: "18px",
                            }}
                            className="text-uppercase"
                          >
                            {applicationDetail?.bankCity != null ||
                            applicationDetail?.bankCity != ""
                              ? applicationDetail?.bankCity
                              : ""}
                          </span>
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
                            fontWeight: "600",
                          }}
                        >
                          Dear{" "}
                          {applicationDetail?.applicantType == 1
                            ? applicationDetail?.companyName
                            : applicationDetail?.applicantType == 2
                            ? applicationDetail?.name
                            : applicationDetail?.applicantType == 3
                            ? applicationDetail?.agencyName
                            : " "}
                          ,
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
                                <p
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    borderBottom: "1px solid #000",
                                    marginBottom: "0px",
                                  }}
                                >
                                  RE &nbsp;:&nbsp;{" "}
                                  {applicationDetail?.applicationType}
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
                                  fontWeight: "400",
                                }}
                              >
                                Exporter
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
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
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                Date Submitted
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                }}
                              >
                                :{" "}
                                {moment(
                                  applicationDetail?.applicationSubmittedDate
                                ).format("DD MMMM  YYYY")}
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
                                Currency and Amount
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
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
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.amount}
                                </span>
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
                                USD &nbsp; Equivalent
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
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
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.usdEquivalent}
                                </span>
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
                                Status/Decision
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
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
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                Expiry Date
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                }}
                              >
                                :{" "}
                                {applicationDetail?.expiringDate == null ||
                                applicationDetail?.expiringDate == "" ||
                                applicationDetail?.expiringDate ==
                                  "0001-01-01T00:00:00"
                                  ? "N/A"
                                  : moment(
                                      applicationDetail?.expiringDate
                                    ).format("DD MMMM YYYY")}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  color: "#000",
                                }}
                              >
                                Returns Frequency
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                }}
                              >
                                :{" "}
                                {applicationDetail?.returnFrequencyName ==
                                  null ||
                                applicationDetail?.returnFrequencyName == ""
                                  ? "N/A"
                                  : applicationDetail?.returnFrequencyName}
                              </td>
                            </tr>
                            {applicationDetail?.returnFrequencyName ==
                            "Once" ? (
                              <tr>
                                <td
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "400",
                                    color: "#000",
                                  }}
                                >
                                  Returns Date
                                </td>
                                <td
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  :{" "}
                                  {applicationDetail?.returnDate == null ||
                                  applicationDetail?.returnDate == "" ||
                                  applicationDetail?.returnDate ==
                                    "0001-01-01T00:00:00"
                                    ? "N/A"
                                    : moment(
                                        applicationDetail?.returnDate
                                      ).format("DD MMMM  YYYY")}
                                </td>
                              </tr>
                            ) : (
                              ""
                            )}
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <table>
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
                                          Response &nbsp;/&nbsp; Conditions
                                        </span>
                                      </div>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: Description
                                            ? Description
                                            : applicationDetail?.analystDescription,
                                        }}
                                      />
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
                                  Yours Sincerely,
                                </span>
                                <img
                                  src={
                                    applicationDetail?.getUserData?.filePath
                                      ? applicationDetail?.getUserData.filePath
                                      : NoSign
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
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <p
                                  style={{
                                    marginBottom: "0px",
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "5px 0px",
                                    lineHeight: "13px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename.replace(/"/g, "")
                                    : "N/A"}
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
                                        }}
                                      >
                                        CC:
                                      </p>
                                      <div>
                                        {selectedBanks?.map((item) => {
                                          return (
                                            <p
                                              style={{
                                                marginBottom: "3px",

                                                fontSize: "18px",
                                                fontWeight: "400",
                                              }}
                                            >
                                              {item.name}
                                            </p>
                                          );
                                        })}
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

              {updatepopup == true ? (
                <UpdatePopupMessage
                  heading={heading}
                  para={para}
                  applicationNumber={applicationNumber}
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

export default ImportDashboardEditDetails;
