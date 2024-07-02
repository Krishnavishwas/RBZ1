import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { APIURL } from '../../constant'
import { toast } from 'react-toastify'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
const ApplicationTypeForm = () => {

    const [applicationTypeForm, setApplicationTypeForm] = useState(
        {
            name: '',


        }
    )

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [errors, setErrors] = useState(false);


    const changeHandelForm = (e) => {

        const { name, value } = e.target;

        setApplicationTypeForm((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // document.querySelector('.login').setAttribute('data-bs-dismiss', 'modal-error');


        const application_data = {
            "Name": applicationTypeForm.name,
            "DepartmentID": "1"
        }
        const application_data_json = JSON.stringify(application_data);

        if (applicationTypeForm.name != "") {

            const application_responce = await fetch(APIURL + 'Admin/AddApplicationType', {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: application_data_json,

            });

            const data = await application_responce.json();
            if (data.responseCode === '200') {
             

                toast.success(data.responseMessage, { autoClose: 2000 })
             
              
            }

        }
        else {

            setErrors(true)
        }

    };

    return (
        <>

            {/* <div className='inner_form_new label.controlform'>
                    <label className='controlform'>Name</label>

                    <div className="form-bx"><label>
                        <input type="text" name="name" placeholder="Name" onChange={(e) => { changeHandelForm(e) }} />
                        <span className="sspan"></span>
                    </label></div>
                </div>
                <div className='inner_form_new label.controlform'>
                    <label className='controlform'>Description</label>
                    <div className="form-bx"><label>
                        <textarea name='description' onChange={(e) => { changeHandelForm(e) }} placeholder="Description" />
                        <span className="sspan"></span>
                    </label></div>
                </div>
                
                <div className='form-footer mt-5 mb-3'>

                    <button className='login' onClick={handleSubmit}>Submit</button>
                </div> */}


            <div className="modal fade" id="addApplication" tabindex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body p-0">

                            <div className="application-box">
                                <div className="login_inner">
                                    <div className="login_form "><h5>Add Application Type</h5></div>
                                    <div className="login_form_panel">
                                        <div className="form-bx mb-2">
                                            <label>
                                                <input type="text" name="name" className={errors === true && !applicationTypeForm.name ? 'error' : 'fomcontrol'} placeholder="Name" onChange={(e) => { changeHandelForm(e) }} required />
                                                <span className='sspan'></span>

                                            </label>
                                            {errors === true && !applicationTypeForm.name ? <small className="errormsg">Name is Required</small> : ''}
                                        </div>
                                        {/* <div className="form-bx">
                                                <label>
                                                    <textarea name='message' className="form-control" onChange={(e) => { changeHandelForm(e) }} placeholder="message" />
                                                    <span className="sspan"></span>
                                                </label>
                                            </div> */}
                                        <div className="form-footer">
                                            {/* {Closemodle === true ? <button type="button" className="login" data-bs-dismiss="modal" onClick={(e) => { handleSubmit(e) }}>Submit</button> : <button type="button" className="login " onClick={(e) => { handleSubmit(e) }} >Submit</button>} */}

                                            <button
                                                className="login"
                                                type="button"
                                                //  data-bs-dismiss={closeModal ? "modal" : ""} 
                                                // data-bs-dismiss="modal" 

                                                onClick={(e) => handleSubmit(e)}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>




                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

        </>
    )
}

export default ApplicationTypeForm
