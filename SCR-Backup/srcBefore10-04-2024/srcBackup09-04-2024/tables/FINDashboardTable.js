import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// import Modal from "react-bootstrap/Modal";
// import ImportDashboardViewDetails from "../components/ImportDashboardViewDetails";
// import ImportDashboardEditDetails from "../components/ImportDashboardEditDetails";
// import { CSVLink } from "react-csv";
// import * as FileSaver from "file-saver";
// import * as XLSX from "xlsx";

const FINDashboardTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");

  const [FINData, setFINData] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [editData, setEditdata] = useState({});
  const [searchText, setSearchText] = useState("");
  // const EditModalClose = () => setshowEditForm(false);
  // const handleFormClose = () => setShowUpdateModal(false);

  // ----- Start Code For Open Edit Popup
  // const handleClickEditModal = (title) => {
  //   setshowEditForm(true);
  // };
  // ----- End Code For Open Edit Popup

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    await axios
      .post(APIURL + "FINApplication/GetFINApplications", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
      })
      .then((res) => {
        console.log("FIN-GetFINApplications - ", res);
        if (res.data.responseCode === "200") {
          setFINData(res.data.responseData);
        }
      });
  };
  // ----- End Code For Geting Table List Data

  // ----- Start Code For Table Heading Column
  const columns = [
    {
      name: "RBZ Reference Number",
      selector: (row) => row.rbzReferenceNumber,
      sortable: true,
      searchable: true,
      width: "280px",
    },
    {
      name: "Applicant Name",
      selector: (row) => row.companyName || row.name,
      sortable: true,
      searchable: true,
      width: "300px",
      cell: (row) => (
        <>
          {row.applicantTypeID === 1 ? (
            <span>
              <i className="bi bi-c-circle text-primary"></i>
              &nbsp;&nbsp;{row.companyName}
            </span>
          ) : row.applicantTypeID === 2 ? (
            <span>
              <i className="bi bi-person-circle"></i>
              &nbsp;&nbsp;{row.name}
            </span>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      name: "Submitted Date",
      selector: (row) => row.applicationSubmittedDate,
      sortable: true,
      width: "160px",
      cell: (row) => (
        <span>
          {moment(row.applicationSubmittedDate).format("DD MMM YYYY")}
        </span>
      ),
    },
    {
      name: "Application Type",
      selector: (row) => row.applicationType,
      sortable: true,
      width: "250px",
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      searchable: true,
      width: "140px",
      cell: (row) => (
        <span>
          <strong>{row.currencyCode}</strong>&nbsp;{row.amount}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) =>
        row.status == 0 ? "Draft" : "Submitted to bank Analyst",
      sortable: true,
      width: "190px",
    },

    {
      name: "Action",
      cell: (row) => [
        <Link
          onClick={() => {
            toast.warning("Work in Process");
            // handleViewData(row?.id);
            // GetHandelDetail(row?.id);
          }}
          className="mr-1"
        >
          <b>
            <i className="bi bi-eye"></i>
          </b>
        </Link>,
      ],
    },
  ];
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

  // ----- Start Code For Search Table Data
  const filteredData = FINData?.filter(
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
  // ----- End Code For Search Table Data

  useEffect(() => {
    handleData();
  }, []);

  return (
    <>
      {FINData.length === 0 ? (
        <div className="p-3">No records to show</div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filteredData}
            paginationRowsPerPageOptions={[10, 50, 100]}
            pagination
            highlightOnHover
            className="exporttable"
            defaultSortFieldId={3}
            defaultSortAsc={false}
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

          {/* <Modal
            show={showUpdateModal}
            onHide={handleFormClose}
            backdrop="static"
            className="max-width-600"
          >
            <div className="application-box">
              <div className="login_inner">
                <div class="login_form ">
                  <h5>
                    <Modal.Header closeButton className="p-0">
                      <Modal.Title>View Import Request</Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ImportDashboardViewDetails
                      applicationDetail={applicationDetail}
                      applicationmessage={applicationmessage}
                      handleFormClose={handleFormClose}
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
                      <Modal.Title>Edit Import Request</Modal.Title>
                    </Modal.Header>
                  </h5>
                </div>
                <div className="login_form_panel">
                  <Modal.Body className="p-0">
                    <ImportDashboardEditDetails
                      applicationDetail={applicationDetail}
                      setApplicationDetail={setApplicationDetail}
                      EditModalClose={EditModalClose}
                      handleData={handleData}
                      editData={editData}
                    />
                  </Modal.Body>
                </div>
              </div>
            </div>
          </Modal> */}
        </>
      )}
    </>
  );
};

export default FINDashboardTable;
