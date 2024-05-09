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
  const menucounts = Menubar();
  const [isToggled, setIsToggled] = useState(false);
  // const [menuCount, setmenuCount] = useState(JSON.parse(menucounts?.menucounts));
  const menuItem = JSON.parse(menuItemlocal?.menuItemlocal);
  let menuCount = JSON.parse(menucounts?.menucounts);
  const UserID = Storage.getItem("userID");
  const RoleId =  Storage.getItem("roleIDs")
  const bankId =  Storage.getItem("bankID")
  const submenuname = Storage.getItem("submenuname")
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

  const menusCountHanlde = async () => { 
    await axios
      .post(APIURL + "ExportApplication/ExportApplicationCount", {
        UserID: UserID?.replace(/"/g, ""),
        RoleID:RoleId,
        BankID:bankId
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          console.log("count",res) 
          // setmenuCount(res.data.responseData);
          Storage.removeItem("menucounter")
          
          Storage.setItem("menucounter", JSON.stringify(res.data.responseData)) 
          const menucounter = Storage.getItem("menucounter")
          menuCount = JSON.parse(menucounter);
        }
      });
  };

  setTimeout(()=>{
    const menucounter = Storage.getItem("menucounter")
    menuCount = JSON.parse(menucounter); 
    menusCountHanlde()  
  }, 2000)

  useEffect(() => { 
    const menucounter = Storage.getItem("menucounter")
    menuCount = JSON.parse(menucounter); 
    menusCountHanlde()  
  }, [2000]);

  const saveheadername = (id, name) => {
    sessionStorage.setItem("menuname", id);
    sessionStorage.setItem("submenuname", name);
  };

  console.log("menuCount", menuCount)
  console.log("menucounts--json", menucounts)

console.log("menuItemlocal", menuItemlocal)
console.log("menuItem", menuItem)

  





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

    const timer = setTimeout(MenuLoadAuto, 1000);

    return () => clearTimeout(timer);

  }, [menuCount, menuItem]);

  return (
    <aside id="sidebar" className="sidebar">
      {/* <h6 className="quicklaunch">
        <span>QUICK LAUNCH</span>
      </h6> */}

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
        {menuItem?.map((items, index) => {
          return (
            <li className="nav-item" key={index}>
              {" "}
              {/* Assign key to the list item */}
              <Link className="nav-link" title={items.menuName}>
                <i className="bi bi-arrow-up-right-square-fill"></i>
                <span>{items.menuName}</span>
              </Link>
              <ul className="nav-content">
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
                            style={{justifyContent:"space-between"}}
                          >
                            
                            <div className="flex-menu"><i className={"bi " + submenuitem.subMenuIcon}></i> <p className="sm-hide">{submenuitem.subMenuName}</p></div>
                            
                           { menuCount?.map((count) => {
                    if (submenuitem.id == count.id) {
                      return(
                        <>
                            {submenuitem?.subMenuName === "New Request" ? (
                              ""
                            ) : (
                              <span class="badge bg-secondary text-end me-2 m-count">
                                {count.count}
                              </span>
                            )}
                            </>
                            )
                          }
                        })
                      }
                            
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
