import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
// import ExportCompletedReturnTable from "../tables/ExportCompletedReturnTable"
import ImportCompletedReturnTable from '../tables/ImportCompletedReturnTable'
import { Helmet } from "react-helmet";
const ImportCompletedReturns = () => {
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
              <Link to="">Import</Link>
            </li>
            <li className="breadcrumb-item active">Completed Returns</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">COMPLETED RETURNS</h4>
                <ImportCompletedReturnTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default ImportCompletedReturns;
