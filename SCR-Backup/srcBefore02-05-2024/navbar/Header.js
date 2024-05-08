import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../rbz-logo.png";
import axios from "axios";
import { APIURL } from "../constant";
import AuthUser from "../login/AuthUser";
import { Storage } from "../login/Storagesetting";

const Header = () => {
  // const navigation = useNavigate();
  const [userRole, setUserRole] = useState([]);
  const userId = Storage.getItem("userID"); 
  
  const roleName = Storage.getItem("roleName");
  
  const [userRoleName, setUserRoleName] = useState(roleName || "");
  
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");


  const { token, logout } = AuthUser();

  const [isToggled, setIsToggled] = useState(false);

  const userName = Storage.getItem("userName");


  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
    if (!isToggled) {
      document.body.classList.add("toggle-sidebar");
    } else {
      document.body.classList.remove("toggle-sidebar");
    }
  };

  const UserRole = async () => {
    await axios.post(APIURL + 'User/GetRolesByUserID', { "UserID": userId.replace(/"/g, "") }).then((res) => {
      // console.log("res----------SHREYA", res.data.responseData);
      setUserRole(res.data.responseData);
    })
  }
  //--------user role api end

  // Role Click Function start

  const handleRole =(e) =>{
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedIndex];
    const name = selectedOption.getAttribute("name");
    const value = selectedOption.value;
   
    Storage.removeItem("roleIDs");
    Storage.removeItem("roleName");
    Storage.setItem("roleIDs",value);
    Storage.setItem("roleName",name);
    window.location.reload();
    setUserRoleName(name)
  
  }
  // Role click Function end
  useEffect(() => {
    UserRole();
  }, []);


  const logoutUser = () => {
    if (token != undefined) {
      logout();
    }
  };

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      {/* <div className="d-flex align-items-center justify-content-between">
        <Link to="/dashboard" className="logo d-flex align-items-center">
          <img src={logo} alt="" />
          <span>Document Management System</span>
        </Link>

        <i className="bi bi-list toggle-sidebar-btn" onClick={handleToggle}></i>
      </div> */}

      <div className="pagetitle">
        <h1>
          <span>{menuname ? menuname : "Exports"}</span>{" "}
          {submenuname ? submenuname : "Dashboard"}{" "}
        </h1>
      </div>

      <div className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
        <li className="nav-item dropdown pe-2 headerUserRoleBox">
            
            <select className="dropdown-item d-flex align-items-center pa-3" onChange={(e) => handleRole(e)} >
              <option disabled>Select Role</option>
              {userRole?.map((item,index) => {  
                return (
                  <>
                  <>
                  <option key={index} name={item?.roleName} value={item.roleID} selected={item.roleName == userRoleName}>{item?.roleName}</option>
                 
                </>
                  </>
                )
              })}

            </select>
         

      </li>

        <li className="nav-item  ">
      <Link className="nav-link nav-icon" > <span>Welcome {userName?.replace(/"/g, "")}</span></Link> 
          </li>
 
          <li className="nav-item dropdown pe-2">
            <a
              className="nav-link nav-profile d-flex align-items-center pe-0"
              href="#"
              data-bs-toggle="dropdown"
            >
              <span className="d-none d-md-block dropdown-toggle ps-2">
                 Profile
              </span>
             
            </a> 

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              {/* <li className="dropdown-header">
                <h6>{userName?.replace(/"/g, "")} </h6>
                <span>({roleName?.replace(/"/g, "")})</span>
              </li> */}
                {/* <li>
                <select className="dropdown-item d-flex align-items-center pa-3">
                <option>{userName?.replace(/"/g, "")}</option>
                <option>Bank User</option>
                <option>Govt User</option> 
                </select>
              </li> */}
              <li>
                <Link
                  className="dropdown-item d-flex align-items-center"
                  to="/Profile"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item d-flex align-items-center" to="">
                  Change Password
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item d-flex align-items-center"
                  to="/"
                >
                  User Settings
                </Link>
              </li> 


            </ul>
          </li>


          {/* <li className="nav-item  dropdown pe-3">
            <span className="nav-link nav-profile d-flex align-items-center pe-0">
              <span className="d-none d-md-block  ps-2">
                {userName?.replace(/"/g, "")}{" "}
              </span>
              <div className="form-check form-switch px-4">
                      <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                      <label className="form-check-label" for="flexSwitchCheckDefault">Switch User</label>
                    </div>
            </span>
          </li> */}
          {/* <li className="nav-item  ">
            <Link
              className="nav-link nav-profile d-flex align-items-center pe-0"
              to=""
            >
              Dashboard
            </Link>
          </li>
          */}
          <li className="nav-item  ">
            <button
              className="nav-link nav-profile d-flex align-items-center pe-0"
              type="button"
              onClick={logoutUser}
            >
              Logout
            </button>
          </li>

          
        </ul>
      </div>
    </header>
  );
};

export default Header;
