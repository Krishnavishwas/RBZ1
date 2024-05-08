import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { APIURL } from "../constant";
import moment from "moment";
import { toast } from "react-toastify";
import Select from "react-select";

const ExportDashboardEditDetails = ({
  applicationDetail,
  setApplicationDetail,
  EditModalClose,
  handleData,
  allcomment,
  GetRoleHandle,
  setUserrole,
  userRole,
  applicationstaus,
  ChangeApplicationStatus,
  supervisorHangechange,
  SupervisorNameID,
  SupervisorRoleId,
  asignUser
}) => {
  const ratevalue = applicationDetail?.rate;

  const {
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData,
    Supervisors,
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
  const ExpiringDateRef = useRef(null);
  const NoteRef = useRef(null);
  const CommentsRef = useRef(null);
  const relatedexchangeControlNumberRef = useRef(null);
  const sectorRef = useRef(null);
  const subsectorRef = useRef(null);
  const typeExporterRef = useRef(null);
  const rateRef = useRef(null);
  const usdEquivalentRef = useRef(null);

  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const userName = Storage.getItem("userName");
  const bankName = Storage.getItem("bankName");
  const bankidcheck = bankID !== "" ? "1" : "3";
  const roleID = Storage.getItem("roleIDs");
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(new Date());
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState(null);
  const [checksectorchange, setchecksectorchange] = useState(false);

  const [geninfoTab, setgeninfoTab] = useState(roleID == 2 ? true : false);
  const [banksuperTab, setbanksuperTab] = useState(roleID == 3 ? true : false);
  const [recordTab, setrecordTab] = useState(roleID == 4 ? true : false);
  const [analystTab, setanalystTab] = useState(roleID == 5 ? true : false);
  const [sranalystTab, setsranalystTab] = useState(roleID == 6 ? true : false);
  const [principalanalystTab, setprincipalanalystTab] = useState(
    roleID == 7 ? true : false
  );
  const [deputyTab, setdeputyTab] = useState(roleID == 8 ? true : false);
  const [director, setdirector] = useState(roleID == 9 ? true : false);
  

  const [registerusertype, setregisterusertype] = useState(
    applicationDetail?.userTypeID
  );

  const [files, setFiles] = useState([]);

  const [otherfiles, setOtherfiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [applicationType, setapplicationType] = useState([]);
  const [subsectorData, setsubsectorData] = useState([]);
  const [checkSupervisor, setcheckSupervisor] = useState(false);
  const [attachmentData, setAttachmentData] = useState([
    { filename: "File Upload", upload: "" },
  ]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [value, setValue] = useState("Company Name");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  
  const [ExpiringDate, setExpiringDate] = useState(null);
  const [asignnextLeveldata, setasignnextLeveldata] = useState({
    Notes: "",
    Comment: "",
  });
  const [curRate, setCurrate] = useState();


  

  console.log("userRole--userRole",userRole)

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

  const changeHandelForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    let newErrors = {};
    let valid = true;

    if (name == "applicationPurpose" && value.charAt(0) === " ") {
      newErrors.applicationPurpose = "First character cannot be a blank space";
      valid = false;
    } else if (name == "applicationPurpose" && specialChars.test(value)) {
      newErrors.applicationPurpose = "Special characters not allowed";
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
    } else if (name == "applicantReferenceNumber" && value.charAt(0) === " ") {
      newErrors.applicantReferenceNumber =
        "First character cannot be a blank space";
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
          console.log("curRate--api", res);
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
            setOtherfiles([]);
            setOtherfilesupload([]);
          }
        });
    }
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
    } else if (
      name == "Notes" &&
      (specialCharsnote.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("`") ||
        value?.includes("~") ||
        value?.includes("]") ||
        specialChars.test(value.charAt(0)))
    ) {
      newErrors.Notes = "Special characters not allowed";
      valid = false;
    } else if (name == "Comment" && value.charAt(0) === " ") {
      newErrors.Comment = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "Comment" &&
      (specialCharsnote.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("`") ||
        value?.includes("~") ||
        value?.includes("]") ||
        specialChars.test(value.charAt(0)))
    ) {
      newErrors.Comment = "Special characters not allowed";
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
  const convertedRate =
    parseFloat(curRate ? curRate : ratevalue) *
    parseFloat(applicationDetail?.amount);
 

  

  const handleUsertype = (e) => {
    setregisterusertype(e.target.value);
  };

  const handleAddMore = (e) => {
    setOtherfiles([...otherfiles, null]);
  };

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    setFiles((prevFiles) => [...prevFiles, { file, id }]);
  };

  const handleOthrefile = (e, id) => {
    const otherfile = e.target.files[0];
    setOtherfilesupload([...otherfilesupload, { otherfile, id }]);
  };

  const HandelSupervisorcheck = () => {
    setcheckSupervisor(!checkSupervisor);
  };

  

  console.log("applicationstaus", applicationstaus)

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
    // if (registerusertype === "1" && applicationDetail.BPNCode === "") {
    //   newErrors.BPNCode = "BPN code is required";
    //   valid = false;
    // }
    // if (registerusertype === "2" && applicationDetail.TIN === "") {
    //   newErrors.TIN = "TIN is Required";
    //   valid = false;
    // }
    if (
      applicationDetail.applicantType == "2" &&
      applicationDetail.applicant == ""
    ) {
      newErrors.applicant = "Applicant name is required";
      valid = false;
    }
    // if (asignnextLeveldata.Notes === "" && roleID >= 5) {
    //   newErrors.Notes = "Notes is required";
    //   valid = false;
    // }
    // if (asignnextLeveldata.Comment === "" && roleID >= 5) {
    //   newErrors.Comment = "Comment is required";
    //   valid = false;
    // }

    if (
      checkSupervisor == true &&
      roleID == "5" &&
      (ExpiringDate === "" || ExpiringDate == null)
    ) {
      newErrors.ExpiringDate = "Expiry Date is required";
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
    if (applicationDetail.subSector === "" || checksectorchange === true) {
      newErrors.subSector = "Sub sector is required";
      valid = false;
    }
    if (applicationDetail.applicantComment === "") {
      newErrors.applicantComment = "Applicant comments is required";
      valid = false;
    }
    if (
      checkSupervisor == true &&
      roleID != 9 &&
      (SupervisorNameID == "" || SupervisorNameID == null)
    ) {
      newErrors.assignedTo = "Bank supervisor is required";
      valid = false;
    }
    // if(files.length < attachmentData.length){
    //   newErrors.files = "All Files Required";
    //   valid = false;
    // }

    setErrors(newErrors);
    return valid;
  };

  // Code start for save form
  const HandleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      await axios
        .post(APIURL + "ExportApplication/UpdateExportApplications", {
          RBZReferenceNumber: applicationDetail?.rbzReferenceNumber,
          ID: applicationDetail?.id,
          DepartmentID: "1",
          UserID: UserID.replace(/"/g, ""),
          RoleID: roleID,
          AssignedTo:
            checkSupervisor == true
              ? SupervisorNameID
              : applicationDetail?.assignedTo
              ? applicationDetail?.assignedTo
              : "",
          BankID: applicationDetail?.bankID,
          CompanyID:
            applicationDetail?.applicantType == "1" &&
            applicationDetail?.bankID !== ""
              ? getCompanyName
                ? getCompanyName.value
                : applicationDetail?.companyID
              : "",
          ApplicationPurpose: applicationDetail?.applicationPurpose,
          UserTypeID: applicationDetail?.userTypeID,
          // Name: applicationDetail?.userTypeID == "1" && applicationDetail?.bankID !==""
          // ? getCompanyName ? getCompanyName :  applicationDetail?.companyName
          // : applicationDetail?.userTypeID == "2" && applicationDetail?.bankID !== ""
          // ? applicationDetail?.name : "",
          Name: applicationDetail?.name,
          BeneficiaryName: applicationDetail?.beneficiaryName,
          BPNCode: applicationDetail?.bpnCode?.toUpperCase(),
          TINNumber: applicationDetail?.tinNumber?.toUpperCase(),
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
          ApplicationDate: applicationDetail?.applicationDate
            ? applicationDetail?.applicationDate
            : startDate,
          Comment: asignnextLeveldata.Comment,
          AssignedToRoleID: SupervisorRoleId,
          Notes: asignnextLeveldata.Notes,
          ExpiringDate: ExpiringDate,
          ApplicationStatus: roleID == 5 ? applicationstaus : "",
        })
        .then(async (res) => {
          if (res.data.responseCode === "200") {
            toast.success(res.data.responseMessage);
            EditModalClose();
            handleData();

            navigate("/BankADLADashboard");
          } else {
            toast.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setApplicationDetail({
        user: "",
        bankName: bankName,
        applicationPurpose: "",
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
        assignedTo: "",
      });
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

      if (applicationPurposeRef.current)
        applicationPurposeRef.current.value = "";
      if (relatedexchangeControlNumberRef.current)
        relatedexchangeControlNumberRef.current.value = "";
      if (sectorRef.current) sectorRef.current.value = "";
      if (subsectorRef.current) subsectorRef.current.value = "";

      if (typeExporterRef.current) typeExporterRef.current.value = "";
      if (usdEquivalentRef.current) usdEquivalentRef.current.value = "";

      if (rateRef.current) rateRef.current.value = "";
    } else {
      if (!toastDisplayed) {
        toast.warning("Please fill all fields");
      }
      setToastDisplayed(true);
    }
  };
  // End code for save form

  const ResetHandleData = () => {
    setasignnextLeveldata({
      Notes: "",
      Comment: "",
    });
    setExpiringDate(null);
  };

  useEffect(() => {
    handleData();
  }, []);

  const handleChangecompany = (selectedOption) => {
    setgetCompanyName(selectedOption);
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

  // console.log("ratevalue", ratevalue);
  // console.log("curRate", curRate);
  // console.log("allcomment--", allcomment);

  return (
    <>
      {/* <h3 className="export-pop-heading">
        {applicationDetail?.rbzReferenceNumber
          ? applicationDetail.rbzReferenceNumber
          : ""}
      </h3> */}
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
          {/* end form-bx  */}

          {bankName != "null" && (
            <div className="inner_form_new ">
              <label className="controlform">Name of Bank</label>

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
            </div>
          )}
          {/* end form-bx  */}

          <div className="inner_form_new ">
            <label className="controlform">Purpose of the Application</label>

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
                  disabled={roleID == 2 || roleID == 3 ? false : true}
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
          {/* end form-bx  */}

          <div className="inner_form_new ">
            <label className="controlform">Type of Exporter</label>
            <div className="form-bx-radio mt-4">
              <label>
                <input
                  type="radio"
                  checked={applicationDetail?.userTypeID === 1 ? true : false}
                  disabled={applicationDetail?.userTypeID === 1 ? false : true}
                />{" "}
                <span>Corporate</span>
              </label>
              <label>
                <input
                  type="radio"
                  checked={applicationDetail?.userTypeID === 2 ? true : false}
                  disabled={applicationDetail?.userTypeID === 2 ? false : true}
                />{" "}
                <span>Individual</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="exporterType"
                  checked={applicationDetail?.userTypeID === 3 ? true : false}
                  disabled
                />{" "}
                <span>Government Agencies</span>
              </label>

              {/* {errors.niu && bankData.ApplicantType === '' ? <small className='errormsg'>{errors.ApplicantType}</small> : ""} */}
            </div>
          </div>
          {/* end form-bx  */}

          {/* {registerusertype === "1" && bankID != "" ? (
        <div className="inner_form_new ">
          <label className="controlform">Corporate Name</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                ref={companyNameRef}
                name="companyName"
                value={applicationDetail.companyName}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder="Corporate Name"
                className={
                  errors.companyName && applicationDetail.companyName === ""
                    ? "error"
                    : ""
                }
              />
              <span className="sspan"></span>
            </label>
            {errors.companyName && applicationDetail.companyName === "" ? (
              <small className="errormsg">{errors.companyName}</small>
            ) : (
              ""
            )}
            <small className="informgs">
              Please provide at least 3 characters for auto search of Company
              Name.
            </small>
            <ul
              className={
                applicationDetail?.companyName != "" && filteredCompanyList.length
                  ? "filterbx"
                  : "d-none"
              }
            >
              {applicationDetail?.companyName != ""
                ? filteredCompanyList?.map((cur) => {
                    return (
                      <li>
                        <button
                          name="companyName"
                          onClick={(e) => {
                            changeHandelForm(e);
                          }}
                          value={cur.companyName}
                        >
                          {cur.companyName}
                        </button>
                      </li>
                    );
                  })
                : ""}
            </ul>
          </div>
        </div>
      ) : (
        ""
      )} */}

          {applicationDetail?.userTypeID == "1" && bankID != "" ? (
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
                      inputValue.length > 3
                        ? "No company found"
                        : "Type to search"
                    }
                    onMenuClose={handleClear}
                    className="selectinput"
                    isDisabled={roleID == 2 || roleID == 3 ? false : true}
                  />

                  {errors.companyName ? (
                    <small className="errormsg2">{errors.companyName}</small>
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
                      value={applicationDetail.tinNumber}
                      className="text-uppercase"
                      disabled={roleID == 2 || roleID == 3 ? false : true}
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          {/* end form-bx  */}

          {applicationDetail?.userTypeID == "2" && bankID != "" ? (
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
                      disabled={roleID == 2 || roleID == 3 ? false : true}
                    />
                    <span className="sspan"></span>
                    {errors.applicant && applicationDetail.name === "" ? (
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
                applicationDetail?.applicant != "" && finlterapplicantName.length
                  ? "filterbx"
                  : "d-none"
              }
            >
              {applicationDetail?.applicant != ""
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

              <div className="inner_form_new ">
                <label className="controlform">Beneficiary Name</label>
                <div className="form-bx">
                  <label>
                    <input
                      type="text"
                      ref={BeneficiaryNameRef}
                      name="beneficiaryName"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      placeholder="Beneficiary Name"
                      value={applicationDetail?.beneficiaryName}
                      disabled={roleID == 2 || roleID == 3 ? false : true}
                    />
                    <span className="sspan"></span>
                    {errors.beneficiaryName ? (
                      <small className="errormsg">
                        {errors.beneficiaryName}
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

          {/* end form-bx  */}

          {applicationDetail?.userTypeID == "1" && bankID != "" ? (
            <div className="inner_form_new ">
              <label className="controlform">BPN Code</label>

              <div className="form-bx">
                <label>
                  <input
                    ref={BPNCodeRef}
                    type="text"
                    min={0}
                    name="bpnCode"
                    value={applicationDetail?.bpnCode?.trim()}
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    placeholder="BPN Code"
                    className={
                      errors.bpnCode ? "error text-uppercase" : "text-uppercase"
                    }
                    disabled={roleID == 2 || roleID == 3 ? false : true}
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
              className={errors.TIN && applicationDetail.TIN ==='' ? "error" : ""}
            />
            <span className="sspan"></span>
            {errors.TIN && applicationDetail.TIN ==='' ? <small className="errormsg">{errors.TIN}</small> :""}
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
                      errors.govtAgencie &&
                      applicationDetail?.govtAgencie === ""
                        ? "error"
                        : ""
                    }
                    disabled={roleID == 2 || roleID == 3 ? false : true}
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

          {/* end form-bx  */}

          <div className="inner_form_new ">
            <label className="controlform">Applicant Reference Number</label>

            <div className="row">
              <div className="col-md-12">
                <div className="d-flex">
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
                        value={applicationDetail?.applicantReferenceNumber}
                        disabled={roleID == 2 || roleID == 3 ? false : true}
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
                  <button type="button" className="primrybtn  v-button">
                    Validate
                  </button>
                </div>
              </div>
              <div className="col-md-3 text-right"></div>
            </div>
          </div>
          {/* end form-bx  */}

          <div className="inner_form_new ">
            <label className="controlform">Application Date</label>

            <div className="form-bx">
              {/* <label> */}
              <DatePicker
                closeOnScroll={(e) => e.target === document}
                selected={
                  applicationDetail?.applicationDate
                    ? applicationDetail?.applicationDate
                    : startDate
                }
                onChange={(date) => setStartDate(date)}
                peekNextMonth
                showMonthDropdown
                maxDate={new Date()}
                minDate="01/01/2018"
                showYearDropdown
                dropdownMode="select"
                disabled={roleID == 2 || roleID == 3 ? false : true}
              />

              <span className="sspan"></span>
              {/* </label> */}
            </div>
          </div>
          {/* end form-bx  */}

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
                  disabled={roleID == 2 || roleID == 3 ? false : true}
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
                        errors.currency && applicationDetail?.currency === ""
                          ? "error"
                          : ""
                      }
                      disabled={roleID == 2 || roleID == 3 ? false : true}
                    >
                      <option value="">Select Currency</option>
                      {currency?.map((cur, ind) => {
                        return (
                          <option
                            key={cur.id}
                            value={cur.id}
                            selected={applicationDetail?.currency === cur.id}
                          >
                            {cur.currencyCode}
                          </option>
                        );
                      })}
                    </select>
                    <span className="sspan"></span>
                    {errors.currency && applicationDetail.currency === "" ? (
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
                      value={applicationDetail?.amount}
                      placeholder="Amount"
                      className={
                        errors.amount && applicationDetail?.amount === ""
                          ? "error"
                          : ""
                      }
                      disabled={roleID == 2 || roleID == 3 ? false : true}
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
                      value={
                        applicationDetail?.currency
                          ? curRate
                            ? curRate
                            : applicationDetail.rate
                          : "Rate"
                      }
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
                    applicationDetail?.currency && applicationDetail?.amount
                      ? convertedRate == NaN
                        ? applicationDetail?.usdEquivalent
                        : convertedRate.toFixed(2)
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

            <div className="form-bx">
              <label>
                <input
                  ref={relatedexchangeControlNumberRef}
                  type="text"
                  min={0}
                  name="recNumber"
                  value={applicationDetail?.recNumber}
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  placeholder="Related Exchange Control Reference Number"
                  className={
                    errors.relatedexchangeControlNumber
                      ? "error text-uppercase"
                      : "text-uppercase"
                  }
                  disabled={roleID == 2 || roleID == 3 ? false : true}
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
                    errors.sector && applicationDetail?.sector === ""
                      ? "error"
                      : ""
                  }
                  disabled={roleID == 2 || roleID == 3 ? false : true}
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
          {/* end form-bx  */}

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
                    (roleID == 2 || roleID == 3 ? false : true)
                      ? true
                      : false
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
          {/* end form-bx  */}

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
                  disabled={roleID == 2 || roleID == 3 ? false : true}
                />
                <span className="sspan"></span>
                {errors.applicantComment ? (
                  <small className="errormsg">{errors.applicantComment}</small>
                ) : (
                  ""
                )}
              </label>
            </div>
          </div>
          {/* end form-bx  */}

          {roleID < 3 ? (
            <div className="inner_form_new ">
              <label className="controlform">
                Submitted to{" "}
                {applicationDetail?.supervisorName
                  ? applicationDetail?.supervisorName
                  : "Bank Supervisor"}
              </label>

              <input
                type="checkbox"
                className="mt-4"
                onChange={HandelSupervisorcheck}
                checked={checkSupervisor}
                disabled={roleID == 2 ? false : true}
              />
            </div>
          ) : (
            ""
          )}
          {/* end form-bx  */}

          {applicationDetail?.supervisorName ? (
            <div className="inner_form_new ">
              <label className="controlform">Application Assign To</label>

              <div className="form-bx">
                <label>
                  <select disabled>
                    <option value="" selected>
                      {applicationDetail?.supervisorName}
                    </option>
                  </select>
                  <span className="sspan"></span>
                </label>
              </div>
            </div>
          ) : (
            ""
          )}

          {checkSupervisor == true ? (
            <>
              <div className={roleID == 2 ? "inner_form_new " : "d-none"}>
                <label className="controlform">Select Bank Supervisor</label>

                <div className="form-bx">
                  <label>
                    <select
                      ref={assignedToRef}
                      name="assignedTo"
                      onChange={supervisorHangechange}
                      className={
                        errors.assignedTo && !SupervisorNameID ? "error" : ""
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
                    {errors.assignedTo && !SupervisorNameID ? (
                      <small className="errormsg">{errors.assignedTo}</small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>

              {/* end form-bx  */}
            </>
          ) : (
            ""
          )}

          {/* end form-bx  */}

          {/* {
  allcomment?.map((cur)=> {
    
    return(
      cur?.applicationActivityData.map((item, index)=>{
        if(cur?.assignedToRoleID == 2){
          return(
            <>
            <div className="inner_form_new ">
              <label className="controlform">Notes</label>
              <div className="form-bx">
              <label><textarea name="Notes" placeholder="Notes" class="" disabled>{item?.notes}</textarea></label>
              </div>
            </div>
            <div className="inner_form_new ">
              <label className="controlform">Comments</label>
              <div className="form-bx">
              <label><textarea name="Notes" placeholder="Notes" class="" disabled>{item?.comment}</textarea></label>
              </div>
            </div>
            </>
          )
        }
       
      })
    )
    
  } )
} */}

          {roleID == 2 ? (
            <>
              <div className="inner_form_new ">
                <label className="controlform">Notes</label>

                <div className="form-bx">
                  <label>
                    <textarea
                      name="Notes"
                      onChange={(e) => {
                        HandleNextleveldata(e);
                      }}
                      placeholder="Notes"
                      className={errors.Notes && roleID == 2 ? "error" : ""}
                      value={asignnextLeveldata.Notes}
                      disabled={roleID == 2 ? false : true}
                    />
                    <span className="sspan"></span>
                    {errors.Notes && roleID == 2 ? (
                      <small className="errormsg">{errors.Notes}</small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>
              {/* end form-bx  */}

              <div className="inner_form_new ">
                <label className="controlform">Comments</label>

                <div className="form-bx">
                  <label>
                    <textarea
                      name="Comment"
                      onChange={(e) => {
                        HandleNextleveldata(e);
                      }}
                      placeholder="Comments"
                      className={errors.Comment && roleID == 2 ? "error" : ""}
                      value={asignnextLeveldata.Comment}
                      disabled={roleID == 2 ? false : true}
                    />
                    <span className="sspan"></span>
                    {errors.Comment && roleID == 2 ? (
                      <small className="errormsg">{errors.Comment}</small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>
              {/* end form-bx  */}
            </>
          ) : (
            ""
          )}

          <h5 className="section_top_subheading mt-2">Attachments</h5>

          {/* {attachmentData?.map((items, index) => {
            return (
              <div className="attachemt_form-bx" key={items.id}>
                <label>
                  <i className="bi bi-forward"></i>
                  {items.filename}
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
                {files.find((f) => f.id === "other" + (index + 1))?.file
                  ?.name || "No file chosen"}
              </span>
            </div>
          ))}

          {files?.length ? (
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
          )} */}
        </div>

        {/* -------------start next level------- */}

        {roleID >= 3 ? (
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
              <span className="btn-collapse">
                <i class="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={banksuperTab ? "customtab" : "d-none"}>
              {allcomment?.map((cur) => {
                return cur?.applicationActivityData.map((item, index) => {
                  if (cur?.assignedToRoleID == 3) {
                    return (
                      <>
                        <div className="inner_form_new ">
                          <label className="controlform">Notes</label>
                          <div className="form-bx">
                            <label>
                              <textarea
                                name="Notes"
                                placeholder="Notes"
                                class=""
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
                                placeholder="Notes"
                                class=""
                                disabled
                              >
                                {item?.comment}
                              </textarea>
                            </label>
                          </div>
                        </div>
                      </>
                    );
                  }
                });
              })}

              <div className={roleID == 3 ? "inner_form_new " : "d-none"}>
                <label className="controlform">
                  Submitted to Record Officer
                </label>

                <input
                  type="checkbox"
                  className="mt-4"
                  onChange={HandelSupervisorcheck}
                  checked={checkSupervisor}
                />
              </div>
              {/* end form-bx  */}

              {checkSupervisor == true ? (
                <>
                  <div className={roleID == 3 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Select Record Officer</label>

                    <div className="form-bx">
                      <label>
                        <select
                          ref={assignedToRef}
                          name="assignedTo"
                          onChange={supervisorHangechange}
                          className={
                            errors.assignedTo && !SupervisorNameID
                              ? "error"
                              : ""
                          }
                        >
                          <option value="">Select Record Officer</option>
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
                        {errors.assignedTo && !SupervisorNameID ? (
                          <small className="errormsg">
                            {errors.assignedTo}
                          </small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                  {/* end form-bx  */}
                </>
              ) : (
                ""
              )}
              {/* end form-bx  */}
              <div className={roleID == 3 ? "inner_form_new " : "d-none"}>
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
              {/* end form-bx  */}

              <div className={roleID == 3 ? "inner_form_new " : "d-none"}>
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
                recordTab
                  ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                  : "section_top_subheading mt-3 py-3 cursorpointer"
              }
              onClick={() => setrecordTab(!recordTab)}
            >
              Record Officer{" "}
              <span className="btn-collapse">
                <i class="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={recordTab ? "customtab" : "d-none"}>
              {allcomment?.map((cur) => {
                return cur?.applicationActivityData.map((item, index) => {
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
                                class=""
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
                                placeholder="Notes"
                                class=""
                                disabled
                              >
                                {item?.comment}
                              </textarea>
                            </label>
                          </div>
                        </div>
                      </>
                    );
                  }
                });
              })}

              <div className={roleID == 4 ? "inner_form_new " : "d-none"}>
                <label className="controlform">Submitted to Analyst</label>

                <input
                  type="checkbox"
                  className="mt-4"
                  onChange={HandelSupervisorcheck}
                  checked={checkSupervisor}
                />
              </div>
              {/* end form-bx  */}

              {checkSupervisor == true ? (
                <>
                  <div className={roleID == 4 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Select Analyst</label>

                    <div className="form-bx">
                      <label>
                        <select
                          ref={assignedToRef}
                          name="assignedTo"
                          onChange={supervisorHangechange}
                          className={
                            errors.assignedTo && !SupervisorNameID
                              ? "error"
                              : ""
                          }
                        >
                          <option value="">Select to Analyst</option>
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
                        {errors.assignedTo && !SupervisorNameID ? (
                          <small className="errormsg">
                            {errors.assignedTo}
                          </small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                  {/* end form-bx  */}
                </>
              ) : (
                ""
              )}
              {/* end form-bx  */}
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
              {/* end form-bx  */}

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

        {roleID >= 5 ? (
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
              <span className="btn-collapse">
                <i class="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={analystTab ? "customtab" : "d-none"}>
              <ul className="nav nav-pills mb-3" role="tablist">
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
                    Recent
                  </button>
                </li>

                {allcomment?.map((cur, i) => {
                  if (cur.assignedToRoleID == 5) {
                    return (
                      <>
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
                                  {cur?.applicationActivityData.length - index}
                                </button>
                              </li>
                            );
                          })}
                      </>
                    );
                  }
                })}
              </ul>

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
                  <div className={roleID == 5 ? "inner_form_new " : "d-none"}>
                    <label class="controlform">Analyst Recommendation</label>

                    {/* <div class="form-bx-radio mt-4">
                      <label>
                        <input
                          type="radio"
                          onChange={(e) => ChangeApplicationStatus(e)}
                          name="applicantType"
                          value="10"
                          checked
                        />{" "}
                        <span>Approved</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="2"
                          disabled
                        />{" "}
                        <span>Rejected</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="3"
                          disabled
                        />{" "}
                        <span>Deferred</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Cancelled</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Refer Back</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Delegation Required</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Referred to Other Department</span>
                      </label>
                    </div> */}
                    <div className="row">
                      <div className="col-md-12">
                        <div class="hidden-toggles">
                          <input 
                            type="radio"
                            id="coloration-Approvedved"
                            value="10"
                            onChange={(e) => {ChangeApplicationStatus(e); GetRoleHandle(10)}}
                            name="applicationstaus"
                            class="hidden-toggles__input"
                            checked={applicationstaus =="10" ? true : false}
                          />
                          <label
                            for="coloration-Approvedved"
                            class="hidden-toggles__label"
                          >
                            Approved 10
                          </label>

                          <input 
                            type="radio"
                            id="coloration-Rejected"
                            value="30"
                            onChange={(e) => {ChangeApplicationStatus(e); GetRoleHandle(30)}}
                            name="applicationstaus"
                            class="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Rejected"
                            class="hidden-toggles__label"
                          >
                            Rejected 30
                          </label>

                          <input 
                            type="radio"
                            id="coloration-Deferred"
                            onChange={(e) => {ChangeApplicationStatus(e); GetRoleHandle(40)}}
                            name="applicationstaus"
                            value="40"
                            class="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Deferred"
                            class="hidden-toggles__label"
                          >
                            Deferred 40
                          </label>

                          <input 
                            type="radio"
                            id="coloration-Cancelled"
                            onChange={(e) => {ChangeApplicationStatus(e); GetRoleHandle(25)}}
                            name="applicationstaus"
                            value="25"
                            class="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Cancelled"
                            class="hidden-toggles__label"
                          >
                            Cancelled 25
                          </label>
                        </div>
                      </div>

                      <div className="col-md-12 my-2">
                        <div class="hidden-toggles">
                          <input 
                            type="radio"
                            id="coloration-Refer"
                            onChange={(e) => {ChangeApplicationStatus(e); GetRoleHandle(15)}}
                            name="applicationstaus"
                            value="15"
                            class="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Refer"
                            class="hidden-toggles__label"
                          >
                            Refer Back 15
                          </label>

                          <input 
                            type="radio"
                            id="coloration-Delegation"
                            onChange={(e) => {ChangeApplicationStatus(e); GetRoleHandle(20)}}
                            name="applicationstaus"
                            value="20"
                            class="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Delegation"
                            class="hidden-toggles__label"
                          >
                            Delegation Required 20
                          </label>

                          <input 
                            type="radio"
                            id="coloration-Department"
                            onChange={(e) => {ChangeApplicationStatus(e); GetRoleHandle(35)}}
                            name="applicationstaus"
                            value="35"
                            class="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Department"
                            class="hidden-toggles__label"
                          >
                            Referred to Other Department 35
                          </label>
                        </div>
                      </div>
                    </div>
                  </div> 

<div className="row mt-2">
  <div className="col-md-4">
                  <div className={roleID == 5 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">
                    Assign To
                    </label>

                    <input
                      type="checkbox"
                      className="mt-4"
                      onChange={HandelSupervisorcheck}
                      checked={checkSupervisor}
                    />
                  </div>
                  {/* end form-bx  */}

                  </div>

                  <div className="col-md-4">
                  {checkSupervisor == true && roleID == 5 ? (
                    <>
                      <div className="inner_form_new-sm">
                        <label className="controlform-sm">
                          Select Role
                        </label>

                        <div className="form-bx-sm">
                          <label>
                            <select
                              ref={assignedToRef}
                              name="assignedTo"
                              onChange={(e)=>{supervisorHangechange(e)}}
                              className={
                                errors.assignedTo && !SupervisorNameID
                                  ? "error"
                                  : ""
                              }
                            >
                              <option value="501">Select Role</option>
                              {userRole?.map((item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={item.id}
                                    selected={
                                      item.userID ==
                                      applicationDetail?.assignedTo
                                    }
                                  >
                                    {item.designation}
                                  </option>
                                );
                              })}
                            </select>
                            <span className="sspan"></span>
                            {errors.assignedTo && !SupervisorNameID ? (
                              <small className="errormsg">
                                Senior analyst is required{" "}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                      {/* end form-bx  */}
                    </>
                  ) : (
                    ""
                  )}
                  </div>

                  <div className="col-md-4">
                  {checkSupervisor == true && roleID == 5 ? (
                    <>
                      <div className="inner_form_new-sm">
                        <label className="controlform-sm">
                          Select User
                        </label>

                        <div className="form-bx-sm">
                          <label>
                            <select
                              ref={assignedToRef}
                              name="assignedTo"
                              onChange={(e)=>{supervisorHangechange(e); GetRoleHandle(e)}}
                              className={
                                errors.assignedTo && !SupervisorNameID
                                  ? "error"
                                  : ""
                              }
                            >
                              <option value="">Select User</option>
                              {asignUser?.map((item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={JSON?.stringify(item)}
                                    selected={
                                      item.userID ==
                                      applicationDetail?.assignedTo
                                    }
                                  >
                                    {item.name}
                                  </option>
                                );
                              })}
                            </select>
                            <span className="sspan"></span>
                            {errors.assignedTo && !SupervisorNameID ? (
                              <small className="errormsg">
                                Senior analyst is required{" "}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                      {/* end form-bx  */}
                    </>
                  ) : (
                    ""
                  )}
                  </div> 

</div>

                  {/* end form-bx  */}

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
                          <i className="bi bi-forward"></i>
                          <span style={{ fontWeight: "500" }}>
                            {" "}
                            {items.filename}
                          </span>
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
                          {" "}
                          <i className="bi bi-forward"></i> Other File{" "}
                          {index + 1}
                        </b>
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
                        {files.find((f) => f.id === "other" + (index + 1))?.file
                          ?.name || "No file chosen"}
                      </span>
                    </div>
                  ))}

                  {files?.length ? (
                    <div className="attachemt_form-bx">
                      <label style={{ border: "0px" }}>{""}</label>
                      <button
                        type="button"
                        className="addmore-btn mt-0"
                        onClick={(e) => handleAddMore(e)}
                      >
                        {" "}
                        Add More File{" "}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  
                  <div className={roleID == 5 ? "inner_form_new " : "d-none"}>
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
                  {/* end form-bx  */}

                  <div className={roleID == 5 ? "inner_form_new " : "d-none"}>
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

                  <div className={roleID == 5 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Expiry Date</label>

                    <div className="form-bx">
                      {/* <label> */}
                      <DatePicker
                        placeholderText="Select Expiring Date"
                        closeOnScroll={(e) => e.target === document}
                        selected={ExpiringDate}
                        onChange={(date) => setExpiringDate(date)}
                        peekNextMonth
                        showMonthDropdown
                        minDate={new Date()}
                        showYearDropdown
                        dropdownMode="select"
                      />

                      <span className="sspan"></span>
                      {errors.ExpiringDate &&
                      (ExpiringDate != "Select Expiring Date " ||
                        ExpiringDate != null) ? (
                        <small
                          className="errormsg"
                          style={{ marginBottom: "9px" }}
                        >
                          {errors.ExpiringDate}
                        </small>
                      ) : (
                        ""
                      )}
                      {/* </label> */}
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
                                index == 0 && roleID > 5
                                  ? "tab-pane fade show active"
                                  : "tab-pane fade show  "
                              }
                              id={"analyst-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"analyst" + index}
                            >
                              <div className="inner_form_new ">
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      class=""
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
                                      placeholder="Notes"
                                      class=""
                                      disabled
                                    >
                                      {item?.comment}
                                    </textarea>
                                  </label>
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

        {roleID >= 6 ? (
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
              <span className="btn-collapse">
                <i class="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={sranalystTab ? "customtab" : "d-none"}>
              <ul className="nav nav-pills mb-3" role="tablist">
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
                    id="sranalyst"
                    data-bs-toggle="tab"
                    data-bs-target="#sranalyst-justified-home"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Recent
                  </button>
                </li>

                {allcomment?.map((cur, i) => {
                  if (cur.assignedToRoleID == 6) {
                    return (
                      <>
                        {cur?.applicationActivityData
                          ?.slice()
                          ?.reverse()
                          .map((items, index) => {
                            return (
                              <li className="nav-item" role="presentation">
                                <button
                                  className={
                                    index == 0 && roleID > 6
                                      ? "nav-link w-100 border-radius0 active"
                                      : "nav-link border-radius0 w-100 "
                                  }
                                  id={"sranalyst" + index}
                                  data-bs-toggle="tab"
                                  data-bs-target={
                                    "#sranalyst-justified-home" + index
                                  }
                                  type="button"
                                  role="tab"
                                  aria-controls="home"
                                  aria-selected="true"
                                >
                                  Response{" "}
                                  {cur?.applicationActivityData.length - index}
                                </button>
                              </li>
                            );
                          })}
                      </>
                    );
                  }
                })}
              </ul>

              <div className="tab-content pt-2">
                <div
                  className={
                    roleID == 6
                      ? "tab-pane fade show active"
                      : "tab-pane fade show "
                  }
                  id="sranalyst-justified-home"
                  role="tabpanel"
                  aria-labelledby="sranalyst"
                >
                  <div className={roleID == 6 ? "inner_form_new " : "d-none"}>
                    <label class="controlform">
                      Principal Analyst Recommendation
                    </label>

                    <div class="form-bx-radio mt-4">
                      <label>
                        <input
                          type="radio"
                          onChange={(e) => ChangeApplicationStatus(e)}
                          name="applicantType"
                          value="10"
                          checked
                        />{" "}
                        <span>Approved 10</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="2"
                          disabled
                        />{" "}
                        <span>Rejected 2</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="3"
                          disabled
                        />{" "}
                        <span>Deferred 3</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Cancelled 4</span>
                      </label>
                    </div>
                  </div>

                  <div className="inner_form_new">
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
                            <i className="bi bi-forward"></i>
                            <span style={{ fontWeight: "500" }}>
                              {" "}
                              {items.filename}
                            </span>
                          </label>
                          <div className="browse-btn">
                            Browse{" "}
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(e, items.id)}
                            />
                          </div>
                          <span className="filename">
                            {files.find((f) => f.id === items?.id)?.file
                              ?.name || "No file chosen"}
                          </span>
                        </div>
                      );
                    })}

                    {otherfiles.map((file, index) => (
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
                            {" "}
                            <i className="bi bi-forward"></i> Other File{" "}
                            {index + 1}
                          </b>
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
                          {files.find((f) => f.id === "other" + (index + 1))
                            ?.file?.name || "No file chosen"}
                        </span>
                      </div>
                    ))}

                    {files?.length ? (
                      <div className="attachemt_form-bx">
                        <label style={{ border: "0px" }}>{""}</label>
                        <button
                          type="button"
                          className="addmore-btn mt-0"
                          onClick={(e) => handleAddMore(e)}
                        >
                          {" "}
                          Add More File{" "}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className={roleID == 6 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">
                      Submitted to Principal Analyst
                    </label>

                    <input
                      type="checkbox"
                      className="mt-4"
                      onChange={HandelSupervisorcheck}
                      checked={checkSupervisor}
                    />
                  </div>
                  {/* end form-bx  */}

                  {checkSupervisor == true && roleID == 6 ? (
                    <>
                      <div className="inner_form_new ">
                        <label className="controlform">
                          Select Principal Analyst
                        </label>

                        <div className="form-bx">
                          <label>
                            <select
                              ref={assignedToRef}
                              name="assignedTo"
                              onChange={supervisorHangechange}
                              className={
                                errors.assignedTo && !SupervisorNameID
                                  ? "error"
                                  : ""
                              }
                            >
                              <option value="">Select Principal Analyst</option>
                              {Supervisors?.map((item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={JSON?.stringify(item)}
                                    selected={
                                      item.userID ==
                                      applicationDetail?.assignedTo
                                    }
                                  >
                                    {item.name}
                                  </option>
                                );
                              })}
                            </select>
                            <span className="sspan"></span>
                            {errors.assignedTo && !SupervisorNameID ? (
                              <small className="errormsg">
                                Principal analyst is required{" "}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                      {/* end form-bx  */}
                    </>
                  ) : (
                    ""
                  )}
                  {/* end form-bx  */}

                  <div className={roleID == 6 ? "inner_form_new " : "d-none"}>
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
                  {/* end form-bx  */}

                  <div className={roleID == 6 ? "inner_form_new " : "d-none"}>
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
                                index == 0 && roleID > 6
                                  ? "tab-pane fade show active"
                                  : "tab-pane fade show  "
                              }
                              id={"sranalyst-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"sranalyst" + index}
                            >
                              <div className="inner_form_new ">
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      class=""
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
                                      placeholder="Notes"
                                      class=""
                                      disabled
                                    >
                                      {item?.comment}
                                    </textarea>
                                  </label>
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

        {roleID >= 7 ? (
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
              <span className="btn-collapse">
                <i class="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={principalanalystTab ? "customtab" : "d-none"}>
              <ul className="nav nav-pills mb-3" role="tablist">
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
                    Recent
                  </button>
                </li>

                {allcomment?.map((cur, i) => {
                  if (cur.assignedToRoleID == 7) {
                    return (
                      <>
                        {cur?.applicationActivityData
                          ?.slice()
                          ?.reverse()
                          .map((items, index) => {
                            return (
                              <li className="nav-item" role="presentation">
                                <button
                                  className={
                                    index == 0 && roleID > 7
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
                                  {cur?.applicationActivityData.length - index}
                                </button>
                              </li>
                            );
                          })}
                      </>
                    );
                  }
                })}
              </ul>

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
                  <div className={roleID == 7 ? "inner_form_new " : "d-none"}>
                    <label class="controlform">
                      Principal Analyst Recommendation
                    </label>

                    <div class="form-bx-radio mt-4">
                      <label>
                        <input
                          type="radio"
                          onChange={(e) => ChangeApplicationStatus(e)}
                          name="applicantType"
                          value="10"
                          checked
                        />{" "}
                        <span>Approved</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="2"
                          disabled
                        />{" "}
                        <span>Rejected</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="3"
                          disabled
                        />{" "}
                        <span>Deferred</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Cancelled</span>
                      </label>
                    </div>
                  </div>

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
                          <i className="bi bi-forward"></i>
                          <span style={{ fontWeight: "500" }}>
                            {" "}
                            {items.filename}
                          </span>
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
                          {" "}
                          <i className="bi bi-forward"></i> Other File{" "}
                          {index + 1}
                        </b>
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
                        {files.find((f) => f.id === "other" + (index + 1))?.file
                          ?.name || "No file chosen"}
                      </span>
                    </div>
                  ))}

                  {files?.length ? (
                    <div className="attachemt_form-bx">
                      <label style={{ border: "0px" }}>{""}</label>
                      <button
                        type="button"
                        className="addmore-btn mt-0"
                        onClick={(e) => handleAddMore(e)}
                      >
                        {" "}
                        Add More File{" "}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className={roleID == 7 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">
                      Submitted to Deputy Direct
                    </label>

                    <input
                      type="checkbox"
                      className="mt-4"
                      onChange={HandelSupervisorcheck}
                      checked={checkSupervisor}
                    />
                  </div>
                  {/* end form-bx  */}

                  {checkSupervisor == true && roleID == 7 ? (
                    <>
                      <div className="inner_form_new ">
                        <label className="controlform">
                          Select Deputy Direct
                        </label>

                        <div className="form-bx">
                          <label>
                            <select
                              ref={assignedToRef}
                              name="assignedTo"
                              onChange={supervisorHangechange}
                              className={
                                errors.assignedTo && !SupervisorNameID
                                  ? "error"
                                  : ""
                              }
                            >
                              <option value="">Select Deputy Direct</option>
                              {Supervisors?.map((item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={JSON?.stringify(item)}
                                    selected={
                                      item.userID ==
                                      applicationDetail?.assignedTo
                                    }
                                  >
                                    {item.name}
                                  </option>
                                );
                              })}
                            </select>
                            <span className="sspan"></span>
                            {errors.assignedTo && !SupervisorNameID ? (
                              <small className="errormsg">
                                Deputy direct is required{" "}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                      {/* end form-bx  */}
                    </>
                  ) : (
                    ""
                  )}
                  {/* end form-bx  */}

                  <div className={roleID == 7 ? "inner_form_new " : "d-none"}>
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
                  {/* end form-bx  */}

                  <div className={roleID == 7 ? "inner_form_new " : "d-none"}>
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
                                index == 0 && roleID > 7
                                  ? "tab-pane fade show active"
                                  : "tab-pane fade show  "
                              }
                              id={"pranalyst-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"pranalyst" + index}
                            >
                              <div className="inner_form_new ">
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      class=""
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
                                      placeholder="Notes"
                                      class=""
                                      disabled
                                    >
                                      {item?.comment}
                                    </textarea>
                                  </label>
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

        {roleID >= 8 ? (
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
              <span className="btn-collapse">
                <i class="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={deputyTab ? "customtab" : "d-none"}>
              <ul className="nav nav-pills mb-3" role="tablist">
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
                    id="ddir"
                    data-bs-toggle="tab"
                    data-bs-target="#ddir-justified-home"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Recent
                  </button>
                </li>

                {allcomment?.map((cur, i) => {
                  if (cur.assignedToRoleID == 8) {
                    return (
                      <>
                        {cur?.applicationActivityData
                          ?.slice()
                          ?.reverse()
                          .map((items, index) => {
                            return (
                              <li className="nav-item" role="presentation">
                                <button
                                  className={
                                    index == 0 && roleID > 8
                                      ? "nav-link w-100 border-radius0 active"
                                      : "nav-link border-radius0 w-100 "
                                  }
                                  id={"ddir" + index}
                                  data-bs-toggle="tab"
                                  data-bs-target={
                                    "#ddir-justified-home" + index
                                  }
                                  type="button"
                                  role="tab"
                                  aria-controls="home"
                                  aria-selected="true"
                                >
                                  Response{" "}
                                  {cur?.applicationActivityData.length - index}
                                </button>
                              </li>
                            );
                          })}
                      </>
                    );
                  }
                })}
              </ul>

              <div className="tab-content pt-2">
                <div
                  className={
                    roleID == 8
                      ? "tab-pane fade show active"
                      : "tab-pane fade show "
                  }
                  id="ddir-justified-home"
                  role="tabpanel"
                  aria-labelledby="ddir"
                >
                  <div className={roleID == 8 ? "inner_form_new " : "d-none"}>
                    <label class="controlform">
                      Deputy Director Recommendation
                    </label>

                    <div class="form-bx-radio mt-4">
                      <label>
                        <input
                          type="radio"
                          onChange={(e) => ChangeApplicationStatus(e)}
                          name="applicantType"
                          value="10"
                          checked
                        />{" "}
                        <span>Approved</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="2"
                          disabled
                        />{" "}
                        <span>Rejected</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="3"
                          disabled
                        />{" "}
                        <span>Deferred</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Cancelled</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Refer Back</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Delegation Required</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Referred to Other Dept</span>
                      </label>
                    </div>
                  </div>

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
                          <i className="bi bi-forward"></i>
                          <span style={{ fontWeight: "500" }}>
                            {" "}
                            {items.filename}
                          </span>
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
                          {" "}
                          <i className="bi bi-forward"></i> Other File{" "}
                          {index + 1}
                        </b>
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
                        {files.find((f) => f.id === "other" + (index + 1))?.file
                          ?.name || "No file chosen"}
                      </span>
                    </div>
                  ))}

                  {files?.length ? (
                    <div className="attachemt_form-bx">
                      <label style={{ border: "0px" }}>{""}</label>
                      <button
                        type="button"
                        className="addmore-btn mt-0"
                        onClick={(e) => handleAddMore(e)}
                      >
                        {" "}
                        Add More File{" "}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className={roleID == 8 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Submitted to Director</label>

                    <input
                      type="checkbox"
                      className="mt-4"
                      onChange={HandelSupervisorcheck}
                      checked={checkSupervisor}
                    />
                  </div>
                  {/* end form-bx  */}

                  {checkSupervisor == true && roleID == 8 ? (
                    <>
                      <div className="inner_form_new ">
                        <label className="controlform">Select Director</label>

                        <div className="form-bx">
                          <label>
                            <select
                              ref={assignedToRef}
                              name="assignedTo"
                              onChange={supervisorHangechange}
                              className={
                                errors.assignedTo && !SupervisorNameID
                                  ? "error"
                                  : ""
                              }
                            >
                              <option value="">Select Director</option>
                              {Supervisors?.map((item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={JSON?.stringify(item)}
                                    selected={
                                      item.userID ==
                                      applicationDetail?.assignedTo
                                    }
                                  >
                                    {item.name}
                                  </option>
                                );
                              })}
                            </select>
                            <span className="sspan"></span>
                            {errors.assignedTo && !SupervisorNameID ? (
                              <small className="errormsg">
                                Director is required{" "}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                      </div>
                      {/* end form-bx  */}
                    </>
                  ) : (
                    ""
                  )}
                  {/* end form-bx  */}

                  <div className={roleID == 8 ? "inner_form_new " : "d-none"}>
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
                  {/* end form-bx  */}

                  <div className={roleID == 8 ? "inner_form_new " : "d-none"}>
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
                                index == 0 && roleID > 8
                                  ? "tab-pane fade show active"
                                  : "tab-pane fade show  "
                              }
                              id={"ddir-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"ddir" + index}
                            >
                              <div className="inner_form_new ">
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      class=""
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
                                      placeholder="Notes"
                                      class=""
                                      disabled
                                    >
                                      {item?.comment}
                                    </textarea>
                                  </label>
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

        {roleID >= 9 ? (
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
              <span className="btn-collapse">
                <i class="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={director ? "customtab" : "d-none"}>
              <ul className="nav nav-pills mb-3" role="tablist">
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
                    Recent
                  </button>
                </li>

                {allcomment?.map((cur, i) => {
                  if (cur.assignedToRoleID == 9) {
                    return (
                      <>
                        {cur?.applicationActivityData
                          ?.slice()
                          ?.reverse()
                          .map((items, index) => {
                            return (
                              <li className="nav-item" role="presentation">
                                <button
                                  className={
                                    index == 0 && roleID > 9
                                      ? "nav-link w-100 border-radius0 active"
                                      : "nav-link border-radius0 w-100 "
                                  }
                                  id={"ddir" + index}
                                  data-bs-toggle="tab"
                                  data-bs-target={
                                    "#ddir-justified-home" + index
                                  }
                                  type="button"
                                  role="tab"
                                  aria-controls="home"
                                  aria-selected="true"
                                >
                                  Response{" "}
                                  {cur?.applicationActivityData.length - index}
                                </button>
                              </li>
                            );
                          })}
                      </>
                    );
                  }
                })}
              </ul>

              <div className="tab-content pt-2">
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
                  <div className={roleID == 9 ? "inner_form_new " : "d-none"}>
                    <label class="controlform">Direct Recommendation</label>

                    <div class="form-bx-radio mt-4">
                      <label>
                        <input
                          type="radio"
                          onChange={(e) => ChangeApplicationStatus(e)}
                          name="applicantType"
                          value="10"
                          checked
                        />{" "}
                        <span>Approved</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="2"
                          disabled
                        />{" "}
                        <span>Rejected</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="3"
                          disabled
                        />{" "}
                        <span>Deferred</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="applicantType"
                          value="4"
                          disabled
                        />{" "}
                        <span>Cancelled</span>
                      </label>
                    </div>
                  </div>

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
                          <i className="bi bi-forward"></i>
                          <span style={{ fontWeight: "500" }}>
                            {" "}
                            {items.filename}
                          </span>
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
                          {" "}
                          <i className="bi bi-forward"></i> Other File{" "}
                          {index + 1}
                        </b>
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
                        {files.find((f) => f.id === "other" + (index + 1))?.file
                          ?.name || "No file chosen"}
                      </span>
                    </div>
                  ))}

                  {files?.length ? (
                    <div className="attachemt_form-bx">
                      <label style={{ border: "0px" }}>{""}</label>
                      <button
                        type="button"
                        className="addmore-btn mt-0"
                        onClick={(e) => handleAddMore(e)}
                      >
                        {" "}
                        Add More File{" "}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  <div className={roleID == 9 ? "inner_form_new " : "d-none"}>
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
                  {/* end form-bx  */}

                  <div className={roleID == 9 ? "inner_form_new " : "d-none"}>
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

                {allcomment?.map((cur) => {
                  return cur?.applicationActivityData
                    ?.slice()
                    ?.reverse()
                    .map((item, index) => {
                      if (cur?.assignedToRoleID == 9) {
                        return (
                          <>
                            <div
                              key={index}
                              className={
                                index == 0 && roleID > 9
                                  ? "tab-pane fade show active"
                                  : "tab-pane fade show  "
                              }
                              id={"ddir-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"ddir" + index}
                            >
                              <div className="inner_form_new ">
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      class=""
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
                                      placeholder="Notes"
                                      class=""
                                      disabled
                                    >
                                      {item?.comment}
                                    </textarea>
                                  </label>
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
            {roleID == 9 ? "Submit & Close" : "Submit"}
          </button>
        </div>
      </form>
    </>
  );
};

export default ExportDashboardEditDetails;
