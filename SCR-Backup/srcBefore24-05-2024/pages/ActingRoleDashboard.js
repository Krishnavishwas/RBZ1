import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import ExportActingroleTable from "../tables/ExportActingroleTable";
import { Helmet } from "react-helmet";
import { Storage } from "../login/Storagesetting";
import { APIURL } from "../constant";
import axios from "axios";

const ActingRoleDashboard = () => {
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  const RoleId = Storage.getItem("roleIDs");
  const [userselect, setuserselect]=useState('All');
  const [actionUserList, setactionUserList] = useState([]);
  const useId = Storage.getItem("userID");
  const rollId = Storage.getItem("roleIDs");

  const clickhandlerole = () => {
    sessionStorage.setItem("submenuname", "Dashboard");
  };

  const handleselectUser = (e)=>{ 
    setuserselect(e.target.value)
  }

  const HandleUSerList = ()=>{
    axios.post(APIURL + "User/GetUsersData", {
      UserID: useId.replace(/"/g, "")
    })
    .then((res)=>{ 
      if(res.data.responseCode == "200"){  
        setactionUserList(res.data.responseData)
      }
    })
    .catch((err)=>{
      console.log("Action User List", err)
    })
  }
  console.log("actionUserList", actionUserList)

  useEffect(()=>{
    HandleUSerList()
  },[])

  return (
    <>
      <Helmet>
        {" "}
        <title>
          {menuname ? menuname : "Export"}{" "}
          {submenuname ? submenuname : "Acting Role"}
        </title>{" "}
      </Helmet>
      <DashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/BankADLADashboard">Exports</Link>
            </li>
            <li className="breadcrumb-item active">Acting Role</li>
          </ol>
        </nav>

        <section className="section dashboard">
          {/* <div className="row">
            <div className="col-md-12">
            <div className="request-bx">
              <h3>Requests <span>management</span></h3>
              <p>Manage all your requests from here. You can also raise a new request from here ...</p>
            </div>
            </div>
          </div> */}

          <div className="row">
            <div className="col-md-12">
              <div className="datatable">
                <h4 className="section_top_heading">
                  SUBMITTED REQUESTS
                  {RoleId == "6" || RoleId == "7" || RoleId == "8" ? (
                   <div className="box-userselect">
                    <select className="userselect" name="" onChange={(e)=>handleselectUser(e)}> 
      {
        actionUserList?.map((item, index)=>{
          return(
            <>
            <option value={item.userID} key={index}>{item.userName}</option>
            </>
          )
        })
      }
     </select>
                  <Link
                      to="/BankADLADashboard"
                      className="act_btn-dashboard"
                      onClick={clickhandlerole}
                    >
                      Back To Dashboard
                    </Link>
                    </div> 
                  ) : (
                    ""
                  )}
                </h4>
                <ExportActingroleTable userselect={userselect} actionUserList={actionUserList} />
              </div>
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default ActingRoleDashboard;
