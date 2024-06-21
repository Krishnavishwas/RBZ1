import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import shortid from "shortid";
import { Link } from "react-router-dom";
import { APIURL, ImageAPI } from "../../constant";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast, useToast } from "react-toastify";
import { Chips } from "primereact/chips";
import axios from "axios";

const DirectivesTables = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [directiveName, setDirectiveName] = useState("");
  const [directiveTag, setDirectiveTag] = useState("");
  const [files, setFiles] = useState({});
  const [selectedfile, SetSelectedFile] = useState([]);
  const [getfile, SetgetFile] = useState([]);
  const [Filesu, SetFilesu] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [directiveData, setDirectiveData] = useState([]);
  const [Imageurl, setImageurl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formerr, setformerr] = useState();
  const [getDirectieID, setGetDirectieID] = useState("");
  const [status, setStatus] = useState("");
  const [val, setValue] = useState([]);
  const [datat, setDatat] = useState(false);
  const [labelChange, setLabelChange] = useState([]);
  const [fileLenght, setFileLength] = useState("");

  const UserID = sessionStorage.getItem("userID");

  const createTags =
    typeof directiveTag === "string" ? directiveTag.split(",") : [];

  const UpdateModalClose = () => {
    setShowUpdateModal(false);
    setDirectiveName("");
    setDirectiveTag("");
    setFiles({});
    setError("");
    setSearchText("");
    setImageurl(null);
    setGetDirectieID("");
    setStatus("");
    setValue([]);
    setformerr();
    setDatat(false);
    SetSelectedFile([]);
    SetFilesu([]);
    setLabelChange([]);
    setFileLength("");
    SetgetFile([]);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setDirectiveName("");
    setDirectiveTag("");
    setFiles({});
    setError("");
    setSearchText("");
    setImageurl(null);
    setGetDirectieID("");
    setStatus("");
    setformerr();
    setDatat(false);
    setValue([]);
    SetSelectedFile([]);
    SetFilesu([]);
    setLabelChange([]);
    setFileLength("");
    SetgetFile([]);
  };

  console.log("selectedfile - ", selectedfile);
  console.log("Filesu - ", Filesu);

  useEffect(() => {
    setValue(createTags);
  }, [getDirectieID]);

  const columns = [
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
                    <li className="badge bg-primary" style={{ textWrap: "wrap" }}>
                      {tagName}
                    </li>
                    &nbsp;
                  </>
                );
              })
            : ""}
        </>
      ),
    },

    // {
    //   name: "Directive Image",
    //   selector: (row) => row.id,
    //   sortable: true,
    //   searchable: true,
    //   width: "20%",
    //   cell: (row) => (
    //     <span>
    //       {row?.filePath ? (
    //         <a href={row?.filePath} target="_blank">
    //           <img
    //             className="img-fluid img-thumbnail"
    //             src={row?.filePath}
    //             alt={row?.filePath}
    //             style={{ width: "75px", height: "50px" }}
    //           />
    //         </a>
    //       ) : (
    //         "--"
    //       )}
    //     </span>
    //   ),
    // },

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
          <Link
            to=""
            className="me-2"
            onClick={() => {
              handleUpdate(row.id);
              setDatat(true);
            }}
          >
            <i className="bi bi-pencil-square"></i>
          </Link>
        </>
      ),
    },
  ];

  const directiveisting = async () => {
    await axios.post(APIURL + "Admin/GetAllDirectives").then((res) => {
      if (res.data.responseCode == 200) {
        setLabelChange([]);
        setDirectiveData(res.data.responseData);
      }
    });
  };

  useEffect(() => {
    directiveisting();
  }, []);

  const filteredData = directiveData?.filter(
    (item) =>
      item?.directiveName?.toLowerCase().includes(searchText?.toLowerCase()) ||
      item?.directiveTags?.toLowerCase().includes(searchText?.toLowerCase()) ||
      (item?.status == "1" ? "Active" : "Inactive")
        .toLowerCase()
        .includes(searchText?.toLowerCase())
  );

  console.log("directiveData", directiveData)

  const handleFormShow = () => {
    setDirectiveName("");
    setDirectiveTag("");
    setFiles({});
    setError("");
    setSearchText("");
    setImageurl(null);
    setGetDirectieID("");
    setStatus("");
    setformerr();
    setDatat(false);
    setValue([]);
    SetSelectedFile([]);
    SetFilesu([]);
    setLabelChange([]);
    setShowForm(true);
  };

  const handleUpdate = async (id) => {
    setShowUpdateModal(true);
    try {
      await axios
        .post(APIURL + "Admin/GetDirectiveByID", { ID: id })
        .then((res) => {
          if (res.data.responseCode == 200) {
            console.log("Imageurl -", res.data.responseData);
            setGetDirectieID(res?.data?.responseData?.id);
            setDirectiveName(res?.data?.responseData?.directiveName);
            setDirectiveTag(res?.data?.responseData?.directiveTags);
            setImageurl(res?.data?.responseData?.filePath);
            SetgetFile(res?.data?.responseData?.filesData);
            setStatus(res?.data?.responseData?.status);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file.size < 1000000) {
  //     setFiles(file);
  //     setImageurl(URL.createObjectURL(file));
  //     setError("");
  //     setformerr();
  //   } else {
  //     setFiles({});
  //     setError("Max Image Size 1 MB");
  //   }
  // };

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
    if (name === "tags") setDirectiveTag(value);
    if (name === "Status") {
      setStatus(value);
    }
    setformerr(newErrors);
  };

  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const labelHandleChange = (e, id) => {
    const { name, value } = e.target;
    if (name === "labelChange" && id) {
      const existingIndex = labelChange.findIndex((item) => item.id === id);
      if (existingIndex !== -1) {
        setLabelChange((prevState) => {
          const updatedLabelChange = [...prevState];
          updatedLabelChange[existingIndex] = { id: id, labelName: value };
          return updatedLabelChange;
        });
      } else {
        setLabelChange((prevState) => [
          ...prevState,
          {
            id: id,
            labelName: value,
          },
        ]);
      }
    }
  };

  const InputChange = (e) => {
    let images = [];
    SetFilesu(images);
    for (let i = 0; i < e.target.files?.length; i++) {
      images.push(e.target.files[i]);
      let reader = new FileReader();
      let file = e.target.files[i];
      reader.onloadend = () => {
        SetSelectedFile((preValue) => {
          return [
            ...preValue,
            {
              id: shortid.generate(),
              filename: e.target.files[i].name,
              filetype: e.target.files[i].type,
              fileimage: reader.result,
              datetime:
                e.target.files[i].lastModifiedDate.toLocaleString("en-IN"),
              filesize: filesizes(e.target.files[i].size),
            },
          ];
        });
      };
      if (e.target.files[i]) {
        reader.readAsDataURL(file);
      }
    }
  };

  const newArray = selectedfile?.map((file) => {
    const labelItem = labelChange?.find((label) => label.id === file.id);
    const setFileinArray = Filesu?.find(
      (checkname) => checkname.name === file.filename
    );
    const labelName = labelItem ? labelItem?.labelName : "";
    return {
      id: file.id,
      file: setFileinArray,
      labelName: labelName,
    };
  });

  console.log(newArray);

  const DeleteSelectFile = (id) => {
    const result = selectedfile.filter((data) => data.id !== id);
    SetSelectedFile(result);
  };

  const DeleteFileFromDB = async (id) => {
    if (window.confirm("Are you sure you want to delete this Image?")) {
      await axios
        .post(APIURL + "File/DeleteFile", {
          ID: id,
        })
        .then((res) => {
          console.log("DeleteFile -", res);
          handleUpdate(getDirectieID);
        })
        .catch((err) => console.log(err));
    }
  };

  const isValid = () => {
    const newErrors = {};
    let valid = true;
    const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;

    if (specialChars.test(directiveName)) {
      newErrors.directiveName = "Special characters not allowed";
      valid = false;
    }
    if (
      directiveTag?.includes("_") ||
      directiveTag?.includes("+") ||
      directiveTag?.includes("=") ||
      directiveTag?.includes("'") ||
      directiveTag?.includes(";") ||
      directiveTag?.includes("[") ||
      directiveTag?.includes("]") ||
      directiveTag?.includes("/") ||
      directiveTag?.includes("]") ||
      directiveTag?.includes("/") ||
      directiveTag?.includes("`") ||
      directiveTag?.includes("~") ||
      directiveTag?.includes("!") ||
      directiveTag?.includes("@") ||
      directiveTag?.includes("#") ||
      directiveTag?.includes("$") ||
      directiveTag?.includes("%") ||
      directiveTag?.includes("^") ||
      directiveTag?.includes("&") ||
      directiveTag?.includes("*") ||
      directiveTag?.includes("(") ||
      directiveTag?.includes(")") ||
      directiveTag?.includes(":") ||
      directiveTag?.includes("?") ||
      directiveTag?.includes(">") ||
      directiveTag?.includes("<") ||
      directiveTag?.includes("|") ||
      directiveTag?.includes(":") ||
      directiveTag?.includes(".") ||
      directiveTag?.includes("}") ||
      directiveTag?.includes("{")
    ) {
      newErrors.directiveTag = "Special characters not allowed";
      valid = false;
    }
    if (directiveName.charAt(0) === " ") {
      newErrors.directiveName = "First character cannot be a blank space";
      valid = false;
    }
    // if (directiveTag.charAt(0) === " ") {
    //   newErrors.directiveTag = "First character cannot be a blank space";
    //   valid = false;
    // }
    if (!directiveName) {
      newErrors.directiveName = "Directive Name is required.";
      valid = false;
    }
    if (!directiveTag) {
      newErrors.directiveTag = "Directive Tags is required.";
      valid = false;
    }
    if (!selectedfile) {
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
              let drectiveID = res?.data?.responseData?.id;
              for (const item of newArray) {
                const { file, labelName } = item;
                for (const im of Filesu) {
                  if (file.name === im.name) {
                    formData.append("FileID", item.id);
                    formData.append("files", im);
                    formData.append("Label", labelName);
                  }
                }
              }
              formData.append("UserID", UserID.replace(/"/g, ""));
              formData.append("DirectiveID", drectiveID);
              formData.append("FileType", "DirectiveImage");
              await axios
                .post(ImageAPI + "File/DirectiveImageUploads", formData)
                .then((res) => {
                  setLoading(false);
                  handleFormClose();
                  setImageurl(null);
                  setFiles({});
                  directiveisting();
                  toast.success("Directive Added Successfully");
                })
                .catch((error) => {
                  setLoading(false);
                  console.log("error - ", error);
                });
            }else{
              setLoading(false);
              toast.warning(res.data.responseMessage);
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
              for (const item of newArray) {
                const { file, labelName } = item;
                for (const im of Filesu) {
                  if (file.name === im.name) {
                    formData.append("FileID", item.id);
                    formData.append("files", im);
                    formData.append("Label", labelName);
                  }
                }
              }
              formData.append("UserID", UserID.replace(/"/g, ""));
              formData.append("DirectiveID", getDirectieID);
              formData.append("FileType", "DirectiveImage");
              await axios
                .post(ImageAPI + "File/DirectiveImageUploads", formData)
                .then((res) => {
                  console.log("UpdateModalClose - ", res);
                  setLoading(false);
                  UpdateModalClose();
                  setImageurl(null);
                  setFiles({});
                  directiveisting();
                  toast.success("Directive Updated Successfully");
                })
                .catch((error) => {
                  setLoading(false);
                  UpdateModalClose();
                  setImageurl(null);
                  setFiles({});
                  directiveisting();
                  console.log("error - ", error);
                });
            }else{
              setLoading(false);
              toast.warning(res.data.responseMessage);
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

  useEffect(() => {
    const vvv = val?.join(", ");
    setDirectiveTag(vvv);
  }, [val]);

  const handleKeyDown = (event) => {
    if (event.target.value.length > 25) {
      setFileLength("Tag max length is 25");
    } else {
      setFileLength("");
    }
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const enteredValue = event.target.value.trim();
      if (
        enteredValue &&
        enteredValue.length <= 25 &&
        !val.includes(enteredValue)
      ) {
        setValue((prevValue) => [...prevValue, enteredValue]);
        event.target.value = "";
      }
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
            <div className="login_form ">
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

                <div className="p-fluid form-bx mb-3">
                  <Chips
                    name="tags"
                    maxLength={25}
                    placeholder="Directive Tags"
                    inputRef={(el) => {
                      if (el) {
                        el.addEventListener("keydown", handleKeyDown);
                      }
                    }}
                    value={val}
                    onChange={(e) => {
                      setValue(e.value);
                      handleChange(e);
                    }}
                  />
                  {formerr?.directiveTag ? (
                    <span className="errormsg">{formerr?.directiveTag}</span>
                  ) : fileLenght ? (
                    <span className="errormsg">{fileLenght}</span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="kb-file-upload mt-5">
                  <div className="file-upload-box">
                    <input
                      type="file"
                      id="fileupload"
                      className="file-upload-input"
                      onChange={InputChange}
                      multiple
                    />
                    <span className="file-link">Choose Directive files</span>
                  </div>
                  <label>
                    {!Filesu.length && !selectedfile.length && val.length ? (
                      <small className="errormsg text-danger">
                        File can not be empty
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
                <div className="row">
                  {selectedfile?.map((data, index) => {
                    const {
                      id,
                      filename,
                      filetype,
                      fileimage,
                      datetime,
                      filesize,
                    } = data;
                    return (
                      <div className="col-6 mb-3">
                        <div className="file-detail" key={id}>
                          <h6>{filename}</h6>
                          <div className="form-bx">
                            <label>
                              <input
                                type="text"
                                name="labelChange"
                                placeholder="change File Name"
                                onChange={(e) => labelHandleChange(e, id)}
                                className="fomcontrol text-capitalize"
                              />
                            </label>
                          </div>
                          <div className="file-actions">
                            <button
                              type="button"
                              className="file-action-btn"
                              onClick={() => DeleteSelectFile(id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Modal.Body>
              <Modal.Footer className="p-0">
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={
                    loading || (!Filesu.length && !selectedfile.length)
                      ? true
                      : false
                  }
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
            <div className="login_form ">
              <h5>
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
                <div className="p-fluid form-bx mb-3">
                  <Chips
                    name="tags"
                    placeholder="Directive Tags"
                    inputRef={(el) => {
                      if (el) {
                        el.addEventListener("keydown", handleKeyDown);
                      }
                    }}
                    value={val}
                    onChange={(e) => setValue(e.value)}
                  />
                  {formerr?.directiveTag ? (
                    <span className="errormsg">{formerr?.directiveTag}</span>
                  ) : fileLenght ? (
                    <span className="errormsg">{fileLenght}</span>
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

                <div className="kb-file-upload mt-4">
                  <div className="file-upload-box">
                    <input
                      type="file"
                      id="fileupload"
                      className="file-upload-input"
                      onChange={InputChange}
                      multiple
                    />
                    <span className="file-link">Choose Directive files</span>
                  </div>
                  <label>
                    {!getfile.length && !selectedfile.length ? (
                      <small className="errormsg text-danger">
                        File can not be empty
                      </small>
                    ) : (
                      ""
                    )}
                  </label>
                </div>
                <div className="row mt-3">
                  {/* {console.log("getfile -", getfile)}
                  {console.log("selectedfile -", selectedfile)} */}
                  {getfile?.map((data, index) => {
                    const { id, fileName, fileID, filePath, label } = data;
                    return (
                      <div className="col-6 mb-3">
                        <div className="file-detail" key={fileID}>
                          {/* <h6>{filename}</h6> */}
                          <h6>
                            <a target="_blank" href={filePath}>
                              {fileName}
                            </a>
                          </h6>
                          {label ? (
                            <div className="form-bx">
                              <label>
                                <input
                                  type="text"
                                  name="labelChange"
                                  placeholder={label}
                                  disabled
                                  className="fomcontrol text-capitalize"
                                />
                              </label>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="file-actions">
                            <button
                              type="button"
                              className="file-action-btn"
                              onClick={() => DeleteFileFromDB(id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {selectedfile?.map((data, index) => {
                    const {
                      id,
                      filename,
                      filetype,
                      fileimage,
                      datetime,
                      filesize,
                    } = data;
                    return (
                      <div className="col-6 mb-3">
                        <div className="file-detail" key={id}>
                          <h6>{filename}</h6>
                          <div className="form-bx">
                            <label>
                              <input
                                type="text"
                                name="labelChange"
                                placeholder="change File Name"
                                onChange={(e) => labelHandleChange(e, id)}
                                className="fomcontrol text-capitalize"
                              />
                            </label>
                          </div>
                          <div className="file-actions">
                            <button
                              type="button"
                              className="file-action-btn"
                              onClick={() => DeleteSelectFile(id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Modal.Body>
              <Modal.Footer className="p-0">
                <Button
                  variant="primary"
                  onClick={handleUdate}
                  disabled={
                    loading ||
                    (!getfile.length && !selectedfile.length) ||
                    fileLenght
                      ? true
                      : false
                  }
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
