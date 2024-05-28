import React, { useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useNavigate } from 'react-router-dom' 

const NotFound = () => {

    const navigate = useNavigate();  

    useEffect(()=>{
        setTimeout(()=>{
          navigate('/BankADLADashboard')
            sessionStorage.setItem("submenuname", "Dashboard")
        },2000)
    },[navigate])
 

  return (
    <>
     <DashboardLayout>
    <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item active">Working</li>
          </ol>
        </nav>
     

      <section className="section dashboard"> 

        <div className='row'>
          <div className='col-md-12 text-center'>
            <div className='pagenotfound'>
            <h1>Work In Progress</h1>
            {/* <h4>Page not found please wait... </h4> */}
            <h4>Please wait... </h4>

            <div className='mt-3'><span class="loader"></span></div>
            </div>
          </div>
        </div>

      </section>
      </DashboardLayout>
    </>
  )
}

export default NotFound
