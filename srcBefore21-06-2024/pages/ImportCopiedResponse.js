import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ImportCopiedResponseTable from "../tables/ImportCopiedResponseTable";
import { Helmet } from "react-helmet";

const ImportCopiedResponse = () => {
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
              <Link to="">Imports</Link>
            </li>
            <li className="breadcrumb-item active">Copied Response</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">COPIED RESPONSE</h4>
                <ImportCopiedResponseTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default ImportCopiedResponse;
