import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import logo from '../Logo_T.png'
import axios from "axios";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";


const ExportDashboardTable = () => {

    const useId = Storage.getItem("userID")

    const [exportdata, setexportdata]= useState([])

    const [searchText, setSearchText] = useState("");
    const csvLinkRef = useRef();

    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };

    useEffect(()=>{

        const handleData = async ()=>{

            await axios.post(APIURL + "ExportApplication/GetExportApplications",{
                UserID:useId.replace(/"/g, "")
            })
            .then((res)=>{
                if(res.data.responseCode === "200"){
                    setexportdata(res.data.responseData)
                }
            })
        }

        handleData();

    },[])
    

    const columns = [
        // {
        //     name: 'Image',
        //     selector: row => row.img,
        //     cell: (d) => [
        //         <img src={d.img} className="imgicon" />
        //     ]
        // },
        {
            name: 'RBZ Reference Number',
            selector: row => row.rbzReferenceNumber,
            sortable: true,
            searchable: true,
        },
        {
            name: 'Applicant Name',
            selector: row => row.name,
            sortable: true,
            searchable: true,
        },
        {
            name: 'Submitted Date',
            selector: row => row.supervisorName,
            sortable: true
        },
        {
            name: 'Application Type',
            selector: row => row.applicationDate,
            sortable: true
        }, 
        {
            name: 'Currency',
            selector: row => row.currency,
            sortable: true
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.sectorName,
            sortable: true
        },
        {
            name: 'View Details',
            // selector: row => row.Details,
            cell:(row)=>[
                <Link><b><i className="bi bi-eye"></i></b></Link>
            ]
        },

        {
            name: "Edit Details",
            sortable: false,
            selector: "null",
            cell: (row) => [
                <button
                    key={row.title}
                    onClick={() => handleClick(row.title)}
                    className="edit-btn"
                ><i className="bi bi-pencil"></i></button> 
            ]
        },
        {
            name: "Delete",
            sortable: false,
            selector: "null",
            cell: (row) => [ 
                <button
                    onClick={() => handleClick(row.title)}
                    className="delete-btn"
                ><i className="bi bi-trash"></i></button>
            ]
        }
    ];

    // const filteredData = exportdata.filter(item =>
    //     item.rbzReferenceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
    //     item.name.toString().includes(searchText) ||
    //     item.supervisorName.toString().includes(searchText)
    // );


    // const handleExportExcel = () => {
    //     const worksheet = XLSX.utils.json_to_sheet(filteredData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Movie Data");
    //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //     const excelData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    //     FileSaver.saveAs(excelData, "movie_data.xlsx");
    // };



    return (
        <>
            <div>
                {exportdata.length === 0 ? (
                    <div>No data Found</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={tableData}
                        pagination
                        highlightOnHover
                        dense
                        striped
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
                                {/* <div className="table-btn-bx">
                                    <button onClick={handleExportExcel} disabled={!filteredData.length}>
                                        Export to Excel
                                    </button>
                                </div> */}
                            </div>
                        }
                    />
                )}
            </div>
        </>
    );
    
}

export default ExportDashboardTable
