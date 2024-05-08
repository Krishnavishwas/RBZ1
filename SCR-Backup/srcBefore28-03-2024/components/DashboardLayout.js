import React, { useState, useEffect } from "react";
import Header from "../navbar/Header";
import Sidebar from "../navbar/Sidebar";
import Footer from "../navbar/Footer";
import { useNavigate } from "react-router-dom"; 
import AuthUser from "../login/AuthUser";
import axios from 'axios'; 
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";

const DashboardLayout = ({ children }) => {
  const navigation = useNavigate();
  const {token,logout} = AuthUser();

   

  const [lastActiveTime, setLastActiveTime] = useState(new Date().getTime());
 

 
  
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
      <Header />
      <Sidebar />
      <main id="main" className="main">
        {" "}
        {children}{" "}
      </main>
      <Footer />
    </>
  );
};

export default DashboardLayout;
