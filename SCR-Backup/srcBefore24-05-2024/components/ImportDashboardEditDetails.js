import React, { useEffect, useRef, useState } from "react";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import Select from "react-select";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import UpdatePopupMessage from "./UpdatePopupMessage";
import "suneditor/dist/css/suneditor.min.css";
import { toast } from "react-toastify";
import logo from "../rbz_LOGO.png";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TailSpin } from "react-loader-spinner";
import NoSign from "../NoSign.png";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import CustomMultiSelect from "./SearchUI/CustomMultiSelect";
/* Tiptp Editor Starts */
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImportDashboardViewDetails from "./ImportDashboardViewDetails";
/* Tiptp Editor Ends */

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
  const PdfPrivewsupervisorRef = useRef();
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
  const optionOtherDepartmentRef = useRef(null);

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
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [userRoleRecordofficer, setuserRoleRecordofficer] = useState([]);
  const [sharefile, setsharefile] = useState([]);
  const [registerusertype, setregisterusertype] = useState(bankidcheck);
  const [subsectorData, setsubsectorData] = useState([]);
  const [ValidateRBZ, setValidateRBZ] = useState([]);
  const [checkSupervisor, setcheckSupervisor] = useState(false);
  const [curRate, setCurrate] = useState();
  const [DateExpirydisplay, setDateExpirydisplay] = useState("");
  const [banksuperTab, setbanksuperTab] = useState(roleID == 3 ? true : false);
  const [recordTab, setrecordTab] = useState(roleID == 4 ? true : false);
  const [updatepopup, setupdatepopup] = useState(false);
  const [analystTab, setanalystTab] = useState(roleID == 5 ? true : false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sranalystTab, setsranalystTab] = useState(roleID == 6 ? true : false);
  const [ValidateShow, setValidateShow] = useState(false);
  const [principalanalystTab, setprincipalanalystTab] = useState(
    roleID == 7 ? true : false
  );
  const [deputyTab, setdeputyTab] = useState(roleID == 8 ? true : false);
  const [director, setdirector] = useState(roleID == 9 ? true : false);
  const [sharefiletab, setsharefiletab] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [viewShareFile, setviewShareFile] = useState([]);
  const [applicationType, setapplicationType] = useState([]);
  const [lastComments, setLastComments] = useState({});
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
  const [content, setEditorContent] = useState("<p></p>");
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
  const [loading, setLoading] = useState(false);
  const [AllFrequency, setAllFrequency] = useState([]);
  const [getalluser, setGetalluser] = useState([]);
  const [OtherDepartment, setOtherDepartment] = useState("");
  const [otherDepartmentRole, setOtherDepartmentRole] = useState("");
  const [otherDepartmentRoles, setOtherDepartmentRoles] = useState([]);
  const [otherDepartmentUser, setOtherDepartmentUser] = useState("");
  const [otherDepartmentUsers, setOtherDepartmentUsers] = useState([]);
  const [OtherDepartmentPopup, setOtherDepartmentPopup] = useState(false);
  const [OtherDepartmentLoader, setOtherDepartmentLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [othersharefile, setOthersharefile] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [SubmitBtnLoader, setSubmitBtnLoader] = useState(false);
  const [ImportForm, setImporttForm] = useState({
    user: "",
    bankName: bankName,
    purposeApplication: "",
    pecaNumber: "",
    typeExporter: "",
    BeneficiaryName: "",
    beneficiaryCountry: "",
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

  const heading1 = "Submit Successfully";
  const para1 = "Application Successfully Submitted to Other Department!";
  const applicationNumber = applicationDetail.rbzReferenceNumber;

  const ratevalue = applicationDetail?.rate;

  const handleViewData = (id) => setShowUpdateModal(true);
  const handleFormClose = () => setShowUpdateModal(false);

  const convertedRate =
    parseFloat(curRate ? curRate : ratevalue) *
    parseFloat(applicationDetail?.amount);

  const CustomTableCell = TableCell.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        backgroundColor: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-background-color"),
          renderHTML: (attributes) => {
            return {
              "data-background-color": attributes.backgroundColor,
              style: `background-color: ${attributes.backgroundColor}`,
            };
          },
        },
      };
    },
  });

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
          //doc.text("PREVIEW", 50, 150, {align: 'center', baseline: 'middle'})
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
      const refpdfview =
        roleID == 3 && nextlevelvalue == 10
          ? PdfPrivewsupervisorRef
          : roleID == 3 && nextlevelvalue == ""
          ? CoverigLetterRef
          : PdfPrivewRef;
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
          addWaterMark(doc);
          doc.setProperties({
            title: `${applicationDetail?.rbzReferenceNumber}`,
          });
          var string = doc.output("dataurlnewwindow");
          // var blob = doc.output("blob");
          // window.open(URL.createObjectURL(blob), "_blank");
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
        value: items.bankID,
        label: items.bankName,
      };
    });

    const lastResponseCCTodata = lastComments?.copiedResponseData?.map(
      (items, i) => {
        return {
          value: items.bankID,
          label: items.bankName,
        };
      }
    );

    setExpiringDate(
      applicationDetail?.expiringDate
        ? applicationDetail?.expiringDate
        : new Date()
    );

    setSelectedBanks(lastResponseCCTodata ? lastResponseCCTodata : bankdtata);

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
  }, [applicationDetail, lastComments]);

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
    value: res.id,
    label: res.bankName,
  }));

  const handleChangeBank = (e) => {
    const values = e;
    setSelectedBanks(values);
  };

  console.log("selectedBanks", selectedBanks);
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
    return item.value;
  });

  const copyresponse = selectedBanks?.map((res) => ({
    ApplicationID: applicationDetail?.id,
    BankID: res?.value,
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
      valid = false;
    }
    if (
      (Description == "" || Description == "<p></p>") &&
      applicationDetail?.analystDescription == null &&
      roleID >= 5
    ) {
      newErrors.Description = "Description is required";
      valid = false;
    }

    if (
      Description == null ||
      (Description == "<p></p>" &&
        roleID == 3 &&
        nextlevelvalue == "" &&
        nextlevelvalue != "20") ||
      (nextlevelvalue == "10" &&
        Description == "<p></p>" &&
        roleID == 3 &&
        nextlevelvalue != "20") ||
      (Description == "<p></p>" &&
        supervisordecision == true &&
        roleID == 3 &&
        nextlevelvalue != "20")
    ) {
      newErrors.Description = "Description is required";
      valid = false;
    }
    if (
      Description == null ||
      (Description == "<p></p>" &&
        roleID == 3 &&
        nextlevelvalue == "" &&
        nextlevelvalue != "20") ||
      (nextlevelvalue == "10" &&
        Description == "<p></p>" &&
        roleID == 3 &&
        nextlevelvalue != "20") ||
      (Description == "<p></p>" &&
        supervisordecision == true &&
        roleID == 3 &&
        nextlevelvalue != "20")
    ) {
      newErrors.Description = "Description is required!";
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
          BeneficiaryCountry: applicationDetail?.beneficiaryCountry,
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

  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Table.configure({ resizable: true }),
      Text,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : ""
      );
      setDescription(editor.getHTML());
    }
  }, [applicationDetail]);

  useEffect(() => {
    if (editorAnalyst) {
      editorAnalyst.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorAnalyst.getHTML());
    }
  }, [applicationDetail, lastComments]);

  const editorAnalyst = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Table.configure({ resizable: true }),
      Text,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: applicationDetail.analystDescription,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorSrAnalyst) {
      editorSrAnalyst.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorSrAnalyst.getHTML());
    }
  }, [applicationDetail, lastComments]);

  const editorSrAnalyst = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Table.configure({ resizable: true }),
      Text,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: applicationDetail.analystDescription,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  const editorDeputy = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Table.configure({ resizable: true }),
      Text,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: applicationDetail.analystDescription,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorDeputy) {
      editorDeputy.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorDeputy.getHTML());
    }
  }, [applicationDetail, lastComments]);

  const editorPrincipleAnalyst = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Table.configure({ resizable: true }),
      Text,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: applicationDetail.analystDescription,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorPrincipleAnalyst) {
      editorPrincipleAnalyst.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorPrincipleAnalyst.getHTML());
    }
  }, [applicationDetail, lastComments]);

  const editorDirector = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Table.configure({ resizable: true }),
      Text,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: applicationDetail.analystDescription,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorDirector) {
      editorDirector.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorDirector.getHTML());
    }
  }, [applicationDetail, lastComments]);

  const MenuBar = ({ editor }) => {
    if (!editor) {
      return null;
    }
    return (
      <>
        <button
          type="button"
          title="Insert Table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <i class="bi bi-table"></i>
        </button>
        <button
          type="button"
          title="Add Column Before"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!editor.can().addColumnBefore()}
        >
          <i class="bi bi-list-columns-reverse"></i>
        </button>
        <button
          type="button"
          title="Add Column After"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.can().addColumnAfter()}
        >
          <i class="bi bi-list-columns"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.can().deleteColumn()}
        >
          <i class="bi bi-archive"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={!editor.can().addRowBefore()}
        >
          <i class="bi bi-arrow-bar-up"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.can().addRowAfter()}
        >
          <i class="bi bi-arrow-bar-down"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!editor.can().deleteRow()}
        >
          <i class="bi bi-archive"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
        >
          <i class="bi bi-archive"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
        >
          <i class="bi bi-union"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!editor.can().splitCell()}
        >
          splitCell
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
          disabled={!editor.can().toggleHeaderColumn()}
        >
          <i class="bi bi-layout-split"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          disabled={!editor.can().toggleHeaderRow()}
        >
          <i class="bi bi-toggle-off"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderCell().run()}
          disabled={!editor.can().toggleHeaderCell()}
        >
          <i class="bi bi-toggle-off"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().mergeOrSplit().run()}
          disabled={!editor.can().mergeOrSplit()}
        >
          <i class="bi bi-subtract"></i>
        </button>
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setCellAttribute("backgroundColor", "#FAF594")
              .run()
          }
          disabled={
            !editor.can().setCellAttribute("backgroundColor", "#FAF594")
          }
        >
          <i class="bi bi-kanban"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().fixTables().run()}
          disabled={!editor.can().fixTables()}
        >
          <i class="bi bi-file-spreadsheet"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().goToNextCell().run()}
          disabled={!editor.can().goToNextCell()}
        >
          <i class="bi bi-arrow-right-square"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().goToPreviousCell().run()}
          disabled={!editor.can().goToPreviousCell()}
        >
          <i class="bi bi-arrow-left-square"></i>
        </button>
        <button
          type="button"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <i class="bi bi-type-bold"></i>
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <i class="bi bi-type-italic"></i>
        </button>
        <button
          type="button"
          title="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <i class="bi bi-type-strikethrough"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <i class="bi bi-code-slash"></i>
        </button>
        <button
          type="button"
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <i class="bi bi-paragraph"></i>
        </button>
        <button
          type="button"
          title="H1"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h1"></i>
        </button>
        <button
          type="button"
          title="H2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h2"></i>
        </button>
        <button
          type="button"
          title="H3"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h3"></i>
        </button>
        <button
          type="button"
          title="H4"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h4"></i>
        </button>
        <button
          type="button"
          title="H5"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h5"></i>
        </button>
        <button
          type="button"
          title="H6"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h6"></i>
        </button>
        <button
          type="button"
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <i class="bi bi-list-ul"></i>
        </button>
        <button
          type="button"
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <i class="bi bi-list-ol"></i>
        </button>
        <button
          type="button"
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <i class="bi bi-quote"></i>
        </button>
        <button
          type="button"
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <i class="bi bi-hr"></i>
        </button>
        <button
          type="button"
          title="Hard Break"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <i class="bi bi-file-break"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <i class="bi bi-text-left"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          <i class="bi bi-text-center"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <i class="bi bi-text-right"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          <i class="bi bi-justify"></i>
        </button>
        <span className="setcolorcss">
          <input
            type="color"
            className="colorswatch"
            onInput={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
            value={editor.getAttributes("textStyle").color}
            data-testid="setColor"
          />
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetColor().run()}
            data-testid="unsetColor"
          >
            <i class="bi bi-palette-fill"></i>
          </button>
        </span>
      </>
    );
  };

  useEffect(() => {
    setasignnextLeveldata({
      Notes: lastComments?.notes,
      Comment: lastComments?.comment,
    });
  }, [lastComments]);

  const getLastComment = async (id) => {
    await axios
      .post(APIURL + "ImportApplication/GetLastApplicationDataByIDImport", {
        ApplicationID: id,
        RoleID: roleID,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setLastComments(res.data.responseData);
          setDescription(res.data.responseData.description);
        } else {
          toast.warning(res.data.responseMessage);
        }
      })
      .catch((error) => {
        console.log("GetLastApplicationDataByIDImport Error", error);
      });
  };

  const OtherDepartmentRole = async () => {
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: roleID,
        Status: "40",
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setOtherDepartmentRoles(res.data.responseData);
        }
      })
      .catch((error) => {
        console.log("Master/GetRoles - Error", error);
      });
  };

  const OtherDepartmentUserByRole = async (role) => {
    await axios
      .post(APIURL + "User/GetUsersByRoleID", {
        DepartmentID: OtherDepartment,
        RoleID: role,
        UserID: UserID.replace(/"/g, ""),
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setOtherDepartmentUsers(res.data.responseData);
        }
      })
      .catch((error) => {
        console.log("User/GetUsersByRoleID - Error", error);
      });
  };

  const SubmitOtherDepartment = async () => {
    try {
      setOtherDepartmentLoader(true);
      await axios
        .post(APIURL + "ReferredApplication/CreateReferredApplication", {
          ID: applicationDetail.id,
          RoleID: roleID,
          UserID: UserID.replace(/"/g, ""),
          ReferredDepartmentID: OtherDepartment,
          AssignedToRoleID: otherDepartmentRole,
          AssignedTo: otherDepartmentUser,
          Comment: asignnextLeveldata.Comment,
          Notes: asignnextLeveldata.Notes,
          Description: Description,
          // Status:
          //   OtherDepartment == "2"
          //     ? "275"
          //     : OtherDepartment == "3"
          //     ? "280"
          //     : OtherDepartment == "4"
          //     ? "285"
          //     : OtherDepartment == "5"
          //     ? "290"
          //     : "",
          Status: "35",
        })
        .then((res) => {
          if (res.data.responseCode == 200) {
            console.log("vbbbbb---", res);
            setOtherDepartmentLoader(false);
            setOtherDepartmentPopup(true);
          }
        })
        .catch((error) => {
          setOtherDepartmentPopup(false);
          setOtherDepartmentLoader(false);
          console.log("User/GetUsersByRoleID - Error", error);
        });
    } catch (error) {
      setOtherDepartmentPopup(false);
      setOtherDepartmentLoader(false);
      console.log("User/GetUsersByRoleID - catch - Error", error);
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
                    disabled={roleID == 2 || roleID == 3 ? false : true}
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
                            placeholder="Prior Exchange Control Authority Number(PECAN)"
                            value={
                              applicationDetail?.pecaNumber
                                ? applicationDetail?.pecaNumber
                                : "N/A"
                            }
                            disabled={roleID == 2 || roleID == 3 ? false : true}
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
                        {/* {loader == true ? (
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
                          paginator={ValidateRBZ?.length > 10 ? true : false}
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
                            header="Nature of Application"
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
                            <i class="bi bi-x-circle"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    " "
                  )} */}
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

              {applicationDetail?.applicantType == "1" && bankID != "" ? (
                <>
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
                        disabled={roleID == 2 || roleID == 3 ? false : true}
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
                          placeholder={
                            applicationDetail?.bpnCode
                              ? applicationDetail?.bpnCode
                              : "N/A"
                          }
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
                          disabled={roleID == 2 || roleID == 3 ? false : true}
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
                      disabled={roleID == 2 || roleID == 3 ? false : true}
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
                      disabled={roleID == 2 || roleID == 3 ? false : true}
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      value={
                        applicationDetail?.beneficiaryName
                          ? applicationDetail?.beneficiaryName
                          : "N/A"
                      }
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
                      name="beneficiaryCountry"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      disabled={roleID == 2 || roleID == 3 ? false : true}
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
                        disabled={roleID == 2 || roleID == 3 ? false : true}
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
                          disabled={roleID == 2 || roleID == 3 ? false : true}
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
                          disabled={roleID == 2 || roleID == 3 ? false : true}
                          min={0}
                          name="amount"
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          placeholder={
                            applicationDetail?.amount
                              ? applicationDetail?.amount
                              : "N/A"
                          }
                          className={
                            errors.amount && applicationDetail.amount === ""
                              ? "error"
                              : ""
                          }
                          onKeyDown={(event) => {
                            const blockedKeys = ["e", "E", "-", "+"];
                            if (blockedKeys.includes(event.key)) {
                              event.preventDefault();
                            }
                          }}
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
                          value={
                            applicationDetail?.currency
                              ? curRate
                                ? curRate
                                : applicationDetail.rate
                              : "Rate"
                          }
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
                      disabled={roleID == 2 || roleID == 3 ? false : true}
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
                      disabled={roleID == 2 || roleID == 3 ? false : true}
                      name="subSector"
                      onChange={(e) => changeHandelForm(e)}
                      className={
                        errors.subSector && ImportForm.subSector == ""
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
                      disabled={roleID == 2 || roleID == 3 ? false : true}
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

              <div
                class={
                  applicationDetail?.applicationStatus == 0 ? "d-none" : "row"
                }
              >
                <div class="col-md-6">
                  <div class="inner_form_new ">
                    <label class="controlform">Assigned To Role</label>
                    <div class="form-bx">
                      <label>
                        <input
                          type="text"
                          class=""
                          disabled
                          value={
                            applicationDetail?.assignedToRoleName
                              ? applicationDetail?.assignedToRoleName
                              : "N/A"
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="inner_form_new-sm ">
                    <label class="controlform-sm">Assigned To User</label>
                    <div class="form-bx-sm">
                      <label>
                        <input
                          type="text"
                          class=""
                          disabled
                          value={
                            applicationDetail?.assignedToName
                              ? applicationDetail?.assignedToName
                              : "N/A"
                          }
                        />
                      </label>
                    </div>
                  </div>
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

              {roleID == 2 || roleID == 3
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

              {roleID == 2 || roleID == 3
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

              {roleID == 2 || roleID == 3 ? (
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
                  <span
                    className="btn-collapse"
                    onClick={() => setbanksuperTab(!banksuperTab)}
                  >
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                  {applicationDetail?.parentApplicationID !== 0 &&
                  roleID == 3 ? (
                    <button
                      type="button"
                      className="btn btn-light mx-auto copybtn"
                      onClick={() =>
                        getLastComment(applicationDetail?.parentApplicationID)
                      }
                    >
                      Copy Last Response
                    </button>
                  ) : (
                    ""
                  )}
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
                          <div className="form-bx editorFieldBox">
                            <div className="mt-2 py-1">
                              <MenuBar editor={editor} />
                              <EditorContent editor={editor} />
                              <span className="sspan"></span>
                              {(errors.Description && Description == " ") ||
                              Description == null ||
                              Description == "<p></p>" ||
                              !Description ? (
                                <small
                                  className="errormsg"
                                  style={{ bottom: "-18px" }}
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
                  <span
                    className="btn-collapse"
                    onClick={() => setrecordTab(!recordTab)}
                  >
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                  {applicationDetail?.parentApplicationID !== 0 &&
                  roleID == 4 ? (
                    <button
                      type="button"
                      className="btn btn-light mx-auto copybtn"
                      onClick={() =>
                        getLastComment(applicationDetail?.parentApplicationID)
                      }
                    >
                      Copy Last Response
                    </button>
                  ) : (
                    ""
                  )}
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
                  <span
                    className="btn-collapse"
                    onClick={() => setanalystTab(!analystTab)}
                  >
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                  {applicationDetail?.parentApplicationID !== 0 &&
                  roleID == 5 ? (
                    <button
                      type="button"
                      className="btn btn-light mx-auto copybtn"
                      onClick={() =>
                        getLastComment(applicationDetail?.parentApplicationID)
                      }
                    >
                      Copy Last Response
                    </button>
                  ) : (
                    ""
                  )}
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
                          roleID == 5 && nextlevelvalue != 35
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
                        <div className="form-bx editorFieldBox">
                          <div className="mt-2 py-1">
                            <MenuBar editor={editorAnalyst} />
                            <EditorContent editor={editorAnalyst} />

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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                      setOtherDepartment("");
                                      setOtherDepartmentRole("");
                                      setOtherDepartmentRoles([]);
                                      setOtherDepartmentUser("");
                                      setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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

                      {nextlevelvalue != 35 ? (
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
                                      {errors.assignedTo &&
                                      !SupervisorRoleId ? (
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
                      ) : (
                        ""
                      )}

                      {nextlevelvalue == 35 ? (
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <div className="inner_form_new align-items-center">
                              <label className="controlform">
                                Other Department
                              </label>
                              <div className="form-bx">
                                <label>
                                  <select
                                    ref={optionOtherDepartmentRef}
                                    name="OtherDepartment"
                                    onChange={(e) => {
                                      setOtherDepartment(e.target.value);
                                      OtherDepartmentRole();
                                      setOtherDepartmentRole("");
                                      setOtherDepartmentRoles([]);
                                      setOtherDepartmentUser("");
                                      setOtherDepartmentUsers([]);
                                    }}
                                    className={
                                      errors.assignedTo && !SupervisorRoleId
                                        ? "error"
                                        : ""
                                    }
                                  >
                                    <option value="">
                                      Select Other Department
                                    </option>
                                    <option value="2">Export</option>
                                    <option value="4">
                                      Foreign Investments
                                    </option>
                                    <option value="5">Inspectorate</option>
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
                          </div>
                          <div className="col-md-3">
                            <div className="inner_form_new-sm align-items-center">
                              <label className="controlform-sm">Role</label>
                              <div className="form-bx-sm">
                                <label>
                                  <select
                                    onChange={(e) => {
                                      setOtherDepartmentRole(e.target.value);
                                      OtherDepartmentUserByRole(e.target.value);
                                      setOtherDepartmentUser("");
                                      setOtherDepartmentUsers([]);
                                    }}
                                  >
                                    <option value="">Select Role</option>
                                    {otherDepartmentRoles?.map(
                                      (item, index) => {
                                        return (
                                          <option key={index} value={item.id}>
                                            {item.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="inner_form_new-sm align-items-center">
                              <label className="controlform-sm">User</label>
                              <div className="form-bx-sm">
                                <label>
                                  <select
                                    onChange={(e) =>
                                      setOtherDepartmentUser(e.target.value)
                                    }
                                  >
                                    <option value="">Select User</option>
                                    {otherDepartmentUsers?.map(
                                      (item, index) => {
                                        return (
                                          <option
                                            key={index}
                                            value={item.userID}
                                          >
                                            {item.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {nextlevelvalue != 35 &&
                        attachmentData?.map((items, index) => {
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

                      {nextlevelvalue != 35 &&
                        otheruserfiles?.map((file, index) => (
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
                            userfiles?.find((f) => f.id === "other" + index)
                              ?.file?.name ? (
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

                      {(otheruserfiles?.length || userfiles?.length) &&
                      nextlevelvalue != 35 ? (
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

                      <div
                        className={
                          nextlevelvalue != 35
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">CC To</label>
                        <div className=" cccto">
                          <div className="flex justify-content-center multiSelect">
                            {/* <MultiSelect
                              value={selectedBanks}
                              onChange={(e) => setSelectedBanks(e.value)}
                              options={vOption}
                              optionLabel="name"
                              onShow={onShow}
                              placeholder="Select Banks"
                              className="w-full md:w-20rem"
                              display="chip"
                            /> */}
                            <CustomMultiSelect
                              key="multyselectprinciple"
                              options={vOption}
                              onChange={(e) => handleChangeBank(e)}
                              value={selectedBanks}
                              isSelectAll={true}
                              menuPlacement={"bottom"}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          roleID == 5 && nextlevelvalue != 35
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

                      <div className={nextlevelvalue != 35 ? "row" : "d-none"}>
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
                          roleID == 5 && nextlevelvalue != 35
                            ? "inner_form_new align-items-center"
                            : "d-none"
                        }
                      >
                        <label className="controlform">
                          Is Expiry Required?
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
                              roleID == 5 &&
                              DateExpiryOption == "1" &&
                              nextlevelvalue != 35
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
                              DateExpiryOption == "1" &&
                              nextlevelvalue != 35
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
                  <span
                    className="btn-collapse"
                    onClick={() => setsranalystTab(!sranalystTab)}
                  >
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                  {applicationDetail?.parentApplicationID !== 0 &&
                  roleID == 6 ? (
                    <button
                      type="button"
                      className="btn btn-light mx-auto copybtn"
                      onClick={() =>
                        getLastComment(applicationDetail?.parentApplicationID)
                      }
                    >
                      Copy Last Response
                    </button>
                  ) : (
                    ""
                  )}
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                        className={
                          checkSupervisor == true && nextlevelvalue != "35"
                            ? "row"
                            : "d-none"
                        }
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

                      {nextlevelvalue == 35 ? (
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <div className="inner_form_new align-items-center">
                              <label className="controlform">
                                Other Department
                              </label>
                              <div className="form-bx">
                                <label>
                                  <select
                                    ref={optionOtherDepartmentRef}
                                    name="OtherDepartment"
                                    onChange={(e) => {
                                      setOtherDepartment(e.target.value);
                                      OtherDepartmentRole();
                                      setOtherDepartmentRole("");
                                      setOtherDepartmentRoles([]);
                                      setOtherDepartmentUser("");
                                      setOtherDepartmentUsers([]);
                                    }}
                                    className={
                                      errors.assignedTo && !SupervisorRoleId
                                        ? "error"
                                        : ""
                                    }
                                  >
                                    <option value="">
                                      Select Other Department
                                    </option>
                                    <option value="2">Export</option>
                                    <option value="4">
                                      Foreign Investments
                                    </option>
                                    <option value="5">Inspectorate</option>
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
                          </div>
                          <div className="col-md-3">
                            <div className="inner_form_new-sm align-items-center">
                              <label className="controlform-sm">Role</label>
                              <div className="form-bx-sm">
                                <label>
                                  <select
                                    onChange={(e) => {
                                      setOtherDepartmentRole(e.target.value);
                                      OtherDepartmentUserByRole(e.target.value);
                                      setOtherDepartmentUser("");
                                      setOtherDepartmentUsers([]);
                                    }}
                                  >
                                    <option value="">Select Role</option>
                                    {otherDepartmentRoles?.map(
                                      (item, index) => {
                                        return (
                                          <option key={index} value={item.id}>
                                            {item.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="inner_form_new-sm align-items-center">
                              <label className="controlform-sm">User</label>
                              <div className="form-bx-sm">
                                <label>
                                  <select
                                    onChange={(e) =>
                                      setOtherDepartmentUser(e.target.value)
                                    }
                                  >
                                    <option value="">Select User</option>
                                    {otherDepartmentUsers?.map(
                                      (item, index) => {
                                        return (
                                          <option
                                            key={index}
                                            value={item.userID}
                                          >
                                            {item.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {nextlevelvalue != "35" &&
                        attachmentData?.map((items, index) => {
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

                      {nextlevelvalue != "35" &&
                        otheruserfiles?.map((file, index) => (
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
                            userfiles?.find((f) => f.id === "other" + index)
                              ?.file?.name ? (
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

                      {(otheruserfiles?.length || userfiles?.length) &&
                      nextlevelvalue != "35" ? (
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
                        <div className="form-bx editorFieldBox">
                          <div className="mt-2 py-1">
                            <MenuBar editor={editorSrAnalyst} />
                            <EditorContent editor={editorSrAnalyst} />
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

                      <div
                        className={
                          nextlevelvalue == "35"
                            ? "d-none"
                            : "inner_form_new align-items-center"
                        }
                      >
                        <label className="controlform">CC To</label>
                        <div className=" cccto">
                          <div className="flex justify-content-center multiSelect">
                            {/* <MultiSelect
                              value={selectedBanks}
                              onChange={(e) => setSelectedBanks(e.value)}
                              options={vOption}
                              onShow={onShow}
                              optionLabel="name"
                              placeholder="Select Banks"
                              display="chip"
                              className="w-full md:w-20rem"
                            /> */}
                            <CustomMultiSelect
                              key="multyselectprinciple"
                              options={vOption}
                              onChange={(e) => handleChangeBank(e)}
                              value={selectedBanks}
                              isSelectAll={true}
                              menuPlacement={"bottom"}
                            />
                          </div>
                        </div>
                      </div>

                      {nextlevelvalue != "35" && (
                        <>
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
                            <label className="controlform">
                              Is Return Needed?
                            </label>
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
                              Is Expiry Required?
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
                        </>
                      )}
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
                  <span
                    className="btn-collapse"
                    onClick={() => setprincipalanalystTab(!principalanalystTab)}
                  >
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                  {applicationDetail?.parentApplicationID !== 0 &&
                  roleID == 7 ? (
                    <button
                      type="button"
                      className="btn btn-light mx-auto copybtn"
                      onClick={() =>
                        getLastComment(applicationDetail?.parentApplicationID)
                      }
                    >
                      Copy Last Response
                    </button>
                  ) : (
                    ""
                  )}
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                for="prcoloration-Department"
                                className="hidden-toggles__label"
                              >
                                Referred to Other Department
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          checkSupervisor == true && nextlevelvalue != "35"
                            ? "row"
                            : "d-none"
                        }
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

                      {nextlevelvalue == 35 ? (
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <div className="inner_form_new align-items-center">
                              <label className="controlform">
                                Other Department
                              </label>
                              <div className="form-bx">
                                <label>
                                  <select
                                    ref={optionOtherDepartmentRef}
                                    name="OtherDepartment"
                                    onChange={(e) => {
                                      setOtherDepartment(e.target.value);
                                      OtherDepartmentRole();
                                      setOtherDepartmentRole("");
                                      setOtherDepartmentRoles([]);
                                      setOtherDepartmentUser("");
                                      setOtherDepartmentUsers([]);
                                    }}
                                    className={
                                      errors.assignedTo && !SupervisorRoleId
                                        ? "error"
                                        : ""
                                    }
                                  >
                                    <option value="">
                                      Select Other Department
                                    </option>
                                    <option value="2">Export</option>
                                    <option value="4">
                                      Foreign Investments
                                    </option>
                                    <option value="5">Inspectorate</option>
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
                          </div>
                          <div className="col-md-3">
                            <div className="inner_form_new-sm align-items-center">
                              <label className="controlform-sm">Role</label>
                              <div className="form-bx-sm">
                                <label>
                                  <select
                                    onChange={(e) => {
                                      setOtherDepartmentRole(e.target.value);
                                      OtherDepartmentUserByRole(e.target.value);
                                      setOtherDepartmentUser("");
                                      setOtherDepartmentUsers([]);
                                    }}
                                  >
                                    <option value="">Select Role</option>
                                    {otherDepartmentRoles?.map(
                                      (item, index) => {
                                        return (
                                          <option key={index} value={item.id}>
                                            {item.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="inner_form_new-sm align-items-center">
                              <label className="controlform-sm">User</label>
                              <div className="form-bx-sm">
                                <label>
                                  <select
                                    onChange={(e) =>
                                      setOtherDepartmentUser(e.target.value)
                                    }
                                  >
                                    <option value="">Select User</option>
                                    {otherDepartmentUsers?.map(
                                      (item, index) => {
                                        return (
                                          <option
                                            key={index}
                                            value={item.userID}
                                          >
                                            {item.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {nextlevelvalue != "35" &&
                        attachmentData?.map((items, index) => {
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

                      {nextlevelvalue != "35" &&
                        otheruserfiles?.map((file, index) => (
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
                            userfiles?.find((f) => f.id === "other" + index)
                              ?.file?.name ? (
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

                      {(otheruserfiles?.length || userfiles?.length) &&
                      nextlevelvalue != "35" ? (
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
                        <div className="form-bx editorFieldBox">
                          <div className="mt-2 py-1">
                            <MenuBar editor={editorPrincipleAnalyst} />
                            <EditorContent editor={editorPrincipleAnalyst} />
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

                      {nextlevelvalue != "35" && (
                        <>
                          <div className="inner_form_new align-items-center">
                            <label className="controlform">CC To</label>
                            <div className=" cccto">
                              <div className="flex justify-content-center multiSelect">
                                {/* <MultiSelect
                                  value={selectedBanks}
                                  onChange={(e) => setSelectedBanks(e.value)}
                                  options={vOption}
                                  onShow={onShow}
                                  optionLabel="name"
                                  placeholder="Select Banks"
                                  display="chip"
                                  className="w-full md:w-20rem"
                                /> */}
                                <CustomMultiSelect
                                  key="multyselectprinciple"
                                  options={vOption}
                                  onChange={(e) => handleChangeBank(e)}
                                  value={selectedBanks}
                                  isSelectAll={true}
                                  menuPlacement={"bottom"}
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
                            <label className="controlform">
                              Is Return Needed?
                            </label>
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
                              Is Expiry Required?
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
                        </>
                      )}
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
                  <span
                    className="btn-collapse"
                    onClick={() => setdeputyTab(!deputyTab)}
                  >
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                  {applicationDetail?.parentApplicationID !== 0 &&
                  roleID == 8 ? (
                    <button
                      type="button"
                      className="btn btn-light mx-auto copybtn"
                      onClick={() =>
                        getLastComment(applicationDetail?.parentApplicationID)
                      }
                    >
                      Copy Last Response
                    </button>
                  ) : (
                    ""
                  )}
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                                  setOtherDepartment("");
                                  setOtherDepartmentRole("");
                                  setOtherDepartmentRoles([]);
                                  setOtherDepartmentUser("");
                                  setOtherDepartmentUsers([]);
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
                        className={
                          checkSupervisor == true && nextlevelvalue != "35"
                            ? "row"
                            : "d-none"
                        }
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

                      {nextlevelvalue == 35 ? (
                        <div className="row mt-2">
                          <div className="col-md-6">
                            <div className="inner_form_new align-items-center">
                              <label className="controlform">
                                Other Department
                              </label>
                              <div className="form-bx">
                                <label>
                                  <select
                                    ref={optionOtherDepartmentRef}
                                    name="OtherDepartment"
                                    onChange={(e) => {
                                      setOtherDepartment(e.target.value);
                                      OtherDepartmentRole();
                                      setOtherDepartmentRole("");
                                      setOtherDepartmentRoles([]);
                                      setOtherDepartmentUser("");
                                      setOtherDepartmentUsers([]);
                                    }}
                                    className={
                                      errors.assignedTo && !SupervisorRoleId
                                        ? "error"
                                        : ""
                                    }
                                  >
                                    <option value="">
                                      Select Other Department
                                    </option>
                                    <option value="2">Export</option>
                                    <option value="4">
                                      Foreign Investments
                                    </option>
                                    <option value="5">Inspectorate</option>
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
                          </div>
                          <div className="col-md-3">
                            <div className="inner_form_new-sm align-items-center">
                              <label className="controlform-sm">Role</label>
                              <div className="form-bx-sm">
                                <label>
                                  <select
                                    onChange={(e) => {
                                      setOtherDepartmentRole(e.target.value);
                                      OtherDepartmentUserByRole(e.target.value);
                                      setOtherDepartmentUser("");
                                      setOtherDepartmentUsers([]);
                                    }}
                                  >
                                    <option value="">Select Role</option>
                                    {otherDepartmentRoles?.map(
                                      (item, index) => {
                                        return (
                                          <option key={index} value={item.id}>
                                            {item.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="inner_form_new-sm align-items-center">
                              <label className="controlform-sm">User</label>
                              <div className="form-bx-sm">
                                <label>
                                  <select
                                    onChange={(e) =>
                                      setOtherDepartmentUser(e.target.value)
                                    }
                                  >
                                    <option value="">Select User</option>
                                    {otherDepartmentUsers?.map(
                                      (item, index) => {
                                        return (
                                          <option
                                            key={index}
                                            value={item.userID}
                                          >
                                            {item.name}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {nextlevelvalue != "35" &&
                        attachmentData?.map((items, index) => {
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

                      {nextlevelvalue != "35" &&
                        otheruserfiles?.map((file, index) => (
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
                            userfiles?.find((f) => f.id === "other" + index)
                              ?.file?.name ? (
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

                      {(otheruserfiles?.length || userfiles?.length) &&
                      nextlevelvalue != "35" ? (
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
                        <div className="form-bx editorFieldBox">
                          <div className="mt-2 py-1">
                            <MenuBar editor={editorDeputy} />
                            <EditorContent editor={editorDeputy} />
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

                      {nextlevelvalue != "35" && (
                        <>
                          <div className="inner_form_new align-items-center">
                            <label className="controlform">CC To</label>
                            <div className=" cccto">
                              <div className="flex justify-content-center multiSelect">
                                <CustomMultiSelect
                                  key="multyselectprinciple"
                                  options={vOption}
                                  onChange={(e) => handleChangeBank(e)}
                                  value={selectedBanks}
                                  isSelectAll={true}
                                  menuPlacement={"bottom"}
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
                            <label className="controlform">
                              Is Return Needed?
                            </label>
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
                              Is Expiry Required?
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
                        </>
                      )}
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
                  <span
                    className="btn-collapse"
                    onClick={() => setdirector(!director)}
                  >
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                  {applicationDetail?.parentApplicationID !== 0 &&
                  roleID == 9 ? (
                    <button
                      type="button"
                      className="btn btn-light mx-auto copybtn"
                      onClick={() =>
                        getLastComment(applicationDetail?.parentApplicationID)
                      }
                    >
                      Copy Last Response
                    </button>
                  ) : (
                    ""
                  )}
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
                        <div className="form-bx editorFieldBox">
                          <div className="mt-2 py-1">
                            <MenuBar editor={editorDirector} />
                            <EditorContent editor={editorDirector} />
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
                            {/* <MultiSelect
                              value={selectedBanks}
                              onChange={(e) => setSelectedBanks(e.value)}
                              options={vOption}
                              onShow={onShow}
                              optionLabel="name"
                              placeholder="Select Banks"
                              display="chip"
                              className="w-full md:w-20rem"
                            /> */}
                            <CustomMultiSelect
                              key="multyselectprinciple"
                              options={vOption}
                              onChange={(e) => handleChangeBank(e)}
                              value={selectedBanks}
                              isSelectAll={true}
                              menuPlacement={"bottom"}
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
                          Is Expiry Required?
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

            {roleID >= 5 ? (
              <>
                <h5
                  className={
                    sharefiletab
                      ? "section_top_subheading mt-1 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-1 py-3 cursorpointer"
                  }
                  onClick={() => setsharefiletab(!sharefiletab)}
                >
                  Shared File{" "}
                  <span className="counter-tab">{viewShareFile?.length}</span>
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>

                <div className={sharefiletab ? "customtab  mt-2" : "d-none"}>
                  {viewShareFile?.map((items, index) => {
                    return (
                      <div className="attachemt_form-bx" key={items.id}>
                        <label>
                          {/* {items.filename} */}
                          {items?.fileName
                            ? items?.fileName
                            : `FileUpload ${index}`}
                        </label>
                        <div
                          className={
                            roleID == 2 || roleID == 3 ? "browse-btn" : "d-none"
                          }
                        >
                          Browse{" "}
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, items.id)}
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
                        <button
                          type="button"
                          onClick={(e) => handleRemovfile(items.id)}
                          className="remove-file"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}

                  {attachmentData?.map((items, index) => {
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
                            {items.filename}
                          </span>
                        </label>
                        <div className="browse-btn">
                          Browse
                          <input
                            type="file"
                            onChange={(e) =>
                              handleshareFileChange(e, `sharefile ${index}`)
                            }
                          />
                        </div>
                        <span className="filename">
                          {sharefile?.find((f) => f.id === `sharefile ${index}`)
                            ?.file?.name || "No file chosen"}
                        </span>

                        {sharefile?.length &&
                        sharefile?.find((f) => f.id === `sharefile ${index}`)
                          ?.file?.name ? (
                          <button
                            type="button"
                            className="remove-file"
                            onClick={() =>
                              removeshareImage(index, `sharefile ${index}`)
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

                  {othersharefile.map((file, index) => (
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
                        <b>
                          Other File
                          {index + 1}
                        </b>
                      </label>
                      <div className="browse-btn">
                        Browse{" "}
                        <input
                          type="file"
                          onChange={(e) => {
                            handleshareFileChange(
                              e,
                              "sharefileother" + (index + 1)
                            );
                            handleOthrefile(e, "sharefileother" + (index + 1));
                          }}
                        />
                      </div>
                      <span className="filename">
                        {sharefile?.find(
                          (f) => f.id === "sharefileother" + (index + 1)
                        )?.file?.name || "No file chosen"}
                      </span>
                      {sharefile?.length &&
                      sharefile?.find(
                        (f) => f.id === "sharefileother" + (index + 1)
                      )?.file?.name ? (
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() =>
                            removeshareImage(
                              index,
                              "sharefileother" + (index + 1)
                            )
                          }
                        >
                          Remove
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}

                  {sharefile?.length ? (
                    <div className="attachemt_form-bx">
                      <label style={{ border: "0px" }}>{""}</label>
                      <button
                        type="button"
                        className="addmore-btn mt-0"
                        onClick={(e) => handlesharefileAddMore(e)}
                      >
                        {" "}
                        Add More File{" "}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              ""
            )}

            <>
              <h5
                className={
                  roleID > 3
                    ? "section_top_subheading mt-3 py-3 btn-collapse_active "
                    : "d-none"
                }
              >
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
                {(roleID > 5 &&
                  recomdAnalyst == "121" &&
                  applicationstaus != "25") ||
                (roleID == 3 &&
                  applicationstaus &&
                  applicationstaus != 0 &&
                  applicationstaus != "25") ||
                (roleID == 3 &&
                  nextlevelvalue == "10" &&
                  applicationstaus != "25") ? (
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

                {nextlevelvalue == 35 ? (
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={
                      !otherDepartmentRole ||
                      !otherDepartmentUser ||
                      !asignnextLeveldata.Comment ||
                      !asignnextLeveldata.Notes ||
                      OtherDepartmentLoader
                        ? true
                        : false
                    }
                    onClick={() => SubmitOtherDepartment()}
                  >
                    {OtherDepartmentLoader ? (
                      <span className="loaderwait">Please Wait...</span>
                    ) : (
                      <span>Refer to Other Department</span>
                    )}
                  </button>
                ) : (
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
                )}
              </div>

              {/* pdf-preview data start Arun Verma Final Pdf Generation and Preview */}
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
                              letterSpacing: "0.01px",
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
                            letterSpacing: "0.01px",
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
                            letterSpacing: "0.01px",
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
                          <br></br>
                          {applicationDetail?.bankAddress2 != null ||
                          applicationDetail?.bankAddress2 != ""
                            ? applicationDetail?.bankAddress2 + "," + " "
                            : ""}
                          <br></br>
                          {applicationDetail?.bankAddress3 != null ||
                          applicationDetail?.bankAddress3 != ""
                            ? applicationDetail?.bankAddress3
                            : ""}
                          <br />
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
                            letterSpacing: "0.01px",
                          }}
                        >
                          Dear{" "}
                          {applicationDetail?.companyName == null ||
                          applicationDetail?.companyName == ""
                            ? applicationDetail?.name
                            : applicationDetail?.companyName}
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
                                    letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
                                }}
                              >
                                :{" "}
                                {applicationDetail?.companyName == null ||
                                applicationDetail?.companyName == ""
                                  ? applicationDetail?.name
                                  : applicationDetail?.companyName}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Date Submitted
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
                                }}
                              >
                                USD Equivalent
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
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Status/Decision
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                :{" "}
                                {applicationstaus == "10"
                                  ? "Approved"
                                  : applicationstaus == "30"
                                  ? "Rejected"
                                  : applicationstaus == "40"
                                  ? "Deferred"
                                  : applicationstaus == "25"
                                  ? "Cancelled"
                                  : ""}
                                {/* {applicationDetail?.statusName} */}
                              </td>
                            </tr>
                            <tr
                              className={
                                applicationDetail?.expiringDate == null ||
                                applicationDetail?.expiringDate == ""
                                  ? "d-none"
                                  : ""
                              }
                            >
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Expiry Date
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  letterSpacing: "0.01px",
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
                            <tr
                              className={
                                applicationDetail?.returnFrequencyName ==
                                  null ||
                                applicationDetail?.returnFrequencyName == ""
                                  ? "d-none"
                                  : ""
                              }
                            >
                              <td
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  color: "#000",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Returns Frequency
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  letterSpacing: "0.01px",
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
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  Returns Date
                                </td>
                                <td
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    letterSpacing: "0.01px",
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
                                            letterSpacing: "0.01px",
                                          }}
                                        >
                                          Response / Conditions
                                        </span>
                                      </div>
                                      <div
                                        className="tableEditorData"
                                        dangerouslySetInnerHTML={{
                                          __html: Description
                                            ? Description
                                            : applicationDetail?.analystDescription,
                                        }}
                                        style={{ letterSpacing: "0.01px" }}
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
                                    letterSpacing: "0.01px",
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
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername?.replace(/"/g, "")
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
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename?.replace(/"/g, "")
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
                                  {applicationDetail?.copiedResponses?.length ||
                                  selectedBanks?.length > 0 ? (
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
                                        {selectedBanks.map((item) => {
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

              {/* Supervisor level final close application Arun Verma */}
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
                              letterSpacing: "0.01px",
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
                            letterSpacing: "0.01px",
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
                            letterSpacing: "0.01px",
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
                          <br></br>
                          {applicationDetail?.bankAddress2 != null ||
                          applicationDetail?.bankAddress2 != ""
                            ? applicationDetail?.bankAddress2 + "," + " "
                            : ""}
                          <br></br>
                          {applicationDetail?.bankAddress3 != null ||
                          applicationDetail?.bankAddress3 != ""
                            ? applicationDetail?.bankAddress3
                            : ""}
                          <br />
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
                            letterSpacing: "0.01px",
                          }}
                        >
                          Dear{" "}
                          {applicationDetail?.companyName == null ||
                          applicationDetail?.companyName == ""
                            ? applicationDetail?.name
                            : applicationDetail?.companyName}
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
                                    letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
                                }}
                              >
                                :{" "}
                                {applicationDetail?.companyName == null ||
                                applicationDetail?.companyName == ""
                                  ? applicationDetail?.name
                                  : applicationDetail?.companyName}
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Date Submitted
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
                                }}
                              >
                                USD Equivalent
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
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Status/Decision
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                :{" "}
                                {applicationstaus == "10"
                                  ? "Approved"
                                  : applicationstaus == "30"
                                  ? "Rejected"
                                  : applicationstaus == "40"
                                  ? "Deferred"
                                  : applicationstaus == "25"
                                  ? "Cancelled"
                                  : ""}
                                {/* {applicationDetail?.statusName} */}
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
                                            letterSpacing: "0.01px",
                                          }}
                                        >
                                          Description
                                        </span>
                                      </div>
                                      <div
                                        className="tableEditorData"
                                        dangerouslySetInnerHTML={{
                                          __html: asignnextLeveldata
                                            ? // ? asignnextLeveldata.Notes
                                              Description
                                            : "",
                                        }}
                                        style={{
                                          paddingBottom: "60px",
                                          letterSpacing: "0.01px",
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
                                    letterSpacing: "0.01px",
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
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername?.replace(/"/g, "")
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
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename?.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    letterSpacing: "0.01px",
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
              {/* coveri letter data end Arun Verma */}

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
                              letterSpacing: "0.01px",
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
                            letterSpacing: "0.01px",
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
                            letterSpacing: "0.01px",
                          }}
                        >
                          The Head - Exchange Control
                          <br />
                          {applicationDetail?.bankName
                            ? applicationDetail?.bankName
                            : ""}
                          {applicationDetail?.bankName == null ? (
                            <span>
                              Reserve Bank of Zimbabwe. 80 Samora Machel Avenue,{" "}
                              <br /> P.O. Box 1283, Harare, Zimbabwe.
                            </span>
                          ) : (
                            <>
                              <br />
                              {applicationDetail?.bankAddress1 != null ||
                              applicationDetail?.bankAddress1 != ""
                                ? applicationDetail?.bankAddress1 + "," + " "
                                : ""}
                              <br></br>
                              {applicationDetail?.bankAddress2 != null ||
                              applicationDetail?.bankAddress2 != ""
                                ? applicationDetail?.bankAddress2 + "," + " "
                                : ""}
                              <br></br>
                              {applicationDetail?.bankAddress3 != null ||
                              applicationDetail?.bankAddress3 != ""
                                ? applicationDetail?.bankAddress3
                                : ""}
                              <br />
                            </>
                          )}
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
                            letterSpacing: "0.01px",
                          }}
                        >
                          Dear{" "}
                          {applicationDetail?.companyName == null ||
                          applicationDetail?.companyName == ""
                            ? applicationDetail?.name
                            : applicationDetail?.companyName}
                          {console.log(applicationDetail)},
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
                                    letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
                                }}
                              >
                                :{" "}
                                {applicationDetail?.companyName == null ||
                                applicationDetail?.companyName == ""
                                  ? applicationDetail?.name
                                  : applicationDetail?.companyName}
                                {console.log(applicationDetail)}
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
                                  letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Status/Decision
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                :{" "}
                                {applicationstaus == "10"
                                  ? "Approved"
                                  : applicationstaus == "30"
                                  ? "Rejected"
                                  : applicationstaus == "40"
                                  ? "Deferred"
                                  : applicationstaus == "25"
                                  ? "Cancelled"
                                  : ""}
                                {/* {applicationDetail?.statusName} */}
                              </td>
                            </tr>
                            <tr
                              className={
                                applicationDetail?.expiringDate == null ||
                                applicationDetail?.expiringDate == ""
                                  ? "d-none"
                                  : ""
                              }
                            >
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Expiry Date
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  letterSpacing: "0.01px",
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
                            <tr
                              className={
                                applicationDetail?.returnFrequencyName ==
                                  null ||
                                applicationDetail?.returnFrequencyName == ""
                                  ? "d-none"
                                  : ""
                              }
                            >
                              <td
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  color: "#000",
                                  letterSpacing: "0.01px",
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
                                    letterSpacing: "0.01px",
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
                                        className="tableEditorData"
                                        dangerouslySetInnerHTML={{
                                          __html: Description
                                            ? Description
                                            : applicationDetail?.analystDescription,
                                        }}
                                        style={{
                                          paddingBottom: "60px",
                                          letterSpacing: "0.01px",
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
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername?.replace(/"/g, "")
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
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename?.replace(/"/g, "")
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
                                  {applicationDetail?.copiedResponses?.length ||
                                  selectedBanks?.length > 0 ? (
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
                                        {selectedBanks.map((item) => {
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
                              letterSpacing: "0.01px",
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
                            letterSpacing: "0.01px",
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
                            letterSpacing: "0.01px",
                          }}
                        >
                          The Head - Exchange Control
                          <br />
                          {applicationDetail?.bankName
                            ? applicationDetail?.bankName
                            : ""}
                          {applicationDetail?.bankName == null ? (
                            <span>
                              Reserve Bank of Zimbabwe. 80 Samora Machel Avenue,{" "}
                              <br /> P.O. Box 1283, Harare, Zimbabwe.
                            </span>
                          ) : (
                            <>
                              <br />
                              {applicationDetail?.bankAddress1 == null ||
                              applicationDetail?.bankAddress1 == ""
                                ? ""
                                : applicationDetail?.bankAddress1 + "," + " "}
                              <br></br>
                              {applicationDetail?.bankAddress2 == null ||
                              applicationDetail?.bankAddress2 == ""
                                ? ""
                                : applicationDetail?.bankAddress2 + "," + " "}
                              <br></br>
                              {applicationDetail?.bankAddress3 != null ||
                              applicationDetail?.bankAddress3 != ""
                                ? applicationDetail?.bankAddress3
                                : ""}
                              <br />
                            </>
                          )}
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
                            letterSpacing: "0.01px",
                          }}
                        >
                          Dear{" "}
                          {applicationDetail?.companyName == null ||
                          applicationDetail?.companyName == ""
                            ? applicationDetail?.name
                            : applicationDetail?.companyName}
                          {console.log(applicationDetail)},
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
                                    letterSpacing: "0.01px",
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
                                  letterSpacing: "0.01px",
                                }}
                              >
                                :{" "}
                                {moment(
                                  applicationDetail?.applicationSubmittedDate
                                ).format("DD MMMM  YYYY")}
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
                                          Description
                                        </span>
                                      </div>
                                      <div
                                        className="tableEditorData"
                                        dangerouslySetInnerHTML={{
                                          __html: Description
                                            ? Description
                                            : applicationDetail?.analystDescription,
                                        }}
                                        style={{
                                          paddingBottom: "60px",
                                          letterSpacing: "0.01px",
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
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername?.replace(/"/g, "")
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
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename?.replace(/"/g, "")
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
                                  {applicationDetail?.copiedResponses?.length ||
                                  selectedBanks?.length > 0 ? (
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
                                        {selectedBanks.map((item) => {
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

              {OtherDepartmentPopup == true ? (
                <UpdatePopupMessage
                  heading={heading1}
                  para={para1}
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
