import React, { useState } from "react";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import moment from "moment";
import { Link } from "react-router-dom";

const ReturnImportDashboardViewDetails = ({
  applicationDetail,
  showdataLoader,
  noDataComment,
  allcomment,
  handleFormClose,
  responceCount,
  tatHistory,
  geninfoFile,
}) => {
  const { applicantTypes } = ExportformDynamicField();

  const bankName = Storage.getItem("bankName");
  const name = Storage.getItem("name");
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

  console.log("applicationDetail",applicationDetail)
  return (
    <>
      {showdataLoader == true || !noDataComment?.length ? (
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
              <div className="form-bx">
                <label>
                  <input value={applicationDetail?.userName ? applicationDetail?.userName : "N/A"} disabled />
                </label>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">Name of Bank</label>
              <div className="form-bx">
                <label>
                  <input
                    value={
                      roleID == 2
                        ? bankName.replace(/"/g, "")
                        : applicationDetail?.bankName == null &&
                          applicationDetail?.roleID == 4
                        ? "N/A"
                        : applicationDetail?.bankName
                    }
                    disabled
                  />
                </label>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">Application Date</label>
              <div className="form-bx">
                <label>
                  <input
                    disabled
                    value={moment(applicationDetail?.applicationDate).format(
                      "DD/MMM/yyyy"
                    )}
                    className="text-uppercase"
                  />
                  <span className="sspan"></span>
                </label>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">
                Prior Exchange Control Authority Number(PECAN)
              </label>
              <div className="form-bx">
                <label>
                  <input
                    disabled
                    value={
                      applicationDetail?.pecaNumber
                        ? applicationDetail?.pecaNumber
                        : "N/A"
                    }
                    className="text-uppercase"
                  />
                </label>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">Type of Importer</label>
              <div className="form-bx-radio mt-4">
                {applicantTypes.map((item, index) => {
                  return (
                    <>
                      <label key={index}>
                        <input
                          type="radio"
                          name="importType"
                          value={item.id}
                          checked={applicationDetail?.applicantType == item?.id}
                          disabled
                        />
                        <span>{item.name}</span>
                      </label>
                    </>
                  );
                })}
              </div>
            </div>

            {applicationDetail.applicantType == "1" ? (
              <>
                <div className="inner_form_new ">
                  <label className="controlform">Company Name</label>
                  <div className="form-bx">
                    <label>
                      <input
                        value={applicationDetail?.companyName ? applicationDetail?.companyName : "N/A"}
                        className="text-uppercase"
                        disabled
                      />
                    </label>
                  </div>
                </div>

                <div className="inner_form_new ">
                  <label className="controlform">TIN Number</label>
                  <div className="form-bx">
                    <label>
                      <input
                        value={applicationDetail?.tinNumber ? applicationDetail?.tinNumber : "N/A"}
                        disabled
                        className="text-uppercase"
                      />
                      <span className="sspan"></span>
                    </label>
                  </div>
                </div>

                <div className="inner_form_new ">
                  <label className="controlform">BPN Code</label>
                  <div className="form-bx">
                    <label>
                      <input
                        value={applicationDetail?.bpnCode ? applicationDetail?.bpnCode : "N/A"}
                        className="text-uppercase"
                        disabled
                      />
                    </label>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {applicationDetail.applicantType == "2" ? (
              <div className="inner_form_new ">
                <label className="controlform">Applicant</label>
                <div className="form-bx">
                  <label>
                    <input value={applicationDetail?.name ? applicationDetail?.name : "N/A"} disabled />
                  </label>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="inner_form_new ">
              <label className="controlform">Nature of Application</label>
              <div className="form-bx">
                <label>
                  <input value={applicationDetail?.applicationType ? applicationDetail?.applicationType : "N/A"} disabled />
                </label>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">Beneficiary Name</label>
              <div className="form-bx">
                <label>
                  <input
                    value={
                      applicationDetail?.beneficiaryName
                        ? applicationDetail?.beneficiaryName
                        : "N/A"
                    }
                    disabled
                  />
                </label>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">Baneficiary Country</label>
              <div className="form-bx">
                <label>
                  <input
                    value={
                      applicationDetail?.beneficiaryCountryName
                        ? applicationDetail?.beneficiaryCountryName
                        : "N/A"
                    }
                    disabled
                  />
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="inner_form_new">
                  <label className="controlform">Currency</label>
                  <div className="form-bx">
                    <label>
                      <input value={applicationDetail?.currencyCode ? applicationDetail?.currencyCode : "N/A"} disabled />
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inner_form_new-sm">
                  <label className="controlform-sm">Amount</label>
                  <div className="form-bx-sm">
                    <label>
                      <input value={applicationDetail?.amount ? applicationDetail?.amount : "N/A"} disabled />
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="inner_form_new-sm">
                  <label className="controlform-sm">Rate</label>
                  <div className="form-bx-sm">
                    <label>
                      <input value={applicationDetail?.rate ? applicationDetail?.rate : "N/A"} disabled />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">USD Equivalent</label>
              <div className="form-bx">
                <label>
                  <input value={applicationDetail?.usdEquivalent ? applicationDetail?.usdEquivalent : "N/A"} disabled />
                  <span className="sspan"></span>
                </label>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">Sector</label>
              <div className="form-bx">
                <label>
                  <input value={applicationDetail?.sectorName ? applicationDetail?.sectorName : "N/A"} disabled />
                </label>
              </div>
            </div>

            <div className="inner_form_new">
              <label className="controlform">Subsector</label>
              <div className="form-bx">
                <label>
                  <input
                    value={
                      applicationDetail?.subSectorName
                        ? applicationDetail.subSectorName
                        : "N/A"
                    }
                    disabled
                  />
                  <span className="sspan"></span>
                </label>
              </div>
            </div>

            <div className="inner_form_new ">
              <label className="controlform">Applicant Comments</label>
              <div className="form-bx">
                <label>
                  <textarea
                    value={applicationDetail?.applicantComment ? applicationDetail?.applicantComment : "N/A"}
                    disabled
                  />
                </label>
              </div>
            </div>

            <div
                className={
                  applicationDetail?.applicationStatus == 0 ? "d-none" : "row"
                }
              >
                <div className="col-md-6">
                  <div className="inner_form_new ">
                    <label className="controlform">Assigned To Role</label>
                    <div className="form-bx">
                      <label>
                        <input
                          type="text"
                          className=""
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
                <div className="col-md-6">
                  <div className="inner_form_new-sm ">
                    <label className="controlform-sm">Assigned To User</label>
                    <div className="form-bx-sm">
                      <label>
                        <input
                          type="text"
                          className=""
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

            <h5 className="section_top_subheading">Attachments</h5>
            {(applicationDetail?.fileName || applicationDetail?.filePath) &&
            applicationDetail?.roleID !== 4 ? (
              <div
                className={
                  applicationDetail?.filePath != null
                    ? "attachemt_form-bx"
                    : "d-none"
                }
              >
                <label
                  style={{
                    background: "#d9edf7",
                    padding: "9px 3px",
                    border: "0px",
                  }}
                >
                  {applicationDetail?.fileName ? (
                    <span style={{ fontWeight: "500" }}>
                      {applicationDetail?.fileName}
                    </span>
                  ) : (
                    <span style={{ fontWeight: "500" }}>Cover Letter</span>
                  )}
                </label>
                {applicationDetail?.filePath ? (
                  <span className="filename">
                    <Link
                      to={applicationDetail?.filePath}
                      target="_blank"
                      className={
                        applicationDetail?.filePath
                          ? "viewbtn_file"
                          : "viewbtn_file pe-none"
                      }
                    >
                      View File
                    </Link>
                  </span>
                ) : (
                  <span className="disabletext">Not Found</span>
                )}
              </div>
            ) : (
              ""
            )}

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
            ) : applicationDetail?.filePath != null ||
              applicationDetail?.filePath != "" ? (
              ""
            ) : (
              <div className="text-center">File Not Found</div>
            )}
          </div>

          {applicationDetail?.roleID !== 4 ? (
            <>
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
                  <i className="bi bi-caret-down-fill"></i>
                </span>
              </h5>
              {allcomment?.map((cur, i) => {
                if (cur.assignedToRoleID == 3) {
                  return (
                    <>
                      {roleID > 3 || cur.assignedToRoleID == 3 ? (
                        <>
                          <div
                            className={banksuperTab ? "customtab" : "d-none"}
                          >
                            <ul
                              className={
                                cur.applicationActivityData?.length >= 1
                                  ? "nav nav-pills mb-3"
                                  : "d-none"
                              }
                              role="tablist"
                            >
                              {cur?.applicationActivityData?.map(
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
                                        id={"BankSuper" + index}
                                        data-bs-toggle="tab"
                                        data-bs-target={
                                          "#BankSuper-justified-home" + index
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
                                              cur?.applicationActivityData
                                                ?.length - index
                                            }`}{" "}
                                      </button>
                                    </li>
                                  );
                                }
                              )}
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
                                      id={"BankSuper-justified-home" + index}
                                      role="tabpanel"
                                      aria-labelledby={"BankSuper" + index}
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
                                                {items?.actionRoleName !=
                                                null ? (
                                                  <i
                                                    className="bi bi-info-circle icons-info"
                                                    title={`Role : ${
                                                      items?.actionRoleName
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

                                      <div className="inner_form_new ">
                                        <label className="controlform">
                                          Recommendation
                                        </label>
                                        <div className="form-bx">
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: items?.description
                                                ? items?.description
                                                : "N/A",
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

                                      
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.assignedAction ==
                                                      "Approved" ||
                                                    items?.assignedAction ==
                                                      "Reject" ||
                                                    items?.assignedAction ==
                                                      "Cancelled"
                                                      ? "Assigned"
                                                      : items?.assignedAction
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Assigned To Role
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                                      </div>
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
                if (v.roleID == 3 && v.isDataAvailable == 0) {
                  return (
                    <div className={banksuperTab ? "customtab" : "d-none"}>
                      <div className="text-center">No Data Found</div>
                    </div>
                  );
                }
              })}
            </>
          ) : (
            ""
          )}

          {roleID >= 4 && applicationDetail?.roleID != 4 ? (
            <>
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
                  <i className="bi bi-caret-down-fill"></i>
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
                                                    item?.notes
                                                      ? item?.notes
                                                      : ""
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
                                                    item?.comment
                                                      ? item?.comment
                                                      : ""
                                                  }
                                                  disabled
                                                ></textarea>
                                              </label>
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-md-6">
                                              <div className="inner_form_new ">
                                                <label className="controlform">
                                                  Assigned To Role
                                                </label>
                                                <div className="form-bx">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        item?.roleName
                                                          ? item?.roleName
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-md-6">
                                              <div className="inner_form_new-sm ">
                                                <label className="controlform-sm">
                                                  Assigned To User
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        item?.assignedToName
                                                          ? item?.assignedToName
                                                          : "N/A"
                                                      }
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="row">
                                            <div className="col-md-12">
                                              <div className="inner_form_new ">
                                                <label className="controlform">
                                                  Action
                                                </label>
                                                <div className="form-bx">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        item?.assignedAction ==
                                                          "Approved" ||
                                                        item?.assignedAction ==
                                                          "Reject" ||
                                                        item?.assignedAction ==
                                                          "Cancelled"
                                                          ? "Assigned"
                                                          : item?.assignedAction
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
                                        </>
                                      );
                                    }
                                  }
                                );
                              })
                            ) : (
                              <div
                                className={
                                  banksuperTab ? "customtab" : "d-none"
                                }
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
                      <div className="text-center">No Data Found</div>
                    </div>
                  );
                }
              })}
            </>
          ) : (
            ""
          )}

          {roleID >= 4 ? (
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
                              {cur?.applicationActivityData?.map(
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
                                          : `Response ${
                                              cur?.applicationActivityData
                                                ?.length - index
                                            }`}{" "}
                                      </button>
                                    </li>
                                  );
                                }
                              )}
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
                                                {items?.actionRoleName !=
                                                null ? (
                                                  <i
                                                    className="bi bi-info-circle icons-info"
                                                    title={`Role : ${
                                                      items?.actionRoleName
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
                                              __html: items?.description
                                                ? items?.description
                                                : "N/A",
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
                                        <div>{items?.filesData?.length ? (
                                          items?.filesData?.map(
                                            (items, index) => {
                                              return (
                                               
                                                <div
                                                  className="attachemt_form-bx mt-1"
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

                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.assignedAction ==
                                                      "Approved" ||
                                                    items?.assignedAction ==
                                                      "Reject" ||
                                                    items?.assignedAction ==
                                                      "Cancelled"
                                                      ? "Assigned"
                                                      : items?.assignedAction
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Assigned To Role
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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

                                        <div className="col-md-6">
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              Assigned To User
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                      <div className="text-center">No Data Found</div>
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
                          <div
                            className={sranalystTab ? "customtab" : "d-none"}
                          >
                            <ul
                              className={
                                cur?.applicationActivityData?.length > 1
                                  ? "nav nav-pills mb-3"
                                  : "d-none"
                              }
                              role="tablist"
                            >
                              {cur?.applicationActivityData.map(
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
                                          : `Response ${
                                              cur?.applicationActivityData
                                                ?.length - index
                                            }`}{" "}
                                      </button>
                                    </li>
                                  );
                                }
                              )}
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
                                                {items?.actionRoleName !=
                                                null ? (
                                                  <i
                                                    className="bi bi-info-circle icons-info"
                                                    title={`Role : ${
                                                      items?.actionRoleName
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
                                              __html: items?.description
                                                ? items?.description
                                                : "N/A",
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
                                        <div>{items?.filesData?.length ? (
                                          items?.filesData?.map(
                                            (items, index) => {
                                              return (
                                                <div
                                                  className="attachemt_form-bx mt-1"
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
                                        )}</div>
                                      </div>
                                    
                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.assignedAction ==
                                                      "Approved" ||
                                                    items?.assignedAction ==
                                                      "Reject" ||
                                                    items?.assignedAction ==
                                                      "Cancelled"
                                                      ? "Assigned"
                                                      : items?.assignedAction
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Assigned To Role
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                                        <div className="col-md-6">
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              Assigned To User
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                      <div className="text-center">No Data Found</div>
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
                            className={
                              principalanalystTab ? "customtab" : "d-none"
                            }
                          >
                            <ul
                              className={
                                cur?.applicationActivityData?.length > 1
                                  ? "nav nav-pills mb-3"
                                  : "d-none"
                              }
                              role="tablist"
                            >
                              {cur?.applicationActivityData.map(
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
                                          : `Response ${
                                              cur?.applicationActivityData
                                                ?.length - index
                                            }`}{" "}
                                      </button>
                                    </li>
                                  );
                                }
                              )}
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
                                                {items?.actionRoleName !=
                                                null ? (
                                                  <i
                                                    className="bi bi-info-circle icons-info"
                                                    title={`Role : ${
                                                      items?.actionRoleName
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
                                              value={
                                                applicationDetail?.analystRecommendationName
                                                  ? applicationDetail?.analystRecommendationName
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
                                              __html: items?.description
                                                ? items?.description
                                                : "N/A",
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
                                        <div>{items?.filesData?.length ? (
                                          items?.filesData?.map(
                                            (items, index) => {
                                              return (
                                                <div
                                                  className="attachemt_form-bx mt-1"
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
                                        )}</div>
                                      </div>
                                     
                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.assignedAction ==
                                                      "Approved" ||
                                                    items?.assignedAction ==
                                                      "Reject" ||
                                                    items?.assignedAction ==
                                                      "Cancelled"
                                                      ? "Assigned"
                                                      : items?.assignedAction
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                                                           
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Assigned To Role
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                                        <div className="col-md-6">
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              Assigned To User
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                      <div className="text-center">No Data Found</div>
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
                              {cur?.applicationActivityData.map(
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
                                          : `Response ${
                                              cur?.applicationActivityData
                                                ?.length - index
                                            }`}{" "}
                                      </button>
                                    </li>
                                  );
                                }
                              )}
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
                                                {items?.actionRoleName !=
                                                null ? (
                                                  <i
                                                    className="bi bi-info-circle icons-info"
                                                    title={`Role : ${
                                                      items?.actionRoleName
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
                                                  ? applicationDetail?.analystRecommendationName
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
                                              __html: items?.description
                                                ? items?.description
                                                : "N/A",
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
                                        <div>{items?.filesData?.length ? (
                                          items?.filesData?.map(
                                            (items, index) => {
                                              return (
                                                <div
                                                  className="attachemt_form-bx mt-1"
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
                                     
                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.assignedAction ==
                                                      "Approved" ||
                                                    items?.assignedAction ==
                                                      "Reject" ||
                                                    items?.assignedAction ==
                                                      "Cancelled"
                                                      ? "Assigned"
                                                      : items?.assignedAction
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                     
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Assigned To Role
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                                        <div className="col-md-6">
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              Assigned To User
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                      <div className="text-center">No Data Found</div>
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
                              {cur?.applicationActivityData.map(
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
                                          : `Response ${
                                              cur?.applicationActivityData
                                                ?.length - index
                                            }`}{" "}
                                      </button>
                                    </li>
                                  );
                                }
                              )}
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
                                                {items?.actionRoleName !=
                                                null ? (
                                                  <i
                                                    className="bi bi-info-circle icons-info"
                                                    title={`Role : ${
                                                      items?.actionRoleName
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
                                              __html: items?.description
                                                ? items?.description
                                                : "N/A",
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
                                        <div>{items?.filesData?.length ? (
                                          items?.filesData?.map(
                                            (items, index) => {
                                              return (
                                                <div
                                                  className="attachemt_form-bx mt-1"
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
                                      
                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={
                                                    items?.assignedAction ==
                                                      "Approved" ||
                                                    items?.assignedAction ==
                                                      "Reject" ||
                                                    items?.assignedAction ==
                                                      "Cancelled"
                                                      ? "Assigned"
                                                      : items?.assignedAction
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Assigned To Role
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                                        <div className="col-md-6">
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              Assigned To User
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
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
                      <div className="text-center">No Data Found</div>
                    </div>
                  );
                }
              })}
            </>
          ) : (
            ""
          )}


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
              <label className="notfound">File Not Found</label>
            )}
          </div>
          </>
            ) : (
              ""
            )}
            
          <>
              <h5 className={roleID > 3 ? "section_top_subheading mt-3 py-3 btn-collapse_active " : "d-none"}>
                Application History
              </h5>

              <div className={roleID > 3 ? "tab-content" : "d-none"}>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">User Type</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Receive Date</th>
                        <th scope="col">Submit Date</th>
                        <th scope="col">Turn Around Days</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {tatHistory?.length
                        ? tatHistory?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.roleName}</td>
                                <td>{item.name ? item.name : "--"}</td>
                                <td>
                                  {item.createdDate
                                    ? moment(item.createdDate).format(
                                        "DD/MMM/yyyy hh:mm A"
                                      )
                                    : "--"}
                                </td>
                                <td>
                                  {item.submittedDate
                                    ? moment(item.submittedDate).format(
                                        "DD/MMM/yyyy hh:mm A"
                                      )
                                    : "--"}
                                </td>
                                <td>
                                  {item.workinG_DAYS}{" "}
                                  {item.workinG_DAYS > 1 ? "Days" : "Day"}{" "}
                                </td>
                              </tr>
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

export default ReturnImportDashboardViewDetails;
