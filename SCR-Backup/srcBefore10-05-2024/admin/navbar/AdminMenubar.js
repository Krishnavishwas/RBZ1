import axios from "axios";
import React, { useEffect, useState } from "react";
import { APIURL } from "../../constant";
import { Storage } from "../../login/Storagesetting";
import { useNavigate } from "react-router-dom";

const AdminMenubar = () => {
  const navigate = useNavigate();

  //   const roleIDs = Storage.getItem('roleIDs');
  //   const LoginToken = Storage.getItem('loginToken');
  //   const UserID =  Storage.getItem('userID');

  const getMenudata = async (roleIDs, LoginToken, UserID) => {
    try {
      const response = await axios.post(APIURL + "Master/GetMenuData", {
        RoleID: roleIDs,
        LoginToken: LoginToken,
        UserID: UserID,
      });

      if (response.data.responseCode === "200") {
        // console.log("response.data.responseData--ooo00", response.data.responseData)
        // setmenuItems(JSON.stringify(response.data.responseData))
        Storage.setItem("menuitem", JSON.stringify(response.data.responseData));

        //    setmenuItems(JSON.parse(lauda))
      } else {
        // setmenuItem([])
      }
    } catch (err) {
      console.log(err);
    }
  };

  const menuItemlocal = Storage.getItem("menuitem");

  return {
    getMenudata,
    menuItemlocal,
  };
};

export default AdminMenubar;
