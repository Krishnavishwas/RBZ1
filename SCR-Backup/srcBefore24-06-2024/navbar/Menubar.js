import axios from "axios";
import React, { useEffect, useState } from "react";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Menubar = () => {
  const navigate = useNavigate(); 

  const bankId = Storage.getItem("bankID")

  const getMenudata = async (roleIDs, LoginToken, UserID, bankId) => {

    await axios
    .post(APIURL + "User/MenuCount", {
      UserID: UserID?.replace(/"/g, ""),
      RoleID:roleIDs,
      BankID:bankId
    })
    .then((res) => {
      if (res.data.responseCode == 200) {
        console.log("count---",res)
        // setmenuCount(res.data.responseData);
        Storage.removeItem("menucounter")
        Storage.setItem("menucounter", JSON.stringify(res.data.responseData))

          
            const MenuLoadAuto = () => {
              const x = 10000;
              const y = 100;
        
              const event = new MouseEvent("mousemove", {
                clientX: x,
                clientY: y,
              });
        
              // Dispatch the event
              document.dispatchEvent(event);
            };
        
            const timer = setTimeout(MenuLoadAuto, 1000);
        
            return () => clearTimeout(timer);
           
        
      }
    })
    .catch((err)=>{
      console.log("err", err)
    })
     

    try {
      const response = await axios.post(APIURL + "User/GetMenuList", {
        RoleID: roleIDs,
        LoginToken: LoginToken,
        UserID: UserID,
      });
      console.log("menuitem", response)
      if (response.data.responseCode === "200") { 
        if(roleIDs != 1){
          if (response.data.responseData[0].menuName === "Home") {
            navigate("/AllDashboard");
          } else {
            navigate("/" + response.data.responseData[0].subMenu[0].subMenuURL);
              sessionStorage.setItem("submenuname", "Dashboard");
             sessionStorage.setItem("menuname", response.data.responseData[0].menuName);

          }
        }else{
          // navigate('/');
          navigate('/PendingUser') 
        }
        
        Storage.setItem("menuitem", JSON.stringify(response.data.responseData)); 
      }else{
        toast.warning(response.data.responseCode)
      }
    } catch (err) {
      console.log(err);
    }
  }; 

  const menuItemlocal = Storage.getItem("menuitem");

  const menucounts = Storage.getItem("menucounter")

  return {
    getMenudata,
    menuItemlocal,
    menucounts
    // menuCount,
  };
};

export default Menubar;