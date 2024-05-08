import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import moment from "moment";
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import ImportDashboardViewDetails from "../components/ImportDashboardViewDetails";
import ImportDashboardEditDetails from "../components/ImportDashboardEditDetails";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterService } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { InputText } from "primereact/inputtext";

const ImportDashboardTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");

  const [importData, setImportData] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editData, setEditdata] = useState({});
  const [searchText, setSearchText] = useState("");
  const [applicationstaus, setapplicationstaus] = useState(
    applicationDetail?.applicationStatus
      ? `${applicationDetail?.applicationStatus}`
      : "0"
  );
  
  const [showDelegateModal, setshowDelegateModal] = useState(false);
  const [checkdeligateuser, setcheckdeligateuser] = useState(0);
  const EditModalClose = () => setshowEditForm(false);
  const handleFormClose = () => setShowUpdateModal(false);
  const [selectedAppliation, setSelectedAppliation] = useState(null)
  const [responceCount, setresponceCount] = useState([]);;
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [userRole, setUserrole] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    companyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bankName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tinNumber: { value: null, matchMode: FilterMatchMode.IN },
  });
  const roleID = Storage.getItem("roleIDs");

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

  const renderHeader = () => {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
        {roleID >= 5 || roleID == 3 ? (
          <div
            className="form-footer mt-0 d-block text-end bulkdelegateBtn"
            style={{ float: "left", marginLeft: "20px" }}
          >
            <button
              type="button"
              style={{ float: "left", borderRadius: "5px" }}
              onClick={() => {
                handleClickDelegateModal();
                setcheckdeligateuser(!checkdeligateuser);
              }}
              className="login"
              disabled={selectedAppliation?.length ? false : true}
            >
              Bulk Delegate
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const action = (rowData) => {
    return (
      <>
        <i
          className="pi pi-eye"
          style={{
            padding: "10px 5px",
            marginRight: "10px",
            cursor: "pointer",
          }}
          // onClick={() => {
          //   handleViewData(rowData.id);
          //   GetHandelDetail(rowData?.rbzReferenceNumber, rowData.id);
          //   GetApplicationCount(rowData.id);
          // }}
          onMouseEnter={(e) => {
            e.target.style.color = "var(--primary-color)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "";
          }}
        ></i>

        <i
          className="pi pi-user-edit"
          style={{ cursor: "pointer" }}
          key={rowData.title}
          // onClick={() => {
          //   handleClickEditModal(rowData.title);
          //   GetHandelDetail(rowData?.rbzReferenceNumber, rowData.id);
          //   GetRoleHandle(applicationstaus);
          //   handleData();
          //   GetApplicationCount(rowData.id);
          // }}
          onMouseEnter={(e) => {
            e.target.style.color = "var(--primary-color)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "";
          }}
        ></i>
      </>
    );
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
        {moment(rowData.applicationSubmittedDate).format("DD MMM YYYY")}
      </span>
    );
  };

  const header = renderHeader();

  const handleClickDelegateModal = () => {
    setshowDelegateModal(true);
  };

  const GetRoleHandle = async (id) => {
    setUserrole([]);
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: roleID,
        Status: `${id}`,
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

  const GetApplicationCount = async (id) => {
    await axios
      .post(APIURL + "ExportApplication/CountByApplicationID", {
        ApplicationID: id,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          // console.log("responceCount", res)
          setresponceCount(res.data.responseData);
        } else {
          setresponceCount({});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ----- Start Code For Open Edit Popup
  const handleClickEditModal = (title) => {
    setshowEditForm(true);
  };
  // ----- End Code For Open Edit Popup

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    await axios
      .post(APIURL + "ImportApplication/GetImportApplications", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
      })
      .then((res) => {
        console.log("list - - ", res);
        if (res.data.responseCode === "200") {
          setLoading(false)
          setImportData(res.data.responseData);
        }
      });
  };
  // ----- End Code For Geting Table List Data

  // ----- Start Code For Table Heading Column
 
  // ----- End Code For Table Heading Column

  // ----- Start Code For Open Poup
  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };
  // ----- End Code For Open Poup

  // ----- Start Code For Geting Table Data
  const GetHandelDetail = async (id) => {
    await axios
      .post(APIURL + "ImportApplication/GetImportRequestInfoByApplicationID", {
        ID: `${id}`,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setApplicationDetail(res.data.responseData);
        } else {
          setApplicationmessage(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // ----- End Code For Geting Table Data

  useEffect(() => {
    handleData();
  }, []);

  const filteredData = importData?.filter(
    (item) =>
      item?.rbzReferenceNumber
        ?.toLowerCase()
        .includes(searchText?.toLowerCase()) ||
      item?.name?.toLowerCase().toString().includes(searchText) ||
      item?.supervisorName?.toLowerCase().toString().includes(searchText) ||
      item?.amount?.toString().includes(searchText) ||
      item?.name?.toLowerCase().toString().includes(searchText) ||
      moment(item?.applicationSubmittedDate)
        .format("DD:MM:YYYY")
        ?.toString()
        .includes(searchText) ||
      item?.applicationType?.toLowerCase().toString().includes(searchText) ||
      item?.currencyName?.toLowerCase().toString().includes(searchText)
  );

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
            value={filteredData}
            scrollable
            scrollHeight="500px"
            className={roleID >= 5 || roleID == 3 ? "mt-1" : "mt-1 tablehideth"}
            selection={selectedAppliation}
            onSelectionChange={(e) => setSelectedAppliation(e.value)}
            paginator={filteredData.length > 10 ? true : false}
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
            header={header}
          >
            {roleID >= 5 || roleID == 3 ? (
              <Column
                selectionMode="multiple"
                style={{ width: "40px", cursor: "pointer" }}
                exportable={false}
              ></Column>
            ) : (
              ""
            )}
            <Column
              field="rbzReferenceNumber"
              header="RBZ Reference Number"
              sortable
              style={{ width: "220px" }}
            ></Column>
            <Column
              field="companyName"
              header="Applicant Name"
              sortable
              style={{ width: "220px" }}
              body={applicantName}
            ></Column>
            <Column
              field="applicationSubmittedDate"
              header="Submitted Date"
              sortable
              style={{ width: "140px" }}
              body={submittedDate}
            ></Column>
            <Column
              field="applicationType"
              header="Application Type"
              sortable
              style={{ width: "200px" }}
            ></Column>
            <Column
              field=""
              header="Amount"
              sortable
              body={amountwithCurrency}
              style={{ width: "150px" }}
            ></Column>
            <Column
              field="statusName"
              header="Status"
              sortable
              style={{ width: "200px" }}
            ></Column>
            <Column
              field=""
              header="Action"
              style={{ width: "200px" }}
              frozen
              alignFrozen="right"
              body={action}
            ></Column>
          </DataTable>
        </div>
      )}
    </>
  );
};

export default ImportDashboardTable;
