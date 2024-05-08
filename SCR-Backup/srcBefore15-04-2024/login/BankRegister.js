import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Logo_T.png";
import { APIURL } from "../constant";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import background from "../login/img/registration_2.jpg";

const BankRegister = () => {
  const navigation = useNavigate();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const banknameRef = useRef(null);
  const banktypeRef = useRef(null);
  const addressRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const [masterBank, setmasterBank] = useState([]);
  const [bankData, setbankdata] = useState({
    name: "",
    emailID: "",
    phoneNumber: "",
    address: "",
    userName: "",
    password: "",
    BankID: "",
    Applyingfor: "",
  });
  const [errors, setErrors] = useState({}); 
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

  const getHandledata = async () => {
    try {
      const response = await axios.post(APIURL + "Master/GetMasterBank");
      if (response.data.responseCode == "200") {
        setTimeout(() => {
          setmasterBank(response.data.responseData);
        }, 1000);
      } else {
        setmasterBank([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // form validation check
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numericRegex = /\d/;

    if (bankData?.name === "") {
      newErrors.name = "Full name is required";
      valid = false;
    }
    if (bankData?.emailID === "") {
      newErrors.emailID = "Email is required";
      valid = false;
      // setemailerror(true);
    } else if (!emailRegex.test(bankData?.emailID)) {
      newErrors.emailID = "Please enter valid email Id";
      valid = false;
      //   setemailerror(true);
    }
    if (bankData?.Applyingfor === "") {
      newErrors.Applyingfor = "Bank type required";
      valid = false;
    }
    if (bankData?.BankID === "") {
      newErrors.BankID = "Bank name is required";
      valid = false;
    }
    if (bankData?.phoneNumber === "") {
      newErrors.phoneNumber = "Contact number is required";
      valid = false;
    } else if (bankData?.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Contact number should be 10 digits only";
      valid = false;
    }

    if (bankData?.address === "") {
      newErrors.address = "Address is required";
      valid = false;
    }
    if (bankData?.userName === "") {
      newErrors.userName = "Username is required";
      valid = false;
    }
    if (bankData?.password === "") {
      newErrors.password = "Password is required";
      valid = false;
    } else if (bankData?.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    } else if (!specialCharacterRegex.test(bankData?.password)) {
      newErrors.password =
        "Password must contain at least one special character";
      valid = false;
    } else if (!numericRegex.test(bankData?.password)) {
      newErrors.password = "Password must contain at least one numeric digit";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

   
  const bankdataChangehandle = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    console.log("name, value", name, value)

    const specialChars = /[!@#$%^&*(),.?":{}|<>]/; 
    let newErrors = {};
    let valid = true
    if (name == "name" && value.charAt(0) === ' ') { 
     
      newErrors.name = "First character cannot be a blank space"; 
      valid = false
  } 
    else if (name == "name" && (specialChars.test(value) ||
value?.includes("_") ||
value?.includes("+") ||
value?.includes("=") ||
value?.includes("'") ||
value?.includes(";") ||
value?.includes("[") ||
value?.includes("]")||
value?.includes("]") || /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0)))) {  
  newErrors.name = "Special characters not allowed"; 
    valid = false
  }
  else if( name === "phoneNumber"  && (value.length > 10 )){
    newErrors.phoneNumber = "Mobile numbers should be only 10 digits"; 
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
value?.includes("]") || /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0)))) {  
newErrors.TINNumber = "Special characters not allowed"; 
  valid = false
}
else if (name == "emailID" && value.charAt(0) === ' ') { 
     
  newErrors.emailID = "First character cannot be a blank space"; 
  valid = false
} 
else if (name == "emailID" && /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0))) {  
newErrors.emailID = "Special characters are not allowed as the first character"; 
valid = false
} else if(name == "emailID" && (value.includes("$") ||
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
value.includes("["))){
  newErrors.emailID = "Not allowed as the character"; 
  valid = false
}

else if (name == "address" && value.charAt(0) === ' ') { 
     
  newErrors.address = "First character cannot be a blank space"; 
  valid = false
} 
else if (name == "address" && (specialChars.test(value) ||
value?.includes("_") ||
value?.includes("+") ||
value?.includes("=") ||
value?.includes("'") ||
value?.includes(";") ||
value?.includes("[") ||
value?.includes("]")||
value?.includes("/")||
value?.includes("]"))) {  
newErrors.address = "Special characters not allowed"; 
valid = false
}   
else if( name === "userName"  && value.charAt(0) === ' '){
  newErrors.userName = "First character cannot be a blank space"; 
  valid = false
}

   else if ( name === "userName"  && /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0))) {
      newErrors.userName = "Special characters not allowed"; 
      valid = false
    } 
    else if(name == "userName" && (value.includes("$") ||
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
value.includes("["))){
  newErrors.userName = "Not allowed as the character"; 
  valid = false
}
   else if( name === "password"  && value.charAt(0) === ' '){
      newErrors.password = "First character cannot be a blank space"; 
      valid = false
    }
    else{
      setErrors({});
      setbankdata((prevState) => ({
        ...prevState,
        [name]: value,
      }));
  
    }

    setErrors(newErrors);

    // if (emailRegex.test(bankData?.emailID.trim())) {
    //   setemailerror(false);
    // }
  };
 

  const bankApplyforhamdle = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setbankdata((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // User/UserRegistration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // console.log('Form submitted successfully:', bankData);

      await axios
        .post(APIURL + "User/UserRegistration", bankData)
        .then((response) => {
          // console.log("response", response);
          if (response.data.responseCode == "200") {
            toast.success(response.data.responseMessage);
            setbankdata({
              name: "",
              emailID: "",
              phoneNumber: "",
              address: "",
              userName: "",
              password: "",
              BankID: "",
              Applyingfor: "",
            });

            setTimeout(() => {
              nameRef.current.value = "";
              emailRef.current.value = "";
              phoneNumberRef.current.value = "";
              banknameRef.current.value = "";
              banktypeRef.current.value = "";
              addressRef.current.value = "";
              usernameRef.current.value = "";
              passwordRef.current.value = "";

              navigation("/");
            }, 1000);
          } else {
            toast.warning(response.data.responseMessage);
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
    getHandledata();

    if (toastDisplayed) {
      setTimeout(() => {
        setToastDisplayed(false);
      }, 1500);
    }
  }, [toastDisplayed]);

  return (
    <>
      <Helmet>
        {" "}
        <title>Bank/ADLA Register</title>{" "}
      </Helmet>

      <div className="user_auth">
        <div
          className="user_auth_left"
          style={{ background: `url(${background})` }}
        >
          <div className="logo_uth_user">
            <div>
              <img src={logo} />
              <h3>Document Management System</h3>
            </div>

            <p>
              <b>BANK/ADLA REGISTRATION FORM</b>
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
              {/* <div className="login_inner_header">
            <img src={logo} />
            <h3>Document Management System</h3>
          </div> */}

              <div className="login_form ">
                <h5>Bank/ADLA REGISTRATION FORM</h5>
              </div>

              <div className="login_form_panel">
                <form>
                  {/* {Object.keys(errors).map((key) => (
                    <div key={key} style={{ color: 'red' }}>{errors[key]}</div>
                ))} */}

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-bx mb-4">
                        <label>
                          <select
                            ref={banknameRef}
                            className={
                              errors?.BankID && bankData?.BankID == ""
                                ? "error"
                                : ""
                            }
                            name="BankID"
                            onChange={(e) => {
                              bankdataChangehandle(e);
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
                        </label>
                        {errors?.BankID && bankData?.BankID == "" ? (
                          <small className="errormsg">{errors?.BankID}</small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-bx mb-4">
                        <label>
                          <select
                            ref={banktypeRef}
                            className={
                              errors?.Applyingfor && bankData?.Applyingfor == ""
                                ? "error"
                                : ""
                            }
                            name="Applyingfor"
                            onChange={(e) => {
                              bankApplyforhamdle(e);
                            }}
                          >
                            <option value="">Select Applying For</option>
                            <option value="Bank/ADLA Capturer">
                              Bank/ADLA Capturer
                            </option>
                            <option value="Bank/ADLA Supervisor">
                              Bank/ADLA Supervisor
                            </option>
                          </select>
                          <span className="sspan"></span>
                        </label>
                        {errors?.Applyingfor && bankData?.Applyingfor == "" ? (
                          <small className="errormsg">
                            {errors?.Applyingfor}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-bx mb-4">
                        <label>
                          <input
                            type="text"
                            ref={nameRef}
                            className={
                              errors?.name && bankData?.name == ""
                                ? "error"
                                : ""
                            }
                            name="name"
                            placeholder="Full Name"
                            onChange={(e) => {
                              bankdataChangehandle(e);
                            }}
                            value={bankData.name}
                          />
                          <span className="sspan"></span>
                        </label>
                        {errors?.name && bankData?.name == "" ? (
                          <small className="errormsg">{errors?.name}</small>
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
                            className={errors?.emailID ? "error" : ""}
                            name="emailID"
                            onChange={(e) => {
                              bankdataChangehandle(e);
                            }}
                            placeholder="Email Address"
                            value={bankData.emailID}
                          />
                          <span className="sspan"></span>
                        </label>
                        {errors?.emailID ? (
                          <small className="errormsg">{errors?.emailID}</small>
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
                        className={errors?.phoneNumber ? "error" : ""}
                        name="phoneNumber"
                        onChange={(e) => {
                          bankdataChangehandle(e);
                        }}
                        placeholder="Contact Number"
                        value={bankData.phoneNumber}
                      />
                      <span className="sspan"></span>
                    </label>
                    {errors?.phoneNumber ? (
                      <small className="errormsg">{errors?.phoneNumber}</small>
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
                          errors?.address && bankData?.address == ""
                            ? "error"
                            : ""
                        }
                        name="address"
                        onChange={(e) => {
                          bankdataChangehandle(e);
                        }}
                        placeholder="Address"
                        value={bankData.address}
                      />
                      <span className="sspan"></span>
                    </label>
                    {errors?.address && bankData?.address == "" ? (
                      <small className="errormsg">{errors?.address}</small>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-bx mb-4">
                        <label>
                          <input
                            type="text"
                            ref={usernameRef}
                            className={errors?.userName ? "error" : ""}
                            name="userName"
                            onChange={(e) => {
                              bankdataChangehandle(e);
                            }}
                            value={bankData.userName}
                            placeholder="Username"
                          />
                          <span className="sspan"></span>
                        </label>
                        {errors?.userName ? (
                          <small className="errormsg">{errors?.userName}</small>
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
                            className={errors?.password ? "error" : ""}
                            name="password"
                            value={bankData.password.trim()}
                            onChange={(e) => {
                              bankdataChangehandle(e);
                            }}
                            placeholder="Password"
                          />
                          <span className="sspan"></span>
                        </label>
                        {errors?.password ? (
                          <small className="errormsg">{errors?.password}</small>
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
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e)}
                      className="login"
                    >
                      Signup
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankRegister;
