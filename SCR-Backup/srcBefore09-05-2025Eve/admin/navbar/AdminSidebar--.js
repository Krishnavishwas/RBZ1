import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APIURL } from "../../constant";
import { Storage } from "../../login/Storagesetting";
import Menubar from "../../admin/navbar/AdminMenubar";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const menuItemlocal = Menubar();
  const [isToggled, setIsToggled] = useState(false);
  const menuItem = JSON.parse(menuItemlocal.menuItemlocal); 

  // const getMenudata = async ()=>{

  //   try{
  //     const response = await axios.post(APIURL + 'Master/GetMenuData',{
  //       RoleID:roleIDs.toString(),
  //       LoginToken:LoginToken,
  //       UserID:UserID
  //     });

  //     if(response.data.responseCode === '200'){
  //       console.log("response.data.responseData", response.data.responseData)
  //       setmenuItem(response.data.responseData)
  //     }else{
  //       setmenuItem([])
  //     }

  //   }
  //   catch(err){
  //     console.log(err)
  //   }
  // }

  const currentUrl = window.location.href;
  const urlParts = currentUrl.split("/");
  const lastUrlPart = urlParts[urlParts.length - 1];
  
  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
    if (!isToggled) {
      document.body.classList.add("toggle-sidebar");
    } else {
      document.body.classList.remove("toggle-sidebar");
    }
  };

  return (
    <aside id="sidebar" className="sidebar">
      {/* <h6 className="quicklaunch">
        <span>QUICK LAUNCH</span>
      </h6> */}

<ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item activemenu align-end">
          {/* <Link className="nav-link" to="/BankADLADashboard">
            <i className="bi bi-house-fill"></i>
            <span>Home</span>
          </Link> */}
          {isToggled === false ? <i className="bi bi-chevron-double-left toggle-sidebar-btn" onClick={handleToggle}></i> : <i className="bi bi-chevron-double-right toggle-sidebar-btn" onClick={handleToggle}></i> }
        </li>

         {menuItem?.map((items, index) => {
          return (
            <>
              <li className="nav-item" key={index} title={items.menuName}> 

                <Link className="nav-link ">
                  <i className="bi bi-arrow-up-right-square-fill"></i>
                  <span>{items.menuName}</span>
                </Link>
                <ul className="nav-content  ">
                  {items?.subMenu?.map((submenuitem, subindex) => {
                    return (
                      <li
                        key={subindex}
                        className={
                          lastUrlPart == submenuitem.subMenuURL
                            ? "activemenu"
                            : ""
                        }
                        title={submenuitem.subMenuName}
                      >
                        <Link to={"/" + submenuitem.subMenuURL}>
                          <i className={"bi " + submenuitem.subMenuIcon}></i>
                          <span>{submenuitem.subMenuName}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </>
          );
        })}  
      </ul>

      {/* <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item activemenu" title="Home">
          <Link className="nav-link" to="/">
            <i className="bi bi-house-fill"></i>
            <span>Home</span>
          </Link>
        </li>
       
        <li className="nav-item" title="Admin - User Management">
          <Link className="nav-link " to="/">
            <i className="bi bi-arrow-up-right-square-fill"></i>
            <span>Admin - User Management</span>
          </Link>
          <ul className="nav-content  ">
            <li className="" title="Pending Users">
              <Link to="/BankADLADashboard">
                <i className="bi bi-speedometer"></i>
                <span>Pending Users</span>
              </Link>
            </li>
            <li className="" title="Approved Users">
              <Link to="/ExportNewRequest">
                <i className="bi bi-journal-plus"></i>
                <span>Approved Users</span>
              </Link>
            </li>               
          </ul>
        </li>
        <li className="nav-item" title="Admin - List Management">
          <Link className="nav-link " to="/BankADLADashboard">
            <i className="bi bi-arrow-up-right-square-fill"></i>
            <span>Admin - List Management</span>
          </Link>
          <ul className="nav-content  ">
          <li className="activemenu" title="Application Type">
              <Link to="/ApplicationType">
                <i className="bi bi-speedometer"></i>
                <span>Application Type</span>
              </Link>
            </li> 
            <li className="" title="Bank Master">
              <Link to="/BankADLADashboard">
                <i className="bi bi-speedometer"></i>
                <span>Bank Master</span>
              </Link>
            </li>
            <li className="" title="Company Master">
              <Link to="/ExportNewRequest">
                <i className="bi bi-journal-plus"></i>
                <span>Company Master</span>
              </Link>
            </li>
            <li className="" title="Currency Master">
              <Link to="/ExportSubmittedRequests">
                <i className="bi bi-journal-check"></i>
                <span>Currency Master</span>
              </Link>
            </li>
            <li className="" title="Pending Requests">
              <Link to="/ExportPendingRequests">
                <i className="bi bi-journal-bookmark-fill"></i>
                <span>Pending Requests</span>
              </Link>
            </li>
            <li className="" title="Sector Master">
              <Link to="/ExportApprovedRequests">
                <i className="bi bi-check2-all"></i>
                <span>Sector Master</span>
              </Link>
            </li>
            <li className="" title="SubSector List">
              <Link to="/ExportRejectedRequests">
                <i className="bi bi-journal-x"></i>
                <span>SubSector List</span>
              </Link>
            </li>
            <li className="" title="Government Agencies Master">
              <Link to="/ExportDeferredRequests">
                <i className="bi bi-x-lg"></i>
                <span>Government Agencies Master</span>
              </Link>
            </li>
            <li className="" title="Country Master">
              <Link to="/ExportCancelledRequests">
                <i className="bi bi-x-circle"></i>
                <span>Country Master</span>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item" title="Admin - List Management">
          <Link className="nav-link " to="/BankADLADashboard">
            <i className="bi bi-arrow-up-right-square-fill"></i>
            <span>Admin - impersonation</span>
          </Link>
          <ul className="nav-content  ">
            <li className="" title="Impersonate">
              <Link to="/BankADLADashboard">
                <i className="bi bi-speedometer"></i>
                <span>Impersonate</span>
              </Link>
            </li>            
          </ul>
        </li>
      </ul> */}
    </aside>
  );
};

export default AdminSidebar;
