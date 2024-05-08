import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Helmet } from "react-helmet";
import moment from "moment";
import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import UpdatePopupMessage from "../components/UpdatePopupMessage";

const Home = () => {
  const navigate = useNavigate();
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  const UserID = sessionStorage.getItem("userID");

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [inTime, setInTime] = useState(new Date());
  const [outTime, setOutTime] = useState(new Date());
  const [mailNotification, setMailNotification] = useState("");
  const [outOffice, setOutOffice] = useState("");
  const [updatepopup, setupdatepopup] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [files, setFiles] = useState([]);
  const [reason, setReason] = useState(
    userData?.reason ? userData?.reason : ""
  );
  const [fullName, setFullName] = useState(
    userData?.name ? userData?.name : ""
  );

  const heading = "Profile Updated Successfully!";
  const para = "Profile updated successfully!";

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // const index = files.findIndex(item => item.id === id);
    // if (index !== -1) {
    // setFiles((prevFiles) => {
    //   const newFiles = [...prevFiles];
    //   return newFiles;
    // });
    // } else {
    setFiles((prevFiles) => [...prevFiles, { file }]);
    // }
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
        var fromdateout =
          res.data.responseData.fromDate != null
            ? moment(res.data.responseData.fromDate).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : new Date();
        setInTime(fromdateout);

        var todateout =
          res.data.responseData.toDate != null
            ? moment(res.data.responseData.toDate).format("YYYY-MM-DD HH:mm:ss")
            : inTime
            ? inTime
            : new Date();
        setOutTime(todateout);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error -", err);
    }
  };

  useEffect(() => {
    getProfileData();
    // }, [refreshData]);
  }, []);

  const updateProfile = async (e) => {
    setRefreshData(true);
    try {
      let formData = new FormData();
      const res = await axios.post(APIURL + "User/UpdateUserData", {
        Name: fullName ? fullName : userData.name,
        UserID: UserID.replace(/"/g, ""),
        isOutOfOffice: outOffice ? outOffice : userData.isOutOfOffice,
        IsReceiveEmail: mailNotification
          ? mailNotification
          : userData.isReceiveEmail,
        FromDate: inTime ? inTime : outOffice === "0" ? "" : userData.fromDate,
        ToDate: outTime ? outTime : outOffice === "0" ? "" : userData.toDate,
        Reason: reason ? reason : outOffice === "0" ? "" : userData.reason,
      });

      if (res.data.responseCode === "200") {
        // for (let i = 0; i < files.length; i++) {
          formData.append("files", files[0].file);
        // }
        formData.append("UserID", UserID.replace(/"/g, ""));
        formData.append("FileType", "SignatureImage");

        axios.post(ImageAPI + "File/UploadFile", formData).then((res) => {
          console.log("res--", res);
        });
        setRefreshData(false);
        setupdatepopup(true);
      }
    } catch (err) {
      setRefreshData(false);
      console.log("Error -", err);
    }
  };

  const closePopupHandle = () => {
    navigate("/BankADLADashboard");
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
                        <label className="controlform">Signatue Upload</label>
                        <div className="attachemt_form-bx mb-0">
                          <label style={{ padding: "10px 0" }}>
                            {files.length
                              ? files[0]?.file.name
                              : "Signatue Upload"}
                          </label>
                          <div className="browse-btn">
                            Browse{" "}
                            <input
                              type="file"
                              accept="image/jpg,image/png,image/jpeg"
                              onChange={(e) => handleFileChange(e)}
                            />
                          </div>
                          {/* <span className="filename">
                          {files.find((f) => f.id === items?.id)?.files[0]?.name ||
                  "No file chosen"}
                        </span> */}
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
                            <label className="controlform">From Date</label>
                            <div className="form-bx">
                              <DatePicker
                                closeOnScroll={(e) => e.target === document}
                                selected={inTime}
                                onChange={(date) => {
                                  setInTime(date);
                                  setOutTime(date);
                                }}
                                peekNextMonth
                                placeholderText={inTime}
                                minDate={new Date()}
                                showMonthDropdown
                                maxDate="31/12/2027"
                                showYearDropdown
                                dropdownMode="select"
                                keyboard={false}
                                format="DD/MM/yyyy"
                              />
                              <span className="sspan"></span>
                              {/* {errors.date || startDate == null ? (fromDate
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
                                // minDate={new Date()}
                                // value={
                                //   outTime
                                //     ? moment(outTime).format("DD/MM/YYYY")
                                //     : userData.toDate != null
                                //     ? moment(userData.toDate).format(
                                //         "DD/MM/YYYY"
                                //       )
                                //     : ""
                                // }
                                showMonthDropdown
                                placeholderText={outTime}
                                maxDate="12/31/2027"
                                minDate={inTime}
                                showYearDropdown
                                dropdownMode="select"
                                keyboard={false}
                                format="DD/MM/yyyy"
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
                            // setRefreshData(!refreshData);
                          }}
                          disabled={refreshData === true ? true : false}
                          className="login"
                        >
                          {refreshData === true ? "Please Wait..." : "Submit"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {updatepopup == true ? (
          <UpdatePopupMessage
            heading={heading}
            para={para}
            applicationNumber=""
            closePopupHandle={closePopupHandle}
          ></UpdatePopupMessage>
        ) : (
          ""
        )}
      </DashboardLayout>
    </>
  );
};

export default Home;
