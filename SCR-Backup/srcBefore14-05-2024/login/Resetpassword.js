import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { APIURL } from "../constant";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Resetpassword = ({ showUpdateModal, setShowUpdateModal }) => {
  const emailRef = useRef(null);

  const navigate = useNavigate();

  const [email, setemail] = useState("");

  const [Closemodle, setClosemodle] = useState(false);
  const [errormsg, seterrormsg] = useState("");
  const [errors, setErrors] = useState(false);
  const [toastDisplayed, setToastDisplayed] = useState(false);

  const UpdateModalClose = () => {setShowUpdateModal(false); setemail(""); seterrormsg(""); setErrors(false)};
 
  const submitForm = (e) => {
    e.preventDefault();

    if (email !== "") {
      setToastDisplayed(true);
      axios
        .post(APIURL + "User/ForgotPassword", { userName: email })
        .then((res) => {
          if (res.data.responseCode === "200") {
            setemail("");
            setErrors(false)
            seterrormsg("");
            if (emailRef.current) emailRef.current.value = "";

            UpdateModalClose();
            localStorage.setItem(
              "resetpasswordtoken",
              res.data.responseData.token
            );
            localStorage.setItem("userName", res.data.responseData.userName)
            toast.success(res.data.responseMessage);
            setToastDisplayed(false);
          } else {
            setToastDisplayed(true);
            toast.warning("Username is wrong", { autoClose: 1000 });
            setToastDisplayed(false);
            seterrormsg(res.data.responseMessage);
          }
        })
        .catch((err) => {
          setToastDisplayed(false);
          toast.error(err);
        });
    } else {
      setErrors(true);
    }
  };

  useEffect(() => {
    if (Closemodle) {
      navigate("/");
    }
  }, [Closemodle]);

  return (
    <>
      <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
        <div className="application-box">
          <div className="login_inner">
            <div class="login_form ">
              <h5>
                <Modal.Header closeButton className="p-0">
                  <Modal.Title>Forgot Password!</Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel">
              <Modal.Body className="p-0">
                <div className="form-bx mb-5">
                  <label>
                    <input
                      type="text"
                      ref={emailRef}
                      placeholder="Username"
                      className={errors === true && !email ? "error" : ""}
                      onChange={(e) => {
                        setemail(e.target.value);
                      }}
                    />
                    <span className="sspan"></span>
                  </label>
                  {errors === true && !email ? (
                    <small class="errormsg">Username is Required</small>
                  ) : (
                    <small class="errormsg">{errormsg}</small>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer className="p-0">
                {Closemodle === true ? (
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      submitForm(e);
                    }}
                    disabled={toastDisplayed ? true : false}
                    className="login"
                  >
                    {toastDisplayed ? "Please wait.." : "Ok"}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    style={{ minWidth: "140px", borderRadius: "0" }}
                    onClick={(e) => {
                      submitForm(e);
                    }}
                    disabled={toastDisplayed ? true : false}
                  >
                    {toastDisplayed ? "Please wait..." : "Ok"}
                  </Button>
                )}
              </Modal.Footer>
            </div>
          </div>
        </div>
      </Modal>

      {/* <div className="modal fade" id="verticalycentered" tabindex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <div className="modalheader">
              <h5 className="modal-title">Forgot Password!</h5>
              <p>Please provide your username</p>
            </div>

            <div className="form-bx mb-5">
              <label>
                <input
                  type="text"
                  ref={emailRef}
                  placeholder="Username"
                  className={errors === true && !email ? "error" : ""}
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                />
                <span className="sspan"></span>
              </label>
              {errors === true && !email ? (
                <small class="errormsg">Username is Required</small>
              ) : (
                ""
              )}
            </div>

            <div className="modalfooter">
              <button
                type="button"
                className="register"
                data-bs-dismiss="modal"
              >
                Close
              </button>

              {Closemodle === true ? (
                <button
                  type="button"
                  className="login "
                  id="lsls"
                  data-bs-dismiss="modal"
                  onClick={(e) => {
                    submitForm(e);
                  }}
                  disabled={toastDisplayed ? true : false}
                >
                  {toastDisplayed ? "Please wait.." : "Ok"}
                </button>
              ) : (
                <button
                  type="button"
                  id="lsls"
                  className="login "
                  onClick={(e) => {
                    submitForm(e);
                  }}
                  disabled={toastDisplayed ? true : false}
                >
                  {toastDisplayed ? "Please wait..." : "Ok"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>  */}
    </>
  );
};

export default Resetpassword;
