import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterService } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import moment from "moment";
import { Storage } from "../login/Storagesetting";


const ExportAdvanceSearchTable = ({advanceSearchData}) => {
  const useId = Storage.getItem("userID");
  const roleID = Storage.getItem("roleIDs");
  const roleName = Storage.getItem("roleName");

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    companyName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bankName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    tinNumber: { value: null, matchMode: FilterMatchMode.IN },
  });
  
  const applicantName = (rowData) => {
    return (
      <span>
        {rowData.applicantName ? rowData.applicantName : "-"}
      </span>
    );
  };
  const typeOfImp = (rowData) => {
    return (
      <span>
        {rowData.applicantTypeName ? rowData.applicantTypeName : "-"}
      </span>
    );
  };
  const statusDate = (rowData) => {
    return (
      <span>
        {rowData.statusName ? rowData.statusName : "-"}
      </span>
    );
  };
  const submittedDate = (rowData) => {
    return (
      <span>
        {moment(rowData.submittedDate).format("DD MMM YYYY")}
      </span>
    );
  };

  const receivedDate = (rowData) => {
    return (
      <span>
        {moment(rowData.createdDate).format("DD MMM YYYY")}
      </span>
    );
  };


  // ----- End Code For Geting Table Data

  // ----- Start Code For Search Table Data
  // const filteredData = exportdata?.filter(
  //   (item) =>
  //     item?.rbzReferenceNumber
  //       ?.toLowerCase()
  //       .includes(searchText?.toLowerCase()) ||
  //     item?.companyName?.toString().includes(searchText) ||
  //     item?.supervisorName?.toString().includes(searchText) ||
  //     item?.amount?.toString().includes(searchText) ||
  //     item?.name?.toString().includes(searchText) ||
  //     moment(item?.applicationSubmittedDate)
  //       .format("DD:MM:YYYY")
  //       ?.toString()
  //       .includes(searchText) ||
  //     item?.applicationType?.toString().includes(searchText) ||
  //     item?.currencyName?.toString().includes(searchText) ||
  //     item?.status?.toString().includes(searchText)
  // );
  // ----- End Code For Search Table Data

 
  useEffect(() => {
   
  }, [advanceSearchData]);

 

  return (
    <>
        <div>
          <DataTable
            value={advanceSearchData}
            scrollable
            scrollHeight="650px"
            paginator={advanceSearchData.length > 10 ? true : false}
            filters={filters}
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
              field="applicantName"
              header="Applicant Name"
              sortable
              style={{ width: "220px" }}
              body={applicantName}
            ></Column>
            <Column
              field="rbzReferenceNumber"
              header="RBZ Reference Number"
              sortable
              style={{ width: "220px" }}
            ></Column>
            <Column
              field="bankName"
              header="Bank Name"
              sortable
              style={{ width: "220px" }}
            
            ></Column>
             <Column
              field="applicantTypeName"
              header="Type of Exporter"
              sortable
              style={{ width: "220px" }}
              body={typeOfImp}
            ></Column>
             <Column
              field="applicationName"
              header="Application Type"
              sortable
              style={{ width: "220px" }}
          
            ></Column>
          
            <Column
              field="amount"
              header="Amount"
              sortable
              style={{ width: "200px" }}
            ></Column>
            <Column
              field="currencyCode"
              header="Currency"
              sortable
             
            ></Column>
             <Column
              field="usdEquivalent"
              header="USD"
              sortable
             
            ></Column>
             <Column
              field="sectorName"
              header="Sector"
              sortable
             
            ></Column>
             <Column
              field="statusName"
              header="Status"
              sortable
              body={statusDate}
            ></Column>
             <Column
              field="createdDate"
              header="Applicant Received Date"
              sortable
              body={receivedDate}
             
            ></Column>
              <Column
              field="submittedDate"
              header="Applicant Submitted Date"
              sortable
              style={{ width: "140px" }}
              body={submittedDate}
            ></Column>
             {/* <Column
              field=""
              header="Bank Record Officer Received Date"
              sortable
             
            ></Column>
             <Column
              field=""
              header="Bank Record Officer Submited Date"
              sortable
             
            ></Column> */}
            
          </DataTable>
        </div>
    </>
  );
};

export default ExportAdvanceSearchTable;
