import React from 'react'
import { Helmet } from 'react-helmet'
import AdminDashboardLayout from '../components/AdminDashboardLayout'
import DirectivesTables from '../tables/DirectivesTables'

const Directives = () => {
    return (
        <>
            <Helmet><title>Directives</title></Helmet>
            <AdminDashboardLayout >
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active">Directives</li>
                    </ol>
                </nav>
                
                <section className="section dashboard adminDashboard">

                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='datatable'>
                                <h4 className='section_top_heading'>Directives</h4>

                                {/* DirectivesTables */}
                                <DirectivesTables />
                            </div>
                        </div>
                    </div>

                </section>
            </AdminDashboardLayout>
        </>
    )
}

export default Directives
