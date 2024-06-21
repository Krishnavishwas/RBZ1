import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "react-data-table-component";
import axios from "axios";

import moment from "moment";

const TatData = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [TatData, setTatData] = useState();
  const [CalDATA, setCalDATA] = useState([]);
  const handleSubmit = async () => {
    if (startTime > endTime) {
      return alert("End Date cannot greater than Start Date");
    }
    if (startTime && endTime) {
      await axios
        .post("https://dmsupgrade.in/API/Master/GetTAT", {
          STARTDATE: moment(startTime).format("YYYY-MM-DD HH:mm:ss.SSS"),
          ENDDATE: moment(endTime).format("YYYY-MM-DD HH:mm:ss.SSS"),
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
            setTatData(res.data.responseData);
          }
          else{
            setTatData()
          }
        })
        .catch((err) => console.log("error - ", err));
    } else {
      alert("Please select both start and end time.");
    }
  };

  useEffect(() => {
    axios
      .post("https://dmsupgrade.in/API/Master/GetHolidayList")
      .then((res) => {
        if (res.data.responseCode === "200") {
          setCalDATA(res.data.responseData);
        }
      })
      .catch((err) => console.log("error - ", err));
  }, []);

  const columns = [
    {
      name: "Sr.",
      selector: (row) => row.id,
      sortable: true,
      searchable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      searchable: true,
      cell: (row) => <span>{moment(row.date).format("DD MMM YYYY")}</span>,
    },
    {
      name: "Day",
      selector: (row) => row.day,
      sortable: true,
    },
    {
      name: "Details",
      selector: (row) => row.holidaY_DETAILS,
      sortable: true,
    },
  ];

  return (
    <>
      <div className=" mt-5">
        <div className="container">
          <div className="row">
            <div className="col-8 card offset-2  p-0 ">
              <h2 className="header-txt">
                Turn-Around-Time (TAT) - Calculations Check
              </h2>
              <div className=" p-3">
                <div className="row mb-4">
                  <div className="col-6 tatdate">
                    <h6>Task Assigned Date/Time</h6>
                  </div>
                  <div className="col-6">
                    <div style={{ position: "relative" }}>
                      <DatePicker
                        placeholderText="Select Start Time"
                        className="tatdatew"
                        selected={startTime}
                        onChange={(date) => setStartTime(date)}
                        showTimeInput
                        timeInputLabel="Time:"
                        // showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-6 tatdate">
                    <h6>Task Completed Date/Time </h6>
                  </div>
                  <div className="col-6">
                    <div style={{ position: "relative" }}>
                      <DatePicker
                        placeholderText="Select End Time"
                        className="tatdate"
                        selected={endTime}
                        onChange={(date) => setEndTime(date)}
                        // showTimeSelect
                        showTimeInput
                        timeInputLabel="Time:"
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-2">
                    <button
                      className={
                        TatData !== null ? "btn btn-primary" : "btn btn-success"
                      }
                      style={{ width: "200px" }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="row my-5 bg-light p-3">
                  <div className="col-6 tatdate">
                    <h6>Calculated TAT </h6>
                  </div>
                  <div className="col-6">
                    {TatData != undefined || TatData != null
                      ? `${TatData?.totalHour} / ${TatData?.totalMinutes} `
                      : "-- / --"}
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-12">
                    <p>
                      <b>Please note: </b>
                      <ol>
                        <li>
                          We have considered the Working hours to be 8:00 am to
                          4:30 pm.
                        </li>
                        <li>
                          For work completed in non-working
                          hours/holidays/weekends, we are adding only additional
                          time of 30 minutes or actual time spent in non-working
                          hours, whichever is less.
                        </li>
                        <li>
                          Following Holidays are listed in the Holiday’s
                          Calendar.
                        </li>
                      </ol>
                    </p>
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-12">
                    <div className="border border-primary border-4">
                      <DataTable
                        columns={columns}
                        title="Holiday List"
                        data={CalDATA}
                        // paginationRowsPerPageOptions={[20, 50, 100]}
                        // pagination
                        highlightOnHover
                        className="exporttable "
                        defaultSortFieldId={1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TatData;
