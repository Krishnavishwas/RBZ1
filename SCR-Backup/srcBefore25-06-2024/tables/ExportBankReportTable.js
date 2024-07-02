import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { FilterMatchMode, FilterService } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import moment from "moment";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import ExportDashboardViewDetails from "../components/ExportDashboardViewDetails";
import ExportDashboardEditDetails from "../components/ExportDashboardEditDetails";
import { TailSpin } from "react-loader-spinner";

const ExportBankReportTable = ({bankReportResData}) => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const roleID = Storage.getItem("roleIDs");
  const roleName = Storage.getItem("roleName");

  const [exportdata, setexportdata] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [allcomment, setallcomment] = useState([]);
  const [applicationstaus, setapplicationstaus] = useState(
    applicationDetail?.analystRecommendation
      ? `${applicationDetail?.analystRecommendation}`
      : "0"
  );
  const [nextlevelvalue, setnextlevelvalue] = useState("");
  const [userRole, setUserrole] = useState([]);
  const [tatHistory, setTatHistory] = useState([]);
  const [asignUser, setAsignUser] = useState([]);
  const [SupervisorRoleId, setSupervisorRoleId] = useState("");
  const [AssignUserID, setAssignUserID] = useState("");
  const [Actiondata, setActiondata] = useState([]);
  const [selectedAppliation, setSelectedAppliation] = useState(null);
  const [showDelegateModal, setshowDelegateModal] = useState(false);
  const [delegateComment, setDelegateComment] = useState("");
  const [delegateNote, setDelegateNote] = useState("");
  const [delegateUserID, setDelegateUserID] = useState("");
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [checkdeligateuser, setcheckdeligateuser] = useState(0);
  const [data, setData] = useState([]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [delegateAsignUser, setDelegateAsignUser] = useState([]);
  const [noDataComment, setNoDataComment] = useState([]);
  const [showdataLoader, setshowdataloader] = useState(false);
  const [responceCount, setresponceCount] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    companyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bankName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tinNumber: { value: null, matchMode: FilterMatchMode.IN },
  });

  const csvLinkRef = useRef();

  FilterService.register("custom_activity", (value, filters) => {
    const [from, to] = filters ?? [null, null];
    if (from === null && to === null) return true;
    if (from !== null && to === null) return from <= value;
    if (from === null && to !== null) return value <= to;
    return from <= value && value <= to;
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

 

  const applicantName = (rowData) => {
    return (
      <>
        {rowData.applicantType === 1 || rowData.userTypeID === 1 ? (
          <span>
            <i className="bi bi-c-circle-fill text-primary"></i>
            &nbsp;&nbsp;{rowData.companyName}
          </span>
        ) : rowData.applicantType === 2 || rowData.userTypeID == 2 ? (
          <span>
            <i className="bi bi-person-circle"></i>
            &nbsp;&nbsp;{rowData.name}
          </span>
        ) : (
          ""
        )}
      </>
    );
  };

  const amountwithCurrency = (rowData) => {
    return (
      <span>
        {rowData.currencyCode}&nbsp;{rowData.amount?.toLocaleString()}
      </span>
    );
  };
  
  const submittedDate = (rowData) => {
    return (
      <span>
        {moment(rowData.submittedDate).format("DD MMM YYYY")}
      </span>
    );
  };

  const receivedDate = (rowData) => {
    return (
      <span>
        {moment(rowData.createdDate).format("DD MMM YYYY")}
      </span>
    );
  };


  const EditModalClose = () => {
    setshowEditForm(false);
    setreferredDataTrue(false)
    setnextlevelvalue("");
  };
  
  const handleFormClose = () => setShowUpdateModal(false);

  // ----- Start Code For Open Edit Popup
  const handleClickEditModal = () => {
    setshowEditForm(true);
  };
  // ----- End Code For Open Edit Popup

  // ----- Start Code For Open delegate Popup
  const handleClickDelegateModal = () => {
    setshowDelegateModal(true);
  };
  const DelegateModalClose = () => {
    setshowDelegateModal(false);
    // setapplicationstaus("0");
    setnextlevelvalue("");
    setDelegateAsignUser([]);
    setDelegateComment("");
    setDelegateNote("");
    setSelectedAppliation(null);
  };
  // ----- End Code For Open delegate Popup

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    // setshowdataloader(true)
    // setLoading(true);
    await axios
      .post(APIURL + "ExportApplication/GetExportApplications", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setLoading(false);
          // setData(res.data.responseData);
          // setexportdata(res.data.responseData);
 
        } else {
          setData([]);
          setLoading(false);
          setexportdata([]);
          // setshowdataloader(false)
        }
      });
  };
  // ----- End Code For Geting Table List Data

  const supervisorHangechangeBankuser = (e) => {
    const { value } = e.target;
    if (value == "") {
      setAssignUserID("");
      setSupervisorRoleId("");
    } else {
      const { userID, roleID } = JSON?.parse(value);
      setAssignUserID(userID);
      setSupervisorRoleId(roleID);
    }
  };

  const supervisorHangechangeRole = (e) => {
    const { name, value } = e.target;
    if (value == "90A" || value == "") {
      setAssignUserID("");
      setSupervisorRoleId("");
      setAsignUser([]);
    } else {
      // setSupervisorRoleId(value);
      axios
        .post(APIURL + "User/GetUsersByRoleID", {
          RoleID:
            value == "10" || value == "40" || value == "25" || value == "30"
              ? parseInt(roleID) + 1
              : value == "15" ||
                value == "5" ||
                value == "6" ||
                value == "7" ||
                value == "8"
              ? // ? parseInt(roleID) - 1
                value
              : roleID,
          DepartmentID: "2",
          UserID: useId.replace(/"/g, ""),
        })
        .then((res) => {
          if (res.data.responseCode == 200) {
            setAsignUser(res.data.responseData);
          } else {
            setSupervisorRoleId("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const delegatechangeRole = () => {
    axios
      .post(APIURL + "User/GetUsersByRoleID", {
        RoleID: roleID,
        DepartmentID: "2",
        UserID: useId.replace(/"/g, ""),
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setDelegateAsignUser(res.data.responseData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    delegatechangeRole();
  }, [checkdeligateuser]);

  const supervisorHangechange = (e) => {
    const { name, value } = e.target;
    if (value == "") {
      setAssignUserID(null);
    } else {
      setAssignUserID(value);
    }
  };
  // ---- start API code for Comment

  //---end API code for Comment

  // ----- Start Code For Open Poup
  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };
  // ----- End Code For Open Poup

  // ----- Start Code For Geting Table Data
  const GetHandelDetail = async (rbzrefnumber, id) => {
    setshowdataloader(true);
    setApplicationDetail({});
    await axios
      .post(APIURL + "ExportApplication/GetRequestInfoByApplicationID", {
        RBZReferenceNumber: `${rbzrefnumber}`,
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setApplicationDetail(res.data.responseData);
          setTimeout(() => {
            setshowdataloader(false);
          }, 2000);
        } else {
          setApplicationmessage(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });

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

    await axios
      .post(APIURL + "ExportApplication/GetApplicationActionsByApplicationID", {
        ID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setActiondata(res.data.responseData);
        } else {
          setActiondata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const GetApplicationCount = async (id) => {
    await axios
      .post(APIURL + "ExportApplication/CountByApplicationID", {
        ApplicationID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setresponceCount(res.data.responseData);
        } else {
          setresponceCount({});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ----- End Code For Geting Table Data

  // ----- Start Code For Search Table Data
  const filteredData = exportdata?.filter(
    (item) =>
      item?.rbzReferenceNumber
        ?.toLowerCase()
        .includes(searchText?.toLowerCase()) ||
      item?.companyName?.toString().includes(searchText) ||
      item?.supervisorName?.toString().includes(searchText) ||
      item?.amount?.toString().includes(searchText) ||
      item?.name?.toString().includes(searchText) ||
      moment(item?.applicationSubmittedDate)
        .format("DD:MM:YYYY")
        ?.toString()
        .includes(searchText) ||
      item?.applicationType?.toString().includes(searchText) ||
      item?.currencyName?.toString().includes(searchText) ||
      item?.status?.toString().includes(searchText)
  );
  // ----- End Code For Search Table Data

  useEffect(() => {
    setapplicationstaus(
      applicationDetail?.analystRecommendation
        ? applicationDetail?.analystRecommendation
        : "0"
    );
  }, [applicationDetail]);

  const GetRoleHandle = async (id) => {
    setUserrole([]);
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: roleID,
        Status: `${id}`,
        DepartmentID:"2"
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

  useEffect(() => {
    handleData();
  }, []);

  const delegateValues = selectedAppliation?.map((v) => {
    return {
      ApplicationID: v.id,
      status: v.status,
      AssignedTo: delegateUserID,
      RoleID: roleID,
      AssignedToRoleID: roleID,
      Notes: delegateNote,
      Comment: delegateComment,
      CreatedBy: useId.replace(/"/g, ""),
    };
  });

  const delegateSubmit = (e) => {
    e.preventDefault();
    setBtnLoader(true);
    axios
      .post(APIURL + "ExportApplication/BulkDelegate", delegateValues)
      .then((res) => {
        if (res.data.responseCode == 200) {
          setBtnLoader(false);
          DelegateModalClose();
          handleData();
          setDelegateAsignUser([]);
          setDelegateComment("");
          setDelegateNote("");
          setSelectedAppliation(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // OLD
  const [showOldModal, setShowOldModal] = useState(false);
  const [oldApplicationDetail, setOldApplicationDetail] = useState({});
  const [oldNoDataComment, setOldNoDataComment] = useState([]);
  const [oldAllcomment, setOldAllcomment] = useState([]);
  const [oldTatHistory, setOldTatHistory] = useState([]);
  const [oldActiondata, setOldActiondata] = useState([]);
  const [oldResponceCount, setOldResponceCount] = useState([]);
  const [showOldDataLoader, setShowOldDataLoader] = useState(false);

  //Fetch Referred to Other Department data
  const [referredDataTrue, setreferredDataTrue] = useState(false);
  const [RODLoader, setRODLoader] = useState(false);
  const [referredData, setReferredData] = useState({});
  const GetReferredData = async (id) => {
    try {
      setRODLoader(true);
      await axios
        .post(APIURL + "ReferredApplication/GetReferredApplicationDataByID", {
          ID: id,
        })
        .then((res) => {
          if (res.data.responseCode == 200) {
            setReferredData(res.data.responseData);
            setRODLoader(false);
          } else {
            setReferredData({});
            setRODLoader(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setRODLoader(false);
          setreferredDataTrue(false);
        });
    } catch (error) {
      console.log("GetReferredImportApplicationByID error - ", error);
    }
  };
console.log("bankReportResData",bankReportResData);
  return (
    <>
      {loading == true ? (
        <label className="outerloader2">
          {" "}
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : (
        <div>
          <DataTable
            value={bankReportResData}
            scrollable
            scrollHeight="650px"
            // className={roleID >= 5 || roleID == 3 ? "mt-1" : "mt-1 tablehideth"}
            selection={selectedAppliation}
            onSelectionChange={(e) => setSelectedAppliation(e.value)}
            paginator={bankReportResData.length > 10 ? true : false}
            filters={filters}
            selectionMode="checkbox"
            paginatorPosition={"both"}
            paginatorLeft
            rows={10}
            dataKey="id"
            rowHover
            rowsPerPageOptions={[10, 50, 100]}
            globalFilterFields={[
              "rbzReferenceNumber",
              "name",
              "companyName",
              "applicationType",
              "amount",
              "statusName",
            ]}
            emptyMessage="No Data found."
         
          >
            {/* {roleID >= 5 || roleID == 3 ? (
              <Column
                selectionMode="multiple"
                style={{ width: "40px", cursor: "pointer" }}
                exportable={false}
              ></Column>
            ) : (
              ""
            )} */}
             <Column
              field="applicantTypeName"
              header="Applicant Name"
              sortable
              style={{ width: "220px" }}
            ></Column>
            <Column
              field="rbzReferenceNumber"
              header="RBZ Reference Number"
              sortable
              style={{ width: "220px" }}
            ></Column>
            <Column
              field="bankName"
              header="Bank Name"
              sortable
              style={{ width: "220px" }}
            
            ></Column>
             <Column
              field="applicantTypeName"
              header="Type of importer"
              sortable
              style={{ width: "220px" }}
          
            ></Column>
             <Column
              field="applicationName"
              header="Application Type"
              sortable
              style={{ width: "220px" }}
          
            ></Column>
          
            <Column
              field="amount"
              header="Amount"
              sortable
              style={{ width: "200px" }}
            ></Column>
            <Column
              field="currencyName"
              header="Currency"
              sortable
             
            ></Column>
             <Column
              field="usdEquivalent"
              header="USD"
              sortable
             
            ></Column>
             <Column
              field="sectorName"
              header="Sector"
              sortable
             
            ></Column>
             <Column
              field="createdDate"
              header="Applicant Received Date"
              sortable
              body={receivedDate}
             
            ></Column>
              <Column
              field="submittedDate"
              header="Applicant Submitted Date"
              sortable
              style={{ width: "140px" }}
              body={submittedDate}
            ></Column>
             {/* <Column
              field=""
              header="Bank Record Officer Received Date"
              sortable
             
            ></Column>
             <Column
              field=""
              header="Bank Record Officer Submited Date"
              sortable
             
            ></Column> */}
            
          </DataTable>
        </div>
      )}
   

    

     
    </>
  );
};

export default ExportBankReportTable;
