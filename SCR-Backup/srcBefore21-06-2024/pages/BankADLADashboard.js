import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ExportDashboardTable from "../tables/ExportDashboardTable";
import { Helmet } from "react-helmet";
import { Storage } from "../login/Storagesetting";
import { APIURL } from "../constant";
import axios from "axios";

const BankADLADashboard = () => {
  const [data, setData] = useState([]);

  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");

  const RoleId = Storage.getItem("roleIDs");
  const useId = Storage.getItem("userID");

  const clickhandlerole = () => {
    sessionStorage.setItem("submenuname", "Acting Role");
  };

  // ----- Start Code For Geting Table List Data
  const handleData = async () => {
    await axios
      .post(APIURL + "ExportApplication/GetActingDashboardData", {
        DepartmentID: "2",
        UserID: useId.replace(/"/g, ""),
        RoleID: RoleId,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setData(res.data.responseData);
        } else {
          setData([]);
        }
      });
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {menuname ? menuname : "Export"}{" "}
          {submenuname ? submenuname : "Dashboard"}
        </title>{" "}
      </Helmet>
      <DashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/BankADLADashboard">Exports</Link>
            </li>
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">
                  SUBMITTED REQUESTS
                  {(RoleId == "6" || RoleId == "7" || RoleId == "8") &&
                  data?.length ? (
                    <Link
                      to="/ActingRoleDashboard"
                      className="act_btn-dashboard"
                      onClick={clickhandlerole}
                    >
                      Acting Role <span>{data?.length}</span>
                    </Link>
                  ) : (
                    ""
                  )}
                </h4>
                <ExportDashboardTable />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default BankADLADashboard;
