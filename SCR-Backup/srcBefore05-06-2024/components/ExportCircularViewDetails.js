import React, { useEffect, useState } from "react";
import moment from "moment";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import axios from "axios";
import { APIURL } from "../constant";

const ExportCircularViewDetails = ({
  applicationDetail,
  handleFormClose,
  allcomment,
  tatHistory,
  showdataLoader,
  responceCount,
  noDataComment,
  Actiondata,
}) => {
  const roleID = Storage.getItem("roleIDs");
  const UserID = Storage.getItem("userID");
  const [viewShareFile, setviewShareFile] = useState([]);
  const [geninfoTab, setgeninfoTab] = useState(true);
  const [banksuperTab, setbanksuperTab] = useState(true);
  const [recordTab, setrecordTab] = useState(true);
  const [analystTab, setanalystTab] = useState(true);
  const [sranalystTab, setsranalystTab] = useState(true);
  const [principalanalystTab, setprincipalanalystTab] = useState(true);
  const [deputyTab, setdeputyTab] = useState(true);
  const [director, setdirector] = useState(true);
  const [tabstatus3, settabstatus3] = useState(true);
  const [tabstatus4, settabstatus4] = useState(true);
  const [tabstatus5, settabstatus5] = useState(true);
  const [tabstatus6, settabstatus6] = useState(true);
  const [sharefiletab, setsharefiletab] = useState(false);
  const [geninfoFile, setgeninfoFile] = useState([]);
  const userRoleID = Storage.getItem("roleIDs");

  const handleFIleview = () => {
    axios
      .post(APIURL + "ExportApplication/GetSharedFileData", {
        ID: applicationDetail.id,
      })
      .then((res) => {
        if (res.data.responseCode == "200") {
          setviewShareFile(res.data.responseData);
        } else {
          setviewShareFile([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .post(APIURL + "ExportApplication/GetFilesByApplicationID", {
        ID: applicationDetail.id,
      })
      .then((res) => {
        if (res.data.responseCode == "200") {
          setgeninfoFile(res.data.responseData);
        } else {
          setgeninfoFile([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleFIleview();
  }, [applicationDetail]);

  const CCValue = applicationDetail?.copiedResponses?.length
    ? applicationDetail?.copiedResponses?.map((v, i) => (
      <li key={i}>{v.bankName}</li>
    ))
    : null;

  
  return (
    <>
      {
        // !tatHistory?.length ||
        showdataLoader == true || !noDataComment?.length ? (
          <label className="outerloader2">
            <span className="loader"></span>
            <span className="loaderwait">Please Wait...</span>
          </label>
        ) : (
          <div className="exportViewCircular">
            <h5
              className={
                geninfoTab
                  ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                  : "section_top_subheading mt-3 py-3 cursorpointer"
              }
              onClick={() => setgeninfoTab(!geninfoTab)}
            >
              Circular Info{" "}
              <span className="btn-collapse">
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <div className={geninfoTab ? "customtab" : "d-none"}>
              <div className="inner_form_new ">
                <label className="controlform">Name</label>
                <div className="form-bx">
                  <label>
                    <input
                      name="user"
                      value={
                        applicationDetail?.name
                          ? applicationDetail?.name
                          : "N/A"
                      }
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
              <div className="inner_form_new">
                <label className="controlform">
                  Content
                </label>
                <div className="form-bx">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: applicationDetail?.content
                        ? applicationDetail?.content
                        : "N/A",
                    }}
                    className="analyst_desc"
                  ></div>
                </div>
              </div>
              <div className="inner_form_new ">
                <label className="controlform">Bank</label>
                <div className="form-bx">
                  <label>
                    <ul className="nalist">
                      {applicationDetail?.bankData
                        ?.length ? (
                        applicationDetail?.bankData?.map(
                          (res) => {
                            return (
                              <li>{res?.bankName}</li>
                            );
                          }
                        )
                      ) : (
                        <li className="disabletext">
                          N/A
                        </li>
                      )}
                    </ul>

                    <span className="sspan"></span>
                  </label>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">
                  Subject
                </label>
                <div className="form-bx">
                  <label>
                    <input
                      name="subject"
                      value={
                        applicationDetail?.subject
                          ? applicationDetail?.subject
                          : "N/A"
                      }
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>

              <div className="inner_form_new ">
                <label className="controlform">Directives</label>
                <div className="form-bx">
                  <label>
                    <ul className="nalist">
                      {applicationDetail?.directiveData
                        ?.length ? (
                        applicationDetail?.directiveData?.map(
                          (res) => {
                            return (
                              <li>{res?.directiveName}</li>
                            );
                          }
                        )
                      ) : (
                        <li className="disabletext">
                          N/A
                        </li>
                      )}
                    </ul>
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
              <div className="inner_form_new ">
                <label className="controlform">Releasing Date</label>
                <div className="form-bx">
                  <label>
                    <input
                      value={
                        applicationDetail?.releasingDate
                          ? moment(applicationDetail?.releasingDate
                          ).format(
                            "DD MMM YYYY"
                          )
                          : "N/A"
                      }
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
{applicationDetail?.userID !== UserID.replace(/"/g, "") ? 
              <div class="row">
                <div class="col-md-6">
                  <div class="inner_form_new ">
                    <label class="controlform">
                      Assigned To Role
                    </label>
                    <div class="form-bx">
                      <label>
                        <input
                          type="text"
                          class=""
                          disabled
                          value={
                            applicationDetail?.assignedToRoleName
                              ? applicationDetail?.assignedToRoleName
                              : "N/A"
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="inner_form_new-sm ">
                    <label class="controlform-sm">
                      Assigned To User
                    </label>
                    <div class="form-bx-sm">
                      <label>
                        <input
                          type="text"
                          class=""
                          disabled
                          value={
                            applicationDetail?.assignedToName
                              ? applicationDetail?.assignedToName
                              : "N/A"
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              : ""}
              {/* end form-bx  */}



              <h5 className="section_top_subheading mt-3">Attachments</h5>


              {applicationDetail?.attachedFiles?.length ? (
                applicationDetail?.attachedFiles?.map((items, index) => {
                  return (
                    <div className="attachemt_form-bx" key={items.id}>
                      <label
                        style={{
                          background: "#d9edf7",
                          padding: "9px 3px",
                          border: "0px",
                        }}
                      >
                        <span style={{ fontWeight: "500" }}>
                          {" "}
                          {items?.label ? items?.label : items?.fileName}
                        </span>
                      </label>
                      <span className="filename">
                        <Link
                          to={items?.filePath}
                          target="_blank"
                          className="viewbtn_file"
                        >
                          View File
                        </Link>
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center">File Not Found</div>
              )}

            </div>


            {/* analyst code start */}
            {userRoleID >= 5 ? (
              <>
                <h5
                  className={
                    analystTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setanalystTab(!analystTab)}
                >
                  Analyst{" "}

                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>
                {allcomment?.map((cur, i) => {
                  if (cur.assignedToRoleID == 5) {
                    return (
                      <>
                        {roleID > 5 || cur.assignedToRoleID == 5 ? (
                          <>
                            <div
                              className={analystTab ? "customtab" : "d-none"}
                            >
                              <ul
                                className={
                                  cur.circularActivityData
                                    ?.length >= 1
                                    ? "nav nav-pills mb-3"
                                    : "d-none"
                                }
                                role="tablist"
                              >
                                {cur?.circularActivityData
                                  ?.map(
                                    (items, index) => {
                                      return (
                                        <li
                                          className="nav-item"
                                          role="presentation"
                                        >
                                          <button
                                            className={
                                              index == 0 && tabstatus3
                                                ? "nav-link w-100 border-radius0 active"
                                                : "nav-link w-100 border-radius0 "
                                            }
                                            id={"analyst" + index}
                                            data-bs-toggle="tab"
                                            data-bs-target={
                                              "#analyst-justified-home" + index
                                            }
                                            type="button"
                                            role="tab"
                                            aria-controls="home"
                                            aria-selected="true"
                                            onClick={() => {
                                              index == 0
                                                ? settabstatus3(true)
                                                : settabstatus3(false);
                                            }}
                                          >
                                            {index == 0
                                              ? "Recent"
                                              : `Response ${cur?.circularActivityData

                                                ?.length - index
                                              }`}{" "}
                                          </button>
                                        </li>
                                      );
                                    }
                                  )}
                              </ul>

                              <div className="tab-content pt-2">
                                {cur?.circularActivityData

                                  ?.slice()
                                  ?.reverse()
                                  .map((items, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className={
                                          index == 0 && tabstatus3
                                            ? "tab-pane fade show active"
                                            : "tab-pane fade"
                                        }
                                        id={"analyst-justified-home" + index}
                                        role="tabpanel"
                                        aria-labelledby={"analyst" + index}
                                      >
                                        <div className={items?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                          <div className="row">
                                            <div className="col-md-6">
                                              <div className="inner_form_new ">
                                                <label className="controlform">
                                                  Action Type
                                                </label>
                                                <div className="form-bx">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionStatusName ==
                                                          "Approved" ||
                                                          items?.actionStatusName ==
                                                          "Reject" ||
                                                          items?.actionStatusName ==
                                                          "Cancelled"
                                                          ? "Assigned"
                                                          : items?.actionStatusName
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm ">
                                                <label className="controlform-sm">
                                                  User{" "}
                                                  {items?.actionRoleName !=
                                                    null ? (
                                                    <i
                                                      className="bi bi-info-circle icons-info"
                                                      title={`Role : ${items?.actionRoleName
                                                        ? items?.actionRoleName
                                                        : "N/A"
                                                        }`}
                                                    ></i>
                                                  ) : (
                                                    ""
                                                  )}
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionUserName
                                                          ? items?.actionUserName
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm">
                                                <label className="controlform-sm">
                                                  {items?.actionStatusName} Date
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.createdDate
                                                          ? moment(
                                                            items?.createdDate
                                                          ).format(
                                                            "DD/MMM/yyyy"
                                                          )
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action Note
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionNotes
                                                      ? items?.actionNotes
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>

                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action Comment
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionComment
                                                      ? items?.actionComment
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        {/* );
                                    }
                                  }
                                );
                              })} */}

                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Name
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.name
                                                    ? items?.name
                                                    : "N/A"
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>

                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Recommendation
                                          </label>
                                          <div className="form-bx">
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: items?.content
                                                  ? items?.content
                                                  : "",
                                              }}
                                              className="analyst_desc"
                                            ></div>
                                          </div>
                                        </div>

                                     
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Attachments
                                          </label>
                                          <div className="form-bx">
                                          {items?.filesData?.length ? (
                                            items?.filesData?.map(
                                              (items, index) => {
                                                return (
                                                  <div
                                                    className="attachemt_form-bx mb-0 width-80"
                                                    key={items.id}
                                                  >
                                                    <label>
                                                      {items?.fileName
                                                        ? items?.fileName
                                                        : `FileUpload ${index}`}
                                                    </label>
                                                    <span className="filename">
                                                      <Link
                                                        to={items?.filePath}
                                                        target="_blank"
                                                        className="viewbtn"
                                                      >
                                                        View File
                                                      </Link>
                                                    </span>
                                                  </div>
                                                );
                                              }
                                            )
                                          ) : (
                                            <label className="notfound">
                                              File Not Found
                                            </label>
                                          )}
                                          </div>
                                        </div>
                                           {/* 
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Bank
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <ul className="nalist">
                                                {items?.bankData
                                                  ?.length ? (
                                                  items?.bankData?.map(
                                                    (res) => {
                                                      return (
                                                        <li>{res?.bankName}</li>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <li className="disabletext">
                                                    N/A
                                                  </li>
                                                )}
                                              </ul>
                                            </label>
                                          </div>
                                        </div> */}
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Subject
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.subject
                                                    ? items?.subject
                                                    : "N/A"
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                        {/* <div className="inner_form_new ">
                                          <label className="controlform">
                                          Directives
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <ul className="nalist">
                                                {items?.directiveData
                                                  ?.length ? (
                                                  items?.directiveData?.map(
                                                    (res) => {
                                                      return (
                                                        <li>{res?.directiveName}</li>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <li className="disabletext">
                                                    N/A
                                                  </li>
                                                )}
                                              </ul>
                                            </label>
                                          </div>
                                        </div> */}

                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Releasing Date
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  items?.releasingDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>
                                        <div class="row">
                                          <div class="col-md-6">
                                            <div class="inner_form_new ">
                                              <label class="controlform">
                                                Assigned To Role
                                              </label>
                                              <div class="form-bx">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.roleName
                                                        ? items?.roleName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <div class="inner_form_new-sm ">
                                              <label class="controlform-sm">
                                                Assigned To User
                                              </label>
                                              <div class="form-bx-sm">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.assignedToName
                                                        ? items?.assignedToName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* ) : (
                                      ""
                                    )} */}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  }
                })}
                 {noDataComment?.map((v, i) => {
                  if (v.roleID == 5 && v.isDataAvailable == 0) {
                    return (
                      <div className={analystTab ? "customtab" : "d-none"}>
                        <div class="text-center">No Data Found</div>
                      </div>
                    );
                  }
                })}
                {/* analyst code end */}
                {/* senior code start */}

                <h5
                  className={
                    sranalystTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setsranalystTab(!sranalystTab)}
                >
                  Senior Analyst{" "}
                  {responceCount?.map((item, i) => {
                    if (item?.id == 6)
                      return (
                        <>
                          {item?.count == 0 ? (
                            ""
                          ) : (
                            <span className="counter-tab">{item?.count}</span>
                          )}
                        </>
                      );
                  })}
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>
                {allcomment?.map((cur, i) => {
                  if (cur.assignedToRoleID == 6) {
                    return (
                      <>
                        {roleID > 6 || cur.assignedToRoleID == 6 ? (
                          <>
                            <div
                              className={sranalystTab ? "customtab" : "d-none"}
                            >
                              <ul
                                className={
                                  cur?.circularActivityData
                                    ?.length > 1
                                    ? "nav nav-pills mb-3"
                                    : "d-none"
                                }
                                role="tablist"
                              >
                                {cur?.circularActivityData
                                  .map(
                                    (items, index) => {
                                      return (
                                        <li
                                          className="nav-item"
                                          role="presentation"
                                        >
                                          <button
                                            className={
                                              index == 0
                                                ? "nav-link w-100 border-radius0 active"
                                                : "nav-link border-radius0 w-100 "
                                            }
                                            id={"sranalyst" + index}
                                            data-bs-toggle="tab"
                                            data-bs-target={
                                              "#sranalyst-justified-home" + index
                                            }
                                            type="button"
                                            role="tab"
                                            aria-controls="home"
                                            aria-selected="true"
                                            onClick={() => {
                                              index == 0
                                                ? settabstatus4(true)
                                                : settabstatus4(false);
                                            }}
                                          >
                                            {index == 0
                                              ? "Recent"
                                              : `Response ${cur?.circularActivityData

                                                ?.length - index
                                              }`}{" "}
                                          </button>
                                        </li>
                                      );
                                    }
                                  )}
                              </ul>

                              <div className="tab-content pt-2">
                                {cur?.circularActivityData

                                  ?.slice()
                                  ?.reverse()
                                  .map((items, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className={
                                          index == 0 && tabstatus4
                                            ? "tab-pane fade show active"
                                            : "tab-pane fade"
                                        }
                                        id={"sranalyst-justified-home" + index}
                                        role="tabpanel"
                                        aria-labelledby={"sranalyst" + index}
                                      >
                                        <div className={items?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                          <div className="row">
                                            <div className="col-md-6">
                                              <div className="inner_form_new ">
                                                <label className="controlform">
                                                  Action Type
                                                </label>
                                                <div className="form-bx">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionStatusName ==
                                                          "Approved" ||
                                                          items?.actionStatusName ==
                                                          "Reject" ||
                                                          items?.actionStatusName ==
                                                          "Cancelled"
                                                          ? "Assigned"
                                                          : items?.actionStatusName
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm ">
                                                <label className="controlform-sm">
                                                  User{" "}
                                                  {items?.actionRoleName !=
                                                    null ? (
                                                    <i
                                                      className="bi bi-info-circle icons-info"
                                                      title={`Role : ${items?.actionRoleName
                                                        ? items?.actionRoleName
                                                        : "N/A"
                                                        }`}
                                                    ></i>
                                                  ) : (
                                                    ""
                                                  )}
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionUserName
                                                          ? items?.actionUserName
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm">
                                                <label className="controlform-sm">
                                                  {items?.actionStatusName ==
                                                    "Approved" ||
                                                    items?.actionStatusName ==
                                                    "Reject" ||
                                                    items?.actionStatusName ==
                                                    "Cancelled"
                                                    ? "Assigned"
                                                    : items?.actionStatusName}{" "}
                                                  Date
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={moment(
                                                        items?.createdDate
                                                      ).format("DD/MMM/yyyy")}
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className={items?.actionNotes ? "inner_form_new " : "d-none"}>
                                            <label className="controlform">
                                              Action Note
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionNotes
                                                      ? items?.actionNotes
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>

                                          <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                            <label className="controlform">
                                              Action Comment
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionComment
                                                      ? items?.actionComment
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        {/* );
                             } })})
                            }  */}
                                        {/* <div className="inner_form_new ">
                                          <label className="controlform">
                                            Senior Analyst Recommendation
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  applicationDetail?.analystRecommendationName
                                                    ? applicationDetail?.analystRecommendationName
                                                    : "N/A"
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div> */}
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Recommendation
                                          </label>
                                          <div className="form-bx">
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: items?.content
                                                  ? items?.content
                                                  : "",
                                              }}
                                              className="analyst_desc"
                                            ></div>
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Notes
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <textarea
                                                name="Notes"
                                                placeholder="Notes"
                                                className=""
                                                value={
                                                  items?.notes
                                                    ? items?.notes
                                                    : "N/A"
                                                }
                                                disabled
                                              ></textarea>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Comments
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <textarea
                                                name="Notes"
                                                placeholder="Notes"
                                                className=""
                                                value={
                                                  items?.comment
                                                    ? items?.comment
                                                    : "N/A"
                                                }
                                                disabled
                                              ></textarea>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Attachments
                                          </label>
                                          <div className="form-bx">
                                          {items?.filesData?.length ? (
                                            items?.filesData?.map(
                                              (items, index) => {
                                                return (
                                                  <div
                                                    className="attachemt_form-bx mb-0 width-80"
                                                    key={items.id}
                                                  >
                                                    <label>
                                                      {items?.fileName
                                                        ? items?.fileName
                                                        : `FileUpload ${index}`}
                                                    </label>

                                                    <span className="filename">
                                                      <Link
                                                        to={items?.filePath}
                                                        target="_blank"
                                                        className="viewbtn"
                                                      >
                                                        View File
                                                      </Link>
                                                    </span>
                                                  </div>
                                                );
                                              }
                                            )
                                          ) : (
                                            <label className="notfound">
                                              File Not Found
                                            </label>
                                          )}
                                          </div>
                                        </div>
                                        {/* <div className="inner_form_new ">
                                          <label className="controlform">
                                           Bank
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <ul className="nalist">
                                                {items?.bankData
                                                  ?.length ? (
                                                  items?.bankData?.map(
                                                    (res) => {
                                                      return (
                                                        <li>{res?.bankName}</li>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <li className="disabletext">
                                                    N/A
                                                  </li>
                                                )}
                                              </ul>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                           Directive
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <ul className="nalist">
                                                {items?.directiveData
                                                  ?.length ? (
                                                  items?.directiveData?.map(
                                                    (res) => {
                                                      return (
                                                        <li>{res?.directiveName}</li>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <li className="disabletext">
                                                    N/A
                                                  </li>
                                                )}
                                              </ul>
                                            </label>
                                          </div>
                                        </div> */}
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Releasing Date
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  items?.releasingDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>



                                        <div class="row">
                                          <div class="col-md-6">
                                            <div class="inner_form_new ">
                                              <label class="controlform">
                                                Assigned To Role
                                              </label>
                                              <div class="form-bx">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.roleName
                                                        ? items?.roleName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <div class="inner_form_new-sm ">
                                              <label class="controlform-sm">
                                                Assigned To User
                                              </label>
                                              <div class="form-bx-sm">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.assignedToName
                                                        ? items?.assignedToName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* ) : (
                                      ""
                                    )} */}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  }
                })}
                 {noDataComment?.map((v, i) => {
                  if (v.roleID == 6 && v.isDataAvailable == 0) {
                    return (
                      <div className={sranalystTab ? "customtab" : "d-none"}>
                        <div class="text-center">No Data Found</div>
                      </div>
                    );
                  }
                })}
                {/* senior code end */}
                {/* Principal code start */}
                <h5
                  className={
                    principalanalystTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setprincipalanalystTab(!principalanalystTab)}
                >
                  Principal Analyst{" "}

                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>
                {allcomment?.map((cur, i) => {
               
                  if (cur.assignedToRoleID == 7) {
                    return (
                      <>
                        {roleID > 7 || cur.assignedToRoleID == 7 ? (
                          <>
                            <div
                              className={
                                principalanalystTab ? "customtab" : "d-none"
                              }
                            >
                              <ul
                                className={
                                  cur?.circularActivityData
                                    ?.length > 1
                                    ? "nav nav-pills mb-3"
                                    : "d-none"
                                }
                                role="tablist"
                              >
                                {cur?.circularActivityData
                                  .map(
                                    (items, index) => {
                                      return (
                                        <li
                                          className="nav-item"
                                          role="presentation"
                                        >
                                          <button
                                            className={
                                              index == 0
                                                ? "nav-link w-100 border-radius0 active"
                                                : "nav-link border-radius0 w-100 "
                                            }
                                            id={"analyst" + index}
                                            data-bs-toggle="tab"
                                            data-bs-target={
                                              "#pranalyst-justified-home" + index
                                            }
                                            type="button"
                                            role="tab"
                                            aria-controls="home"
                                            aria-selected="true"
                                            onClick={() => {
                                              index == 0
                                                ? settabstatus5(true)
                                                : settabstatus5(false);
                                            }}
                                          >
                                            {index == 0
                                              ? "Recent"
                                              : `Response ${cur?.circularActivityData

                                                ?.length - index
                                              }`}{" "}
                                          </button>
                                        </li>
                                      );
                                    }
                                  )}
                              </ul>

                              <div className="tab-content pt-2">
                                {cur?.circularActivityData

                                  ?.slice()
                                  ?.reverse()
                                  .map((items, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className={
                                          index == 0 && tabstatus5
                                            ? "tab-pane fade show active"
                                            : "tab-pane fade"
                                        }
                                        id={"pranalyst-justified-home" + index}
                                        role="tabpanel"
                                        aria-labelledby={"pranalyst" + index}
                                      >
                                        <div className={items?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                          <div className="row">
                                            <div className="col-md-6">
                                              <div className="inner_form_new ">
                                                <label className="controlform">
                                                  Action Type
                                                </label>
                                                <div className="form-bx">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionStatusName ==
                                                          "Approved" ||
                                                          items?.actionStatusName ==
                                                          "Reject" ||
                                                          items?.actionStatusName ==
                                                          "Cancelled"
                                                          ? "Assigned"
                                                          : items?.actionStatusName
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm ">
                                                <label className="controlform-sm">
                                                  User{" "}
                                                  {items?.actionRoleName !=
                                                    null ? (
                                                    <i
                                                      className="bi bi-info-circle icons-info"
                                                      title={`Role : ${items?.actionRoleName
                                                        ? items?.actionRoleName
                                                        : "N/A"
                                                        }`}
                                                    ></i>
                                                  ) : (
                                                    ""
                                                  )}
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionUserName
                                                          ? items?.actionUserName
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm">
                                                <label className="controlform-sm">
                                                  {items?.actionStatusName ==
                                                    "Approved" ||
                                                    items?.actionStatusName ==
                                                    "Reject" ||
                                                    items?.actionStatusName ==
                                                    "Cancelled"
                                                    ? "Assigned"
                                                    : items?.actionStatusName}{" "}
                                                  Date
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.createdDate
                                                          ? moment(
                                                            items?.createdDate
                                                          ).format(
                                                            "DD/MMM/yyyy"
                                                          )
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className={items?.actionNotes ? "inner_form_new " : "d-none"}>
                                            <label className="controlform">
                                              Action Note
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionNotes
                                                      ? items?.actionNotes
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>

                                          <div className={items?.actionComment ? "inner_form_new " : "d-none"}>
                                            <label className="controlform">
                                              Action Comment
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionComment
                                                      ? items?.actionComment
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        {/* );
                                 }}
                              );})} */}



                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Recommendation
                                          </label>
                                          <div className="form-bx">
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: items?.content
                                                  ? items?.content
                                                  : "",
                                              }}
                                              className="analyst_desc"
                                            ></div>
                                          </div>
                                        </div>

                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Notes
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <textarea
                                                name="Notes"
                                                placeholder="Notes"
                                                className=""
                                                value={
                                                  items?.notes
                                                    ? items?.notes
                                                    : "N/A"
                                                }
                                                disabled
                                              ></textarea>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Comments
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <textarea
                                                name="Notes"
                                                placeholder="Notes"
                                                className=""
                                                value={
                                                  items?.comment
                                                    ? items?.comment
                                                    : "N/A"
                                                }
                                                disabled
                                              ></textarea>
                                            </label>
                                          </div>
                                        </div>

                                        <div className="inner_form_new align-items-start">
                                          <label className="controlform">
                                            Attachments
                                          </label>
                                          <div className="mt-3">
                                          {items?.filesData?.length ? (
                                            items?.filesData?.map(
                                              (items, index) => {
                                                return (
                                                  <p
                                                    className="attachemt_form-bx"
                                                    key={items.id}
                                                  >
                                                    <label>
                                                      {items?.fileName
                                                        ? items?.fileName
                                                        : `FileUpload ${index}`}
                                                    </label>

                                                    <span className="filename">
                                                      <Link
                                                        to={items?.filePath}
                                                        target="_blank"
                                                        className="viewbtn"
                                                      >
                                                        View File
                                                      </Link>
                                                    </span>
                                                  </p>
                                                );
                                              }
                                            )
                                          ) : (
                                            <label className="notfound">
                                              File Not Found
                                            </label>
                                          )}
                                          </div>
                                        </div>

                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Releasing Date
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  items?.releasingDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>


                                        <div class="row">
                                          <div class="col-md-6">
                                            <div class="inner_form_new ">
                                              <label class="controlform">
                                                Assigned To Role
                                              </label>
                                              <div class="form-bx">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.roleName
                                                        ? items?.roleName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <div class="inner_form_new-sm ">
                                              <label class="controlform-sm">
                                                Assigned To User
                                              </label>
                                              <div class="form-bx-sm">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.assignedToName
                                                        ? items?.assignedToName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* ) : (
                                      ""
                                    )} */}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  }
                })}
                {noDataComment?.map((v, i) => {
                  if (v.roleID == 7 && v.isDataAvailable == 0) {
                    return (
                      <div
                        className={principalanalystTab ? "customtab" : "d-none"}
                      >
                        <div class="text-center">No Data Found</div>
                      </div>
                    );
                  }
                })}
                {/* Principal code end */}

                {/* deputy code start */}
                <h5
                  className={
                    deputyTab
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setdeputyTab(!deputyTab)}
                >
                  Deputy Director{" "}

                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>
                {allcomment?.map((cur, i) => {
                  if (cur.assignedToRoleID == 8) {
                    return (
                      <>
                        {roleID > 8 || cur.assignedToRoleID == 8 ? (
                          <>
                            <div className={deputyTab ? "customtab" : "d-none"}>
                              <ul
                                className={
                                  cur?.circularActivityData
                                    ?.length
                                    ? "nav nav-pills mb-3"
                                    : "d-none"
                                }
                                role="tablist"
                              >
                                {cur?.circularActivityData
                                  .map(
                                    (items, index) => {
                                      return (
                                        <li
                                          className="nav-item"
                                          role="presentation"
                                        >
                                          <button
                                            className={
                                              index == 0
                                                ? "nav-link w-100 border-radius0 active"
                                                : "nav-link border-radius0 w-100 "
                                            }
                                            id={"ddr" + index}
                                            data-bs-toggle="tab"
                                            data-bs-target={
                                              "#ddr-justified-home" + index
                                            }
                                            type="button"
                                            role="tab"
                                            aria-controls="home"
                                            aria-selected="true"
                                            onClick={() => {
                                              index == 0
                                                ? settabstatus6(true)
                                                : settabstatus6(false);
                                            }}
                                          >
                                            {index == 0
                                              ? "Recent"
                                              : `Response ${cur?.circularActivityData

                                                ?.length - index
                                              }`}{" "}
                                          </button>
                                        </li>
                                      );
                                    }
                                  )}
                              </ul>

                              <div className="tab-content pt-2">
                                {cur?.circularActivityData

                                  ?.slice()
                                  ?.reverse()
                                  .map((items, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className={
                                          index == 0 && tabstatus5
                                            ? "tab-pane fade show active"
                                            : "tab-pane fade"
                                        }
                                        id={"ddr-justified-home" + index}
                                        role="tabpanel"
                                        aria-labelledby={"ddr" + index}
                                      >
                                        <div className={items?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                          <div className="row">
                                            <div className="col-md-6">
                                              <div className="inner_form_new ">
                                                <label className="controlform">
                                                  Action Type
                                                </label>
                                                <div className="form-bx">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionStatusName ==
                                                          "Approved" ||
                                                          items?.actionStatusName ==
                                                          "Reject" ||
                                                          items?.actionStatusName ==
                                                          "Cancelled"
                                                          ? "Assigned"
                                                          : items?.actionStatusName
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm ">
                                                <label className="controlform-sm">
                                                  User{" "}
                                                  {items?.actionRoleName !=
                                                    null ? (
                                                    <i
                                                      className="bi bi-info-circle icons-info"
                                                      title={`Role : ${items?.actionRoleName
                                                        ? items?.actionRoleName
                                                        : "N/A"
                                                        }`}
                                                    ></i>
                                                  ) : (
                                                    ""
                                                  )}
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionUserName
                                                          ? items?.actionUserName
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm">
                                                <label className="controlform-sm">
                                                  {items?.actionStatusName ==
                                                    "Approved" ||
                                                    items?.actionStatusName ==
                                                    "Reject" ||
                                                    items?.actionStatusName ==
                                                    "Cancelled"
                                                    ? "Assigned"
                                                    : items?.actionStatusName}{" "}
                                                  Date
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.createdDate
                                                          ? moment(
                                                            items?.createdDate
                                                          ).format(
                                                            "DD/MMM/yyyy"
                                                          )
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className={items?.actionNotes ? "inner_form_new" : "d-none"}>
                                            <label className="controlform">
                                              Action Note
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionNotes
                                                      ? items?.actionNotes
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>

                                          <div className={items?.actionComment ? "inner_form_new" : "d-none"}>
                                            <label className="controlform">
                                              Action Comment
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionComment
                                                      ? items?.actionComment
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        {/* );
                             }
                            })}
                              )
                       }  */}

                                        {/* <div className="inner_form_new ">
                                          <label className="controlform">
                                            Deputy Director Recommendation
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  applicationDetail?.analystRecommendationName
                                                    ? applicationDetail?.analystRecommendationName
                                                    : "N/A"
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div> */}

                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Recommendation
                                          </label>
                                          <div className="form-bx">
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: items?.content
                                                  ? items?.content
                                                  : "",
                                              }}
                                              className="analyst_desc"
                                            ></div>
                                          </div>
                                        </div>

                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Notes
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <textarea
                                                name="Notes"
                                                placeholder="Notes"
                                                className=""
                                                value={
                                                  items?.notes
                                                    ? items?.notes
                                                    : "N/A"
                                                }
                                                disabled
                                              ></textarea>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Comments
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <textarea
                                                name="Notes"
                                                placeholder="Notes"
                                                className=""
                                                value={
                                                  items?.comment
                                                    ? items?.comment
                                                    : "N/A"
                                                }
                                                disabled
                                              ></textarea>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Attachments
                                          </label>
                                          <div className="form-bx">
                                          {items?.filesData?.length ? (
                                            items?.filesData?.map(
                                              (items, index) => {
                                                return (
                                                  <div
                                                    className="attachemt_form-bx mb-0 width-80"
                                                    key={items.id}
                                                  >
                                                    <label>
                                                      {items?.fileName
                                                        ? items?.fileName
                                                        : `FileUpload ${index}`}
                                                    </label>

                                                    <span className="filename">
                                                      <Link
                                                        to={items?.filePath}
                                                        target="_blank"
                                                        className="viewbtn"
                                                      >
                                                        View File
                                                      </Link>
                                                    </span>
                                                  </div>
                                                );
                                              }
                                            )
                                          ) : (
                                            <label className="notfound">
                                              File Not Found
                                            </label>
                                          )}
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Releasing Date
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  items?.releasingDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>


                                        <div class="row">
                                          <div class="col-md-6">
                                            <div class="inner_form_new ">
                                              <label class="controlform">
                                                Assigned To Role
                                              </label>
                                              <div class="form-bx">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.roleName
                                                        ? items?.roleName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <div class="inner_form_new-sm ">
                                              <label class="controlform-sm">
                                                Assigned To User
                                              </label>
                                              <div class="form-bx-sm">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.assignedToName
                                                        ? items?.assignedToName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* ) : (
                                      ""
                                    )} */}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  }
                })}
                 {noDataComment?.map((v, i) => {
                  if (v.roleID == 8 && v.isDataAvailable == 0) {
                    return (
                      <div className={deputyTab ? "customtab" : "d-none"}>
                        <div class="text-center">No Data Found</div>
                      </div>
                    );
                  }
                })}
                {/* deputy code end */}
                {/* director code start */}
                <h5
                  className={
                    director
                      ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                      : "section_top_subheading mt-3 py-3 cursorpointer"
                  }
                  onClick={() => setdirector(!director)}
                >
                  Director{" "}
                  {responceCount?.map((item, i) => {
                    if (item?.id == 9)
                      return (
                        <>
                          {item?.count == 0 ? (
                            ""
                          ) : (
                            <span className="counter-tab">{item?.count}</span>
                          )}
                        </>
                      );
                  })}
                  <span className="btn-collapse">
                    <i className="bi bi-caret-down-fill"></i>
                  </span>
                </h5>
                {allcomment?.map((cur, i) => {
                  if (cur.assignedToRoleID == 9) {
                    return (
                      <>
                        {roleID <= 9 && cur.assignedToRoleID == 9 ? (
                          <>
                            <div className={director ? "customtab" : "d-none"}>
                              <ul
                                className={
                                  cur?.circularActivityData
                                    ?.length
                                    ? "nav nav-pills mb-3"
                                    : "d-none"
                                }
                                role="tablist"
                              >
                                {cur?.circularActivityData
                                  .map(
                                    (items, index) => {
                                      return (
                                        <li
                                          className="nav-item"
                                          role="presentation"
                                        >
                                          <button
                                            className={
                                              index == 0
                                                ? "nav-link w-100 border-radius0 active"
                                                : "nav-link border-radius0 w-100 "
                                            }
                                            id={"directors" + index}
                                            data-bs-toggle="tab"
                                            data-bs-target={
                                              "#directors-justified-home" + index
                                            }
                                            type="button"
                                            role="tab"
                                            aria-controls="home"
                                            aria-selected="true"
                                            onClick={() => {
                                              index == 0
                                                ? settabstatus6(true)
                                                : settabstatus6(false);
                                            }}
                                          >
                                            {index == 0
                                              ? "Recent"
                                              : `Response ${cur?.circularActivityData

                                                ?.length - index
                                              }`}{" "}
                                          </button>
                                        </li>
                                      );
                                    }
                                  )}
                              </ul>

                              <div className="tab-content pt-2">
                                {cur?.circularActivityData

                                  ?.slice()
                                  ?.reverse()
                                  .map((items, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className={
                                          index == 0 && tabstatus6
                                            ? "tab-pane fade show active"
                                            : "tab-pane fade"
                                        }
                                        id={"directors-justified-home" + index}
                                        role="tabpanel"
                                        aria-labelledby={"directors" + index}
                                      >
                                        <div className={items?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                          <div className="row">
                                            <div className="col-md-6">
                                              <div className="inner_form_new ">
                                                <label className="controlform">
                                                  Action Type
                                                </label>
                                                <div className="form-bx">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionStatusName ==
                                                          "Approved" ||
                                                          items?.actionStatusName ==
                                                          "Reject" ||
                                                          items?.actionStatusName ==
                                                          "Cancelled"
                                                          ? "Assigned"
                                                          : items?.actionStatusName
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm ">
                                                <label className="controlform-sm">
                                                  User{" "}
                                                  {items?.actionRoleName !=
                                                    null ? (
                                                    <i
                                                      className="bi bi-info-circle icons-info"
                                                      title={`Role : ${items?.actionRoleName
                                                        ? items?.actionRoleName
                                                        : "N/A"
                                                        }`}
                                                    ></i>
                                                  ) : (
                                                    ""
                                                  )}
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionUserName
                                                          ? items?.actionUserName
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="col-md-3">
                                              <div className="inner_form_new-sm">
                                                <label className="controlform-sm">
                                                  {items?.actionStatusName ==
                                                    "Approved" ||
                                                    items?.actionStatusName ==
                                                    "Reject" ||
                                                    items?.actionStatusName ==
                                                    "Cancelled"
                                                    ? "Assigned"
                                                    : items?.actionStatusName}{" "}
                                                  Date
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.createdDate
                                                          ? moment(
                                                            items?.createdDate
                                                          ).format(
                                                            "DD/MMM/yyyy"
                                                          )
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className={items?.actionNotes ? "inner_form_new" : "d-none"}>
                                            <label className="controlform">
                                              Action Note
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionNotes
                                                      ? items?.actionNotes
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>

                                          <div className={items?.actionComment ? "inner_form_new" : "d-none"}>
                                            <label className="controlform">
                                              Action Comment
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <textarea
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.actionComment
                                                      ? items?.actionComment
                                                      : "N/A"
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        {/* );
                                    }
                                  }
                                );
                              })} */}


                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Recommendation
                                          </label>
                                          <div className="form-bx">
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html: items?.content
                                                  ? items?.content
                                                  : "",
                                              }}
                                              className="analyst_desc"
                                            ></div>
                                          </div>
                                        </div>

                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Notes
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <textarea
                                                name="Notes"
                                                placeholder="Notes"
                                                className=""
                                                value={
                                                  items?.notes
                                                    ? items?.notes
                                                    : "N/A"
                                                }
                                                disabled
                                              ></textarea>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Comments
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <textarea
                                                name="Notes"
                                                placeholder="Notes"
                                                className=""
                                                value={
                                                  items?.comment
                                                    ? items?.comment
                                                    : "N/A"
                                                }
                                                disabled
                                              ></textarea>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Attachments
                                          </label>
                                          <div className="form-bx">
                                          {items?.filesData?.length ? (
                                            items?.filesData?.map(
                                              (items, index) => {
                                                return (
                                                  <div
                                                    className="attachemt_form-bx mb-0 width-80"
                                                    key={items.id}
                                                  >
                                                    <label>
                                                      {items?.fileName
                                                        ? items?.fileName
                                                        : `FileUpload ${index}`}
                                                    </label>

                                                    <span className="filename">
                                                      <Link
                                                        to={items?.filePath}
                                                        target="_blank"
                                                        className="viewbtn"
                                                      >
                                                        View File
                                                      </Link>
                                                    </span>
                                                  </div>
                                                );
                                              }
                                            )
                                          ) : (
                                            <label className="notfound">
                                              File Not Found
                                            </label>
                                          )}
                                          </div>
                                        </div>
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Releasing Date
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={moment(
                                                  items?.releasingDate
                                                ).format("DD/MMM/yyyy")}
                                              />
                                            </label>
                                          </div>
                                        </div>


                                        <div class="row">
                                          <div class="col-md-6">
                                            <div class="inner_form_new ">
                                              <label class="controlform">
                                                Assigned To Role
                                              </label>
                                              <div class="form-bx">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.roleName
                                                        ? items?.roleName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <div class="inner_form_new-sm ">
                                              <label class="controlform-sm">
                                                Assigned To User
                                              </label>
                                              <div class="form-bx-sm">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      items?.assignedToName
                                                        ? items?.assignedToName
                                                        : "N/A"
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* ) : (
                                      ""
                                    )} */}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    );
                  }
                })}
                {noDataComment?.map((data, i) => {
                  if (data.roleID == 9 && data.isDataAvailable == 0) {
                    return (
                      <div
                        className={director ? "customtab" : "d-none"}
                        key={i}
                      >
                        <div class="text-center">No Data Found</div>
                      </div>
                    );
                  }
                })}
                {/* director code end */}
              </>
            ) : (
              ""
            )}



            <div className="form-footer mt-5 mb-3">
              <button type="button" className="login" onClick={handleFormClose}>
                Close
              </button>
            </div>
          </div>
        )
      }
    </>
  );
};

export default ExportCircularViewDetails;
