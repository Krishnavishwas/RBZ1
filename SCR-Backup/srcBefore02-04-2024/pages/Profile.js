import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import DashboardLayout from "../components/DashboardLayout";
import { Helmet } from "react-helmet";
import moment from "moment-timezone";
import axios from "axios";
import { APIURL } from "../constant";

const Home = () => {
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  const UserID = sessionStorage.getItem("userID");

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [mailNotification, setMailNotification] = useState("");
  const [outOffice, setOutOffice] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [reason, setReason] = useState(
    userData?.reason ? userData?.reason : ""
  );
  const [fullName, setFullName] = useState(
    userData?.name ? userData?.name : ""
  );

  const changeHandelForm = (e) => {
    const { name, value } = e.target;
    if (name === "outOfOffice") {
      setOutOffice(value);
    }
    if (name === "outOfOffice" && value === "0") {
      setReason("");
      setOutTime("");
      setInTime("");
    }
    if (name === "MailNotification") {
      setMailNotification(value);
    }
    if (name === "reason") {
      setReason(value);
    }
    if (name === "fullname") {
      setFullName(value);
    }
  };

  const getProfileData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(APIURL + "User/GetUserDetailsByUserID", {
        UserID: UserID.replace(/"/g, ""),
      });
      if (res.data.responseCode === "200") {
        setLoading(false);
        setUserData(res.data.responseData);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error -", err);
    }
  };

  useEffect(() => {
    getProfileData();
  }, [refreshData]);

  const updateProfile = async (e) => {
    try {
      const res = await axios.post(APIURL + "User/UpdateUserData", {
        Name: fullName ? fullName : userData.name,
        UserID: UserID.replace(/"/g, ""),
        isOutOfOffice: outOffice ? outOffice : userData.isOutOfOffice,
        IsReceiveEmail: mailNotification
          ? mailNotification
          : userData.isReceiveEmail,
        FromDate: inTime
          ? inTime
          : outOffice === "0"
          ? ""
          : userData.fromDate,
        ToDate: outTime
          ? outTime
          : outOffice === "0"
          ? ""
          : userData.toDate,
        Reason: reason ? reason : outOffice === "0" ? "" : userData.reason,
      });
      if (res.data.responseCode === "200") {
        getProfileData();
      }
    } catch (err) {
      console.log("Error -", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {menuname ? menuname : "Export"}{" "}
          {submenuname ? submenuname : "Dashboard"}
        </title>{" "}
      </Helmet>
      <DashboardLayout>
        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">PROFILE</h4>
                {loading === true ? (
                  <label className="outerloader2">
                    {" "}
                    <span className="loader"></span>
                    <span className="loaderwait">Please Wait...</span>
                  </label>
                ) : (
                  <div>
                    <form>
                      <div className="inner_form_new ">
                        <label className="controlform">Bank/ADLA Name</label>
                        <div className="form-bx">
                          <label>
                            <input
                              type="text"
                              name="user"
                              value={
                                userData.bankName ? userData.bankName : "N/A"
                              }
                              disabled
                            />
                            <span className="sspan"></span>
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new ">
                        <label className="controlform">Full Name</label>
                        <div className="form-bx">
                          <label>
                            <input
                              type="text"
                              name="fullname"
                              onChange={(e) => {
                                changeHandelForm(e);
                              }}
                              defaultValue={userData.name}
                            />
                            <span className="sspan"></span>
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new ">
                        <label className="controlform">Email</label>
                        <div className="form-bx">
                          <label>
                            <input
                              type="text"
                              name="Email"
                              placeholder="Email"
                              value={userData.emailID}
                              disabled
                            />
                            <span className="sspan"></span>
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new ">
                        <label className="controlform">User Name</label>
                        <div className="form-bx">
                          <label>
                            <input
                              type="text"
                              name="user"
                              value={userData.userName}
                              disabled
                            />
                            <span className="sspan"></span>
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new ">
                        <label className="controlform">
                          Want to recieve Mail Notification
                        </label>
                        <div className="form-bx">
                          <label>
                            <select
                              name="MailNotification"
                              onChange={(e) => {
                                changeHandelForm(e);
                              }}
                            >
                              <option
                                value="0"
                                selected={
                                  userData.isReceiveEmail === 0 ? true : ""
                                }
                              >
                                No
                              </option>
                              <option
                                value="1"
                                selected={
                                  userData.isReceiveEmail === 1 ? true : ""
                                }
                              >
                                Yes
                              </option>
                            </select>
                            <span className="sspan"></span>
                          </label>
                        </div>
                      </div>

                      <div className="inner_form_new ">
                        <label className="controlform">Out of Office</label>
                        <div className="form-bx">
                          <label>
                            <select
                              name="outOfOffice"
                              onChange={(e) => {
                                changeHandelForm(e);
                              }}
                            >
                              <option
                                value="0"
                                selected={
                                  userData?.isOutOfOffice === 0 ? true : ""
                                }
                              >
                                No
                              </option>
                              <option
                                value="1"
                                selected={
                                  userData?.isOutOfOffice === 1 ? true : ""
                                }
                              >
                                Yes
                              </option>
                            </select>
                            <span className="sspan"></span>
                          </label>
                        </div>
                      </div>

                      {outOffice === "1" ||
                      (outOffice === "" && userData.isOutOfOffice === 1) ||
                      (outOffice === "1" && userData.isOutOfOffice == null) ||
                      (outOffice === "1" && userData.isOutOfOffice === 1) ? (
                        <>
                          <div className="inner_form_new ">
                            <label className="controlform">Form Date</label>
                            <div className="form-bx">
                              <DatePicker
                                closeOnScroll={(e) => e.target === document}
                                selected={inTime}
                                onChange={(date) => setInTime(date)}
                                peekNextMonth
                                placeholderText="DD/MM/YYYY"
                                minDate={new Date()}
                                value={
                                  inTime
                                    ? inTime
                                    : userData.fromDate != null
                                    ? moment(userData.fromDate).format(
                                        "DD/MM/YYYY"
                                      )
                                    : ""
                                }
                                showMonthDropdown
                                maxDate="12/31/2027"
                                showYearDropdown
                                dropdownMode="select"
                                keyboard={false}
                              />
                              <span className="sspan"></span>
                              {/* {errors.date || startDate == null ? (
              <small className="errormsg" style={{ bottom: "-10px" }}>
                Application Date is required
              </small>
            ) : (
              ""
            )} */}
                            </div>
                          </div>

                          <div className="inner_form_new ">
                            <label className="controlform">To Date</label>
                            <div className="form-bx">
                              <DatePicker
                                closeOnScroll={(e) => e.target === document}
                                selected={outTime}
                                onChange={(date) => setOutTime(date)}
                                peekNextMonth
                                minDate={new Date()}
                                value={
                                  outTime
                                    ? outTime
                                    : userData.toDate != null
                                    ? moment(userData.toDate).format(
                                        "DD/MM/YYYY"
                                      )
                                    : ""
                                }
                                showMonthDropdown
                                placeholderText="DD/MM/YYYY"
                                maxDate="12/31/2027"
                                showYearDropdown
                                dropdownMode="select"
                                keyboard={false}
                              />
                              <span className="sspan"></span>
                              {/* {errors.date || startDate == null ? (
              <small className="errormsg" style={{ bottom: "-10px" }}>
                Application Date is required
              </small>
            ) : (
              ""
            )} */}
                            </div>
                          </div>

                          <div className="inner_form_new ">
                            <label className="controlform">Reason</label>
                            <div className="form-bx">
                              <label>
                                <textarea
                                  // ref={applicantCommentsRef}
                                  name="reason"
                                  onChange={(e) => {
                                    changeHandelForm(e);
                                  }}
                                  placeholder="Reason"
                                  defaultValue={userData.reason}
                                />
                                <span className="sspan"></span>
                              </label>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      <div className="form-footer mt-5 mb-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            updateProfile(e);
                            setRefreshData(!refreshData);
                          }}
                          className="login"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default Home;
