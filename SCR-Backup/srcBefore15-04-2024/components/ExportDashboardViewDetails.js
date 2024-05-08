import React, { useEffect, useState } from "react";
import moment from "moment";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import axios from "axios";
import { APIURL } from "../constant";

const ExportDashboardViewDetails = ({
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

  console.log("noDataComment - ", noDataComment);
  console.log("allcomment - ", allcomment);
  console.log("applicationDetail - ", applicationDetail);

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
  };

  useEffect(() => {
    handleFIleview();
  }, [applicationDetail]);

  const CCValue = applicationDetail?.copiedResponses?.length
    ? applicationDetail?.copiedResponses?.map((v, i) => (
        <li key={i}>{v.bankName}</li>
      ))
    : null;

  console.log("responceCount  -----------", responceCount);
  console.log("tatHistory - ", tatHistory);
  console.log("tatHistory?.length  --- noDataComment?.length----", tatHistory?.length,noDataComment?.length);

  return (
    <>
      {!tatHistory?.length ||
      showdataLoader == true ||
      !noDataComment?.length ? (
        <label className="outerloader2">
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : (
        <>
          <h5
            className={
              geninfoTab
                ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                : "section_top_subheading mt-3 py-3 cursorpointer"
            }
            onClick={() => setgeninfoTab(!geninfoTab)}
          >
            General Info{" "}
            <span className="btn-collapse">
              <i className="bi bi-caret-down-fill"></i>
            </span>
          </h5>

          <div className={geninfoTab ? "customtab" : "d-none"}>
            <div className="inner_form_new ">
              <label className="controlform">User</label>
              {applicationDetail?.userName && (
                <div className="form-bx">
                  <label>
                    <input
                      name="user"
                      value={applicationDetail?.userName}
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              )}
            </div>
            {/* end form-bx  */}

            {applicationDetail?.bankName && (
              <div className="inner_form_new ">
                <label className="controlform">Name of Bank</label>

                <div className="form-bx">
                  <label>
                    <input value={applicationDetail?.bankName} disabled />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            )}
            {/* end form-bx  */}

            {applicationDetail?.applicationPurpose && (
              <div className="inner_form_new ">
                <label className="controlform">
                  Purpose of the Application
                </label>
                <div className="form-bx">
                  <label>
                    <textarea
                      name="purposeApplication"
                      value={applicationDetail?.applicationPurpose}
                      placeholder="Purpose of the Application"
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            )}
            {/* end form-bx  */}

            <div className="inner_form_new ">
              <label className="controlform">Type of Exporter</label>
              <div className="form-bx-radio mt-4">
                <label>
                  <input
                    type="radio"
                    checked={applicationDetail?.userTypeID === 1 ? true : false}
                    disabled={
                      applicationDetail?.userTypeID === 1 ? false : true
                    }
                  />{" "}
                  <span>Corporate</span>
                </label>
                <label>
                  <input
                    type="radio"
                    checked={applicationDetail?.userTypeID === 2 ? true : false}
                    disabled={
                      applicationDetail?.userTypeID === 2 ? false : true
                    }
                  />{" "}
                  <span>Individual</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="exporterType"
                    checked={applicationDetail?.userTypeID === 3 ? true : false}
                    disabled
                  />{" "}
                  <span>Government Agencies</span>
                </label>
              </div>
            </div>
            {/* end form-bx  */}

            {applicationDetail?.userTypeID === 1 ? (
              <>
                <div className="inner_form_new ">
                  <label className="controlform">Company Name</label>

                  <div className="form-bx">
                    <label>
                      <input
                        placeholder="Company Name"
                        value={applicationDetail?.companyName}
                        disabled
                      />
                      <span className="sspan"></span>
                    </label>
                  </div>
                </div>
                {applicationDetail?.tinNumber && (
                  <div className="inner_form_new ">
                    <label className="controlform">TIN Number</label>
                    <div className="form-bx">
                      <label>
                        <input
                          placeholder="Corporate Name"
                          value={applicationDetail?.tinNumber}
                          disabled
                        />
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>
                )}
                <div className="inner_form_new ">
                  <label className="controlform">BPN Code</label>
                  <div className="form-bx">
                    <label>
                      <input
                        value={applicationDetail?.bpnCode}
                        disabled
                        placeholder="BPN Code"
                      />
                      <span className="sspan"></span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {/* end form-bx  */}

            {applicationDetail?.userTypeID === 2 ? (
              <div className="inner_form_new ">
                <label className="controlform">Applicant</label>
                <div className="form-bx">
                  <label>
                    <input
                      placeholder="Applicant"
                      value={applicationDetail?.name}
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="inner_form_new">
              <label className="controlform">Applicant Reference Number</label>
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex">
                    <div className="form-bx">
                      <label>
                        <input
                          name="applicantReferenceNumber"
                          value={
                            applicationDetail?.applicantReferenceNumber
                              ? applicationDetail?.applicantReferenceNumber
                              : "N/A"
                          }
                          placeholder="Applicant Reference Number"
                          className="text-uppercase"
                          disabled
                        />
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* )} */}

            {applicationDetail?.applicationDate && (
              <div className="inner_form_new ">
                <label className="controlform">Application Date</label>

                <div className="form-bx">
                  <label>
                    <input
                      placeholder="Application Date"
                      value={moment(applicationDetail?.applicationDate).format(
                        "DD MMM YYYY"
                      )}
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            )}
            {/* end form-bx  */}

            {applicationDetail?.applicationType && (
              <div className="inner_form_new ">
                <label className="controlform">Application Type</label>

                <div className="form-bx">
                  <label>
                    <select disabled>
                      <option value="" selected>
                        {applicationDetail.applicationType}
                      </option>
                    </select>
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            )}
            {/* end form-bx  */}

            {applicationDetail?.currencyName ? (
              <div className="row">
                <div className="col-md-6">
                  <div className="inner_form_new">
                    <label className="controlform">Currency</label>

                    <div className="form-bx">
                      <label>
                        <select disabled>
                          <option value="" selected>
                            {applicationDetail?.currencyCode}
                          </option>
                        </select>
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="inner_form_new-sm">
                    <label className="controlform-sm">Amount</label>

                    <div className="form-bx-sm">
                      <label>
                        <input value={applicationDetail?.amount} disabled />
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>
                  {/* end form-bx  */}
                </div>

                <div className="col-md-3">
                  <div className="inner_form_new-sm">
                    <label className="controlform-sm">Rate</label>

                    <div className="form-bx-sm">
                      <label>
                        <input value={applicationDetail?.rate} disabled />
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>
                  {/* end form-bx  */}
                </div>
              </div>
            ) : (
              ""
            )}

            {applicationDetail?.usdEquivalent ? (
              <div className="inner_form_new ">
                <label className="controlform">USD Equivalent</label>

                <div className="form-bx">
                  <label>
                    <input
                      value={applicationDetail?.usdEquivalent.toFixed(2)}
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* end form-bx  */}

            {applicationDetail?.recNumber ? (
              <div className="inner_form_new ">
                <label className="controlform">
                  Related Exchange Control Reference Number
                </label>
                <div className="form-bx">
                  <label>
                    <input value={applicationDetail?.recNumber} disabled />
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* end form-bx  */}

            {applicationDetail?.sectorName ? (
              <div className="inner_form_new ">
                <label className="controlform">Sector</label>
                <div className="form-bx">
                  <label>
                    <select disabled>
                      <option value="" selected>
                        {applicationDetail?.sectorName}
                      </option>
                    </select>
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* end form-bx  */}

            {applicationDetail?.subSectorName ? (
              <div className="inner_form_new">
                <label className="controlform">Subsector</label>
                <div className="form-bx">
                  <label>
                    <select disabled>
                      <option selected>
                        {applicationDetail?.subSectorName}
                      </option>
                    </select>
                    <span className="sspan"></span>
                  </label>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* end form-bx  */}

            <div className="inner_form_new ">
              <label className="controlform">Applicant Comments</label>
              <div className="form-bx">
                <label>
                  <textarea
                    value={applicationDetail?.applicantComment}
                    disabled
                  />
                  <span className="sspan"></span>
                </label>
              </div>
            </div>

            {applicationDetail?.assignedToName &&
            applicationDetail.assignedToRoleName ? (
              <div class="row">
                <div class="col-md-6">
                  <div class="inner_form_new ">
                    <label class="controlform">Assigned To Role</label>
                    <div class="form-bx">
                      <label>
                        <input
                          type="text"
                          class=""
                          disabled
                          value={
                            applicationDetail?.assignedToRoleName
                              ? applicationDetail?.assignedToRoleName
                              : ""
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="inner_form_new-sm ">
                    <label class="controlform-sm">Assigned To User</label>
                    <div class="form-bx-sm">
                      <label>
                        <input
                          type="text"
                          class=""
                          disabled
                          value={
                            applicationDetail?.assignedToName
                              ? applicationDetail?.assignedToName
                              : ""
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <h5 className="section_top_subheading mt-3">Attachments</h5>
            {applicationDetail?.fileName && applicationDetail?.filePath ? (
              <div className="attachemt_form-bx">
                <label>{applicationDetail?.fileName}</label>
                <span className="filename">
                  <Link
                    to={applicationDetail?.filePath}
                    target="_blank"
                    className="viewbtn"
                  >
                    View File
                  </Link>
                </span>
              </div>
            ) : (
              ""
            )}
            {applicationDetail?.attachedFiles?.length ? (
              applicationDetail?.attachedFiles?.map((items, index) => {
                return (
                  <div className="attachemt_form-bx" key={items.id}>
                    <label>
                      {items?.label ? items?.label : items?.fileName}
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
              })
            ) : (
              <div className="text-center">File Not Found</div>
            )}
          </div>

          <h5
            className={
              banksuperTab
                ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                : "section_top_subheading mt-3 py-3 cursorpointer"
            }
            onClick={() => setbanksuperTab(!banksuperTab)}
          >
            Bank Supervisor{" "}
            {responceCount?.map((item, i) => {
              if (item?.id == 3)
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
              <i class="bi bi-caret-down-fill"></i>
            </span>
          </h5>
          {allcomment?.map((cur) => {
            if (cur.assignedToRoleID == 3) {
              return (
                <>
                  {roleID > 3 || cur.assignedToRoleID == 3 ? (
                    <>
                      <div className={banksuperTab ? "customtab" : "d-none"}>
                        {allcomment?.map((cur) => {
                          return cur?.applicationActivityData.map(
                            (item, index) => {
                              if (cur?.assignedToRoleID == 3) {
                                return (
                                  <>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Notes
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            name="Notes"
                                            placeholder="Notes"
                                            class=""
                                            value={
                                              item?.notes ? item?.notes : ""
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
                                            class=""
                                            value={
                                              item?.comment ? item?.comment : ""
                                            }
                                            disabled
                                          ></textarea>
                                        </label>
                                      </div>
                                    </div>
                                    {item?.assignedToName && item?.roleName ? (
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
                                                    item?.roleName
                                                      ? item?.roleName
                                                      : ""
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="col-md-6">
                                          <div class="inner_form_new-sm ">
                                            <label class="controlform-sm">
                                              Assigned To Name
                                            </label>
                                            <div class="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  class=""
                                                  disabled
                                                  value={
                                                    item?.assignedToName
                                                      ? item?.assignedToName
                                                      : ""
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                );
                              }
                            }
                          );
                        })}
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
            if (v.roleID == 3 && v.isDataAvailable == 0) {
              return (
                <div className={banksuperTab ? "customtab" : "d-none"}>
                  <div class="text-center">No Data Found</div>
                </div>
              );
            }
          })}

          <h5
            className={
              recordTab
                ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                : "section_top_subheading mt-3 py-3 cursorpointer"
            }
            onClick={() => setrecordTab(!recordTab)}
          >
            Record Officer{" "}
            {responceCount?.map((item, i) => {
              if (item?.id == 4)
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
              <i class="bi bi-caret-down-fill"></i>
            </span>
          </h5>
          {allcomment?.map((cur) => {
            if (cur.assignedToRoleID == 4) {
              return (
                <>
                  {roleID > 4 || cur.assignedToRoleID == 4 ? (
                    <>
                      <div className={recordTab ? "customtab" : "d-none"}>
                        {allcomment?.length ? (
                          allcomment?.map((cur) => {
                            return cur?.applicationActivityData.map(
                              (item, index) => {
                                if (cur?.assignedToRoleID == 4) {
                                  return (
                                    <>
                                      {/* <div className="inner_form_new ">
                                <label className="controlform">Record Officer Recommendation</label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={item?.statusName}
                                      disabled
                                      />
                                       
                                  </label>
                                </div>
                              </div> */}
                                      <div className="inner_form_new ">
                                        <label className="controlform">
                                          Notes
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              name="Notes"
                                              placeholder="Notes"
                                              class=""
                                              value={
                                                item?.notes ? item?.notes : ""
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
                                              class=""
                                              value={
                                                item?.comment
                                                  ? item?.comment
                                                  : ""
                                              }
                                              disabled
                                            ></textarea>
                                          </label>
                                        </div>
                                      </div>
                                      {item?.assignedToName &&
                                      item?.roleName ? (
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
                                                      item?.roleName
                                                        ? item?.roleName
                                                        : ""
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <div class="inner_form_new-sm ">
                                              <label class="controlform-sm">
                                                Assigned To Name
                                              </label>
                                              <div class="form-bx-sm">
                                                <label>
                                                  <input
                                                    type="text"
                                                    class=""
                                                    disabled
                                                    value={
                                                      item?.assignedToName
                                                        ? item?.assignedToName
                                                        : ""
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  );
                                }
                              }
                            );
                          })
                        ) : (
                          <div
                            className={banksuperTab ? "customtab" : "d-none"}
                          >
                            <p className="text-center">No Record Found</p>
                          </div>
                        )}
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
            if (v.roleID == 4 && v.isDataAvailable == 0) {
              return (
                <div className={recordTab ? "customtab" : "d-none"}>
                  <div class="text-center">No Data Found</div>
                </div>
              );
            }
          })}

          <h5
            className={
              analystTab
                ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                : "section_top_subheading mt-3 py-3 cursorpointer"
            }
            onClick={() => setanalystTab(!analystTab)}
          >
            Analyst{" "}
            {responceCount?.map((item, i) => {
              if (item?.id == 5)
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
            if (cur.assignedToRoleID == 5) {
              return (
                <>
                  {roleID > 5 || cur.assignedToRoleID == 5 ? (
                    <>
                      <div className={analystTab ? "customtab" : "d-none"}>
                        <ul
                          className={
                            cur.applicationActivityData?.length >= 1
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          {cur?.applicationActivityData?.map((items, index) => {
                            return (
                              <li className="nav-item" role="presentation">
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
                                    : `Response ${
                                        cur?.applicationActivityData?.length -
                                        index
                                      }`}{" "}
                                </button>
                              </li>
                            );
                          })}
                        </ul>

                        <div className="tab-content pt-2">
                          {cur?.applicationActivityData
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
                                  <div className="bakgroundaction">
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
                                            {items?.actionRoleName != null ? (
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${items?.actionRoleName}`}
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
                                                value={items?.actionUserName}
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
                                                value={moment(
                                                  items?.createdDate
                                                ).format("DD/MMM/yyyy")}
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
                                                : ""
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
                                                : ""
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
                                      Analyst Recommendation
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
                                              : ""
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
                                          __html: items?.description
                                            ? items?.description
                                            : "",
                                        }}
                                        className="analyst_desc"
                                      ></div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          value={
                                            items?.notes ? items?.notes : ""
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
                                            items?.comment ? items?.comment : ""
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
                                    {items?.filesData?.length ? (
                                      items?.filesData?.map((items, index) => {
                                        return (
                                          <div
                                            className="attachemt_form-bx mt-3"
                                            key={items.id}
                                          >
                                            <label>
                                              {/* {items.filename} */}
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
                                      })
                                    ) : (
                                      <div className="text-center">
                                        File Not Found
                                      </div>
                                    )}
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul>{CCValue}</ul>
                                        <ul></ul>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            items?.isReturnNeeded == 0 ||
                                            items?.isReturnNeeded == null
                                              ? "No"
                                              : items?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {items.isReturnNeeded == 1 &&
                                  items?.returnFrequencyType == 1 &&
                                  items?.returnFrequencyName == "Once" ? (
                                    <div class="row">
                                      <div class="col-md-7">
                                        <div class="inner_form_new align-items-center">
                                          <label class="controlform">
                                            Return Frequency
                                          </label>
                                          <div class="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnFrequencyName
                                                    ? items?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-5">
                                        <div class="inner_form_new-sm">
                                          <label class="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div class="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnDate ||
                                                  !items?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        items?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : items.isReturnNeeded == 1 &&
                                    items?.returnFrequencyType !== 1 ? (
                                    <div class="col-md-12">
                                      <div class="inner_form_new align-items-center">
                                        <label class="controlform">
                                          Return Frequency
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                items?.returnFrequencyName
                                                  ? items?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {items?.expiringDate &&
                                  !items?.expiringDate ==
                                    "0001-01-01T00:00:00" ? (
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Define Expiry Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              items?.expiringDate &&
                                              !items?.expiringDate ==
                                                "0001-01-01T00:00:00"
                                                ? moment(
                                                    items?.expiringDate
                                                  ).format("DD/MMM/YYYY")
                                                : ""
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  {items?.assignedToName && items?.roleName ? (
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner_form_new-sm ">
                                          <label class="controlform-sm">
                                            Assigned To Name
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
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
                      <div className={sranalystTab ? "customtab" : "d-none"}>
                        <ul
                          className={
                            cur?.applicationActivityData?.length > 1
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          {cur?.applicationActivityData.map((items, index) => {
                            return (
                              <li className="nav-item" role="presentation">
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
                                    : `Response ${
                                        cur?.applicationActivityData?.length -
                                        index
                                      }`}{" "}
                                </button>
                              </li>
                            );
                          })}
                        </ul>

                        <div className="tab-content pt-2">
                          {cur?.applicationActivityData
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
                                  <div className="bakgroundaction">
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
                                            {items?.actionRoleName != null ? (
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${items?.actionRoleName}`}
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
                                                    : ""
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
                                                value={moment(
                                                  items?.createdDate
                                                ).format("DD/MMM/yyyy")}
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
                                                : ""
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
                                                : ""
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  {/* );
                             } })})
                            }  */}
                                  <div className="inner_form_new ">
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
                                              : ""
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
                                          __html: items?.description
                                            ? items?.description
                                            : "",
                                        }}
                                        className="analyst_desc"
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          value={
                                            items?.notes ? items?.notes : ""
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
                                            items?.comment ? items?.comment : ""
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
                                    {items?.filesData?.length ? (
                                      items?.filesData?.map((items, index) => {
                                        return (
                                          <div
                                            className="attachemt_form-bx mt-3"
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
                                      })
                                    ) : (
                                      <div className="text-center">
                                        File Not Found
                                      </div>
                                    )}
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul>{CCValue}</ul>
                                        <ul></ul>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            items?.isReturnNeeded == 0 ||
                                            items?.isReturnNeeded == null
                                              ? "No"
                                              : items?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {items.isReturnNeeded == 1 &&
                                  items?.returnFrequencyType == 1 &&
                                  items?.returnFrequencyName == "Once" ? (
                                    <div class="row">
                                      <div class="col-md-7">
                                        <div class="inner_form_new align-items-center">
                                          <label class="controlform">
                                            Return Frequency
                                          </label>
                                          <div class="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnFrequencyName
                                                    ? items?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-5">
                                        <div class="inner_form_new-sm">
                                          <label class="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div class="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnDate ||
                                                  !items?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        items?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : items.isReturnNeeded == 1 &&
                                    items?.returnFrequencyType !== 1 ? (
                                    <div class="col-md-12">
                                      <div class="inner_form_new align-items-center">
                                        <label class="controlform">
                                          Return Frequency
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                items?.returnFrequencyName
                                                  ? items?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  {items?.expiringDate &&
                                  !items?.expiringDate ==
                                    "0001-01-01T00:00:00" ? (
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Define Expiry Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              items?.expiringDate &&
                                              !items?.expiringDate ==
                                                "0001-01-01T00:00:00"
                                                ? moment(
                                                    items?.expiringDate
                                                  ).format("DD/MMM/YYYY")
                                                : ""
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  {items?.assignedToName && items?.roleName ? (
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner_form_new-sm ">
                                          <label class="controlform-sm">
                                            Assigned To Name
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
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

          <h5
            className={
              principalanalystTab
                ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                : "section_top_subheading mt-3 py-3 cursorpointer"
            }
            onClick={() => setprincipalanalystTab(!principalanalystTab)}
          >
            Principal Analyst{" "}
            {responceCount?.map((item, i) => {
              if (item?.id == 7)
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
            if (cur.assignedToRoleID == 7) {
              return (
                <>
                  {roleID > 7 || cur.assignedToRoleID == 7 ? (
                    <>
                      <div
                        className={principalanalystTab ? "customtab" : "d-none"}
                      >
                        <ul
                          className={
                            cur?.applicationActivityData?.length > 1
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          {cur?.applicationActivityData.map((items, index) => {
                            return (
                              <li className="nav-item" role="presentation">
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
                                    : `Response ${
                                        cur?.applicationActivityData?.length -
                                        index
                                      }`}{" "}
                                </button>
                              </li>
                            );
                          })}
                        </ul>

                        <div className="tab-content pt-2">
                          {cur?.applicationActivityData
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
                                  <div className="bakgroundaction">
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
                                            {items?.actionRoleName != null ? (
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${items?.actionRoleName}`}
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
                                                    : ""
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
                                                value={moment(
                                                  items?.createdDate
                                                ).format("DD/MMM/yyyy")}
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
                                                : ""
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
                                                : ""
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
                                      Principal Analyst Recommendation
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          // value={items?.statusName}
                                          value={
                                            applicationDetail?.analystRecommendationName
                                              ? applicationDetail?.analystRecommendationName
                                              : ""
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
                                          __html: items?.description
                                            ? items?.description
                                            : "",
                                        }}
                                        className="analyst_desc"
                                      ></div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          value={
                                            items?.notes ? items?.notes : ""
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
                                            items?.comment ? items?.comment : ""
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
                                    {items?.filesData?.length ? (
                                      items?.filesData?.map((items, index) => {
                                        return (
                                          <div
                                            className="attachemt_form-bx mt-3"
                                            key={items.id}
                                          >
                                            <label>
                                              {/* {items.filename} */}
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
                                      })
                                    ) : (
                                      <div className="text-center">
                                        File Not Found
                                      </div>
                                    )}
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul>{CCValue}</ul>
                                        <ul></ul>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            items?.isReturnNeeded == 0 ||
                                            items?.isReturnNeeded == null
                                              ? "No"
                                              : items?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {items.isReturnNeeded == 1 &&
                                  items?.returnFrequencyType == 1 &&
                                  items?.returnFrequencyName == "Once" ? (
                                    <div class="row">
                                      <div class="col-md-7">
                                        <div class="inner_form_new align-items-center">
                                          <label class="controlform">
                                            Return Frequency
                                          </label>
                                          <div class="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnFrequencyName
                                                    ? items?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-5">
                                        <div class="inner_form_new-sm">
                                          <label class="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div class="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnDate ||
                                                  !items?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        items?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : items.isReturnNeeded == 1 &&
                                    items?.returnFrequencyType !== 1 ? (
                                    <div class="col-md-12">
                                      <div class="inner_form_new align-items-center">
                                        <label class="controlform">
                                          Return Frequency
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                items?.returnFrequencyName
                                                  ? items?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {items?.expiringDate &&
                                  !items?.expiringDate ==
                                    "0001-01-01T00:00:00" ? (
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Define Expiry Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              items?.expiringDate &&
                                              !items?.expiringDate ==
                                                "0001-01-01T00:00:00"
                                                ? moment(
                                                    items?.expiringDate
                                                  ).format("DD/MMM/YYYY")
                                                : ""
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  {items?.assignedToName && items?.roleName ? (
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner_form_new-sm ">
                                          <label class="controlform-sm">
                                            Assigned To Name
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
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
                <div className={principalanalystTab ? "customtab" : "d-none"}>
                  <div class="text-center">No Data Found</div>
                </div>
              );
            }
          })}

          <h5
            className={
              deputyTab
                ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                : "section_top_subheading mt-3 py-3 cursorpointer"
            }
            onClick={() => setdeputyTab(!deputyTab)}
          >
            Deputy Director{" "}
            {responceCount?.map((item, i) => {
              if (item?.id == 8)
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
            if (cur.assignedToRoleID == 8) {
              return (
                <>
                  {roleID > 8 || cur.assignedToRoleID == 8 ? (
                    <>
                      <div className={deputyTab ? "customtab" : "d-none"}>
                        <ul
                          className={
                            cur?.applicationActivityData?.length
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          {cur?.applicationActivityData.map((items, index) => {
                            return (
                              <li className="nav-item" role="presentation">
                                <button
                                  className={
                                    index == 0
                                      ? "nav-link w-100 border-radius0 active"
                                      : "nav-link border-radius0 w-100 "
                                  }
                                  id={"ddr" + index}
                                  data-bs-toggle="tab"
                                  data-bs-target={"#ddr-justified-home" + index}
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
                                    : `Response ${
                                        cur?.applicationActivityData?.length -
                                        index
                                      }`}{" "}
                                </button>
                              </li>
                            );
                          })}
                        </ul>

                        <div className="tab-content pt-2">
                          {cur?.applicationActivityData
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
                                  <div className="bakgroundaction">
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
                                            {items?.actionRoleName != null ? (
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${items?.actionRoleName}`}
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
                                                    : ""
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
                                                value={moment(
                                                  items?.createdDate
                                                ).format("DD/MMM/yyyy")}
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
                                                : ""
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
                                                : ""
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

                                  <div className="inner_form_new ">
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
                                          __html: items?.description
                                            ? items?.description
                                            : "",
                                        }}
                                        className="analyst_desc"
                                      ></div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          value={
                                            items?.notes ? items?.notes : ""
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
                                            items?.comment ? items?.comment : ""
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
                                    {items?.filesData?.length ? (
                                      items?.filesData?.map((items, index) => {
                                        return (
                                          <div
                                            className="attachemt_form-bx mt-3"
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
                                      })
                                    ) : (
                                      <div className="text-center">
                                        File Not Found
                                      </div>
                                    )}
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul>{CCValue}</ul>
                                        <ul></ul>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            items?.isReturnNeeded == 0 ||
                                            items?.isReturnNeeded == null
                                              ? "No"
                                              : items?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {items.isReturnNeeded == 1 &&
                                  items?.returnFrequencyType == 1 &&
                                  items?.returnFrequencyName == "Once" ? (
                                    <div class="row">
                                      <div class="col-md-7">
                                        <div class="inner_form_new align-items-center">
                                          <label class="controlform">
                                            Return Frequency
                                          </label>
                                          <div class="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnFrequencyName
                                                    ? items?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-5">
                                        <div class="inner_form_new-sm">
                                          <label class="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div class="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnDate ||
                                                  !items?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        items?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : items.isReturnNeeded == 1 &&
                                    items?.returnFrequencyType !== 1 ? (
                                    <div class="col-md-12">
                                      <div class="inner_form_new align-items-center">
                                        <label class="controlform">
                                          Return Frequency
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                items?.returnFrequencyName
                                                  ? items?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {items?.expiringDate &&
                                  !items?.expiringDate ==
                                    "0001-01-01T00:00:00" ? (
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Define Expiry Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              items?.expiringDate &&
                                              !items?.expiringDate ==
                                                "0001-01-01T00:00:00"
                                                ? moment(
                                                    items?.expiringDate
                                                  ).format("DD/MMM/YYYY")
                                                : ""
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {items?.assignedToName && items?.roleName ? (
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner_form_new-sm ">
                                          <label class="controlform-sm">
                                            Assigned To Name
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
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
                            cur?.applicationActivityData?.length
                              ? "nav nav-pills mb-3"
                              : "d-none"
                          }
                          role="tablist"
                        >
                          {cur?.applicationActivityData.map((items, index) => {
                            return (
                              <li className="nav-item" role="presentation">
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
                                    : `Response ${
                                        cur?.applicationActivityData?.length -
                                        index
                                      }`}{" "}
                                </button>
                              </li>
                            );
                          })}
                        </ul>

                        <div className="tab-content pt-2">
                          {cur?.applicationActivityData
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
                                  <div className="bakgroundaction">
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
                                            {items?.actionRoleName != null ? (
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${items?.actionRoleName}`}
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
                                                    : ""
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
                                                value={moment(
                                                  items?.createdDate
                                                ).format("DD/MMM/yyyy")}
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
                                                : ""
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
                                                : ""
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
                                      Director Recommendation
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
                                              : ""
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
                                          __html: items?.description
                                            ? items?.description
                                            : "",
                                        }}
                                        className="analyst_desc"
                                      ></div>
                                    </div>
                                  </div>

                                  <div className="inner_form_new ">
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          className=""
                                          value={
                                            items?.notes ? items?.notes : ""
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
                                            items?.comment ? items?.comment : ""
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
                                    {items?.filesData?.length ? (
                                      items?.filesData?.map((items, index) => {
                                        return (
                                          <div
                                            className="attachemt_form-bx mt-3"
                                            key={items.id}
                                          >
                                            <label>
                                              {/* {items.filename} */}
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
                                      })
                                    ) : (
                                      <div className="text-center">
                                        File Not Found
                                      </div>
                                    )}
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">CC To</label>
                                    <div className="form-bx">
                                      <label>
                                        <ul>{CCValue}</ul>
                                        <ul></ul>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="inner_form_new ">
                                    <label className="controlform">
                                      Is Return Needed?
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <input
                                          type="text"
                                          className=""
                                          disabled
                                          value={
                                            items?.isReturnNeeded == 0 ||
                                            items?.isReturnNeeded == null
                                              ? "No"
                                              : items?.isReturnNeeded == 1
                                              ? "Yes"
                                              : ""
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  {items.isReturnNeeded == 1 &&
                                  items?.returnFrequencyType == 1 &&
                                  items?.returnFrequencyName == "Once" ? (
                                    <div class="row">
                                      <div class="col-md-7">
                                        <div class="inner_form_new align-items-center">
                                          <label class="controlform">
                                            Return Frequency
                                          </label>
                                          <div class="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnFrequencyName
                                                    ? items?.returnFrequencyName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-5">
                                        <div class="inner_form_new-sm">
                                          <label class="controlform-sm">
                                            Frequency Date
                                          </label>
                                          <div class="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  items?.returnDate ||
                                                  !items?.returnDate ==
                                                    "0001-01-01T00:00:00"
                                                    ? moment(
                                                        items?.returnDate
                                                      ).format("DD/MMM/YYYY")
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : items.isReturnNeeded == 1 &&
                                    items?.returnFrequencyType !== 1 ? (
                                    <div class="col-md-12">
                                      <div class="inner_form_new align-items-center">
                                        <label class="controlform">
                                          Return Frequency
                                        </label>
                                        <div class="form-bx">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={
                                                items?.returnFrequencyName
                                                  ? items?.returnFrequencyName
                                                  : ""
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {items?.expiringDate &&
                                  !items?.expiringDate ==
                                    "0001-01-01T00:00:00" ? (
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Define Expiry Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={
                                              items?.expiringDate &&
                                              !items?.expiringDate ==
                                                "0001-01-01T00:00:00"
                                                ? moment(
                                                    items?.expiringDate
                                                  ).format("DD/MMM/YYYY")
                                                : ""
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {items?.assignedToName && items?.roleName ? (
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-md-6">
                                        <div class="inner_form_new-sm ">
                                          <label class="controlform-sm">
                                            Assigned To Name
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
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
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
                <div className={director ? "customtab" : "d-none"} key={i}>
                  <div class="text-center">No Data Found</div>
                </div>
              );
            }
          })}

          {roleID >= 5 ? (
            <>
              <h5
                className={
                  sharefiletab
                    ? "section_top_subheading mt-1 py-3 btn-collapse_active cursorpointer"
                    : "section_top_subheading mt-1 py-3 cursorpointer"
                }
                onClick={() => setsharefiletab(!sharefiletab)}
              >
                Share File{" "}
                <span className="counter-tab">{viewShareFile?.length}</span>
                <span className="btn-collapse">
                  <i className="bi bi-caret-down-fill"></i>
                </span>
              </h5>

              <div className={sharefiletab ? "customtab  mt-2" : "d-none"}>
                {/* <label
                    style={{
                      background: "rgb(217, 237, 247)",
                      padding: "9px 3px",
                      border: "0px",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}> File Upload</span>
                  </label>
                  <div className="browse-btn">
                    Browse <input type="file" />
                  </div>
                  <span className="filename">No file chosen</span> */}

                {viewShareFile?.length ? (
                  viewShareFile?.map((items, index) => {
                    return (
                      <div className="attachemt_form-bx" key={items.id}>
                        <label>
                          {/* {items.filename} */}
                          {items?.fileName
                            ? items?.fileName
                            : `FileUpload ${index}`}
                        </label>
                        <div
                          className={
                            roleID == 2 || roleID == 3 ? "browse-btn" : "d-none"
                          }
                        >
                          Browse{" "}
                        </div>
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
                  })
                ) : (
                  <span className="not-found-view">File Not Found</span>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          <>
            <h5 className="section_top_subheading mt-3 py-3 btn-collapse_active ">
              Application History
            </h5>

            <div className="tab-content">
              <div className="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">User Type</th>
                      <th scope="col">User Name</th>
                      <th scope="col">Receive Date</th>
                      <th scope="col">Submit Date</th>
                      <th scope="col">Turn Around Days</th>
                    </tr>
                  </thead>
                  <tbody class="table-group-divider">
                    {tatHistory?.length
                      ? tatHistory?.map((item, index) => {
                          return (
                            <>
                              <tr>
                                <td>{item.roleName}</td>
                                <td>{item.name ? item.name : "--"}</td>
                                <td>
                                  {item.createdDate
                                    ? moment(item.createdDate).format(
                                        "DD MMM YYYY hh:mm A"
                                      )
                                    : "--"}
                                </td>
                                <td>
                                  {item.submittedDate
                                    ? moment(item.submittedDate).format(
                                        "DD MMM YYYY hh:mm A"
                                      )
                                    : "--"}
                                </td>
                                <td>
                                  {item.workinG_DAYS}{" "}
                                  {item.workinG_DAYS > 1 ? "Days" : "Day"}{" "}
                                </td>
                              </tr>
                            </>
                          );
                        })
                      : "No History Found"}
                  </tbody>
                </table>
              </div>
            </div>
          </>

          <div className="form-footer mt-5 mb-3">
            <button type="button" className="login" onClick={handleFormClose}>
              Close
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ExportDashboardViewDetails;
