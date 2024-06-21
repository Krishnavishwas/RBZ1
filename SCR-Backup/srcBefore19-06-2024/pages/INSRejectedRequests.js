import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { Helmet } from "react-helmet";
import INSRejectedRequestsTable from "../tables/INSRejectedRequestsTable";

const INSRejectedRequests = () => {
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  return (
    <>
      <Helmet>
        <title>
          {menuname} {submenuname}
        </title>
      </Helmet>
      <DashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="">Inspectorate</Link>
            </li>
            <li className="breadcrumb-item active">Not Approved</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">NOT APPROVED REQUESTS</h4>
                <INSRejectedRequestsTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default INSRejectedRequests;
