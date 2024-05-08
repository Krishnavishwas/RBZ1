import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import ApplicationTypeForm from "../components/ApplicationTypeForm";
import { Link } from "react-router-dom";
import { APIURL, ImageAPI } from "../../constant";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast, useToast } from "react-toastify";
import axios from "axios";

const DirectivesTables = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateID, setUpdateID] = useState("");
  const [directiveName, setDirectiveName] = useState("");
  const [directiveTag, setDirectiveTag] = useState("");
  const [files, setFiles] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [directiveData, setDirectiveData] = useState([]);
  const [Imageurl, setImageurl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formerr, setformerr] = useState();
  const [getDirectieID, setGetDirectieID] = useState("");
  const [status, setStatus] = useState("");

  const UserID = sessionStorage.getItem("userID");

  const createTags = directiveTag?.split(",");

  const columns = [
    // {
    //   name: "Directive ID",
    //   selector: (row) => row.directiveID,
    //   sortable: true,
    //   searchable: true,
    //   width: "25%",
    //   cell: (row) => <span title={row.directiveID}>{row.directiveID}</span>,
    // },
    //   {createTags.length
    //   ? createTags?.map((tagName) => {
    //     return (
    //       <>
    //         <li class="badge bg-primary">{tagName}</li>
    //         &nbsp;
    //       </>
    //     );
    //   })
    // : ""}

    {
      name: "Directive Name",
      selector: (row) => row.directiveName,
      sortable: true,
      searchable: true,
      width: "25%",
      cell: (row) => (
        <span title={row.directiveName} className="text-capitalize">
          {row.directiveName}
        </span>
      ),
    },

    {
      name: "Directive Tags",
      selector: (row) => row.directiveTags,
      sortable: true,
      searchable: true,
      width: "25%",
      cell: (row) => (
        <>
          {row.directiveTags
            ? row?.directiveTags?.split(",")?.map((tagName) => {
                return (
                  <>
                    <li class="badge bg-primary" style={{textWrap: "wrap"}}>{tagName}</li>
                    &nbsp;
                  </>
                );
              })
            : ""}
        </>
      ),
    },

    {
      name: "Directive Image",
      selector: (row) => row.id,
      sortable: true,
      searchable: true,
      width: "20%",
      cell: (row) => (
        <span>
          {row?.filePath ? (
            <a href={row?.filePath} target="_blank">
              <img
                className="img-fluid img-thumbnail"
                src={row?.filePath}
                alt={row?.filePath}
                style={{ width: "75px", height: "50px" }}
              />
            </a>
          ) : (
            "--"
          )}
        </span>
      ),
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      searchable: true,
      width: "20%",
      cell: (row) => (
        <span>
          {row.status === 1 ? (
            <span className="badge rounded-pill bg-success">Active</span>
          ) : (
            <span className="badge rounded-pill bg-warning text-dark">
              Inactive
            </span>
          )}
        </span>
      ),
    },

    {
      name: "Action",
      width: "10%",
      cell: (row) => (
        <>
          <Link to="" className="me-2" onClick={() => handleUpdate(row.id)}>
            <i class="bi bi-pencil-square"></i>
          </Link>
        </>
      ),
    },
  ];

  const directiveisting = async () => {
    await axios.post(APIURL + "Admin/GetAllDirectives").then((res) => {
      // console.log("res - ", res);
      if (res.data.responseCode == 200) {
        setDirectiveData(res.data.responseData);
      }
    });
  };

  useEffect(() => {
    directiveisting();
  }, []);

  const filteredData = directiveData?.filter(
    (item) =>
      item.directiveID?.toLowerCase().includes(searchText?.toLowerCase()) ||
      item.directiveName?.toLowerCase().includes(searchText?.toLowerCase()) ||
      item.directiveTags?.toLowerCase().includes(searchText?.toLowerCase()) ||
      (item.status == "1" ? "Active" : "Inactive")
        .toLowerCase()
        .includes(searchText?.toLowerCase())
  );

  const handleFormShow = () => setShowForm(true);

  const handleUpdate = async (id) => {
    setShowUpdateModal(true);
    try {
      await axios
        .post(APIURL + "Admin/GetDirectiveByID", { ID: id })
        .then((res) => {
          if (res.data.responseCode == 200) {
            setGetDirectieID(res?.data?.responseData?.id);
            setDirectiveName(res?.data?.responseData?.directiveName);
            setDirectiveTag(res?.data?.responseData?.directiveTags);
            setImageurl(res?.data?.responseData?.filePath);
            setStatus(res?.data?.responseData?.status);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const UpdateModalClose = () => {
    setShowUpdateModal(false);
    setDirectiveName("");
    setDirectiveTag("");
    setFiles({});
    setError("");
    setImageurl(null);
    setGetDirectieID("");
    setStatus("");
  };

  const handleFormClose = () => {
    setShowForm(false);
    setDirectiveName("");
    setDirectiveTag("");
    setFiles({});
    setError("");
    setImageurl(null);
    setGetDirectieID("");
    setStatus("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size < 1000000) {
      setFiles(file);
      setImageurl(URL.createObjectURL(file));
      setError("");
      setformerr()
    } else {
      setFiles({})
      setError("Max Image Size 1 MB");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = {};
    let valid = true;
    const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;
    if (
      name === "directiveName" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("-") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("/") ||
        value?.includes("]") ||
        /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0)))
    ) {
      newErrors.directiveName = "Special characters not allowed";
      valid = false;
    } else if (name === "directiveName" && value.charAt(0) === " ") {
      newErrors.directiveName = "First character cannot be a blank space";
      valid = false;
    } else {
      if (name === "directiveName") setDirectiveName(value);
    }
    if (
      name === "tags" &&
      (value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("/") ||
        value?.includes("]") ||
        value?.includes("/") ||
        value?.includes("`") ||
        value?.includes("~") ||
        value?.includes("!") ||
        value?.includes("@") ||
        value?.includes("#") ||
        value?.includes("$") ||
        value?.includes("%") ||
        value?.includes("^") ||
        value?.includes("&") ||
        value?.includes("*") ||
        value?.includes("(") ||
        value?.includes(")") ||
        value?.includes(":") ||
        value?.includes("?") ||
        value?.includes(">") ||
        value?.includes("<") ||
        value?.includes("|") ||
        value?.includes(":") ||
        value?.includes(".") ||
        value?.includes("}") ||
        value?.includes("{"))
    ) {
      newErrors.directiveTag = "Special characters not allowed";
      valid = false;
    } else if (name === "tags" && value.charAt(0) === " ") {
      newErrors.directiveTag = "First character cannot be a blank space";
      valid = false;
    } else if (name === "tags" && value.charAt(0) === ",") {
      newErrors.directiveTag = 'First character cannot be a ","';
      valid = false;
    } else if (name === "tags" && value.charAt(0) === "-") {
      newErrors.directiveTag = 'First character cannot be a "-"';
      valid = false;
    } else {
      if (name === "tags") setDirectiveTag(value);
    }

    if (name === "Status") {
      setStatus(value);
    }
    setformerr(newErrors);
  };

  const isValid = () => {
    const newErrors = {};
    let valid = true;
    const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;

    if (specialChars.test(directiveName)) {
      newErrors.directiveName = "Special characters not allowed";
      valid = false;
    }
    if (directiveName.charAt(0) === " ") {
      newErrors.directiveName = "First character cannot be a blank space";
      valid = false;
    }
    if (directiveTag.charAt(0) === " ") {
      newErrors.directiveTag = "First character cannot be a blank space";
      valid = false;
    }

    if (!directiveName) {
      newErrors.directiveName = "Directive Name is required.";
      valid = false;
    }
    if (!directiveTag) {
      newErrors.directiveTag = "Directive Tags is required.";
      valid = false;
    }
    if (!Imageurl) {
      newErrors.files = "Directive Image is required.";
      valid = false;
    }
    setformerr(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (isValid()) {
        let formData = new FormData();
        await axios
          .post(APIURL + "Admin/AddDirective", {
            DirectiveName: directiveName,
            Directivetags: directiveTag,
          })
          .then(async (res) => {
            if (res.data.responseCode == 200) {
              let directiveid = res?.data?.responseData?.id;
              formData.append("files", files);
              formData.append("UserID", UserID.replace(/"/g, ""));
              formData.append("DirectiveID", directiveid);
              formData.append("FileType", "DirectiveImage");
              await axios
                .post(ImageAPI + "File/UploadFile", formData)
                .then((res) => {
                  setLoading(false);
                  handleFormClose();
                  setImageurl(null);
                  setFiles({});
                  directiveisting();
                  toast.success("Directive Added Successfully")
                })
                .catch((error) => {
                  setLoading(false);
                  console.log("error - ", error);
                });
            }
          });
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error - ", error);
    }
  };

  const handleUdate = async () => {
    try {
      setLoading(true);
      if (isValid()) {
        let formData = new FormData();
        await axios
          .post(APIURL + "Admin/UpdateDirective", {
            ID: getDirectieID,
            DirectiveName: directiveName,
            DirectiveTags: directiveTag,
            Status: status,
          })
          .then(async (res) => {
            if (res.data.responseCode == 200) {
              formData.append("files", files);
              formData.append("UserID", UserID.replace(/"/g, ""));
              formData.append("DirectiveID", getDirectieID);
              formData.append("FileType", "DirectiveImage");
              await axios
                .post(ImageAPI + "File/UploadFile", formData)
                .then((res) => {
                  console.log("res - - ", res);
                  setLoading(false);
                  handleFormClose();
                  setImageurl(null);
                  setFiles({});
                  UpdateModalClose();
                  toast.success("Directive Updated Successfully")
                  directiveisting();
                })
                .catch((error) => {
                  setLoading(false);
                  console.log("error - ", error);
                });
            }
          });
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error - ", error);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredData}
        // data={directiveData}
        persistTableHead={true}
        defaultSortFieldId={1}
        defaultSortAsc={true}
        pagination
        paginationRowsPerPageOptions={[10, 50, 100]}
        highlightOnHover
        dense
        striped
        fixedHeader
        subHeader
        subHeaderComponent={
          <>
            <div className="admintablesearch">
              <div className="tablesearch_bx">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="table-btn-bx">
                <Button onClick={handleFormShow}>Add Directive</Button>
              </div>
            </div>
          </>
        }
      />

      {/* Directive Form Add modal */}
      <Modal show={showForm} onHide={handleFormClose} backdrop="static">
        <div className="application-box">
          <div className="login_inner">
            <div class="login_form ">
              <h5>
                <Modal.Header closeButton className="p-0">
                  <Modal.Title>Add Directive</Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel">
              <Modal.Body className="p-0">
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="directiveName"
                      className="fomcontrol text-capitalize"
                      placeholder="Directive Name"
                      value={directiveName}
                      onChange={(e) => handleChange(e)}
                    />
                    <span className="sspan"></span>
                  </label>
                  {formerr?.directiveName ? (
                    <span className="errormsg">{formerr?.directiveName}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-bx">
                  <label>
                    <textarea
                      placeholder="Directive Tags"
                      value={directiveTag}
                      name="tags"
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                  {formerr?.directiveTag ? (
                    <span className="errormsg">{formerr?.directiveTag}</span>
                  ) : (
                    ""
                  )}
                  {/* <ul className="labelbx">
                    {createTags.length
                      ? createTags?.map((tagName) => {
                          return (
                            <>
                              <li class="badge bg-primary">{tagName}</li>
                              &nbsp;
                            </>
                          );
                        })
                      : ""}
                  </ul> */}
                  <ul className="labelbx">
                    {createTags.length
                      ? createTags?.map((tagName) => {
                          return (
                            <>
                              <li class="badge bg-primary">{tagName}</li>
                              &nbsp;
                            </>
                          );
                        })
                      : ""}
                  </ul>
                </div>

                <div className="attachemt_form-bx mb-0 form-bx">
                  <label style={{ padding: "10px 0", minWidth: "210px" }}>
                    {files?.name ? files?.name : "Directive Image"}
                    <small class="errormsg">{error}</small>
                    {formerr?.files ? (
                      <span className="errormsg">{formerr?.files}</span>
                    ) : error ? (
                      <small class="errormsg">{error}</small>
                    ) : formerr?.files && error ? (
                      <span className="errormsg">
                        {formerr?.files}
                        <br /> <small class="errormsg">{error}</small>
                      </span>
                    ) : (
                      ""
                    )}
                  </label>
                  <div className="browse-btn">
                    Browse
                    <input
                      type="file"
                      accept="image/jpg,image/png,image/jpeg"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </div>
                  {Imageurl ? (
                    <div>
                      <img
                        src={Imageurl}
                        alt={Imageurl}
                        style={{ width: "70px", height: "55px" }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer className="p-0">
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading ? true : false}
                >
                  {loading ? "Please Wait..." : "Submit"}
                </Button>
              </Modal.Footer>
            </div>
          </div>
        </div>
      </Modal>

      {/* Directive Form update modal */}
      <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
        <div className="application-box">
          <div className="login_inner">
            <div class="login_form ">
              <h5>
                {/* <Modal.Header closeButton className="p-0"> */}
                <Modal.Header
                  closeButton
                  onClick={UpdateModalClose}
                  className="p-0"
                >
                  <Modal.Title>Update Directive</Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel">
              <Modal.Body className="p-0">
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="directiveName"
                      className="fomcontrol text-capitalize"
                      placeholder="Directive Name"
                      value={directiveName}
                      onChange={(e) => handleChange(e)}
                    />
                    <span className="sspan"></span>
                  </label>
                  {formerr?.directiveName ? (
                    <span className="errormsg">{formerr?.directiveName}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-bx mb-4">
                  <label>
                    <textarea
                      placeholder="Directive Tags"
                      value={directiveTag}
                      name="tags"
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                  {createTags.length
                    ? createTags?.map((tagName) => {
                        return (
                          <>
                            <span class="badge bg-primary">{tagName}</span>
                            &nbsp;
                          </>
                        );
                      })
                    : ""}
                  {formerr?.directiveTag ? (
                    <span className="errormsg">{formerr?.directiveTag}</span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="form-bx mb-4">
                  <label>
                    <select
                      name="Status"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    >
                      <option value="0" selected={status == 0 ? true : false}>
                        Inactive
                      </option>
                      <option value="1" selected={status == 1 ? true : false}>
                        Active
                      </option>
                    </select>
                    <span className="sspan"></span>
                  </label>
                </div>

                <div className="attachemt_form-bx mb-0 form-bx">
                  <label style={{ padding: "10px 0", minWidth: "210px" }}>
                    {files?.name ? files?.name : "Directive Image"}
                    <small class="errormsg">{error}</small>
                    {formerr?.files ? (
                      <span className="errormsg">{formerr?.files}</span>
                    ) : error ? (
                      <small class="errormsg">{error}</small>
                    ) : formerr?.files && error ? (
                      <span className="errormsg">
                        {formerr?.files}
                        <br /> <small class="errormsg">{error}</small>
                      </span>
                    ) : (
                      ""
                    )}
                  </label>
                  <div className="browse-btn">
                    Browse
                    <input
                      type="file"
                      accept="image/jpg,image/png,image/jpeg"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </div>
                  {Imageurl ? (
                    <div>
                      <img
                        src={Imageurl}
                        alt={Imageurl}
                        style={{ width: "70px", height: "55px" }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer className="p-0">
                <Button
                  variant="primary"
                  onClick={handleUdate}
                  disabled={loading ? true : false}
                >
                  {loading ? "Please Wait..." : "Update"}
                </Button>
              </Modal.Footer>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DirectivesTables;
