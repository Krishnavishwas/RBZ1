import React, { useState, useRef } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import logo from "../Logo_T.png";

const DashboardTable = () => {
  const [searchText, setSearchText] = useState("");
  const csvLinkRef = useRef();

  const handleClick = (title) => {
    alert(`Title: ${title}`);
  };

  const columns = [
    // {
    //     name: 'Image',
    //     selector: row => row.img,
    //     cell: (d) => [
    //         <img src={d.img} className="imgicon" />
    //     ]
    // },
    {
      name: "RBZ Reference Number",
      selector: (row) => row.title,
      sortable: true,
      searchable: true,
    },
    {
      name: "Applicant Name",
      selector: (row) => row.year,
      sortable: true,
      searchable: true,
    },
    {
      name: "Beneficiary",
      selector: (row) => row.Beneficiary,
      sortable: true,
    },
    {
      name: "Submitted Date",
      selector: (row) => row.Date,
      sortable: true,
    },
    {
      name: "Application Category",
      selector: (row) => row.Category,
      sortable: true,
    },
    {
      name: "Currency",
      selector: (row) => row.Currency,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.Amount,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.Status,
      sortable: true,
    },
    {
      name: "View Details",
      selector: (row) => row.Details,
    },

    // {
    //     name: "Action",
    //     sortable: false,
    //     selector: "null",
    //     cell: (d) => [
    //         <button
    //             key={d.title}
    //             onClick={() => handleClick(d.title)}
    //         >edit</button>,
    //         <button
    //             onClick={() => handleClick(d.title)}
    //         >cancel</button>
    //     ]
    // }
  ];

  const data = [
    {
      id: 1,
      title: "",
      age: "",
      year: "",
      // img: logo
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.year.toString().includes(searchText) ||
      item.age.toString().includes(searchText)
  );

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movie Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    FileSaver.saveAs(excelData, "movie_data.xlsx");
  };

  return (
    <>
      <>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
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
              <div className="table-btn-bx">
                {/* <CSVLink
                                data={filteredData}
                                filename={"movie_data.csv"}
                                className="hidden"
                                ref={csvLinkRef} 
                            >
                                Export to CSV
                            </CSVLink> */}
                <button onClick={handleExportExcel} disabled>
                  Export to Excel
                </button>
              </div>
            </div>
          }
        />
      </>
    </>
  );
};

export default DashboardTable;
