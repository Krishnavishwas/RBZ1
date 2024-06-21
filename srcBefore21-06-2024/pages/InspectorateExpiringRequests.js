import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import InspectorateExpiringRequestsTable from "../tables/InspectorateExpiringRequestsTable";
import { Helmet } from "react-helmet";

const InspectorateExpiringRequests = () => {
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
            <li className="breadcrumb-item active">Expiring</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">EXPIRING REQUESTS</h4>
                <InspectorateExpiringRequestsTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default InspectorateExpiringRequests;
