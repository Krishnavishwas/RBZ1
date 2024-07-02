import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Helmet } from "react-helmet";
import FINReturnDashboardTable from "../tables/FINReturnDashboardTable";

const FINReturnDashboard = () => {
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");

  return (
    <>
      <Helmet>
        <title>
          {menuname ? menuname : "Foreign Investments"}
          {submenuname ? submenuname : "Dashboard"}
        </title>
      </Helmet>
      <DashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/BankADLADashboard">Foreign Investments</Link>
            </li>
            <li className="breadcrumb-item active">Returns Dashboard</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">RETURN REQUESTS</h4>
                <FINReturnDashboardTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default FINReturnDashboard;
