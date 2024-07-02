import React from 'react'
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import AdminDashboardLayout from '../components/AdminDashboardLayout';

const AdminHome = () => {
  return (
    <>
      <Helmet>  <title>Progress..</title>  </Helmet>
      <AdminDashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item active">Working..</li>
          </ol>
        </nav>
       

        <section className="section dashboard adminDashboard">
          <div className='row'>
            <div className='col-md-12'>
              <div className='datatable'>
                <h4 className='section_top_heading'>PAGE REQUESTS</h4>

                <p>Pages Coming Soon</p>

              </div>
            </div>
          </div>

        </section>
      </AdminDashboardLayout>
    </>
  )
}

export default AdminHome
