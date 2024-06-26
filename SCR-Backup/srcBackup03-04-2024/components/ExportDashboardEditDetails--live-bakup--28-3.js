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
import UpdatePopupMessage from "./UpdatePopupMessage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import logo from "../rbz_LOGO.png";
import dummysign from "../dummy_sign.png";

const ExportDashboardEditDetails = ({
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
  Actiondata
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
  const relatedexchangeControlNumberRef = useRef(null);
  const sectorRef = useRef(null);
  const subsectorRef = useRef(null);
  const typeExporterRef = useRef(null);
  const rateRef = useRef(null);
  const usdEquivalentRef = useRef(null);
  const dateExpirydisplayRef = useRef(null);
  const optionExpirydisplayRef = useRef(null);

  const FrequencyRef = useRef(null);
  const FrequencyDateRef = useRef(null);

  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const userName = Storage.getItem("userName");
  const bankName = Storage.getItem("bankName");
  const bankidcheck = bankID !== "" ? "1" : "3";
  const roleID = Storage.getItem("roleIDs");
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
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
  const [sharefiletab, setsharefiletab] = useState(false);

  const [recomdAnalyst, setRecomdAnalyst] = useState("121");

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
  const [Description, setDescription] = useState(" ");
  const [updatepopup, setupdatepopup] = useState(false);

  const [ExpiringDate, setExpiringDate] = useState(null);
  const [asignnextLeveldata, setasignnextLeveldata] = useState({
    Notes: "",
    Comment: "",
  });
  const [DateExpiryOption, setDateExpiryOption] = useState("");
  const [defaultnoExpiry, setdefaultnoExpiry] = useState("0");
  const [IsReturn, setIsReturn] = useState("0");
  const [IsReturnOption, setIsReturnOption] = useState("");
  const [AllFrequency, setAllFrequency] = useState([]);
  const [getFrequencyID, setGetFrequencyID] = useState("0");
  const [IsReturndisplay, setIsReturndisplay] = useState("");
  const [IsReturnExpiringDate, setIsReturnExpiringDate] = useState(null);
  const [DateExpirydisplay, setDateExpirydisplay] = useState("");
  const [curRate, setCurrate] = useState();

  const [userRoleRecordofficer, setuserRoleRecordofficer] = useState([]);
  const [selectuserRoleRecordofficer, setselectuserRoleRecordofficer] =
    useState("");
  const [getalluser, setGetalluser] = useState([]);

  const applicationNumber = applicationDetail.rbzReferenceNumber;
  const heading = "Updated Successfully!";
  const para = "Export request updated successfully!";

  const ChangeApplicationStatus = (e) => {
    const values = e.target.value;
    setapplicationstaus(values);
    // setAsignUser([]);
    // setAssignUserID("");
  };
  // console.log("Description", Description)

  const handleUserRole = (e) => {
    const value = e.target.value;
    setSupervisorRoleId(value);
  };

  console.log("Actiondata", Actiondata)
  // console.log("applicationDetail", applicationDetail);

  const ChangeNextlevelHandle = (e) => {
    const value = e.target.value;
    setSupervisorRoleId("");
    setSupervisorRoleId("");

    setnextlevelvalue(value);
    setAsignUser([]);
  };
  // const DescriptionHandle = (e) => {
  //   const { name, value } = e.target;
  //   let newErrors = {};
  //   let valid = true;

  //   if (value.charAt(0) === " ") {
  //     newErrors.Description = "First character cannot be a blank space";
  //     valid = false;
  //   } else {
  //     setDescription(value);
  //   }
  //   setErrors(newErrors);
  // };

  // console.log("files", files);
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
    }
    //  else if (name == "applicationPurpose" && specialChars.test(value.charAt(0))) {
    //   newErrors.applicationPurpose = "Special characters not allowed";
    //   valid = false;
    // }
    else if (name == "applicant" && value.charAt(0) === " ") {
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

  const HandleIsReturnOption = (e) => {
    const { name, value } = e.target;
    setIsReturnOption(e.target.value);
    setIsReturn(value);

    if (value == 0) {
      setIsReturndisplay("");
      setIsReturnExpiringDate();
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
  const SelectReturnFrequency = (e) => {
    const { name, value } = e.target;
    if (value == 1) {
      setGetFrequencyID(value);
    } else {
      setGetFrequencyID(value);
      setIsReturnExpiringDate(null);
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

  const supervisorHangechangeRoleRecordofficer = (e) => {
    const value = e.target.value;
    setErrors({});
    setselectuserRoleRecordofficer(value);
    if (value == "") {
      setGetalluser([]);
    } else {
      axios
        .post(APIURL + "User/GetUsersByRoleID", {
          RoleID: value,
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
    }
  };

  console.log("selectuserRoleRecordofficer", selectuserRoleRecordofficer);
  console.log("SupervisorRoleId----", SupervisorRoleId);
  console.log("AssignUserID", AssignUserID);
  console.log("applicationDetail", applicationDetail)

  useEffect(() => {
    getRoleHandle();
  }, []);

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
    if (AssignUserID == "" && roleID >= 5 && checkSupervisor == true && recomdAnalyst != "121") {
      newErrors.assignUserID = "User is required";
      valid = false;
    }
    if (
      (Description == "" ||
        Description == null ||
        Description == "<p><br></p>") &&
      roleID == 5
    ) {
      newErrors.Description = "Description is required";
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
    if (
      asignnextLeveldata.Notes === "" &&
      (AssignUserID == "" || AssignUserID == null) &&
      roleID >= 5
    ) {
      newErrors.Notes = "Notes is required";
      valid = false;
    }
    if (
      asignnextLeveldata.Comment === "" &&
      (AssignUserID == "" || AssignUserID == null) &&
      roleID >= 5
    ) {
      newErrors.Comment = "Comments is required";
      valid = false;
    }

    if (
      DateExpirydisplay == 0 &&
      DateExpiryOption == 1 &&
      roleID == "5" &&
      (ExpiringDate === "" || ExpiringDate == null)
    ) {
      newErrors.ExpiringDate = "Expiry Date is required";
      valid = false;
    }

    if (
      IsReturn == 1 &&
      getFrequencyID == 1 &&
      roleID == "5" &&
      (IsReturnExpiringDate === "" || IsReturnExpiringDate == null)
    ) {
      newErrors.IsReturnExpiringDate = "Expiry Date is required";
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
      (AssignUserID == "" || AssignUserID == null)  && recomdAnalyst != "121"
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

  const filtertin_bpn = companies?.find((company) => {
    if (company.id === getCompanyName?.value) {
      return {
        getbpn: company.bpnNumber,
        gettin: company.tinNumber,
      };
    }
  });

  console.log("error", errors)
  const PdftargetRef = useRef();

  const Pdfoption = {
    method: "open",
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.SMALL,
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      orientation: "landscape",
    },
    canvas: {
      mimeType: "image/png",
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };

  const closePopupHandle = () => {
    navigate("/BankADLADashboard");
    EditModalClose();

    setupdatepopup(false);
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
    if (validateForm()) {
      await axios
        .post(APIURL + "ExportApplication/UpdateExportApplications", {
          RBZReferenceNumber: applicationDetail?.rbzReferenceNumber,
          ID: applicationDetail?.id,
          DepartmentID: "1",
          UserID: UserID.replace(/"/g, ""),
          RoleID: roleID,
          AssignedTo:
            // checkSupervisor == true
            //   ? AssignUserID
            //     ? AssignUserID
            //     : UserID.replace(/"/g, "")
            //   : UserID.replace(/"/g, "")

            // AssignUserID ? AssignUserID : UserID.replace(/"/g, ""),

            roleID > 5 && AssignUserID == ""
              ? ""
              : AssignUserID
              ? AssignUserID
              : UserID.replace(/"/g, ""),

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
          // AssignedToRoleID: SupervisorRoleId
          //   ? SupervisorRoleId
          //   : AssignUserID && SupervisorRoleId == ""
          //   ? parseInt(roleID) + 1
          //   : roleID,

          AssignedToRoleID: SupervisorRoleId
        ? SupervisorRoleId
        : AssignUserID && SupervisorRoleId == "" && nextlevelvalue != '20'
        ? parseInt(roleID) + 1
        : roleID,

          Notes: asignnextLeveldata.Notes,
          ExpiringDate: ExpiringDate,
          ApplicationStatus: applicationstaus,
          ActionStatus:
            (AssignUserID == "" || AssignUserID == null) &&
            roleID != 5 &&
            roleID != 2 &&
            roleID != 3 &&
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
        })
        .then(async (res) => {
          if (res.data.responseCode === "200") {
            handleData();
            setupdatepopup(true);
            setSupervisorRoleId("");

            setAssignUserID("");
            setselectuserRoleRecordofficer("");
          } else {
            toast.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
                      inputValue.length >= 3
                        ? "No company found"
                        : "Please provide at least 3 characters for auto search of Company Name"
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

              {/* <div className="inner_form_new ">
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
              </div> */}
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
                      errors.bpnCode ? "error text-uppercase" : "text-uppercase"
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
          </div>
          {/* end form-bx  */}

          <div className="inner_form_new ">
            <label className="controlform">Application Date</label>

            <div className="form-bx">
              {/* <label> */}
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
                            selected={applicationDetail?.currency == cur.id}
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
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex">
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
                <label className="controlform">Bank Supervisor</label>

                <div className="form-bx">
                  <label>
                    <select
                      ref={assignedToRef}
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
                    {errors.assignedTo && !AssignUserID ? (
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

          {/* {roleID == 2 ? (
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
            </>
          ) : (
            ""
          )} */}

          <h5 className="section_top_subheading mt-2">Attachments</h5>

          {/* {attachmentData?.map((items, index) => {
            return (
              <div className="attachemt_form-bx" key={items.id}>
                <label>
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
                Other File {index + 1}
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
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>
            {console.log("allcomment - ", allcomment)}
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
                      </>
                    );
                  }
                });
              })}

              <div className={roleID == 3 ? "inner_form_new " : "d-none"}>
                <label className="controlform">
                  Submit To Record Officer
                </label>

                <input
                  type="checkbox"
                  // className="mt-4"
                  onChange={HandelSupervisorcheck}
                  checked={checkSupervisor}
                />
              </div>
              {/* end form-bx  */}

              {checkSupervisor == true ? (
                <>
                  <div className={roleID == 3 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Record Officer</label>

                    <div className="form-bx">
                      <label>
                        <select
                          ref={assignedToRef}
                          name="assignedTo"
                          onChange={supervisorHangechangeBankuser}
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
                <i className="bi bi-caret-down-fill"></i>
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
                      </>
                    );
                  }
                });
              })}

              <div className={roleID == 4 ? "inner_form_new " : "d-none"}>
                <label className="controlform">Submit To Next Level</label>

                <input
                  type="checkbox"
                  onChange={HandelSupervisorcheck}
                  checked={checkSupervisor}
                />
              </div>
              {/* end form-bx  */}

              {checkSupervisor == true ? (
                <>
                  {/* <div className={roleID == 4 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Analyst</label> 
                    <div className="form-bx">
                      <label>
                        <select
                          ref={assignedToRef}
                          name="assignedTo"
                          onChange={supervisorHangechangeBankuser}
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
                            Analyst is required
                          </small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>  */}

                  <div className="inner_form_new ">
                    <label className="controlform">Role</label>

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
                          <small className="errormsg">Role is required</small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="inner_form_new">
                    <label className="controlform">User</label>

                    <div className="form-bx">
                      <label>
                        <select
                          ref={assignedToRef}
                          name="assignedTo"
                          onChange={(e) => {
                            handleuserByrecordOfficer(e);
                          }}
                          className={
                            errors.assignedTo && !SupervisorNameID
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
                        {errors.assignedTo && !SupervisorNameID ? (
                          <small className="errormsg">User is required</small>
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
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={analystTab ? "customtab" : "d-none"}>
              {allcomment?.map((cur, i) => {
                if (cur.assignedToRoleID == 5) {
                  return (
                    <ul
                      className={
                        cur?.applicationActivityData.length >= 1
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
                                {/* {index == 0
                                  ? "Recent"
                                  : `Response ${
                                      cur?.applicationActivityData.length -
                                      index
                                    }`} */}
                                Response{" "}
                                {cur?.applicationActivityData.length - index}
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
  const firstItem = cur?.applicationActivityData?.[0]; // Accessing the first element directly

  if (cur?.assignedToRoleID === 5 && firstItem) { // Check if firstItem exists
    return (
      <div className="bakgroundaction">
      <div key={firstItem.actionID}> {/* Remember to add a unique key */}
        <div className="row">
          <div className="col-md-6"> 
            <div className="inner_form_new">
              <label className="controlform">Action Type</label>
              <div className="form-bx">
              <label>  <input
                  type="text"
                  className=""
                  disabled
                  value={firstItem?.actionStatusName}
                />
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-3"> 
            <div className="inner_form_new-sm">
              <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${firstItem?.actionRoleName}`}></i></label>
              <div className="form-bx-sm">
              <label>  <input
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
              <label className="controlform-sm">{firstItem?.actionStatusName} Date</label>
              <div className="form-bx-sm">
                <label>
                <input
                  type="text"
                  className=""
                  disabled
                  value={moment(firstItem?.createdDate).format("L")}
                />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={firstItem?.actionNotes ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Note</label>
          <div className="form-bx">
           <label> <textarea
              type="text"
              className=""
              disabled
              value={firstItem?.actionNotes}
            />
            </label>
          </div>
        </div>

        <div className={firstItem?.actionComment ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Comment</label>
          <div className="form-bx">
          <label> <textarea
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
                            id="coloration-Approvedved"
                            value="10"
                            onChange={(e) => {
                              ChangeApplicationStatus(e);
                              GetRoleHandle(10);
                              // supervisorHangechangeRole(e);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "10" ? true : false}
                          />
                          <label
                            for="coloration-Approvedved"
                            className="hidden-toggles__label"
                          >
                            Approved
                          </label>

                          <input
                            type="radio"
                            id="coloration-Rejected"
                            value="30"
                            onChange={(e) => {
                              ChangeApplicationStatus(e);
                              // supervisorHangechangeRole(e);
                              GetRoleHandle(30);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Rejected"
                            className="hidden-toggles__label"
                          >
                            Rejected
                          </label>

                          <input
                            type="radio"
                            id="coloration-Deferred"
                            onChange={(e) => {
                              ChangeApplicationStatus(e);
                              // supervisorHangechangeRole(e);
                              GetRoleHandle(40);
                            }}
                            name="applicationstaus"
                            value="40"
                            className="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Deferred"
                            className="hidden-toggles__label"
                          >
                            Deferred
                          </label>

                          <input
                            type="radio"
                            id="coloration-Cancelled"
                            onChange={(e) => {
                              ChangeApplicationStatus(e);
                              // supervisorHangechangeRole(e);
                              GetRoleHandle(25);
                            }}
                            name="applicationstaus"
                            value="25"
                            className="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Cancelled"
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
                    <label className="controlform">Analyst Description</label>
                    <div className="form-bx">
                      <div className="mt-2 py-1">
                        <ReactQuill
                          theme="snow"
                          value={
                            Description !="" || !Description
                              ? Description
                              : applicationDetail?.analystDescription
                          }
                          modules={modules}
                          defaultValue={Description}
                          readOnly={false}
                          preserveWhitespace
                          onChange={(newcomment) => setDescription(newcomment)}
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
                            name="nextaction"
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
                                name="nextaction"
                                // name="applicationstaus"
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
                            id="coloration-Delegation"
                            onChange={(e) => {
                              ChangeNextlevelHandle(e);
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(20);
                            }}
                            name="nextaction"
                            // name="applicationstaus"
                            value="20"
                            className="hidden-toggles__input"
                          />
                          <label
                            for="coloration-Delegation"
                            className="hidden-toggles__label"
                          >
                            Delegate
                          </label>

                          <input
                            type="radio"
                            id="coloration-Department"
                            onChange={(e) => {
                              ChangeNextlevelHandle(e);
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(35);
                            }}
                            name="nextaction"
                            // name="applicationstaus"
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
                          {/* end form-bx  */}
                        </>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-md-12">
                      {checkSupervisor == true && roleID == 5 ? (
                        <>
                          <div className="inner_form_new">
                            <label className="controlform">Submitted to Senior Analyst</label>

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
                                  <option value="">Select Senior Analyst</option>
                                  {asignUser?.map((item, index) => {
                                    return (
                                      <option key={index} value={item.userID}>
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
                          <span style={{ fontWeight: "500" }}>
                            {items.filename}
                          </span>
                        </label>
                        <div className="browse-btn">
                          Browse
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
                          Other File
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

                  <div className={roleID == 5 ? "inner_form_new " : "d-none"}>
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
                      roleID == 5
                        ? "inner_form_new align-items-center"
                        : "d-none"
                    }
                  >
                    <label className="controlform">Is Return Needed?</label>
                    <div className="hidden-toggles">
                      <input
                        type="radio"
                        id="YesIsReturn"
                        name="IsReturn"
                        onChange={(e) => HandleIsReturnOption(e)}
                        className="hidden-toggles__input"
                        checked={IsReturn == "1"}
                        value="1"
                      />
                      <label
                        for="YesIsReturn"
                        className="hidden-toggles__label"
                      >
                        Yes
                      </label>
                      <input
                        type="radio"
                        name="IsReturn"
                        id="NoIsReturn"
                        className="hidden-toggles__input"
                        onChange={(e) => HandleIsReturnOption(e)}
                        value="0"
                        checked={IsReturn == "0"}
                      />
                      <label for="NoIsReturn" className="hidden-toggles__label">
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
                        <label className="controlform">Return Frequency</label>
                        <div className="form-bx">
                          <label>
                            <select
                              name="ReturnFrequency"
                              onChange={(e) => SelectReturnFrequency(e)}
                              // className={
                              //   errors.assignedTo && !SupervisorRoleId
                              //     ? "error"
                              //     : ""
                              // }
                            >
                              <option value="0" defaultChecked>
                                Select Frequency
                              </option>
                              {AllFrequency?.map((item, index) => {
                                return (
                                  <option key={index} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })}
                            </select>
                            {/* <span className="sspan"></span>
                            {errors.assignedTo && !SupervisorRoleId ? (
                              <small className="errormsg">
                                Senior analyst is required{" "}
                              </small>
                            ) : (
                              ""
                            )} */}
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
                        <label className="controlform-sm">Frequency Date</label>
                        <div className="form-bx-sm">
                          <DatePicker
                            ref={FrequencyDateRef}
                            placeholderText="Select Frequency Date"
                            closeOnScroll={(e) => e.target === document}
                            selected={IsReturnExpiringDate}
                            onChange={(date) => setIsReturnExpiringDate(date)}
                            peekNextMonth
                            showMonthDropdown
                            maxDate={new Date("03-29-2027")}
                            minDate={new Date()}
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MM/yyyy"
                          />
                          <span className="sspan"></span>
                          {errors.IsReturnExpiringDate &&
                          (IsReturnExpiringDate == "Select Frequency Date " ||
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
                    <label className="controlform">Is Expiry Required ?</label>
                    <div className="hidden-toggles">
                      <input
                        type="radio"
                        id="exprq"
                        name="dateexpity"
                        onChange={(e) => HandleDateExpiryOption(e)}
                        className="hidden-toggles__input"
                        checked={defaultnoExpiry == "1"}
                        value="1"
                      />
                      <label for="exprq" className="hidden-toggles__label">
                        Yes
                      </label>
                      <input
                        type="radio"
                        name="dateexpity"
                        id="noexp"
                        className="hidden-toggles__input"
                        onChange={(e) => HandleDateExpiryOption(e)}
                        value="0"
                        checked={defaultnoExpiry == "0"}
                      />
                      <label for="noexp" className="hidden-toggles__label">
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
                            id="defineddate"
                            className="hidden-toggles__input"
                            name="dateExpirydisplay"
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
                            for="defineddate"
                            className="hidden-toggles__label"
                          >
                            Specific Date
                          </label>
                          <input
                            type="radio"
                            ref={optionExpirydisplayRef}
                            id="rerpetualdate"
                            name="dateExpirydisplay"
                            onChange={(e) =>
                              setDateExpirydisplay(e.target.value)
                            }
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
                        <label className="controlform-sm">Expiry Date</label>

                        <div className="form-bx-sm">
                          {/* <label> */}
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
                            dateFormat="dd/MM/yyyy"
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
                          {/* </label> */}
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
                                index == 0 && roleID > 5
                                  ? "tab-pane fade show active"
                                  : "tab-pane fade show  "
                              }
                              id={"analyst-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"analyst" + index}
                            >


                                
                              {Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map((items, actionindex) => {
                                  if (cur?.assignedToRoleID == 5 && index == actionindex ) {
                                    return (
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
                                      value={items?.actionStatusName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 

                              <div className="inner_form_new-sm ">
                                <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${items?.actionRoleName}`}></i></label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionUserName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 
                              <div className="inner_form_new-sm">
                                <label className="controlform-sm">
                                  {items?.actionStatusName} Date
                                </label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={moment(items?.createdDate).format(
                                        "L"
                                      )}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                                        </div>

                                        <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Note
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionNotes}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Comment
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionComment}
                                    />
                                  </label>
                                </div>
                              </div>

                                      </div>

                                  );
                                }
                              })}
                              )
                            } 
                              
                              <div className="inner_form_new ">
                                <label className="controlform">
                                  Analyst Recommendation
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={item?.statusName}
                                    />
                                  </label>
                                </div>
                              </div>

                              {/* {index == 0 ? (
                               <>
                               <div className="inner_form_new align-items-start mt-2">
                                  <label className="controlform">
                                    Analyst Description
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: item?.description,
                                        }}
                                      />
                                    </label>
                                  </div>

                                  
                                </div>
                                <div style={{opacity:"0", height:"0px", overflow:"hidden"}}> 
                                <div ref={PdftargetRef} className="p-5 mx-auto">
                                <div className="header_pdf"><img src={logo} /><h3>Document Management System</h3></div>
                                <div className="header_content" dangerouslySetInnerHTML={{__html:  Description ? Description : applicationDetail?.analystDescription}} />
                                </div>
                                </div>  
                                </>
                              ) : (
                                <div
                                  className={
                                    item?.description
                                      ? "inner_form_new "
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Analyst Description
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: item?.description,
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              )} */}
                              <div className="inner_form_new">
                                <label className="controlform">
                                  Analyst Description
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: applicationDetail?.analystDescription
                                          ? applicationDetail?.analystDescription
                                          : "N/A",
                                      }}
                                      disabled
                                      className="disabled"
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
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>
 

            <div className={sranalystTab ? "customtab" : "d-none"}> 
              {allcomment?.map((cur, i) => {
                if (cur.assignedToRoleID == 6) {
                  return (
                    <ul
                      className={
                        cur?.applicationActivityData.length >= 1
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
                                  index == 0 && roleID > 6
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
                                {/* {index == 0
                                  ? "Recent"
                                  : `Response ${
                                      cur?.applicationActivityData.length -
                                      index
                                    }`} */}
                                Response{" "}
                                {cur?.applicationActivityData.length - index}
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
                    roleID == 6
                      ? "tab-pane fade show active"
                      : "tab-pane fade show "
                  }
                  id="sranalystab-justified-home"
                  role="tabpanel"
                  aria-labelledby="sranalystab"
                >
                  
                  {Actiondata?.map((cur) => {
  const firstItem = cur?.applicationActivityData?.[0]; // Accessing the first element directly

  if (cur?.assignedToRoleID === 6 && firstItem) { // Check if firstItem exists
    return (
      <div className="bakgroundaction">
      <div key={firstItem.actionID}> {/* Remember to add a unique key */}
        <div className="row">
          <div className="col-md-6"> 
            <div className="inner_form_new">
              <label className="controlform">Action Type</label>
              <div className="form-bx">
              <label>  <input
                  type="text"
                  className=""
                  disabled
                  value={firstItem?.actionStatusName}
                />
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-3"> 
            <div className="inner_form_new-sm">
              <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${firstItem?.actionRoleName}`}></i></label>
              <div className="form-bx-sm">
              <label>  <input
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
              <label className="controlform-sm">{firstItem?.actionStatusName} Date</label>
              <div className="form-bx-sm">
                <label>
                <input
                  type="text"
                  className=""
                  disabled
                  value={moment(firstItem?.createdDate).format("L")}
                />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={firstItem?.actionNotes ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Note</label>
          <div className="form-bx">
           <label> <textarea
              type="text"
              className=""
              disabled
              value={firstItem?.actionNotes}
            />
            </label>
          </div>
        </div>

        <div className={firstItem?.actionComment ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Comment</label>
          <div className="form-bx">
          <label> <textarea
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
                            }}
                            name="nextaction"
                            className="hidden-toggles__input"
                            value="121"
                            checked={recomdAnalyst == "121" ? true : false}
                          />
                          <label
                            for="srrecomndByAnalyst"
                            className="hidden-toggles__label"
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
                              // ChangeApplicationStatus(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(15);
                            }}
                            onClick={() => setRecomdAnalyst("")}
                            name="nextaction"
                            // name="applicationstaus"
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
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(20);
                            }}
                            onClick={() => setRecomdAnalyst("")}
                            name="nextaction"
                            // name="applicationstaus"
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
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(35);
                            }}
                            onClick={() => setRecomdAnalyst("")}
                            name="nextaction"
                            // name="applicationstaus"
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

                  <div className={checkSupervisor == true ? "row" : "d-none"}>
                    <div className="col-md-12 d-flex c-gap">
                      <div className={nextlevelvalue == 15 ? "w-50" : "d-none"}>
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
                                  {errors.assignedTo && !SupervisorRoleId ? (
                                    <small className="errormsg">
                                      Role is required{" "}
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
                      <div className={nextlevelvalue == 15 ? "w-50" : "w-100"}>
                        {roleID == 6 && recomdAnalyst != "121" ? (
                          <>
                            <div className="inner_form_new">
                              <label className="controlform">User</label>

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
                                    <option value="">Select User</option>
                                    {asignUser?.map((item, index) => {
                                      return (
                                        <option key={index} value={item.userID}>
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
                            {/* end form-bx  */}
                          </>
                        ) : (
                          ""
                        )}
                      </div>

                      {/* end form-bx  */}
                    </div>
                  </div>

                  <div>
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
                            Other File
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
                  {/* end form-bx  */}

                  <div
                    className={
                      roleID == 6
                        ? "inner_form_new align-items-start mt-2"
                        : "d-none"
                    }
                  >
                    <label className="controlform">Analyst Description</label>
                    <div className="form-bx">
                      <div className="mt-2 py-1">
                        <ReactQuill
                          theme="snow"
                          value={
                            Description != " " || !Description
                              ? Description
                              : applicationDetail?.analystDescription
                          }
                          modules={modules}
                          defaultValue={Description}
                          readOnly={false}
                          preserveWhitespace
                          onChange={(newcomment) => setDescription(newcomment)}
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

                  <div className={roleID == 6 ? "inner_form_new " : "d-none"}>
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

                  <div className={roleID == 6 ? "inner_form_new " : "d-none"}>
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
                            id="srcoloration-Approvedved"
                            value="10"
                            onChange={(e) => {
                              ChangeApplicationStatus(e);
                              GetRoleHandle(10);
                              // supervisorHangechangeRole(e);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "10" ? true : false}
                          />
                          <label
                            for="srcoloration-Approvedved"
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(30);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "30" ? true : false}
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(40);
                            }}
                            name="applicationstaus"
                            value="40"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "40" ? true : false}
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(25);
                            }}
                            name="applicationstaus"
                            value="25"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "25" ? true : false}
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
                              id={"sranalystab-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"sranalystab" + index}
                            >

{Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map((items, actionindex) => {
                                  if (cur?.assignedToRoleID == 6 && index == actionindex ) {
                                    return (
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
                                      value={items?.actionStatusName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 

                              <div className="inner_form_new-sm ">
                                <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${items?.actionRoleName}`}></i></label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionUserName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 
                              <div className="inner_form_new-sm">
                                <label className="controlform-sm">
                                  {items?.actionStatusName} Date
                                </label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={moment(items?.createdDate).format(
                                        "L"
                                      )}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                                        </div>

                                        <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Note
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionNotes}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Comment
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionComment}
                                    />
                                  </label>
                                </div>
                              </div>

                            </div>

                                  );
                                }
                              })}
                              )
                            } 
                             
                             
                             
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
                                      value={item?.statusName}
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
                                <label className="controlform">Comments</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      disabled
                                    >
                                      {item?.comment ? item?.comment : "N/A"}
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
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={principalanalystTab ? "customtab" : "d-none"}>
              {allcomment?.map((cur, i) => {
                if (cur.assignedToRoleID == 7) {
                  return (
                    <ul
                      className={
                        cur?.applicationActivityData.length >= 1
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
                                {/* {index == 0
                                  ? "Recent"
                                  : `Response ${
                                      cur?.applicationActivityData.length -
                                      index
                                    }`} */}
                                Response{" "}
                                {cur?.applicationActivityData.length - index}
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
                    roleID == 7
                      ? "tab-pane fade show active"
                      : "tab-pane fade show "
                  }
                  id="pranalyst-justified-home"
                  role="tabpanel"
                  aria-labelledby="pranalyst"
                >
                  
                  {Actiondata?.map((cur) => {
  const firstItem = cur?.applicationActivityData?.[0]; // Accessing the first element directly

  if (cur?.assignedToRoleID === 7 && firstItem) { // Check if firstItem exists
    return (
      <div className="bakgroundaction">
      <div key={firstItem.actionID}> {/* Remember to add a unique key */}
        <div className="row">
          <div className="col-md-6"> 
            <div className="inner_form_new">
              <label className="controlform">Action Type</label>
              <div className="form-bx">
              <label>  <input
                  type="text"
                  className=""
                  disabled
                  value={firstItem?.actionStatusName}
                />
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-3"> 
            <div className="inner_form_new-sm">
              <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${firstItem?.actionRoleName}`}></i></label>
              <div className="form-bx-sm">
              <label>  <input
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
              <label className="controlform-sm">{firstItem?.actionStatusName} Date</label>
              <div className="form-bx-sm">
                <label>
                <input
                  type="text"
                  className=""
                  disabled
                  value={moment(firstItem?.createdDate).format("L")}
                />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={firstItem?.actionNotes ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Note</label>
          <div className="form-bx">
           <label> <textarea
              type="text"
              className=""
              disabled
              value={firstItem?.actionNotes}
            />
            </label>
          </div>
        </div>

        <div className={firstItem?.actionComment ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Comment</label>
          <div className="form-bx">
          <label> <textarea
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
                            }}
                            name="nextactionprincipal"
                            className="hidden-toggles__input"
                            value="121"
                            checked={recomdAnalyst == "121" ? true : false}
                          />
                          <label
                            for="prcoloration-recomndByAnalyst"
                            className="hidden-toggles__label"
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
                              // ChangeApplicationStatus(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(15);
                            }}
                            onClick={() => setRecomdAnalyst("")}
                            name="nextactionprincipal"
                            // name="applicationstaus"
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
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(20);
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
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(35);
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

                  <div className={checkSupervisor == true ? "row" : "d-none"}>
                    <div className="col-md-12 d-flex c-gap">
                      <div className={nextlevelvalue == 15 ? "w-50" : "d-none"}>
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
                                  {errors.assignedTo && !SupervisorRoleId ? (
                                    <small className="errormsg">
                                      Role is required{" "}
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
                      <div className={nextlevelvalue == 15 ? "w-50" : "w-100"}>
                        {roleID == 7 && recomdAnalyst != "121" ? (
                          <>
                            <div className="inner_form_new">
                              <label className="controlform">User</label>

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
                                    <option value="">Select User</option>
                                    {asignUser?.map((item, index) => {
                                      return (
                                        <option key={index} value={item.userID}>
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
                            {/* end form-bx  */}
                          </>
                        ) : (
                          ""
                        )}
                      </div>

                      {/* end form-bx  */}
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
                          Other File
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

                  <div
                    className={
                      roleID == 7
                        ? "inner_form_new align-items-start mt-2"
                        : "d-none"
                    }
                  >
                    <label className="controlform">Analyst Description</label>
                    <div className="form-bx">
                      <div className="mt-2 py-1">
                        <ReactQuill
                          theme="snow"
                          value={
                            Description != " " || !Description
                              ? Description
                              : applicationDetail?.analystDescription
                          }
                          readOnly={false}
                          preserveWhitespace
                          modules={modules}
                          onChange={(newcomment) => setDescription(newcomment)}
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

                  <div className={roleID == 7 ? "inner_form_new " : "d-none"}>
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

                  <div className={roleID == 7 ? "inner_form_new " : "d-none"}>
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
                            id="srcoloration-Approvedved"
                            value="10"
                            onChange={(e) => {
                              ChangeApplicationStatus(e);
                              GetRoleHandle(10);
                              // supervisorHangechangeRole(e);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "10" ? true : false}
                          />
                          <label
                            for="srcoloration-Approvedved"
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(30);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "30" ? true : false}
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(40);
                            }}
                            name="applicationstaus"
                            value="40"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "40" ? true : false}
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(25);
                            }}
                            name="applicationstaus"
                            value="25"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "25" ? true : false}
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
                                index == 0 && roleID > 7
                                  ? "tab-pane fade show active"
                                  : "tab-pane fade show  "
                              }
                              id={"pranalyst-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"pranalyst" + index}
                            >
                            {Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map((items, actionindex) => {
                                  if (cur?.assignedToRoleID == 7 && index == actionindex ) {
                                    return (
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
                                      value={items?.actionStatusName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 

                              <div className="inner_form_new-sm ">
                                <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${items?.actionRoleName}`}></i></label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionUserName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 
                              <div className="inner_form_new-sm">
                                <label className="controlform-sm">
                                  {items?.actionStatusName} Date
                                </label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={moment(items?.createdDate).format(
                                        "L"
                                      )}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                                        </div>

                                        <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Note
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionNotes}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Comment
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionComment}
                                    />
                                  </label>
                                </div>
                              </div>

                            </div>

                                  );
                                }
                              })}
                              )
                            } 

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
                                      value={item?.statusName}
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
                                <label className="controlform">Comments</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Comments"
                                      className=""
                                      disabled
                                    >
                                      {item?.comment ? item?.comment : "N/A"}
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
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={deputyTab ? "customtab" : "d-none"}>
              {allcomment?.map((cur, i) => {
                if (cur.assignedToRoleID == 8) {
                  return (
                    <ul
                      className={
                        cur?.applicationActivityData.length >= 1
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
                                  index == 0 && roleID > 8
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
                                {/* {index == 0
                                  ? "Recent"
                                  : `Response ${
                                      cur?.applicationActivityData.length -
                                      index
                                    }`} */}
                                Response{" "}
                                {cur?.applicationActivityData.length - index}
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
                    roleID == 8
                      ? "tab-pane fade show active"
                      : "tab-pane fade show "
                  }
                  id="deputy-justified-home"
                  role="tabpanel"
                  aria-labelledby="deputy"
                >
                   
                  {Actiondata?.map((cur) => {
  const firstItem = cur?.applicationActivityData?.[0]; // Accessing the first element directly

  if (cur?.assignedToRoleID === 8 && firstItem) { // Check if firstItem exists
    return (
      <div className="bakgroundaction">
      <div key={firstItem.actionID}> {/* Remember to add a unique key */}
        <div className="row">
          <div className="col-md-6"> 
            <div className="inner_form_new">
              <label className="controlform">Action Type</label>
              <div className="form-bx">
              <label>  <input
                  type="text"
                  className=""
                  disabled
                  value={firstItem?.actionStatusName}
                />
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-3"> 
            <div className="inner_form_new-sm">
              <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${firstItem?.actionRoleName}`}></i></label>
              <div className="form-bx-sm">
              <label>  <input
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
              <label className="controlform-sm">{firstItem?.actionStatusName} Date</label>
              <div className="form-bx-sm">
                <label>
                <input
                  type="text"
                  className=""
                  disabled
                  value={moment(firstItem?.createdDate).format("L")}
                />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={firstItem?.actionNotes ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Note</label>
          <div className="form-bx">
           <label> <textarea
              type="text"
              className=""
              disabled
              value={firstItem?.actionNotes}
            />
            </label>
          </div>
        </div>

        <div className={firstItem?.actionComment ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Comment</label>
          <div className="form-bx">
          <label> <textarea
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
                            // onChange={(e) => {
                            //   setcheckSupervisor(true);
                            //   supervisorHangechangeRole(e);
                            //   ChangeNextlevelHandle(e);
                            //   GetRoleHandle(121);
                            // }}
                            onClick={() => {
                              setRecomdAnalyst("121");
                              setnextlevelvalue("");
                              setAssignUserID("");
                              setSupervisorRoleId("");
                              setAsignUser([]);
                            }}
                            name="nextactiondupty"
                            className="hidden-toggles__input"
                            value="121"
                            checked={recomdAnalyst == "121" ? true : false}
                          />
                          <label
                            for="deptyrecomndByAnalyst"
                            className="hidden-toggles__label"
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
                              // ChangeApplicationStatus(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(15);
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
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(20);
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
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(35);
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

                  <div className={checkSupervisor == true ? "row" : "d-none"}>
                    <div className="col-md-12 d-flex c-gap">
                      <div className={nextlevelvalue == 15 ? "w-50" : "d-none"}>
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
                                  {errors.assignedTo && !SupervisorRoleId ? (
                                    <small className="errormsg">
                                      Role is required{" "}
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
                      <div className={nextlevelvalue == 15 ? "w-50" : "w-100"}>
                        {roleID == 8 && recomdAnalyst != "121" ? (
                          <>
                            <div className="inner_form_new">
                              <label className="controlform">User</label>

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
                                    <option value="">Select User</option>
                                    {asignUser?.map((item, index) => {
                                      return (
                                        <option key={index} value={item.userID}>
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
                            {/* end form-bx  */}
                          </>
                        ) : (
                          ""
                        )}
                      </div>

                      {/* end form-bx  */}
                    </div>
                  </div>

                  {attachmentData?.map((items, index) => {
                    return (
                      <div className="attachemt_form-bx  mt-2" key={index}>
                        <label
                          style={{
                            background: "#d9edf7",
                            padding: "9px 3px",
                            border: "0px",
                          }}
                        >
                          <span style={{ fontWeight: "500" }}>
                            {" "}
                            {items.filename}
                          </span>
                        </label>
                        <div className="browse-btn">
                          Browse{" "}
                          <input
                            type="file"
                            onChange={(e) =>
                              handleFileChange(e, "deputy" + index)
                            }
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
                        <b>Other File {index + 1}</b>
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
                  {/* end form-bx  */}

                  <div className={roleID == 8 ? "inner_form_new " : "d-none"}>
                    <label className="controlform">Analyst Description</label>
                    <div className="form-bx">
                      <div className="mt-2 py-1">
                      <ReactQuill
                          theme="snow"
                          value={
                            Description != " " || !Description
                              ? Description
                              : applicationDetail?.analystDescription
                          }
                           readOnly={false}
                          preserveWhitespace
                          modules={modules}
                          onChange={(newcomment) => setDescription(newcomment)}
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

                  <div className={roleID == 8 ? "inner_form_new " : "d-none"}>
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

                  <div className={roleID == 8 ? "inner_form_new " : "d-none"}>
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
                            id="srcoloration-Approvedved"
                            value="10"
                            onChange={(e) => {
                              ChangeApplicationStatus(e);
                              GetRoleHandle(10);
                              // supervisorHangechangeRole(e);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "10" ? true : false}
                          />
                          <label
                            for="srcoloration-Approvedved"
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(30);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "30" ? true : false}
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(40);
                            }}
                            name="applicationstaus"
                            value="40"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "40" ? true : false}
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(25);
                            }}
                            name="applicationstaus"
                            value="25"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "25" ? true : false}
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
                                index == 0 && roleID > 8
                                  ? "tab-pane fade show active"
                                  : "tab-pane fade show  "
                              }
                              id={"deputy-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"deputy" + index}
                            >
                             
                             {Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map((items, actionindex) => {
                                  if (cur?.assignedToRoleID == 8 && index == actionindex ) {
                                    return (
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
                                      value={items?.actionStatusName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 

                              <div className="inner_form_new-sm ">
                                <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${items?.actionRoleName}`}></i></label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionUserName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 
                              <div className="inner_form_new-sm">
                                <label className="controlform-sm">
                                  {items?.actionStatusName} Date
                                </label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={moment(items?.createdDate).format(
                                        "L"
                                      )}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                                        </div>

                                        <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Note
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionNotes}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Comment
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionComment}
                                    />
                                  </label>
                                </div>
                              </div>

                            </div>

                                  );
                                }
                              })}
                              )
                            } 

                              <div className="inner_form_new ">
                                <label className="controlform">
                                  Deputy Director Recommendation
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      disabled
                                      value={item?.statusName}
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
                                <label className="controlform">Comments</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      disabled
                                    >
                                      {item?.comment ? item?.comment : "N/A"}
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
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={director ? "customtab" : "d-none"}>
              {allcomment?.map((cur, i) => {
                if (cur.assignedToRoleID == 9) {
                  return (
                    <ul
                      className={
                        cur?.applicationActivityData.length >= 1
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
                                  index == 0 && roleID > 9
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
                                {/* {index == 0
                          ? "Recent"
                          : `Response ${
                              cur?.applicationActivityData.length -
                              index
                            }`} */}
                                Response{" "}
                                {cur?.applicationActivityData.length - index}
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
                    roleID == 9
                      ? "tab-pane fade show active"
                      : "tab-pane fade show "
                  }
                  id="director-justified-home"
                  role="tabpanel"
                  aria-labelledby="director"
                >
                  
                  {Actiondata?.map((cur) => {
  const firstItem = cur?.applicationActivityData?.[0]; // Accessing the first element directly

  if (cur?.assignedToRoleID === 9 && firstItem) { // Check if firstItem exists
    return (
      <div className="bakgroundaction">
      <div key={firstItem.actionID}> {/* Remember to add a unique key */}
        <div className="row">
          <div className="col-md-6"> 
            <div className="inner_form_new">
              <label className="controlform">Action Type</label>
              <div className="form-bx">
              <label>  <input
                  type="text"
                  className=""
                  disabled
                  value={firstItem?.actionStatusName}
                />
                </label>
              </div>
            </div>
          </div>

          <div className="col-md-3"> 
            <div className="inner_form_new-sm">
              <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${firstItem?.actionRoleName}`}></i></label>
              <div className="form-bx-sm">
              <label>  <input
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
              <label className="controlform-sm">{firstItem?.actionStatusName} Date</label>
              <div className="form-bx-sm">
                <label>
                <input
                  type="text"
                  className=""
                  disabled
                  value={moment(firstItem?.createdDate).format("L")}
                />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={firstItem?.actionNotes ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Note</label>
          <div className="form-bx">
           <label> <textarea
              type="text"
              className=""
              disabled
              value={firstItem?.actionNotes}
            />
            </label>
          </div>
        </div>

        <div className={firstItem?.actionComment ? "inner_form_new" : "d-none"}>
          <label className="controlform">Action Comment</label>
          <div className="form-bx">
          <label> <textarea
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
                            }}
                            className="hidden-toggles__input"
                            value="121"
                            checked={recomdAnalyst == "121" ? true : false}
                          />
                          <label
                            for="direcotsrecomndByAnalyst"
                            className="hidden-toggles__label"
                          >
                            As Recommended by Analyst
                          </label>

                          <input
                            type="radio"
                            id="direcotsRefer"
                            onChange={(e) => {
                              ChangeNextlevelHandle(e);
                              // ChangeApplicationStatus(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(15);
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
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(20);
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
                              // ChangeApplicationStatus(e);
                              supervisorHangechangeRole(e);
                              setcheckSupervisor(true);
                              GetRoleHandle(35);
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

                  <div className={checkSupervisor == true ? "row" : "d-none"}>
                    <div className="col-md-12 d-flex c-gap">
                      <div className={nextlevelvalue == 15 ? "w-50" : "d-none"}>
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
                                  {errors.assignedTo && !SupervisorRoleId ? (
                                    <small className="errormsg">
                                      Role is required{" "}
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
                      <div className={nextlevelvalue == 15 ? "w-50" : "w-100"}>
                        {roleID == 9 && recomdAnalyst != "121" ? (
                          <>
                            <div className="inner_form_new">
                              <label className="controlform">User</label>

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
                                    <option value="">Select User</option>
                                    {asignUser?.map((item, index) => {
                                      return (
                                        <option key={index} value={item.userID}>
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
                            {/* end form-bx  */}
                          </>
                        ) : (
                          ""
                        )}
                      </div>

                      {/* end form-bx  */}
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
                          <span style={{ fontWeight: "500" }}>
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
                          Other File
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

                  <div
                    className={
                      roleID == 9
                        ? "inner_form_new align-items-start mt-2"
                        : "d-none"
                    }
                  >
                    <label className="controlform">Analyst Description--</label>
                    <div className="form-bx">
                      <div className="mt-2 py-1">
                        <ReactQuill
                          theme="snow"
                          value={
                            Description == " " || Description == null
                              ? applicationDetail?.analystDescription
                              :  Description
                          }
                          modules={modules} 
                          readOnly={false}
                          preserveWhitespace
                          onChange={(newcomment) => setDescription(newcomment)}
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

                  <div className={roleID == 9 ? "inner_form_new " : "d-none"}>
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

                  <div className={roleID == 9 ? "inner_form_new " : "d-none"}>
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
                            id="srcoloration-Approvedved"
                            value="10"
                            onChange={(e) => {
                              ChangeApplicationStatus(e);
                              GetRoleHandle(10);
                              // supervisorHangechangeRole(e);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "10" ? true : false}
                          />
                          <label
                            for="srcoloration-Approvedved"
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(30);
                            }}
                            name="applicationstaus"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "30" ? true : false}
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(40);
                            }}
                            name="applicationstaus"
                            value="40"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "40" ? true : false}
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
                              // supervisorHangechangeRole(e);
                              // GetRoleHandle(25);
                            }}
                            name="applicationstaus"
                            value="25"
                            className="hidden-toggles__input"
                            checked={applicationstaus == "25" ? true : false}
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
                                index == 0 && roleID >= 9
                                  ? "tab-pane fade show active"
                                  : "tab-pane fade show  "
                              }
                              id={"director-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"director" + index}
                            >
                              
                              {Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map((items, actionindex) => {
                                  if (cur?.assignedToRoleID == 9 && index == actionindex ) {
                                    return (
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
                                      value={items?.actionStatusName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 

                              <div className="inner_form_new-sm ">
                                <label className="controlform-sm">User <i className="bi bi-info-circle icons-info" title={`Role : ${items?.actionRoleName}`}></i></label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionUserName}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                              <div className="col-md-3"> 
                              <div className="inner_form_new-sm">
                                <label className="controlform-sm">
                                  {items?.actionStatusName} Date
                                </label>
                                <div className="form-bx-sm">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={moment(items?.createdDate).format(
                                        "L"
                                      )}
                                    />
                                  </label>
                                </div>
                              </div>
                              </div>

                                        </div>

                                        <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Note
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionNotes}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                <label className="controlform">
                                  Action Comment
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      value={items?.actionComment}
                                    />
                                  </label>
                                </div>
                              </div>

                            </div>

                                  );
                                }
                              })}
                              )
                            } 


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

        {/* ------download pdf  */}

        {allcomment?.map((cur) => {
          return cur?.applicationActivityData
            ?.slice()
            ?.reverse()
            ?.map((item, index) => {
              if (cur?.assignedToRoleID == 5) {
                return (
                  <>
                    <div
                      style={{
                        opacity: "0",
                        height: "0px",
                        overflow: "hidden",
                      }}
                    >
                      {index == 0 ? (
                        <>
                          <div>
                            <div
                              ref={PdftargetRef}
                              className="p-5 mx-auto"
                              style={{ position: "relative" }}
                            >
                              <h6 className="text_preview">Preview</h6>
                              <table width="100%" className="pdfTable">
                                {/* <tr>
                                          <td colSpan="2" className="text-end">
                                            <p
                                              style={{
                                                marginBottom: "0px",
                                                color: "#000",
                                                fontSize: "14px",
                                              }}
                                            >
                                              {applicationDetail?.rbzReferenceNumber}
                                            </p>
                                            <p
                                              style={{
                                                marginBottom: "0px",
                                                color: "#000",
                                                fontSize: "14px",
                                              }}
                                            >
                                              {applicationDetail?.statusName}
                                            </p>
                                          </td>
                                        </tr> */}
                                <tr>
                                  <td width="25%">
                                    <p
                                      style={{
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        marginBottom: "0px",
                                        marginLeft: "auto",
                                      }}
                                    >
                                      <img
                                        src={logo}
                                        alt="logo"
                                        className="w-100"
                                      />
                                    </p>
                                  </td>
                                  <td className="align-middle" width="75%">
                                    <p
                                      style={{
                                        marginBottom: "0px",
                                        color: "#000",
                                        fontSize: "14px",
                                        textAlign: "center",
                                      }}
                                    >
                                      Reserve Bank of Zimbabwe. 80 Samora Machel
                                      Avenue, P.O. Box 1283, Harare, Zimbabwe.
                                    </p>
                                    <p
                                      style={{
                                        // marginBottom: "0px",
                                        color: "#000",
                                        fontSize: "14px",
                                        textAlign: "center",
                                      }}
                                    >
                                      Tel: 263 242 703000, 263 8677000477,
                                      Website: www.rbz.co.zw
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    width="20%"
                                    style={{
                                      marginBottom: "0px",
                                      color: "#000",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Exchange Control Ref
                                    <br />
                                    Previous Exchange Control Ref
                                  </td>
                                  <td width="80%">
                                    <p
                                      style={{
                                        marginBottom: "0px",
                                        color: "#000",
                                        fontSize: "14px",
                                        textAlign: "left",
                                        fontWeight: "600",
                                      }}
                                    >
                                      : {applicationDetail?.rbzReferenceNumber}
                                      <br />: N/A
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    colSpan="2"
                                    style={{
                                      color: "#000",
                                      fontSize: "16px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    {moment(
                                      applicationDetail?.applicationSubmittedDate
                                    ).format("DD MMMM YYYY")}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    colSpan="2"
                                    style={{
                                      color: "#000",
                                      fontSize: "16px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    The Head - Exchange Control
                                    <br />
                                    {applicationDetail?.bankName}
                                    <br />
                                    {applicationDetail?.bankAddress1 != null ||
                                    applicationDetail?.bankAddress1 != ""
                                      ? applicationDetail?.bankAddress1 +
                                        "," +
                                        " "
                                      : ""}
                                    {applicationDetail?.bankAddress2 != null ||
                                    applicationDetail?.bankAddress2 != ""
                                      ? applicationDetail?.bankAddress2 +
                                        "," +
                                        " "
                                      : ""}
                                    {applicationDetail?.bankAddress3 != null ||
                                    applicationDetail?.bankAddress3 != ""
                                      ? applicationDetail?.bankAddress3
                                      : ""}
                                    <br />
                                    <u
                                      className="text-uppercase"
                                      style={{ fontWeight: "600" }}
                                    >
                                      {applicationDetail?.bankCity != null ||
                                      applicationDetail?.bankCity != ""
                                        ? applicationDetail?.bankCity
                                        : ""}
                                    </u>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    colSpan="2"
                                    style={{
                                      color: "#000",
                                      fontSize: "16px",
                                      fontWeight: "400",
                                    }}
                                  >
                                    Dear Sir/Madam,
                                  </td>
                                </tr>

                                <tr>
                                  <td className="p-0" colSpan="2">
                                    <table
                                      width="100%"
                                      className="return-tables"
                                    >
                                      <tr>
                                        <td
                                          colSpan="2"
                                          style={{
                                            padding: "5px 15px 15px",
                                          }}
                                        >
                                          <p
                                            style={{
                                              color: "#000",
                                              fontSize: "16px",
                                              fontWeight: "600",
                                              borderBottom: "1px solid #000",
                                              marginBottom: "0px",
                                            }}
                                          >
                                            RE: EXTENSION OF ACQUITTAL PERIOD
                                            FOR ADVANCE PAYMENTS
                                          </p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          width="25%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          Exporter
                                        </td>
                                        <td
                                          width="75%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          :{" "}
                                          {applicationDetail?.companyName !=
                                          null
                                            ? applicationDetail?.companyName
                                            : applicationDetail?.name}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          width="25%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          Date Submitted
                                        </td>
                                        <td
                                          width="75%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "600",
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
                                          width="25%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          Currency and Amount
                                        </td>
                                        <td
                                          width="75%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          : {applicationDetail?.currencyCode}
                                          &nbsp;
                                          {applicationDetail?.amount}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          width="25%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          USD Equivalent
                                        </td>
                                        <td
                                          width="75%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          : USD &nbsp;
                                          {applicationDetail?.usdEquivalent}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          width="25%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          Status/Decision
                                        </td>
                                        <td
                                          width="75%"
                                          style={{
                                            color: "#000",
                                            fontSize: "18px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          : {applicationDetail?.statusName}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          width="25%"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          Expiry Date
                                        </td>
                                        <td
                                          width="75%"
                                          style={{
                                            color: "#000",
                                            fontSize: "18px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          :{" "}
                                          {applicationDetail?.expiringDate ==
                                            null ||
                                          applicationDetail?.expiringDate == ""
                                            ? "N/A"
                                            : applicationDetail?.expiringDate}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          width="25%"
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                            color: "#000",
                                          }}
                                        >
                                          Returns Frequency
                                        </td>
                                        <td
                                          width="75%"
                                          style={{
                                            color: "#000",
                                            fontSize: "18px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          :{" "}
                                          {applicationDetail?.returnFrequencyName ==
                                            null ||
                                          applicationDetail?.returnFrequencyName ==
                                            ""
                                            ? "N/A"
                                            : applicationDetail?.returnFrequencyName}
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-0" colSpan="2">
                                    <table>
                                      <tr>
                                        <td
                                          colSpan="2"
                                          style={{
                                            color: "#000",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            textDecoration: "underline",
                                            padding: "15px 15px 15px",
                                          }}
                                        >
                                          Response/Conditions
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colSpan="2" className="p-0">
                                          <table width="100%">
                                            <tr>
                                              <td
                                                style={{
                                                  color: "#000",
                                                  fontSize: "16px",
                                                  fontWeight: "400",
                                                }}
                                              >
                                                <div
                                                  className="header_content"
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
                                        <td
                                          colSpan="2"
                                          style={{
                                            color: "#000",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                            padding: "5px 15px 15px",
                                          }}
                                        >
                                          Yours Sincerely,
                                          <img
                                            src={dummysign}
                                            alt="Signature"
                                            style={{
                                              width: "120px",
                                              height: "50px",
                                              borderBottom: "2px dotted #000",
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
                                              padding: "10px 0px",
                                            }}
                                          >
                                            deputydirector7
                                          </p>
                                          <h3
                                            style={{
                                              color: "#000",
                                              fontSize: "16px",
                                              fontWeight: "600",
                                              textDecoration: "underline",
                                            }}
                                          >
                                            EXCHANGE CONTROL
                                          </h3>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              {/* <div className="row">
                                          <div className="col-md-4">
                                            <img src={logo} alt="logo" />
                                          </div>
                                        
                                          <div className="col-md-8">
                                          </div>

                                      </div>
                                      <div
                                        className="header_content"
                                        dangerouslySetInnerHTML={{
                                          __html: Description
                                            ? Description
                                            : applicationDetail?.analystDescription,
                                        }}
                                      /> */}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div
                          className={
                            applicationDetail?.analystDescription ? "inner_form_new " : "d-none"
                          }
                        >
                          <label className="controlform">
                            Analyst Description
                          </label>
                          <div className="form-bx">
                            <label>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: applicationDetail?.analystDescription,
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              }
            });
        })}

        {roleID >= 5 ? (
          <>
            <h5
              className={
                sharefiletab
                  ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                  : "section_top_subheading mt-3 py-3 cursorpointer"
              }
              onClick={() => setsharefiletab(!sharefiletab)}
            >
              Share File
              <span className="btn-collapse">
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div
              className={sharefiletab ? "attachemt_form-bx  mt-2" : "d-none"}
            >
              <label
                style={{
                  background: "rgb(217, 237, 247)",
                  padding: "9px 3px",
                  border: "0px",
                }}
              >
                <span style={{ fontWeight: "500" }}> File Upload</span>
              </label>
              <div className="browse-btn">
                Browse <input type="file" />
              </div>
              <span className="filename">No file chosen</span>
            </div>
          </>
        ) : (
          ""
        )}

         
          <>
            <h5 className="section_top_subheading mt-3 py-3 btn-collapse_active ">
              Application History{" "}
              {/* <span className="btn-collapse">
              <i class="bi bi-caret-down-fill"></i>
            </span> */}
            </h5>

            <div className="tab-content">
              <div className="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">User Type</th>
                      <th scope="col">User Name</th>
                      <th scope="col">Receive Date</th>
                      <th scope="col">Submit Date</th>
                      <th scope="col">Turn Around Days</th>
                    </tr>
                  </thead>
                  <tbody class="table-group-divider">
                    {tatHistory?.length
                      ? tatHistory?.map((item, index) => {
                          return ( 
                              <tr key={index}>
                                <td>{item.roleName}</td>
                                <td>{item.name ? item.name : "--"}</td>
                                <td>
                                  {item.createdDate
                                    ? moment(item.createdDate).format(
                                        "DD MMM YYYY hh:mm A"
                                      )
                                    : "--"}
                                </td>
                                <td>
                                  {item.submittedDate
                                    ? moment(item.submittedDate).format(
                                        "DD MMM YYYY hh:mm A"
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
            {roleID > 5 && recomdAnalyst == "121" ? (
              <button
                type="button"
                className="login m-end-4"
                onClick={() =>
                  generatePDF(PdftargetRef, { filename: "page.pdf", Pdfoption })
                }
              >
                Preview PDF
              </button>
            ) : (
              ""
            )}

            <button
              type="button"
              onClick={(e) => { (asignnextLeveldata.Notes ==""  || asignnextLeveldata.Comment =="") && roleID == 3 ? closePopupHandle() : 
                HandleSubmit(e);
              }}
              className="login"
              disabled={
                (AssignUserID == "" ||
                  AssignUserID == null ||
                  Description == "" ||
                  Description == null) &&
                roleID == 5
                  ? true
                  : false
              }
            >
              {roleID > 5 &&
              nextlevelvalue != "15" &&
              nextlevelvalue != "20" &&
              nextlevelvalue != "35" &&
              recomdAnalyst == "121"
                ? "Submit & Close"
                : "Submit"}
            </button>
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
      </form>
    </>
  );
};

export default ExportDashboardEditDetails;
