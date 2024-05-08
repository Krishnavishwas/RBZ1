import axios from "axios";
import React, { useEffect, useState } from "react";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { useNavigate } from "react-router-dom";

const Menubar = () => {
  const navigate = useNavigate();
  const UserID = Storage.getItem("userID");
  const [menuCount, setmenuCount] = useState([]);

  const getMenudata = async (roleIDs, LoginToken, UserID) => {
    try {
      const response = await axios.post(APIURL + "Master/GetMenuData", {
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

  // const menusCount = async () => {
  //   await axios
  //     .post(APIURL + "ExportApplication/ExportApplicationCount", {
  //       UserID: UserID,
  //     })
  //     .then((res) => {
  //       if (res.data.responseCode === 200) {
  //         setmenuCount(res.data.responseData);
  //       }
  //     });
  // };

  // useEffect(() => {
  //   menusCount();
  // }, [UserID]);

  const menuItemlocal = Storage.getItem("menuitem");

  return {
    getMenudata,
    menuItemlocal,
    // menuCount,
  };
};

export default Menubar;
