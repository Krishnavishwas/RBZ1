import React from 'react'
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import AdminDashboardLayout from '../components/AdminDashboardLayout';
import PendingUserTable from '../tables/PendingUserTable';
const PendingUser = () => {
  return (
    <>
      <Helmet>  <title>Pending User</title>  </Helmet>
      <AdminDashboardLayout>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item active">Pending User</li>
          </ol>
        </nav>
        

        <section className="section dashboard adminDashboard">

         
          <div className='row'>
            <div className='col-md-12'>
              <div className='datatable'>
                <h4 className='section_top_heading'>Pending User</h4>

                  {/* PendingUserTable */}
                  <PendingUserTable />

              </div>
            </div>
          </div>

        </section>
      </AdminDashboardLayout>
    </>
  )
}

export default PendingUser
