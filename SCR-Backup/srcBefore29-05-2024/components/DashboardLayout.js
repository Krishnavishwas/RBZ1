import React, { useState, useEffect } from "react";
import Header from "../navbar/Header";
import Sidebar from "../navbar/Sidebar";
import Footer from "../navbar/Footer";
import { useNavigate } from "react-router-dom";
import AuthUser from "../login/AuthUser";
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import Menubar from "../navbar/Menubar";

const DashboardLayout = ({ children }) => {
  const navigation = useNavigate();
  const { token, logout } = AuthUser();
  const menuItemlocal = Menubar();

  const [lastActiveTime, setLastActiveTime] = useState(new Date().getTime());

  const menuItem = JSON.parse(menuItemlocal?.menuItemlocal);

  useEffect(() => {
    const MenuLoadAuto = () => {
      const x = 100;
      const y = 100;

      const event = new MouseEvent("mousemove", {
        clientX: x,
        clientY: y,
      });

      // Dispatch the event
      document.dispatchEvent(event);
    };

    var timer;

    if (menuItem == null) {
      timer = setTimeout(MenuLoadAuto, 1000);
    }

    return () => clearTimeout(timer);
  }, []);

  ///mouse move for

  useEffect(() => {
    if (!menuItem) {
      const handleMouseMove = () => {
        setLastActiveTime(new Date().getTime());
      };

      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    } else {
    }
  }, [menuItem]);

    

  useEffect(() => {
    const checkInactiveTime = setInterval(() => {
      const currentTime = new Date().getTime();
      const inactiveTime = currentTime - lastActiveTime;

      if (inactiveTime > 36000000) {
        sessionStorage.clear();
        if (token != undefined) {
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
      {menuItem == null ? (
        <label className="outerloader">
          {" "}
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : (
        <>
          {" "}
          <Header />
          <Sidebar />
          <main id="main" className="main">
            {" "}
            {children}{" "}
          </main>
          <Footer />
        </>
      )}
    </>
  );
};

export default DashboardLayout;
