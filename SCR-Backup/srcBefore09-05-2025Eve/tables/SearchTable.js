import axios from "axios";
import React, { useState } from "react";
import { APIURL } from "../constant";
import { DataTable } from "primereact/datatable";
import Modal from "react-bootstrap/Modal";
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

  console.log("SearchData - ", SearchData);

  return (
    <div className="searchtable_bx">
      <div className="searchtable_inner_bx">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="button" disabled={SearchInput ? false : true} onClick={() => GetSearchData()}>
          Search
        </button>
      </div>

      {loading == true ? (
        <label className="outerloader2">
          <span className="loader"></span>
          <span className="loaderwait">Please Wait...</span>
        </label>
      ) : NoSearchData && !SearchData.length ? (
        <div className="row">
          <div className="col-12">
            <p>{NoSearchData}...</p>
          </div>
        </div>
      ) : (
        <div>
          {/* <DataTable
            value={SearchData}
            scrollable
            scrollHeight="500px"
            className={roleID >= 5 || roleID == 3 ? "mt-1" : "mt-1 tablehideth"}
            onSelectionChange={(e) => setSelectedAppliation(e.value)}
            paginator={data.length > 10 ? true : false}
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
          </DataTable> */}
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
