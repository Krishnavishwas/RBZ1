import React, { useState, useRef } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import logo from '../Logo_T.png'

const BasicFilterDemo = () => {
    const [searchText, setSearchText] = useState("");
    const csvLinkRef = useRef();

    const handleClick = (title) => {
        alert(`Title: ${title}`);
    };

    const columns = [
        {
            name: 'Image',
            selector: row => row.img,
            cell: (d) => [
                <img src={d.img} className="imgicon" />
            ]
        },
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
            searchable: true,
        },
        {
            name: 'Year',
            selector: row => row.year,
            sortable: true,
            searchable: true,
        },
        {
            name: 'Age',
            selector: row => row.age,
            sortable: true
        },
        {
            name: "Action",
            sortable: false,
            selector: "null",
            cell: (d) => [
                <button
                    key={d.title}
                    onClick={() => handleClick(d.title)}
                >edit</button>,
                <button
                    onClick={() => handleClick(d.title)}
                >cancel</button>
            ]
        }
    ];

    const data = [
        {
            id: 1,
            title: 'Beetlejuice',
            age: '24',
            year: '1981',
            img: logo
        },
        {
            id: 2,
            title: 'Ghostbusters',
            age: '25',
            year: '1982',
            img: logo
        },
        {
            id: 3,
            title: 'Beetlejuice3',
            age: '26',
            year: '1983',
            img: logo
        },
        {
            id: 4,
            title: 'Ghostbusters4',
            age: '27',
            year: '1984',
            img: logo
        },
        {
            id: 5,
            title: 'Beetlejuice5',
            age: '28',
            year: '1985',
            img: logo
        },
        {
            id: 6,
            title: 'Ghostbusters6',
            age: '29',
            year: '1986',
            img: logo
        },
        {
            id: 7,
            title: 'Beetlejuice7',
            age: '30',
            year: '1987',
            img: logo
        },
        {
            id: 8,
            title: 'Ghostbusters8',
            age: '31',
            year: '1988',
            img: logo
        },
        {
            id: 9,
            title: 'Beetlejuice9',
            age: '32',
            year: '1989',
            img: logo
        },
        {
            id: 10,
            title: 'Beetlejuice10',
            age: '33',
            year: '1990',
            img: logo
        },
        {
            id: 11,
            title: 'Beetlejuice11',
            age: '34',
            year: '1991',
            img: logo
        },
        {
            id: 12,
            title: 'Ghostbusters12',
            age: '21',
            year: '1912',
            img: logo
        },
    ]

    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.year.toString().includes(searchText) ||
        item.age.toString().includes(searchText)
    );


    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Movie Data");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const excelData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        FileSaver.saveAs(excelData, "movie_data.xlsx");
    };

    return (
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
                            <CSVLink
                                data={filteredData}
                                filename={"movie_data.csv"}
                                className="hidden"
                                ref={csvLinkRef}
                            >
                                Export to CSV
                            </CSVLink>
                            <button onClick={handleExportExcel}>Export to Excel</button>
                        </div>
                    </div>
                }
            />

        </>
    );
};

export default BasicFilterDemo;