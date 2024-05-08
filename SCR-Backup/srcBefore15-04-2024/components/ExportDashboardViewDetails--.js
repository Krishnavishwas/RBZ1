import axios from "axios";
import React, { useEffect, useState } from "react";
import { APIURL } from "../constant";
import moment from "moment";

const ExportDashboardViewDetails = ({
  applicationDetail,
  applicationmessage,
  handleFormClose,
}) => {
  console.log("applicationDetail", applicationDetail);

  console.log("applicationmessage", applicationmessage);

  return (
    <>
      <h3 className="export-pop-heading">
        {applicationDetail?.rbzReferenceNumber}
      </h3>
      <h5 class="section_top_subheading">General Info</h5>
      <div className="inner_form_new ">
        <label className="controlform">User</label>

        {applicationDetail?.userName ? (
          <div className="form-bx">
            <label>
              <input name="user" value={applicationDetail?.userName} disabled />
              <span className="sspan"></span>
            </label>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* end form-bx  */}

      {applicationDetail?.bankName ? (
        <div className="inner_form_new ">
          <label className="controlform">Name of Bank</label>

          <div className="form-bx">
            <label>
              <input value={applicationDetail?.bankName} disabled />
              <span className="sspan"></span>
            </label>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* end form-bx  */}

      {applicationDetail?.applicationPurpose ? (
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
      ) : (
        ""
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
                value={moment(applicationDetail?.applicationDate).format("ll")}
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
                <option value="">{applicationDetail.applicationType}</option>
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
                    <option value="">{applicationDetail?.currencyCode}</option>
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
              <input value={applicationDetail?.usdEquivalent} disabled />
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
                <option value="">{applicationDetail?.sectorName}</option>
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
                <option>{applicationDetail?.subSectorName}</option>
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

      <div className="inner_form_new ">
        <label className="controlform">Submit to Bank Supervisor</label>

        <input
          type="checkbox"
          className="mt-4"
          checked={applicationDetail?.supervisorName ? true : false}
          disabled
        />
      </div>
      {/* end form-bx  */}

      {applicationDetail?.supervisorName ? (
        <div className="inner_form_new ">
          <label className="controlform">Select Bank Supervisor</label>

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
      )}

      {/* end form-bx  */}

      <h5 className="section_top_subheading">Attachments</h5>

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

      <div className="form-footer mt-5 mb-3">
        {/* <button 
            className="register"
          >
            Reset
          </button> */}
        <button type="button" className="login" onClick={handleFormClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default ExportDashboardViewDetails;
