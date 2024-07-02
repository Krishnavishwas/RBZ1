import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import INSAdvanceSearchTable from "../tables/INSAdvanceSearchTable"

import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Select from "react-select";
import UpdatePopupMessage from "./UpdatePopupMessage";
import ApplicationTypeMultiSelect from "./SearchUI/ApplicationTypeMultiSelect"
import CustomBankMultiSelect from "./SearchUI/CustomBankMultiSelect"
import SectorMultiselect from "./SearchUI/SectorMultiselect";
import CurrencyMultiSelect from "./SearchUI/CurrencyMultiSelect";
import StatusMultiSelect from "./SearchUI/StatusMultiSelect"
import AnalystMultiSelect from "./SearchUI/AnalystMultiSelect";
import SeniorMultiSelect from "./SearchUI/SeniorMultiSelect";
import PrincipalMultiSelect from "./SearchUI/PrincipalMultiSelect"

const INSAdvanceSearchForm = ({
    saveSearchSelectedValue,
    saveSearchList,
    setSaveSearchChangeValue,
   

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
    } = ExportformDynamicField();

    const Navigate = useNavigate();

    const BPNCodeRef = useRef(null);
    const TINRef = useRef(null);
    const amountRef = useRef(null);
    const applicantRef = useRef(null);
    const BeneficiaryNameRef = useRef(null);
    const applicantCommentsRef = useRef(null);
    const applicantReferenceNumberRef = useRef(null);
    // const applicantYearRef = useRef(null);
    const applicationTypeRef = useRef(null);
    const bankSupervisorRef = useRef(null);
    const companyNameRef = useRef(null);
    const currencyRef = useRef(null);
    const govtAgencieRef = useRef(null);
    const purposeApplicationRef = useRef(null);

    const relatedexchangeControlNumberRef = useRef(null);
    const sectorRef = useRef(null);
    const subsectorRef = useRef(null);
    const statusRef = useRef(null);
    const typeExporterRef = useRef(null);
    const rateRef = useRef(null);
    const usdEquivalentRef = useRef(null);
    const banknameRef = useRef(null);

    const UserID = Storage.getItem("userID");
    const bankID = Storage.getItem("bankID");
    const userName = Storage.getItem("userName");
    const Name = Storage.getItem("name");
    const bankName = Storage.getItem("bankName");
    const roleID = Storage.getItem("roleIDs");
    const bankidcheck = bankID !== "" ? "1" : "3";

    // const [startDate, setStartDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(new Date());
    const [fromMinDate, setFromMinDate] = useState(() => {
        const initialToDate = new Date();
        initialToDate.setDate(initialToDate.getDate() - 365)
        // initialToDate.setFullYear(initialToDate.getFullYear() - 1);
        return initialToDate;
    });

    const [savePopUpShow, setSavePopUpShow] = useState(false);

    const handleSavePopUpClose = () => {
        setAdvanceSearchText({
            advanceSearchValue: ""
        });
        setSavePopUpShow(false);
        setErrors({});
    }
    const handleSavePopUpShow = () => setSavePopUpShow(true);
    const [advanceSearchText, setAdvanceSearchText] = useState({
        advanceSearchValue: ""
    });
    const [toDate, setToDate] = useState(new Date());
    const [toChangeDate, settoChangeDate] = useState(toDate ? toDate : new Date());
    const [toastDisplayed, setToastDisplayed] = useState(false);
    const [selectedApplicationType, setSelectedApplicationType] = useState([]);
    const [selectedSector, setSelectedSector] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState([]);
    const [advanceSearchData, setAdvanceSearchData] = useState([]);
    const [selectedAnalyst, setSelectedAnalyst] = useState([]);
    const [selectedSrAnalyst, setSelectedSrAnalyst] = useState([]);
    const [selectedPrAnalyst, setSelectedPrAnalyst] = useState([]);
    const [selectedBank, setSelectedBank] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [statusData, setStatusData] = useState([
        {
            label: "Pending",
            value: [1,2,3,4,5,6,7]
        },
        {
            label: "Approved",
            value: [105,115,125,135,145]
        },
        {
            label: "Rejected",
            value: [110,120,130,140,150]
        },
        {
            label: "Cancelled",
            value: [160,155,165,185]
        },
        {
            label: "Deferred",
            value: [265,195,190,200,205,210]
        },
    ]);
    const [getCompanyName, setgetCompanyName] = useState(null);
    const [updatepopup, setupdatepopup] = useState(false);
    const [userRole, setUserrole] = useState([]);
    const [selectuserRole, setselectuserRole] = useState("");
    const [submitbuttonhide, setsubmitbuttonhide] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [applicationDetail, setApplicationDetail] = useState({});
    const [applicationmessage, setApplicationmessage] = useState("");
    const [tatHistory, setTatHistory] = useState([]);
    const [allcomment, setallcomment] = useState([]);
    const [noDataComment, setNoDataComment] = useState([]);
    const [responceCount, setresponceCount] = useState([]);
    const handleFormClose = () => setShowUpdateModal(false);
    let dateApp = moment(fromDate).format("DD-MM-YYYY");
    let dateApp2 = moment(toDate).format("DD-MM-YYYY");

    // const [registerusertype, setregisterusertype] = useState(bankidcheck);
    const [exportForm, setExportForm] = useState({
        user: "",
        bankName: bankName,
        purposeApplication: "",
        typeExporter: "",
        // companyName: getCompanyName,
        // BeneficiaryName: "",
        govtAgencie: "",

        // applicant: "",
        applicantReferenceNumber: "",
        // applicantYear: "2024",
        applicationType: "",
        exporterType: "",
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
    const [files, setFiles] = useState([]);
    const [otherfiles, setOtherfiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [applicationType, setapplicationType] = useState([]);
    const [sectorSubSectorData, setSectorSubSectorData] = useState([]);
    const [subsectorData, setsubsectorData] = useState([]);
    const [curRate, setCurrate] = useState();
    const [checkSupervisor, setcheckSupervisor] = useState(roleID == 4 ? true : false);
    const [attachmentData, setAttachmentData] = useState([]);
    const [otherfilesupload, setOtherfilesupload] = useState([]);
    const [value, setValue] = useState("Company Name");
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [getBankID, setGetBankID] = useState("");
    const [getalluser, setGetalluser] = useState([]);
    const [analystuser, setAnalystuser] = useState([]);
    const [senioruser, setSenioruser] = useState([]);
    const [principaluser, setPrincipaluser] = useState([]);
    const [Individualuser, setIndividualuser] = useState({
        applicantName: "",
        beneficiaryName: "",
    });
    const fileInputRefsother = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

    const fileInputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    //---------- Start form fill data handle

    const heading = "Application Submitted Successfully!";
    const para = "Export application request submitted successfully!";

    const changeHandelForm = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;
        let newErrors = {};
        let valid = true;

        if (name === "amount" && value?.length > 10) {
            newErrors.amount = "Max 10 digit allow";
        } else if (name === "rate" && value?.length > 10) {
            newErrors.rate = "Max 10 digit allow";
        } else {
            setErrors({});
            setExportForm((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
        setErrors(newErrors);

    };
    //---------- End form fill data handle


    //---------- Start API for Geting Application Type dynamic

    const GetApplicationTypes = async () => {
        await axios
            .post(APIURL + "Master/GetApplicationTypesByDepartmentID", {
                DepartmentID: "2",
            })
            .then((res) => {
                if (res.data.responseCode === "200") {
                    setapplicationType(res.data.responseData);
                } else {
                    console.log(res.data.responseMessage);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const GetSectorApi = async () => {
        await axios
            .post(APIURL + "Master/GetSectorSubSectorData")
            .then((res) => {
                if (res.data.responseCode === "200") {
                    setSectorSubSectorData(res.data.responseData);
                } else {
                    console.log(res.data.responseMessage);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };



    //---------- Start API For Geting Application Type dynamic

    useEffect(() => {
        GetApplicationTypes();
        GetSectorApi();
    }, []);

    //---------- Start Code For Check User Type of Exporter

    // const handleUsertype = (e) => {
    //     setregisterusertype(e.target.value);
    //     setIndividualuser({ applicantName: "", beneficiaryName: "" });
    // };


    //---------- End Code For Add More File Option Field



    const getRoleHandle = async () => {
        await axios
            .post(APIURL + "Master/GetRoles", {
                RoleID: "4",
                Status: "35",
                DepartmentID: "2"
            })
            .then((res) => {
                if (res.data.responseCode == 200) {
                    setUserrole(res.data.responseData);
                } else {
                    setUserrole([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const analystApi = (e) => {
        axios
            .post(APIURL + "User/GetUsersByRoleID", {
                RoleID: "5",
                DepartmentID: "2",
                UserID: UserID.replace(/"/g, ""),
            })
            .then((res) => {
                if (res.data.responseCode == "200") {
                    setAnalystuser(res.data.responseData);
                } else {
                    setAnalystuser([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const seniorApi = (e) => {
        axios
            .post(APIURL + "User/GetUsersByRoleID", {
                RoleID: "6",
                DepartmentID: "2",
                UserID: UserID.replace(/"/g, ""),
            })
            .then((res) => {
                if (res.data.responseCode == "200") {
                    setSenioruser(res.data.responseData);
                } else {
                    setSenioruser([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const principalApi = (e) => {
        axios
            .post(APIURL + "User/GetUsersByRoleID", {
                RoleID: "7",
                DepartmentID: "2",
                UserID: UserID.replace(/"/g, ""),
            })
            .then((res) => {
                if (res.data.responseCode == "200") {
                    setPrincipaluser(res.data.responseData);
                } else {
                    setPrincipaluser([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // sectorAnd subsector APi and CHange data start
    // const [sectorSubSectorData, setSectorSubSectorData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedParentId, setSelectedParentId] = useState([]);
    const [dropDownShow, setDropDownShow] = useState(false);
    const handleDropDownClick = () => {
        setDropDownShow(true)
    }
    // log
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(APIURL + 'Master/GetSectorSubSectorData');
                if (response.data.responseCode === '200') {
                    setSectorSubSectorData(response.data.responseData);
                } else {
                    console.log(response.data.responseMessage);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSelect = (itemId, itemValue, parentId = null) => {
        let newSelectedItems;
        if (selectedItems.some(item => item.id === itemId)) {
            newSelectedItems = selectedItems.filter((item) => item.id !== itemId);
        } else {
            newSelectedItems = [...selectedItems, { id: itemId, value: itemValue }];
        }

        setSelectedItems(newSelectedItems);

        // If there's a parentId provided, check if all children are selected
        if (parentId) {
            const parent = sectorSubSectorData.find(p => p.id === parentId);
            if (parent) {
                const allChildrenSelected = parent.subSectorData.every(child =>
                    newSelectedItems.some(item => item.id === child.id)
                );

                if (allChildrenSelected) {
                    if (!selectedParentId.includes(parentId)) {
                        setSelectedParentId([...selectedParentId, parentId]);
                    }
                } else {
                    setSelectedParentId(selectedParentId.filter(id => id !== parentId));
                }
            }
        }
    };

    const handleParentSelect = (parent, parentName) => {
        if (selectedParentId.includes(parent.id)) {
            setSelectedParentId(selectedParentId.filter(id => id !== parent.id));
        } else {
            setSelectedParentId([...selectedParentId, parent.id]);
        }
        if (parent.subSectorData.length === 0) {
            handleSelect(parent.id + 'A', parentName);

            return;
        }

        const childItems = parent.subSectorData.map((child) => ({ id: child.id, value: child.subSectorName }));
        const childIds = childItems.map(item => item.id);

        if (childIds.every((id) => selectedItems.some(item => item.id === id))) {
            setSelectedItems(selectedItems.filter((item) => !childIds.includes(item.id)));
            setSelectedParentId(selectedParentId.filter(id => id !== parent.id));
        } else {
            const newSelectedItems = [
                ...selectedItems,
                ...childItems.filter(child => !selectedItems.some(item => item.id === child.id))
            ];
            setSelectedItems(newSelectedItems);
            setSelectedParentId([...selectedParentId, parent.id]);
        }
    };
    const isSelected = (id) => selectedItems.some(item => item.id === id);
    // sectorAnd subsector APi and CHange data start
    //---------- Start Code For Check Validation for Form Field

    const validateForm = () => {
        let valid = true;
        setTimeout(() => {
            setsubmitbuttonhide(false);
        }, 1000);
        const newErrors = {};


        if (roleID >= 4 && selectedBank?.length == "0") {
            newErrors.selectedBank = "Select Bank";
            valid = false;
        }

        if (exportForm.amount.length > 0 && exportForm.rate.length == 0) {
            newErrors.rate = "Rate is required";
            valid = false;
        }
        // if (exportForm.amount === "") {
        //     newErrors.amount = "Amount is required";
        //     valid = false;
        // }


        setErrors(newErrors);
        return valid;
    };

    //---------- End Code For Check Validation for Form Field

    //---------- Start Code For Company Search select for Form Field

    const generateRandomNumber = () => {
        return Math.floor(10000 + Math.random() * 90000);
    };

    //---------- End Code For Company Search select for Form Field
    let selectedAnalystValue = [];
    let selectedSrAnalystValue = [];
    let selectedPrAnalystValue = [];
    const selectedBankValue = selectedBank?.map((res) => res.value)
    const selectedApplicationTypeValue = selectedApplicationType?.map((res) => res.value)
    const selectedCurrencyValue = selectedCurrency?.map((res) => res.value)
    const selectedItemsValue = selectedItems?.map((res) => res.id)
    const selectedMUltiArryStatus = selectedStatus?.map((res) => res.value);
    const selectedStatusValue = selectedMUltiArryStatus.flat();
    selectedAnalystValue = selectedAnalyst?.map((res) => res.value)
    selectedSrAnalystValue = selectedSrAnalyst?.map((res) => res.value)
    selectedPrAnalystValue = selectedPrAnalyst?.map((res) => res.value)

    const mergeuserarray1 = selectedAnalystValue.concat(selectedSrAnalystValue)
    const mergeuserarray2 = mergeuserarray1.concat(selectedPrAnalystValue);
    const userAllAnalyst = mergeuserarray2.map(x => "'" + x + "'").toString();

    const HandleSubmit = async (e) => {
        e.preventDefault();

        setsubmitbuttonhide(true);
        let nDate = new Date();

        if (validateForm()) {

            let wherecondition = ''
            // if(UserID){
            //     wherecondition += "UserID = " + UserID.replace(/"/g, "");
            // }
            // if(roleID){
            //     wherecondition += " AND RoleID = " + roleID;
            // }
            if (fromDate != null) {
                wherecondition += " SubmittedDate BETWEEN '" + moment(fromDate).format('YYYY-MM-DD HH:mm:ss') + "' AND '" + moment(toDate).format('YYYY-MM-DD HH:mm:ss') + "'";
            }
            if (roleID == 2 || roleID == 3) {
                wherecondition += " AND BankID IN(" + bankID + ")";
            } else {
                if (selectedBankValue.length > 0) {
                    wherecondition += " AND BankID IN(" + selectedBankValue.join() + ")";
                }
            }
            if (exportForm.exporterType.length > 0) {
                wherecondition += " AND ApplicantType = " + exportForm.exporterType;
            }
            if (selectedCurrencyValue.length > 0) {
                wherecondition += " AND Currency IN(" + selectedCurrencyValue.join() + ")";
            }
            if (selectedApplicationTypeValue.length > 0) {
                wherecondition += " AND ApplicationTypeID IN(" + selectedApplicationTypeValue.join() + ")";
            }
            if (selectedItemsValue.length > 0) {
                wherecondition += " AND Sector IN(" + selectedItemsValue.join() + ")";
            }
            if (selectedStatusValue.length > 0) {
                wherecondition += " AND Status IN(" + selectedStatusValue.join() + ")";
            }
            if (selectedAnalystValue.length > 0 || selectedSrAnalystValue.length > 0 || selectedPrAnalystValue.length > 0) {
                wherecondition += " AND UserID IN(" + userAllAnalyst + ")";
            }
            if (exportForm.amount?.length > 0) {
                wherecondition += " AND Amount BETWEEN '" + exportForm.amount + "' AND '" + exportForm.rate + "'";
            }
            await axios    
                .post(APIURL + "ReportData/GetINSReportDataView", {
                    // UserID: UserID.replace(/"/g, ""),
                    Condition: wherecondition,
                    RoleID: roleID
                })
                .then((res) => {
                    if (res.data.responseCode === "200") {
                        setsubmitbuttonhide(false);
                        // setupdatepopup(true);
                        setAdvanceSearchData(res.data.responseData)
                        toast.success(res.data.responseMessage);


                    } else {
                        if(res.data.responseCode == '401'){
                            toast.warning("No Data"); 
                            setAdvanceSearchData([])
                        }
                        else{
                        toast.error(res.data.responseMessage);
                        setsubmitbuttonhide(false);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setsubmitbuttonhide(false);
                });
        } else {
            if (!toastDisplayed) {
                toast.warning("Please fill all mandatory fields");
            }
            setToastDisplayed(true);
        }
    };


    const closePopupHandle = () => {
        Navigate("/BankADLADashboard");
        setupdatepopup(false);
        setGetBankID("");
        setExportForm({
            user: "",
            bankName: bankName,
            purposeApplication: "",
            typeExporter: "",
            // companyName: "",
            BeneficiaryName: "",
            govtAgencie: "",
            BPNCode: "",
            TINNumber: "",
            applicant: "",
            applicantReferenceNumber: "",
            applicantYear: "2024",
            // applicationDate:dateApp ,
            exporterType: "",
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
        if (applicantRef.current) applicantRef.current.value = "";
        if (BeneficiaryNameRef.current) BeneficiaryNameRef.current.value = "";
        if (BPNCodeRef.current) BPNCodeRef.current.value = "";
        if (TINRef.current) TINRef.current.value = "";
        if (amountRef.current) amountRef.current.value = "";
        if (applicantRef.current) applicantRef.current.value = "";
        if (applicantCommentsRef.current) applicantCommentsRef.current.value = "";
        if (BeneficiaryNameRef.current) BeneficiaryNameRef.current.value = "";
        if (applicantReferenceNumberRef.current)
            applicantReferenceNumberRef.current.value = "";
        // if(applicantYearRef.current) applicantYearRef.current.value = '';
        if (applicationTypeRef.current) applicationTypeRef.current.value = "";
        if (bankSupervisorRef.current) bankSupervisorRef.current.value = "";
        if (companyNameRef.current) companyNameRef.current.value = "";
        if (currencyRef.current) currencyRef.current.value = "";
        if (govtAgencieRef.current) govtAgencieRef.current.value = "";

        if (purposeApplicationRef.current) purposeApplicationRef.current.value = "";
        if (relatedexchangeControlNumberRef.current)
            relatedexchangeControlNumberRef.current.value = "";
        if (sectorRef.current) sectorRef.current.value = "";
        if (subsectorRef.current) subsectorRef.current.value = "";

        if (typeExporterRef.current) typeExporterRef.current.value = "";
        if (usdEquivalentRef.current) usdEquivalentRef.current.value = "";

        if (rateRef.current) rateRef.current.value = "";
        if (banknameRef.current) banknameRef.current.value = "";
    };

  // advance search on change & api value start
  
  const handleAdSearchChange = (e) => {
    const { name, value } = e.target;
    setAdvanceSearchText((preState) => ({
        ...preState, [name]: value
    }))
}
// validation save search code start
const validateSaveSearchForm = () => {
    let valid = true;
    const newErrors = {};
    if (advanceSearchText.advanceSearchValue?.length == "0") {
        newErrors.advanceSearchValue = "Search title is required";
        valid = false;
    }

    setErrors(newErrors);
    return valid;
};

// validation save search code end
const handleSaveSearchSubmit = async (e) => {
    const saveDsta = [
        {
            fromDate: fromDate,
            toDate: toDate,
            BankID: selectedBank,
            // ApplicantType: applicantTypes,
            ApplicantType: exportForm.exporterType,
            Currency: selectedCurrency,
            ApplicationTypeID: selectedApplicationType,
            Sector: selectedItems,
            Status: selectedStatus,
            AnalystUser: selectedAnalyst,
            SeniorUser: selectedSrAnalyst,
            principalUser: selectedPrAnalyst,
            Amount: exportForm.amount,
            Rate: exportForm.rate
        }
    ]

    if (validateSaveSearchForm()) {
        await axios
            .post(APIURL + "ReportData/CreatesearchRecord", {
                UserID: UserID.replace(/"/g, ""),
                DepartmentID: 5,
                SearchName: advanceSearchText.advanceSearchValue,
                JSONData: JSON.stringify(saveDsta)
            })
            .then((res) => {
                if (res.data.responseCode === "200") {
                    setTimeout(() => {
                        saveSearchList()
                        setAdvanceSearchText({
                            advanceSearchValue: ""
                        })
                        setSelectedBank([]);
                        setSelectedApplicationType([]);
                        setSelectedCurrency([]);
                        setSelectedStatus([]);
                        setSelectedAnalyst([]);
                        setSelectedItems([]);
                        setSelectedSrAnalyst([]);
                        setSelectedPrAnalyst([]);
                        setExportForm({
                            amount: "",
                            rate: "",
                            exporterType: "",

                        });
                        setSaveSearchChangeValue('')
                        setFromDate(new Date());
                        setToDate(new Date());
                        setErrors({});
                        handleSavePopUpClose()
                    }, 2000);
                    toast.success(res.data.responseMessage);
                }
            })
            .catch((err) => {
                console.log(err);

            });
    }
}
// advance search on change & api value start


    const filtertin_bpn = companies?.find((company) => {
        if (company.id === getCompanyName?.value) {
            return {
                getbpn: company.bpnNumber,
                gettin: company.tinNumber,
            };
        }
    });

    const applicationOption = applicationType?.map((res) => ({
        label: res.name,
        value: res.id,
    }));
    const handleChangeApplication = (e) => {
        const values = e;
        setSelectedApplicationType(values);
    };


    const currencyOption = currency?.map((res) => ({
        label: res.currencyCode,
        value: res.id,
    }));

    const handleChangeCurrency = (e) => {
        const values = e;
        setSelectedCurrency(values);
    };
    const analystOption = analystuser?.map((res) => ({
        label: res.name,
        value: res.userID,
    }));

    const handleChangeAnalyst = (e) => {
        const values = e;
        setSelectedAnalyst(values);
    };
    const seniorOption = senioruser?.map((res) => ({
        label: res.name,
        value: res.userID,
    }));

    const handleChangeSrAnalyst = (e) => {
        const values = e;
        setSelectedSrAnalyst(values);
    };
    const principalOption = principaluser?.map((res) => ({
        label: res.name,
        value: res.userID,
    }));

    const handleChangePrAnalyst = (e) => {
        const values = e;
        setSelectedPrAnalyst(values);
    };
    const bankOption = masterBank?.map((res) => ({
        label: res.bankName,
        value: res.id,
    }));

    const handleChangeBank = (e) => {
        const values = e;
        setSelectedBank(values);
    };
    const handleChangeStatus = (e) => {
        const values = e;
        setSelectedStatus(values);
    };
    const handleClear = () => {
        setValue(null);
        setInputValue("");
        setOptions([]);
    };


    useEffect(() => {
        if (toastDisplayed) {
            setTimeout(() => {
                setToastDisplayed(false);
            }, 1500);
        }
    }, [toastDisplayed]);
    //-----validated collasp start

    const [ValidateRBZ, setValidateRBZ] = useState([]);
    const [loader, setLoader] = useState(false);
    const [ValidateShow, setValidateShow] = useState(false);
    const [ValidateChange, setValidateChange] = useState({
        relatedexchangeControlNumber: "",
    });



    // ----- Start Code For Geting Table Data

    const renderFooter = () => {
        return (
            <div className="flex justify-content-end">
                <button
                    className="validateCrossIcon"
                    onClick={() => setValidateShow(false)}
                >
                    <i className="bi bi-x-circle"></i>
                </button>
            </div>
        );
    };
    const footer = renderFooter();
    const GetHandelDetail = async (rbzrefnumber, id) => {
        setLoading(true);
        await axios
            .post(APIURL + "ExportApplication/GetRequestInfoByApplicationID", {
                RBZReferenceNumber: `${rbzrefnumber}`,
                ID: id,
            })
            .then((res) => {
                if (res.data.responseCode === "200") {
                    setLoading(false);
                    setApplicationDetail(res.data.responseData);
                } else {
                    setLoading(false);
                    setApplicationmessage(res.data.responseMessage);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        await axios
            .post(APIURL + "ExportApplication/GetNewComments", {
                ID: id,
            })
            .then((res) => {
                if (res.data.responseCode == 200) {
                    setallcomment(res.data.responseData);
                } else {
                    setallcomment([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        await axios
            .post(APIURL + "ExportApplication/GetApplicationHistory", {
                ID: id,
            })
            .then((res) => {
                if (res.data.responseCode == 200) {
                    setTatHistory(res.data.responseData);
                } else {
                    setTatHistory([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        // --------------------------vishwas start----------------------------
        await axios
            .post(APIURL + "ExportApplication/GetCommentsInfoByRoleID", {
                ApplicationID: id,
            })
            .then((res) => {
                if (res.data.responseCode == 200) {
                    setNoDataComment(res.data.responseData);
                } else {
                    setNoDataComment([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        //---------------------------vishwas end------------------------------
    };
    // ----- End Code For Geting Table Data
    useEffect(() => {
        getRoleHandle();
        principalApi();
        seniorApi();
        analystApi();
    }, []);
    const [response, setResponse] = useState([]);
    const callbackFUnction = (value) => {
        console.log(value);
        setResponse(value);
    };
    useEffect(() => {
        if (saveSearchSelectedValue?.length > 0) {
            saveSearchSelectedValue?.map((item) => {
                setSelectedBank(item.BankID);
                setSelectedCurrency(item.Currency);
                setSelectedApplicationType(item.ApplicationTypeID);
                setSelectedStatus(item.Status);
                setSelectedAnalyst(item.AnalystUser);
                setSelectedItems(item.Sector);
                setSelectedSrAnalyst(item.SeniorUser);
                setSelectedPrAnalyst(item.principalUser);
                setExportForm({
                    amount: item.Amount,
                    rate: item.Rate,
                    exporterType: item.ApplicantType

                });

                setFromDate(moment(item.fromDate).format("DD/MMM/YYYY"))
                setToDate(moment(item.toDate).format("DD/MMM/YYYY"))
            });
        } else {
            setSelectedBank([]);
            setSelectedCurrency([]);
            setSelectedApplicationType([]);
            setSelectedStatus([]);
            setSelectedAnalyst([]);
            setSelectedItems([]);
            setSelectedSrAnalyst([]);
            setSelectedPrAnalyst([]);
            setExportForm({
                amount: '',
                rate: '',
                exporterType: ''

            });

            setFromDate(new Date())
            setToDate(new Date())
        }
    }, [saveSearchSelectedValue]);
 
    return (
        <>
            <form className="bankReportForm">
                <div className="row">

                    <div className="col-md-6">
                        <div className="inner_form_new">
                            <label className="controlform">From Date</label>

                            <div className="form-bx">
                                <div className="form-bx-datePicker">
                                    <DatePicker
                                        closeOnScroll={(e) => e.target === document}
                                        selected={fromDate}
                                        placeholderText={
                                            fromDate == null
                                                ? moment(new Date()).format("DD/MMM/YYYY")
                                                : moment(fromDate).format("DD/MMM/YYYY")
                                        }
                                        onChange={(date) => {
                                            setFromDate(date)

                                        }}
                                        peekNextMonth
                                        minDate={fromMinDate}
                                        showMonthDropdown
                                        maxDate={new Date()}
                                        showYearDropdown
                                        onKeyDown={(e) => {
                                            const key = e.key;
                                            const allowedKeys = /[0-9\/]/;
                                            if (
                                                !allowedKeys.test(key) &&
                                                key !== "Backspace" &&
                                                key !== "Delete"
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                        dropdownMode="select"
                                        dateFormat="dd/MMM/yyyy"
                                    />
                                    <span className="sspan"></span>
                                </div>
                            </div>
                        </div>
                        {/* end form-bx  */}
                    </div>

                    <div className="col-md-6">
                        <div className="inner_form_new">
                            <label className="controlform">To Date</label>
                            <div className="form-bx">
                                <div className="form-bx-datePicker">
                                    <DatePicker
                                        closeOnScroll={(e) => e.target === document}
                                        selected={toDate}
                                        placeholderText={
                                            toChangeDate == null
                                                ? moment(new Date()).format("DD/MMM/YYYY")
                                                : moment(toDate).format("DD/MMM/YYYY")
                                        }
                                        onChange={(date) => setToDate(date)}
                                        peekNextMonth
                                        minDate={fromDate}
                                        showMonthDropdown
                                        maxDate={new Date()}
                                        showYearDropdown
                                        onKeyDown={(e) => {
                                            const key = e.key;
                                            const allowedKeys = /[0-9\/]/;
                                            if (
                                                !allowedKeys.test(key) &&
                                                key !== "Backspace" &&
                                                key !== "Delete"
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                        dropdownMode="select"
                                        dateFormat="dd/MMM/yyyy"
                                    />
                                    <span className="sspan"></span>
                                </div>
                            </div>
                        </div>
                        {/* end form-bx  */}
                    </div>
                </div>
                {/* end form-bx  */}
                <div className="row">
                    <div className="col-md-6">

                        <div className="inner_form_new bankMultiSelect">
                            <label className="controlform">Bank Name</label>
                            {(roleID == 2 || roleID == 3) ?
                                <div className="form-bx">
                                    <label>
                                        <input
                                            type="text"
                                            value={bankName.replace(/"/g, "")}
                                            disabled
                                        />
                                        <span className="sspan"></span>
                                    </label>
                                </div>
                                :
                                <div className="cccto position-relative">
                                    <div className="multiselect">
                                        <CustomBankMultiSelect
                                            ref={banknameRef}
                                            key="multyselectprinciple"
                                            placeholder="Select Bank"
                                            options={bankOption}
                                            onChange={(e) => handleChangeBank(e)}
                                            value={selectedBank}
                                            isSelectAll={false}
                                            isMulti
                                            menuPlacement={"bottom"}
                                            isOptionDisabled={() => selectedBank.length >= 5}
                                        />
                                        <span className="sspan"></span>
                                        {errors?.selectedBank && selectedBank == "" ? (
                                            <small className="errormsg">{errors.selectedBank}</small>
                                        ) : (
                                            <>
                                                <span style={{ fontSize: "11px", color: "#8d8c8c", fontStyle: "italic" }}>Maximum 5 banks allowed</span>
                                            </>

                                        )}
                                    </div>
                                </div>
                            }
                        </div>

                    </div>

                    <div className="col-md-6">
                        <div className="inner_form_new ">
                            <label className="controlform">Type of Exporter</label>
                            <div className="form-bx">
                                <label>
                                    <select
                                        ref={typeExporterRef}
                                        onChange={(e) => {
                                            changeHandelForm(e);
                                            // handleUsertype(e);
                                        }}
                                        name="exporterType"
                                        value={exportForm.exporterType}
                                    >
                                        <option value="">Select Exporter</option>
                                        {applicantTypes?.map((item, index) => {
                                            return (
                                                <>
                                                    <option value={item?.id} key={index}>
                                                        {item.name}
                                                    </option>
                                                </>
                                            );
                                        })}
                                    </select>

                                </label>


                                {/* {errors.niu && bankData.ApplicantType === '' ? <small className='errormsg'>{errors.ApplicantType}</small> : ""} */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* end form-bx  */}
                <div className="row">
                    <div className="col-md-6">
                        <div className="inner_form_new ">
                            <label className="controlform">Application Type</label>
                            <div className="cccto position-relative">
                                <div className="multiselect">
                                    <ApplicationTypeMultiSelect
                                        key="multyselectprinciple"
                                        placeholder="Select Application Type"
                                        options={applicationOption}
                                        onChange={(e) => handleChangeApplication(e)}
                                        value={selectedApplicationType}
                                        isSelectAll={true}
                                        menuPlacement={"bottom"}
                                    />

                                    <span className="sspan"></span>
                                    {/* {errors.applicationType && exportForm.applicationType === "" ? (
                                        <small className="errormsg">{errors.applicationType}</small>
                                    ) : (
                                        ""
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="inner_form_new">
                            <label className="controlform">Currency</label>

                            <div className="cccto position-relative">
                                <div className="multiselect">
                                    <CurrencyMultiSelect
                                        ref={currencyRef}
                                        key="multyselectprinciple"
                                        placeholder="Select Currency"
                                        options={currencyOption}
                                        onChange={(e) => handleChangeCurrency(e)}
                                        value={selectedCurrency}
                                        isSelectAll={true}
                                        menuPlacement={"bottom"}
                                    />
                                    <span className="sspan"></span>
                                    {/* {errors.sector && exportForm.sector === "" ? (
                                        <small className="errormsg">{errors.sector}</small>
                                    ) : (
                                        ""
                                    )} */}
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {/* end form-bx  */}

                <div className="row">


                    <div className="col-md-6">
                        <div className="inner_form_new">
                            <label className="controlform">Value From (in USD)</label>

                            <div className="form-bx">
                                <label>
                                    <input
                                        ref={amountRef}
                                        type="number"
                                        min={0}
                                        name="amount"
                                        value={exportForm.amount}
                                        onChange={(e) => {
                                            changeHandelForm(e);
                                        }}
                                        onKeyDown={(event) => {
                                            const blockedKeys = ['e', 'E', '-', '+'];
                                            if (blockedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        placeholder="Value From (in USD)"
                                        className={
                                            errors.amount && exportForm.amount === "" ? "error" : ""
                                        }
                                    />
                                    <span className="sspan"></span>
                                    {errors.amount || exportForm.amount === "" ? (
                                        <small className="errormsg">{errors.amount}</small>
                                    ) : (
                                        ""
                                    )}
                                </label>
                            </div>
                        </div>
                        {/* end form-bx  */}
                    </div>

                    <div className="col-md-6">
                        <div className="inner_form_new">
                            <label className="controlform">Value To (in USD)</label>
                            <div className="form-bx">
                                <label>
                                    <input
                                        ref={rateRef}
                                        type="number"
                                        name="rate"
                                        value={exportForm.rate}
                                        onChange={(e) => {
                                            changeHandelForm(e);
                                        }}

                                        disabled={exportForm.amount.length == "0" ? true : false}
                                        onKeyDown={(event) => {
                                            const blockedKeys = ['e', 'E', '-', '+'];
                                            if (blockedKeys.includes(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
                                        // value={exportForm.currency ? curRate : "Rate"}


                                        placeholder="Value To (in USD)"

                                    />
                                    <span className="sspan"></span>
                                    {errors.rate || exportForm.rate === "" ? (
                                        <small className="errormsg">{errors.rate}</small>
                                    ) : (
                                        ""
                                    )}
                                </label>
                            </div>
                        </div>
                        {/* end form-bx  */}
                    </div>
                </div>
                {/* end form-bx  */}
                <div className="row">

                    <div className="col-md-6">
                        <div className="inner_form_new align-items-start">
                            <label className="controlform">Sector</label>

                            <div className="nasted-multi-box">
                                <div className="nasted-multi-topBox">
                                    <p className='multi-topBox-content' onClick={() => handleDropDownClick()}>
                                        {selectedItems.length > 0 ?
                                            selectedItems.map((res) => {
                                                return (
                                                    <span>{res.value}</span>
                                                )
                                            })
                                            : "Select Sector "
                                        }
                                        {/* Select Sector */}
                                        {/* <strong>Selected Items:</strong> {selectedItems.join(', ')}  */}
                                    </p>
                                </div>
                                <div className={dropDownShow ? "nested-multi-select" : "d-none"}>
                                    <p className="mb-0 text-end">
                                        <i class="bi bi-x-circle" onClick={() => setDropDownShow(false)}></i></p>
                                    {sectorSubSectorData.map((parent) => (
                                        <div key={parent.id}>
                                            <div className="parent-box">
                                                <input
                                                    type="checkbox"

                                                    checked={
                                                        parent.subSectorData.length === 0
                                                            ? isSelected(parent.id + 'A')
                                                            : parent.subSectorData.every((child) => isSelected(child.id))
                                                    }
                                                    onChange={() => handleParentSelect(parent, parent.sectorName)}
                                                />
                                                <span> {parent.sectorName}</span>
                                            </div>
                                            <div className="nested-children">
                                                {parent.subSectorData.map((child) => (

                                                    <div key={child.id}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected(child.id)}
                                                            onChange={() => handleSelect(child.id, child.subSectorName, parent.id)}
                                                        />
                                                        <span>{child.subSectorName}</span>
                                                    </div>
                                                )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div>
                                        {/* <strong>Selected Items:</strong> {selectedItems.join(', ')} */}
                                    </div>
                                </div>
                            </div>
                            {/* <NestedMultiSelect /> */}

                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="inner_form_new">
                            <label className="controlform">Status</label>
                            <div className="cccto position-relative">
                                <div className="multiselect">
                                    <StatusMultiSelect
                                        key="multyselectprinciple"
                                        placeholder="Select Status"
                                        options={statusData}
                                        onChange={(e) => handleChangeStatus(e)}
                                        value={selectedStatus}
                                        isSelectAll={true}
                                        menuPlacement={"bottom"}
                                    />
                                    <span className="sspan"></span>
                                    {/* {errors.sector && exportForm.sector === "" ? (
                                    <small className="errormsg">{errors.sector}</small>
                                ) : (
                                    ""
                                )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* end form-bx  */}
                {
                    roleID == 3 || roleID == 2 ?
                        " " :
                        <div className="row">
                            <div className="col-md-6">
                                <div className="inner_form_new">
                                    <label className="controlform">Analyst</label>
                                    <div className="cccto position-relative">
                                        <div className="multiselect">
                                            <AnalystMultiSelect
                                                key="multyselectprinciple"
                                                placeholder="Select Analyst"
                                                options={analystOption}
                                                onChange={(e) => handleChangeAnalyst(e)}
                                                value={selectedAnalyst}
                                                isSelectAll={true}
                                                menuPlacement={"bottom"}
                                            />
                                            <span className="sspan"></span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="inner_form_new">
                                    <label className="controlform">Senior Analyst</label>
                                    <div className="cccto position-relative">
                                        <div className="multiselect">
                                            <SeniorMultiSelect
                                                key="multyselectprinciple"
                                                placeholder="Select Senior Analyst"
                                                options={seniorOption}
                                                onChange={(e) => handleChangeSrAnalyst(e)}
                                                value={selectedSrAnalyst}
                                                isSelectAll={true}
                                                menuPlacement={"bottom"}
                                            />
                                            <span className="sspan"></span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="inner_form_new">
                                    <label className="controlform">Principal Analyst</label>
                                    <div className="cccto position-relative">
                                        <div className="multiselect">
                                            <PrincipalMultiSelect
                                                key="multyselectprinciple"
                                                placeholder="Select Principal Analyst"
                                                options={principalOption}
                                                onChange={(e) => handleChangePrAnalyst(e)}
                                                value={selectedPrAnalyst}
                                                isSelectAll={true}
                                                menuPlacement={"bottom"}
                                            />
                                            <span className="sspan"></span>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                }

                <div className="form-footer mt-5 mb-3">

                    <button
                        type="button"
                        onClick={(e) => {
                            HandleSubmit(e);
                        }}
                        className="login"
                        disabled={submitbuttonhide == true}

                    >
                        {submitbuttonhide == true ? (
                            <>
                                Submit<div className="smallloader"></div>
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleSavePopUpShow}
                        className="login"

                    >
                        Save Search
                    </button>
                </div>

                {/* table data show start */}
                <h4 className="section_top_heading">REPORT DATA</h4>
                <INSAdvanceSearchTable advanceSearchData={advanceSearchData} />
                {/* table data show end */}
                 {/* save search modal start */}
               
                 <Modal
                    show={savePopUpShow}
                    onHide={handleSavePopUpClose}
                    backdrop="static"
                    className="max-width-300"
                >
                    <div className="application-box">
                        <div className="login_inner">
                            <div className="login_form ">
                                <h5>
                                    <Modal.Header closeButton className="p-0">
                                        <Modal.Title>
                                            Save youe search

                                        </Modal.Title>
                                    </Modal.Header>
                                </h5>
                            </div>
                            <div className="login_form_panel">
                                <Modal.Body className="p-0">
                                    <div className="inner_form_new ">
                                        <label className="controlform">Search Title</label>
                                        <div className="form-bx">
                                            <label>
                                                <input
                                                    value={advanceSearchText.advanceSearchValue}
                                                    name="advanceSearchValue"
                                                    onChange={(e) => handleAdSearchChange(e)}

                                                />
                                                <span className="sspan"></span>
                                                {advanceSearchText.advanceSearchValue.length == "0" && errors.advanceSearchValue ? (
                                                    <small className="errormsg">{errors.advanceSearchValue}</small>
                                                ) : (
                                                    ""
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <div className="form-footer mt-5 mb-3 justify-content-end">
                                    <button
                                        type="button"
                                        onClick={(e) => handleSaveSearchSubmit(e)}
                                        className="login"
                                    >
                                        Save Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                
                {/* save search modal end */}
            </form >


        </>
    );
};

export default INSAdvanceSearchForm;
