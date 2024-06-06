import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../rbz-logo.png";
import axios from "axios";
import { APIURL } from "../constant";
import AuthUser from "../login/AuthUser";
import { Storage } from "../login/Storagesetting";
import Menubar from "./Menubar";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Header = () => {
  const menucounts = Menubar();
  let menuCount = JSON.parse(menucounts?.menucounts);
  const LoginToken = Storage.getItem("loginToken");
  const RoleID = Storage.getItem("roleIDs");
  // const navigation = useNavigate();
  const [userRole, setUserRole] = useState([]);

  const roleName = Storage.getItem("roleName");

  const [userRoleName, setUserRoleName] = useState(roleName || "");

  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  const navigate = useNavigate();

  const { token, logout } = AuthUser();

  const [showEditForm, setshowEditForm] = useState(false);

  const userName = Storage.getItem("userName");
  const UserID = Storage.getItem("userID");
  const RoleId = Storage.getItem("roleIDs");
  const bankId = Storage.getItem("bankID");
  const [startDate, setStartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [chnageload, setchangeload] = useState(false);
  const [actinglist, setactinglist] = useState([]);
  const [reasontext, setreasontext] = useState("");
  const [allactingdata, setallactingdata] = useState([
    {
      actingId: "",
      UserID: "",
      RoleID: "",
      ActingUserID: "",
      ActingRoleID: "",
    },
  ]);
  const [exportuser, setexportuser] = useState([]);
  const [importuser, setimportuser] = useState([]);
  const [fibuser, setfib] = useState([]);
  const [inspecuser, setinspecuser] = useState([]);
  const [actionHistory, setactionHistory] = useState([]);

  const hanldeSetactiondata = (e, index, id) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "users" && value !== "") {
      const { userID, roleID } = JSON.parse(value);

      setallactingdata((prevState) => {
        const updatedList = [...prevState];
        updatedList[index] = {
          ...updatedList[index],
          actingId: id,
          ActingUserID: userID,
          ActingRoleID: roleID,
          UserID: UserID.replace(/"/g, ""),
          RoleID: RoleID,
        };
        return updatedList;
      });
    } else {
      setallactingdata((prevState) => {
        const updatedList = [...prevState];
        const removeIndex = updatedList?.findIndex(
          (item) => item.actingId === id
        );
        if (removeIndex !== -1) {
          updatedList.splice(removeIndex, 1);
        }
        return updatedList.filter((item) => item !== null);
      });
    }
  };

  const finalActiondata = allactingdata
    .filter((v) => v && v.UserID !== "")
    .map((v) => {
      return {
        DepartmentID: v.actingId,
        UserID: v.UserID,
        RoleID: v.RoleID,
        ActingUserID: v.ActingUserID,
        ActingRoleID: v.ActingRoleID,
        RoleStartDate: startDate,
        RoleEndDate: endDate,
        Reason: reasontext || "",
      };
    });

  const handleActionghistor = () => {
    axios
      .post(APIURL + "User/GetActingRoleByUserID", {
        UserID: UserID.replace(/"/g, ""),
      })
      .then((res) => {
        if (res.data.responseCode == "200") {
          setactionHistory(res.data.responseData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleActionghistor();
  }, []);

  const UserRole = async () => {
    await axios
      .post(APIURL + "User/GetRolesByUserID", {
        UserID: UserID?.replace(/"/g, ""),
      })
      .then((res) => {
        setUserRole(res.data.responseData);
      });
  };
  //--------user role api end

  // Role Click Function start

  const handleRole = (e) => {
    setchangeload(true);
    const valuess = e.target.value;
    const selectedIndex = e.target.selectedIndex;
    const selectedOption = e.target.options[selectedIndex];
    const name = selectedOption.getAttribute("name");
    const value = selectedOption.value;
    sessionStorage.removeItem("submenuname");
    Storage.removeItem("roleIDs");
    Storage.removeItem("roleName");
    Storage.setItem("roleIDs", value);
    Storage.setItem("roleName", name);
    Storage.removeItem("menucounter");

    axios
      .post(APIURL + "User/GetMenuList", {
        RoleID: valuess,
        LoginToken: LoginToken,
        UserID: UserID?.replace(/"/g, ""),
      })
      .then((res) => {
        Storage.removeItem("menuitem");
        sessionStorage.setItem("submenuname", "Dashboard");

        if (res.data.responseCode == 200) {
          // setmenuCount(res.data.responseData);
          Storage.setItem("menuitem", JSON.stringify(res.data.responseData));
          const firstMenuItem = res.data.responseData[1];
          sessionStorage.setItem(
            "urlchange",
            firstMenuItem.subMenu.length > 0
              ? firstMenuItem.subMenu[0].subMenuURL
              : "/"
          );
          // alert(ll)
          // seturlchange(ll)
        }
      })
      .catch((error) => {
        console.log(error);
        setchangeload(false);
      });

    axios
      .post(APIURL + "User/MenuCount", {
        UserID: UserID?.replace(/"/g, ""),
        RoleID: valuess,
        BankID: bankId,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          // setmenuCount(res.data.responseData);

          Storage.setItem("menucounter", JSON.stringify(res.data.responseData));
          const menucounter = Storage.getItem("menucounter");
          menuCount = JSON.parse(menucounter);
          const menuurls = sessionStorage.getItem("urlchange");

          setTimeout(() => {
            setchangeload(false);
            window.location.href = `/${menuurls}`;
          }, 4000);
        } else {
          setchangeload(false);
        }
      })
      .catch((errr) => {
        console.log("Menu Count Header", errr);
        setchangeload(false);
      });

    setUserRoleName(name);
  };
  // Role click Function end

  const UserRoleList = () => {
    const roleIDs = RoleId?.replace(/"/g, "");

    axios
      .post(APIURL + "User/GetUsersByRoleID", {
        RoleID: roleIDs - 1,
        DepartmentID: 2,
        UserID: UserID?.replace(/"/g, ""),
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setexportuser(res.data.responseData);
        } else {
          setexportuser([]);
        }
      });

    axios
      .post(APIURL + "User/GetUsersByRoleID", {
        RoleID: roleIDs - 1,
        DepartmentID: 3,
        UserID: UserID?.replace(/"/g, ""),
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setimportuser(res.data.responseData);
        } else {
          setimportuser([]);
        }
      });

    axios
      .post(APIURL + "User/GetUsersByRoleID", {
        RoleID: roleIDs - 1,
        DepartmentID: 4,
        UserID: UserID?.replace(/"/g, ""),
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setfib(res.data.responseData);
        } else {
          setfib([]);
        }
      });

    axios
      .post(APIURL + "User/GetUsersByRoleID", {
        RoleID: roleIDs - 1,
        DepartmentID: 5,
        UserID: UserID?.replace(/"/g, ""),
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setinspecuser(res.data.responseData);
        } else {
          setinspecuser([]);
        }
      });
  };

  const handleActingRoleList = async () => {
    axios
      .post(APIURL + "User/GetDepartmentByUserID", {
        UserID: UserID.replace(/"/g, ""),
        RoleID: RoleId.replace(/"/g, ""),
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setactinglist(res.data.responseData);
        } else {
          setactinglist([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleActingRole = async () => {
    axios
      .post(APIURL + "User/AddActingRole", finalActiondata)
      .then((res) => {
        if (res.data.responseCode == 200) {
          toast.success(res.data.responseMessage);
          EditModalClose();
          setStartDate("");
          setendDate("");
          setallactingdata([
            {
              actingId: "",
              UserID: "",
              RoleID: "",
              ActingUserID: "",
              ActingRoleID: "",
            },
          ]);
          handleActionghistor();
        } else {
          toast.warning(res.data.responseMessage);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleActingRoleList();
    UserRole();
    UserRoleList();
  }, []);

  const EditModalClose = () => {
    setshowEditForm(false);
    setStartDate("");
    setendDate("");
    setallactingdata([
      {
        actingId: "",
        UserID: "",
        RoleID: "",
        ActingUserID: "",
        ActingRoleID: "",
      },
    ]);
  };

  const handleChangeActionStatuschange = (id, statuscode) => {
    axios
      .post(APIURL + "User/UpdateActingRoleStatus", {
        ID: id,
        Status: statuscode == 1 ? "0" : "1",
      })
      .then((res) => {
        handleActionghistor();
        toast.success(res.data.responseMessage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const menucounter = Storage.getItem("menucounter");
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
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="pagetitle">
          <h1>
            <span>{menuname ? menuname : "Home"}</span>{" "}
            {submenuname ? submenuname : "All Dashboard"}{" "}
          </h1>
        </div>

        <div className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item dropdown pe-2 headerUserRoleBox">
              <select
                className="dropdown-item d-flex align-items-center pa-3"
                onChange={(e) => handleRole(e)}
              >
                <option disabled>Select Role</option>
                {userRole?.map((item, index) => {
                  return (
                    <>
                      <option
                        key={index}
                        name={item?.roleName}
                        value={item.roleID}
                        selected={
                          item.roleName == userRoleName?.replace(/"/g, "")
                        }
                      >
                        {item?.roleName}
                      </option>
                    </>
                  );
                })}
              </select>
            </li>

            <li className="nav-item  ">
              <Link className="nav-link nav-icon">
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
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to="/Profile"
                  >
                    Profile
                  </Link>
                </li>
                {RoleId == "7" || RoleId == "8" || RoleId == "9" ? (
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      onClick={handleClickEditModal}
                    >
                      Acting Role
                    </Link>
                  </li>
                ) : (
                  ""
                )}
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    to=""
                  >
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
      {chnageload == true ? (
        <div className="pageloadchange">
          <label className="outerloader">
            {" "}
            <span className="loader"></span>
            <h4>Your role is changing</h4>
            <span className="loaderwait">Please Wait...</span>
          </label>{" "}
        </div>
      ) : (
        ""
      )}

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
                  <Modal.Title>Acting Role</Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel">
              <Modal.Body className="p-0">
                <div className="actingrolebox">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="action_form_new">
                        <label className="actioncontrolform">Date</label>
                        <div className="acting-date">
                          <DatePicker
                            closeOnScroll={(e) => e.target === document}
                            selected={startDate}
                            placeholderText="Start Date"
                            onChange={(date) => {
                              setStartDate(date);
                              setendDate(null);
                            }}
                            peekNextMonth
                            showMonthDropdown
                            minDate={new Date()}
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MMM/yyyy"
                            onKeyDown={(e) => {
                              const key = e.key;
                              const allowedKeys = /[0-9\/]/;
                              if (
                                !allowedKeys.test(key) &&
                                key !== "Backspace" &&
                                key !== "Delete"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            className="date-acting"
                          />
                        </div>
                        <div className="acting-date">
                          <DatePicker
                            closeOnScroll={(e) => e.target === document}
                            selected={endDate}
                            placeholderText="End Date"
                            onChange={(date) => setendDate(date)}
                            peekNextMonth
                            showMonthDropdown
                            minDate={startDate ? startDate : new Date()}
                            showYearDropdown
                            dropdownMode="select"
                            dateFormat="dd/MMM/yyyy"
                            onKeyDown={(e) => {
                              const key = e.key;
                              const allowedKeys = /[0-9\/]/;
                              if (
                                !allowedKeys.test(key) &&
                                key !== "Backspace" &&
                                key !== "Delete"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            className="date-acting"
                            disabled={!startDate}
                          />
                        </div>
                      </div>

                      <table className="table">
                        {actinglist?.length
                          ? actinglist?.map((list, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    style={{
                                      width: "120px",
                                      paddingRight: "10px",
                                    }}
                                  >
                                    <label className="labelacting">
                                      {list.menuName}
                                    </label>
                                  </td>
                                  <td>
                                    <div className="acting_form_new">
                                      <div className="form-bxact">
                                        <label>
                                          <select
                                            name="users"
                                            onChange={(e) => {
                                              hanldeSetactiondata(
                                                e,
                                                index,
                                                list.id
                                              );
                                            }}
                                          >
                                            <option value="">
                                              Select user
                                            </option>
                                            {list.id === 2 &&
                                              exportuser?.map(
                                                (userlist, ind) => (
                                                  <option
                                                    value={JSON.stringify(
                                                      userlist
                                                    )}
                                                    key={ind}
                                                  >
                                                    {userlist.name}
                                                  </option>
                                                )
                                              )}
                                            {list.id === 3 &&
                                              importuser?.map(
                                                (userlist, ind) => (
                                                  <option
                                                    value={JSON.stringify(
                                                      userlist
                                                    )}
                                                    key={ind}
                                                  >
                                                    {userlist.name}
                                                  </option>
                                                )
                                              )}
                                            {list.id === 4 &&
                                              fibuser?.map((userlist, ind) => (
                                                <option
                                                  value={JSON.stringify(
                                                    userlist
                                                  )}
                                                  key={ind}
                                                >
                                                  {userlist.name}
                                                </option>
                                              ))}
                                            {list.id === 5 &&
                                              inspecuser?.map(
                                                (userlist, ind) => (
                                                  <option
                                                    value={JSON.stringify(
                                                      userlist
                                                    )}
                                                    key={ind}
                                                  >
                                                    {userlist.name}
                                                  </option>
                                                )
                                              )}
                                          </select>
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          : ""}
                      </table>

                      <div className="action_form_new">
                        <label class="actioncontrolform">Reason</label>
                        <div className="form-bx-action">
                          <label>
                            <textarea
                              name="Reason"
                              onChange={(e) => setreasontext(e.target.value)}
                              placeholder="Reason"
                            ></textarea>
                            <span className="sspan"></span>
                          </label>
                        </div>
                      </div>

                      <h5 className="heading-actingrole">
                        ACTING ROLE HISTORY
                      </h5>

                      <div className="responsive-table">
                        <table className="table table-custom">
                          <tr>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Reason</th>
                            <th>Department/ User</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                          {actionHistory?.length &&
                            actionHistory?.map((item, index) => {
                              return (
                                <tr>
                                  <td>
                                    {moment(item?.assignedDate).format(
                                      "DD/MMM/YYYY"
                                    )}
                                  </td>
                                  <td>
                                    {moment(item?.roleEndDate).format(
                                      "DD/MMM/YYYY"
                                    )}
                                  </td>
                                  <td>
                                    <span className="department-reason">
                                      {item?.reason}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="department-user">
                                      {item?.departmentName} / {item.userName}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        item.statusName == "Active"
                                          ? "green-text"
                                          : "red-text"
                                      }
                                    >
                                      {item.statusName}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className={
                                        item.statusName == "Active"
                                          ? "activebtn-text"
                                          : "inactivebtn-text"
                                      }
                                      onClick={(e) =>
                                        handleChangeActionStatuschange(
                                          item.id,
                                          item.status
                                        )
                                      }
                                    >
                                      {item.statusName == "Active" ? (
                                        <i class="bi bi-toggle2-on"></i>
                                      ) : (
                                        <i class="bi bi-toggle2-off"></i>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-footer mt-5 mb-3 flex-row-reverse">
                  <div>
                    <button
                      type="button"
                      className="login"
                      onClick={handleActingRole}
                      disabled={
                        allactingdata.length == 0 ||
                        !allactingdata.length ||
                        !startDate ||
                        !endDate
                          ? true
                          : false
                      }
                    >
                      Submit{" "}
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;
