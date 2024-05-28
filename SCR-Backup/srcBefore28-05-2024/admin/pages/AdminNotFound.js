import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import AdminDashboardLayout from '../components/AdminDashboardLayout'

const NotFound = () => {

    const navigate = useNavigate();  

    useEffect(()=>{
        setTimeout(()=>{
          navigate('/')
        },2000)
    },[navigate])
 

  return (
    <>
     <AdminDashboardLayout>
    <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item active">404</li>
          </ol>
        </nav>
     

      <section className="section dashboard adminDashboard"> 

        <div className='row'>
          <div className='col-md-12 text-center'>
            <div className='pagenotfound'>
            <h1>404</h1>
            <h4>Page not found please wait... </h4>
            <div className='mt-3'><span class="loader"></span></div>
            </div>
          </div>
        </div>

      </section>
      </AdminDashboardLayout>
    </>
  )
}

export default NotFound
