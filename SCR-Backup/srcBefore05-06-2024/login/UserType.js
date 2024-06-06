import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from "../Logo_T.png" 
import {APIURL} from '../constant'
import axios from 'axios' 
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet'

const UserType = () => {

  const [userData, setUserdata]= useState([]);


  const getHandledata = async () => {
    await axios
      .post(APIURL + 'Master/getusertypes')
      .then((response) => {   
        if(response.data.responseCode === "200"){
          setTimeout(() => {
            setUserdata(response.data.responseData )
          }, 1000);
        }else{
          setUserdata([]) 
        }
        
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  useEffect(()=>{
    getHandledata();
  },[])


  return (
    <>
      <Helmet>  <title>User-Type</title>  </Helmet>
      
      {
        userData.length ?  <div className='login_outer'>
        <div className='register_header'>
            <Link to='/'>
            <img src={logo} /></Link>
    <h3>Document Management System / Registration Types</h3>
            
            <div className='registration_form_panel_outer'> 

{
   userData.map((item, index)=>{
    return(
      <div className='registration_form_panel' key={item.id}>
      <h5>{item.name}</h5>

      <p>
      {  item.description }
      </p>

      <div className="form-footer"><Link to='/' className="register">Back</Link>
      <Link to={item.id == 1 ? '/IndividualRegister' : item.id == 2 ? '/BankRegister' : '/GovAgencieRegister' } className="login">Register</Link>
      </div>
    </div>
    )
  })  
} 
            </div>
        </div>
    </div> : <label className='outerloader'> <span className="loader"></span><span className='loaderwait'>Please Wait...</span></label>
      }
    

    </>
  )
}

export default UserType
