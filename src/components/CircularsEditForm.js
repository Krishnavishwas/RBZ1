import React, { useEffect, useRef, useState } from "react";
import { Storage } from "../login/Storagesetting";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import { APIURL, ImageAPI } from "../constant";
import { toast } from "react-toastify";
import { MultiSelect } from 'primereact/multiselect';


const CircularsEditForm = ({ handleEditModalClose, circularID, handleCircularListData }) => {

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
    const [releasingDate, setReleasingDate] = useState(new Date());
    const [futureDate, setFutureDate] = useState(new Date());
    const [exportForm, setExportForm] = useState({
        name: "",
        subject: "",
        content: "",
        circularReferenceNumber: "",
        directiveData: [],
        bankData: [],
        analyst: "",
    });

    //--------Edit BY Id Api Call start
    const editBYID = async () => {
        await axios.post(APIURL + 'Circular/GetCircularDataByID', {
            id: circularID
        }).then((res) => {
            setExportForm(res.data.responseData);
            console.log("res", res);
        })
    }
    //--------Edit BY Id Api Call end
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
        const length = exportForm.bankData ? exportForm.bankData.length : 0;

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

        if (exportForm.directiveData.length == '0') {
            newErrors.directiveData = "Directive is required";
            valid = false;
        } if (exportForm.bankData.length == '0') {
            newErrors.bankData = "Bank is required";
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


    //---------- End Code For Check Validation for Form Field
    const bankSelectedID = exportForm?.bankData?.map((res) => res.id);
    const directiveSelectedID = exportForm?.directiveData?.map((res) => res.id);

    const HandleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ID: circularID,
            UserID: userID.replace(/"/g, ""),
            Name: exportForm.name,
            BankID: bankSelectedID.join(),
            Subject: exportForm.subject,
            Content: exportForm.content,
            DirectiveID: directiveSelectedID.join(),
            AssignedTo: checkAnalyst ? exportForm.analyst : userID.replace(/"/g, ""),
            AssignedToRoleID: checkAnalyst ? "6" : roleID,
            ReleasingDate: releasingDate

        }
        if (validateForm()) {
            await axios
                .post(APIURL + "Circular/UpdateCircular", data)
                .then((res) => {
                    if (res.data.responseCode === '200') {
                        toast.success(res.data.responseMessage, { autoClose: 2000 })
                        setTimeout(() => {
                            setToastDisplayed(false)
                            handleEditModalClose();
                            handleCircularListData();
                            setExportForm({
                                name: "",
                                subject: "",
                                content: "",
                                circularReference: "",
                                directiveData: [],
                                bankData: [],
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
        editBYID();
    }, [toastDisplayed]);

    // ----- End Code For Geting Table Data

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
                                name="circularReferenceNumber"
                                placeholder="Circular Reference"
                                onChange={(e) => {
                                    changeHandelForm(e);
                                }}
                                disabled
                                value={exportForm.circularReferenceNumber}
                            />
                            <span className="sspan"></span>
                        </label>
                        {/* {errors?.circularReferenceNumber ? (
                            <span className="errormsg">
                                {errors?.circularReferenceNumber}
                            </span>
                        ) : ""} */}
                    </div>
                </div>
                {/* end form-bx  */}
                <div className="inner_form_new ">
                    <label className="controlform">Bank</label>
                    <div className="form-bx">
                        <div className="multiselect flex justify-content-center">
                            <MultiSelect
                                value={exportForm.bankData}
                                options={selectedBankOption}
                                onChange={(e) => {
                                    changeHandelForm(e);
                                }}
                                optionLabel="bankName"
                                placeholder="Select Banks"
                                name="bankData"
                                panelFooterTemplate={panelFooterTemplate}
                                display="chip"
                                onShow={onShow}
                            />
                            {errors?.bankData ? (
                                <span className="errormsg">
                                    {errors?.bankData}
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
                                value={exportForm.directiveData}
                                onChange={(e) => {
                                    changeHandelForm(e);
                                }}
                                options={selectedDirectivesOpt}
                                optionLabel="directiveName"
                                filter
                                name="directiveData"
                                placeholder="Select Directives"
                                display="chip"
                            // maxSelectedLabels={3}
                            />
                            {errors?.directiveData ? (
                                <small className="errormsg">{errors.directiveData}</small>
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
                    <label className="controlform">Assign to analyst</label>
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

export default CircularsEditForm;
