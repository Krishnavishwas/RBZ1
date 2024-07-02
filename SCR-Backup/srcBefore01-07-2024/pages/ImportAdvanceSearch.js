import React from "react";
import { Helmet } from "react-helmet";
import DashboardLayout from "../components/DashboardLayout";
import ImportAdvanceSearchForm from "../components/ImportAdvanceSearchForm";
import { Link } from "react-router-dom";

const ImportAdvanceSearch = () => {
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  return (
    <>
      <Helmet>
        {" "}
        <title>
          {menuname ? menuname : "Export"}{" "}
          {submenuname ? submenuname : "Dashboard"}
        </title>{" "}
      </Helmet>
      <DashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/BankADLADashboard">Import</Link>
            </li>
            <li className="breadcrumb-item active">Advance Search</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                {/* <h4 className="section_top_heading">BANK REPORT</h4> */}
                <h4 className="section_top_heading">REPORT PARAMETERS</h4>

                {/* <h5 className="section_top_subheading">REPORT PARAMETERS</h5> */}

                <ImportAdvanceSearchForm />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default ImportAdvanceSearch;
