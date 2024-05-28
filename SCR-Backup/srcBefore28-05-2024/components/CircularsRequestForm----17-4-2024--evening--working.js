import React, { useEffect, useRef, useState } from "react";
import { Storage } from "../login/Storagesetting";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import { APIURL, ImageAPI } from "../constant";
import { toast } from "react-toastify";
import { MultiSelect } from 'primereact/multiselect';


const CircularsRequestForm = ({ handleFormClose,handledata }) => {

  // const purposeApplicationRef = useRef(null);
  const userID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const roleID = Storage.getItem("roleIDs");
  const bankidcheck = bankID !== "" ? "1" : "3";
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [errors, setErrors] = useState({});
  const [checkAnalyst, setAnalyst] = useState(false);
  const [selectedBankOption, setSelectedBankOption] = useState([]);
  const [selectedDirectivesOpt, setSelectedDirectivesOpt] = useState(null);
  const [analystUser, setAnalystUser] = useState([]);
  const [file, setFile] = useState([]);
  const [otherfiles, setOtherfiles] = useState([]);
  const [releasingDate, setReleasingDate] = useState(new Date());
  const [futureDate, setFutureDate] = useState(new Date());
  const [exportForm, setExportForm] = useState({
    name: "",
    subject: "",
    content: "",
    circularReference: "",
    directiveSelectValue: [],
    bankSelectValue: [],
    analyst: "",
  });

  const handelAnalystCheck = () => {
    setAnalyst(!checkAnalyst)
  }

  const changeHandelForm = (e) => {
    const { name, value } = e.target;
    let newErrors = {};

    // const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;
    const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const spaceCheck = /\s{2,}/g;


    if (name == "name" && specialCharsOLD.test(value)) {
      newErrors.name = "Special characters not allowed.";
    } else if (name == "name" && value.charAt(0) === " ") {
      newErrors.name = "First character cannot be a blank space";
    } else if (name == "name" && spaceCheck.test(value)) {
      newErrors.name = "Multiple space not allow.";
    }
    else {
      setExportForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setErrors(newErrors);
  };
  //---------- End form fill data handle

  //---bank data start
  const bankData = async () => {
    await axios
      .post(APIURL + 'Master/GetMasterBank')
      .then((res) => {
        setSelectedBankOption(res.data.responseData)

      })
  }

  const panelFooterTemplate = () => {
    const length = exportForm.bankSelectValue ? exportForm.bankSelectValue.length : 0;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> item{length > 1 ? 's' : ''} selected.
      </div>
    );
  };
  const onShow = () => {
    // Wait for the component to be mounted before accessing the DOM
    setTimeout(() => {
      let selectAllCheckbox = document.querySelector(".p-multiselect-header > .p-multiselect-select-all");
      if (selectAllCheckbox) {
        selectAllCheckbox.after(" Select All");
      }
    }, 0);
  };
  //---bank data end

  //---------director start 
  const directivesData = async () => {
    await axios
      .post(APIURL + 'Admin/GetAllDirectives')
      .then((res) => {
        setSelectedDirectivesOpt(res.data.responseData)

      })
  }
  //---------director end
  //--------analyst user api start
  const analystUserFun = async () => {
    await
      axios.post(APIURL + 'User/GetSupervisors', {
        BankID: bankID,
        RoleID: roleID,
        UserID: userID
      }).then((res) => {
        setAnalystUser(res.data.responseData)
      })
  }
  //--------analyst user api end
  // file change start
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    console.log("file", file);
    setFile((PrevFile) => [...PrevFile, { file }])

  }
  console.log("fileshreya", file);
  // file change end
  //---------- Start Code For Add More File Option Field
  const handleAddMore = (e) => {

    setOtherfiles([...otherfiles, null]);
  };
  //---------- End Code For Add More File Option Field
  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    if (exportForm.name === "") {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (exportForm.subject === "") {
      newErrors.subject = "Subject is required";
      valid = false;
    }
    if (exportForm.content === "") {
      newErrors.content = "Content is required";
      valid = false;
    }
    if (exportForm.circularReference === "") {
      newErrors.circularReference = "Circular reference is required";
      valid = false;
    }
    if (exportForm.directiveSelectValue.length == '0') {
      newErrors.directiveSelectValue = "Directive is required";
      valid = false;
    } if (exportForm.bankSelectValue.length == '0') {
      newErrors.bankSelectValue = "Bank is required";
      valid = false;
    }
    if (releasingDate == null) {
      newErrors.releasingDate = "Releasing date is required";
      valid = false;
    }
    if (releasingDate == null) {
      newErrors.releasingDate = "Releasing date is required";
      valid = false;
    } if (checkAnalyst == true && exportForm.analyst == '') {
      newErrors.analyst = "Please select analyst";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  console.log("otherfiles", otherfiles);
  //---------- End Code For Check Validation for Form Field
  const bankSelectedID = exportForm?.bankSelectValue.map((res) => res.id);
  const directiveSelectedID = exportForm?.directiveSelectValue.map((res) => res.directiveID);


  const HandleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      UserID: userID.replace(/"/g, ""),
      RoleID: roleID,
      Name: exportForm.name,
      // BankID: '"'+bankSelectedID.join()+'"',
      BankID: bankSelectedID.join(),
      Subject: exportForm.subject,
      Content: exportForm.content,
      DirectiveID: directiveSelectedID.join(),
      CircularReferenceNumber: exportForm.circularReference,
      AssignedTo: checkAnalyst ? exportForm.analyst : userID.replace(/"/g, ""),
      AssignedToRoleID: checkAnalyst ? "6" : roleID,
      FutureDate: futureDate,
      ReleasingDate: releasingDate

    }
    console.log("exportFormINSUBMIT", data);
    if (validateForm()) {
      await axios
        .post(APIURL + "Circular/CreateCircular", data)
        .then((res) => {
          console.log("res", res);
          if (res.data.responseCode === '200') {
            toast.success(res.data.responseMessage, { autoClose: 2000 })
            handledata();
            setTimeout(() => {
              setToastDisplayed(false)
              handleFormClose()
              setExportForm({
                name: "",
                subject: "",
                content: "",
                circularReference: "",
                directiveSelectValue: [],
                bankSelectValue: [],
                analyst: "",
              })
            }, 2500)

          } else {
            toast.error(res.data.responseMessage, { autoClose: 2000 })
            setTimeout(() => {
              setToastDisplayed(false);
            }, 2500)
          }
        })
        .catch((err) => {
          console.log(err);

        });
    } else {
      if (!toastDisplayed) {
        toast.warning("Please fill all fields");
      }
      setToastDisplayed(true);
    }
  };

  const ResetHandleData = () => {
    setExportForm({
      name: "",
      subject: "",
    });
    setErrors({});

  };


  useEffect(() => {
    if (toastDisplayed) {
      setTimeout(() => {
        setToastDisplayed(false);
      }, 1500);
    }
    bankData();
    directivesData();
    analystUserFun();
  }, [toastDisplayed]);

  // ----- End Code For Geting Table Data
  // console.log("exportForm.analyst", exportForm.analyst);
  return (
    <>
      <form className="circular-form">
        <div className="inner_form_new ">
          <label className="controlform">Name</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                value={exportForm.name}
              />
              <span className="sspan"></span>
            </label>
            {errors?.name ? (
              <span className="errormsg">
                {errors?.name}
              </span>
            ) : ""}
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Content</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="content"
                placeholder="Content"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                value={exportForm.content}
              />
              <span className="sspan"></span>
            </label>
            {errors?.content ? (
              <span className="errormsg">
                {errors?.content}
              </span>
            ) : ""}
          </div>
        </div>
        {/* end form-bx  */}
        <div className="inner_form_new ">
          <label className="controlform">Circular Reference</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="circularReference"
                placeholder="Circular Reference"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                value={exportForm.circularReference}
              />
              <span className="sspan"></span>
            </label>
            {errors?.circularReference ? (
              <span className="errormsg">
                {errors?.circularReference}
              </span>
            ) : ""}
          </div>
        </div>
        {/* end form-bx  */}
        <div className="inner_form_new ">
          <label className="controlform">Bank</label>
          <div className="form-bx">
            <div className="multiselect flex justify-content-center">
              <MultiSelect
                value={exportForm.bankSelectValue}
                options={selectedBankOption}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                optionLabel="bankName"
                placeholder="Select Banks"
                name="bankSelectValue"
                panelFooterTemplate={panelFooterTemplate}
                display="chip"
                onShow={onShow}
              />
              {errors?.bankSelectValue ? (
                <span className="errormsg">
                  {errors?.bankSelectValue}
                </span>
              ) : ""}
            </div>
          </div>
        </div>
        {/* end form-bx  */}
        <div className="inner_form_new ">
          <label className="controlform">Subject</label>
          <div className="form-bx">
            <label>
              <textarea
                name="subject"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder="Subject"
                value={exportForm.subject}
              />
              <span className="sspan"></span>

            </label>
            {errors?.subject ? (
              <small className="errormsg">{errors.subject}</small>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Directives</label>
          <div className="form-bx">
            <div className="multiselect flex justify-content-center">
              <MultiSelect
                value={exportForm.directiveSelectValue}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                options={selectedDirectivesOpt}
                optionLabel="directiveName"
                filter
                name="directiveSelectValue"
                placeholder="Select Directives"
                display="chip"
              // maxSelectedLabels={3}
              />
              {errors?.directiveSelectValue ? (
                <small className="errormsg">{errors.directiveSelectValue}</small>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {/* end form-bx  */}
        <div className="inner_form_new ">
          <label className="controlform">Releasing Date</label>
          <div className="form-bx">
            <DatePicker
              placeholderText="Select Releasing Date"
              closeOnScroll={(e) => e.target === document}
              selected={releasingDate}
              onChange={(date) => setReleasingDate(date)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              minDate={new Date()}
              dropdownMode="select"
              dateFormat="dd/MMMM/yyyy"
            />
            {
              errors?.releasingDate ? (
                <small className="errormsg">{errors.releasingDate}</small>
              ) : (" ")
            }
          </div>
        </div>
        {/* end form-bx  */}
        {/* <div className="inner_form_new ">
          <label className="controlform">Future Date</label>
          <div className="form-bx">
            <DatePicker
              placeholderText="Select Future Date"
              closeOnScroll={(e) => e.target === document}
              selected={futureDate}
              onChange={(date) => setFutureDate(date)}
              peekNextMonth
              showMonthDropdown
              minDate={new Date()}
              showYearDropdown
              dropdownMode="select"
              dateFormat="dd/MMMM/yyyy"
            />
          </div>
        </div> */}
        {/* end form-bx  */}
        <div className="inner_form_new ">
          <label className="controlform">Assign to Analyst</label>
          <input
            type="checkbox"
            onChange={(e) => {
              handelAnalystCheck(e);
            }}
          />
        </div>
        {/* end form-bx  */}
        {checkAnalyst == true ?
          <div className="inner_form_new ">
            <label className="controlform">Select Analyst</label>

            <div className="form-bx">
              <label>
                <select
                  name="analyst"
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  value={exportForm.analyst}
                >
                  <option value="" selected>
                    Select Analyst
                  </option>
                  {
                    analystUser?.map((item, index) => {
                      return (
                        <option value={item.userID} key={index}>
                          {item.name}
                        </option>
                      )
                    })
                  }
                </select>
                <span className="sspan"></span>
                {errors.analyst ? (<small className="errormsg" style={{ bottom: "-22px" }}>{errors.analyst}</small>) : (" ")}
              </label>
            </div>
          </div>
          : " "}
        {/* upload file start */}
        {/* <h5 className="section_top_subheading mt-3">Attachments</h5>
        
        <div className="attachemt_form-bx" >
          <label>
            <i className="bi bi-forward"></i>
            File
          </label>
          <div className="browse-btn">
            Browse{" "}
            <input
              type="file"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          <span className="filename">
            {file.find((f) => f.name === file?.name)?.file?.name ||
              "No file chosen"}

          </span>


        </div> */}
        {/* other file start */}
        {/* {otherfiles.map((file, index) => (
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
              {file.find((f) => f.label === "other" + (index + 1))?.file?.name ||
                "No file chosen"}
            </span> 

           

          </div>
        ))} */}
        {/* other file end */}
        {/* <button
            type="button"
            className="addmore-btn"
            onClick={(e) => handleAddMore(e)}
          >
            {" "}
            Add More File{" "}
          </button> */}
        {/* upload file end */}
        <div className="form-footer mt-5 mb-3 justify-content-end">
          {/* <button
            type="reset"
            onClick={(e) => {
              ResetHandleData(e);
            }}
            className="register"
          >
            Reset
          </button> */}
          <button
            type="button"
            onClick={(e) => {
              HandleSubmit(e);
            }}
            className="login"
            disabled={toastDisplayed ? true : false}
          >
            Submit
          </button>
        </div>

      </form>

    </>
  );
};

export default CircularsRequestForm;
