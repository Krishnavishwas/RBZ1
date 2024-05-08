import React from 'react'
import { Link } from "react-router-dom"; 
import DashboardLayout from '../components/DashboardLayout';   
import ExportDashboardTable from '../tables/ExportDashboardTable';
import { Helmet } from 'react-helmet';

const Home = () => {

  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
 
  return (
    <>
     <Helmet>  <title>{menuname ? menuname : "Export"}{" "}{submenuname ? submenuname : "Dashboard"}</title>  </Helmet>
    <DashboardLayout >
    <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/BankADLADashboard">Exports</Link></li>
            <li className="breadcrumb-item active">Dashboard</li>
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

        <div className='row'>
          <div className='col-md-12'>
            <div className='datatable'>
              <h4 className='section_top_heading'>SUBMITTED REQUESTS</h4> 
            <ExportDashboardTable />
            </div>
          </div>
        </div>

      </section>
      </DashboardLayout>
   </>
  )
}

export default Home
