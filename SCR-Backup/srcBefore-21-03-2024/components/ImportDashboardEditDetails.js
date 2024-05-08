import React, { useEffect, useRef, useState } from "react";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ImportDashboardEditDetails = ({
  applicationDetail,
  setApplicationDetail,
  EditModalClose,
  handleData,
}) => {
  const {
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData,
    masterBank,
    Supervisors,
    applicantName,
    countries,
  } = ExportformDynamicField();

  const BPNCodeRef = useRef(null);
  const TINRef = useRef(null);
  const amountRef = useRef(null);
  const applicantRef = useRef(null);
  const BeneficiaryNameRef = useRef(null);
  const applicantCommentsRef = useRef(null);
  const applicantReferenceNumberRef = useRef(null);
  const applicationTypeRef = useRef(null);
  const bankSupervisorRef = useRef(null);
  const companyNameRef = useRef(null);
  const currencyRef = useRef(null);
  const govtAgencieRef = useRef(null);
  const purposeApplicationRef = useRef(null);
  const relatedexchangeControlNumberRef = useRef(null);
  const sectorRef = useRef(null);
  const subsectorRef = useRef(null);
  const typeExporterRef = useRef(null);
  const rateRef = useRef(null);
  const usdEquivalentRef = useRef(null);
  const PECANNumberRef = useRef(null);

  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const userName = Storage.getItem("userName");
  const bankName = Storage.getItem("bankName");
  const bankidcheck = bankID !== "" ? "1" : "3";

  const [attachmentData, setAttachmentData] = useState([]);
  const [otherfiles, setOtherfiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [registerusertype, setregisterusertype] = useState(bankidcheck);
  const [subsectorData, setsubsectorData] = useState([]);
  const [checkSupervisor, setcheckSupervisor] = useState(false);
  const [curRate, setCurrate] = useState();
  const [applicationType, setapplicationType] = useState([]);
  const [getCompanyName, setgetCompanyName] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [getCompanyId, setgetCompanyId] = useState("");
  const [value, setValue] = useState("");
  const [ImportForm, setImporttForm] = useState({
    user: "",
    bankName: bankName,
    purposeApplication: "",
    PECANNumber: "",
    typeExporter: "",
    BeneficiaryName: "",
    baneficiaryCountry: "",
    govtAgencie: "",
    BPNCode: "",
    TINNumber: "",
    applicant: "",
    applicantReferenceNumber: "",
    applicationType: "",
    exporterType: registerusertype,
    currency: "",
    amount: "",
    rate: "",
    usdEquivalent: "",
    relatedexchangeControlNumber: "",
    sector: "",
    subsector: "",
    applicantComments: "",
    bankSupervisor: "",
  });

  const SearchableDropdown = ({
    options,
    label,
    id,
    selectedVal,
    handleChange,
  }) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    useEffect(() => {
      document.addEventListener("click", toggle);
      return () => document.removeEventListener("click", toggle);
    }, []);

    const selectOption = (option) => {
      setQuery(() => "");
      handleChange(option[label]);
      setIsOpen((isOpen) => !isOpen);
      setgetCompanyId(option.id);
    };

    function toggle(e) {
      setIsOpen(
        (e && e.target === inputRef.current) || e.pointerType === "mouse"
      );
    }

    const getDisplayValue = () => {
      if (query) return query;
      if (selectedVal) return selectedVal;
      return "";
    };
    setgetCompanyName(selectedVal);

    const filter = (options) => {
      if (Array.isArray(options) && options.length > 0 && query.length >= 3) {
        return options.filter(
          (option) =>
            option[label]?.toLowerCase().indexOf(query.toLowerCase()) > -1
        );
      } else {
        return [];
      }
    };

    return (
      <div className="dropdownExpComName">
        <div className="control">
          <div className="selected-value">
            <input
              className="borderdisplaynone"
              ref={inputRef}
              type="text"
              placeholder={applicationDetail?.companyName}
              value={getDisplayValue()}
              name="searchTerm"
              onChange={(e) => {
                setQuery(e.target.value);
                handleChange(null);
              }}
              onClick={toggle}
            />
          </div>
        </div>

        <div className={`options ${isOpen ? "open" : ""}`}>
          {filter(options).map((option, index) => {
            return (
              <div
                onClick={() => selectOption(option)}
                className={`option ${
                  option[label] === selectedVal ? "selected" : ""
                }`}
                key={`${id}-${index}`}
              >
                {option[label]}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const convertedRate = curRate * parseFloat(ImportForm.amount);

  const changeHandelForm = (e) => {
    console.log(e);
  };

  console.log("applicationDetail - ", applicationDetail);

  return (
    <>
      <h3 className="export-pop-heading">
        {applicationDetail?.rbzReferenceNumber
          ? applicationDetail?.rbzReferenceNumber
          : ""}
      </h3>
      <h5 class="section_top_subheading">General Info</h5>
      <form>
        <div className="inner_form_new ">
          <label className="controlform">Name of Bank</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="user"
                value={bankName.replace(/"/g, "")}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                disabled
              />
              <span className="sspan"></span>
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Application Date</label>
          <div className="form-bx">
            <DatePicker
              closeOnScroll={(e) => e.target === document}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              peekNextMonth
              showMonthDropdown
              minDate='01/01/2018'
              maxDate={new Date()}
              showYearDropdown
              dropdownMode="select"
            />
            <span className="sspan"></span>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">
            Prior Exchange Control Authority Number(PECAN)
          </label>
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex">
                <div className="form-bx">
                  <label>
                    <input
                      ref={PECANNumberRef}
                      type="text"
                      name="PECANNumber"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      value={ImportForm?.PECANNumber?.trim()}
                      placeholder={applicationDetail?.pecanNumber}
                      className={
                        errors.PECANNumber
                          ? "text-uppercase error"
                          : "text-uppercase"
                      }
                    />
                    <span className="sspan"></span>
                    {errors.PECANNumber ? (
                      <small className="errormsg">{errors.PECANNumber}</small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
                <button type="button" className="primrybtn  v-button">
                  Validate
                </button>
              </div>
            </div>
            <div className="col-md-3 text-right"></div>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Type of Importer</label>
          <div className="form-bx-radio mt-4">
            {applicantTypes.map((item, index) => {
              return (
                <>
                  <label key={index}>
                    <input
                      type="radio"
                      ref={typeExporterRef}
                      onChange={(e) => {
                        changeHandelForm(e);
                        // handleUsertype(e);
                      }}
                      name="importType"
                      value={item.id}
                      checked={registerusertype == item.id}
                      disabled={
                        bankID != "" && item.id === 3
                          ? true
                          : bankidcheck === "3"
                          ? true
                          : false
                      }
                    />
                    <span>{item.name}</span>
                  </label>
                </>
              );
            })}
          </div>
        </div>
        {/* end form-bx  */}

        {registerusertype === "1" && bankID !== "" ? (
          <>
            <div className="inner_form_new ">
              <label className="controlform">Company Name</label>
              <div className="form-bx">
                <SearchableDropdown
                  options={companies}
                  label="companyName"
                  id={companies[value]}
                  selectedVal={value}
                  handleChange={(val) => {
                    setValue(val);
                  }}
                />
                {errors.companyName &&
                (getCompanyName === "Company Name" ||
                  getCompanyName == null) ? (
                  <small className="errormsg">{errors.companyName}</small>
                ) : (
                  ""
                )}
                <small className="informgs">
                  Please provide at least 3 characters for auto search of
                  Company Name.
                </small>
              </div>
            </div>
            <div className="inner_form_new ">
              <label className="controlform">TIN Number</label>
              <div className="form-bx">
                <label>
                  <input
                    type="text"
                    name="TINNumber"
                    placeholder={applicationDetail?.tinNumber}
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    value={ImportForm.TINNumber?.trim()}
                    className={
                      errors.BPNCode ? "error text-uppercase" : "text-uppercase"
                    }
                  />
                  <span className="sspan"></span>
                  {errors.TINNumber ? (
                    <small className="errormsg">{errors.TINNumber}</small>
                  ) : (
                    ""
                  )}
                </label>
              </div>
            </div>
            <div className="inner_form_new ">
              <label className="controlform">BPN Code</label>
              <div className="form-bx">
                <label>
                  <input
                    ref={BPNCodeRef}
                    type="text"
                    name="BPNCode"
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    value={ImportForm.BPNCode?.trim()}
                    placeholder={applicationDetail?.BPNCode}
                    className={
                      errors.BPNCode ? "error text-uppercase" : "text-uppercase"
                    }
                  />
                  <span className="sspan"></span>
                  {errors.BPNCode ? (
                    <small className="errormsg">{errors.BPNCode}</small>
                  ) : (
                    ""
                  )}
                </label>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        {/* end form-bx  */}

        {registerusertype === "2" && bankID !== "" ? (
          <>
            <div className="inner_form_new ">
              <label className="controlform">Applicant</label>
              <div className="form-bx">
                <label>
                  <input
                    type="text"
                    ref={applicantRef}
                    name="applicant"
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    placeholder={applicationDetail?.name}
                    value={ImportForm.applicant}
                    className={errors.applicant ? "error" : ""}
                  />
                  <span className="sspan"></span>
                  {errors.applicant || ImportForm.applicant === "" ? (
                    <small className="errormsg">{errors.applicant}</small>
                  ) : (
                    ""
                  )}
                </label>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Application Type</label>
          <div className="form-bx">
            <label>
              <select
                ref={applicationTypeRef}
                name="applicationType"
                placeholder={applicationDetail?.applicationType}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                className={
                  errors.applicationType && ImportForm.applicationType === ""
                    ? "error"
                    : ""
                }
              >
                <option value="">{applicationDetail?.applicationType}</option>
                {applicationType?.map((item, ind) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
              {errors.applicationType && ImportForm.applicationType === "" ? (
                <small className="errormsg">{errors.applicationType}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Beneficiary Name</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                ref={BeneficiaryNameRef}
                name="BeneficiaryName"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder={applicationDetail?.beneficiaryName}
                value={ImportForm.BeneficiaryName}
              />
              <span className="sspan"></span>
              {errors.BeneficiaryName || ImportForm.BeneficiaryName === "" ? (
                <small className="errormsg">{errors.BeneficiaryName}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Baneficiary Country</label>
          <div className="form-bx">
            <label>
              <select
                // ref={applicationTypeRef}
                name="baneficiaryCountry"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                // className={
                //   errors.baneficiaryCountry && ImportForm.baneficiaryCountry === ""
                //     ? "error"
                //     : ""
                // }
              >
                <option value="">{applicationDetail?.beneficiaryCountryName}</option>
                {countries?.map((item, ind) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.countryName}
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        {bankID === "" ? (
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
        )}
        {/* end form-bx  */}

        <div className="row">
          <div className="col-md-6">
            <div className="inner_form_new">
              <label className="controlform">Currency</label>
              <div className="form-bx">
                <label>
                  <select
                    ref={currencyRef}
                    name="currency"
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    className={
                      errors.currency && ImportForm.currency === ""
                        ? "error"
                        : ""
                    }
                  >
                    <option value="">{applicationDetail?.currencyCode}</option>
                    {currency?.map((cur, ind) => {
                      return (
                        <option key={cur.id} value={cur.id}>
                          {cur.currencyCode}
                        </option>
                      );
                    })}
                  </select>
                  <span className="sspan"></span>
                  {errors.currency && ImportForm.currency === "" ? (
                    <small className="errormsg">{errors.currency}</small>
                  ) : (
                    ""
                  )}
                </label>
              </div>
            </div>
            {/* end form-bx  */}
          </div>

          <div className="col-md-3">
            <div className="inner_form_new-sm">
              <label className="controlform-sm">Amount</label>
              <div className="form-bx-sm">
                <label>
                  <input
                    ref={amountRef}
                    type="number"
                    min={0}
                    name="amount"
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    placeholder={applicationDetail?.amount}
                    className={
                      errors.amount && ImportForm.amount === "" ? "error" : ""
                    }
                  />
                  <span className="sspan"></span>
                  {errors.amount && ImportForm.amount === "" ? (
                    <small className="errormsg">{errors.amount}</small>
                  ) : (
                    ""
                  )}
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
                  <input
                    ref={rateRef}
                    type="text"
                    name="rate"
                    value={ImportForm?.currency ? curRate : applicationDetail?.rate}
                    // onChange={(e) => {
                    //   changeHandelForm(e);
                    // }}
                    disabled
                  />
                  <span className="sspan"></span>
                </label>
              </div>
            </div>
            {/* end form-bx  */}
          </div>
        </div>

        <div className="inner_form_new ">
          <label className="controlform">USD Equivalent</label>
          <div className="form-bx">
            <label>
              <input
                ref={usdEquivalentRef}
                type="text"
                name="usdEquivalent"
                value={
                  ImportForm.currency && ImportForm.amount
                    ? convertedRate.toFixed(2)
                    : applicationDetail?.usdEquivalent
                }
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                disabled
              />
              <span className="sspan"></span>
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Sector</label>
          <div className="form-bx">
            <label>
              <select
                ref={sectorRef}
                name="sector"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                className={
                  errors.sector && ImportForm.sector === "" ? "error" : ""
                }
              >
                <option value="">{applicationDetail?.sectorName !== "" ? applicationDetail?.sectorName : "Select Sector"}</option>
                {sectorData?.map((item, ind) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.sectorName}
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
              {errors.sector && ImportForm.sector === "" ? (
                <small className="errormsg">{errors.sector}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new">
          <label className="controlform">Subsector</label>
          <div className="form-bx">
            <label>
              <select
                ref={subsectorRef}
                name="subsector"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                disabled={applicationDetail?.subSectorName === "" ? true : false}
                className={
                  errors.subsector && ImportForm.subsector === "" ? "error" : ""
                }
              >
                <option>{applicationDetail?.subSectorName !== "" ? applicationDetail?.subSectorName : "Select Subsector"}</option>
                {subsectorData?.map((item, index) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.subSectorName}
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
              {errors.subsector && ImportForm.subsector === "" ? (
                <small className="errormsg">{errors.subsector}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Applicant Comments</label>
          <div className="form-bx">
            <label>
              <textarea
                ref={applicantCommentsRef}
                name="applicantComments"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder={applicationDetail?.applicantComment}
                className={errors.applicantComments ? "error" : ""}
              />
              <span className="sspan"></span>
              {errors.applicantComments ||
              ImportForm.applicantComments === "" ? (
                <small className="errormsg">{errors.applicantComments}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Submit to Bank Supervisor</label>
          <input
            type="checkbox"
            className="mt-4"
            // onChange={(e) => {
            //   HandelSupervisorcheck(e);
            // }}
          />
        </div>
        {/* end form-bx  */}

        {checkSupervisor === true ? (
          <div className="inner_form_new ">
            <label className="controlform">Select Bank Supervisor</label>
            <div className="form-bx">
              <label>
                <select
                  ref={bankSupervisorRef}
                  name="bankSupervisor"
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  className={
                    errors.bankSupervisor && ImportForm.bankSupervisor === ""
                      ? "error"
                      : ""
                  }
                >
                  <option value="" selected>
                    Select Bank Supervisor
                  </option>
                  {Supervisors?.map((item, index) => {
                    return (
                      <option key={index} value={item.userID}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <span className="sspan"></span>
                {errors.bankSupervisor && ImportForm.bankSupervisor === "" ? (
                  <small className="errormsg">{errors.bankSupervisor}</small>
                ) : (
                  ""
                )}
              </label>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* end form-bx  */}

        <h5 className="section_top_subheading">Attachments</h5>

        {attachmentData?.map((items, index) => {
          return (
            <div className="attachemt_form-bx" key={items.id}>
              <label>
                <i className="bi bi-forward"></i>
                {items.name}
              </label>
              <div className="browse-btn">
                Browse{" "}
                <input
                  type="file"
                  //   onChange={(e) => handleFileChange(e, items.id)}
                />
              </div>
              <span className="filename">
                {files.find((f) => f.id === items?.id)?.file?.name ||
                  "No file chosen"}
              </span>
            </div>
          );
        })}

        {otherfiles.map((file, index) => (
          <div key={"other" + (index + 1)} className="attachemt_form-bx">
            <label>
              <i className="bi bi-forward"></i> Other File {index + 1}
            </label>
            <div className="browse-btn">
              Browse{" "}
              <input
                type="file"
                // onChange={(e) => {
                //   handleFileChange(e, "other" + (index + 1));
                //   handleOthrefile(e, "other" + (index + 1));
                // }}
              />
            </div>
            <span className="filename">
              {files.find((f) => f.id === "other" + (index + 1))?.file?.name ||
                "No file chosen"}
            </span>
          </div>
        ))}

        {attachmentData?.length ? (
          <button
            type="button"
            className="addmore-btn"
            // onClick={(e) => handleAddMore(e)}
          >
            Add More File
          </button>
        ) : (
          ""
        )}

        <div className="form-footer mt-5 mb-3">
          <button
            type="reset"
            // onClick={(e) => {
            //   ResetHandleData(e);
            // }}
            className="register"
          >
            Reset
          </button>
          <button
            type="button"
            // onClick={(e) => {
            //   HandleSubmit(e);
            // }}
            className="login"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default ImportDashboardEditDetails;
