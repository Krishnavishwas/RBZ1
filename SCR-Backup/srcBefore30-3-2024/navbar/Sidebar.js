import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import logo from "../rbz-logo.png";
import Menubar from "./Menubar";

const Sidebar = () => {
  const navigate = useNavigate();
  const menuItemlocal = Menubar();
  const [isToggled, setIsToggled] = useState(false);
  const menuItem = JSON.parse(menuItemlocal?.menuItemlocal);

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

  const saveheadername = (id, name) => {
    sessionStorage.setItem("menuname", id);
    sessionStorage.setItem("submenuname", name);
  };

  useEffect(() => {
    const MenuLoadAuto = () => {
      const x = 100;
      const y = 100;
      const event = new MouseEvent("mousemove", {
        clientX: x,
        clientY: y,
      });
      document.dispatchEvent(event);
    };
    const timer = setTimeout(MenuLoadAuto, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside id="sidebar" className="sidebar">
      <div className="d-flex align-items-center justify-content-between sidebar-header">
        <Link to="/dashboard" className="logo d-flex align-items-center">
          <img src={logo} alt="" />
          <span className="no-collap">Document Management System</span>
          <b className="collap">DMS</b>
        </Link>

        {isToggled === false ? (
          <div
            className="toggle-sidebar-btn"
            onClick={() => {
              handleToggle();
            }}
          >
            <i className="bi bi-rewind-fill "></i>{" "}
          </div>
        ) : (
          <div
            className="toggle-sidebar-btn"
            onClick={() => {
              handleToggle();
            }}
          >
            <i className="bi bi-fast-forward-fill"></i>
          </div>
        )}
      </div>

      <ul className="sidebar-nav" id="sidebar-nav">
        {/* <li className="nav-item activemenu align-end"> 
          {isToggled === false ? <i className="bi bi-chevron-double-left toggle-sidebar-btn" onClick={handleToggle}></i> : <i className="bi bi-chevron-double-right toggle-sidebar-btn" onClick={handleToggle}></i> }
        </li> */}

        {menuItem?.map((items, index) => {
          return (
            <li className="nav-item" key={index}>
              <Link className="nav-link" title={items.menuName}>
                <i className="bi bi-arrow-up-right-square-fill"></i>
                <span>{items.menuName}</span>
              </Link>
              <ul className="nav-content">
                {console.log("items?.subMenu - ", items?.subMenu)}
                {items?.subMenu?.map((submenuitem, subindex) => {
                  return (
                    <li
                      key={subindex}
                      className={
                        lastUrlPart === submenuitem.subMenuURL
                          ? "activemenu"
                          : ""
                      }
                    >
                      <Link
                        to={"/" + submenuitem.subMenuURL}
                        title={submenuitem.subMenuName}
                        onClick={() =>
                          saveheadername(
                            items.menuName,
                            submenuitem.subMenuName
                          )
                        }
                      >
                        <i className={"bi " + submenuitem.subMenuIcon}></i>
                        <span>{submenuitem.subMenuName}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
