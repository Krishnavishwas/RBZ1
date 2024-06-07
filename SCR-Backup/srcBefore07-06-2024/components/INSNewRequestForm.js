import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import axios from "axios";
import { APIURL } from "../constant";
import Select from "react-select";
import moment from "moment";
import { toast } from "react-toastify";
import SectorMultiselect from "./SearchUI/SectorMultiselect";
import UpdatePopupMessage from "./UpdatePopupMessage";

const INSNewRequestForm = () => {
  const navigate = useNavigate();
  const {
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData,
    Supervisors,
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
  const applicationreferenceNumberRef = useRef(null); //delete
  const previousRBZReferenceNumberRef = useRef(null);
  const Navigate = useNavigate();
  const roleID = Storage.getItem("roleIDs");
  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const userName = Storage.getItem("userName");
  const bankName = Storage.getItem("bankName");
  const bankidcheck = bankID !== "" ? "1" : "3";
  const [getalluser, setGetalluser] = useState([]);
  const [userRole, setUserrole] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState();
  const [getGovernment, setgetGovernment] = useState();
  const [selectuserRole, setselectuserRole] = useState("");
  const [registerusertype, setregisterusertype] = useState(bankidcheck);
  const [updatepopup, setupdatepopup] = useState(false);
  const [INSForm, setINSForm] = useState({
    UserID: UserID.replace(/"/g, ""),
    user: "",
    bankName: bankName,
    applicantionTitle: "",
    typeFIN: "",
    BeneficiaryName: "",
    baneficiaryCountry: "",
    govtAgencie: "",
    departmentApplicantionBelongTo: "Bank/ADLA",
    BPNCode: "",
    TINNumber: "",
    previousRBZReferenceNumber: "",
    applicant: "",
    applicantReferenceNumber: "",
    applicationType: "",
    applicationSubType: "",
    exporterType: registerusertype,
    currency: "",
    amount: "",
    rate: "",
    usdEquivalent: "",
    applicationreferenceNumber: "",
    sector: "",
    subsector: "",
    applicantComments: "",
    bankSupervisor: "",
  });

  const [files, setFiles] = useState([]);
  const [otherfiles, setOtherfiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [applicationType, setapplicationType] = useState([]);
  const [applicationSubType, setapplicationSubType] = useState([]);
  const [subsectorData, setsubsectorData] = useState([]);
  const [curRate, setCurrate] = useState();
  const [checkSupervisor, setcheckSupervisor] = useState(
    roleID == 4 ? true : false
  );
  const [attachmentData, setAttachmentData] = useState([]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const [Equipment, setEquipment] = useState([]);
  const [Stationery, setStationery] = useState([]);
  const [Personnel, setPersonnel] = useState([]);
  const [Systems, setSystems] = useState([]);
  const [Organogram, setOrganogram] = useState([]);
  const [antimoney, setantimoney] = useState([]);
  const [applicationsubID, setapplicationsubID] = useState([]);
  const [selectedEquipment, setselectedEquipment] = useState([]);
  const [selectStationery, setsetselectStationery] = useState([]);
  const [selectPersonnel, setselectPersonnel] = useState([]);
  const [selectSystems, setselectSystems] = useState([]);
  const [selectOrganogram, setselectOrganogram] = useState([]);

  const [selectAntiMone, setselectAntiMone] = useState([]);

  const heading = "Application Submitted Successfully!";
  const para = "Foreign Investment application request submitted successfully!";

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
        value?.includes("]"))
    ) {
      newErrors.BPNCode = "special characters not allowed";
    } else if (name === "applicantComments" && value.charAt(0) === " ") {
      newErrors.applicantComments = "First character cannot be a blank space";
    } else if (name === "amount" && value.length > 10) {
      newErrors.amount = "Max 10 digit allow";
    } else {
      setINSForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setErrors(newErrors);

    if (name == "applicationType") {
      axios
        .post(APIURL + "Master/GetMasterINSDataBySubApplicationTypeID")
        .then((res) => { 
          if (res.data.responseCode == "200") {
            if (res.data.responseData[0].id == 50) {
              const eq = res.data.responseData[0].subData?.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              });
              setEquipment(eq);
            }
            if (res.data.responseData[1].id == 51) {
              // setStationery(res.data.responseData[1].subData)

              const eq = res.data.responseData[1].subData?.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              });
              setStationery(eq);
            }
            if (res.data.responseData[2].id == 52) {
              // setPersonnel(res.data.responseData[2].subData)

              const eq = res.data.responseData[2].subData?.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              });
              setPersonnel(eq);
            }
            if (res.data.responseData[3].id == 53) {
              // setSystems(res.data.responseData[3].subData)
              const eq = res.data.responseData[3].subData?.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              });
              setSystems(eq);
            }
            if (res.data.responseData[4].id == 54) {
              // setOrganogram(res.data.responseData[4].subData)
              const eq = res.data.responseData[4].subData?.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              });
              setOrganogram(eq);
            }
            if (res.data.responseData[5].id == 55) {
              // setantimoney(res.data.responseData[5].subData)
              const eq = res.data.responseData[5].subData?.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              });
              setantimoney(eq);
            }
          } else {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

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
  };

  const convertedRate = curRate * parseFloat(INSForm.amount);

  const GetApplicationTypes = async () => {
    await axios
      .post(APIURL + "Master/GetApplicationTypesByDepartmentID", {
        DepartmentID: "5",
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

  useEffect(() => {
    GetApplicationTypes();
    getRoleHandle();
  }, []);

  const handleUsertype = (e) => {
    setregisterusertype(e.target.value);
  };

  const changeHandelApplicationSubTypeID = (e, id) => {
    setapplicationsubID((prev) => {
      if (!prev.includes(id)) {
        return [...prev, id];
      } else {
        return prev;
      }
    });
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

  const HandelSupervisorcheck = (e) => {
    setcheckSupervisor(!checkSupervisor);
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
    if (INSForm.applicationType === "") {
      newErrors.applicationType = "Application type is required";
      valid = false;
    }
    if (
      bankID === "" &&
      registerusertype == "3" &&
      INSForm.govtAgencie === ""
    ) {
      newErrors.govtAgencie = "Government agencies name is required";
      valid = false;
    }
    if (registerusertype == "2" && INSForm.applicant === "") {
      newErrors.applicant = "Applicant name is required";
      valid = false;
    }
    // if (INSForm.applicationreferenceNumber === "") {
    //   newErrors.applicationreferenceNumber =
    //     "Application Reference Number is required";
    //   valid = false;
    // }
    if (INSForm.currency === "") {
      newErrors.currency = "Currency is required";
      valid = false;
    }
    if (selectedEquipment.length <= 0 && INSForm.applicationType == "53") {
      newErrors.Equipment = "Equipment is required";
      valid = false;
    }

    if (selectStationery.length <= 0 && INSForm.applicationType == "53") {
      newErrors.selectStationery = "Stationery is required";
      valid = false;
    }

    if (selectPersonnel.length <= 0 && INSForm.applicationType == "53") {
      newErrors.selectPersonnel = "Personnel is required";
      valid = false;
    }
    if (selectSystems.length <= 0 && INSForm.applicationType == "53") {
      newErrors.selectSystems = "Systems is required";
      valid = false;
    }
    if (selectOrganogram.length <= 0 && INSForm.applicationType == "53") {
      newErrors.selectOrganogram = "Organogram is required";
      valid = false;
    }
    if (selectAntiMone.length <= 0 && INSForm.applicationType == "53") {
      newErrors.selectAntiMone =
        "Anti-Money laundering and Combating the Financing of Terrorism program and procedures is required";
      valid = false;
    }

    if (INSForm.amount === "") {
      newErrors.amount = "Amount is required";
      valid = false;
    }
    if (INSForm.sector === "") {
      newErrors.sector = "Sector is required";
      valid = false;
    }
    if (INSForm.subsector === "") {
      newErrors.subsector = "Sub sector is required";
      valid = false;
    }
    if (checkSupervisor == true && selectuserRole == "" && roleID == 4) {
      newErrors.selectuserRole = "Role is required";
      valid = false;
    }
    if (INSForm.applicantComments === "") {
      newErrors.applicantComments = "Applicant comments is required";
      valid = false;
    }
    if (checkSupervisor === true && INSForm.bankSupervisor === "") {
      newErrors.bankSupervisor = "Bank supervisor is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleChangecompany = (selectedOption) => {
    setgetCompanyName(selectedOption);
  };

  const handleChangeGovernment = (selectedOption) => {
    setgetGovernment(selectedOption);
  };

  const filtertin_bpn = companies?.find((company) => {
    if (company.id === getCompanyName?.value) {
      return {
        getbpn: company.bpnNumber,
        gettin: company.tinNumber,
      };
    }
  }); 

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

  const handleInputChangeGovernment = (input) => {
    setInputValue(input);
    if (input.length >= 3) {
      const filteredOptions = GovernmentAgencies?.filter((governmentAgencie) =>
        governmentAgencie?.agencyName
          ?.toLowerCase()
          .includes(input.toLowerCase())
      )?.map((governmentAgencie) => ({
        value: governmentAgencie?.id,
        label: governmentAgencie?.agencyName,
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

  const generateRandomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };
 

  const handleChangeEquipmen = (e) => {
    const values = e;
    setselectedEquipment(values);
  };

  const EquipmentData = selectedEquipment?.map((item) => {
    return {
      value: item.label,
      ID: item.value,
      ApplicationSubTypeID: 50,
    };
  });

  const StationeryData = selectStationery?.map((item) => {
    return {
      value: item.label,
      ID: item.value,
      ApplicationSubTypeID: 51,
    };
  });

  const PersonnelData = selectPersonnel?.map((item) => {
    return {
      value: item.label,
      ID: item.value,
      ApplicationSubTypeID: 52,
    };
  });

  const SystemsData = selectSystems?.map((item) => {
    return {
      value: item.label,
      ID: item.value,
      ApplicationSubTypeID: 53,
    };
  });

  const OrganogramData = selectOrganogram?.map((item) => {
    return {
      value: item.label,
      ID: item.value,
      ApplicationSubTypeID: 54,
    };
  });

  const AntiMoneData = selectAntiMone?.map((item) => {
    return {
      value: item.label,
      ID: item.value,
      ApplicationSubTypeID: 55,
    };
  }); 

  const handleChangeStationery = (e) => {
    const value = e;
    setsetselectStationery(value);
  };

  const handleChangePersonnel = (e) => {
    const value = e;
    setselectPersonnel(value);
  };

  const handleChangeSystems = (e) => {
    const value = e;
    setselectSystems(value);
  };

  const handleChangeOrganogram = (e) => {
    const value = e;
    setselectOrganogram(value);
  };

  const handleChangeAntiMone = (e) => {
    const value = e;
    setselectAntiMone(value);
  };  

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const randomNumber = generateRandomNumber();
    const generatedNumber = `FIN/${userName
      .toUpperCase()
      .replace(/"/g, "")}NMBLZWHX/018363${randomNumber}`;

    if (validateForm()) {
      await axios
        .post(
          APIURL + "InspectorateApplication/CreateInspectorateApplication",
          {
            UserID: UserID.replace(/"/g, ""),
            BankID: bankID,
            DepartmentID: "5",
            RoleID: roleID,
            ApplicationDate: moment(startDate).format("YYYY-MM-DD"),
            RBZReferenceNumber: generatedNumber,
            RelatedApplicationReferenceNumber:
              INSForm.relatedapplicationreferenceNumber,
            Name:
              registerusertype === "2" && bankID !== ""
                ? INSForm.applicant
                : "",
            CompanyID:
              registerusertype === "1" && bankID !== ""
                ? getCompanyName?.value
                : "",
            ApplicantTypeID: registerusertype,
            AssignedToRoleID: roleID == 2 ? 3 : selectuserRole,
            ApplicationTypeID: INSForm.applicationType,
            BeneficiaryName: INSForm.BeneficiaryName,
            BeneficiaryCountry: INSForm.baneficiaryCountry,
            BPNCode:
              registerusertype === "1" && bankID !== ""
                ? filtertin_bpn?.bpnNumber?.toUpperCase()
                : "",
            TINNumber:
              registerusertype === "1" && bankID !== ""
                ? filtertin_bpn?.tinNumber?.toUpperCase()
                : "",
            Currency: INSForm.currency,
            Amount: INSForm.amount,
            Rate: curRate,
            USDEquivalent: convertedRate.toFixed(2),
            Sector: INSForm.sector,
            SubSector: INSForm.subsector,
            ApplicantType: registerusertype,
            ApplicantComment: INSForm.applicantComments,
            // ApplicationSubTypeID: INSForm.applicationSubType,
            EquipmentData: EquipmentData,
            StationeryData: StationeryData,
            PersonnelData: PersonnelData,
            SystemsData: SystemsData,
            Structure_OrganogramData: OrganogramData,
            Anti_Money_laundering_CombatingData: AntiMoneData,
            ApplicationSubTypeID: applicationsubID?.join(","),
            AssignedTo:
              checkSupervisor === true
                ? INSForm.bankSupervisor
                : roleID == 4 && INSForm.bankSupervisor == ""
                ? UserID.replace(/"/g, "")
                : "",
          }
        )
        .then((res) => {
          if (res.data.responseCode === "200") { 
            setupdatepopup(true);
            toast.success(res.data.responseMessage);
            setTimeout(() => {
              navigate("/INSDashboard");
            }, 1200);
          } else {
            toast.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setINSForm({
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
        applicationreferenceNumber: "",
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
      if (applicationreferenceNumberRef.current)
        applicationreferenceNumberRef.current.value = "";
      if (previousRBZReferenceNumberRef.current)
        previousRBZReferenceNumberRef.current.value = "";
    } else {
      if (!toastDisplayed) {
        toast.warning("Please fill all fields");
      }
      setToastDisplayed(true);
    }
  };

  const closePopupHandle = () => {
    Navigate("/INSDashboard");
    setupdatepopup(false); 
    
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
 
    if (sectorRef.current) sectorRef.current.value = "";
    if (subsectorRef.current) subsectorRef.current.value = "";

    if (typeExporterRef.current) typeExporterRef.current.value = "";
    if (usdEquivalentRef.current) usdEquivalentRef.current.value = "";

    if (rateRef.current) rateRef.current.value = ""; 
  };


  const ResetHandleData = () => {
    setgetCompanyName(null);
    // setGetBankID("");
    setselectuserRole("");
    setGetalluser([]);
    setINSForm({
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

        <div className="inner_form_new ">
          <label className="controlform">Applicantion Title</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="applicantionTitle"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder="Applicantion Title"
                value={INSForm.applicantionTitle}
                className={errors.applicantionTitle ? "error" : ""}
              />
              <span className="sspan"></span>
              {errors.applicantionTitle || INSForm.applicantionTitle === "" ? (
                <small className="errormsg">{errors.applicantionTitle}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Type of Applicant</label>
          <div className="form-bx-radio mt-4">
            {applicantTypes.map((item, index) => {
              return (
                <>
                  <label key={index}>
                    <input
                      type="radio"
                      ref={typeExporterRef}
                      onChange={(e) => {
                        changeHandelForm(e);
                        handleUsertype(e);
                      }}
                      name="inspectorateType"
                      value={item.id}
                      checked={registerusertype == item.id}
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
                    disabled
                    value={
                      filtertin_bpn && filtertin_bpn.tinNumber !== null
                        ? filtertin_bpn?.tinNumber
                        : "TIN Number"
                    }
                    className={
                      errors.TINNumber
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
                    disabled
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    value={
                      filtertin_bpn && filtertin_bpn.bpnNumber !== null
                        ? filtertin_bpn?.bpnNumber
                        : "BPN Code"
                    }
                    placeholder="BPN Code"
                    className={
                      errors.BPNCode ? "error text-uppercase" : "text-uppercase"
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
                    value={INSForm.applicant}
                    className={errors.applicant ? "error" : ""}
                  />
                  <span className="sspan"></span>
                  {errors.applicant || INSForm.applicant === "" ? (
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

        {registerusertype === "3" && bankID !== "" ? (
          <>
            <div className="inner_form_new ">
              <label className="controlform">Government Agencies Name</label>
              <div className="form-bx">
                <Select
                  placeholder="Select Government Agencies Name"
                  value={getGovernment}
                  onChange={handleChangeGovernment}
                  onInputChange={handleInputChangeGovernment}
                  options={options}
                  isSearchable
                  noOptionsMessage={({ inputValue }) =>
                    inputValue.length > 3
                      ? "No Government Agency found"
                      : "Type to search"
                  }
                  onMenuClose={handleClear}
                  className="selectinput"
                />
                {errors.getGovernment &&
                (getGovernment === "" || getGovernment == null) ? (
                  <small className="errormsg2">{errors.getGovernment}</small>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Type of Application</label>
          <div className="form-bx">
            <label>
              <select
                ref={applicationTypeRef}
                name="applicationType"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                className={
                  errors.applicationType && INSForm.applicationType === ""
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
            </label>
            <small
              className="informgs"
              style={{ position: "absolute", bottom: "-10px" }}
            >
              {errors.applicationType && INSForm.applicationType === "" ? (
                <small className="errormsg2">{errors.applicationType}</small>
              ) : (
                ""
              )}{" "}
              Only government agencies can submit direct application to
              Inspectorate department.
            </small>
          </div>
        </div>

        {INSForm.applicationType == "54" ? (
          <div className="inner_form_new ">
            <label className="controlform">Exact Return Type</label>
            <div className="form-bx">
              <label>
                <select
                  name="exactReturnType"
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  className={
                    errors.exactReturnType && INSForm.exactReturnType === ""
                      ? "error"
                      : ""
                  }
                >
                  <option value="">Select Application Type</option>
                  {applicationSubType?.map((item, ind) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <span className="sspan"></span>
                {errors.exactReturnType && INSForm.exactReturnType === "" ? (
                  <small className="errormsg">{errors.exactReturnType}</small>
                ) : (
                  ""
                )}
              </label>
            </div>
          </div>
        ) : (
          ""
        )}
 
        {INSForm.applicationType == "53" ? (
          <>
            <div className="inner_form_new align-items-center ">
              <label className="controlform">Equipment</label>
              <div className="cccto">
                <div className="flex justify-content-center multiSelect">
                  <SectorMultiselect
                    key="multyselectprinciple"
                    options={Equipment}
                    onChange={(e) => handleChangeEquipmen(e)}
                    value={selectedEquipment}
                    isSelectAll={true}
                    menuPlacement={"bottom"}
                    className={errors.selectAntiMone && selectedEquipment.length <= 0 ? "errorborder" : ""}
                  />

                  <span className="sspan"></span>
                  {errors.Equipment && selectedEquipment.length <= 0 ? (
                    <small className="errormsg">{errors.Equipment}</small>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="inner_form_new align-items-center ">
              <label className="controlform">Stationery</label>
              <div className="cccto">
                <div className="flex justify-content-center multiSelect">
                  <SectorMultiselect
                    key="multyselectprinciple"
                    options={Stationery}
                    onChange={(e) => handleChangeStationery(e)}
                    value={selectStationery}
                    isSelectAll={true}
                    menuPlacement={"bottom"}
                    className={errors.selectAntiMone && selectStationery.length <= 0 ? "errorborder" : ""}
                  />

                  <span className="sspan"></span>
                  {errors.selectStationery && selectStationery.length <= 0 ? (
                    <small className="errormsg">
                      {errors.selectStationery}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="inner_form_new align-items-center">
              <label className="controlform">Personnel</label>
              <div className=" cccto">
                <div className="flex justify-content-center multiSelect">
                  <SectorMultiselect
                    key="multyselectprinciple"
                    options={Personnel}
                    onChange={(e) => handleChangePersonnel(e)}
                    value={selectPersonnel}
                    isSelectAll={true}
                    menuPlacement={"bottom"}
                    className={errors.selectPersonnel && selectPersonnel.length <=0 ? "errorborder" : ""}
                  />

                  <span className="sspan"></span>
                  {errors.selectPersonnel && selectPersonnel.length <=0 ? (
                    <small className="errormsg">{errors.selectPersonnel}</small>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="inner_form_new align-items-center">
              <label className="controlform">Systems</label>
              <div className=" cccto">
                <div className="flex justify-content-center multiSelect">
                  <SectorMultiselect
                    key="multyselectprinciple"
                    options={Systems}
                    onChange={(e) => handleChangeSystems(e)}
                    value={selectSystems}
                    isSelectAll={true}
                    menuPlacement={"bottom"}
                    className={errors.selectSystems && selectSystems.length <= 0 ? "errorborder" : ""}
                  />

                  <span className="sspan"></span>
                  {errors.selectSystems && selectSystems.length <= 0 ? (
                    <small className="errormsg">{errors.selectSystems}</small>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">Structure/Organogram</label>
              <div className=" cccto">
                <div className="flex justify-content-center multiSelect">
                  <SectorMultiselect
                    key="multyselectprinciple"
                    options={Organogram}
                    onChange={(e) => handleChangeOrganogram(e)}
                    value={selectOrganogram}
                    isSelectAll={true}
                    menuPlacement={"bottom"}
                    className={errors.selectAntiMone && selectOrganogram.length <=0 ? "errorborder" : ""}
                  />

                  <span className="sspan"></span>
                  {errors.selectOrganogram  && selectOrganogram.length <=0 ? (
                    <small className="errormsg">
                      {errors.selectOrganogram}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="inner_form_new align-items-center ">
              <label className="controlform">
                Anti-Money laundering and Combating the Financing of Terrorism
                program and procedures
              </label>
              <div className=" cccto">
                <div className="flex justify-content-center multiSelect">
                  <SectorMultiselect
                    key="multyselectprinciple"
                    options={antimoney}
                    onChange={(e) => handleChangeAntiMone(e)}
                    value={selectAntiMone}
                    isSelectAll={true}
                    menuPlacement={"bottom"}
                    className={errors.selectAntiMone && selectAntiMone.length <=0 ? "errorborder" : ""}
                  />

                  <span className="sspan"></span>
                  {errors.selectAntiMone && selectAntiMone.length <=0 ? (
                    <small className="errormsg">{errors.selectAntiMone}</small>
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

        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">
            Department Applicantion Belong To
          </label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="departmentApplicantionBelongTo"
                placeholder="Department Applicantion Belong To"
                value={INSForm.departmentApplicantionBelongTo}
              />
              <span className="sspan"></span>
            </label>
            <small
              className="informgs"
              style={{ position: "absolute", bottom: "-10px" }}
            >
              This information need to submit only when government agencies are
              submitting the application.
            </small>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Application Reference Number</label>
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex">
                <div className="form-bx">
                  <label>
                    <input
                      ref={applicationreferenceNumberRef}
                      type="text"
                      name="applicationreferenceNumber"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      value={INSForm.applicationreferenceNumber?.trim()}
                      placeholder="Application Reference Number"
                      className={
                        errors.applicationreferenceNumber
                          ? "text-uppercase error"
                          : "text-uppercase"
                      }
                    />
                    <span className="sspan"></span>
                    {errors.applicationreferenceNumber ||
                    INSForm.applicationreferenceNumber !== "" ? (
                      <small className="errormsg">
                        {errors.applicationreferenceNumber}
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Previous RBZ Reference Number</label>
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex">
                <div className="form-bx">
                  <label>
                    <input
                      ref={previousRBZReferenceNumberRef}
                      type="text"
                      name="previousRBZReferenceNumber"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      value={INSForm.previousRBZReferenceNumber?.trim()}
                      placeholder="Previous RBZ Reference Number"
                      className={
                        errors.previousRBZReferenceNumber
                          ? "text-uppercase error"
                          : "text-uppercase"
                      }
                    />
                    <span className="sspan"></span>
                    {errors.previousRBZReferenceNumber ||
                    INSForm.previousRBZReferenceNumber !== "" ? (
                      <small className="errormsg">
                        {errors.previousRBZReferenceNumber}
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
                <button type="button" className="primrybtn v-button">
                  Validate
                </button>
              </div>
            </div>
            <div className="col-md-3 text-right"></div>
          </div>
        </div>
        {/* end form-bx  */}

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
                value={INSForm.BeneficiaryName}
              />
              <span className="sspan"></span>
              {errors.BeneficiaryName || INSForm.BeneficiaryName === "" ? (
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
                    errors.govtAgencie && INSForm.govtAgencie === ""
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
                {errors.govtAgencie && INSForm.govtAgencie === "" ? (
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
                      errors.currency && INSForm.currency === "" ? "error" : ""
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
                  {errors.currency && INSForm.currency === "" ? (
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
                    value={INSForm.amount}
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    placeholder="Amount"
                    className={
                      errors.amount && INSForm.amount === "" ? "error" : ""
                    }
                  />
                  <span className="sspan"></span>
                  {errors.amount || INSForm.amount === "" ? (
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
                <label className="cur-dis">
                  <input
                    ref={rateRef}
                    type="text"
                    name="rate"
                    value={
                      INSForm.currency && INSForm.amount ? curRate : "Rate"
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
                  INSForm.currency && INSForm.amount
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
                  errors.sector && INSForm.sector === "" ? "error" : ""
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
              {errors.sector && INSForm.sector === "" ? (
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
                disabled={INSForm.sector === "" ? true : false}
                className={
                  errors.subsector && INSForm.subsector === "" ? "error" : ""
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
              {errors.subsector && INSForm.subsector === "" ? (
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
              {errors.applicantComments || INSForm.applicantComments === "" ? (
                <small className="errormsg">{errors.applicantComments}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className={roleID == 4 ? "d-none" : "inner_form_new "}>
          {/* <label className="controlform">Submit To {roleID == 2 ? "Next Level" : "Next Level"}</label> */}
          <label className="controlform">
            Submit To {roleID == 2 ? "Supervisor" : "Next Level"}
          </label>

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
                    errors.bankSupervisor && INSForm.bankSupervisor === ""
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
                {errors.bankSupervisor && INSForm.bankSupervisor === "" ? (
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
                      errors.bankSupervisor && INSForm.bankSupervisor === ""
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
                  {errors.bankSupervisor && INSForm.bankSupervisor === "" ? (
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

        {/* end form-bx  */}

        <h5 className="section_top_subheading mt-3">Attachments</h5>

        {attachmentData?.map((items, index) => {
          return (
            <div className="attachemt_form-bx" key={items.id}>
              <label>
                <i className="bi bi-forward"></i>
                {items.name}
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
            Add More File
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
    </>
  );
};

export default INSNewRequestForm;
