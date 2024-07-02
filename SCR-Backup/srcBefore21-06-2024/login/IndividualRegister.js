import React, { useEffect, useState, useRef } from "react";
import logo from "../Logo_T.png";
import { Link, useNavigate } from "react-router-dom";
import { APIURL } from "../constant";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ExportformDynamicField from "../components/ExportformDynamicField";
import background from "../login/img/registration_1.jpg";
import Select from "react-select";

const IndividualRegister = () => {
  const navigation = useNavigate();

  const { companies } = ExportformDynamicField();

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const niuRef = useRef(null);
  const ApplicantRef = useRef(null);
  const addressRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const companynameRef = useRef(null);
  const bpncodeRef = useRef(null);
  const tinNumberRef = useRef(null);

  const [bankData, setbankdata] = useState({
    fname: "",
    emailID: "",
    CompanyName: "",
    TINNumber: "",
    phoneNumber: "",
    address: "",
    userName: "",
    password: "",
    ApplicantType: "1",
    IdentificationNumber: "",
    BPNCode: "",
  });

  const [errors, setErrors] = useState({});
  const [value, setValue] = useState("Company Name");
  const [registerusertype, setregisterusertype] = useState("1");
  const [applicantTypes, setapplicantTypes] = useState([]);
  const [getCompanyId, setgetCompanyId] = useState("");
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState(null);
  // const [value, setValue] = useState("Company Name");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

  // GetApplicantTypes
  const GetApplicantTypes = async () => {
    try {
      const response = await axios.post(APIURL + "Master/GetApplicantTypes");
      if (response.data.responseCode === "200") {
        setTimeout(() => {
          setapplicantTypes(response.data.responseData);
        }, 1000);
      } else {
        setapplicantTypes("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numericRegex = /\d/;

    if (bankData.fname === "") {
      newErrors.fname = "Full name is required";
      valid = false;
    }
    if (bankData?.emailID === "") {
      newErrors.emailID = "Email is required";
      valid = false;
    } else if (!emailRegex.test(bankData?.emailID)) {
      newErrors.emailID = "Please enter valid email Id";
      valid = false;
    }
    if (registerusertype == 2 && bankData.IdentificationNumber === "") {
      newErrors.niu = "National identification number is required";
      valid = false;
    }
    // if (registerusertype == 1 && bankData.BPNCode === "") {
    //   newErrors.bpncode = "BPN Code is required";
    //   valid = false;
    // }
    if (bankData.ApplicantType === "") {
      newErrors.ApplicantType = "Select User Type";
      valid = false;
    }
    if (bankData.phoneNumber === "") {
      newErrors.phoneNumber = "Contact number is required";
      valid = false;
    } else if (bankData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Contact number should be 10 digits only.";
      valid = false;
    }

    if (bankData.address === "") {
      newErrors.address = "Address is required";
      valid = false;
    }
    if (bankData.userName === "") {
      newErrors.userName = "Username is required";
      valid = false;
    }
    if (
      registerusertype === "1" &&
      (getCompanyName === "" ||
        getCompanyName === "Company Name" ||
        getCompanyName == null)
    ) {
      newErrors.companyName = "Company Name is required";
      valid = false;
    }
    if (bankData.password === "") {
      newErrors.password = "Password is required";
      valid = false;
    } else if (bankData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    } else if (!specialCharacterRegex.test(bankData.password)) {
      newErrors.password =
        "Password must contain at least one special character";
      valid = false;
    } else if (!numericRegex.test(bankData.password)) {
      newErrors.password = "Password must contain at least one numeric digit";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // handel form
  const bankdataChangehandle = (e) => {
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    let newErrors = {};
    let valid = true;

    const name = e.target.name;
    const value = e.target.value;

    if (name == "fname" && value.charAt(0) === " ") {
      newErrors.fname = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "fname" &&
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
      newErrors.fname = "Special characters not allowed";
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
    } else if (name == "emailID" && value.charAt(0) === " ") {
      newErrors.emailID = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "emailID" &&
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0))
    ) {
      newErrors.emailID =
        "Special characters are not allowed as the first character";
      valid = false;
    } else if (
      name == "emailID" &&
      (value.includes("$") ||
        value.includes("`") ||
        value.includes("|") ||
        value.includes(" ") ||
        value.includes("~") ||
        value.includes(":") ||
        value.includes(",") ||
        value.includes(">") ||
        value.includes("<") ||
        value.includes("(") ||
        value.includes(")") ||
        value.includes("*") ||
        value.includes("&") ||
        value.includes("%") ||
        value.includes("#") ||
        value.includes("+") ||
        value.includes("?") ||
        value.includes("!") ||
        value.includes(";") ||
        value.includes("=") ||
        value.includes('"') ||
        value.includes(`'`) ||
        value.includes("/") ||
        value.includes("}") ||
        value.includes("{") ||
        value.includes("^") ||
        value.includes("\\") ||
        value.includes("]") ||
        value.includes("["))
    ) {
      newErrors.emailID = "Not allowed as the character";
      valid = false;
    } else if (name == "address" && value.charAt(0) === " ") {
      newErrors.address = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "address" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("/") ||
        value?.includes("]"))
    ) {
      newErrors.address = "Special characters not allowed";
      valid = false;
    } else if (name == "BPNCode" && value.charAt(0) === " ") {
      newErrors.bpncode = "First character cannot be a blank space";
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
        value?.includes("/") ||
        value?.includes("]") ||
        /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0)))
    ) {
      newErrors.bpncode = "First character cannot be special characters";
      valid = false;
    } else if (name === "IdentificationNumber" && value.charAt(0) === " ") {
      newErrors.niu = "First character cannot be a blank space";
      valid = false;
    } else if (
      name === "IdentificationNumber" &&
      (value.includes("$") ||
        value.includes("`") ||
        value.includes("|") ||
        value.includes(" ") ||
        value.includes("~") ||
        value.includes(":") ||
        value.includes(",") ||
        value.includes(">") ||
        value.includes("<") ||
        value.includes("(") ||
        value.includes(")") ||
        value.includes("*") ||
        value.includes("&") ||
        value.includes("%") ||
        value.includes("#") ||
        value.includes("+") ||
        value.includes("?") ||
        value.includes("!") ||
        value.includes(";") ||
        value.includes("=") ||
        value.includes('"') ||
        value.includes(`'`) ||
        value.includes("/") ||
        value.includes("}") ||
        value.includes("{") ||
        value.includes("^") ||
        value.includes("\\") ||
        value.includes("]") ||
        value.includes("["))
    ) {
      newErrors.niu = "Special characters not allowed";
      valid = false;
    } else if (name === "userName" && value.charAt(0) === " ") {
      newErrors.userName = "First character cannot be a blank space";
      valid = false;
    } else if (
      name === "userName" &&
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0))
    ) {
      newErrors.userName = "Special characters not allowed";
      valid = false;
    } else if (
      name == "userName" &&
      (value.includes("$") ||
        value.includes("`") ||
        value.includes("|") ||
        value.includes(" ") ||
        value.includes("~") ||
        value.includes(":") ||
        value.includes(",") ||
        value.includes(">") ||
        value.includes("<") ||
        value.includes("(") ||
        value.includes(")") ||
        value.includes("*") ||
        value.includes("&") ||
        value.includes("%") ||
        value.includes("#") ||
        value.includes("+") ||
        value.includes("?") ||
        value.includes("!") ||
        value.includes(";") ||
        value.includes("=") ||
        value.includes('"') ||
        value.includes(`'`) ||
        value.includes("/") ||
        value.includes("}") ||
        value.includes("{") ||
        value.includes("^") ||
        value.includes("\\") ||
        value.includes("]") ||
        value.includes("["))
    ) {
      newErrors.userName = "Not allowed as the character";
      valid = false;
    } else if (name === "password" && value.charAt(0) === " ") {
      newErrors.password = "First character cannot be a blank space";
      valid = false;
    } else if (name === "phoneNumber" && value.length > 10) {
      newErrors.phoneNumber = "Mobile numbers should be only 10 digits";
      valid = false;
    } else {
      setErrors({});
      setbankdata((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    setErrors(newErrors);
  };

  const handleUsertype = (e) => {
    setregisterusertype(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await axios
        .post(APIURL + "User/UserRegistration", {
          name: bankData.fname,
          emailID: bankData.emailID,
          CompanyName: getCompanyName.label,
          TINNumber: bankData.TINNumber?.toUpperCase(),
          phoneNumber: bankData.phoneNumber,
          address: bankData.address,
          userName: bankData.userName,
          password: bankData.password,
          ApplicantType: bankData.ApplicantType,
          IdentificationNumber:
            registerusertype == 1
              ? ""
              : bankData?.IdentificationNumber?.toUpperCase(),
          BPNCode: registerusertype == 2 ? "" : bankData.BPNCode?.toUpperCase(),
        })
        .then((response) => {
          if (response.data.responseCode === "200") {
            toast.success(response.data.responseMessage);
            setbankdata({
              fname: "",
              emailID: "",
              // CompanyName: "",
              TINNumber: "",
              phoneNumber: "",
              address: "",
              userName: "",
              password: "",
              ApplicantType: "1",
              IdentificationNumber: "",
              BPNCode: "",
            });

            setTimeout(() => {
              if (nameRef.current) nameRef.current.value = "";
              if (emailRef.current) emailRef.current.value = "";
              if (phoneNumberRef.current) phoneNumberRef.current.value = "";
              if (ApplicantRef.current) ApplicantRef.current.value = "";
              if (niuRef.current) niuRef.current.value = "";
              if (addressRef.current) addressRef.current.value = "";
              if (usernameRef.current) usernameRef.current.value = "";
              if (passwordRef.current) passwordRef.current.value = "";
              if (bpncodeRef.current) bpncodeRef.current.value = "";
              if (companynameRef.current) companynameRef.current.value = "";
              if (tinNumberRef.current) tinNumberRef.current.value = "";
              navigation("/");
            }, 1000);
          } else {
            if (!toastDisplayed) {
              toast.warning(response.data.responseMessage, { autoClose: 1000 });
            }
            setToastDisplayed(true);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.warning(error);
        });
    } else {
      if (!toastDisplayed) {
        toast.warning("Please fill all fields", { autoClose: 1000 });
      }
      setToastDisplayed(true);
    }
  };

  useEffect(() => {
    GetApplicantTypes();
    if (toastDisplayed) {
      setTimeout(() => {
        setToastDisplayed(false);
      }, 1500);
    }
  }, [toastDisplayed]);

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

  return (
    <>
      <Helmet>
        <title>Individual/Company Register</title>
      </Helmet>
      <div className="user_auth">
        <div
          className="user_auth_left"
          style={{ background: `url(${background})` }}
        >
          <div className="logo_uth_user">
            <div>
              <img src={logo} alt="Reg" />
              <h3>Document Management System</h3>
            </div>

            <p>
              <b>INDIVIDUAL/COMPANY REGISTRATION FORM</b>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
              <br />
              <br />
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
        <div className="user_auth_right">
          <div className="register_outer">
            <div className="login_inner">
              <div className="login_form ">
                <h5>
                  {bankData.ApplicantType == "1" ? "Company" : "Individual"}{" "}
                  REGISTRATION FORM
                </h5>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="login_form_panel">
                  <div className="form-bx-radio mb-4">
                    {applicantTypes.map((item, index) => {
                      return (
                        <>
                          <label
                            key={index}
                            className={item.id === 3 ? "d-none" : ""}
                          >
                            <input
                              type="radio"
                              ref={ApplicantRef}
                              onChange={(e) => {
                                handleUsertype(e);
                                bankdataChangehandle(e);
                              }}
                              name="ApplicantType"
                              value={item.id}
                              checked={registerusertype == item.id}
                            />
                            <span>{item.name}</span>
                          </label>
                        </>
                      );
                    })}
                    {errors.niu && bankData.ApplicantType === "" ? (
                      <small className="errormsg">{errors.ApplicantType}</small>
                    ) : (
                      ""
                    )}
                  </div>

                  {registerusertype == 1 ? (
                    <div className="form-bx mb- text-start">
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
                              : "Please provide at least 3 characters for auto search"
                          }
                          onMenuClose={handleClear}
                          className="selectinput"
                        />
                        {errors.companyName &&
                        (getCompanyName === "Company Name" ||
                          getCompanyName == null) ? (
                          <small className="errormsg2">
                            {errors.companyName}
                          </small>
                        ) : (
                          ""
                        )}
                        <small className="informgs">
                          Please provide at least 3 characters for auto search
                          of Company Name
                        </small>
                      </div>

                      <div className="form-bx pt-1">
                        <label>
                          <input
                            type="text"
                            ref={tinNumberRef}
                            name="TINNumber"
                            onChange={(e) => {
                              bankdataChangehandle(e);
                            }}
                            placeholder="TIN Number"
                            value={bankData.TINNumber.trim()}
                          />
                          <span className="sspan"></span>
                          {errors.TINNumber ? (
                            <small className="errormsg">
                              {errors.TINNumber}
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

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-bx mb-4">
                        <label>
                          <input
                            type="text"
                            ref={nameRef}
                            className={errors.fname ? "error" : ""}
                            name="fname"
                            placeholder="Full Name"
                            onChange={(e) => {
                              bankdataChangehandle(e);
                            }}
                            value={bankData.fname}
                          />
                          <span className="sspan"></span>
                        </label>
                        {errors.fname ? (
                          <small className="errormsg">{errors.fname}</small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-bx mb-4">
                        <label>
                          <input
                            type="text"
                            ref={emailRef}
                            className={errors.emailID ? "error" : ""}
                            name="emailID"
                            onChange={(e) => {
                              bankdataChangehandle(e);
                            }}
                            placeholder="Email Address"
                            value={bankData.emailID}
                          />
                          <span className="sspan"></span>
                        </label>
                        {errors.emailID ? (
                          <small className="errormsg">{errors.emailID}</small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-bx mb-4">
                    <label>
                      <input
                        type="number"
                        ref={phoneNumberRef}
                        min={0}
                        maxLength={10}
                        className={errors.phoneNumber ? "error" : ""}
                        name="phoneNumber"
                        onChange={(e) => {
                          bankdataChangehandle(e);
                        }}
                        placeholder="Contact Number"
                        value={bankData.phoneNumber}
                      />
                      <span className="sspan"></span>
                    </label>
                    {errors.phoneNumber ? (
                      <small className="errormsg">{errors.phoneNumber}</small>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="form-bx mb-4">
                    <label>
                      <input
                        type="text"
                        ref={addressRef}
                        className={
                          errors.address && bankData.address == ""
                            ? "error"
                            : ""
                        }
                        name="address"
                        value={bankData.address}
                        onChange={(e) => {
                          bankdataChangehandle(e);
                        }}
                        placeholder="Address"
                      />
                      <span className="sspan"></span>
                    </label>
                    {errors.address && bankData.address == "" ? (
                      <small className="errormsg">{errors.address}</small>
                    ) : (
                      ""
                    )}
                  </div>

                  {registerusertype == 2 ? (
                    <div className="form-bx mb-4">
                      <label>
                        <input
                          type="text"
                          ref={niuRef}
                          className={
                            errors.niu && bankData.IdentificationNumber == ""
                              ? "error"
                              : ""
                          }
                          name="IdentificationNumber"
                          placeholder="National Identification Number"
                          value={bankData.IdentificationNumber.trim()}
                          onChange={(e) => {
                            bankdataChangehandle(e);
                          }}
                        />
                        <span className="sspan"></span>
                      </label>
                      {errors.niu && bankData.IdentificationNumber == "" ? (
                        <small className="errormsg">{errors.niu}</small>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  {registerusertype == 1 ? (
                    <div className="form-bx mb-4">
                      <label>
                        <input
                          type="text"
                          ref={bpncodeRef}
                          className={
                            errors.bpncode && bankData.BPNCode == ""
                              ? "error"
                              : ""
                          }
                          name="BPNCode"
                          value={bankData.BPNCode.trim()}
                          placeholder="BPN Code"
                          onChange={(e) => {
                            bankdataChangehandle(e);
                          }}
                        />
                        <span className="sspan"></span>
                      </label>
                      {errors.bpncode && bankData.BPNCode == "" ? (
                        <small className="errormsg">{errors.bpncode}</small>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-bx mb-4">
                        <label>
                          <input
                            type="text"
                            ref={usernameRef}
                            className={errors.userName ? "error" : ""}
                            name="userName"
                            onChange={(e) => {
                              bankdataChangehandle(e);
                            }}
                            placeholder="Username"
                            autoComplete={false}
                            value={bankData.userName}
                          />
                          <span className="sspan"></span>
                        </label>
                        {errors.userName ? (
                          <small className="errormsg">{errors.userName}</small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-bx mb-3">
                        <label>
                          <input
                            type="password"
                            ref={passwordRef}
                            className={errors.password ? "error" : ""}
                            name="password"
                            onChange={(e) => {
                              bankdataChangehandle(e);
                            }}
                            placeholder="Password"
                            value={bankData.password.trim()}
                            autoComplete={false}
                          />
                          <span className="sspan"></span>
                        </label>
                        {errors.password ? (
                          <small className="errormsg">{errors.password}</small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-footer">
                    <Link to="/" className="register">
                      Login
                    </Link>
                    <button className="login">Signup</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualRegister;
