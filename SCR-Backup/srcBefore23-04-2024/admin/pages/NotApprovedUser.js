import React from 'react'
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import AdminDashboardLayout from '../components/AdminDashboardLayout';

import NotApprovedUserTable from '../tables/NotApprovedUserTable';
const NotApprovedUser = () => {
  return (
    <>
      <Helmet>  <title>NotApproved User</title>  </Helmet>
      <AdminDashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item active">Not Approved User</li>
          </ol>
        </nav>
        

        <section className="section dashboard adminDashboard">

         
          <div className='row'>
            <div className='col-md-12'>
              <div className='datatable'>
                <h4 className='section_top_heading'>Not Approved User</h4>

                  {/* NotApprovedUserTable */}
                  <NotApprovedUserTable />

              </div>
            </div>
          </div>

        </section>
      </AdminDashboardLayout>
    </>
  )
}

export default NotApprovedUser
