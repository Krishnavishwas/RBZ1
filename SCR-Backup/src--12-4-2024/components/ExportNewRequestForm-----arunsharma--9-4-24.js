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

const ExportNewRequestForm = () => {
  const {
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData,
    masterBank,
    Supervisors,
    applicantName,
  } = ExportformDynamicField();

  const Navigate = useNavigate();

  const BPNCodeRef = useRef(null);
  const TINRef = useRef(null);
  const amountRef = useRef(null);
  const applicantRef = useRef(null);
  const BeneficiaryNameRef = useRef(null);
  const applicantCommentsRef = useRef(null);
  const applicantReferenceNumberRef = useRef(null);
  // const applicantYearRef = useRef(null);
  const applicationTypeRef = useRef(null);
  const bankSupervisorRef = useRef(null);
  const companyNameRef = useRef(null);
  const currencyRef = useRef(null);
  const govtAgencieRef = useRef(null);
  const purposeApplicationRef = useRef(null);

  const relatedexchangeControlNumberRef = useRef(null);
  const sectorRef = useRef(null);
  const subsectorRef = useRef(null);
  const typeExporterRef = useRef(null);
  const rateRef = useRef(null);
  const usdEquivalentRef = useRef(null);
  const banknameRef = useRef(null);

  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const userName = Storage.getItem("userName");
  const bankName = Storage.getItem("bankName");
  const roleID = Storage.getItem("roleIDs");
  const bankidcheck = bankID !== "" ? "1" : "3";

  const [startDate, setStartDate] = useState(new Date());
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState(null);
  const [updatepopup, setupdatepopup] = useState(false);
  const [userRole, setUserrole]=useState([]);
  const [selectuserRole, setselectuserRole]= useState('');
  const [submitbuttonhide, setsubmitbuttonhide] = useState(false)

  let dateApp = moment(startDate).format("DD-MM-YYYY");

  const [registerusertype, setregisterusertype] = useState(bankidcheck);
  const [exportForm, setExportForm] = useState({
    user: "",
    bankName: bankName,
    purposeApplication: "",
    typeExporter: "",
    // companyName: getCompanyName,
    // BeneficiaryName: "",
    govtAgencie: "",
    BPNCode: "",
    TINNumber: "",
    // applicant: "",
    applicantReferenceNumber: "",
    // applicantYear: "2024",
    applicationType: "",
    exporterType: registerusertype,
    currency: "",
    amount: "",
    rate: "",
    usdEquivalent: "",
    relatedexchangeControlNumber: "",
    sector: "",
    subsector: "",
    applicantComments: "",
    bankSupervisor: "",
  });
  const [files, setFiles] = useState([]);
  const [otherfiles, setOtherfiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [applicationType, setapplicationType] = useState([]);
  const [subsectorData, setsubsectorData] = useState([]);
  const [curRate, setCurrate] = useState();
  const [checkSupervisor, setcheckSupervisor] = useState(false);
  const [attachmentData, setAttachmentData] = useState([]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [value, setValue] = useState("Company Name");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [getBankID, setGetBankID] = useState("");
  const [getalluser, setGetalluser]=useState([]);
  const [Individualuser, setIndividualuser] = useState({
    applicantName: "",
    beneficiaryName: "",
  });

  //---------- Start form fill data handle

  const heading = "Application Submitted Successfully!";
  const para = "Export application request submitted successfully!";

  const changeHandelForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;
    let newErrors = {};
    let valid = true;
    if (name == "exporterType" && value == 2) {
      setgetCompanyName(null);
    }
    if (name == "purposeApplication" && value.charAt(0) === " ") {
      newErrors.purposeApplication = "First character cannot be a blank space";
      valid = false;
    } else if (name === "amount" && value.length > 10) {
      newErrors.amount = "Max 10 digit allow";
    } else if (name == "applicantComments" && value.charAt(0) === " ") {
      newErrors.applicantComments = "First character cannot be a blank space";
      valid = false;
    } else if (name == "TINNumber" && value.charAt(0) === " ") {
      newErrors.TINNumber = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "TINNumber" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("]") ||
        /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0)))
    ) {
      newErrors.TINNumber = "First character cannot be special characters";
      valid = false;
    } else if (name == "BPNCode" && value.charAt(0) === " ") {
      newErrors.BPNCode = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "BPNCode" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("]") ||
        /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0)))
    ) {
      newErrors.BPNCode = "First character cannot be special characters";
      valid = false;
    } else if (name == "applicantReferenceNumber" && (value.charAt(0) === " " || value.charAt(0) == "/")) {
      newErrors.applicantReferenceNumber =
        "First character cannot be a blank space or / ";
      valid = false;
    } else if (
      name == "applicantReferenceNumber" &&
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?~]/.test(value)
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
      (specialChars.test(value) ||
        /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0)))
    ) {
      newErrors.relatedexchangeControlNumber = "Special characters not allowed";
      valid = false;
    } else {
      setErrors({});
      setExportForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setErrors(newErrors);
    if (name === "sector" && value != "") {
      axios
        .post(APIURL + "Master/GetSubSectorBySectorID", {
          SectorID: value,
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
            setOtherfiles([]);
            setOtherfilesupload([]);
          }
        });
    }
  };
  //---------- End form fill data handle

  const convertedRate = curRate * parseFloat(exportForm.amount);

  //---------- Start API for Geting Application Type dynamic

  const GetApplicationTypes = async () => {
    await axios
      .post(APIURL + "Master/GetApplicationTypesByDepartmentID", {
        DepartmentID: "1",
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

  //---------- Start API For Geting Application Type dynamic

  useEffect(() => {
    GetApplicationTypes();
  }, []);

  //---------- Start Code For Check User Type of Exporter

  const handleUsertype = (e) => {
    setregisterusertype(e.target.value);
    setIndividualuser({ applicantName: "", beneficiaryName: "" });
  };

  //---------- End Code For Check User Type of Exporter

  //---------- Start Code For Add More File Option Field
  const handleAddMore = (e) => {
    setOtherfiles([...otherfiles, null]);
  };
  //---------- End Code For Add More File Option Field

  //---------- Start Code For Upload File In  state
  // const handleFileChange = (e, id) => {
  //   const file = e.target.files[0];
  //   setFiles((prevFiles) => [...prevFiles, { file, id }]);
  // };

  const handleFileChange = (e, id) => {
    const file = e.target.files[0]; 
    const index = files.findIndex(item => item.id === id);
    if (index !== -1) { 
      setFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, id };
        return newFiles;
      });
    } else { 
      setFiles(prevFiles => [...prevFiles, { file, id }]);
    }
  };
  

  const hanldeIndividualuser = (e) => {
    const { name, value } = e.target;
    const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;
    let newErrors = {};
    let valid = true;
    if (name == "applicantName" && specialChars.test(value)) {
      newErrors.applicant = "Special characters not allowed";
      valid = false;
    } else if (name == "applicantName" && value.charAt(0) === " ") {
      newErrors.applicant = "First character cannot be a blank space";
      valid = false;
    } else if (name == "beneficiaryName" && specialChars.test(value)) {
      newErrors.BeneficiaryName = "Special characters not allowed";
      valid = false;
    } else if (name == "beneficiaryName" && value.charAt(0) === " ") {
      newErrors.BeneficiaryName = "First character cannot be a blank space";
      valid = false;
    } else {
      setIndividualuser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors(newErrors);
  };

  console.log("files", files)
   
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

  const supervisorHangechangeRole = (e)=>{
      const value= e.target.value 
      setErrors({});
      setselectuserRole(value) 
      if(value == ""){
        setGetalluser([])
      } else{
        axios
        .post(APIURL + "User/GetUsersByRoleID",{
          RoleID:value,
          UserID:UserID.replace(/"/g, "")
        })
        .then((res)=>{ 
          if(res.data.responseCode == "200"){
            setGetalluser(res.data.responseData)
          }else{
            setGetalluser([])
          }
        })
        .catch((err)=>{
          console.log(err)
        })
      }
  }
  console.log("selectuserRole", selectuserRole);  
 
  useEffect(()=>{
    getRoleHandle()
  },[])

  const handleOthrefile = (e, id) => {
    const otherfile = e.target.files[0];
    setOtherfilesupload([...otherfilesupload, { otherfile, id }]);
  };
  //---------- End Code For Upload File In state

  //---------- Start Code For Check Supervisor is Filed is Check or Not
  const HandelSupervisorcheck = (e) => {
    setcheckSupervisor(!checkSupervisor);
  };

  //---------- Start Code For Check Validation for Form Field
  const validateForm = () => {
    let valid = true;
    setTimeout(()=>{
      setsubmitbuttonhide(false)
    },1000)
    const newErrors = {};
    if (exportForm.purposeApplication === "") {
      newErrors.purposeApplication = "Purpose of the application is required";
      valid = false;
    }
    if (
      registerusertype === "1" &&
      (getCompanyName == null ||
        value === "Company Name" ||
        getCompanyName.label == "")
    ) {
      newErrors.companyName = "Company Name is required";
      valid = false;
    }
    if (exportForm.applicationType === "") {
      newErrors.applicationType = "Application Type is required";
      valid = false;
    }
    if(checkSupervisor == true && selectuserRole == "" && roleID == 4){
      newErrors.selectuserRole = "Role is required";
      valid = false;
    }
    if (
      bankID == "" &&
      registerusertype === "3" &&
      exportForm.govtAgencie === ""
    ) {
      newErrors.govtAgencie = "Government Agencies name is required";
      valid = false;
    }
    if (registerusertype === "2" && Individualuser.applicantName === "") {
      newErrors.applicant = "Applicant name is required";
      valid = false;
    }
    if (exportForm.currency === "") {
      newErrors.currency = "Currency is required";
      valid = false;
    }
    if (exportForm.amount === "") {
      newErrors.amount = "Amount is required";
      valid = false;
    }
    if (exportForm.sector === "") {
      newErrors.sector = "Sector is required";
      valid = false;
    }
    if (exportForm.subsector === "") {
      newErrors.subsector = "Subsector is required";
      valid = false;
    }
    if (roleID == 4 && getBankID == "") {
      newErrors.getBankID = "Select the Bank";
      valid = false;
    }
    if (checkSupervisor == true && exportForm.bankSupervisor === "") {
      newErrors.bankSupervisor = "Bank Supervisor is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };
  //---------- End Code For Check Validation for Form Field

  //---------- Start Code For Company Search select for Form Field

  const generateRandomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };

  console.log("exportForm", exportForm)
  //---------- End Code For Company Search select for Form Field

  const HandleSubmit = async (e) => {
    e.preventDefault();

    setsubmitbuttonhide(true)

    let formData = new FormData();

    const randomNumber = generateRandomNumber();
    const generatedNumber = `EXP/${userName
      .toUpperCase()
      .replace(/"/g, "")}NMBLZWHX/018363${randomNumber}`;

    // let formData = new FormData();
    // for (let i = 0; i < files.length; i++) { // Corrected loop condition
    //   formData.append("upload_doc", files[i].file);
    //   formData.append("uploadFileId", files[i].id);
    // }
    let nDate = new Date();

   

    if (validateForm()) { 
      await axios
        .post(APIURL + "ExportApplication/CreateExportApplication", {
          UserID: UserID.replace(/"/g, ""),
          AssignedTo: checkSupervisor == true ? exportForm.bankSupervisor : roleID == 4 && exportForm.bankSupervisor == "" ? UserID.replace(/"/g, "") : "",
          DepartmentID: "1",
          BankID: roleID == 4 ? getBankID : bankID,
          RBZReferenceNumber: generatedNumber,
          ApplicationPurpose: exportForm.purposeApplication,
          ApplicantType: exportForm.exporterType,
          UserTypeID: exportForm.exporterType,
          BeneficiaryName: Individualuser.beneficiaryName,
          ApplicantReferenceNumber:
            exportForm.applicantReferenceNumber.toUpperCase(),
          ApplicationTypeID: exportForm.applicationType,
          Currency: exportForm.currency,
          Amount: exportForm.amount,
          Rate: curRate,
          USDEquivalent: convertedRate.toFixed(2),
          RECNumber: exportForm.relatedexchangeControlNumber.toUpperCase(),
          Sector: exportForm.sector,
          SubSector: exportForm.subsector,
          ApplicantComment: exportForm.applicantComments,
          // ApplicationDate: moment(startDate).format("YYYY-MM-DD"),
          ApplicationDate:
            startDate != null
              ? startDate
              : moment(nDate).format("YYYY-MM-DD HH:mm:ss"),
          BPNCode:
            registerusertype === "1" && bankID !== ""
              ? filtertin_bpn?.bpnNumber?.toUpperCase()
              : "",
          TINNumber:
            registerusertype === "1" && bankID !== ""
              ? filtertin_bpn.tinNumber?.toUpperCase()
              : "",
          Name:
            // registerusertype === "1" && bankID !== ""
            //   ? getCompanyName
            //   :
            registerusertype === "2" && bankID !== ""
              ? Individualuser.applicantName
              : "",
          CompanyID:
            registerusertype === "1" && bankID !== ""
              ? getCompanyName.value
              : "",
        })
        .then((res) => { 
          if (res.data.responseCode === "200") {
            setsubmitbuttonhide(false)
            setupdatepopup(true);

            for (let i = 0; i < files.length; i++) { // Corrected loop condition
              formData.append("files", files[i].file);
              // formData.append("uploadFileId", files[i].id);
            }
            formData.append("RBZReferenceNumber", res.data.responseData.rbzReferenceNumber);
            formData.append("ApplicationID", res.data.responseData.id);
            formData.append("DepartmentID", "1");
            formData.append("UserID", UserID.replace(/"/g, ""));

            axios.post(ImageAPI + 'File/UploadFile',formData).then((res)=>{
              // console.log("res99999",res);
            })
            .catch((err)=>{
              console.log("file Upload ", err)
            })

            Storage.setItem("generatedNumber", res.data.responseData.rbzReferenceNumber)
          } else {
            toast.error(res.data.responseMessage);
            setsubmitbuttonhide(false)
          }
        })
        .catch((err) => {
          console.log(err);
          setsubmitbuttonhide(false)
        });
    } else {
      if (!toastDisplayed) {
        toast.warning("Please fill all fields");
      }
      setToastDisplayed(true);
    }
  };

  const closePopupHandle = () => {
    Navigate("/BankADLADashboard");
    setupdatepopup(false);
    setGetBankID("");
    setExportForm({
      user: "",
      bankName: bankName,
      purposeApplication: "",
      typeExporter: "",
      // companyName: "",
      BeneficiaryName: "",
      govtAgencie: "",
      BPNCode: "",
      TINNumber: "",
      applicant: "",
      applicantReferenceNumber: "",
      applicantYear: "2024",
      // applicationDate:dateApp ,
      exporterType: "",
      currency: "",
      amount: "",
      rate: "",
      usdEquivalent: "",
      relatedexchangeControlNumber: "",
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
    setGetBankID("");
    setExportForm({
      user: "",
      bankName: bankName,
      purposeApplication: "",
      typeExporter: "",
      // companyName: "",
      govtAgencie: "",
      BPNCode: "",
      TIN: "",
      applicant: "",
      applicantReferenceNumber: "",
      // applicantYear: "2024",
      // applicationDate:dateApp ,
      exporterType: "",
      currency: "",
      amount: "",
      rate: "",
      usdEquivalent: "",
      relatedexchangeControlNumber: "",
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
    if (banknameRef.current) banknameRef.current.value = "";
    if (rateRef.current) rateRef.current.value = "";

    setOtherfilesupload([]);
    setFiles([]);
    setErrors({});
    setregisterusertype(bankidcheck);
  };

  const handleChangecompany = (selectedOption) => {
    setgetCompanyName(selectedOption);
  };

  const SelectBankRecordOfficer = (e) => {
    const { name, value } = e.target;
    setGetBankID(value);
  };

  const handleInputChangecompany = (input) => {
    setInputValue(input);
    if (input.length >= 3) {
      // Filter options when input length is at least 3 characters
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
      // Reset options when input length is less than 3 characters
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
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                disabled
              />
              <span className="sspan"></span>
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        {bankName != "null" && (
          <div className="inner_form_new ">
            <label className="controlform">Name of Bank</label>
            {roleID == 4 ? (
              <div className="form-bx">
                <label>
                  <select
                    ref={banknameRef}
                    className={
                      errors?.getBankID && getBankID == "" ? "error" : ""
                    }
                    name="BankID"
                    onChange={(e) => {
                      SelectBankRecordOfficer(e);
                    }}
                  >
                    <option value="">Select Bank/ADLA Name</option>
                    {masterBank?.map((item, index) => {
                      return (
                        <>
                          <option value={item?.id} key={index}>
                            {item?.bankName}
                          </option>
                        </>
                      );
                    })}
                  </select>
                  <span className="sspan"></span>
              {errors?.getBankID && getBankID == "" ? (
                <small className="errormsg">{errors.getBankID}</small>
              ) : (
                ""
              )}
                </label>
              </div>
            ) : (
              <div className="form-bx">
                <label>
                  <input
                    type="text"
                    value={bankName.replace(/"/g, "")}
                    disabled
                  />
                  <span className="sspan"></span>
                </label>
              </div>
            )}
          </div>
        )}
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Purpose of the Application</label>
          <div className="form-bx">
            <label>
              <textarea
                name="purposeApplication"
                ref={purposeApplicationRef}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder="Purpose of the Application"
                className={errors?.purposeApplication ? "error" : ""}
                value={exportForm.purposeApplication}
              />
              <span className="sspan"></span>
              {errors?.purposeApplication ? (
                <small className="errormsg">{errors.purposeApplication}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Type of Exporter</label>
          <div className="form-bx-radio mt-4">
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
                      name="exporterType"
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
                        bankID != "" && item.id === 3
                          ? true
                          : bankidcheck == "3"
                          ? true
                          : false
                      }
                    />{" "}
                    <span>{item.name}</span>
                  </label>
                </>
              );
            })}
            {/* {errors.niu && bankData.ApplicantType === '' ? <small className='errormsg'>{errors.ApplicantType}</small> : ""} */}
          </div>
        </div>
        {/* end form-bx  */}

        {registerusertype === "1" && bankID != "" ? (
          <>
            <div className="inner_form_new ">
              <label className="controlform">Company Name</label>
              <div className="form-bx">
                <Select
                  placeholder="Select Company Name"
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
                  Company Name
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
                      filtertin_bpn ? filtertin_bpn.tinNumber : "TIN Number"
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
          </>
        ) : (
          ""
        )}

        {/* end form-bx  */}

        {registerusertype === "2" && bankID != "" ? (
          <>
            <div className="inner_form_new ">
              <label className="controlform">Applicant</label>
              <div className="form-bx">
                <label>
                  <input
                    type="text"
                    ref={applicantRef}
                    name="applicantName"
                    onChange={(e) => {
                      hanldeIndividualuser(e);
                    }}
                    placeholder="Applicant"
                    value={Individualuser.applicantName}
                    className={errors.applicant ? "error" : ""}
                  />
                  <span className="sspan"></span>
                  {errors.applicant ? (
                    <small className="errormsg">{errors.applicant}</small>
                  ) : (
                    ""
                  )}
                </label>
                {/* <small className="informgs">
                Please provide at least 3 characters for auto search of
                Applicant Name.
              </small> */}

                {/* <ul
                className={
                  exportForm?.applicant != "" && finlterapplicantName.length
                    ? "filterbx"
                    : "d-none"
                }
              >
                {exportForm?.applicant != ""
                  ? finlterapplicantName?.map((cur) => {
                      return (
                        <li>
                          <button
                            type="button"
                            name="applicant"
                            onClick={(e) => {
                              changeHandelForm(e); setFinlterapplicantName([])
                            }}
                            value={cur.name}
                          >
                            {cur.name}
                          </button>
                        </li>
                      );
                    })
                  : ""}
              </ul> */}
              </div>
            </div>

            {/* <div className="inner_form_new ">
              <label className="controlform">Beneficiary Name</label>
              <div className="form-bx">
                <label>
                  <input
                    type="text"
                    ref={BeneficiaryNameRef}
                    name="beneficiaryName"
                    onChange={(e) => {
                      hanldeIndividualuser(e);
                    }}
                    placeholder="Beneficiary Name"
                    value={Individualuser.beneficiaryName}
                    // className="text-uppercase"
                  />
                  <span className="sspan"></span>
                  {errors.BeneficiaryName ? (
                    <small className="errormsg">{errors.BeneficiaryName}</small>
                  ) : (
                    ""
                  )}
                </label>
              </div>
            </div> */}
            
          </>
        ) : (
          ""
        )}

        {/* end form-bx  */}

        {registerusertype === "1" && bankID != "" ? (
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
                  value={filtertin_bpn ? filtertin_bpn?.bpnNumber : "BPN Code"}
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
        ) : (
          ""
        )}

        {/* end form-bx  */}

        {/* {registerusertype === "2" && bankID != "" ? (
        <div className="inner_form_new ">
          <label className="controlform">TIN Number</label>

          <div className="form-bx">
            <label>
              <input
              ref={TINRef}
                type="number"
                min={0}
                name="TIN"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder="TIN Number"
                className={errors.TIN && exportForm.TIN ==='' ? "error" : ""}
              />
              <span className="sspan"></span>
              {errors.TIN && exportForm.TIN ==='' ? <small className="errormsg">{errors.TIN}</small> :""}
            </label>
          </div>
        </div>
      ) : (
        ""
      )} */}

        {/* end form-bx  */}

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
                    errors.govtAgencie && exportForm.govtAgencie === ""
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
                {errors.govtAgencie && exportForm.govtAgencie === "" ? (
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

        <div className="inner_form_new ">
          <label className="controlform">Applicant Reference Number</label>

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
                value={exportForm.applicantReferenceNumber?.trim()}
                className={
                  errors.applicantReferenceNumber &&
                  exportForm.applicantReferenceNumber == ""
                    ? "error text-uppercase"
                    : exportForm.applicantReferenceNumber
                    ? "text-uppercase"
                    : ""
                }
              />
              <span className="sspan"></span>
              {errors.applicantReferenceNumber &&
              exportForm.applicantReferenceNumber === "" ? (
                <small className="errormsg">
                  {errors.applicantReferenceNumber}
                </small>
              ) : (
                ""
              )}
            </label>
          </div>

          {/* <div className="col-md-3">
              <div className="form-bx">
                <label>
                  <select
                    // ref={applicantYearRef}
                    name="applicantYear"
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                  </select>
                  <span className="sspan"></span>
                </label>
              </div>
            </div> */}
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Application Date</label>

          <div className="form-bx">
            {console.log("startDate", startDate)}
            {/* <label> */}
            <DatePicker
              closeOnScroll={(e) => e.target === document}
              selected={startDate} 
              placeholderText={startDate == null ? moment(new Date()).format("DD/MMM/YYYY") : startDate} 
              onChange={(date) => setStartDate(date)}
              peekNextMonth
              minDate="01/01/2018"
              showMonthDropdown
              maxDate={new Date()}
              showYearDropdown
              dropdownMode="select" // Add this line
              dateFormat="DD/MMM/yyyy"
            />

            <span className="sspan"></span>
            {/* </label> */}
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Application Type</label>
            {console.log("errors", errors)}
          <div className="form-bx">
            <label>
              <select
                ref={applicationTypeRef}
                name="applicationType"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                className={
                  errors.applicationType && exportForm.applicationType === ""
                    ? "error"
                    : ""
                }
              >
                <option value="">Select Application Type</option>
                {applicationType?.map((item, ind) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
              {errors.applicationType && exportForm.applicationType === "" ? (
                <small className="errormsg">{errors.applicationType}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
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
                      errors.currency && exportForm.currency === ""
                        ? "error"
                        : ""
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
                  {errors.currency && exportForm.currency === "" ? (
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
                    value={exportForm.amount}
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    placeholder="Amount"
                    className={
                      errors.amount && exportForm.amount === "" ? "error" : ""
                    }
                  />
                  <span className="sspan"></span>
                  {errors.amount || exportForm.amount === "" ? (
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
                    value={exportForm.currency ? curRate : "Rate"}
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
                  exportForm.currency && exportForm.amount
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
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      value={exportForm.relatedexchangeControlNumber?.trim()}
                      placeholder="Related Exchange Control Reference Number"
                      className={
                        errors.relatedexchangeControlNumber
                          ? "error text-uppercase"
                          : exportForm.relatedexchangeControlNumber
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
                </div>
                <button type="button" className="primrybtn  v-button">
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
                  errors.sector && exportForm.sector === "" ? "error" : ""
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
              {errors.sector && exportForm.sector === "" ? (
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
                disabled={exportForm.sector === "" ? true : false}
                className={
                  errors.subsector && exportForm.subsector === "" ? "error" : ""
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
              {errors.subsector && exportForm.subsector === "" ? (
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
                value={exportForm.applicantComments}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder="Applicant Comments"
                className={errors.applicantComments ? "error" : ""}
              />
              <span className="sspan"></span>
              {errors.applicantComments ? (
                <small className="errormsg">{errors.applicantComments}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Submit To {roleID == 2 ? "Next Level" : "Next Level"}</label>

          <input
            type="checkbox"
            className=""
            onChange={(e) => {
              HandelSupervisorcheck(e);
            }}
          />
        </div>
        {/* end form-bx  */}

        {checkSupervisor == true && roleID == 2 ? (
          <div className="inner_form_new ">
            <label className="controlform">Bank Supervisor</label>

            <div className="form-bx">
              <label>
                <select
                  ref={bankSupervisorRef}
                  name="bankSupervisor"
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  className={
                    errors.bankSupervisor && exportForm.bankSupervisor === ""
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
                {errors.bankSupervisor && exportForm.bankSupervisor === "" ? (
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
                                  onChange={(e) =>{supervisorHangechangeRole(e) }}
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

          { checkSupervisor == true && roleID == 4 && selectuserRole ? (
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
                           errors.bankSupervisor && exportForm.bankSupervisor === ""
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
                {errors.bankSupervisor  && exportForm.bankSupervisor === "" ? (
                  <small className="errormsg">User is required</small>
                ) : (
                  ""
                )}
                    </label>
                  </div>
                </div> 

          </div>
          )
          :
          ""
          }


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
                  onChange={(e) => handleFileChange(e, items.id)}
                />
              </div>
              <span className="filename">
                {files.find((f) => f.id === items?.id)?.file?.name ||
                  "No file chosen"}
              </span>
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
                onChange={(e) => {
                  handleFileChange(e, "other" + (index + 1));
                  handleOthrefile(e, "other" + (index + 1));
                }}
              />
            </div>
            <span className="filename">
              {files.find((f) => f.id === "other" + (index + 1))?.file?.name ||
                "No file chosen"}
            </span>
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
            disabled={submitbuttonhide == true}
          >
           {submitbuttonhide == true ? <>Submit<div class="smallloader"></div></> : "Submit"} 
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
    </>
  );
};

export default ExportNewRequestForm;