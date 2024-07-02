import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Helmet } from "react-helmet";
import moment from "moment";
import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import UpdatePopupMessage from "../components/UpdatePopupMessage";
import { toast } from "react-toastify";
import { Storage } from "../login/Storagesetting";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

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
  const [files, setFiles] = useState({});
  const [error, setError] = useState("");
  const [Imageurl, setImageurl] = useState(null);
  const [reason, setReason] = useState(
    userData?.reason ? userData?.reason : ""
  );
  const [fullName, setFullName] = useState(
    userData?.name ? userData?.name : ""
  );
  const [signature, setSignature] = useState("");
  const [signatureName, setSignatureName] = useState();
  const [cropSign, setCropSign] = useState();
  const signatureRef = useRef();

  const heading = "Profile Updated Successfully!";
  const para = "Profile updated successfully!";

  const MenunameLocal = Storage.getItem("menuname")

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

  // const handleFileChange = (e, id) => {
  //   const file = e.target.files[0];
  //   const index = files.findIndex(item => item.id === id);
  //   if (index !== -1) {
  //     setFiles(prevFiles => {
  //       const newFiles = [...prevFiles];
  //       newFiles[index] = { file, id };
  //       return newFiles;
  //     });
  //   } else {
  //     setFiles(prevFiles => [...prevFiles, { file, id }]);
  //   }
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file.size < 1000000) {
      setFiles(file);
      setImageurl(URL.createObjectURL(file));
      setError("");
    } else {
      setError("Max Image Size 1 MB");
    }
  };
  const handleSignatueChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    if (files && files[0]) {
      if (files[0].size < 1000000) {
        const reader = new FileReader();
        reader.onload = () => {
          setSignatureName(files[0].name);
          setSignature(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else {
        toast.error("Max Image Size 1 MB", {
          autoClose: 1000,
        });
      }
    } else {
      toast.error("No files found or the file is not valid", {
        autoClose: 1000,
      });
    }
  };

  const handleSignatueSave = (e) => {
    e.preventDefault();
    let cropSignature = signatureRef.current?.cropper
      .getCroppedCanvas()
      .toDataURL();
    if (typeof signatureRef.current?.cropper !== "undefined") {
      setCropSign(cropSignature);
      setSignature(null);
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
        formData.append("FileType", "SignatureImage");
        formData.append("Label", signatureName);
        formData.append("PdfData", cropSign);
        formData.append("UserID", UserID.replace(/"/g, ""));
        formData.append("RoleID", userData.roleModelData[0].roleID);
        formData.append("DepartmentID", userData.departmentID);
        axios
          .post(ImageAPI + "File/SignatureImage", formData, {
            headers: {
              Referer: "https://dms.getanapp.co.in/",
            },
          })
          .then((res) => {
            if (res.data.responseCode === "Success") {
              Storage.setItem("signImageURL", res.data.responseData?.filePath);
            }
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

    if(MenunameLocal == "Home"){
      navigate("/AllDashboard");
      
    }if(MenunameLocal == "Exports"){
      navigate("/BankADLADashboard")
    }if(MenunameLocal == "Imports"){
      navigate("/ImportDashboard")
    }if(MenunameLocal == "Foreign Investments"){
      navigate("/FINVDashboard")
    }if(MenunameLocal == "Inspectorate"){
      navigate("/INSDashboard")
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
                        <label className="controlform">Signature Upload</label>
                        <div className="attachemt_form-bx mb-0 form-bx">
                          <div style={signature ? { width: "100%" } : null}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <label style={{ padding: "10px 0" }}>
                                {files.length
                                  ? files[0]?.file.name
                                  : "Signature Upload"}
                                {error ? (
                                  <small className="errormsg">{error}</small>
                                ) : (
                                  <small
                                    style={{
                                      color: "#999",
                                      fontSize: "14px",
                                      position: "absolute",
                                      left: "0",
                                      top: "44px",
                                    }}
                                  >
                                    Max Image Size 1 MB
                                  </small>
                                )}
                              </label>
                              {/* <span className="text-danger">{error}</span> */}

                              <div
                                className="browse-btn"
                                style={
                                  !signature ? { marginLeft: "35px" } : null
                                }
                              >
                                Browse
                                <input
                                  type="file"
                                  accept="image/jpg,image/png,image/jpeg"
                                  // onChange={(e) => handleFileChange(e)}
                                  onChange={(e) => handleSignatueChange(e)}
                                  access="image/.png,.jpg"
                                />
                              </div>
                            </div>
                            {signature && (
                              <div className="signature_box">
                                <div style={{ width: "60%" }}>
                                  <Cropper
                                    src={signature}
                                    style={{ height: 300, width: "100%" }}
                                    guides={false}
                                    ref={signatureRef}
                                    initialAspectRatio={1 / 1}
                                    aspectRatio={1 / 1}
                                    viewMode={0}
                                    preview=".preview"
                                    dragMode="move"
                                    cropBoxResizable={false}
                                    toggleDragModeOnDblclick={false}
                                  />

                                  <button
                                    className="mt-2 me-3 template-pdf-btn"
                                    onClick={handleSignatueSave}
                                    disabled={!signature}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="mt-2 me-3 template-pdf-btn"
                                    onClick={() => setSignature(null)}
                                  >
                                    Close
                                  </button>
                                </div>
                                <div
                                  className="preview"
                                  style={{ height: "300px", width: "300px" }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                       
                        {cropSign && cropSign != undefined ? (
                          <img
                            className="img-fluid img-thumbnail"
                            style={{ maxHeight: "120px" }}
                            src={cropSign}
                            alt={"signature image"}
                          />
                        ) : userData?.signImageURL ? (
                          <a href={userData?.signImageURL} target="_blank">
                            <img
                              className="img-fluid img-thumbnail"
                              style={{ maxHeight: "120px" }}
                              src={userData?.signImageURL}
                              alt={userData?.signImageName}
                            />
                          </a>
                        ) : (
                          ""
                        )}
                        
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
                                maxDate="12/31/2027"
                                showYearDropdown
                                dropdownMode="select"
                                keyboard={false}
                                format="DD/MM/yyyy"
                              />
                              <span className="sspan"></span>
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
                            </div>
                          </div>

                          <div className="inner_form_new ">
                            <label className="controlform">Reason</label>
                            <div className="form-bx">
                              <label>
                                <textarea
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
