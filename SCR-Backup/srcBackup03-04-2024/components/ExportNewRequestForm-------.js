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

  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const userName = Storage.getItem("userName");
  const bankName = Storage.getItem("bankName");
  const bankidcheck = bankID !== "" ? "1" : "3";

  const [startDate, setStartDate] = useState(new Date());
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState();
  const [getCompanyId, setgetCompanyId] = useState("");
  let dateApp = moment(startDate).format("DD-MM-YYYY");

  const [registerusertype, setregisterusertype] = useState(bankidcheck);
  const [exportForm, setExportForm] = useState({
    user: "",
    bankName: bankName,
    purposeApplication: "",
    typeExporter: "",
    // companyName: getCompanyName,
    BeneficiaryName: "",
    govtAgencie: "",
    BPNCode: "",
    TINNumber: "",
    applicant: "",
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
  const [value, setValue] = useState("");
  // const [finlterapplicantName, setFinlterapplicantName] = useState([]);

  const [ccc, setccc]=useState();

  const changeHandelForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;    
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    let newErrors = {};
    let valid = true
 

    if (name == "purposeApplication" && value.charAt(0) === ' ') { 
      newErrors.purposeApplication = "First character cannot be a blank space"; 
      valid = false
  } 
  else if (name == "purposeApplication" && specialChars.test(value)) { 
    newErrors.purposeApplication = "Special characters not allowed"; 
    valid = false
} 

else if (name == "applicant" && value.charAt(0) === ' ') { 
  newErrors.applicant = "First character cannot be a blank space"; 
  valid = false
} 
else if (name == "applicant" && specialChars.test(value)) { 
newErrors.applicant = "Special characters not allowed"; 
valid = false
} 

else if (name == "applicantComments" && value.charAt(0) === ' ') { 
  newErrors.applicantComments = "First character cannot be a blank space"; 
  valid = false
}  
else if (name == "BeneficiaryName" && value.charAt(0) === ' ') { 
  newErrors.BeneficiaryName = "First character cannot be a blank space"; 
  valid = false
}  
else if (name == "BeneficiaryName" && specialChars.test(value)) { 
  newErrors.BeneficiaryName = "Special characters not allowed"; 
  valid = false
  } 
else if (name == "TINNumber" && value.charAt(0) === ' ') { 
  newErrors.TINNumber = "First character cannot be a blank space"; 
  valid = false
}  
else if (name == "TINNumber" && (specialChars.test(value) ||
value?.includes("_") ||
value?.includes("+") ||
value?.includes("=") ||
value?.includes("'") ||
value?.includes(";") ||
value?.includes("[") ||
value?.includes("]")||
value?.includes("]"))) { 
  newErrors.TINNumber = "Special characters not allowed"; 
  valid = false
  }
  else if (name == "BPNCode" && value.charAt(0) === ' ') { 
    newErrors.BPNCode = "First character cannot be a blank space"; 
    valid = false
  }  
  else if (name == "BPNCode" && (specialChars.test(value) ||
  value?.includes("_") ||
  value?.includes("+") ||
  value?.includes("=") ||
  value?.includes("'") ||
  value?.includes(";") ||
  value?.includes("[") ||
  value?.includes("]")||
  value?.includes("]"))) { 
    newErrors.BPNCode = "Special characters not allowed"; 
    valid = false
    } 
    else if (name == "applicantReferenceNumber" && value.charAt(0) === ' ') { 
      newErrors.applicantReferenceNumber = "First character cannot be a blank space"; 
      valid = false
    }  
    else if (name == "applicantReferenceNumber" && /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)) { 
      newErrors.applicantReferenceNumber = "Special characters not allowed"; 
      valid = false
      }  
      else if (name == "relatedexchangeControlNumber" && value.charAt(0) === ' ') { 
        newErrors.relatedexchangeControlNumber = "First character cannot be a blank space"; 
        valid = false
      }  
      else if (name == "relatedexchangeControlNumber" && specialChars.test(value)) { 
        newErrors.relatedexchangeControlNumber = "Special characters not allowed"; 
        valid = false
        } 
 
    

else{
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

  console.log("error", errors) 

  const convertedRate = curRate * parseFloat(exportForm.amount);

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
  }, []);
  const handleUsertype = (e) => {
    setregisterusertype(e.target.value);
  };

  const handleAddMore = (e) => {
    setOtherfiles([...otherfiles, null]);
  };

  const handleFileChange = (e, id) => {
    // const file = e.target.files[0];
    // setFiles([...files, file, id]);

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

  // const filteredCompanyList = companies.filter((company) =>
  //   company?.companyCode
  //     ?.toLowerCase()
  //     .includes(exportForm?.companyName?.toLowerCase())
  // );
  // useEffect(() => {
  //   const filteredList = applicantName.filter((applicant) =>
  //     applicant?.name
  //       ?.toLowerCase()
  //       .includes(exportForm?.applicant?.toLowerCase())
  //   );
  //   setFinlterapplicantName(filteredList);
  // }, [exportForm.applicant]);
  // const finlterapplicantName =  applicantName.filter((applicants)=>
  // applicants?.name?.toLowerCase().includes(exportForm?.applicant?.toLocaleLowerCase())
  // );

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    const numericRegex = /\d/;

    if (exportForm.purposeApplication === "") {
      newErrors.purposeApplication = "Purpose of the application is required";
      valid = false;
    }
    if (
      registerusertype === "1" &&
      (getCompanyName === "" ||
        getCompanyName === "Company Name" ||
        getCompanyName == null)
    ) {
      newErrors.companyName = "Corporate name is required";
      valid = false;
    }
    if (exportForm.applicationType === "") {
      newErrors.applicationType = "Application type is required";
      valid = false;
    }
    if (
      bankID == "" &&
      registerusertype === "3" &&
      exportForm.govtAgencie === ""
    ) {
      newErrors.govtAgencie = "Government agencies name is required";
      valid = false;
    }
    // if (registerusertype === "1" && exportForm.BPNCode === "") {
    //   newErrors.BPNCode = "BPN code is required";
    //   valid = false;
    // }
    // if (registerusertype === "2" && exportForm.TIN === "") {
    //   newErrors.TIN = "TIN is Required";
    //   valid = false;
    // }
    if (registerusertype === "2" && exportForm.applicant === "") {
      newErrors.applicant = "Applicant name is required";
      valid = false;
    }
    // if (exportForm.applicantReferenceNumber === "") {
    //   newErrors.applicantReferenceNumber =
    //     "Applicant reference number is required";
    //   valid = false;
    // }

    if (exportForm.currency === "") {
      newErrors.currency = "Currency is required";
      valid = false;
    }
    if (exportForm.amount === "") {
      newErrors.amount = "Amount is required";
      valid = false;
    }
    // if (exportForm.relatedexchangeControlNumber === "") {
    //   newErrors.relatedexchangeControlNumber =
    //     "Related exchange control reference number is required";
    //   valid = false;
    // }
    if (exportForm.sector === "") {
      newErrors.sector = "Sector is required";
      valid = false;
    }
    if (exportForm.subsector === "") {
      newErrors.subsector = "Subsector is required";
      valid = false;
    }
    if (exportForm.applicantComments === "") {
      newErrors.applicantComments = "Applicant comments is required";
      valid = false;
    }
    if (checkSupervisor == true && exportForm.bankSupervisor === "") {
      newErrors.bankSupervisor = "Bank supervisor is required";
      valid = false;
    }
    // if(files.length < attachmentData.length){
    //   newErrors.files = "All Files Required";
    //   valid = false;
    // }

    setErrors(newErrors);
    return valid;
  };

  const SearchableDropdown = ({
    options,
    label,
    id,
    selectedVal,
    handleChange,
  }) => {

    console.log("selectedVal", selectedVal)
    console.log("value", value);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [lll, setlll]=useState(false);

    let inputRef = useRef(null);
    
    useEffect(() => {
      document.addEventListener("click", toggle);
      return () => document.removeEventListener("click", toggle);
    }, []);

    console.log("inputRef",inputRef)

    const selectOption = (option) => {
      // setQuery(() => "");
      handleChange(option[label]);
      // setIsOpen((isOpen) => !isOpen);
      setgetCompanyId(option.id);
      setgetCompanyName(option.companyName)
     if(!lll){
      setgetCompanyName()
     }
    };
    
    const handelll = () => {
      // if (!query) {
        if (!lll && !isOpen && !query) {
        setgetCompanyName(""); 
        setgetCompanyId("")
      }
    }; 

    function toggle(e) {
      const aaa = e.isTrusted
      if(aaa){
        setIsOpen(true) 
        setlll(true)
      } else{
        setlll(false)
      }
    }

    console.log("lll", lll)
    console.log("isOpen", isOpen)
    console.log("getcompanyname", getCompanyName, getCompanyId)
    


    const getDisplayValue = () => {
      if(lll && query){
        if (query) return query;
        if (selectedVal) return selectedVal;  
      }
      return handleChange(null);
    }; 

    const filter = (options) => {
      if (Array.isArray(options) && options.length > 0 && query.length >= 3) {
        return options.filter(
          (option) =>
            option[label]?.toLowerCase().indexOf(query.toLowerCase()) > -1
        );
      } else {
        return [];
      }
    };

    return (
      <div className="dropdownExpComName">
        <div className="control">
          <div className="selected-value">
            <input
              className="borderdisplaynone"
              ref={inputRef}
              type="text"
              placeholder={lll === false && inputRef.current !== "input.borderdisplaynone" ? "Company Name" : ""}
              // placeholder="Company Name"
              value={getCompanyName && lll ? getCompanyName : getDisplayValue()}
              name="searchTerm"
              onChange={(e) => {
                setQuery(e.target.value);
                // setlll(true)
                setIsOpen(true)
                handelll()
                console.log("e - ", e.target.value);
                if(lll && isOpen && query === "" ){
                  if(lll && isOpen && query !== "" && query < 3){
                    setgetCompanyId("")
                    setgetCompanyName("")
                  }else {
                    setgetCompanyId("")
                    setgetCompanyName("")
                  }
                }
                // handleChange(null);
              }}
              // onClick={()=>toggle}
            />
          </div>
          {/* <div className={`arrow ${isOpen ? "open" : ""}`}></div> */}
        </div>

        <div className={`options ${isOpen &&  query?.length >= 3  ? "open" : ""}`}>
          {query?.length >= 3 && filter(options).length ? filter(options).map((option, index) => {
            return (
              <div
                onClick={() => {selectOption(option); handelll()}}
                className={`option ${
                  option[label] === selectedVal ? "selected" : ""
                }`}
                key={`${id}-${index}`}
              >
                {option[label]}
              </div>
            );
          }) : query?.length < 3 ? "" : <div style={{padding:10 , background:"#eeeeee8f"}}>No company found</div>}
        </div>
      </div>
    );
  };

  const generateRandomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    const randomNumber = generateRandomNumber();
    const generatedNumber = `EXP/${userName
      .toUpperCase()
      .replace(/"/g, "")}NMBLZWHX/018363${randomNumber}`;

    if (validateForm()) {
      await axios
        .post(APIURL + "ExportApplication/CreateExportApplication", {
          UserID: UserID.replace(/"/g, ""),
          AssignedTo: checkSupervisor == true ? exportForm.bankSupervisor : "",
          DepartmentID: "1",
          BankID: bankID,
          RBZReferenceNumber: generatedNumber,
          ApplicationPurpose: exportForm.purposeApplication,
          ApplicantType:exportForm.exporterType,
          UserTypeID: exportForm.exporterType,
          BeneficiaryName: exportForm.BeneficiaryName,
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
          ApplicationDate: moment(startDate).format("YYYY-MM-DD"),
          BPNCode:
            registerusertype === "1" && bankID !== "" ? exportForm.BPNCode.toUpperCase() : "",
          TINNumber:
            registerusertype === "1" && bankID !== ""
              ? exportForm.TINNumber.toUpperCase()
              : "",
          Name:
            // registerusertype === "1" && bankID !== ""
            //   ? getCompanyName
            //   : 
              registerusertype === "2" && bankID !== ""
              ? exportForm.applicant
              : "",
          CompanyID:
            registerusertype === "1" && bankID !== "" ? getCompanyId : "",
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
            toast.success(res.data.responseMessage);
           setTimeout(()=>{
            Navigate("/BankADLADashboard")
           },1400)
          } else {
            toast.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });

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

      if (purposeApplicationRef.current)
        purposeApplicationRef.current.value = "";
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

  const ResetHandleData = () => {
    setgetCompanyName("");
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
                name="purposeApplication"
                ref={purposeApplicationRef} 
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder="Purpose of the Application"
                className={ errors?.purposeApplication
                    ? "error"
                    : ""
                }
              />
              <span className="sspan"></span>
              {  errors?.purposeApplication  ? (
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
                  <label key={index}>
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

        {/* {registerusertype === "1" && bankID != "" ? (
          <div className="inner_form_new ">
            <label className="controlform">Corporate Name</label>
            <div className="form-bx">
              <label>
                <input
                  type="text"
                  ref={companyNameRef}
                  name="companyName"
                  value={exportForm.companyName}
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  placeholder="Corporate Name"
                  className={
                    errors.companyName && exportForm.companyName === ""
                      ? "error"
                      : ""
                  }
                />
                <span className="sspan"></span>
              </label>
              {errors.companyName && exportForm.companyName === "" ? (
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
                  exportForm?.companyName != "" && filteredCompanyList.length
                    ? "filterbx"
                    : "d-none"
                }
              >
                {exportForm?.companyName != ""
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

        {registerusertype === "1" && bankID != "" ? (
          <>
            <div className="inner_form_new ">
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
                    value={exportForm.TINNumber.trim()}
                    className="text-uppercase"
                  />
                  <span className="sspan"></span>
                  {errors.TINNumber  ? (
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
                    name="applicant"
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    placeholder="Applicant"
                    value={exportForm.applicant}
                    className={
                      errors.applicant
                        ? "error"
                        : ""
                    }
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
                    value={exportForm.BeneficiaryName}
                    className="text-uppercase"
                  />
                  <span className="sspan"></span>
                  {errors.BeneficiaryName ? (
                    <small className="errormsg">{errors.BeneficiaryName}</small>
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
                   value={exportForm?.BPNCode.trim()}
                  placeholder="BPN Code"
                  className={
                    errors.BPNCode && exportForm.BPNCode === "" ? "error text-uppercase" : "text-uppercase"
                  }
                />
                <span className="sspan"></span>
                {errors.BPNCode && exportForm.BPNCode === "" ? (
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

          <div className="row">
            <div className="col-md-6">
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
                      value={exportForm.applicantReferenceNumber.trim()}
                      className={
                        errors.applicantReferenceNumber &&
                        exportForm.applicantReferenceNumber === ""
                          ? "error text-uppercase"
                          : "text-uppercase"
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
                <button type="button" className="primrybtn  v-button">
                  Validate
                </button>
              </div>
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
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              peekNextMonth
              showMonthDropdown
              maxDate={new Date()}
              showYearDropdown
              dropdownMode="select" // Add this line
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
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    placeholder="Amount"
                    className={
                      errors.amount && exportForm.amount === "" ? "error" : ""
                    }
                  />
                  <span className="sspan"></span>
                  {errors.amount && exportForm.amount === "" ? (
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
                value={exportForm.relatedexchangeControlNumber.trim()}
                placeholder="Related Exchange Control Reference Number"
                className={
                  errors.relatedexchangeControlNumber 
                    ? "error text-uppercase"
                    : "text-uppercase"
                }
              />
              <span className="sspan"></span>
              {errors.relatedexchangeControlNumber  ? (
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
                className={ 
                  errors.applicantComments  
                    ? "error"
                    : ""
                }
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
          <label className="controlform">Submit to Bank Supervisor</label>

          <input
            type="checkbox"
            className="mt-4"
            onChange={(e) => {
              HandelSupervisorcheck(e);
            }}
          />
        </div>
        {/* end form-bx  */}

        {checkSupervisor == true ? (
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

        <h5 className="section_top_subheading">Attachments</h5>

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
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default ExportNewRequestForm;
