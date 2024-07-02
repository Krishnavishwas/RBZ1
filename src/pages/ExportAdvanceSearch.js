import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { Storage } from "../login/Storagesetting";
import DashboardLayout from "../components/DashboardLayout";
import ExportAdvanceSearchForm from "../components/ExportAdvanceSearchForm"
import { Link } from "react-router-dom";
import { APIURL, ImageAPI } from "../constant";

const ExportAdvanceSearch = () => {
  const UserID = Storage.getItem("userID");
  const [saveSearchListData, setSaveSearchListData] = useState([]);
  const [saveSearchSelectedValue, setSaveSearchSelectedValue] = useState([]);
  const [saveSearchChangeValue, setSaveSearchChangeValue] = useState('');

  const saveSearchList = async (e) => {

    await axios
      .post(APIURL + "ReportData/GetsearchRecord", {
        UserID: UserID.replace(/"/g, ""),
        DepartmentID: 2,
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setSaveSearchListData(res.data.responseData)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeSelectSave = async(e) => {
    const { name, value } = e.target;
    setSaveSearchChangeValue(value)

    await axios
      .post(APIURL + "ReportData/GetsearchRecordByID", {
        ID:value
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          const jsonData= JSON.parse(res.data.responseData?.jsonData);
          setSaveSearchSelectedValue(jsonData)
        }else {
          setSaveSearchSelectedValue(res.data.responseData)
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //   setSaveSearchListData((prev) =>
    //  ({ ...prev, [name]:value }))
  }

  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  useEffect(() => {
    saveSearchList();
  }, [])
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
              <Link to="/BankADLADashboard">Exports</Link>
            </li>
            <li className="breadcrumb-item active">Advance Search</li>
          </ol>
        </nav>

        <section className="section dashboard">
          <div className="row">
            <div className="col-md-12">
              <div className="datatable advance_save">
                {/* <h4 className="section_top_heading">BANK REPORT</h4> */}
                <h4 className="section_top_heading">REPORT PARAMETERS
                  <div class="form-bx">
                    <label>
                    <select
                      onChange={(e) => {
                        handleChangeSelectSave(e);
                        // handleUsertype(e);
                      }}
                      value={saveSearchChangeValue}
                    // name="exporterType"
                    >
                      <option selected value=''>Select Save Search</option>
                      {saveSearchListData?.map((item, index) => {
                        return (
                          <>
                            <option value={item?.id} key={index}>
                              {item.searchName}
                            </option>
                          </>
                        );
                      })}

                    </select>
                  </label>
                  </div>
                </h4>

                {/* <h5 className="section_top_subheading">REPORT PARAMETERS</h5> */}

                <ExportAdvanceSearchForm 
                saveSearchSelectedValue={saveSearchSelectedValue}
                saveSearchList={saveSearchList}
                setSaveSearchChangeValue={setSaveSearchChangeValue}
                       
                />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default ExportAdvanceSearch;
