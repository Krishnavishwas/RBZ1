import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import BankMasterTable from "../tables/BankMasterTable";
import { Storage } from "../../login/Storagesetting";

const BankMaster = () => {
  return (
    <>
      <Helmet>
        <title>Bank</title>
      </Helmet>
      <AdminDashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="index.html">Home</a>
            </li>
            <li className="breadcrumb-item active">Bank</li>
          </ol>
        </nav>
        <section className="section dashboard adminDashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">Bank </h4>

                {/* BankMaster tableData */}
                <BankMasterTable />
              </div>
            </div>
          </div>
        </section>
      </AdminDashboardLayout>
    </>
  );
};

export default BankMaster;
