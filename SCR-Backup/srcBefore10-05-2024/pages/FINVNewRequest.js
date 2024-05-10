import React from "react";
import { Helmet } from "react-helmet";
import DashboardLayout from "../components/DashboardLayout";
import { Link } from "react-router-dom";
import FINVNewRequestForm from "../components/FINVNewRequestForm";

const FINVNewRequest = () => {
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  return (
    <>
      <Helmet>
        <title>{menuname} {submenuname}</title>
      </Helmet>
      <DashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/BankADLADashboard">Foreign Investment</Link>
            </li>
            <li className="breadcrumb-item active">New Request</li>
          </ol>
        </nav>
        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">NEW REQUEST</h4>
                <h5 className="section_top_subheading">General Info</h5>
                <FINVNewRequestForm />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default FINVNewRequest;
