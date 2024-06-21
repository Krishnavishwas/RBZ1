import React from 'react'
import { Storage } from '../login/Storagesetting'

const UpdatePopupMessage = ({heading, para, applicationNumber, closePopupHandle}) => {

  const generatedNumber = Storage?.getItem("generatedNumber")

  return (
    <div className='updatepupouter'>
      <div className='updatepupouter_inner'>
        <div className='updatepupouter_header'>
        <i className="bi bi-check-circle"></i>
            {/* <h3>Update Successfully!</h3>
            <p>Export request udate successfully!</p> */}
            
            <h3>{heading}</h3>
            <h6>{applicationNumber ? applicationNumber : generatedNumber}</h6>
            <p>{para}</p>
            <button type='button' onClick={closePopupHandle}>
                Ok
            </button>
        </div>
      </div>
    </div>
  )
}

export default UpdatePopupMessage
