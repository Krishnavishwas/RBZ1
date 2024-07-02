import React from "react";
import { Link,useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import SearchTable from "../tables/SearchTable";
import { Helmet } from "react-helmet";

const Search = () => {
  const navigate = useNavigate();
  const handleAdvanceSearch = () => {
    navigate("/AdvanceSearchExport");
  }
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
              <Link to="">Exports</Link>
            </li>
            <li className="breadcrumb-item active">Search</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">
                SEARCH APPLICATION
                  <button
                    type="button"
                    className="adSearchButton"
                    onClick={() => handleAdvanceSearch()}
                  >
                    Advance Search
                  </button></h4>
                <SearchTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default Search;
