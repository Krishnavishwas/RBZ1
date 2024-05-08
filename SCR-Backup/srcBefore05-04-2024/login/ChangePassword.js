import React, { useEffect, useState } from 'react';
import logo from "../Logo_T.png";
import { Link, useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet";
import AuthUser from './AuthUser';
import { APIURL } from '../constant';
import { toast } from 'react-toastify'; 
import axios from 'axios';

const ChangePassword = () => { 

    const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const checkToken = localStorage.getItem("resetpasswordtoken")
  const [errors, setErrors] = useState({});
  const [Checkpass, setCheckpass]= useState(false);
  const [faillogin, setfaillogin]= useState('');
  const [failstatus, setfailstatus]= useState('');

  const navigate = useNavigate();


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

  const  submitHandleForm = async (e)=>{

e.preventDefault()

    await axios.post(APIURL + 'User/ResetPassword',{
        UserName: email,
        Password:password,
        Token:checkToken

    }).then((res)=>{
        if(res.data.responseCode == '200'){ 
            setToastDisplayed(true)
            if(toastDisplayed == true){
                alert()
                toast.success(res.data.responseMessage)
            }
            setTimeout(() => {
                navigate('/')
            }, 1200);
        }
        else{
            setToastDisplayed(true)
            setfaillogin(res.data.responseMessage);
            setfailstatus(res.data.responseStatus) 
            if(toastDisplayed == true){

                toast.warning(res.data.responseMessage)
            }
        }
    })
    .catch((error)=>{
        console.log(error)
    })

  }

  const currentUrl = window.location.href;
  const urlParts = currentUrl.split("/");
  const lastUrlPart = urlParts[urlParts.length - 1];
 


  useEffect(() => {
    if (toastDisplayed) {
        setTimeout(() => {
            setToastDisplayed(false)
        }, 1500);
    }
}, [toastDisplayed])

useEffect(()=>{
  const resetpasswordToken = localStorage.getItem("resetpasswordtoken")
  if(resetpasswordToken !== lastUrlPart){
   setTimeout(()=>{
    navigate("/")
   },2000)
  }

},[1500])
 

  return (
     <>
     
     <Helmet>  <title>Reset Password</title>  </Helmet>


     {
      checkToken !== lastUrlPart ? 
     
      <div className='login_outer '>
  <div className='login_inner login-max-width'>
    <div className='login_inner_header'>
      <Link to='/'><img src={logo} /> </Link>
      <h3>Document Management System</h3>
    </div>

    <div className='login_form '>
      <h5>Reset Password</h5>
    </div>
    <div className='login_form_panel'>
      <div className='form-bx mb-5'>
    
    <h2 className='font-sizeasas'>Token Expired Please Try Again</h2>
  
</div>
</div>


    </div>

  </div>
 
      :
(
  <div className='login_outer '>
  <div className='login_inner login-max-width'>
    <div className='login_inner_header'>
      <Link to='/'><img src={logo} /> </Link>
      <h3>Document Management System</h3>
    </div>

    <div className='login_form '>
      <h5>Reset Password</h5>
    </div>

    <div className='login_form_panel'>
      <div className='form-bx mb-5'>
        <label>
          <input type="email" className="form-control" placeholder="Username"
            onChange={(e) => HandleEmail(e)}
            id="email" />

          <span className='sspan'></span>
        </label>
        {errors?.email ? (
                <small className="errormsg">{errors?.email}</small>
              ) :  faillogin  ? <small className="errormsg">{faillogin}</small> : '' }
      </div>
      <div className='form-bx'>
        <label>
          <input type={Checkpass === true ? 'text' : "password"} className="form-control" placeholder="Enter password" onChange={(e) =>{ HandlePassowrd(e)}} id="pwd" />
          <span className='sspan'></span>
        </label>
        {errors?.password ? (
                <small className="errormsg2">{errors?.password}</small>
              ) :   ''}
             {Checkpass ? <i className="bi bi-eye passwordcheck" onClick={()=>{(setCheckpass(!Checkpass))}}></i> : <i className="bi bi-eye-slash passwordcheck" onClick={()=>{(setCheckpass(!Checkpass))}}></i>} 
      </div>
 

      <div className='form-footer'>
      {/* <Link to='/' className='register'>Back</Link> */}
        <button className='login' type="button" onClick={(e)=>submitHandleForm(e)} disabled= {toastDisplayed}>{toastDisplayed == true ? 'Please Wait..' : 'Submit'}</button>
      </div>




    </div>

  </div>

</div>
)
     }


     
     </>
  )
}

export default ChangePassword
