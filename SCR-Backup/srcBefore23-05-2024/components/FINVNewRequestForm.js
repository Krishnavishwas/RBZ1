import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import Select from "react-select";
import moment from "moment";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Modal from "react-bootstrap/Modal";
import ExportDashboardViewDetails from "./ExportDashboardViewDetails";
import UpdatePopupMessage from "./UpdatePopupMessage";

const FINVNewRequestForm = () => {
  const navigate = useNavigate();
  const {
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData, 
    countries,
  } = ExportformDynamicField();

  const BPNCodeRef = useRef(null);
  const TINRef = useRef(null);
  const amountRef = useRef(null);
  const applicantRef = useRef(null);
  const BeneficiaryNameRef = useRef(null);
  const applicantCommentsRef = useRef(null);
  const applicantReferenceNumberRef = useRef(null);
  const applicationTypeRef = useRef(null);
  const applicationSubTypeRef = useRef(null);
  const bankSupervisorRef = useRef(null);
  const companyNameRef = useRef(null);
  const currencyRef = useRef(null);
  const govtAgencieRef = useRef(null);
  const sectorRef = useRef(null);
  const subsectorRef = useRef(null);
  const typeExporterRef = useRef(null); //delete
  const rateRef = useRef(null);
  const usdEquivalentRef = useRef(null);

  const relatedapplicationreferenceNumberRef = useRef(null); //delete
  const purposeApplicationRef = useRef(null);
  const banknameRef = useRef(null);

  const UserID = Storage.getItem("userID");
  const roleID = Storage.getItem("roleIDs");
  const bankID = Storage.getItem("bankID");
  const userName = Storage.getItem("userName");
  const bankName = Storage.getItem("bankName");
  const bankidcheck = bankID !== "" ? "1" : "3";

  const [startDate, setStartDate] = useState(new Date());
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState(null);
  const [userRole, setUserrole] = useState([]);
  const [selectuserRole, setselectuserRole] = useState("");
  const [getalluser, setGetalluser] = useState([]);
  const [registerusertype, setregisterusertype] = useState(bankidcheck);
  const [submitbuttonhide, setsubmitbuttonhide] = useState(false);
  const [updatepopup, setupdatepopup] = useState(false);

  const [FINForm, setFINForm] = useState({
    UserID: UserID.replace(/"/g, ""),
    user: "",
    bankName: bankName,
    typeFIN: "",
    BeneficiaryName: "",
    baneficiaryCountry: "",
    govtAgencie: "",
    BPNCode: "",
    TINNumber: "",
    applicant: "",
    applicantReferenceNumber: "",
    applicationType: "",
    applicationSubType: "",
    exporterType: registerusertype,
    currency: "",
    amount: "",
    rate: "",
    usdEquivalent: "",
    relatedapplicationreferenceNumber: "",
    sector: "",
    subsector: "",
    applicantComments: "",
    bankSupervisor: "",
  });
  const heading = "Application Submitted Successfully!";
  const para = "Export application request submitted successfully!";
  const [files, setFiles] = useState([]);
  const [otherfiles, setOtherfiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [applicationType, setapplicationType] = useState([]);
  const [applicationSubType, setapplicationSubType] = useState([]);
  const [subsectorData, setsubsectorData] = useState([]);
  const [curRate, setCurrate] = useState();
  const [checkSupervisor, setcheckSupervisor] = useState(roleID == 4 ? true : false);
  const [attachmentData, setAttachmentData] = useState([]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");

  const [ValidateRBZ, setValidateRBZ] = useState([]);
  const [loader, setLoader] = useState(false);
  const [ValidateShow, setValidateShow] = useState(false);
  const [ValidateChange, setValidateChange] = useState({
    relatedexchangeControlNumber: "",
  });

  const [getBankID, setGetBankID] = useState("");
const [Supervisors, setSupervisors] = useState([])
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [tatHistory, setTatHistory] = useState([]);
  const [allcomment, setallcomment] = useState([]);
  const [noDataComment, setNoDataComment] = useState([]);
  const [responceCount, setresponceCount] = useState([]);
  const handleFormClose = () => setShowUpdateModal(false);
  const Navigate = useNavigate();
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
  ];
  const relatedexchangeControlNumberRef = useRef(null);


  const handeSupervisor = async ()=>{

    await axios
      .post(APIURL + "User/GetSupervisors", {
        BankID: bankID,
        UserID: UserID,
        DepartmentID:"4",
        RoleID: roleID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setSupervisors(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
          setSupervisors([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }

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
    if (name == "relatedexchangeControlNumber" && specialChars.test(value)) {
      newErrors.pknnumber = "Special characters not allowed";
      valid = false;
    } else if (name == "relatedexchangeControlNumber" && value == " ") {
      newErrors.pknnumber = "First character cannot be a blank space";
      valid = false;
    } else {
      setValidateChange({ ...ValidateChange, [name]: value });
    }
    setErrors(newErrors);
  };

  const changeHandelForm = (e) => {
    let newErrors = {};
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    const name = e.target.name;
    const value = e.target.value;
    if (name === "TINNumber" && value.charAt(0) === " ") {
      newErrors.TINNumber = "First character cannot be a blank space";
    } else if (
      name === "TINNumber" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("`") ||
        value?.includes("~") ||
        value?.includes("]"))
    ) {
      newErrors.TINNumber = "special characters not allowed";
    } else if (
      name === "relatedapplicationreferenceNumber" &&
      value.charAt(0) === " "
    ) {
      newErrors.relatedapplicationreferenceNumber =
        "First character cannot be a blank space";
    } else if (
      name === "relatedapplicationreferenceNumber" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("`") ||
        value?.includes("~") ||
        value?.includes("]"))
    ) {
      newErrors.relatedapplicationreferenceNumber =
        "special characters not allowed";
    } else if (name === "applicant" && value.charAt(0) === " ") {
      newErrors.applicant = "First character cannot be a blank space";
    } else if (
      name === "applicant" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("`") ||
        value?.includes("~") ||
        value?.includes("]"))
    ) {
      newErrors.applicant = "special characters not allowed";
    } else if (name === "BeneficiaryName" && value.charAt(0) === " ") {
      newErrors.BeneficiaryName = "First character cannot be a blank space";
    } else if (
      name === "BeneficiaryName" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("-") ||
        value?.includes("`") ||
        value?.includes("~") ||
        value?.includes("/"))
    ) {
      newErrors.BeneficiaryName = "special characters not allowed";
    } else if (name === "BPNCode" && value.charAt(0) === " ") {
      newErrors.BPNCode = "First character cannot be a blank space";
    } else if (
      name === "BPNCode" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("`") ||
        value?.includes("~") ||
        value?.includes("]"))
    ) {
      newErrors.BPNCode = "special characters not allowed";
    } else if (name === "applicantComments" && value.charAt(0) === " ") {
      newErrors.applicantComments = "First character cannot be a blank space";
    } else if (name === "amount" && value.length > 10) {
      newErrors.amount = "Max 10 digit allow";
    } else {
      setFINForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setErrors(newErrors);

    if (name === "sector" && value !== "") {
      axios
        .post(APIURL + "Master/GetSubSectorBySectorID", {
          SectorID: value,
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
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
    if (name === "currency" && value !== "") {
      axios
        .post(APIURL + "Master/GetRateByCurrencyID", {
          Id: value,
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
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
          ApplicationTypeID: value !== "" ? value : -1,
          ApplicationSubTypeID: "0",
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
            setAttachmentData(res.data.responseData);
          } else {
            setAttachmentData([]);
            setFiles([]);
            setOtherfiles([]);
            setOtherfilesupload([]);
          }
        });
    }
    if (name === "applicationType") {
      axios
        .post(APIURL + "Admin/GetSubApplicationTypeByApplicationTypeID", {
          ID: value,
        })
        .then((res) => {
          console.log(
            "res--Nature of Application(Consultancy Service Agreements)",
            res
          );
          if (res.data.responseCode === "200") {
            setapplicationSubType(res.data.responseData);
          } else {
            setAttachmentData([]);
            setFiles([]);
            setOtherfiles([]);
            setOtherfilesupload([]);
          }
        });
    }
    if (name == "applicationSubType") {
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
            setOtherfiles([]);
            setOtherfilesupload([]);
          }
        });
    }
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

  const convertedRate = curRate * parseFloat(FINForm.amount);

  const GetApplicationTypes = async () => {
    await axios
      .post(APIURL + "Master/GetApplicationTypesByDepartmentID", {
        DepartmentID: "4",
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

  const removeUserImage = (label) => {
    const updatedUserFile = files?.filter((item) => item.label !== label);
    setFiles(updatedUserFile);
  };

   
  const clearInputFile = (index) => { 
    
    if (fileInputRefs[index]?.current) fileInputRefs[index].current.value = "";
  };

  const clearInputFileother = (index) =>{
    if (fileInputRefsother[index]?.current) fileInputRefsother[index].current.value = "";
   }
   
  const getRoleHandle = async () => {
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: "4",
        Status: "35",
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

  // ----- Start Code For Open Poup
  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };
  // ----- End Code For Open Poup
  // ----- Start Code For Geting Table Data
  const action = (rowData) => {
    return bankName.replace(/"/g, "") == rowData?.bankName ? (
      <>
        <i
          className="pi pi-eye p-0"
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
        {rowData.filePath ? (
          <Link to={rowData.filePath} target="_blank">
            <i
              className="pi pi-download p-2 nav-link p-0"
              style={{ padding: "12px", marginLeft: "6px", cursor: "pointer" }}
              aria-disabled
              onMouseEnter={(e) => {
                e.target.style.color = "var(--primary-color)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "";
              }}
            ></i>{" "}
          </Link>
        ) : (
          ""
        )}
      </>
    ) : (
      <i
        className="pi pi-eye p-0"
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
          <i class="bi bi-x-circle"></i>
        </button>
      </div>
    );
  };
  const footer = renderFooter();
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
  // ----- End Code For Geting Table Data
  useEffect(() => {
    getRoleHandle();
  }, []);

  const supervisorHangechangeRole = (e) => {
    const value = e.target.value;
    setErrors({});
    setselectuserRole(value);
    if (value == "") {
      setGetalluser([]);
    } else {
      axios
        .post(APIURL + "User/GetUsersByRoleID", {
          RoleID: value,
          DepartmentID: "4",
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

  useEffect(() => {
    GetApplicationTypes();
  }, []);

  const handleUsertype = (e) => {
    setregisterusertype(e.target.value);
  };

  const handleAddMore = (e) => {
    setOtherfiles([...otherfiles, null]);
  };

  const handleFileChange = (e, label) => {
    const file = e.target.files[0];
    const index = files.findIndex((item) => item.label === label);
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

  const handleOthrefile = (e, id) => {
    const otherfile = e.target.files[0];
    setOtherfilesupload([...otherfilesupload, { otherfile, id }]);
  };

  const HandelSupervisorcheck = (e) => {
    setcheckSupervisor(!checkSupervisor);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    if (
      registerusertype === "1" &&
      (getCompanyName === "" ||
        getCompanyName === "Company Name" ||
        getCompanyName == null)
    ) {
      newErrors.companyName = "Company name is required";
      valid = false;
    }
    if (FINForm.applicationType === "") {
      newErrors.applicationType = "Application type is required";
      valid = false;
    }
    if (
      bankID === "" &&
      registerusertype == "3" &&
      FINForm.govtAgencie === ""
    ) {
      newErrors.govtAgencie = "Government agencies name is required";
      valid = false;
    }
    if (registerusertype == "2" && FINForm.applicant === "") {
      newErrors.applicant = "Applicant name is required";
      valid = false;
    }
    // if (FINForm.relatedapplicationreferenceNumber === "") {
    //   newErrors.relatedapplicationreferenceNumber =
    //     "Related Application Reference Number is required";
    //   valid = false;
    // }
    if (FINForm.currency === "") {
      newErrors.currency = "Currency is required";
      valid = false;
    }
    if (FINForm.amount === "") {
      newErrors.amount = "Amount is required";
      valid = false;
    }
    if (startDate == null) {
      newErrors.date = "Application Date is required";
      valid = false;
    }
    if (FINForm.sector === "") {
      newErrors.sector = "Sector is required";
      valid = false;
    }
    if (FINForm.subsector === "" && FINForm.sector != 2) {
      newErrors.subsector = "Subsector is required";
      valid = false;
    }
    if (FINForm.applicantComments === "") {
      newErrors.applicantComments = "Applicant comments is required";
      valid = false;
    }
    if (checkSupervisor === true && FINForm.bankSupervisor === "") {
      newErrors.bankSupervisor = "Bank supervisor is required";
      valid = false;
    }
    if (checkSupervisor == true && selectuserRole == "" && roleID == 4) {
      newErrors.selectuserRole = "Role is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleChangecompany = (selectedOption) => {
    setgetCompanyName(selectedOption);
  };

  const handleInputChangecompany = (input) => {
    setInputValue(input);
    if (input.length >= 3) {
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

  const filtertin_bpn = companies?.find((company) => {
    if (company.id === getCompanyName?.value) {
      return {
        getbpn: company.bpnNumber,
        gettin: company.tinNumber,
      };
    }
  });

  console.log("filtertin_bpn", filtertin_bpn);

  const handleClear = () => {
    setValue(null);
    setInputValue("");
    setOptions([]);
  };

  const generateRandomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };

  const HandleSubmit = async (e) => {
    setsubmitbuttonhide(true);

    let formData = new FormData();

    e.preventDefault();
    const randomNumber = generateRandomNumber();
    const generatedNumber = `FIN/${userName
      .toUpperCase()
      .replace(/"/g, "")}NMBLZWHX/018363${randomNumber}`;

    if (validateForm()) {
      await axios
        .post(APIURL + "FINApplication/CreateFINApplication", {
          UserID: UserID.replace(/"/g, ""),
          BankID: bankID,
          DepartmentID: "2",
          ApplicationDate: moment(startDate).format("YYYY-MM-DD"),
          RBZReferenceNumber: generatedNumber,
          RelatedApplicationReferenceNumber:
            ValidateChange.relatedexchangeControlNumber.trim(),
          Name:
            registerusertype === "2" && bankID !== "" ? FINForm.applicant : "",
          CompanyID:
            registerusertype === "1" && bankID !== ""
              ? getCompanyName?.value
              : "",
          ApplicantType: registerusertype,
          ApplicationTypeID: FINForm.applicationType,
          ApplicationSubTypeID: FINForm.applicationSubType,
          BeneficiaryName: FINForm.BeneficiaryName,
          BeneficiaryCountry: FINForm.baneficiaryCountry,
          BPNCode:
            registerusertype === "1" && bankID !== ""
              ? filtertin_bpn?.bpnNumber?.toUpperCase()
              : "",
          TINNumber:
            registerusertype === "1" && bankID !== ""
              ? filtertin_bpn?.tinNumber?.toUpperCase()
              : "",
          Currency: FINForm.currency,
          Amount: FINForm.amount,
          Rate: curRate,
          USDEquivalent: convertedRate.toFixed(2),
          Sector: FINForm.sector,
          SubSector: FINForm.subsector,
          ApplicantComment: FINForm.applicantComments,
          AssignedTo: checkSupervisor === true ? FINForm.bankSupervisor : "",
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
            setsubmitbuttonhide(false);
            setupdatepopup(true);

            for (let i = 0; i < files?.length; i++) {
              // Corrected loop condition
              formData.append("files", files[i].file);
              formData.append("Label", files[i].label);
            }

            formData.append(
              "RBZReferenceNumber",
              res.data.responseData.rbzReferenceNumber
            );
            formData.append("ApplicationID", res.data.responseData.id);
            formData.append("DepartmentID", "4");
            formData.append("UserID", UserID.replace(/"/g, ""));

            axios
              .post(ImageAPI + "File/UploadFile", formData)
              .then((res) => {
                console.log("res99999");
              })
              .catch((err) => {
                console.log("file Upload ", err);
              });

            Storage.setItem(
              "generatedNumber",
              res.data.responseData.rbzReferenceNumber
            );

             
          } else {
            toast.error(res.data.responseMessage);
            setsubmitbuttonhide(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setsubmitbuttonhide(false);
        });

      setFINForm({
        user: "",
        applicantYear: "2024",
        bankName: bankName,
        typeFIN: "",
        BeneficiaryName: "",
        baneficiaryCountry: "",
        govtAgencie: "",
        BPNCode: "",
        TINNumber: "",
        applicant: "",
        applicantReferenceNumber: "",
        applicationType: "",
        applicationSubType: "",
        exporterType: registerusertype,
        currency: "",
        amount: "",
        rate: "",
        usdEquivalent: "",
        relatedapplicationreferenceNumber: "",
        sector: "",
        subsector: "",
        applicantComments: "",
        bankSupervisor: "",
      });
      if (BPNCodeRef.current) BPNCodeRef.current.value = "";
      if (TINRef.current) TINRef.current.value = "";
      if (amountRef.current) amountRef.current.value = "";
      if (applicantRef.current) applicantRef.current.value = "";
      if (applicantCommentsRef.current) applicantCommentsRef.current.value = "";
      if (BeneficiaryNameRef.current) BeneficiaryNameRef.current.value = "";
      if (applicantReferenceNumberRef.current)
        applicantReferenceNumberRef.current.value = "";
      if (applicationTypeRef.current) applicationTypeRef.current.value = "";
      if (applicationSubTypeRef.current)
        applicationSubTypeRef.current.value = "";
      if (bankSupervisorRef.current) bankSupervisorRef.current.value = "";
      if (companyNameRef.current) companyNameRef.current.value = "";
      if (currencyRef.current) currencyRef.current.value = "";
      if (govtAgencieRef.current) govtAgencieRef.current.value = "";
      if (sectorRef.current) sectorRef.current.value = "";
      if (subsectorRef.current) subsectorRef.current.value = "";
      if (typeExporterRef.current) typeExporterRef.current.value = "";
      if (usdEquivalentRef.current) usdEquivalentRef.current.value = "";
      if (rateRef.current) rateRef.current.value = "";
      if (relatedapplicationreferenceNumberRef.current)
        relatedapplicationreferenceNumberRef.current.value = "";
    } else {
      if (!toastDisplayed) {
        toast.warning("Please fill all mandatory fields");
      }
      setToastDisplayed(true);
    }
  };

  const closePopupHandle = () => {
    Navigate("/FINVDashboard");
    setupdatepopup(false);
    setGetBankID("");
    setFINForm({
      UserID: UserID.replace(/"/g, ""),
      user: "",
      bankName: bankName,
      typeFIN: "",
      BeneficiaryName: "",
      baneficiaryCountry: "",
      govtAgencie: "",
      BPNCode: "",
      TINNumber: "",
      applicant: "",
      applicantReferenceNumber: "",
      applicationType: "",
      applicationSubType: "",
      exporterType: registerusertype,
      currency: "",
      amount: "",
      rate: "",
      usdEquivalent: "",
      relatedapplicationreferenceNumber: "",
      sector: "",
      subsector: "",
      applicantComments: "",
      bankSupervisor: "",
    });
    if (applicantRef.current) applicantRef.current.value = "";
    if (BeneficiaryNameRef.current) BeneficiaryNameRef.current.value = "";
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
    if (bankSupervisorRef.current) bankSupervisorRef.current.value = "";
    if (companyNameRef.current) companyNameRef.current.value = "";
    if (currencyRef.current) currencyRef.current.value = "";
    if (govtAgencieRef.current) govtAgencieRef.current.value = "";

    if (purposeApplicationRef.current) purposeApplicationRef.current.value = "";
    if (relatedexchangeControlNumberRef.current)
      relatedexchangeControlNumberRef.current.value = "";
    if (sectorRef.current) sectorRef.current.value = "";
    if (subsectorRef.current) subsectorRef.current.value = "";

    if (typeExporterRef.current) typeExporterRef.current.value = "";
    if (usdEquivalentRef.current) usdEquivalentRef.current.value = "";

    if (rateRef.current) rateRef.current.value = "";
    if (banknameRef.current) banknameRef.current.value = "";
  };

  const ResetHandleData = () => {
    setgetCompanyName(null);
    setGetalluser([]);
    setselectuserRole("");

    setFINForm({
      user: "",
      applicantYear: "2024",
      bankName: bankName,
      typeFIN: "",
      BeneficiaryName: "",
      baneficiaryCountry: "",
      govtAgencie: "",
      BPNCode: "",
      TINNumber: "",
      applicant: "",
      applicantReferenceNumber: "",
      applicationType: "",
      applicationSubType: "",
      exporterType: registerusertype,
      currency: "",
      amount: "",
      rate: "",
      usdEquivalent: "",
      relatedapplicationreferenceNumber: "",
      sector: "",
      subsector: "",
      applicantComments: "",
      bankSupervisor: "",
    });
    if (BPNCodeRef.current) BPNCodeRef.current.value = "";
    if (TINRef.current) TINRef.current.value = "";
    if (amountRef.current) amountRef.current.value = "";
    if (applicantRef.current) applicantRef.current.value = "";
    if (applicantCommentsRef.current) applicantCommentsRef.current.value = "";
    if (applicantReferenceNumberRef.current)
      applicantReferenceNumberRef.current.value = "";
    if (applicationTypeRef.current) applicationTypeRef.current.value = "";
    if (applicationSubTypeRef.current) applicationSubTypeRef.current.value = "";
    if (bankSupervisorRef.current) bankSupervisorRef.current.value = "";
    if (companyNameRef.current) companyNameRef.current.value = "";
    if (currencyRef.current) currencyRef.current.value = "";
    if (govtAgencieRef.current) govtAgencieRef.current.value = "";
    if (sectorRef.current) sectorRef.current.value = "";
    if (subsectorRef.current) subsectorRef.current.value = "";
    if (typeExporterRef.current) typeExporterRef.current.value = "";
    if (usdEquivalentRef.current) usdEquivalentRef.current.value = "";
    if (rateRef.current) rateRef.current.value = "";
    setOtherfilesupload([]);
    setFiles([]);
    setErrors({});
    setregisterusertype(bankidcheck);
  };

  useEffect(() => {
    if (toastDisplayed) {
      setTimeout(() => {
        setToastDisplayed(false);
      }, 1500);
    }
  }, [toastDisplayed]);

  const GetApplicationTypeName = applicationType.find(
    (option) => option.id == FINForm.applicationType
  );

  return (
    <>
      <form>
        <div className="inner_form_new ">
          <label className="controlform">User</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="user"
                value={userName.replace(/"/g, "")}
                disabled
              />
              <span className="sspan"></span>
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
                value={bankName.replace(/"/g, "")}
                disabled
              />
              <span className="sspan"></span>
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Type of Importer</label>
          <div className="form-bx-radio">
            {applicantTypes.map((item, index) => {
              return (
                <>
                  <label
                    key={index}
                    className={
                      bankID != "" && item.id === 3
                        ? "cur-dis"
                        : bankidcheck == "3"
                        ? "cur-dis"
                        : ""
                    }
                  >
                    <input
                      type="radio"
                      ref={typeExporterRef}
                      onChange={(e) => {
                        changeHandelForm(e);
                        handleUsertype(e);
                      }}
                      name="importType"
                      value={item.id}
                      checked={registerusertype == item.id}
                      className={
                        bankID != "" && item.id === 3
                          ? "cur-dis"
                          : bankidcheck == "3"
                          ? "cur-dis"
                          : ""
                      }
                      disabled={
                        bankID !== "" && item.id == 3
                          ? true
                          : bankidcheck == "3"
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
        {/* end form-bx  */}

        {registerusertype === "1" && bankID !== "" ? (
          <>
            <div className="inner_form_new ">
              <label className="controlform">Company Name</label>
              <div className="form-bx">
                <Select
                  placeholder="Select company name"
                  value={getCompanyName}
                  onChange={handleChangecompany}
                  onInputChange={handleInputChangecompany}
                  options={options}
                  isSearchable
                  noOptionsMessage={({ inputValue }) =>
                    inputValue.length > 3
                      ? "No company found"
                      : "Type to search"
                  }
                  onMenuClose={handleClear}
                  className="selectinput"
                />
                {errors.companyName &&
                (getCompanyName === "Company Name" ||
                  getCompanyName == null) ? (
                  <small className="errormsg2">{errors.companyName}</small>
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
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    placeholder="TIN Number"
                    // value={exportForm.TINNumber?.trim()}
                    value={
                      filtertin_bpn ? filtertin_bpn?.tinNumber : "TIN Number"
                    }
                    disabled
                    className={filtertin_bpn?.tinNumber ? "text-uppercase" : ""}
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
                    min={0}
                    name="BPNCode"
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    // value={exportForm?.BPNCode?.trim()}
                    value={
                      filtertin_bpn ? filtertin_bpn?.bpnNumber : "BPN Code"
                    }
                    placeholder="BPN Code"
                    className={
                      errors.BPNCode
                        ? "error text-uppercase"
                        : filtertin_bpn?.bpnNumber
                        ? "text-uppercase"
                        : ""
                    }
                    disabled
                  />
                  <span className="sspan"></span>
                  {errors.BPNCode && filtertin_bpn?.bpnNumber == "" ? (
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
        {/* end form-bx  */}

        {registerusertype === "2" && bankID !== "" ? (
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
                    placeholder="Applicant"
                    value={FINForm.applicant}
                    className={errors.applicant ? "error" : ""}
                  />
                  <span className="sspan"></span>
                  {errors.applicant || FINForm.applicant === "" ? (
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
        {/* end form-bx  */}
        <div className="inner_form_new ">
          <label className="controlform">Application Date</label>
          <div className="form-bx">
            <DatePicker
              closeOnScroll={(e) => e.target === document}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              peekNextMonth
              placeholderText={
                startDate == null
                  ? moment(new Date()).format("DD/MMM/YYYY")
                  : startDate
              }
              minDate="01/01/2018"
              showMonthDropdown
              maxDate={new Date()}
              showYearDropdown
              dropdownMode="select"
              keyboard={false}
              dateFormat="dd/MMM/yyyy"
            />
            <span className="sspan"></span>
            {errors.date || startDate == null ? (
              <small className="errormsg" style={{ bottom: "-10px" }}>
                {/* {errors.date} */}
                Application Date is required
              </small>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Application Category</label>
          <div className="form-bx">
            <label>
              <select
                ref={applicationTypeRef}
                name="applicationType"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                className={
                  errors.applicationType && FINForm.applicationType === ""
                    ? "error"
                    : ""
                }
              >
                <option value="">Application Category</option>
                {applicationType?.map((item, ind) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name} 
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
              {errors.applicationType && FINForm.applicationType === "" ? (
                <small className="errormsg">{errors.applicationType}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}
        {FINForm.applicationType !== "" ? (
          <div className="inner_form_new ">
            <label className="controlform">
              Nature of Application
              {GetApplicationTypeName?.name !== ""
                ? `(${GetApplicationTypeName.name})`
                : ""}
            </label>
            <div className="form-bx">
              <label>
                <select
                  ref={applicationSubTypeRef}
                  name="applicationSubType"
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  className={
                    errors.applicationSubType &&
                    FINForm.applicationSubType === ""
                      ? "error"
                      : ""
                  }
                >
                  <option value="">Select Nature of Application</option>
                  {applicationSubType?.map((item, ind) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <span className="sspan"></span>
                {errors.applicationSubType &&
                FINForm.applicationSubType === "" ? (
                  <small className="errormsg">
                    {errors.applicationSubType}
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

        <div className="inner_form_new ">
          <label className="controlform">Beneficiary Name</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                ref={BeneficiaryNameRef}
                name="BeneficiaryName"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder="Beneficiary Name"
                value={FINForm.BeneficiaryName}
              />
              <span className="sspan"></span>
              {errors.BeneficiaryName || FINForm.BeneficiaryName === "" ? (
                <small className="errormsg">{errors.BeneficiaryName}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Baneficiary Country</label>
          <div className="form-bx">
            <label>
              <select
                name="baneficiaryCountry"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                // className={
                //   errors.baneficiaryCountry && FINForm.baneficiaryCountry === ""
                //     ? "error"
                //     : ""
                // }
              >
                <option value="">Select Baneficiary Country</option>
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
        {/* end form-bx  */}

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
                    errors.govtAgencie && FINForm.govtAgencie === ""
                      ? "error"
                      : ""
                  }
                >
                  <option value="">Select Government Agencies Name</option>
                  {GovernmentAgencies?.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>
                        {item.agencyName}
                      </option>
                    );
                  })}
                </select>
                <span className="sspan"></span>
                {errors.govtAgencie && FINForm.govtAgencie === "" ? (
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
        {/* end form-bx  */}

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
                      errors.currency && FINForm.currency === "" ? "error" : ""
                    }
                  >
                    <option value="">Select Currency</option>
                    {currency?.map((cur, ind) => {
                      return (
                        <option key={cur.id} value={cur.id}>
                          {cur.currencyCode}
                        </option>
                      );
                    })}
                  </select>
                  <span className="sspan"></span>
                  {errors.currency && FINForm.currency === "" ? (
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
                    value={FINForm.amount}
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    placeholder="Amount"
                    className={
                      errors.amount && FINForm.amount === "" ? "error" : ""
                    }
                  />
                  <span className="sspan"></span>
                  {errors.amount || FINForm.amount === "" ? (
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
                    value={FINForm.currency ? curRate : "Rate"}
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
            {/* end form-bx  */}
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
                  FINForm.currency && FINForm.amount
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
        {/* end form-bx  */}

        <div className="inner_form_new align-items-start">
          <label className="controlform">
            Related Exchange Control Reference Number
          </label>

          <div className="row">
            <div className="col-md-12">
              <div className="d-flex">
                <div className="form-bx position-relative">
                  <label>
                    <input
                      ref={relatedexchangeControlNumberRef}
                      type="number"
                      min={0}
                      value={ValidateChange.relatedexchangeControlNumber.trim()}
                      name="relatedexchangeControlNumber"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        changeHandelFormValidate(e);
                      }}
                      placeholder="Related Exchange Control Reference Number"
                      className={
                        errors.pknnumber
                          ? "error"
                          : ValidateShow.relatedexchangeControlNumber
                          ? "text-uppercase"
                          : ""
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
                  {/* validate data */}

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
                            <i class="bi bi-x-circle"></i>
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
                  className="primrybtn  v-button"
                  onClick={(e) => handleValidateRBZ(e)}
                >
                  Validate
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* end form-bx  */}

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
                  errors.sector && FINForm.sector === "" ? "error" : ""
                }
              >
                <option value="">Select Sector</option>
                {sectorData?.map((item, ind) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.sectorName}
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
              {errors.sector && FINForm.sector === "" ? (
                <small className="errormsg">{errors.sector}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new">
          <label className="controlform">Subsector</label>
          <div className="form-bx">
            <label>
              <select
                ref={subsectorRef}
                name="subsector"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                disabled={FINForm.sector === "" ? true : false}
                className={
                  errors.subsector && FINForm.subsector === "" ? "error" : ""
                }
              >
                <option>Subsector</option>
                {subsectorData?.map((item, index) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.subSectorName}
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
              {errors.subsector && FINForm.subsector === "" ? (
                <small className="errormsg">{errors.subsector}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

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
                placeholder="Applicant Comments"
                className={errors.applicantComments ? "error" : ""}
              />
              <span className="sspan"></span>
              {errors.applicantComments || FINForm.applicantComments === "" ? (
                <small className="errormsg">{errors.applicantComments}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div  className={roleID == 4 ? "d-none" : "inner_form_new "}>
          <label className="controlform">Submit to Bank Supervisor</label>
          <input
            type="checkbox"
            className=""
            onChange={(e) => {
              HandelSupervisorcheck(e); handeSupervisor()
            }}
          />
        </div>
        {/* end form-bx  */}

        {checkSupervisor === true && roleID == 2 ? (
          <div className="inner_form_new ">
            <label className="controlform">Select Bank Supervisor</label>
            <div className="form-bx">
              <label>
                <select
                  ref={bankSupervisorRef}
                  name="bankSupervisor"
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  className={
                    errors.bankSupervisor && FINForm.bankSupervisor === ""
                      ? "error"
                      : ""
                  }
                >
                  <option value="" selected>
                    Select Bank Supervisor
                  </option>
                  {Supervisors?.map((item, index) => {
                    return (
                      <option key={index} value={item.userID}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <span className="sspan"></span>
                {errors.bankSupervisor && FINForm.bankSupervisor === "" ? (
                  <small className="errormsg">{errors.bankSupervisor}</small>
                ) : (
                  ""
                )}
              </label>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* end form-bx  */}

        {checkSupervisor == true && roleID == 4 ? (
          <div className="inner_form_new ">
            <label className="controlform">RBZ Record Officer Submit to</label>
            <div className="form-bx">
              <label>
                <select
                  name="SupervisorRoleId"
                  onChange={(e) => {
                    supervisorHangechangeRole(e);
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
                {errors.selectuserRole && selectuserRole === "" ? (
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
        {/* end form-bx  */}

        {checkSupervisor == true && roleID == 4 && selectuserRole ? (
          <div className="w-100">
            <div className="inner_form_new">
              <label className="controlform">User</label>

              <div className="form-bx">
                <label>
                  <select
                    ref={bankSupervisorRef}
                    name="bankSupervisor"
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    className={
                      errors.bankSupervisor && FINForm.bankSupervisor === ""
                        ? "error"
                        : ""
                    }
                  >
                    <option value="" selected>
                      Select User
                    </option>
                    {getalluser?.map((item, index) => {
                      return (
                        <option key={index} value={item.userID}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <span className="sspan"></span>
                  {errors.bankSupervisor && FINForm.bankSupervisor === "" ? (
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
        {console.log("errors", errors)}

        <h5 className="section_top_subheading mt-3">Attachments</h5>

        {attachmentData?.map((items, index) => {
          return (
            <div className="attachemt_form-bx" key={items.id}>
              <label>
                <i className="bi bi-forward"></i>
                {items.name}
              </label>
              <div className="browse-btn">
                Browse{" "}
                <input
                  type="file"
                  ref={fileInputRefs[index]}
                  onChange={(e) => handleFileChange(e, items.name)}
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
                  onClick={() => {
                    removeUserImage(items?.name);
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
        })}

        {otherfiles.map((file, index) => (
          <div key={"other" + (index + 1)} className="attachemt_form-bx">
            <label>
              <i className="bi bi-forward"></i> Other File {index + 1}
            </label>
            <div className="browse-btn">
              Browse{" "}
              <input
                type="file"
                ref={fileInputRefsother[index]}
                onChange={(e) => {
                  handleFileChange(e, "other" + (index + 1));
                  handleOthrefile(e, "other" + (index + 1));
                }}
              />
            </div>
            <span className="filename">
              {files.find((f) => f.label === "other" + (index + 1))?.file
                ?.name || "No file chosen"}
            </span>

            {files?.length &&
            files?.find((f) => f.label === "other" + (index + 1))?.file
              ?.name ? (
              <button
                type="button"
                className="remove-file"
                onClick={() => {
                  removeUserImage("other" + (index + 1));
                  clearInputFileother(index);
                }}
              >
                Remove
              </button>
            ) : (
              ""
            )}
          </div>
        ))}

        {attachmentData?.length ? (
          <button
            type="button"
            className="addmore-btn"
            onClick={(e) => handleAddMore(e)}
          >
            {" "}
            Add More File{" "}
          </button>
        ) : (
          ""
        )}

        <div className="form-footer mt-5 mb-3">
          <button
            type="reset"
            onClick={(e) => {
              ResetHandleData(e);
            }}
            className="register"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={(e) => {
              HandleSubmit(e);
            }}
            className="login"
          >
            Submit
          </button>
        </div>

        {updatepopup == true ? (
          <UpdatePopupMessage
            heading={heading}
            para={para}
            closePopupHandle={closePopupHandle}
          ></UpdatePopupMessage>
        ) : (
          ""
        )}
        
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
      {/* view modal end */}
    </>
  );
};

export default FINVNewRequestForm;
