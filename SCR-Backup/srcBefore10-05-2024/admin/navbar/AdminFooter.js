import React from 'react';
import { Link } from "react-router-dom";
const AdminFooter = () => {
  return (
    <> 
    <footer id="footer" className="footer">
    <div className="copyright">
      © 2024 RESERVE BANK OF ZIMBABWE
    </div>

  </footer>
  

  <Link to="/" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></Link>
</>
  )
}

export default AdminFooter
