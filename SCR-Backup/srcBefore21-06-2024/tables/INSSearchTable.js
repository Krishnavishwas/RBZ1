import axios from "axios";
import React, { useState, useRef } from "react";
import { APIURL } from "../constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import ExportDashboardViewDetails from "../components/ExportDashboardViewDetails";

const INSSearchTable = () => {
  const SearchInputRef = useRef(null);
  const [SearchInput, setSearchInput] = useState("");
  const [SearchData, setSearchData] = useState([]);
  const [NoSearchData, setNoSearchData] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [responceCount, setresponceCount] = useState([]);
  const [showdataLoader, setshowdataloader] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [noDataComment, setNoDataComment] = useState([]);
  const [allcomment, setallcomment] = useState([]);
  const [tatHistory, setTatHistory] = useState([]);
  const [Actiondata, setActiondata] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFormClose = () => setShowUpdateModal(false);

  const handleClear = () => {
    setActiondata([]);
    setTatHistory([]);
    setallcomment([]);
    setNoDataComment([]);
    setErrors({});
    setApplicationmessage("");
    setApplicationDetail({});
    setshowdataloader(false);
    setresponceCount([]);
    setShowUpdateModal(false);
    setLoading(false);
    setNoSearchData("");
    if (SearchInputRef.current) SearchInputRef.current.value = "";
    setSearchData([]);
    setSearchInput("");
  };

  const validateSearch = () => {
    let valid = true;
    const newErrors = {};
    if (SearchInput.trim().length < 4) {
      newErrors.SearchInput = "RBZ reference number allow minimum 4 numbers";
      valid = false;
    } else if (SearchInput.trim().length > 6) {
      newErrors.SearchInput = "RBZ reference number allow maximum 6 numbers";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const changeHandelFormValidate = (e) => {
    const { name, value } = e.target;
    const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;
    let newErrors = {};
    let valid = true;
    if (name == "SearchInput" && specialChars.test(value)) {
      newErrors.SearchInput = "Special characters not allowed";
      valid = false;
    } else if (name == "SearchInput" && value == " ") {
      newErrors.SearchInput = "First character cannot be a blank space";
      valid = false;
    } else {
      setSearchInput(value);
    }
    setErrors(newErrors);
  };

//   console.log("errors - ", errors);

  const GetSearchData = async () => {
    if (validateSearch()) {
      try {
        setLoading(true);
        let getData = await axios.post(
          APIURL + "InspectorateApplication/INSApplicationSearch",
          {
            RBZReferenceNumber: SearchInput,
          }
        );
        if (getData?.data.responseCode == 200) {
          setSearchData(getData?.data?.responseData);
          setLoading(false);
        } else if (getData?.data.responseCode == 401) {
          setLoading(false);
          setSearchData([]);
          setNoSearchData(getData?.data.responseMessage);
        }
      } catch (error) {
        setLoading(false);
        console.log("Search Error - ", error);
      }
    }
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

  const handleViewData = (id) => {
    setShowUpdateModal(true);
  };

  const GetHandelDetail = async (rbzrefnumber, id) => {
    setshowdataloader(true);
    await axios
      .post(APIURL + "InspectorateApplication/GetINSRequestInfoByApplicationID", {
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
          onClick={() => {
            handleViewData(rowData.id);
            GetHandelDetail(rowData?.rbzReferenceNumber, rowData.id);
            GetApplicationCount(rowData.id);
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      GetSearchData();
    }
  };

  return (
    <div className="searchtable_bx">
      <div
        className={
          errors.SearchInput
            ? "searchtable_inner_bx-error"
            : "searchtable_inner_bx"
        }
      >
        <input
          ref={SearchInputRef}
          type="number"
          name="SearchInput"
          placeholder="Search RBZ Reference Number"
          className={errors.SearchInput ? "error" : ""}
          value={SearchInput.trim()}
          onKeyDown={handleKeyDown}
          onChange={(e) => changeHandelFormValidate(e)}
        />
        <span className="sspan"></span>
        {errors.SearchInput ? (
          <small className="errormsg">{errors.SearchInput}</small>
        ) : (
          ""
        )}
        <button
          type="button"
          className="searchButton"
          disabled={SearchInput ? false : true}
          onClick={() => GetSearchData()}
          onKeyDown={handleKeyDown}
        >
          Search
        </button>
        <button
          type="button"
          className="resetButton"
          onClick={() => handleClear()}
        >
          Reset
        </button>
      </div>
      <hr />

      {loading == true ? (
        <label className="outerloader2">
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : NoSearchData && !SearchData.length ? (
        <div className="row">
          <div className="col-12 text-center">
            <p>{NoSearchData}</p>
          </div>
        </div>
      ) : SearchData.length ? (
        <div>
          <DataTable
            value={SearchData}
            scrollable
            scrollHeight="500px"
            className="mt-1"
            paginator={SearchData.length > 10 ? true : false}
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
      ) : (
        <div className="row">
          <div className="col-12 text-center">
            <p>No records to show</p>
          </div>
        </div>
      )}
      <Modal
        show={showUpdateModal}
        onHide={handleFormClose}
        backdrop="static"
        className="max-width-600"
      >
        <div className="application-box">
          <div className="login_inner">
            <div className="login_form ">
              <h5>
                <Modal.Header closeButton className="p-0">
                  <Modal.Title>
                    View Inspectorate Request --{" "}
                    <big>{applicationDetail?.rbzReferenceNumber}</big>
                  </Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel">
              <Modal.Body className="p-0">
                <ExportDashboardViewDetails
                  applicationDetail={applicationDetail}
                  handleFormClose={handleFormClose}
                  allcomment={allcomment}
                  tatHistory={tatHistory}
                  Actiondata={Actiondata}
                  noDataComment={noDataComment}
                  showdataLoader={showdataLoader}
                  responceCount={responceCount}
                />
              </Modal.Body>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default INSSearchTable;
