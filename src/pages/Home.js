import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Helmet } from "react-helmet";
import AllDashboardTable from "../tables/AllDashboardTable";

const Home = () => {
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");

  return (
    <>
      <Helmet>
        <title>
           {menuname != null ? menuname : "Home"}{" "}
          {submenuname != null ? submenuname : "All Dashboard"}
        </title>
      </Helmet>
      <DashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/AllDashboard">Home</Link>
            </li>
            <li className="breadcrumb-item active">All Dashboard</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <AllDashboardTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default Home;
