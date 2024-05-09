import axios from "axios";
import React, { useState } from "react";
import { APIURL } from "../constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import ExportDashboardViewDetails from "../components/ExportDashboardViewDetails";

const SearchTable = () => {
  const [SearchInput, setSearchInput] = useState("");
  const [SearchData, setSearchData] = useState([]);
  const [NoSearchData, setNoSearchData] = useState("");
  const [loading, setLoading] = useState(false);

  const GetSearchData = async () => {
    try {
      setLoading(true);
      let getData = await axios.post(
        APIURL + "ExportApplication/ExportApplicationSearch",
        {
          RBZReferenceNumber: SearchInput,
        }
      );
      if (getData?.data.responseCode == 200) {
        setSearchData(getData?.data?.responseData);
        setLoading(false);
      } else if (getData?.data.responseCode == 401) {
        setLoading(false);
        setNoSearchData(getData?.data.responseMessage);
      }
    } catch (error) {
      setLoading(false);
      console.log("Search Error - ", error);
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
      </>
    );
  };

  console.log("SearchData - ", SearchData);

  return (
    <div className="searchtable_bx">
      <div className="searchtable_inner_bx">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="button"
          disabled={SearchInput ? false : true}
          onClick={() => GetSearchData()}
        >
          Search
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
            // className={roleID >= 5 || roleID == 3 ? "mt-1" : "mt-1 tablehideth"}
            className="mt-1 tablehideth"
            // onSelectionChange={(e) => setSelectedAppliation(e.value)}
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
            <p>No records to showv</p>
          </div>
        </div>
      )}
      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default SearchTable;
