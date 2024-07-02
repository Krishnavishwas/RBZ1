import React, { useState, useEffect } from "react";
import { Storage } from "../login/Storagesetting";
import ExportDashboardTable from "../tables/ExportDashboardTable";
import ImportDashboardTable from "../tables/ImportDashboardTable";
import FINDashboardTable from "../tables/FINDashboardTable";
import ExportCircularsTable from "../tables/ExportCircularsTable";
import INSDashboardTable from "../tables/INSDashboardTable";

const AllDashboardTable = () => {
  const menuitem = Storage.getItem("menuitem");
  const menuitems = JSON.parse(menuitem);

  const [tabDepId, setTabDepId] = useState(`${menuitems[1].id}`);

  console.log("tabDepId - ", tabDepId);
  const tabHeader = (
    <div className="application-tab w-100 mt-4">
      <ul className="nav nav-pills mb-3">
        {menuitems?.map((v) => {
          return (
            <>
              {v.menuName === "Exports" && (
                <li className="nav-item">
                  <a
                    className={tabDepId == "2" ? "nav-link active" : "nav-link"}
                    onClick={() => setTabDepId("2")}
                  >
                    {v.menuName}
                  </a>
                </li>
              )}

              {v.menuName === "Imports" && (
                <li className="nav-item">
                  <a
                    className={tabDepId == "3" ? "nav-link active" : "nav-link"}
                    onClick={() => setTabDepId("3")}
                  >
                    {v.menuName}
                  </a>
                </li>
              )}

              {v.menuName === "Foreign Investments" && (
                <li className="nav-item">
                  <a
                    className={tabDepId == "4" ? "nav-link active" : "nav-link"}
                    onClick={() => setTabDepId("4")}
                  >
                    {v.menuName}
                  </a>
                </li>
              )}

              {v.menuName === "Inspectorate" && (
                <li className="nav-item">
                  <a
                    className={tabDepId == "5" ? "nav-link active" : "nav-link"}
                    onClick={() => setTabDepId("5")}
                  >
                    {v.menuName}
                  </a>
                </li>
              )}  
            </>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      <h4 className="section_top_heading">ALL DASHBOARD REQUESTS</h4>
      {tabHeader}
      {tabDepId === "2" ? (
        <ExportDashboardTable tabDepId={tabDepId} />
      ) : tabDepId === "3" ? (
        <ImportDashboardTable tabDepId={tabDepId} />
      ) : tabDepId === "4" ? (
        <FINDashboardTable tabDepId={tabDepId}/>
      ) : tabDepId === "5" ? (
        <INSDashboardTable tabDepId={tabDepId} />
      ) : tabDepId === "9" ? (
        <ExportCircularsTable />
      ) : (
        ""
      )}
    </>
  );
};

export default AllDashboardTable;
