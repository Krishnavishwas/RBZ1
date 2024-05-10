import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { APIURL } from "../constant";
import Select from "react-select";
import moment from "moment";
import { toast } from "react-toastify";

const FINVNewRequestForm = () => {
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
  const relatedapplicationreferenceNumberRef = useRef(null); //delete

  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const userName = Storage.getItem("userName");
  const bankName = Storage.getItem("bankName");
  const bankidcheck = bankID !== "" ? "1" : "3";

  const [startDate, setStartDate] = useState(new Date());
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState();

  const [registerusertype, setregisterusertype] = useState(bankidcheck);
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

  const [files, setFiles] = useState([]);
  const [otherfiles, setOtherfiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [applicationType, setapplicationType] = useState([]);
  const [applicationSubType, setapplicationSubType] = useState([]);
  const [subsectorData, setsubsectorData] = useState([]);
  const [curRate, setCurrate] = useState();
  const [checkSupervisor, setcheckSupervisor] = useState(false);
  const [attachmentData, setAttachmentData] = useState([]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");

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

  const convertedRate = curRate * parseFloat(FINForm.amount);

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
  }, []);

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
    if (FINForm.relatedapplicationreferenceNumber === "") {
      newErrors.relatedapplicationreferenceNumber =
        "Related Application Reference Number is required";
      valid = false;
    }
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
    if (FINForm.subsector === "") {
      newErrors.subsector = "Sub sector is required";
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

  const handleClear = () => {
    setValue(null);
    setInputValue("");
    setOptions([]);
  };

  const generateRandomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
  };

  const HandleSubmit = async (e) => {
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
            FINForm.relatedapplicationreferenceNumber?.toUpperCase(),
          Name:
            registerusertype === "2" && bankID !== "" ? FINForm.applicant : "",
          CompanyID:
            registerusertype === "1" && bankID !== ""
              ? getCompanyName?.value
              : "",
          ApplicantTypeID: registerusertype,
          ApplicationTypeID: FINForm.applicationType,
          ApplicationSubTypeID: FINForm.applicationSubType,
          BeneficiaryName: FINForm.BeneficiaryName,
          BeneficiaryCountry: FINForm.baneficiaryCountry,
          BPNCode:
            registerusertype === "1" && bankID !== "" ? FINForm.BPNCode?.toUpperCase() : "",
          TINNumber:
            registerusertype === "1" && bankID !== "" ? FINForm.TINNumber?.toUpperCase() : "",
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
            toast.success(res.data.responseMessage);
            setTimeout(() => {
              navigate("/FINVDashboard");
            }, 1200);
          } else {
            toast.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
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
        toast.warning("Please fill all fields");
      }
      setToastDisplayed(true);
    }
  };

  const ResetHandleData = () => {
    setgetCompanyName("");
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
          <div className="form-bx-radio mt-4">
            {applicantTypes.map((item, index) => {
              return (
                <>
                  <label key={index} className={bankID != "" && item.id === 3
                      ? "cur-dis"
                      : bankidcheck == "3"
                      ? "cur-dis"
                      : ""}>
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
                      className={bankID != "" && item.id === 3
                      ? "cur-dis"
                      : bankidcheck == "3"
                      ? "cur-dis"
                      : ""}
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
                    value={FINForm.TINNumber?.trim()}
                    className={
                      errors.TINNumber ? "error text-uppercase" : "text-uppercase"
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
                    value={FINForm.BPNCode?.trim()}
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
              minDate='01/01/2018'
              showMonthDropdown
              maxDate={new Date()}
              showYearDropdown
              dropdownMode="select"
              keyboard={false}
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
          <label className="controlform">
            Related Application Reference Number
          </label>
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex">
                <div className="form-bx">
                  <label>
                    <input
                      ref={relatedapplicationreferenceNumberRef}
                      type="text"
                      name="relatedapplicationreferenceNumber"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      value={FINForm.relatedapplicationreferenceNumber?.trim()}
                      placeholder="Related Application Reference Number"
                      className={
                        errors.relatedapplicationreferenceNumber
                          ? "text-uppercase error"
                          : "text-uppercase"
                      }
                    />
                    <span className="sspan"></span>
                    {errors.relatedapplicationreferenceNumber ||
                    FINForm.relatedapplicationreferenceNumber !== "" ? (
                      <small className="errormsg">
                        {errors.relatedapplicationreferenceNumber}
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

        {checkSupervisor === true ? (
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
      </form>
    </>
  );
};

export default FINVNewRequestForm;
