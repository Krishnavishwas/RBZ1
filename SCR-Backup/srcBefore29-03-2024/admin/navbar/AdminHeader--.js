import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../rgz-logo.png"; 
import AuthUser from "../../login/AuthUser";

const AdminHeader = () => {
  // const navigation = useNavigate();

  const { token, logout } = AuthUser();

  const [isToggled, setIsToggled] = useState(false);

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
      <div className="d-flex align-items-center justify-content-between">
        <Link to="/dashboard" className="logo d-flex align-items-center">
          <img src={logo} alt="" />
          <span>Document Management System</span>
        </Link>

        {/* <i className="bi bi-list toggle-sidebar-btn" onClick={handleToggle}></i> */}
      </div>

      <div className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          <li className="nav-item dropdown">
            <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
              <i className="bi bi-bell"></i>
              <span className="badge bg-primary badge-number">4</span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
              <li className="dropdown-header">
                You have 4 new notifications
                <a href="#">
                  <span className="badge rounded-pill bg-primary p-2 ms-2">
                    View all
                  </span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li className="notification-item">
                <div>
                  <h4>Lorem Ipsum</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>30 min. ago</p>
                </div>
              </li>

              <li className="notification-item">
                <div>
                  <h4>Atque rerum nesciunt</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>1 hr. ago</p>
                </div>
              </li>

              <li className="notification-item">
                <div>
                  <h4>Sit rerum fuga</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>2 hrs. ago</p>
                </div>
              </li>

              <li className="notification-item">
                <div>
                  <h4>Dicta reprehenderit</h4>
                  <p>Quae dolorem earum veritatis oditseno</p>
                  <p>4 hrs. ago</p>
                </div>
              </li>

              <li className="dropdown-footer">
                <a href="#">Show all notifications</a>
              </li>
            </ul>
          </li>

          <li className="nav-item  dropdown pe-3">
            <span className="nav-link nav-profile d-flex align-items-center pe-0">
              <span className="d-none d-md-block  ps-2">
                Welcome bankuser7{" "}
              </span>
              {/* <div className="form-check form-switch px-4">
                      <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                      <label className="form-check-label" for="flexSwitchCheckDefault">Switch User</label>
                    </div> */}
            </span>
          </li>
          <li className="nav-item  ">
            <Link
              className="nav-link nav-profile d-flex align-items-center pe-0"
              to=""
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item  ">
            <Link
              className="nav-link nav-profile d-flex align-items-center pe-0"
              to=""
            >
              Change Password
            </Link>
          </li>
          <li className="nav-item  ">
            <Link
              className="nav-link nav-profile d-flex align-items-center pe-0"
              to="/"
            >
              User Settings
            </Link>
          </li>
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

export default AdminHeader;
