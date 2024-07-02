import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Helmet } from "react-helmet";
import ImportReturnDashboardTable from "../tables/ImportReturnDashboardTable";

const ImportReturnDashboard = () => {
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");

  return (
    <>
      <Helmet>
        <title>
          {menuname ? menuname : "Imports"}
          {submenuname ? submenuname : "Dashboard"}
        </title>
      </Helmet>
      <DashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/BankADLADashboard">Imports</Link>
            </li>
            <li className="breadcrumb-item active">Returns Dashboard</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">RETURN REQUESTS</h4>
                <ImportReturnDashboardTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default ImportReturnDashboard;
