import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";  
import axios from 'axios';   
import AdminHeader from "../navbar/AdminHeader";
import AdminSidebar from "../navbar/AdminSidebar";
import AdminFooter from "../navbar/AdminFooter";
import AuthUser from "../../login/AuthUser";
import { Storage } from "../../login/Storagesetting";

const AdminDashboardLayout = ({ children }) => {
  const navigation = useNavigate();
  const {token,logout} = AuthUser();

  
  const LoginToken = Storage.getItem('loginToken');
  const UserID =  Storage.getItem('userID');

  const [lastActiveTime, setLastActiveTime] = useState(new Date().getTime());
 


  // const [usercheck, setusercheck]= useState('')

  // const GetAuthCheck = async ()=>{

  //   await axios.post(APIURL + 'User/GetIP',{ 
  //     UserId:UserID
  //   }).then((res)=>{
  //     console.log('usercheck',res)
  //     setusercheck(res.data)
  //   })

  // }

  // useEffect(()=>{
  //   GetAuthCheck();
  // },10000)
  
  useEffect(() => {
    const MenuLoadAuto = () => { 
      const x = 100;  
      const y = 100;  
 
      const event = new MouseEvent('mousemove', {
        clientX: x,
        clientY: y
      });

      // Dispatch the event
      document.dispatchEvent(event);
    };
 
    const timer = setTimeout(MenuLoadAuto, 100);
 
    return () => clearTimeout(timer);
  }, []);
  

  useEffect(() => {
    const handleMouseMove = () => {
      setLastActiveTime(new Date().getTime());
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const checkInactiveTime = setInterval(() => {
      const currentTime = new Date().getTime();
      const inactiveTime = currentTime - lastActiveTime;

      if (inactiveTime > 36000000) { 
        sessionStorage.clear();
        if(token != undefined){
          logout();
      }
        setLastActiveTime(currentTime);
      }
    }, 36000000);

    return () => {
      clearInterval(checkInactiveTime);
    };
  }, [lastActiveTime]);

  return (
    <>
      <AdminHeader />
      <AdminSidebar />
      <main id="main" className="main">
        {" "}
        {children}{" "}
      </main>
      <AdminFooter />
    </>
  );
};

export default AdminDashboardLayout;
