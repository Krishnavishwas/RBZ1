import React from 'react'
import { Helmet } from 'react-helmet'
import AdminDashboardLayout from '../components/AdminDashboardLayout'
import SubSectorListTable from '../tables/SubSectorListTable'

const SubSectorList = () => {
    return (
        <>
            <Helmet><title>Subsector</title></Helmet>
            <AdminDashboardLayout >
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active">Subsector</li>
                    </ol>
                </nav>
               
                <section className="section dashboard adminDashboard">

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
                                <h4 className='section_top_heading'>Subsector</h4>
                                {/* SubSectorListTable tableData */}
                                <SubSectorListTable />
                            </div>
                        </div>
                    </div>

                </section>
            </AdminDashboardLayout>
        </>
    )
}

export default SubSectorList
