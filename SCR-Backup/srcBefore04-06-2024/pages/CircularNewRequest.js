import React from "react";
import { Helmet } from "react-helmet";
import DashboardLayout from "../components/DashboardLayout";
import ExportNewRequestForm from "../components/ExportNewRequestForm";
import ExportCircularsCreateForm from '../components/ExportCircularsCreateForm'
import { Link } from "react-router-dom";

const CircularNewRequest = () => {
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
              <Link to="/BankADLADashboard">Circular</Link>
            </li>
            <li className="breadcrumb-item active">New Circular</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">NEW CIRCULAR</h4>

                <h5 className="section_top_subheading">Circular Info</h5>

                <ExportCircularsCreateForm />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default CircularNewRequest;
