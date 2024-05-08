import React, { useEffect, useState } from "react";
import moment from "moment";
import { Storage } from "../login/Storagesetting";

const ExportDashboardViewDetails = ({
  applicationDetail,
  handleFormClose,
  allcomment,
  tatHistory,
  showdataLoader,
  Actiondata,
}) => {
  const roleID = Storage.getItem("roleIDs");

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

  return (
    <>
      {/* <h3 className="export-pop-heading">
        {applicationDetail?.rbzReferenceNumber}
      </h3> */}
      {
        tatHistory?.length && showdataLoader == true ? <label className='outerloader2'> <span className="loader"></span><span className='loaderwait'>Please Wait...</span></label> :
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
            <label className="controlform">Purpose of the Application</label>

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
                disabled={applicationDetail?.userTypeID === 1 ? false : true}
              />{" "}
              <span>Corporate</span>
            </label>
            <label>
              <input
                type="radio"
                checked={applicationDetail?.userTypeID === 2 ? true : false}
                disabled={applicationDetail?.userTypeID === 2 ? false : true}
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

            {/* {errors.niu && bankData.ApplicantType === '' ? <small className='errormsg'>{errors.ApplicantType}</small> : ""} */}
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

            {/* end form-bx  */}
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

        {/* end form-bx  */}

        {/* <div className="inner_form_new ">
            <label className="controlform">Government Agencies</label>

            <div className="form-bx">
              <label>
                <select 
                  name="govtAgencie" 
                >
                  <option value="">{applicationDetail?.}</option>
                  
                </select>
                <span className="sspan"></span>
                 
              </label>
            </div>
          </div> */}

        {/* end form-bx  */}

        {applicationDetail?.applicantReferenceNumber && (
          <div className="inner_form_new">
            <label className="controlform">Applicant Reference Number</label>

            <div className="row">
              <div className="col-md-12">
                <div className="d-flex">
                  <div className="form-bx">
                    <label>
                      <input
                        name="applicantReferenceNumber"
                        value={applicationDetail?.applicantReferenceNumber}
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
        )}
        {/* end form-bx  */}

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
                  <option selected>{applicationDetail?.subSectorName}</option>
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
              <textarea value={applicationDetail?.applicantComment} disabled />
              <span className="sspan"></span>
            </label>
          </div>
        </div>

        {/* end form-bx  */}

        {/* {applicationDetail?.supervisorName ? (
          <div className="inner_form_new ">
            <label className="controlform">
              Submitted to {applicationDetail?.supervisorName}
            </label>

            <input
              type="checkbox"
              // className="mt-4"
              checked={applicationDetail?.supervisorName ? true : false}
              disabled
            />
          </div>
        ) : (
          ""
        )} */}
        {/* end form-bx  */}

        {/* {applicationDetail?.supervisorName ? (
          <div className="inner_form_new ">
            <label className="controlform">Application Assign To</label>

            <div className="form-bx">
              <label>
                <select disabled>
                  <option value="" selected>
                    {applicationDetail?.supervisorName}
                  </option>
                </select>
                <span className="sspan"></span>
              </label>
            </div>
          </div>
        ) : (
          ""
        )} */}

        {/* end form-bx  */}

        <h5 className="section_top_subheading mt-3">Attachments</h5>

        {/* <div className="attachemt_form-bx">
        <label>
          <i className="bi bi-forward"></i>
          File 1
        </label>
        <div className="browse-btn">
          Browse <input type="file" />
        </div>
        <span className="filename">"No file chosen"</span>
      </div> */}
      </div>

      {allcomment?.map((cur) => {
        if (cur.assignedToRoleID == 4) {
          return (
            <>
              {roleID > 3 ? (
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
                    <span className="btn-collapse">
                      <i class="bi bi-caret-down-fill"></i>
                    </span>
                  </h5>

                  <div className={banksuperTab ? "customtab" : "d-none"}>
                    {allcomment?.length ? (
                      allcomment?.map((cur) => {
                        return cur?.applicationActivityData.map(
                          (item, index) => {
                            if (cur?.assignedToRoleID == 3) {
                              return (
                                <>
                                  {/* <div className="inner_form_new ">
                                <label className="controlform">Bank Supervisor Recommendation</label>
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

                                  <div
                                    className={
                                      item?.notes ? "inner_form_new " : "d-none"
                                    }
                                  >
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          class=""
                                          value={item?.notes}
                                          disabled
                                        ></textarea>
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      item?.comment
                                        ? "inner_form_new "
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Comments
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          class=""
                                          value={item?.comment}
                                          disabled
                                        ></textarea>
                                      </label>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          }
                        );
                      })
                    ) : (
                      <div className={banksuperTab ? "customtab" : "d-none"}>
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

      {allcomment?.map((cur) => {
        if (cur.assignedToRoleID == 4) {
          return (
            <>
              {roleID > 4 ? (
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
                    <span className="btn-collapse">
                      <i class="bi bi-caret-down-fill"></i>
                    </span>
                  </h5>

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
                                  <div
                                    className={
                                      item?.notes ? "inner_form_new " : "d-none"
                                    }
                                  >
                                    <label className="controlform">Notes</label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          class=""
                                          value={item?.notes}
                                          disabled
                                        ></textarea>
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      item?.comment
                                        ? "inner_form_new "
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Comments
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        <textarea
                                          name="Notes"
                                          placeholder="Notes"
                                          class=""
                                          value={item?.comment}
                                          disabled
                                        ></textarea>
                                      </label>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          }
                        );
                      })
                    ) : (
                      <div className={banksuperTab ? "customtab" : "d-none"}>
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

      {allcomment?.map((cur, i) => {
        if (cur.assignedToRoleID == 5) {
          return (
            <>
              {roleID > 5 || cur.assignedToRoleID == roleID ? (
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

                  <div className={analystTab ? "customtab" : "d-none"}>
                    <ul
                      className={
                        cur.applicationActivityData?.length > 1
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
                                index == 0 && tabstatus3
                                  ? "nav-link w-100 border-radius0 active"
                                  : "nav-link w-100 border-radius0 "
                              }
                              id={"analyst" + index}
                              data-bs-toggle="tab"
                              data-bs-target={"#analyst-justified-home" + index}
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
                                    cur?.applicationActivityData.length - index
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
                              {/* {Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map(
                                  (items, actionindex) => {
                                    if (
                                      cur?.assignedToRoleID == 5 &&
                                      index == actionindex
                                    ) {
                                      return ( */}
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
                                                        items?.actionStatusName == "Approved" || items?.actionStatusName == "Reject" || items?.actionStatusName == "Cancelled" ? "Assigned" :  items?.actionStatusName
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
                                                {items?.actionRoleName != null  ?   <i
                                                    className="bi bi-info-circle icons-info"
                                                    title={`Role : ${items?.actionRoleName}`}
                                                  ></i> : ""}
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionUserName
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
                                                      ).format("L")}
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div
                                            className={
                                              items?.actionComment
                                                ? "inner_form_new "
                                                : "d-none"
                                            }
                                          >
                                            <label className="controlform">
                                              Action Note
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={items?.actionNotes}
                                                />
                                              </label>
                                            </div>
                                          </div>

                                          <div
                                            className={
                                              items?.actionComment
                                                ? "inner_form_new "
                                                : "d-none"
                                            }
                                          >
                                            <label className="controlform">
                                              Action Comment
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={items?.actionComment}
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

                              <div
                                className={
                                  items?.statusName
                                    ? "inner_form_new "
                                    : "d-none"
                                }
                              >
                                <label className="controlform">
                                  Analyst Recommendation
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      type="text"
                                      className=""
                                      disabled
                                      // value={items?.statusName}
                                      value={applicationDetail?.analystRecommendationName}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div
                                className={
                                  applicationDetail?.analystDescription
                                    ? "inner_form_new "
                                    : "d-none"
                                }
                              >
                                <label className="controlform">
                                  Analyst Description
                                </label>
                                <div className="form-bx">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        applicationDetail?.analystDescription,
                                    }}
                                    className="analyst_desc"
                                  ></div>
                                </div>
                              </div>

                              <div
                                className={
                                  items?.notes ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.notes}
                                      disabled
                                    ></textarea>
                                  </label>
                                </div>
                              </div>
                              <div
                                className={
                                  items?.comment ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Comments</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.comment}
                                      disabled
                                    ></textarea>
                                  </label>
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

      {allcomment?.map((cur, i) => {
        if (cur.assignedToRoleID == 6) {
          return (
            <>
              {roleID > 6 || cur.assignedToRoleID == roleID ? (
                <>
                  <h5
                    className={
                      sranalystTab
                        ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                        : "section_top_subheading mt-3 py-3 cursorpointer"
                    }
                    onClick={() => setsranalystTab(!sranalystTab)}
                  >
                    Senior Analyst{" "}
                    <span className="btn-collapse">
                      <i className="bi bi-caret-down-fill"></i>
                    </span>
                  </h5>

                  <div className={sranalystTab ? "customtab" : "d-none"}>
                    <ul
                      className={
                        cur.applicationActivityData.length > 1
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
                                    cur?.applicationActivityData.length - index
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
                              {/* {Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map((items, actionindex) => {
                                  if (cur?.assignedToRoleID == 6 && index == actionindex ) {
                                    return ( */}
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
                                            value={items?.actionStatusName}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm ">
                                      <label className="controlform-sm">
                                        User{" "}
                                        {items?.actionRoleName != null  ? <i
                                          className="bi bi-info-circle icons-info"
                                          title={`Role : ${items?.actionRoleName}`}
                                        ></i> : "" }
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
                                            ).format("L")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className={
                                    items?.actionComment
                                      ? "inner_form_new "
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Note
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <input
                                        type="text"
                                        className=""
                                        disabled
                                        value={items?.actionNotes}
                                      />
                                    </label>
                                  </div>
                                </div>

                                <div
                                  className={
                                    items?.actionComment
                                      ? "inner_form_new "
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Comment
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <input
                                        type="text"
                                        className=""
                                        disabled
                                        value={items?.actionComment}
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
                                      name="Notes"
                                      className=""
                                      value={
                                        items?.statusName
                                          ? items?.statusName
                                          : ""
                                      }
                                      disabled
                                    />
                                  </label>
                                </div>
                              </div> */}

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
                                      // value={items?.statusName}
                                      value={applicationDetail?.analystRecommendationName}
                                    />
                                  </label>
                                </div>
                              </div>
                              <div
                                className={
                                  items?.notes ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.notes}
                                      disabled
                                    ></textarea>
                                  </label>
                                </div>
                              </div>
                              <div
                                className={
                                  items?.comment ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Comments</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.comment}
                                      disabled
                                    ></textarea>
                                  </label>
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

      {allcomment?.map((cur, i) => {
        if (cur.assignedToRoleID == 7) {
          return (
            <>
              {roleID > 7 || cur.assignedToRoleID == roleID ? (
                <>
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

                  <div className={principalanalystTab ? "customtab" : "d-none"}>
                    <ul
                      className={
                        cur.applicationActivityData.length > 1
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
                                    cur?.applicationActivityData.length - index
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
                              {/* <div className="inner_form_new ">
                                <label className="controlform">
                                  Principal Analyst Recommendation
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.statusName}
                                      disabled
                                    />
                                  </label>
                                </div>
                              </div> */}

                              {/* {Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map(
                                  (items, actionindex) => {
                                    if (
                                      cur?.assignedToRoleID == 7 &&
                                      index == actionindex
                                    ) {
                                      return ( */}
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
                                                        items?.actionStatusName
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
                                                  {items?.actionRoleName != null  ?   <i
                                                    className="bi bi-info-circle icons-info"
                                                    title={`Role : ${items?.actionRoleName}`}
                                                  ></i> : ""}
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionUserName
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
                                                      ).format("L")}
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div
                                            className={
                                              items?.actionComment
                                                ? "inner_form_new "
                                                : "d-none"
                                            }
                                          >
                                            <label className="controlform">
                                              Action Note
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={items?.actionNotes}
                                                />
                                              </label>
                                            </div>
                                          </div>

                                          <div
                                            className={
                                              items?.actionComment
                                                ? "inner_form_new "
                                                : "d-none"
                                            }
                                          >
                                            <label className="controlform">
                                              Action Comment
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={items?.actionComment}
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
                                      value={applicationDetail?.analystRecommendationName}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div
                                className={
                                  items?.notes ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.notes}
                                      disabled
                                    ></textarea>
                                  </label>
                                </div>
                              </div>
                              <div
                                className={
                                  items?.comment ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Comments</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.comment}
                                      disabled
                                    ></textarea>
                                  </label>
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

      {allcomment?.map((cur, i) => {
        if (cur.assignedToRoleID == 8) {
          return (
            <>
              {roleID > 8 || cur.assignedToRoleID == roleID ? (
                <>
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

                  <div className={deputyTab ? "customtab" : "d-none"}>
                    <ul
                      className={
                        cur.applicationActivityData.length > 2
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
                                    cur?.applicationActivityData.length - index
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
                              id={"ddr-justified-home" + index}
                              role="tabpanel"
                              aria-labelledby={"ddr" + index}
                            >
                              {/* <div className="inner_form_new ">
                                <label className="controlform">
                                  Deputy Director Recommendation
                                </label>
                                <div className="form-bx">
                                  <label>
                                    <input
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.statusName}
                                      disabled
                                    />
                                  </label>
                                </div>
                              </div> */}

                              {/* {Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map((items, actionindex) => {
                                  if (cur?.assignedToRoleID == 8 && index == actionindex ) {
                                    return ( */}
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
                                            value={items?.actionStatusName}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-md-3">
                                    <div className="inner_form_new-sm ">
                                      <label className="controlform-sm">
                                        User{" "}
                                        {items?.actionRoleName != null  ?  <i
                                          className="bi bi-info-circle icons-info"
                                          title={`Role : ${items?.actionRoleName}`}
                                        ></i> : ""}
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
                                            ).format("L")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className={
                                    items?.actionComment
                                      ? "inner_form_new "
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Note
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <input
                                        type="text"
                                        className=""
                                        disabled
                                        value={items?.actionNotes}
                                      />
                                    </label>
                                  </div>
                                </div>

                                <div
                                  className={
                                    items?.actionComment
                                      ? "inner_form_new "
                                      : "d-none"
                                  }
                                >
                                  <label className="controlform">
                                    Action Comment
                                  </label>
                                  <div className="form-bx">
                                    <label>
                                      <input
                                        type="text"
                                        className=""
                                        disabled
                                        value={items?.actionComment}
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
                                      // value={items?.statusName}
                                      value={applicationDetail?.analystRecommendationName}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div
                                className={
                                  items?.notes ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.notes}
                                      disabled
                                    ></textarea>
                                  </label>
                                </div>
                              </div>
                              <div
                                className={
                                  items?.comment ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Comments</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.comment}
                                      disabled
                                    ></textarea>
                                  </label>
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

      {allcomment?.map((cur, i) => {
        if (cur.assignedToRoleID == 9) {
          return (
            <>
              {roleID >= 9 && cur.assignedToRoleID == roleID ? (
                <>
                  <h5
                    className={
                      deputyTab
                        ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                        : "section_top_subheading mt-3 py-3 cursorpointer"
                    }
                    onClick={() => setdirector(!director)}
                  >
                    Director{" "}
                    <span className="btn-collapse">
                      <i className="bi bi-caret-down-fill"></i>
                    </span>
                  </h5>

                  <div className={director ? "customtab" : "d-none"}>
                    <ul
                      className={
                        cur.applicationActivityData.length > 2
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
                                    cur?.applicationActivityData.length - index
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
                              {/* {Actiondata?.map((cur) => {
                                return cur?.applicationActivityData?.map(
                                  (items, actionindex) => {
                                    if (
                                      cur?.assignedToRoleID == 9 &&
                                      index == actionindex
                                    ) {
                                      return ( */}
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
                                                        items?.actionStatusName
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
                                                  {items?.actionRoleName != null  ?  <i
                                                    className="bi bi-info-circle icons-info"
                                                    title={`Role : ${items?.actionRoleName}`}
                                                  ></i> : ""}
                                                </label>
                                                <div className="form-bx-sm">
                                                  <label>
                                                    <input
                                                      type="text"
                                                      className=""
                                                      disabled
                                                      value={
                                                        items?.actionUserName
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
                                                      ).format("L")}
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div
                                            className={
                                              items?.actionComment
                                                ? "inner_form_new "
                                                : "d-none"
                                            }
                                          >
                                            <label className="controlform">
                                              Action Note
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={items?.actionNotes}
                                                />
                                              </label>
                                            </div>
                                          </div>

                                          <div
                                            className={
                                              items?.actionComment
                                                ? "inner_form_new "
                                                : "d-none"
                                            }
                                          >
                                            <label className="controlform">
                                              Action Comment
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={items?.actionComment}
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
                                      // value={items?.statusName}
                                      value={applicationDetail?.analystRecommendationName}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div
                                className={
                                  items?.notes ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Notes</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.notes}
                                      disabled
                                    ></textarea>
                                  </label>
                                </div>
                              </div>
                              <div
                                className={
                                  items?.comment ? "inner_form_new " : "d-none"
                                }
                              >
                                <label className="controlform">Comments</label>
                                <div className="form-bx">
                                  <label>
                                    <textarea
                                      name="Notes"
                                      placeholder="Notes"
                                      className=""
                                      value={items?.comment}
                                      disabled
                                    ></textarea>
                                  </label>
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

      <>
        <h5 className="section_top_subheading mt-3 py-3 btn-collapse_active ">
          Application History{" "}
          {/* <span className="btn-collapse">
              <i class="bi bi-caret-down-fill"></i>
            </span> */}
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
 
}

    </>
  );
};

export default ExportDashboardViewDetails;
