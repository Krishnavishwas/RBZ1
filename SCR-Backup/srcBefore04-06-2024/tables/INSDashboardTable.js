import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const INSDashboardTable = () => {
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");

  const [INSData, setINSData] = useState([]);
  const [showEditForm, setshowEditForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [applicationmessage, setApplicationmessage] = useState("");
  const [editData, setEditdata] = useState({});
  const [searchText, setSearchText] = useState("");

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    await axios
      .post(APIURL + "InspectorateApplication/GetInspectorateApplications", {
        UserID: useId.replace(/"/g, ""),
        RoleID: rollId,
      })
      .then((res) => {
        console.log(res.data.responseData);
        if (res.data.responseCode === "200") {
          setINSData(res.data.responseData);
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
      selector: (row) => row.name || row.companyName,
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
  const filteredData = INSData?.filter(
    (item) =>
      item?.rbzReferenceNumber
        ?.toLowerCase()
        .includes(searchText?.toLowerCase()) ||
      item?.name?.toLowerCase().toString().includes(searchText) ||
      item?.applicationTitle?.toLowerCase().toString().includes(searchText) ||
      item?.amount?.toString().includes(searchText) ||
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
      {INSData.length === 0 ? (
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
        </>
      )}
    </>
  );
};

export default INSDashboardTable;
