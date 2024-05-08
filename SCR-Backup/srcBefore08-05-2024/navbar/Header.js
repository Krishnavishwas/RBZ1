import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../rbz-logo.png";
import axios from "axios";
import { APIURL } from "../constant";
import AuthUser from "../login/AuthUser";
import { Storage } from "../login/Storagesetting";
import Menubar from "./Menubar";
import Modal from "react-bootstrap/Modal";

const Header = () => {
  const menucounts = Menubar(); 
  let menuCount = JSON.parse(menucounts?.menucounts);
  const LoginToken = Storage.getItem("loginToken")
  // const navigation = useNavigate();
  const [userRole, setUserRole] = useState([]);
  const userId = Storage.getItem("userID"); 
  
  const roleName = Storage.getItem("roleName");
  
  const [userRoleName, setUserRoleName] = useState(roleName || "");
  
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  const navigate = useNavigate();

  const { token, logout } = AuthUser();

  const [showEditForm, setshowEditForm] = useState(false);

  const userName = Storage.getItem("userName");
  const UserID = Storage.getItem("userID");
  const RoleId =  Storage.getItem("roleIDs")
  const bankId =  Storage.getItem("bankID")

  const [chnageload, setchangeload] = useState(false)

  // const handleToggle = () => {
  //   setIsToggled((prevState) => !prevState);
  //   if (!isToggled) {
  //     document.body.classList.add("toggle-sidebar");
  //   } else {
  //     document.body.classList.remove("toggle-sidebar");
  //   }
  // };

  const UserRole = async () => {
    await axios.post(APIURL + 'User/GetRolesByUserID', { "UserID": userId?.replace(/"/g, "") }).then((res) => {
      // console.log("res----------SHREYA", res.data.responseData);
      setUserRole(res.data.responseData);
    })
  }
  //--------user role api end

  // Role Click Function start

  const handleRole =(e) =>{
    setchangeload(true);
    const valuess = e.target.value;
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedIndex];
    const name = selectedOption.getAttribute("name");
    const value = selectedOption.value; 
    sessionStorage.removeItem("submenuname")
    Storage.removeItem("roleIDs");
    Storage.removeItem("roleName");
    Storage.setItem("roleIDs",value);
    Storage.setItem("roleName",name);
    Storage.removeItem("menucounter") 

    axios
    .post(APIURL + "User/GetMenuList", {
      RoleID: valuess,
      LoginToken: LoginToken,
      UserID: UserID?.replace(/"/g, ""),
    })
    .then((res) => {  
      Storage.removeItem("menuitem")
      sessionStorage.setItem("submenuname", 'Dashboard')

      if (res.data.responseCode == 200) {  
        console.log("count--list",res) 
        // setmenuCount(res.data.responseData);  
        Storage.setItem("menuitem", JSON.stringify(res.data.responseData))  
        const firstMenuItem = res.data.responseData[1];
        sessionStorage.setItem("urlchange",firstMenuItem.subMenu.length > 0 ? firstMenuItem.subMenu[0].subMenuURL : '/')
        // alert(ll)
        // seturlchange(ll)
        
      }

    })
    .catch((error)=>{
      console.log(error)
      setchangeload(false);
    }); 

      axios
    .post(APIURL + "ExportApplication/ExportApplicationCount", {
      UserID: UserID?.replace(/"/g, ""),
      RoleID:valuess,
      BankID:bankId
    })
    .then((res) => { 
      if (res.data.responseCode == 200) { 
        console.log("count",res) 
        // setmenuCount(res.data.responseData); 
        
        Storage.setItem("menucounter", JSON.stringify(res.data.responseData)) 
        const menucounter = Storage.getItem("menucounter")
        menuCount = JSON.parse(menucounter); 
       const menuurls = sessionStorage.getItem("urlchange") 
        
       setTimeout(() => {
        setchangeload(false);
        window.location.href = `/${menuurls}`;

       }, 4000);
      }
      else{
        setchangeload(false);
      } 
    })
    .catch((errr)=>{
      console.log("Menu Count Header", errr)
      setchangeload(false);
    })
    ; 

    
     

    setUserRoleName(name) 
  }
  // Role click Function end
  useEffect(() => {
    UserRole();
  }, []);

 
  const EditModalClose = () => {
    setshowEditForm(false);  
  };

  useEffect(() => { 
    

    const menucounter = Storage.getItem("menucounter")
    menuCount = JSON.parse(menucounter);    
  }, [menuCount]);


  const logoutUser = () => {
    if (token != undefined) {
      logout();
    }
  };

  const handleClickEditModal = () => {
    setshowEditForm(true);
  };

  return (
    <>
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
                  <option key={index} name={item?.roleName} value={item.roleID} selected={item.roleName == userRoleName?.replace(/"/g,"")}>{item?.roleName}</option>
                 
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
              {
                RoleId == "7" || RoleId == "8" || RoleId == "9" ?  <li>
                <Link
                  className="dropdown-item d-flex align-items-center"
                  onClick={handleClickEditModal}
                >
                  Acting Role
                </Link>
              </li>
              :""
              }
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
    {
      chnageload == true ? <div className="pageloadchange"><label className="outerloader">
      {" "}
      <span className="loader"></span> 
          <h4>Your role is changing</h4>
          <span className="loaderwait">Please Wait...</span>
    </label> </div>: ""
    }



<Modal
            show={showEditForm}
            onHide={EditModalClose}
            backdrop="static"
            className="max-width-300"
          >
            <div className="application-box">
              <div className="login_inner">
                <div className="login_form ">
                  <h5>
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title>
                        Acting Role  
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                
                <div className="actingrolebox">
          <h4>Welcome To Acting Role Principal Analyst</h4>



    <div className="row">
      <div className="col-md-12">

    <table className="table">
      <thead className="thead-light">
      <tr>
        <th>Department</th>
        <th>Role Start Date</th>
        <th>Role End Date</th>
        <th>User</th>
      </tr>
      </thead>
      
      <tr>
        <td> <label className="labelacting">Export</label></td>
        <td>
            
        <div className="acting_form_new">
        <div class="form-bxact"><label> <input type="date" /></label></div>
        </div>
        </td>
        <td>
           
          <div className="acting_form_new">
        <div class="form-bxact"><label> <input type="date" /></label></div>
        </div>
        </td>
        <td>
          <div className="acting_form_new">
        <div class="form-bxact"><label> <select><option value="">
                            Select Government Agencies Name
                          </option></select></label></div>
        </div>
        </td>
      </tr>

      <tr>
        <td> <label className="labelacting">Import</label></td>
        <td>
            
        <div className="acting_form_new">
        <div class="form-bxact"><label> <input type="date" /></label></div>
        </div>
        </td>
        <td>
           
          <div className="acting_form_new">
        <div class="form-bxact"><label> <input type="date" /></label></div>
        </div>
        </td>
        <td>
          <div className="acting_form_new">
        <div class="form-bxact"><label> <select><option value="">
                            Select Government Agencies Name
                          </option></select></label></div>
        </div>
        </td>
      </tr>
      <tr>
        <td> <label className="labelacting">FIB</label></td>
        <td>
            
        <div className="acting_form_new">
        <div class="form-bxact"><label> <input type="date" /></label></div>
        </div>
        </td>
        <td>
           
          <div className="acting_form_new">
        <div class="form-bxact"><label> <input type="date" /></label></div>
        </div>
        </td>
        <td>
          <div className="acting_form_new">
        <div class="form-bxact"><label> <select><option value="">
                            Select Government Agencies Name
                          </option></select></label></div>
        </div>
        </td>
      </tr>
    </table>
 
      </div>
    </div>
                </div>
                

                <div className="form-footer mt-5 mb-3"><div><button type="button" className="login">Submit </button></div></div>

                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>

    </>
  );
};

export default Header;
