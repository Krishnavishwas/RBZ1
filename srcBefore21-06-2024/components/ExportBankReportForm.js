import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ExportBankReportTable from "../tables/ExportBankReportTable";
import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Select from "react-select";
import UpdatePopupMessage from "./UpdatePopupMessage";
import ApplicationTypeMultiSelect from "./SearchUI/ApplicationTypeMultiSelect";
import SectorMultiselect from "./SearchUI/SectorMultiselect"; 


const ExportBankReportForm = () => {
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
    const statusRef = useRef(null);
    const typeExporterRef = useRef(null);
    const rateRef = useRef(null);
    const usdEquivalentRef = useRef(null);
    const banknameRef = useRef(null);

    const UserID = Storage.getItem("userID");
    const bankID = Storage.getItem("bankID");
    const userName = Storage.getItem("userName");
    const Name = Storage.getItem("name");
    const bankName = Storage.getItem("bankName");
    const roleID = Storage.getItem("roleIDs");
    const bankidcheck = bankID !== "" ? "1" : "3";

    // const [startDate, setStartDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [toastDisplayed, setToastDisplayed] = useState(false);
    const [selectedApplicationType, setSelectedApplicationType] = useState([]);
    const [selectedSector, setSelectedSector] = useState([]);
    const [getCompanyName, setgetCompanyName] = useState(null);
    const [updatepopup, setupdatepopup] = useState(false);
    const [userRole, setUserrole] = useState([]);
    const [selectuserRole, setselectuserRole] = useState("");
    const [submitbuttonhide, setsubmitbuttonhide] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [applicationDetail, setApplicationDetail] = useState({});
    const [applicationmessage, setApplicationmessage] = useState("");
    const [tatHistory, setTatHistory] = useState([]);
    const [allcomment, setallcomment] = useState([]);
    const [noDataComment, setNoDataComment] = useState([]);
    const [responceCount, setresponceCount] = useState([]);
    const handleFormClose = () => setShowUpdateModal(false);
    let dateApp = moment(fromDate).format("DD-MM-YYYY");
    let dateApp2 = moment(toDate).format("DD-MM-YYYY");

    const [registerusertype, setregisterusertype] = useState(bankidcheck);
    const [exportForm, setExportForm] = useState({
        user: "",
        bankName: bankName,
        purposeApplication: "",
        typeExporter: "",
        // companyName: getCompanyName,
        // BeneficiaryName: "",
        govtAgencie: "",

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
    const [checkSupervisor, setcheckSupervisor] = useState(roleID == 4 ? true : false);
    const [attachmentData, setAttachmentData] = useState([]);
    const [otherfilesupload, setOtherfilesupload] = useState([]);
    const [value, setValue] = useState("Company Name");
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [getBankID, setGetBankID] = useState("");
    const [getalluser, setGetalluser] = useState([]);
    const [Individualuser, setIndividualuser] = useState({
        applicantName: "",
        beneficiaryName: "",
    });
    const fileInputRefsother = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

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
        } else if (name === "amount" && value?.length > 10) {
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
        } else if (
            name == "applicantReferenceNumber" &&
            (value.charAt(0) === " " || value.charAt(0) == "/")
        ) {
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

    const removeUserImage = (label) => {
        const updatedUserFile = files?.filter((item) => item.label !== label);
        setFiles(updatedUserFile);
    };

    const getRoleHandle = async () => {
        await axios
            .post(APIURL + "Master/GetRoles", {
                RoleID: "4",
                Status: "35",
                DepartmentID: "2"
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
                    DepartmentID: "2",
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
        setTimeout(() => {
            setsubmitbuttonhide(false);
        }, 1000);
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
        if (checkSupervisor == true && selectuserRole == "" && roleID == 4) {
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
        if (exportForm.subsector === "" && exportForm.sector != 2) {
            newErrors.subsector = "Subsector is required";
            valid = false;
        }
        // if (roleID == 4 && getBankID == "") {
        //   newErrors.getBankID = "Select the Bank";
        //   valid = false;
        // }
        if (checkSupervisor == true && exportForm.bankSupervisor === "") {
            newErrors.bankSupervisor = "Bank Supervisor is required";
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };


    const validatePECANForm = () => {
        let valid = true;
        const newErrors = {};
        if (ValidateChange.relatedexchangeControlNumber.trim().length < 4) {
            newErrors.relatedexchangeControlNumber = "Reference Number allow minimum 4 numbers";
            valid = false;
        } else if (ValidateChange.relatedexchangeControlNumber.trim().length > 6) {
            newErrors.relatedexchangeControlNumber = "Reference Number allow maximum 6 numbers";
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

    //---------- End Code For Company Search select for Form Field

    const HandleSubmit = async (e) => {
        e.preventDefault();

        setsubmitbuttonhide(true);

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
                    AssignedTo:
                        checkSupervisor == true
                            ? exportForm.bankSupervisor
                            : roleID == 4 && exportForm.bankSupervisor == ""
                                ? UserID.replace(/"/g, "")
                                : "",
                    DepartmentID: "2",
                    RoleID: roleID,
                    AssignedToRoleID: roleID == 2 ? 3 : selectuserRole,
                    BankID: roleID == 4 ? getBankID : bankID,
                    RBZReferenceNumber: generatedNumber,
                    ApplicationPurpose: exportForm.purposeApplication,
                    ApplicantType: registerusertype,
                    UserTypeID: registerusertype,
                    BeneficiaryName: Individualuser.beneficiaryName,
                    ApplicantReferenceNumber:
                        exportForm.applicantReferenceNumber.toUpperCase(),
                    ApplicationTypeID: exportForm.applicationType,
                    Currency: exportForm.currency,
                    Amount: exportForm.amount,
                    Rate: curRate,
                    USDEquivalent: convertedRate.toFixed(2),
                    // RECNumber: exportForm.relatedexchangeControlNumber.toUpperCase(),
                    RECNumber: ValidateChange.relatedexchangeControlNumber,
                    Sector: exportForm.sector,
                    SubSector: exportForm.subsector,
                    ApplicantComment: exportForm.applicantComments,
                    // ApplicationDate: moment(startDate).format("YYYY-MM-DD"),
                    FromDate:
                        fromDate != null
                            ? fromDate
                            : moment(nDate).format("YYYY-MM-DD HH:mm:ss"),
                    ToDate:
                        toDate != null
                            ? toDate
                            : moment(nDate).format("YYYY-MM-DD HH:mm:ss"),

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
                        formData.append("DepartmentID", "2");
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
        } else {
            if (!toastDisplayed) {
                toast.warning("Please fill all mandatory fields");
            }
            setToastDisplayed(true);
        }
    };


    const clearInputFile = (index) => {
        if (fileInputRefs[index]?.current) fileInputRefs[index].current.value = "";
    };

    const clearInputFileother = (index) => {
        if (fileInputRefsother[index]?.current) fileInputRefsother[index].current.value = "";
    }


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
        setGetalluser([])
        setselectuserRole("")

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
            applicationType: "",
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
        if (roleID != 4) {
            setcheckSupervisor(false)
        }
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

    const applicationOption = applicationType?.map((res) => ({
        label: res.name,
        value: res.id,
    }));
    const handleChangeApplication = (e) => {
        const values = e;
        setSelectedApplicationType(values);
    };

    const sectorOption = sectorData?.map((res) => ({
        label: res.sectorName,
        value: res.id,
    }));

    const handleChangeSector = (e) => {
        const values = e;
        setSelectedSector(values);
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
    //-----validated collasp start

    const [ValidateRBZ, setValidateRBZ] = useState([]);
    const [loader, setLoader] = useState(false);
    const [ValidateShow, setValidateShow] = useState(false);
    const [ValidateChange, setValidateChange] = useState({
        relatedexchangeControlNumber: "",
    });

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
        setErrors(newErrors)
    };

    const handleValidateRBZ = () => {
        if (validatePECANForm()) {
            setLoader(true);
            axios
                .post(APIURL + "ExportApplication/ValidateRBZReferenceNumber", {
                    RBZReferenceNumber: ValidateChange.relatedexchangeControlNumber.trim(),
                })
                .then((res) => {
                    setErrors({})
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
                {
                    rowData.filePath ? <Link to={rowData.filePath} target="_blank" ><i
                        className="pi pi-download p-2 nav-link p-0"
                        style={{ padding: "12px", marginLeft: "6px", cursor: "pointer" }}

                        aria-disabled
                        onMouseEnter={(e) => {
                            e.target.style.color = "var(--primary-color)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.color = "";
                        }}
                    ></i> </Link> : ""}
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
                {bankName.replace(/"/g, "") == rowData?.bankName ? rowData.amount + rowData.currencyCode : "--"}
            </span>
        )
    }
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


    return (
        <>
            <form className="bankReportForm">
                <div className="row"> 

                    <div className="col-md-6">
                        <div className="inner_form_new-sm">
                            <label className="controlform-sm">From Date</label>

                            <div className="form-bx-sm">
                                <div className="form-bx-datePicker">
                                    <DatePicker
                                        closeOnScroll={(e) => e.target === document}
                                        selected={fromDate}
                                        placeholderText={
                                            fromDate == null
                                                ? moment(new Date()).format("DD/MMM/YYYY")
                                                : fromDate
                                        }
                                        onChange={(date) => setFromDate(date)}
                                        peekNextMonth
                                        minDate="01/01/2018"
                                        showMonthDropdown
                                        maxDate={new Date()}
                                        showYearDropdown
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
                                        dropdownMode="select"
                                        dateFormat="dd/MMM/yyyy"
                                    />
                                    <span className="sspan"></span>
                                </div>
                            </div>
                        </div>
                        {/* end form-bx  */}
                    </div>

                    <div className="col-md-6">
                        <div className="inner_form_new-sm">
                            <label className="controlform-sm">To Date</label>

                            <div className="form-bx-sm">
                                <div className="form-bx-datePicker">
                                    <DatePicker
                                        closeOnScroll={(e) => e.target === document}
                                        selected={toDate}
                                        placeholderText={
                                            toDate == null
                                                ? moment(new Date()).format("DD/MMM/YYYY")
                                                : toDate
                                        }
                                        onChange={(date) => setToDate(date)}
                                        peekNextMonth
                                        minDate="01/01/2018"
                                        showMonthDropdown
                                        maxDate={new Date()}
                                        showYearDropdown
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
                                        dropdownMode="select"
                                        dateFormat="dd/MMM/yyyy"
                                    />
                                    <span className="sspan"></span>
                                </div>
                            </div>
                        </div>
                        {/* end form-bx  */}
                    </div>
                </div>
                {/* end form-bx  */}
                <div className="row">
                    <div className="col-md-5">
                        <div className="inner_form_new ">
                            <label className="controlform">Bank Name</label>
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
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="inner_form_new ">
                            <label className="controlform">Type of Exporter:</label>
                            <div className="form-bx">
                                <label>
                                    <select
                                        ref={typeExporterRef}
                                        onChange={(e) => {
                                            changeHandelForm(e);
                                            handleUsertype(e);
                                        }}
                                        name="exporterType"
                                    >
                                        <option value="">Select Exporter</option>
                                        {applicantTypes?.map((item, index) => {
                                            return (
                                                <>
                                                    <option value={item?.id} key={index}>
                                                        {item.name}
                                                    </option>
                                                </>
                                            );
                                        })}
                                    </select>

                                </label>


                                {/* {errors.niu && bankData.ApplicantType === '' ? <small className='errormsg'>{errors.ApplicantType}</small> : ""} */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* end form-bx  */}

                <div className="inner_form_new ">
                    <label className="controlform">Application Type</label>
                    <div className="cccto position-relative">
                        <div className="multiselect">
                            <ApplicationTypeMultiSelect
                                key="multyselectprinciple"
                                placeholder="Select Application Type"
                                options={applicationOption}
                                onChange={(e) => handleChangeApplication(e)}
                                value={selectedApplicationType}
                                isSelectAll={true}
                                menuPlacement={"bottom"}
                            />

                            <span className="sspan"></span>
                            {errors.applicationType && exportForm.applicationType === "" ? (
                                <small className="errormsg">{errors.applicationType}</small>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
                {/* end form-bx  */}

                <div className="row">
                    <div className="col-md-5">
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

                    <div className="col-md-4">
                        <div className="inner_form_new-sm">
                            <label className="controlform-sm">Value From (in USD)</label>

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
                                        onKeyDown={(event) => {
                                            const blockedKeys = ['e', 'E', '-', '+'];
                                            if (blockedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        placeholder="Value From (in USD)"
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
                            <label className="controlform-sm">Value To (in USD)</label>

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
                                        placeholder="Value To (in USD)"
                                        disabled
                                    />
                                    <span className="sspan"></span>
                                </label>
                            </div>
                        </div>
                        {/* end form-bx  */}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-5">
                        <div className="inner_form_new ">
                            <label className="controlform">Sector</label>
                            <div className="cccto position-relative">
                                <div className="multiselect">
                                    <SectorMultiselect
                                        key="multyselectprinciple"
                                        placeholder="Select Sector"
                                        options={sectorOption}
                                        onChange={(e) => handleChangeSector(e)}
                                        value={selectedSector}
                                        isSelectAll={true}
                                        menuPlacement={"bottom"}
                                    />
                                    <span className="sspan"></span>
                                    {errors.sector && exportForm.sector === "" ? (
                                        <small className="errormsg">{errors.sector}</small>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-md-4">
                        <div className="inner_form_new-sm">
                            <label className="controlform-sm">Subsector</label>

                            <div className="form-bx-sm">
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
                    </div> */}
                    <div className="col-md-7">
                        <div className="inner_form_new-sm">
                            <label className="controlform-sm">Status</label>

                            <div className="form-bx-sm">
                                <label>
                                    <select
                                        ref={statusRef}
                                        name="status"
                                        onChange={(e) => {
                                            changeHandelForm(e);
                                        }}
                                        className={
                                            errors.status && exportForm.status === "" ? "error" : ""
                                        }
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Canceled">Canceled</option>


                                    </select>
                                    <span className="sspan"></span>
                                    {/* {errors.sector && exportForm.sector === "" ? (
                                <small className="errormsg">{errors.sector}</small>
                            ) : (
                                ""
                            )} */}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* end form-bx  */}

                <div className="form-footer mt-5 mb-3">
                    {/* <button
                        type="reset"
                        onClick={(e) => {
                            ResetHandleData(e);
                        }}
                        className="register"
                    >
                        Reset
                    </button> */}
                    <button
                        type="button"
                        onClick={(e) => {
                            HandleSubmit(e);
                        }}
                        className="login"
                        // disabled={submitbuttonhide == true}
                        disabled
                    >
                        {submitbuttonhide == true ? (
                            <>
                                Submit<div className="smallloader"></div>
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>

                {/* table data show start */}
                <h4 className="section_top_heading">REPORT DATA</h4>
                <ExportBankReportTable />
                {/* table data show end */}
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

export default ExportBankReportForm;
