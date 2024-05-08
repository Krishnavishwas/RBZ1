import React, { useEffect, useState } from "react";
import logo from "../Logo_T.png";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import AuthUser from "./AuthUser";
import { APIURL } from "../constant";
import { toast } from "react-toastify";
import Resetpassword from "./Resetpassword";
import { Storage } from "./Storagesetting";
import axios from "axios";
import Menubar from "../navbar/Menubar";

const Login = () => {
  const navigation = useNavigate();

  const { http, setToken } = AuthUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkloader, setCheckloader] = useState(false);
  const [errors, setErrors] = useState({});
const [Checkpass, setCheckpass]= useState(false);
  const { getMenudata } = Menubar();
  const [faillogin, setfaillogin]= useState('');
  const [failstatus, setfailstatus]= useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [ipAddress, setIpAddress] = useState(null);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");

        const newIpAddress = response.data.ip;

        setIpAddress(newIpAddress);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIpAddress();
  }, []);

  // form validation check
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (email === "") {
      newErrors.email = "Username is required";
      valid = false;
    } 
    if (password === "") {
      newErrors.password = "Password is required";
      valid = false;
    } 

    setErrors(newErrors);
    return valid;
  };
 

const HandleEmail = (e) =>{
  const name = e.target.name;
  const value = e.target.value;  
  setfaillogin('')
  if (name === 'email' &&  (value.includes('$') || value.includes('`') || value.includes('|') || value.includes(' ') || value.includes('~') || value.includes(':') || value.includes(',') || value.includes('>') || value.includes('<') || value.includes('(') || value.includes(')') || value.includes('*') || value.includes('&')  || value.includes('%') || value.includes('#')|| value.includes('+') ||   value.includes('?') || value.includes('!') || value.includes(';')) || value.includes('=') || (value.includes('"')) || (value.includes(`'`)) || (value.includes("/")) || (value.includes("}")) || (value.includes("{")) || (value.includes("^"))  || (value.includes("\\")) || (value.includes("]")) || (value.includes("[")) ) {
            

    return setErrors({ 
      email: `Not valid Key`,
      });
}else{
    setErrors({ 
      email: ``,
      });
}


  setEmail(e.target.value);
}
 

const HandlePassowrd = (e) =>{

  const name = e.target.name;
  const value = e.target.value; 

  const passwordValue = e.target.value.trim();  

  setfaillogin('')

  if (name === 'password' && value.includes(' ')) {
           
    const errmesg = value.slice(-1);
    const errmesglast = errmesg[errmesg.length - 1];

    return setErrors({ 
        password: `Space is not valid Key`,
      });
}else{
    setErrors({ 
        password: ``,
      });
}


  setPassword(passwordValue);
}

  const submitForm = async () => { 
 

    if (validateForm()) { 
      setCheckloader(true);
      if(ipAddress != null){
      http
        .post(APIURL + "User/UserLogin", {
          userName: email,
          password: password,
          IPAddress: ipAddress,
        })
        .then((res) => {  
          if (res.data.responseCode === "200") { 
              setToken(
                res.data.responseData.userType,
                res.data.responseData.loginToken,
                res.data.responseData.userID,
                res.data.responseData.userName,
                res.data.responseData.applicantType,
                res.data.responseData.name,
                res.data.responseData.roleID,
                res.data.responseData.roleName,
                res.data.responseData.bankID,
                res.data.responseData.bankName,                
                ipAddress,
                res.data.responseData.signImageURL,
              );
              getMenudata(
                res.data.responseData.roleID,
                res.data.responseData.loginToken,
                res.data.responseData.userID
              );  
            
          
          } else {
            toast.error(res.data.responseMessage , {
              autoClose: 1000,
            });
            setfaillogin(res.data.responseMessage);
            setfailstatus(res.data.responseStatus) 

            setTimeout(() => {
              setCheckloader(false);
            }, 1500);
          }
        })
        .catch((err)=>{
          toast.error(err , {
            autoClose: 1000,
          });
        })
        ;
      }
      else{
        navigation('/')
      }
    }
  }; 

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      submitForm();
    }
  };

  return (
    <>
      <Helmet>
        {" "}
        <title>Login</title>{" "}
      </Helmet>

      <div className="login_outer ">
        <div className="login_inner login-max-width">
          <div className="login_inner_header">
            <img src={logo} />
            <h3>Document Management System</h3>
          </div>

          <div className="login_form ">
            <h5>LOGIN FORM</h5>
          </div>

          <div className="login_form_panel">
            <div className="form-bx mb-5">
              <label>
                <input
                  type="email"
                  name="email"
                  className={
                    errors?.email ? " error" : ""
                  }
                  placeholder="Username"
                  onChange={(e) => {
                    HandleEmail(e)
                  }}
                  value={email}
                  id="email"
                  onKeyDown={handleKeyDown}
                />

                <span className="sspan"></span>
              </label>
              {errors?.email ? (
                <small className="errormsg">{errors?.email}</small>
              ) :  failstatus === '1' ? <small className="errormsg">{faillogin}</small> : '' }
            </div>
            <div className="form-bx">
              <label>
                <input
                name="password"
                  type={Checkpass === true ? 'text' : "password"}
                  className={
                    errors?.password ? " error" : ""
                  }
                  placeholder="Password"
                  onChange={(e) => {
                    HandlePassowrd(e);
                  }}
                  id="pwd"
                  onKeyDown={handleKeyDown}
                  value={password}
                />
                <span className="sspan"></span>
              </label>
              {errors?.password ? (
                <small className="errormsg2">{errors?.password}</small>
              ) :  failstatus === '2' ? <small className="errormsg">{faillogin}</small> : ''}
             {Checkpass ? <i className="bi bi-eye passwordcheck" onClick={()=>{(setCheckpass(!Checkpass))}}></i> : <i className="bi bi-eye-slash passwordcheck" onClick={()=>{(setCheckpass(!Checkpass))}}></i>} 
            </div>

            <div className="form-bx mt-5">
              <Link  onClick={()=>setShowUpdateModal(true)} >
                Forgot password?
              </Link>
            </div>

            <div className="form-footer">
              <Link to="/usertype" className="register">
                Register
              </Link>
              <button
                className="login"
                type="button"
                onClick={(e) => submitForm(e)}
                disabled={checkloader === true ? true : false}
                onKeyDown={handleKeyDown}
              >
                {checkloader === true ? "Please Wait.." : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Resetpassword setShowUpdateModal={setShowUpdateModal} showUpdateModal={showUpdateModal} />
    </>
  );
};

export default Login;
