import axios from "axios";
import React, { useEffect, useState } from "react";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { useNavigate } from "react-router-dom";

const Menubar = () => {
  const navigate = useNavigate(); 
 

  const getMenudata = async (roleIDs, LoginToken, UserID, bankID) => {

    await axios
    .post(APIURL + "ExportApplication/ExportApplicationCount", {
      UserID: UserID?.replace(/"/g, ""),
      RoleID:roleIDs,
      BankID:bankID
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
      if (response.data.responseCode === "200") {
        Storage.setItem("menuitem", JSON.stringify(response.data.responseData)); 
      }
    } catch (err) {
      console.log(err);
    }
  }; 

  // const getMenudatacount = async (roleIDs, UserID, bankID) => {
  //   await axios
  //     .post(APIURL + "ExportApplication/ExportApplicationCount", {
  //       UserID: UserID,
  //       RoleID:roleIDs,
  //       BankID:bankID
  //     })
  //     .then((res) => {
  //       if (res.data.responseCode == 200) {
  //         console.log("count",res) 
  //         // setmenuCount(res.data.responseData);
  //         Storage.removeItem("menucounter")
          
  //         Storage.setItem("menucounter", JSON.stringify(res.data.responseData)) 
          
           
  //       }
  //     });
  // };

  const menuItemlocal = Storage.getItem("menuitem");

  const menucounts = Storage.getItem("menucounter")


  return {
    getMenudata,
    // getMenudatacount,
    menuItemlocal,
    menucounts 
  };
};

export default Menubar;
