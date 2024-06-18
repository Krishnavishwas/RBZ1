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
  const getmenuindex = sessionStorage.getItem("menuindex");
  const [menuindex, setmenuindex] = useState(getmenuindex ? getmenuindex : "0");
  const menuItem = JSON.parse(menuItemlocal?.menuItemlocal);
  let menuCount = JSON.parse(menucounts?.menucounts);
  const UserID = Storage.getItem("userID");
  const RoleId = Storage.getItem("roleIDs");
  const bankId = Storage.getItem("bankID");
  const submenuname = Storage.getItem("submenuname");
  const menuname = Storage.getItem("menuname");
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
      .post(APIURL + "User/MenuCount", {
        UserID: UserID?.replace(/"/g, ""),
        RoleID: RoleId,
        BankID: bankId,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          // setmenuCount(res.data.responseData);
          Storage.removeItem("menucounter");

          Storage.setItem("menucounter", JSON.stringify(res.data.responseData));
          const menucounter = Storage.getItem("menucounter");
          menuCount = JSON.parse(menucounter);
        }
      });
  };

  setTimeout(() => {
    const menucounter = Storage.getItem("menucounter");
    menuCount = JSON.parse(menucounter);
    menusCountHanlde();
  }, 2000);

  useEffect(() => {
    const menucounter = Storage.getItem("menucounter");
    menuCount = JSON.parse(menucounter);
    menusCountHanlde();
  }, [2000, menuItem]);

  const saveheadername = (id, name) => {
    console.log("id, name - ", id, name);
    sessionStorage.setItem("menuname", id);
    sessionStorage.setItem("submenuname", name);
  };

  const menuindexHanlde = (index) => {
    sessionStorage.setItem("menuindex", index);
  };

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
              {items.menuName === "Home" ? (
                <Link
                  className="nav-link"
                  data-bs-target={"#menu" + items.id}
                  to={"/" + items.menuURL}
                  title={items.menuName}
                  onClick={() =>
                    saveheadername(items.menuName, "All Dashboard")
                  }
                >
                  <i
                    className="bi bi-arrow-up-right-square-fill"
                    style={{ color: "#fff" }}
                  ></i>
                  <span>{items.menuName}</span>{" "}
                </Link>
              ) : (
                <Link
                  className="nav-link collapsed"
                  data-bs-target={"#menu" + items.id}
                  data-bs-toggle="collapse"
                  to="#"
                  title={items.menuName}
                  style={{
                    background: "#42a5f5",
                    color: "#fff",
                    margin: "1px 0px",
                  }}
                  onClick={() => menuindexHanlde(index)}
                >
                  <i
                    className="bi bi-arrow-up-right-square-fill"
                    style={{ color: "#fff" }}
                  ></i>
                  <span>{items.menuName}</span>{" "}
                  <i
                    className="bi bi-chevron-down ms-auto"
                    style={{ color: "#fff" }}
                  ></i>
                </Link>
              )}

              <ul
                id={"menu" + items.id}
                className={
                  menuindex == index && lastUrlPart !== "AllDashboard"
                    ? "nav-content collapse show "
                    : "nav-content collapse"
                }
                name={index}
                data-bs-parent="#sidebar-nav"
              >
                {items?.subMenu?.map((submenuitem, subindex) => {
                  return (
                    <li
                      key={subindex}
                      className={
                        lastUrlPart === submenuitem.subMenuURL &&
                        items.menuName === menuname
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
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className="flex-menu">
                          <i className={"bi " + submenuitem.subMenuIcon}></i>{" "}
                          <p className="sm-hide">{submenuitem.subMenuName}</p>
                        </div>

                        {menuCount?.map((count) => {
                          if (submenuitem.id == count.id) {
                            return (
                              <>
                                {submenuitem?.subMenuName === "New Request" ? (
                                  ""
                                ) : (
                                  <span className="badge bg-secondary text-end me-2 m-count">
                                    {count.count}
                                  </span>
                                )}
                              </>
                            );
                          }
                        })}
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
