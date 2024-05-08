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

const ExportDashboardTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");
  const roleID = Storage.getItem("roleIDs");

  const [exportdata, setexportdata] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false); //
  const [showUpdateModal, setShowUpdateModal] = useState(false); //
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [allcomment, setallcomment] = useState([]);
  const [applicationstaus, setapplicationstaus] = useState(
    applicationDetail?.applicationStatus
      ? `${applicationDetail?.applicationStatus}`
      : "0"
  );
  const [nextlevelvalue, setnextlevelvalue] = useState(""); //
  const [userRole, setUserrole] = useState([]);
  const [tatHistory, setTatHistory] = useState([]);
  const [asignUser, setAsignUser] = useState([]);
  const [SupervisorRoleId, setSupervisorRoleId] = useState("");
  const [AssignUserID, setAssignUserID] = useState("");
  const [Actiondata, setActiondata] = useState([]);

  const csvLinkRef = useRef();
  // nursid code start
  FilterService.register("custom_activity", (value, filters) => {
    const [from, to] = filters ?? [null, null];
    if (from === null && to === null) return true;
    if (from !== null && to === null) return from <= value;
    if (from === null && to !== null) return value <= to;
    return from <= value && value <= to;
  });

  const [data, setData] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    companyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bankName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tinNumber: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [loading, setLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    const handleData = async () => {
      setLoading(true)
      await axios
        .post(APIURL + "ExportApplication/GetExportApplications", {
          UserID: useId.replace(/"/g, ""),
          RoleID: rollId,
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
            setLoading(false)
            setData(res.data.responseData);
          } else {
            setData([]);
          }
        });
    }; 
    handleData();
  }, [ ]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
          />
        </span>
      </div>
    );
  };

  const action = (rowData) => {
    return (
      <>
        <i
          className="pi pi-eye"
          style={{ padding: "12px", cursor: "pointer" }}
          onClick={() => {
            handleViewData(rowData.id);
            GetHandelDetail(rowData?.rbzReferenceNumber, rowData.id);
          }}
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
          onClick={() => {
            handleClickEditModal(rowData.title);
            GetHandelDetail(rowData?.rbzReferenceNumber, rowData.id);
            GetRoleHandle(applicationstaus);
            handleData();
          }}
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
        {rowData.applicantType === 1 ? (
          <span>
            <i className="bi bi-c-circle-fill text-primary"></i>
            &nbsp;&nbsp;{rowData.companyName}
          </span>
        ) : rowData.applicantType === 2 ? (
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
        {rowData.currencyCode}&nbsp;{rowData.amount}
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

  // nursid code end

  const EditModalClose = () => {
    setshowEditForm(false);
    // setapplicationstaus("0");
    setnextlevelvalue("");
  };
  const handleFormClose = () => setShowUpdateModal(false);

  // ----- Start Code For Open Edit Popup
  const handleClickEditModal = () => {
    setshowEditForm(true);
  };
  // ----- End Code For Open Edit Popup

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    await axios
      .post(APIURL + "ExportApplication/GetExportApplications", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setexportdata(res.data.responseData);
        } else {
          setexportdata([]);
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

  // ----- Start Code For Table Heading Column
  // const columns = [
  //   {
  //     name: "RBZ Reference Number",
  //     selector: (row) => row.rbzReferenceNumber,
  //     sortable: true,
  //     searchable: true,
  //     width: "310px",
  //     cell: (row) => (
  //       <span title={row.rbzReferenceNumber}>{row.rbzReferenceNumber}</span>
  //     ),
  //   },
  //   {
  //     name: "Applicant Name",
  //     selector: (row) => row.companyName || row.name,
  //     sortable: true,
  //     searchable: true,
  //     width: "300px",
  //     cell: (row) => (
  //       <>
  //         {row.userTypeID === 1 ? (
  //           <span>
  //             <i className="bi bi-c-circle-fill text-primary"></i>
  //             &nbsp;&nbsp;{row.companyName}
  //           </span>
  //         ) : row.userTypeID === 2 ? (
  //           <span>
  //             <i className="bi bi-person-circle"></i>
  //             &nbsp;&nbsp;{row.name}
  //           </span>
  //         ) : (
  //           ""
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     name: "Submitted Date",
  //     selector: (row) => row.applicationSubmittedDate,
  //     sortable: true,
  //     width: "180px",
  //     cell: (row) => (
  //       <span>
  //         {moment(row.applicationSubmittedDate).format("DD MMM YYYY")}
  //       </span>
  //     ),
  //   },
  //   {
  //     name: "Application Type",
  //     selector: (row) => row?.applicationType,
  //     cell: (row) => (
  //       <span title={row?.applicationType}>{row?.applicationType}</span>
  //     ),
  //     sortable: true,
  //     width: "320px",
  //   },
  //   {
  //     name: "Amount",
  //     selector: (row) => row?.amount,
  //     cell: (row) => (
  //       <span title={row?.amount}>
  //         <b>{row?.currencyCode}</b> {row?.amount}
  //       </span>
  //     ),
  //     sortable: true,
  //     width: "180px",
  //   },
  //   {
  //     name: "Status",
  //     selector: (row) => row?.statusName,
  //     sortable: true,
  //     width: "190px",
  //   },
  //   {
  //     name: "Action",
  //     cell: (row) => [
  //       <Link
  //         onClick={() => {
  //           handleViewData(row.id);
  //           GetHandelDetail(row?.rbzReferenceNumber, row.id);
  //         }}
  //         className="mr-1"
  //       >
  //         <b>
  //           <i className="bi bi-eye"></i>
  //         </b>
  //       </Link>,
  //       <button
  //         key={row.title}
  //         onClick={() => {
  //           handleClickEditModal(row.title);
  //           GetHandelDetail(row?.rbzReferenceNumber, row.id);
  //           GetRoleHandle(applicationstaus);
  //         }}
  //         className="edit-btn"
  //       >
  //         <i className="bi bi-pencil"></i>
  //       </button>,
  //     ],
  //   },
  // ];
  // ----- End Code For Table Heading Column

  // ----- Start Code For Open Poup
  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };
  // ----- End Code For Open Poup

  // ----- Start Code For Geting Table Data
  const GetHandelDetail = async (rbzrefnumber, id) => {
    await axios
      .post(APIURL + "ExportApplication/GetRequestInfoByApplicationID", {
        RBZReferenceNumber: `${rbzrefnumber}`,
        ID: id,
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
    await axios
      .post(
        APIURL + "ExportApplication/GetApplicationActivityByApplicationID",
        {
          ID: id,
        }
      )
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
      applicationDetail?.applicationStatus
        ? applicationDetail?.applicationStatus
        : "0"
    );
  }, [applicationDetail]);

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

  useEffect(() => {
    handleData();
  }, []);

  return (
    <>
      {exportdata.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          {/* <DataTable
            defaultSortFieldId={3}
            defaultSortAsc={false}
            columns={columns}
            data={filteredData}
            paginationRowsPerPageOptions={[10, 50, 100]}
            pagination
            highlightOnHover
            className="exporttable"
            dense
            subHeader
            subHeaderComponent={
              <div className="tablesearch">
                <div className="tablesearch_bx">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
            }
          /> 
          */}
          <div >
            <DataTable
              value={data}
              scrollable
              scrollHeight="500px"
              className="mt-4"
              paginator
              filters={filters}
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
              <Column
                field="rbzReferenceNumber"
                header="RBZ Reference Number"
                sortable
                style={{ minWidth: "80px", maxWidth:"140px", overflowWrap:"anywhere" }}
              ></Column>
              <Column
                field="companyName"
                header="Applicant Name"
                sortable
                style={{ minWidth: "200px" }}
                body={applicantName}
              ></Column>
              <Column
                field="applicationSubmittedDate"
                header="Submitted Date"
                sortable
                style={{ minWidth: "100px", maxWidth:"100px", overflowWrap:"anywhere" }}
                body={submittedDate}
              ></Column>
              <Column
                field="applicationType"
                header="Application Type"
                sortable
                style={{ minWidth: "130px", maxWidth:"160px", overflowWrap:"anywhere" }}
              ></Column>
              <Column
                field=""
                header="Amount"
                sortable
                body={amountwithCurrency}
                style={{ minWidth: "100px", maxWidth:"120px", overflowWrap:"anywhere" }}
              ></Column>
              <Column
                field="statusName"
                header="Status"
                sortable
                style={{ minWidth: "100px", maxWidth:"100px", overflowWrap:"anywhere" }}
              ></Column>
              <Column
                field=""
                header="Action"
                style={{ minWidth: "100px", maxWidth:"100px", overflowWrap:"anywhere"  }}
                frozen
                alignFrozen="right"
                body={action}
              >
              </Column>
            </DataTable>
          </div>

          <Modal
            show={showUpdateModal}
            onHide={handleFormClose}
            backdrop="static"
            className="max-width-600"
          >
            <div className="application-box">
              <div className="login_inner">
                <div class="login_form ">
                  <h5>
                    {" "}
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title>
                        View Export Request --{" "}
                        <big>{applicationDetail?.rbzReferenceNumber}</big>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ExportDashboardViewDetails
                      applicationDetail={applicationDetail}
                      // applicationmessage={applicationmessage}
                      handleFormClose={handleFormClose}
                      allcomment={allcomment}
                      tatHistory={tatHistory}
                      Actiondata={Actiondata}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            show={showEditForm}
            onHide={EditModalClose}
            backdrop="static"
            className="max-width-600"
          >
            <div className="application-box">
              <div className="login_inner">
                <div class="login_form ">
                  <h5>
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title>
                        Edit Export Request --{" "}
                        <big>
                          {applicationDetail?.rbzReferenceNumber
                            ? applicationDetail.rbzReferenceNumber
                            : ""}
                        </big>
                      </Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ExportDashboardEditDetails
                      applicationDetail={applicationDetail}
                      setApplicationDetail={setApplicationDetail}
                      EditModalClose={EditModalClose}
                      setexportdata={setexportdata}
                      handleData={handleData}
                      allcomment={allcomment}
                      GetRoleHandle={GetRoleHandle}
                      setapplicationstaus={setapplicationstaus}
                      applicationstaus={applicationstaus}
                      setnextlevelvalue={setnextlevelvalue}
                      nextlevelvalue={nextlevelvalue}
                      asignUser={asignUser}
                      userRole={userRole}
                      setAsignUser={setAsignUser}
                      supervisorHangechange={supervisorHangechange}
                      supervisorHangechangeBankuser={
                        supervisorHangechangeBankuser
                      }
                      tatHistory={tatHistory}
                      AssignUserID={AssignUserID}
                      setAssignUserID={setAssignUserID}
                      Actiondata={Actiondata}
                      SupervisorRoleId={SupervisorRoleId}
                      supervisorHangechangeRole={supervisorHangechangeRole}
                      setSupervisorRoleId={setSupervisorRoleId}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default ExportDashboardTable;
