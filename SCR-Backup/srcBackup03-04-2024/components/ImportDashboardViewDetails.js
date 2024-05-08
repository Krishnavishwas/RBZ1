import React from "react";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import moment from "moment";

const ImportDashboardViewDetails = ({
  applicationDetail,
  applicationmessage,
  handleFormClose,
}) => {
  const { applicantTypes } = ExportformDynamicField();

  const bankName = Storage.getItem("bankName");
  const name = Storage.getItem("name");

  return (
    <>
      <h3 className="export-pop-heading">
        {applicationDetail?.rbzReferenceNumber}
      </h3>
      <h5 class="section_top_subheading">General Info</h5>
      <div className="inner_form_new ">
        <label className="controlform">User</label>
        <div className="form-bx">
          <label>
            <input value={applicationDetail?.userName} disabled />
          </label>
        </div>
      </div>
      <div className="inner_form_new ">
        <label className="controlform">Name of Bank</label>
        <div className="form-bx">
          <label>
            <input value={bankName.replace(/"/g, "")} disabled />
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
                "MM/DD/YYYY"
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
              value={applicationDetail?.pecanNumber}
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
        {/* <div className="form-bx">
          <label>
            <input
              value={applicationDetail?.applicantTypeName}
              className="text-uppercase"
              disabled
            />
          </label>
        </div> */}
      </div>

      {applicationDetail.applicantType == "1" ? (
        <>
          <div className="inner_form_new ">
            <label className="controlform">Company Name</label>
            <div className="form-bx">
              <label>
                <input
                  value={applicationDetail?.companyName}
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
                  value={applicationDetail?.tinNumber}
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
                <input value={applicationDetail?.bpnCode} className="text-uppercase" disabled />
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
              <input value={applicationDetail?.name} disabled />
            </label>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="inner_form_new ">
        <label className="controlform">Application Type</label>
        <div className="form-bx">
          <label>
            <input value={applicationDetail?.applicationType} disabled />
          </label>
        </div>
      </div>

      <div className="inner_form_new ">
        <label className="controlform">Beneficiary Name</label>
        <div className="form-bx">
          <label>
            <input value={applicationDetail?.beneficiaryName} disabled />
          </label>
        </div>
      </div>

      <div className="inner_form_new ">
        <label className="controlform">Baneficiary Country</label>
        <div className="form-bx">
          <label>
            <input value={applicationDetail?.beneficiaryCountryName} disabled />
          </label>
        </div>
      </div>

      {/* {bankID == "" ? (
          <div className="inner_form_new ">
            <label className="controlform">Government Agencies</label>
            <div className="form-bx">
              <label>
                <select
                  ref={govtAgencieRef}
                  name="govtAgencie"
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  className={
                    errors.govtAgencie && ImportForm.govtAgencie === ""
                      ? "error"
                      : ""
                  }
                >
                  <option value="">Select Government Agencies Name</option>
                  {GovernmentAgencies?.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>
                        {item.agencyName}
                      </option>
                    );
                  })}
                </select>
                <span className="sspan"></span>
                {errors.govtAgencie && ImportForm.govtAgencie === "" ? (
                  <small className="errormsg">{errors.govtAgencie}</small>
                ) : (
                  ""
                )}
              </label>
            </div>
          </div>
        ) : (
          ""
        )} */}

      <div className="row">
        <div className="col-md-6">
          <div className="inner_form_new">
            <label className="controlform">Currency</label>
            <div className="form-bx">
              <label>
                <input value={applicationDetail?.currencyCode} disabled />
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
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="inner_form_new-sm">
            <label className="controlform-sm">Rate</label>
            <div className="form-bx-sm">
              <label>
                <input value={applicationDetail?.rate} disabled />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="inner_form_new ">
        <label className="controlform">USD Equivalent</label>
        <div className="form-bx">
          <label>
            <input value={applicationDetail?.usdEquivalent} disabled />
            <span className="sspan"></span>
          </label>
        </div>
      </div>

      <div className="inner_form_new ">
        <label className="controlform">Sector</label>
        <div className="form-bx">
          <label>
            <input value={applicationDetail?.sectorName} disabled />
          </label>
        </div>
      </div>

      <div className="inner_form_new">
        <label className="controlform">Subsector</label>
        <div className="form-bx">
          <label>
            <input value={applicationDetail.subSectorName} disabled />
            <span className="sspan"></span>
          </label>
        </div>
      </div>

      <div className="inner_form_new ">
        <label className="controlform">Applicant Comments</label>
        <div className="form-bx">
          <label>
            <textarea value={applicationDetail?.applicantComment} disabled />
          </label>
        </div>
      </div>

      <h5 className="section_top_subheading">Attachments</h5>

      <div className="form-footer mt-5 mb-3">
        <button type="button" className="login" onClick={handleFormClose}>
          Close
        </button>
      </div>
    </>
  );
};

export default ImportDashboardViewDetails;
