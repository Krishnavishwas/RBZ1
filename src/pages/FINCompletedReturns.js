import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
// import ExportCompletedReturnTable from "../tables/ExportCompletedReturnTable"
import FINCompletedReturnTable from '../tables/FINCompletedReturnTable'
import { Helmet } from "react-helmet";
const FINCompletedReturns = () => {
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
              <Link to="">Foreign Investment
              </Link>
            </li>
            <li className="breadcrumb-item active">Completed Returns</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">COMPLETED RETURNS</h4>
                <FINCompletedReturnTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default FINCompletedReturns;
