import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { APIURL } from "../../constant";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import EditorPage from "../components/EditorTemplate";
import { Storage } from "../../login/Storagesetting";
import { TailSpin } from "react-loader-spinner";
import { decode } from "html-entities";
import jsPDF from 'jspdf';

import axios from "axios";
const BankMasterTable = () => {
  const navigate = useNavigate();
  const [imageDimensions, setImageDimensions] = useState({});
  const [searchText, setSearchText] = useState("");
  const [tableData, setTableData] = useState([]);
  const [toastDisplayed, setToastDisplayed] = useState(false);  
  const csvLinkRef = useRef();
  const [errors, setErrors] = useState(false);
  const [formerr, setformerr] = useState();
  const targetRef = useRef();
  const [updateerr, setupdateerr] = useState();
  const [banknameEditpdfF, setbanknameEditpdfF] = useState("");
  const [loader, setLoader] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [getNewBankData, setNewGetBankData] = useState();
  const [updateData, setUpdateData] = useState({
    bankCode: "",
    bankName: "",
    bankAddress1: "",
    bankAddress2: "",
    bankAddress3: "",
    approvalLetter: "",
    nameForSign: "",
    designationForSign: "",
    signatureImage: "",
    status: "",
  });  

  const UpdateModalClose = () => {
    setShowUpdateModal(false);
    setUpdateData({
      bankCode: "",
      bankName: "",
      bankAddress1: "",
      bankAddress2: "",
      bankAddress3: "",
      approvalLetter: "",
      nameForSign: "",
      designationForSign: "",
      signatureImage: "",
      status: "",
    });
    setupdateerr("");
  };

  const changeUpdateForm = (e) => {
    const { name, value } = e.target;
    let newErrors = {};
    const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const spaceCheck = /\s{2,}/g;
    if (name == "bankName" && specialCharsOLD.test(value)) {
      newErrors.bankName = "Special characters not allowed.";
    } else if (name == "bankName" && value.charAt(0) === " ") {
      newErrors.bankName = "First character cannot be a blank space.";
    } else if (name == "bankName" && spaceCheck.test(value)) {
      newErrors.bankName = "Multiple space not allow.";
    } else if (name == "bankCode" && specialCharsOLD.test(value)) {
      newErrors.bankCode = "Special characters not allowed.";
    } else if (name == "bankCode" && value.charAt(0) === " ") {
      newErrors.bankCode = "First character cannot be a blank space.";
    } else if (name == "bankCode" && spaceCheck.test(value)) {
      newErrors.bankCode = "Multiple space not allow.";
    } else if (name == "bankAddress1" && value.charAt(0) === " ") {
      newErrors.bankAddress1 = "First character cannot be a blank space.";
    } else if (name == "bankAddress1" && spaceCheck.test(value)) {
      newErrors.bankAddress1 = "Multiple space not allow.";
    } else if (
      name == "bankAddress1" &&
      (value.includes("$") ||
        value.includes("@") ||
        value.includes("`") ||
        value.includes("|") ||
        value.includes("~") ||
        value.includes(",") ||
        value.includes(">") ||
        value.includes("<") ||
        value.includes("*") ||
        value.includes("&") ||
        value.includes("%") ||
        value.includes("#") ||
        value.includes("+") ||
        value.includes("?") ||
        value.includes("!") ||
        value.includes(";") ||
        value.includes("=") ||
        value.includes('"') ||
        value.includes(`'`) ||
        value.includes("/") ||
        value.includes("}") ||
        value.includes("{") ||
        value.includes("^") ||
        value.includes("\\") ||
        value.includes("]") ||
        value.includes("["))
    ) {
      newErrors.bankAddress1 = "Special characters not allowed.";
    } else {
      setUpdateData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setupdateerr(newErrors);
  };
  // pdfID
  const [pdfID, setPdfID] = useState(null);
  const handlePdfId = (id) => {
    setPdfID(id);
  };
  const [updateID, setUpdateID] = useState("");

  const handleUpdate = async (id) => {
    setShowUpdateModal(true);
    setUpdateID(id);
    const TableId = {
      id: id,
    };
    try {
      const response = await fetch(APIURL + "Admin/GetBankByID", {
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

  const [getBankData, setGetBankData]=useState()

  const getBankDataByID = async (id) => {
    try {
      const response = await axios.post(APIURL + "Admin/GetBankByID", 
        {id: id,},
      );
      setGetBankData(response.data.responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateData = async () => {
    const updateValue = {
      ID: updateID,
      BankCode: updateData.bankCode.toUpperCase(),
      BankName: updateData.bankName,
      BankAddress1: updateData.bankAddress1,
      BankAddress2: updateData.bankAddress2,
      BankAddress3: updateData.bankAddress3,
      NameForSign: "",
      DesignationForSign: "",
      SignatureImage: "",
      Status: updateData.status,
    };
    try {
      if (isUpdateValid()) {
        const response = await fetch(APIURL + "Admin/UpdateBank", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateValue),
        });
        const data = await response.json();
        if (data.responseCode === "200") {
          setToastDisplayed(true);
          toast.success(data.responseMessage, { autoClose: 2000 });
          setTimeout(() => {
            UpdateModalClose();
            table_Data();
            setToastDisplayed(false);
            setUpdateData({
              bankCode: "",
              bankName: "",
              bankAddress1: "",
              bankAddress2: "",
              bankAddress3: "",
            });
            setSearchText("");
            setErrors(false);
          }, 2500);
        } else {
          toast.warning(data.responseMessage, { autoClose: 2000 });
          setTimeout(() => {
            UpdateModalClose();
            table_Data();
            setToastDisplayed(false);
            setUpdateData({
              bankCode: "",
              bankName: "",
              bankAddress1: "",
              bankAddress2: "",
              bankAddress3: "",
            });
            setErrors(false);
          }, 2500);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // bank update end
  const table_Data = async () => {

    try {
      const response = await fetch(APIURL + "Admin/GetAllBanks", {
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

  const handleBankname = (name) => {
    setbanknameEditpdfF(name);
  };

  const options = {
    method: "open",
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.SMALL,
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      orientation: "landscape",
      height: 297,
      width: 219,
    },
    canvas: {
      mimeType: "image/png",
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };


  useEffect(() => {
    /*if (pdfID !== null) {
        generatePDF(targetRef, { filename: "page.pdf", options })
        .then((res) => {
          setPdfID(null);
          setLoader("");
        })
        .catch((err) => {
          setPdfID(null);
          setLoader("");
        });
    }*/
    table_Data();
  }, [pdfID]);

  const columns = [
    {
      name: "Bank Code",
      selector: (row) => row.bankCode,
      sortable: true,
      searchable: true,
      width: "200px",
    },
    {
      name: "Bank Name",
      selector: (row) => row.bankName,
      sortable: true,
      searchable: true,
      width: "200px",
    },
    {
      name: "Address Line",
      selector: (row) =>
        (row.bankAddress1 ? row.bankAddress1 : " ") +
        "  " +
        (row.bankAddress2 ? " , " + row.bankAddress2 : " ") +
        (row.bankAddress3 ? " , " + row.bankAddress3 : " "),
      sortable: true,
      searchable: true,
      width: "400px",
    },
    /*{
      name: "Letterhead",
      selector: (row) => row.id,
      cell: (row) => (
        row.bankLetterHead ? <button
        type="button"
        key={row.id}
        className="me-2"
        onClick={() => {
          setPdfID(null);
          setPdfID(row.id);
          setLoader(row.id);
          //generateLaterHeadPdf(row.id);
        }}
        style={{
          border: "unset",
          backgroundColor: "transparent",
          fontSize: "25px",
        }}
      >
        {loader == row.id ? (
          <TailSpin
            visible={true}
            height="20"
            width="20"
            color="#5e62a1"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <i class="bi bi-file-text"></i>
        )}
      </button> : ""
      ),
      searchable: true,
    },*/
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      searchable: true,
      width: "100px",
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
      width: "100px",
      cell: (row) => (
        <>
          <Link to="" className="me-2" title="Bank Edit" onClick={() => handleUpdate(row.id)}>
            <i class="bi bi-pencil-square"></i>
          </Link>
          <span
          title="Letterhead Edit"
            onClick={() => {
              handleEditorPage(row.id);
              getBankDataByID(row.id);
              handleBankname(row.bankName);
            }}
          >
            <i class="bi bi-pencil-fill"></i>
          </span>
        </>
      ),
    },
  ];

  // Sector Master form start
  const [showForm, setShowForm] = useState(false);
  const handleFormClose = () => {
    setShowForm(false);
    setformerr("");
    setBankForm({
      BankCode: "",
      BankName: "",
      BankAddress1: "",
      BankAddress2: "",
      BankAddress3: "",
    });
  };
  const handleFormShow = () => setShowForm(true);
  const [bankForm, setBankForm] = useState({
    BankCode: "",
    BankName: "",
    BankAddress1: "",
    BankAddress2: "",
    BankAddress3: "",
  });

  const changeHandelForm = (e) => {
    const { name, value } = e.target;
    let newErrors = {};
    const spaceCheck = /\s{2,}/g;
    const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (name == "BankName" && specialCharsOLD.test(value)) {
      newErrors.BankName = "Special characters not allowed.";
    } else if (name == "BankName" && value.charAt(0) === " ") {
      newErrors.BankName = "First character cannot be a blank space.";
    } else if (name == "BankName" && spaceCheck.test(value)) {
      newErrors.BankName = "Multiple space not allow.";
    } else if (name == "BankCode" && specialCharsOLD.test(value)) {
      newErrors.BankCode = "Special characters not allowed.";
    } else if (name == "BankCode" && value.charAt(0) === " ") {
      newErrors.BankCode = "First character cannot be a blank space.";
    } else if (name == "BankCode" && spaceCheck.test(value)) {
      newErrors.BankCode = "Multiple space not allow.";
    } else if (name == "BankAddress1" && value.charAt(0) === " ") {
      newErrors.BankAddress1 = "First character cannot be a blank space.";
    } else if (name == "BankAddress1" && spaceCheck.test(value)) {
      newErrors.BankAddress1 = "Multiple space not allow.";
    } else if (
      name == "BankAddress1" &&
      (value.includes("$") ||
        value.includes("@") ||
        value.includes("`") ||
        value.includes("|") ||
        value.includes("~") ||
        value.includes(",") ||
        value.includes(">") ||
        value.includes("<") ||
        value.includes("*") ||
        value.includes("&") ||
        value.includes("%") ||
        value.includes("#") ||
        value.includes("+") ||
        value.includes("?") ||
        value.includes("!") ||
        value.includes(";") ||
        value.includes("=") ||
        value.includes('"') ||
        value.includes(`'`) ||
        value.includes("/") ||
        value.includes("}") ||
        value.includes("{") ||
        value.includes("^") ||
        value.includes("\\") ||
        value.includes("]") ||
        value.includes("["))
    ) {
      newErrors.BankAddress1 = "Special characters not allowed.";
    } else {
      setBankForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setformerr(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const application_data = {
      BankCode: bankForm.BankCode.toUpperCase(),
      BankName: bankForm.BankName,
      BankAddress1: bankForm.BankAddress1,
      BankAddress2: bankForm.BankAddress2,
      BankAddress3: bankForm.BankAddress3,
      ApprovalLetter: "",
      NameForSign: "",
      DesignationForSign: "",
      SignatureImage: "",
    };
    const application_data_json = JSON.stringify(application_data);
    try {
      if (isValid()) {
        const application_responce = await fetch(APIURL + "Admin/AddBank", {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: application_data_json,
        });
        const data = await application_responce.json();
        setToastDisplayed(true);
        if (data.responseCode === "200") {
          toast.success(data.responseMessage, { autoClose: 2000 });
          setTimeout(() => {
            handleFormClose();
            table_Data();
            setBankForm({
              BankCode: "",
              BankName: "",
              BankAddress1: "",
              BankAddress2: "",
              BankAddress3: "",
            });
            setSearchText("");
            setToastDisplayed(false);
          }, 2500);
        } else {
          toast.warning(data.responseMessage, { autoClose: 2000 });
          setTimeout(() => {
            handleFormClose();
            table_Data();
            setToastDisplayed(false);
          }, 2500);
        }
      }
    } catch (error) {
      console.log("Fetching Error", error);
    }
  };

  // BankMaster form end
  // validation start
  const isValid = () => {
    const newErrors = {};
    let valid = true;

    if (!bankForm.BankCode) {
      newErrors.BankCode = "Bank code is required.";
      valid = false;
    }
    if (!bankForm.BankName) {
      newErrors.BankName = "Bank name is required ";
      valid = false;
    }
    if (!bankForm.BankAddress1) {
      newErrors.BankAddress1 = "Bank address1 is required ";
      valid = false;
    }
    setformerr(newErrors);
    return valid;
  };
  // validation end

  // validation update start
  const isUpdateValid = () => {
    const newErrors = {};
    let valid = true;

    if (!updateData.bankCode) {
      newErrors.bankCode = "Bank code is required.";
      valid = false;
    }

    if (!updateData.bankName) {
      newErrors.bankName = "Bank name is required.";
      valid = false;
    }
    if (!updateData.bankAddress1) {
      newErrors.bankAddress1 = "Bank address1 is required.";
      valid = false;
    }
    setupdateerr(newErrors);
    return valid;
  };

  // goto editorTemplate Page
  const [showEditor, setShowEditor] = useState(false);
  const [bankId, setBankId] = useState(false);
  const handleEditorPage = (id) => {
    setBankId(id);
    setShowEditor(true);
  };

  // validation end
  const filteredData = tableData?.filter(
    (item) =>
      item.bankName?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.bankCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.id && item.id.toString().includes(searchText)) ||
      (item.status == "1" ? "Active" : "Inactive")
        .toLowerCase()
        .includes(searchText?.toLowerCase())
  );

  /*const Header = () => (
    <div
      className="headerPDF"
      style={{
        width: "100%",
        maxHeight: "120px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {tableData.map((item) => {
        if (item.id == pdfID) {
          return <img src={item.headerImageURL} alt="Banner Preview" />;
        }
      })}
    </div>
  );

  const Header2 = () => (
    <div className="headerPDF2">
      {tableData.map((item) => {
        if (item.id == pdfID) {
          return <img src={item.headerImageURL} alt="Banner Preview" />;
        }
      })}
    </div>
  );

  function splitStringIntoArray(str, limit) {
    const regex = new RegExp(`.{1,${limit}}`, "g");
    const matches = str.match(regex);
    return matches || [];
  }

  const characterLimit = 2400;
  const Footer = () => (
    <div
      className="FooterPDF"
      style={{
        width: "100%",
        maxHeight: "100px",
        position: "absolute",
        bottom: "0px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {tableData.map((item) => {
        if (item.id == pdfID) {
          return <img src={item.footerImageURL} alt="Banner Preview" />;
        }
      })}
    </div>
  );

  const Footer2 = () => (
    <div className="FooterPDF2">
      {tableData.map((item) => {
        if (item.id == pdfID) {
          return <img src={item.footerImageURL} alt="Banner Preview" />;
        }
      })}
    </div>
  );
*/
  return (
    <>
      {showEditor ? (
        <EditorPage
          bankID={bankId}
          setbanknameEditpdfF={setbanknameEditpdfF}
          banknameEditpdfF={banknameEditpdfF}
          getBankData={getBankData}
        />
      ) : (
        <>
          <DataTable
            className="bankDataTable"
            columns={columns}
            data={filteredData}
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
                  <Button onClick={handleFormShow}>Add Bank</Button>
                </div>
              </div>
            }
          />
        </>
      )}
      {/* BankMaster Form modal */}
      <Modal show={showForm} onHide={handleFormClose} backdrop="static">
        <div className="application-box">
          <div className="login_inner">
            <div class="login_form ">
              <h5>
                <Modal.Header closeButton className="p-0">
                  <Modal.Title>Add Bank</Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel">
              <Modal.Body className="p-0">
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="BankCode"
                      value={bankForm?.BankCode}
                      className="fomcontrol text-uppercase"
                      placeholder="Bank Code"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                  {formerr?.BankCode ? (
                    <span className="errormsg">{formerr?.BankCode}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="BankName"
                      value={bankForm?.BankName}
                      className="fomcontrol"
                      placeholder="Bank Name"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                  {formerr?.BankName ? (
                    <span className="errormsg">{formerr?.BankName}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="BankAddress1"
                      value={bankForm?.BankAddress1}
                      className="fomcontrol"
                      placeholder="Address Line1"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                  {formerr?.BankAddress1 ? (
                    <span className="errormsg">{formerr?.BankAddress1}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="BankAddress2"
                      placeholder="Address Line2"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="BankAddress3"
                      placeholder="Address Line3"
                      onChange={(e) => {
                        changeHandelForm(e);
                      }}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
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

      {/* BankMaster Form update modal */}
      <Modal show={showUpdateModal} onHide={UpdateModalClose} backdrop="static">
        <div className="application-box editmodal-change">
          <div className="login_inner">
            <div class="login_form ">
              <h5>
                <Modal.Header closeButton className="p-0">
                  <Modal.Title>Update Bank</Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel">
              <Modal.Body className="p-0">
                <div className="form-bx mb-4">
                  <p className="form-label">Bank Code</p>
                  <label>
                    <input
                      type="text"
                      name="bankCode"
                      className="fomcontrol text-uppercase"
                      placeholder="Bank Code"
                      onChange={(e) => {
                        changeUpdateForm(e);
                      }}
                      required
                      value={updateData.bankCode}
                    />
                    <span className="sspan"></span>
                  </label>
                  {updateerr?.bankCode ? (
                    <span className="errormsg">{updateerr?.bankCode}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-bx mb-4">
                  <p className="form-label">Bank Name</p>
                  <label>
                    <input
                      type="text"
                      name="bankName"
                      className="fomcontrol"
                      value={updateData?.bankName}
                      placeholder="Bank Name"
                      onChange={(e) => {
                        changeUpdateForm(e);
                      }}
                      required
                    />
                    <span className="sspan"></span>
                  </label>
                  {updateerr?.bankName ? (
                    <span className="errormsg">{updateerr?.bankName}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-bx mb-4">
                  <p className="form-label">Bank Address1</p>
                  <label>
                    <input
                      type="text"
                      name="bankAddress1"
                      className="fomcontrol"
                      placeholder="Address1"
                      onChange={(e) => {
                        changeUpdateForm(e);
                      }}
                      required
                      value={updateData.bankAddress1}
                    />
                    <span className="sspan"></span>
                  </label>
                  {updateerr?.bankAddress1 ? (
                    <span className="errormsg">{updateerr?.bankAddress1}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="form-bx mb-4">
                  <p className="form-label">Bank Address2</p>
                  <label>
                    <input
                      type="text"
                      name="bankAddress2"
                      className=""
                      placeholder="Address2"
                      onChange={(e) => {
                        changeUpdateForm(e);
                      }}
                      required
                      value={updateData.bankAddress2}
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
                <div className="form-bx mb-4">
                  <p className="form-label">Bank Address3</p>
                  <label>
                    <input
                      type="text"
                      name="bankAddress3"
                      className=""
                      placeholder="Address3"
                      onChange={(e) => {
                        changeUpdateForm(e);
                      }}
                      required
                      value={updateData.bankAddress3}
                    />
                    <span className="sspan"></span>
                  </label>
                </div>
                <div className="form-bx mb-4">
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
      
      {tableData?.map((item) => {
        if (item.id == pdfID) {
          const inputString = item.bankLetterHead;
          return (
            <>
              {inputString.length > 1 ? (
                <div style={{ opacity: 0, height: 0 }} className="">                  
                  <div style={{ opacity: 0, height: 0 }} className="">
                    <div ref={targetRef}>
                      <div>
                        <div dangerouslySetInnerHTML={{ __html: item.bankLetterHead }}/>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                " "
              )}
            </>
          );
        }
      })}
    </>
  );
};

export default BankMasterTable;
