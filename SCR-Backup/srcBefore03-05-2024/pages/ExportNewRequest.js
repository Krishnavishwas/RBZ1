import React from 'react'
import { Helmet } from 'react-helmet'
import DashboardLayout from '../components/DashboardLayout'
import ExportNewRequestForm from '../components/ExportNewRequestForm'
import { Link } from 'react-router-dom'

const ExportNewRequest = () => {
  const menuname = sessionStorage.getItem("menuname");
  const submenuname = sessionStorage.getItem("submenuname");
  return (
    <>
    <Helmet>  <title>{menuname ? menuname : "Export"}{" "}{submenuname ? submenuname : "Dashboard"}</title>  </Helmet>
    <DashboardLayout >
    <nav>
          <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/BankADLADashboard">Export</Link></li>
            <li className="breadcrumb-item active">New Request</li>
          </ol>
        </nav>
      {/* <div className="pagetitle">
        <h1>Dashboard <span>EXPORTS</span></h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a>Exports</a></li> 
          </ol>
        </nav>
      </div> */}

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
              <h4 className='section_top_heading'>NEW REQUEST</h4>
            
            <h5 className='section_top_subheading'>General Info</h5>

    <ExportNewRequestForm />



            </div>
          </div>
        </div>

      </section>
      </DashboardLayout>
   </>
  )
}

export default ExportNewRequest
