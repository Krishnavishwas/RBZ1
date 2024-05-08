import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../rbz-logo.png";
import AuthUser from "../login/AuthUser";
import { Storage } from "../login/Storagesetting";

const Header = () => {
  // const navigation = useNavigate();

  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");

  const { token, logout } = AuthUser();

  const [isToggled, setIsToggled] = useState(false);

  const userName = Storage.getItem("userName");

  const roleName = Storage.getItem("roleName");

  const handleToggle = () => {
    setIsToggled((prevState) => !prevState);
    if (!isToggled) {
      document.body.classList.add("toggle-sidebar");
    } else {
      document.body.classList.remove("toggle-sidebar");
    }
  };

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
          <li className="nav-item  ">
            <Link className="nav-link nav-icon">
              {" "}
              <span>Welcome {userName?.replace(/"/g, "")}</span>
            </Link>
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
              <li>
                <select className="dropdown-item d-flex align-items-center pa-3">
                  <option>{userName?.replace(/"/g, "")}</option>
                  <option>Bank User</option>
                  <option>Govt User</option>
                </select>
              </li>
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
