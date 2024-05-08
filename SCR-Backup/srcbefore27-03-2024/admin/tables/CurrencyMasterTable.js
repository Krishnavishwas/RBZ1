import React, { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { APIURL } from "../../constant";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

const CurrencyMasterTable = () => {
  const [searchText, setSearchText] = useState("");
  const [tableData, setTableData] = useState([]);
  const [rateerr, setrateerr] = useState("");
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [formerr, setformerr] = useState();
  const [updateerr, setupdateerr] = useState();
  const csvLinkRef = useRef();
  const [errors, setErrors] = useState(false);
  const handleClick = (title) => {
    alert(`Title: ${title}`);
  };



  // currency update start

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const UpdateModalClose = () => {
    setShowUpdateModal(false);
    setUpdateData({
      currencyCode: "",
      currencyName: "",
      currencyRate: "",
      status: "",
    });
    setupdateerr("");
  };
  const [updateData, setUpdateData] = useState({
    currencyCode: "",
    currencyName: "",
    currencyRate: "",
    status: "",
  });
  const changeUpdateForm = (e) => {
    const { name, value } = e.target;

    let newErrors = {};

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const spaceCheck = /\s{2,}/g;
    if (name == "currencyCode" && specialChars.test(value)) {
      newErrors.currencyCode = "Special characters not allowed.";
    } else if (name == "currencyCode" && value.charAt(0) === " ") {
      newErrors.currencyCode = "First character cannot be a blank space.";
    } else if (name == "currencyCode" && spaceCheck.test(value)) {
      newErrors.currencyCode = "Multiple space not allow.";
    } else if (name == "currencyName" && specialChars.test(value)) {
      newErrors.currencyName = "Special characters not allowed.";
    } else if (name == "currencyName" && value.charAt(0) === " ") {
      newErrors.currencyName = "First character cannot be a blank space.";
    } else if (name == "currencyName" && spaceCheck.test(value)) {
      newErrors.currencyName = "Multiple space not allow.";
    } else if (name === "currencyRate" && value < 0) {
      newErrors.currencyRate = "Please enter greater than .";
    } else if (name === "currencyRate" && value.length > 8) {
      newErrors.currencyRate = "Please enter less than 9 digit.";
    } else {
      setUpdateData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setupdateerr(newErrors);
  };
  const [updateID, setUpdateID] = useState("");
  const handleUpdate = async (id) => {
    setShowUpdateModal(true);
    setUpdateID(id);
    const TableId = {
      id: id,
    };

    try {
      const response = await fetch(APIURL + "Admin/GetCurrencyByID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(TableId),
      });

      const data = await response.json();
      setUpdateData(data.responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateData = async () => {
    const updateValue = {
      ID: updateID,
      CurrencyCode: updateData.currencyCode.toUpperCase(),
      CurrencyName: updateData.currencyName,
      CurrencyRate: updateData.currencyRate,
      Status: updateData.status,
    };

    try {
      if (isUpdateValid()) {
        const response = await fetch(APIURL + "Admin/UpdateCurrency", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateValue),
        });

        const data = await response.json();
        setToastDisplayed(true);
        if (data.responseCode === "200") {
          

          toast.success(data.responseMessage, { autoClose: 2000 });
          setTimeout(() => {
            UpdateModalClose();
            table_Data();
            setUpdateData({
              currencyCode: "",
              currencyName: "",
              currencyRate: "",
  
            });
            setSearchText('');
            setToastDisplayed(false);

          }, 2500);
        } else {
          toast.warning(data.responseMessage, { autoClose: 2000 });
          setTimeout(() => {
            table_Data();
            setToastDisplayed(false);

          }, 2500);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // currency update end

  // currency list api start
  const table_Data = async () => {
    try {
      const response = await fetch(APIURL + "Admin/GetAllCurrency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTableData(data.responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // currency list api end
  useEffect(() => {
    table_Data();
  }, []);
  const columns = [
    
    {
      name: "Currency Code",
      selector: (row) => row.currencyCode,
      sortable: true,
      searchable: true,
      width: "20%",
    },
    {
      name: "Currency Name",
      selector: (row) => row.currencyName,
      sortable: true,
      searchable: true,
      width: "30%",
    },
    {
      name: "Rate",
      selector: (row) => row.currencyRate,
      sortable: true,
      searchable: true,
      width: "20%",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      searchable: true,
      width: "15%",
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
      width: "15%",
      cell: (row) => (
        <>
          <Link to="" className="me-2" onClick={() => handleUpdate(row.id)}>
            <i class="bi bi-pencil-square"></i>
          </Link>

        </>
      ),
    },
  ];

  // add currency form start
  const [showForm, setShowForm] = useState(false);
  const handleFormClose = () => {
    setShowForm(false);
    setCurrencyForm({
      title: "",
      currencyName: "",
      rate: "",
    });
    setformerr("");
  };
  const handleFormShow = () => setShowForm(true);

  const [currencyForm, setCurrencyForm] = useState({
    title: "",
    currencyName: "",
    rate: "",
  });





  const changeHandelForm = (e) => {
    const { name, value } = e.target;

    let newErrors = {};

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    const spaceCheck = /\s{2,}/g;
    if (name == "title" && specialChars.test(value)) {
      newErrors.title = "Special characters not allowed.";
    } else if (name == "title" && value.charAt(0) === " ") {
      newErrors.title = "First character cannot be a blank space.";
    } else if (name == "title" && spaceCheck.test(value)) {
      newErrors.title = "Multiple space not allow.";
    } else if (name == "currencyName" && specialChars.test(value)) {
      newErrors.currencyName = "Special characters not allowed.";
    } else if (name == "currencyName" && value.charAt(0) === " ") {
      newErrors.currencyName = "First character cannot be a blank space.";
    } else if (name == "currencyName" && spaceCheck.test(value)) {
      newErrors.currencyName = "Multiple space not allow.";
    }
    // else if (name === "rate" && value < 0) {
    //   newErrors.rate = "Please enter greater than 0";
    // } 
    else if (name === "rate" && value.length > 8) {
      newErrors.rate = "Please enter less than 9 digit.";
    } else if (name === "rate" && value.includes("-")) {
      newErrors.rate = "Not allowed Negative sign.";
    }
    //  else if (name === "rate" &&  (!patt.test(value) && value != "" )) {
    //   newErrors.rate = "Only number allow";
    // }

    else {
      setCurrencyForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    setformerr(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const application_data = {
      CurrencyCode: currencyForm.title.toUpperCase(),
      CurrencyName: currencyForm.currencyName,
      CurrencyRate: currencyForm.rate,
    };
    const application_data_json = JSON.stringify(application_data);
    try {
      if (isValid()) {
        const application_responce = await fetch(APIURL + "Admin/AddCurrency", {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: application_data_json,
        });

        const data = await application_responce.json();
        setToastDisplayed(true);
        if (data.responseCode === "200") {
          setCurrencyForm({
            title: "",
            currencyName: "",
            rate: "",
          });

          toast.success(data.responseMessage, { autoClose: 2000 });
          setTimeout(() => {
            handleFormClose();
            table_Data();
            setSearchText('');
            setToastDisplayed(false);
          }, 2500);
        } else {
          toast.warning(data.responseMessage, { autoClose: 2000 });
          setTimeout(() => {

            table_Data();
            setToastDisplayed(false);

          }, 2500);
        }
      }
    } catch (error) {
      console.log("Fetching Error", error);
    }
  };

  // add currency form end

  // validation start
  const isValid = () => {
    const newErrors = {};
    const regex = /^(?:\d{1,8}|\d{1,2}\.\d{1,3})$/;
    let valid = true;
    if (!currencyForm.title) {
      newErrors.title = "Currency code is required.";
      valid = false;
    }else if (currencyForm.title.trim().length < 3) {
      newErrors.title = "Currency code allow minimum 3 charecter";
      valid = false;
    }else if (currencyForm.title.trim().length > 3) {
      
      newErrors.title = "Currency code allow maximum 3 charecter";
      valid = false;
    }
    if (!currencyForm.currencyName) {
      newErrors.currencyName = "Currency name is required.";
      valid = false;
    }

    if (!currencyForm.rate) {
      newErrors.rate = "Currency rate is required.";
      valid = false;
    } else if (currencyForm.rate < 0) {
      newErrors.rate = "Please enter greater than 0.";
      valid = false;
    } else if (currencyForm.rate == 0) {
      newErrors.rate = "Please enter greater than 0.";
      valid = false;
    } else if (!regex.test(currencyForm.rate)) {
      newErrors.rate = "Please enter a rate in the format XX.XXX.";
      valid = false;
    }
    //else if (name === "rate" && value == 0) {
    //   console.log("rate",value);
    //   newErrors.rate = "Please enter greater than 0";
    // }
    if (currencyForm.rate.includes("-")) {
      newErrors.rate = "Please enter greater than 0.";
    }
    setformerr(newErrors);
    return valid;
  };

  // validation update start
  const isUpdateValid = () => {
    const newErrors = {};
    let valid = true;
    const regex = /^(?:\d{1,8}|\d{1,2}\.\d{1,3})$/;
    const negNotexp = /^[0-9]+(\.[0-9]+)?$/

    if (!updateData.currencyCode) {
      newErrors.currencyCode = "Currency code is required.";
      valid = false;
    }else if (updateData.currencyCode.trim().length < 3) {
      newErrors.currencyCode = "Currency code allow minimum 3 charecter";
      valid = false;
    }else if (updateData.currencyCode.trim().length > 3) {
      newErrors.currencyCode = "Currency code allow maximum 3 charecter";
      valid = false;
    }

    if (!updateData.currencyName) {
      newErrors.currencyName = "Currency name is required.";
      valid = false;
    }
    if (!updateData.currencyRate) {
      newErrors.currencyRate = "Rate is required.";
      valid = false;
    } else if (updateData.currencyRate < 0) {
      newErrors.currencyRate = "Please enter greater than 0.";
      valid = false;
    } else if (updateData.currencyRate == 0) {
      newErrors.currencyRate = "Please enter greater than 0.";
      valid = false;
    } else if (!regex.test(updateData.currencyRate)) {
      newErrors.currencyRate = "Please enter a rate in the format XX.XXX.";
      valid = false;
    }
    setupdateerr(newErrors);
    return valid;
  };
  // validation end
  // validation end

  const filteredData = tableData?.filter(
    (item) =>
    (item.currencyName?.toLowerCase().includes(searchText?.toLowerCase()) ||
      (item.id && item.id.toString().includes(searchText)) ||
      item.currencyCode?.toLowerCase().includes(searchText?.toLowerCase()) ||
      (item.status == "1" ? "Active" : "Inactive").toLowerCase().includes(searchText?.toLowerCase()))
  );

  // const handleExportExcel = () => {
  //     const worksheet = XLSX.utils.json_to_sheet(filteredData);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Movie Data");
  //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  //     const excelData = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  //     FileSaver.saveAs(excelData, "movie_data.xlsx");
  // };

  return (
    <>
      <>
        <DataTable
          className="customTable"
          columns={columns}
          data={filteredData}
          defaultSortFieldId={1}
          persistTableHead={true}
          defaultSortAsc={true}
          pagination
          paginationRowsPerPageOptions={[10, 50, 100]}
          highlightOnHover
          dense
          striped
          fixedHeader
          subHeader
          subHeaderComponent={
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
                {/* <CSVLink
                                data={filteredData}
                                filename={"movie_data.csv"}
                                className="hidden"
                                ref={csvLinkRef} 
                            >
                                Export to CSV
                            </CSVLink> */}
                {/* <button onClick={handleExportExcel} disabled>Export to Excel</button> */}
                <Button onClick={handleFormShow}>Add Currency</Button>
              </div>
            </div>
          }
        />
      </>

      {/* currencyMaster Form modal */}
      <Modal show={showForm} onHide={handleFormClose} backdrop="static">
        <div className="application-box">
          <div className="login_inner">
            <div class="login_form ">
              <h5>
                <Modal.Header closeButton className="p-0">
                  <Modal.Title>Add Currency</Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel">
              <Modal.Body className="p-0">
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="title"
                      className="fomcontrol text-uppercase"
                      value={currencyForm?.title}
                      placeholder="Currency Code"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                  {formerr?.title && (
                    <span className="errormsg">{formerr?.title}</span>
                  )}
                </div>
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="currencyName"
                      className="fomcontrol text-capitalize"
                      value={currencyForm.currencyName}
                      placeholder="Currency Name"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                  {formerr?.currencyName && (
                    <span className="errormsg">{formerr?.currencyName}</span>
                  )}
                </div>
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="number"
                      min={0}
                      name="rate"
                      // max={8}
                      value={currencyForm?.rate}
                      className="fomcontrol"
                      placeholder="Rate"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+") {
                          e.preventDefault();
                        }
                      }}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                  {formerr?.rate && (
                    <span className="errormsg">{formerr?.rate}</span>
                  )}
                  {/* {formerr?.rate ? (
                    <span className="errormsg">{formerr?.rate}</span>
                  ) : (
                    ""
                  )} */}
                </div>
              </Modal.Body>
              <Modal.Footer className="p-0">
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={toastDisplayed ? true : false}
                >
                  Submit
                </Button>
              </Modal.Footer>
            </div>
          </div>
        </div>
      </Modal>

      {/* currencyMaster Form update modal */}
      <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
        <div className="application-box editmodal-change">
          <div className="login_inner">
            <div class="login_form ">
              <h5>
                <Modal.Header closeButton className="p-0">
                  <Modal.Title>Update Currency</Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel">
              <Modal.Body className="p-0">
                <div className="form-bx mb-4">
                  <p className="form-label">Currency Code</p>
                  <label>
                    <input
                      type="text"
                      name="currencyCode"
                      className="fomcontrol text-uppercase"
                      placeholder="Currency Code"
                      onChange={(e) => {
                        changeUpdateForm(e);
                      }}
                      required
                      value={updateData.currencyCode}
                    />
                    <span className="sspan"></span>
                  </label>
                  {updateerr?.currencyCode && (
                    <span className="errormsg">{updateerr?.currencyCode}</span>
                  )}
                </div>
                <div className="form-bx mb-4">
                  <p className="form-label">Currency Name</p>
                  <label>
                    <input
                      type="text"
                      name="currencyName"
                      className="fomcontrol text-capitalize"
                      placeholder="Currency Name"
                      onChange={(e) => {
                        changeUpdateForm(e);
                      }}
                      required
                      value={updateData.currencyName}
                    />
                    <span className="sspan"></span>
                  </label>
                  {updateerr?.currencyName && (
                    <span className="errormsg">{updateerr?.currencyName}</span>
                  )}
                </div>
                <div className="form-bx mb-4">
                  <p className="form-label">Currency Rate</p>
                  <label>
                    <input
                      type="number"
                      name="currencyRate"
                      className="fomcontrol"
                      placeholder="Currency Rate"
                      onChange={(e) => {
                        changeUpdateForm(e);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+") {
                          e.preventDefault();
                        }
                      }}
                      required
                      value={updateData.currencyRate}
                    />
                    <span className="sspan"></span>
                  </label>
                  {updateerr?.currencyRate ? (
                    <span className="errormsg">{updateerr?.currencyRate}</span>
                  ) : ""}
                </div>
                <div className="form-bx mb-4">
                  <p className="form-label">Select Status</p>
                  <label>
                    <select
                      name="status"
                      class=""
                      aria-label="Large select example"
                      onChange={(e) => {
                        changeUpdateForm(e);
                      }}
                      value={updateData.status}
                    >
                      <option value="0">Inactive</option>
                      <option value="1">Active</option>
                    </select>
                    <span className="sspan"></span>
                  </label>
                  {/* {errors === true && !updateData.name ? <small class="errormsg">Name is Required</small> : ''} */}
                </div>
              </Modal.Body>
              <Modal.Footer className="p-0">
                <Button
                  variant="primary"
                  onClick={handleUpdateData}
                  disabled={toastDisplayed ? true : false}
                >
                  Update
                </Button>
              </Modal.Footer>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CurrencyMasterTable;
