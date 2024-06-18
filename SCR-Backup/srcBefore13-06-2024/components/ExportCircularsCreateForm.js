import React, { useEffect, useRef, useState } from "react";
import { Storage } from "../login/Storagesetting";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import { APIURL, ImageAPI } from "../constant";
import { toast } from "react-toastify";
import { MultiSelect } from 'primereact/multiselect';
import jsPDF from "jspdf";
import moment from "moment";
import logo from "../rbz_LOGO.png";
import NoSign from "../NoSign.png";
/* Tiptp Editor Starts */
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNavigate } from "react-router-dom";
/* Tiptp Editor Ends */

import DirectiveMultiSelectComponent from './SearchUI/DirectiveMultiSelectComponent'
import CustomBankMultiSelect from './SearchUI/CustomBankMultiSelect'
import { generate } from "shortid";
const ExportCircularsCreateForm = () => {
  const navigate = useNavigate()
  // const purposeApplicationRef = useRef(null);
  const PdfPrivewsupervisorRef = useRef();
  const userID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const roleID = Storage.getItem("roleIDs");
  const bankidcheck = bankID !== "" ? "1" : "3";
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const PdfUsername = Storage.getItem("name");
  const PdfRolename = Storage.getItem("roleName");
  const [errors, setErrors] = useState({});
  const [checkAnalyst, setAnalyst] = useState(false);
  const [checkDecision, setCheckDecision] = useState(false);
  const [selectedBankOption, setSelectedBankOption] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedDirectives, setSelectedDirectives] = useState([]);
  const [applicationDetail, setApplicationDetail] = useState({});
  const [circularAttachmentData, setCircularAttachmentData] = useState([
    { filename: "File Upload", upload: "" },
  ]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [selectedDirectivesOpt, setSelectedDirectivesOpt] = useState([]);
  const [analystUser, setAnalystUser] = useState([]);
  const [applicationstaus, setapplicationstaus] = useState("0");
  const [files, setFiles] = useState([]);
  const [department, setDepartment] = useState([]);
  const [otherfiles, setOtherfiles] = useState([]);
  const [Description, setDescription] = useState("");
  const [releasingDate, setReleasingDate] = useState(new Date());
  const [exportForm, setExportForm] = useState({
    name: "",
    subject: "",
    content: "",
    departmentValue: "",
    directiveSelectValue: [],
    bankSelectValue: [],
    analyst: "",
  });
  const applicationTypeRef = useRef(null);
  const fileInputRefsother = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [content, setEditorContent] = useState("<p></p>");
  const handelAnalystCheck = () => {
    setAnalyst(!checkAnalyst);
    setCheckDecision(!checkDecision);

  }
  //--------   department api call start
  const GetDepartment = async () => {
    await axios
      .post(APIURL + "User/GetDepartmentByUserID", {
        UserID: userID.replace(/"/g, ""),
        RoleID: roleID
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setDepartment(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //--------   department api call end
  const changeHandelForm = (e) => {
    const { name, value } = e.target;

    let newErrors = {};

    // const specialChars = /[!@#$%^&*(),.?":{}|<>`~]/;
    const specialCharsOLD = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const spaceCheck = /\s{2,}/g;


    if (name == "name" && specialCharsOLD.test(value)) {
      newErrors.name = "Special characters not allowed.";
    } else if (name == "name" && value.charAt(0) === " ") {
      newErrors.name = "First character cannot be a blank space";
    } else if (name == "name" && spaceCheck.test(value)) {
      newErrors.name = "Multiple space not allow.";
    }
    else {
      setExportForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setErrors(newErrors);
  };
  //---------- End form fill data handle
  const ChangeApplicationStatus = (e) => {
    const values = e.target.value;
    setapplicationstaus(values);
    // setAsignUser([]);
    // setAssignUserID("");
  };
  //---bank data start
  const bankData = async () => {
    await axios
      .post(APIURL + 'Master/GetMasterBank')
      .then((res) => {
        setSelectedBankOption(res.data.responseData)

      })
  }
  const vOption = selectedBankOption?.map((res) => ({
    label: res.bankName,
    value: res.id,
  }));
  const handleChangeBank = (e) => {
    const values = e;
    setSelectedBanks(values);
  };

  const panelFooterTemplate = () => {
    const length = exportForm.bankSelectValue ? exportForm.bankSelectValue.length : 0;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> item{length > 1 ? 's' : ''} selected.
      </div>
    );
  };
  const onShow = () => {
    // Wait for the component to be mounted before accessing the DOM
    setTimeout(() => {
      let selectAllCheckbox = document.querySelector(".p-multiselect-header > .p-multiselect-select-all");
      if (selectAllCheckbox) {
        selectAllCheckbox.after(" Select All");
      }
    }, 0);
  };
  //---bank data end

  //---------director start 
  const directivesData = async () => {
    await axios
      .post(APIURL + 'Admin/GetAllDirectives')
      .then((res) => {
        setSelectedDirectivesOpt(res.data.responseData)

      })
  }

  const DirectiveOption = selectedDirectivesOpt?.map((res) => ({
    label: res.directiveName,
    value: res.id,
  }));

  const handleChangeDirective = (e) => {
    const values = e;
    setSelectedDirectives(values);
  };
  //---------director end
  //--------analyst user api start
  const analystUserFun = async () => {
    await
      axios.post(APIURL + 'User/GetSupervisors', {
        BankID: bankID,
        RoleID: roleID,
        UserID: userID.replace(/"/g, ""),
        DepartmentID: "2",
      }).then((res) => {
        setAnalystUser(res.data.responseData)
      })
  }
  //--------analyst user api end
  // file change start
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0]
  //   setFile((PrevFile) => [...PrevFile, { file }])

  // }

  const handleFileChange = (e, label) => {
    // console.log("label",label);
    const file = e.target.files[0];
    const index = files.findIndex(item => item.label === label);
    if (index !== -1) {
      setFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, label };
        return newFiles;
      });
    } else {
      setFiles(prevFiles => [...prevFiles, { file, label }]);
    }
  };

  // file change end
  //---------- Start Code For Add More File Option Field
  const handleAddMore = (e) => {
    setOtherfiles([...otherfiles, null]);
  };
  const handleOthrefile = (e, id) => {
    const otherfile = e.target.files[0];
    setOtherfilesupload([...otherfilesupload, { otherfile, id }]);
  };

  //---------- End Code For Add More File Option Field
  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    if (exportForm.name === "") {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (exportForm.subject === "") {
      newErrors.subject = "Subject is required";
      valid = false;
    }
    if (exportForm.departmentValue == "") {
      newErrors.departmentValue = "Department is required";
      valid = false;
    }

    if (selectedDirectives.length == '0') {
      newErrors.selectedDirectives = "Directive is required";
      valid = false;
    } if (selectedBanks.length == '0') {
      newErrors.selectedBanks = "Bank is required";
      valid = false;
    }
    if (releasingDate == null) {
      newErrors.releasingDate = "Releasing date is required";
      valid = false;
    }
    if (releasingDate == null) {
      newErrors.releasingDate = "Releasing date is required";
      valid = false;
    } if (checkAnalyst == true && exportForm.analyst == '') {
      newErrors.analyst = "Please select analyst";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };


  //---------- End Code For Check Validation for Form Field
  const bankSelectedID = selectedBanks.map((res) => res.value);
  const directiveSelectedID = selectedDirectives.map((res) => res.value);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();

    const data = {
      UserID: userID.replace(/"/g, ""),
      RoleID: (checkAnalyst != true && checkDecision != true) ? "0" : roleID,
      Name: exportForm.name,
      // BankID: '"'+bankSelectedID.join()+'"',
      BankID: bankSelectedID.join(),
      Subject: exportForm.subject,
      // Content: exportForm.content,
      Content: Description,
      DirectiveID: directiveSelectedID.join(),
      // Description: Description,
      // AssignedTo: checkAnalyst ? exportForm.analyst : userID.replace(/"/g, ""),
      AssignedTo: checkAnalyst ? exportForm.analyst : "",
      // AssignedToRoleID: checkAnalyst ? "6" : roleID,
      AssignedToRoleID: checkAnalyst ? parseInt(roleID) + 1 : (checkAnalyst != true && checkDecision != true) ? "0" : roleID,
      // FutureDate: futureDate,
      ReleasingDate: releasingDate,
      DepartmentID: exportForm.departmentValue,
      CircularStatus:
        (roleID == 8 || roleID == 9)
          ? applicationstaus
          : "0",


      ActionStatus:
        ((roleID == 8 && applicationstaus !== "0") || (roleID == 8 && applicationstaus !== "0"))
          ? "100"
          : "0"

    }


    if (validateForm()) {
      await axios
        .post(APIURL + "Circular/CreateCircular", data)
        .then((res) => {
          setApplicationDetail(res.data.responseData)
          if (res.data.responseCode === '200') {
            for (let i = 0; i < files?.length; i++) { // Corrected loop condition
              formData.append("files", files[i].file);
              formData.append("Label", files[i].label);
            }
            formData.append("CircularReferenceNumber", res.data.responseData.circularReferenceNumber);
            formData.append("CircularID", res.data.responseData.id);
            formData.append("DepartmentID", res.data.responseData.departmentID);
            formData.append("UserID", userID.replace(/"/g, ""));
            axios.post(ImageAPI + 'File/UploadCircularDocs', formData)
              .then((res) => {
                setDescription("");
              })
              .catch((err) => {
                console.log("file Upload ", err)
              })

            // pdf generate code
            setTimeout(() => {
              const doc = new jsPDF({
                format: "a4",
                unit: "pt",
              });
              const addHeader = (doc) => {
                const pageCount = doc.internal.getNumberOfPages();
                const headerpositionfromleft =
                  (doc.internal.pageSize.width - 10) / 4;
                for (var i = 1; i <= pageCount; i++) {
                  doc.setPage(i);
                  doc.addImage(
                    logo,
                    "png",
                    70,
                    10,
                    80,
                    80,
                    "DMS-RBZ",
                    "NONE",
                    0
                  );
                  doc.setFontSize(8);
                  doc.text(
                    "Reserve Bank of Zimbabwe. 80 Samora Machel Avenue, P.O. Box 1283, Harare, Zimbabwe.",
                    headerpositionfromleft + 50,
                    40
                  );
                  doc.text(
                    "Tel: 263 242 703000, 263 8677000477 | Website:www.rbz.co.zw",
                    headerpositionfromleft + 100,
                    50
                  );
                }
              };
              // doc.setFont("helvetica", "normal");
              // doc.setFontSize(3);
              let docWidth = doc.internal.pageSize.getWidth();
              const refpdfview =
                PdfPrivewsupervisorRef
              doc.html(refpdfview.current, {
                x: 12,
                y: 12,
                width: 513,
                height: doc.internal.pageSize.getHeight(),
                margin: [110, 80, 60, 35],
                windowWidth: 1000,
                pagebreak: true,
                async callback(doc) {
                  addHeader(doc);


                  const blobPDF = doc.output("datauristring");
                  let formData = new FormData();
                  formData.append(
                    "UserID",
                    userID.replace(/"/g, "")
                  );
                  formData.append("FileType", "LetterHeadPDF");
                  formData.append("Label", "CoverLetter");
                 
                  formData.append(
                    "CircularID",
                    res.data.responseData.id
                  );
                  formData.append("DepartmentID",res.data.responseData.departmentID)
                  formData.append("PdfData", blobPDF);
                  await axios
                    .post(ImageAPI + "File/UploadPdf", formData)
                    .then(async (res) => {
                      if (res.data.responseCode == "Success") {
                        console.log("success Pdf");
                      } else {
                        console.log("Not Create pdf");
                      }
                    })
                    .catch((error) =>
                      console.log("DATA SAVE ERROR--", error)
                    );
                },
              });

              // axios
              //     .post(APIURL + "Admin/GetBankByID", {
              //         id: applicationDetail?.bankID,
              //     })
              //     .then((response) => {
              //         if (response.data.responseCode === "200") {
              //             if (
              //                 response.data.responseData?.headerFooterData["0"]?.fileType ==
              //                 "HeaderFile"
              //             ) {
              //                 var headerImage =
              //                     response.data.responseData.headerFooterData["0"].filePath;
              //                 var headerImagewidth =
              //                     response.data.responseData.headerFooterData["0"].imageWidth;
              //             } else {
              //                 var headerImage = "";
              //             }
              //             if (
              //                 response.data.responseData?.headerFooterData["1"]?.fileType ==
              //                 "FooterFile"
              //             ) {
              //                 var footerImage =
              //                     response.data.responseData.headerFooterData["1"].filePath;
              //                 var footerImagewidth =
              //                     response.data.responseData.headerFooterData["1"].imageWidth;
              //             } else {
              //                 var footerImage = "";
              //             }

              //             const addHeader = (doc) => {
              //                 if (roleID != 3) {
              //                     const pageCount = doc.internal.getNumberOfPages();
              //                     const headerpositionfromleft =
              //                         (doc.internal.pageSize.width - 10) / 4;
              //                     for (var i = 1; i <= pageCount; i++) {
              //                         doc.setPage(i);
              //                         doc.addImage(
              //                             logo,
              //                             "png",
              //                             70,
              //                             10,
              //                             80,
              //                             80,
              //                             "DMS-RBZ",
              //                             "NONE",
              //                             0
              //                         );
              //                         doc.setFontSize(8);
              //                         doc.text(
              //                             "Reserve Bank of Zimbabwe. 80 Samora Machel Avenue, P.O. Box 1283, Harare, Zimbabwe.",
              //                             headerpositionfromleft + 50,
              //                             40
              //                         );
              //                         doc.text(
              //                             "Tel: 263 242 703000, 263 8677000477 | Website:www.rbz.co.zw",
              //                             headerpositionfromleft + 100,
              //                             50
              //                         );
              //                     }
              //                 } else {
              //                     if (headerImage != "") {
              //                         const pageCount = doc.internal.getNumberOfPages();
              //                         var pagewidth = doc.internal.pageSize.width;
              //                         if (pagewidth > headerImagewidth) {
              //                             var diff = parseInt(pagewidth) - parseInt(headerImagewidth);
              //                             var positionLeft = parseInt(diff / 2);
              //                         } else {
              //                             var positionLeft = 250;
              //                         }

              //                         for (var i = 1; i <= pageCount; i++) {
              //                             doc.setPage(i);
              //                             doc.addImage(
              //                                 headerImage,
              //                                 "png",
              //                                 positionLeft,
              //                                 10,
              //                                 80,
              //                                 80,
              //                                 "Header",
              //                                 "NONE",
              //                                 0
              //                             );
              //                         }
              //                     } else {
              //                         doc.setFont("helvetica", "bold");
              //                         doc.setFontSize(20);
              //                         doc.text("Final Letter", 250, 40);
              //                     }
              //                 }
              //             };

              //             const addWaterMark = (doc) => {
              //                 const pageCount = doc.internal.getNumberOfPages();
              //                 for (var i = 1; i <= pageCount; i++) {
              //                     doc.setPage(i);
              //                     doc.setTextColor("#cccaca");
              //                     doc.saveGraphicsState();
              //                     doc.setGState(new doc.GState({ opacity: 0.4 }));
              //                     doc.setFont("helvetica", "normal");
              //                     doc.setFontSize(80);
              //                     //doc.text("PREVIEW", 50, 150, {align: 'center', baseline: 'middle'})
              //                     doc.text(
              //                         doc.internal.pageSize.width / 3,
              //                         doc.internal.pageSize.height / 2,
              //                         "Preview",
              //                         { angle: 45 }
              //                     );
              //                     doc.restoreGraphicsState();
              //                 }
              //             };
              //             doc.setFont("helvetica", "normal");
              //             doc.setFontSize(3);
              //             let docWidth = doc.internal.pageSize.getWidth();
              //             const refpdfview =
              //                 roleID == 3 && nextlevelvalue == 10
              //                     ? PdfPrivewsupervisorRef
              //                     : roleID == 3 && nextlevelvalue == ""
              //                         ? CoverigLetterRef
              //                         : PdfPrivewRef;
              //             doc.html(refpdfview.current, {
              //                 x: 12,
              //                 y: 12,
              //                 width: 513,
              //                 height: doc.internal.pageSize.getHeight(),
              //                 margin: [110, 80, 60, 35],
              //                 windowWidth: 1000,
              //                 pagebreak: true,
              //                 async callback(doc) {
              //                     addHeader(doc);
              //                     addWaterMark(doc);
              //                     doc.setProperties({
              //                         title: `${applicationDetail?.rbzReferenceNumber}`,
              //                     });
              //                     var blob = doc.output("blob");
              //                     window.open(URL.createObjectURL(blob), "_blank");
              //                 },
              //             });
              //             setBtnLoader(false);
              //         } else {
              //             var headerImage = "";
              //             var footerImage = "";
              //         }
              //     });
            }, 1500);
            toast.success(res.data.responseMessage, { autoClose: 2000 })
            setTimeout(() => {
              navigate("/CircularDashboard");
              setToastDisplayed(false)
              setExportForm({
                name: "",
                subject: "",
              })
              setDescription("");
              setSelectedBanks([]);
              setSelectedDirectives([]);
              setFiles([]);

            }, 2500)

          } else {
            toast.error(res.data.responseMessage, { autoClose: 2000 })
            setTimeout(() => {
              setToastDisplayed(false);
            }, 2500)
          }
        })
        .catch((err) => {
          console.log(err);

        });
    } else {
      if (!toastDisplayed) {
        toast.warning("Please fill all fields");
      }
      setToastDisplayed(true);
    }
  };
  const removeUserImage = (label) => {
    const updatedUserFile = files?.filter((item) => item.label !== label);
    setFiles(updatedUserFile);
  };
  const removeImage = (index, label) => {
    const updatedFile = files?.filter((item) => item.label !== label);
    setFiles(updatedFile);
  };

  const clearInputFileother = (index) => {
    if (fileInputRefsother[index]?.current) fileInputRefsother[index].current.value = "";
  }

  const ResetHandleData = () => {
    setExportForm({
      name: "",
      subject: "",
    });
    setErrors({});

  };


  useEffect(() => {
    if (toastDisplayed) {
      setTimeout(() => {
        setToastDisplayed(false);
      }, 1500);
    }
    bankData();
    directivesData();
    analystUserFun();
    GetDepartment();
  }, [toastDisplayed]);

  // ----- End Code For Geting Table Data

  // useEffect(() => {
  //   setEditorContent(editor.getHTML());
  // }, []);
  const CustomTableCell = TableCell.extend({
    addAttributes() {
      return {
        // extend the existing attributes …
        ...this.parent?.(),

        // and add a new one …
        backgroundColor: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-background-color"),
          renderHTML: (attributes) => {
            return {
              "data-background-color": attributes.backgroundColor,
              style: `background-color: ${attributes.backgroundColor}`,
            };
          },
        },
      };
    },
  });
  const MenuBar = ({ editor }) => {
    if (!editor) {
      return null;
    }

    return (
      <>
        <button
          type="button"
          title="Insert Table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <i class="bi bi-table"></i>
        </button>
        <button
          type="button"
          title="Add Column Before"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!editor.can().addColumnBefore()}
        >
          <i class="bi bi-list-columns-reverse"></i>
        </button>
        <button
          type="button"
          title="Add Column After"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.can().addColumnAfter()}
        >
          <i class="bi bi-list-columns"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.can().deleteColumn()}
        >
          <i class="bi bi-archive"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={!editor.can().addRowBefore()}
        >
          <i class="bi bi-arrow-bar-up"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.can().addRowAfter()}
        >
          <i class="bi bi-arrow-bar-down"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!editor.can().deleteRow()}
        >
          <i class="bi bi-archive"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
        >
          <i class="bi bi-archive"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
        >
          <i class="bi bi-union"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!editor.can().splitCell()}
        >
          splitCell
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
          disabled={!editor.can().toggleHeaderColumn()}
        >
          <i class="bi bi-layout-split"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          disabled={!editor.can().toggleHeaderRow()}
        >
          <i class="bi bi-toggle-off"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderCell().run()}
          disabled={!editor.can().toggleHeaderCell()}
        >
          <i class="bi bi-toggle-off"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().mergeOrSplit().run()}
          disabled={!editor.can().mergeOrSplit()}
        >
          <i class="bi bi-subtract"></i>
        </button>
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setCellAttribute("backgroundColor", "#FAF594")
              .run()
          }
          disabled={
            !editor.can().setCellAttribute("backgroundColor", "#FAF594")
          }
        >
          <i class="bi bi-kanban"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().fixTables().run()}
          disabled={!editor.can().fixTables()}
        >
          <i class="bi bi-file-spreadsheet"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().goToNextCell().run()}
          disabled={!editor.can().goToNextCell()}
        >
          <i class="bi bi-arrow-right-square"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().goToPreviousCell().run()}
          disabled={!editor.can().goToPreviousCell()}
        >
          <i class="bi bi-arrow-left-square"></i>
        </button>
        <button
          type="button"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <i class="bi bi-type-bold"></i>
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <i class="bi bi-type-italic"></i>
        </button>
        <button
          type="button"
          title="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <i class="bi bi-type-strikethrough"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <i class="bi bi-code-slash"></i>
        </button>
        <button
          type="button"
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <i class="bi bi-paragraph"></i>
        </button>
        <button
          type="button"
          title="H1"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h1"></i>
        </button>
        <button
          type="button"
          title="H2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h2"></i>
        </button>
        <button
          type="button"
          title="H3"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h3"></i>
        </button>
        <button
          type="button"
          title="H4"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h4"></i>
        </button>
        <button
          type="button"
          title="H5"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h5"></i>
        </button>
        <button
          type="button"
          title="H6"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          <i class="bi bi-type-h6"></i>
        </button>
        <button
          type="button"
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <i class="bi bi-list-ul"></i>
        </button>
        <button
          type="button"
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <i class="bi bi-list-ol"></i>
        </button>
        {/* <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          code block
        </button> */}
        <button
          type="button"
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <i class="bi bi-quote"></i>
        </button>
        <button
          type="button"
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <i class="bi bi-hr"></i>
        </button>
        <button
          type="button"
          title="Hard Break"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <i class="bi bi-file-break"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <i class="bi bi-text-left"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          <i class="bi bi-text-center"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <i class="bi bi-text-right"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          <i class="bi bi-justify"></i>
        </button>
        <span className="setcolorcss">
          <input
            type="color"
            className="colorswatch"
            onInput={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
            value={editor.getAttributes("textStyle").color}
            data-testid="setColor"
          />
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetColor().run()}
            data-testid="unsetColor"
          >
            <i class="bi bi-palette-fill"></i>
          </button>
        </span>
      </>
    );
  };

  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Table.configure({ resizable: true }),
      Text,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor) {
      setDescription(editor.getHTML());
    }
  }, [editor]);

  
  return (
    <>
      <form className="circular-form">
        <div className="inner_form_new ">
          <label className="controlform">Name</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                value={exportForm.name}
              />
              <span className="sspan"></span>
            </label>
            {errors?.name ? (
              <span className="errormsg">
                {errors?.name}
              </span>
            ) : ""}
          </div>
        </div>
        {/* end form-bx  */}

        {/* <div className="inner_form_new ">
          <label className="controlform">Content</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="content"
                placeholder="Content"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                value={exportForm.content}
              />
              <span className="sspan"></span>
            </label>
            {errors?.content ? (
              <span className="errormsg">
                {errors?.content}
              </span>
            ) : ""}
          </div>
        </div> */}

        <div
          className="inner_form_new align-items-start mt-2"
        >
          <label className="controlform">Content</label>
          <div className="form-bx editorFieldBox">
            <div className="mt-2 py-1">
              <MenuBar editor={editor} />
              <EditorContent editor={editor} />

              <span className="sspan"></span>
              {/* {(errors.Description && Description == " ") ||
                Description == null ||
                Description == "<p></p>" ||
                !Description ? (
                <small
                  className="errormsg"
                  style={{ bottom: "-13px" }}
                >
                  {errors.Description}
                </small>
              ) : (
                ""
              )} */}
            </div>
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Bank</label>
          <div className="cccto position-relative">
            <div className="multiselect flex justify-content-center">
              {/* <MultiSelect
                value={exportForm.bankSelectValue}
                options={selectedBankOption}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                optionLabel="bankName"
                placeholder="Select Banks"
                name="bankSelectValue"
                panelFooterTemplate={panelFooterTemplate}
                display="chip"
                onShow={onShow}
              /> */}
              <CustomBankMultiSelect
                key="multyselectprinciple"
                options={vOption}
                onChange={(e) => handleChangeBank(e)}
                value={selectedBanks}
                isSelectAll={true}
                menuPlacement={"bottom"}
              />
              {errors?.selectedBanks ? (
                <span className="errormsg">
                  {errors?.selectedBanks}
                </span>
              ) : ""}
            </div>
          </div>
        </div>
        {/* end form-bx  */}
        <div className="inner_form_new ">
          <label className="controlform">Subject</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                value={exportForm.subject}
              />
              <span className="sspan"></span>
            </label>
            {errors?.subject ? (
              <span className="errormsg">
                {errors?.subject}
              </span>
            ) : ""}
          </div>
        </div>
        {/* end form-bx  */}

        <div className="inner_form_new ">
          <label className="controlform">Directives</label>
          <div className="cccto position-relative">
            <div className="multiselect flex justify-content-center">
              {/* <MultiSelect
                value={exportForm.directiveSelectValue}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                options={selectedDirectivesOpt}
                optionLabel="directiveName"
          
                name="directiveSelectValue"
                placeholder="Select Directives"
                display="chip"
              /> */}
              <DirectiveMultiSelectComponent
                key="multyselectprinciple"
                options={DirectiveOption}
                onChange={(e) => handleChangeDirective(e)}
                value={selectedDirectives}
                isSelectAll={true}
                menuPlacement={"bottom"}
              />
              {errors?.selectedDirectives ? (
                <small className="errormsg">{errors.selectedDirectives}</small>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {/* end form-bx  */}
        <div className="inner_form_new ">
          <label className="controlform">Select Department</label>
          <div className="form-bx">
            <label>
              <select
                ref={applicationTypeRef}
                name="departmentValue"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                className={
                  errors.departmentValue && exportForm.departmentValue === ""
                    ? "error"
                    : ""
                }
              >
                <option value="">Select Department</option>
                {department?.map((item, ind) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.menuName}
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
              {errors.departmentValue && exportForm.departmentValue === "" ? (
                <small className="errormsg">{errors.departmentValue}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>
        {/* end form-bx */}
        <div className="inner_form_new ">
          <label className="controlform">Releasing Date</label>
          <div className="form-bx">
            <DatePicker
              placeholderText="Select Releasing Date"
              closeOnScroll={(e) => e.target === document}
              selected={releasingDate}
              onChange={(date) => setReleasingDate(date)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              minDate={new Date()}
              dropdownMode="select"
              dateFormat="dd/MMMM/yyyy"
            />
            {
              errors?.releasingDate ? (
                <small className="errormsg">{errors.releasingDate}</small>
              ) : (" ")
            }
          </div>
        </div>
        {/* end form-bx  */}
        {/* <div className="inner_form_new ">
          <label className="controlform">Future Date</label>
          <div className="form-bx">
            <DatePicker
              placeholderText="Select Future Date"
              closeOnScroll={(e) => e.target === document}
              selected={futureDate}
              onChange={(date) => setFutureDate(date)}
              peekNextMonth
              showMonthDropdown
              minDate={new Date()}
              showYearDropdown
              dropdownMode="select"
              dateFormat="dd/MMMM/yyyy"
            />
          </div>
        </div> */}
        {/* end form-bx  */}
        <div className={roleID == 9 ? "d-none" : "inner_form_new align-items-center"
        }>
          <label className="controlform">Assign to
            {
              roleID == "5" ? " Analyst" : roleID == "6" ? " Principal Analyst" : roleID == "7" ? " Deputy Director" : " Director"
            }
          </label>
          <input
            type="checkbox"
            onChange={(e) => {
              handelAnalystCheck(e);

            }}
          />
        </div>


        {/* end form-bx  */}
        {checkAnalyst == true ?
          <div className="inner_form_new ">
            <label className="controlform"> {
              roleID == "5" ? " Analyst" : roleID == "6" ? " Principal Analyst" : roleID == "7" ? " Deputy Director" : " Director"
            }</label>

            <div className="form-bx">
              <label>
                <select
                  name="analyst"
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  value={exportForm.analyst}
                >
                  <option disabled value="">
                    {
                      roleID == "5" ? " Analyst" : roleID == "6" ? " Principal Analyst" : roleID == "7" ? " Deputy Director" : " Director"
                    }
                  </option>
                  {
                    analystUser?.map((item, index) => {
                      return (
                        <option value={item.userID} key={index}>
                          {item.name}
                        </option>
                      )
                    })
                  }
                </select>
                <span className="sspan"></span>
                {errors.analyst ? (<small className="errormsg" style={{ bottom: "-22px" }}>{errors.analyst}</small>) : (" ")}
              </label>
            </div>
          </div>
          : " "}
        {/* upload file start */}
        <div
          className={
            ((roleID == 8 && checkAnalyst == false) || (roleID == 9 && checkAnalyst == false))
              ? "inner_form_new align-items-center"
              : "d-none"
          }
        >
          <label className="controlform">Decision</label>
          <div className="row">
            <div className="col-md-12">
              <div className="hidden-toggles">
                <input
                  type="radio"
                  id="srcoloration-Approvedved4"
                  value="10"
                  onChange={(e) => {
                    ChangeApplicationStatus(e);
                    setCheckDecision(true)

                  }}
                  name="applicationstausdp"
                  className="hidden-toggles__input"
                  checked={
                    applicationstaus == "10" ? true : false
                  }
                />
                <label
                  for="srcoloration-Approvedved4"
                  className="hidden-toggles__label"
                >
                  Approved
                </label>



                <input
                  type="radio"
                  id="srcoloration-Cancelled"
                  onChange={(e) => {
                    ChangeApplicationStatus(e);
                    setCheckDecision(true)


                  }}
                  name="applicationstausdp"
                  value="25"
                  className="hidden-toggles__input"
                  checked={
                    applicationstaus == "25" ? true : false
                  }
                />
                <label
                  for="srcoloration-Cancelled"
                  className="hidden-toggles__label"
                >
                  Cancelled
                </label>
              </div>
            </div>
          </div>
        </div>
        <h5 className="section_top_subheading mt-3">Attachments</h5>

        {/* <div className="attachemt_form-bx" >
          <label>
            <i className="bi bi-forward"></i>
            File
          </label>
          <div className="browse-btn">
            Browse{" "}
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "File")}
            />
          </div>
          <span className="filename">
            {files.find((f) => f.name === files?.name)?.file?.name ||
              "No file chosen"}

          </span>

      
        </div> */}
        {
          circularAttachmentData?.map((items, index) => {
            return (
              <div className="attachemt_form-bx  mt-2" key={items.id}>
                <label
                  style={{
                    background: "#d9edf7",
                    padding: "9px 3px",
                    border: "0px",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>
                    {items.filename}
                  </span>
                </label>
                <div className="browse-btn">
                  Browse
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(e, `file ${(index + 1)}`)
                    }
                  />
                </div>
                <span className="filename">
                  {files?.find((f) => f.label === `file ${(index + 1)}`)
                    ?.file?.name || "No file chosen"}
                </span>

                {files?.length &&
                  files?.find((f) => f.label === `file ${(index + 1)}`)
                    ?.file?.name ? (
                  <button
                    type="button"
                    className="remove-file"
                    onClick={() =>
                      removeImage(index, `file ${(index + 1)}`)
                    }
                  >
                    Remove
                  </button>
                ) : (
                  ""
                )}
              </div>
            );
          })
        }

        {/* other file start */}
        {otherfiles.map((file, index) => (
          <div key={"other" + (index + 1)} className="attachemt_form-bx">
            <label>
              <i className="bi bi-forward"></i> Other File {index + 1}
            </label>
            <div className="browse-btn">
              Browse{" "}
              <input
                type="file"
                onChange={(e) => {
                  handleFileChange(e, "other" + (index + 1));
                  handleOthrefile(e, "other" + (index + 1));
                }}
              />
            </div>
            <span className="filename">
              {files.find((f) => f.label === "other" + (index + 1))?.file?.name ||
                "No file chosen"}
            </span>

            {files?.length &&
              files?.find((f) => f.label === "other" + (index + 1))?.file
                ?.name ? (
              <button
                type="button"
                className="remove-file"
                onClick={() => { removeUserImage("other" + (index + 1)); clearInputFileother(index) }}
              >
                Remove
              </button>
            ) : (
              ""
            )}

          </div>
        ))}
        {/* other file end */}
        <button
          type="button"
          className="addmore-btn"
          onClick={(e) => handleAddMore(e)}
        >
          {" "}
          Add More File{" "}
        </button>
        {/* upload file end */}
        <div className="form-footer mt-5 mb-3 justify-content-end">
          {/* <button
            type="reset"
            onClick={(e) => {
              ResetHandleData(e);
            }}
            className="register"
          >
            Reset
          </button> */}
          <button
            type="button"
            onClick={(e) => {
              HandleSubmit(e);
            }}
            className="login"
            disabled={((roleID > 5 && checkAnalyst == false && checkDecision == false)) || (toastDisplayed ? true : false) || (roleID > 5 && checkDecision == false && applicationstaus == "0")}
          >
            Submit
          </button>
        </div>
        {/* generate pdf code start */}
        <div className="login_inner" style={{ display: "none" }}>
          <div className="login_form_panel" style={{ display: "none" }}>
            <div
              ref={PdfPrivewsupervisorRef}
              className="p-5"
              style={{ position: "relative" }}
            >
              <table width="100%">
                <tr>
                  <td
                    style={{
                      marginBottom: "0px",
                      color: "#000",
                      fontSize: "18px",
                      fontWeight: "800",
                    }}
                  >
                    Reference Number
                  </td>
                  <td>
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "#000",
                        fontSize: "18px",
                        textAlign: "left",
                        fontWeight: "800",
                        letterSpacing: "0.01px",
                      }}
                    >
                      : {applicationDetail?.circularReferenceNumber}

                    </p>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">&nbsp;</td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "18px",
                      fontWeight: "600",
                      letterSpacing: "0.01px",
                    }}
                  >
                    {moment(
                      applicationDetail?.releasingDate
                    ).format("DD MMMM YYYY")}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">&nbsp;</td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "18px",
                      fontWeight: "600",
                      letterSpacing: "0.01px",
                    }}
                  >
                    Dear{" "}
                    {applicationDetail?.name}
                    ,
                  </td>
                </tr>

                <tr>
                  <td colSpan="2">
                    <table width="100%">
                      <tr>
                        <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                          }}
                        >
                          Name
                        </td>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "800",
                            letterSpacing: "0.01px",
                          }}
                        >
                          :{" "}
                          {exportForm.name}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            letterSpacing: "0.01px",
                          }}
                        >
                          Releasing Date
                        </td>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "800",
                            letterSpacing: "0.01px",
                          }}
                        >
                          :{" "}
                          {moment(
                            applicationDetail?.releasingDate
                          ).format("DD MMMM YYYY")}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                            letterSpacing: "0.01px",
                          }}
                        >
                          Subject
                        </td>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "800",
                          }}
                        >
                          :{" "}
                          <span
                            style={{
                              minWidth: "45px",
                              display: "inline-block",
                              paddingRight: "5px",
                              fontWeight: "800",
                            }}
                          >
                            {applicationDetail?.subject}
                          </span>

                        </td>
                      </tr>


                    </table>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">&nbsp;</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <table>
                      <tr>
                        <td colSpan="2">
                          <table width="100%">
                            <tr>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      fontWeight: "800",
                                      padding: "15px 0px 15px",
                                      letterSpacing: "0.01px",
                                    }}
                                  >
                                    Description
                                  </span>
                                </div>
                                <div
                                  className="tableEditorData"
                                  dangerouslySetInnerHTML={{
                                    __html: applicationDetail?.content
                                      ?
                                      applicationDetail?.content
                                      : "",
                                  }}

                                  style={{
                                    paddingBottom: "60px",
                                    letterSpacing: "0.01px",
                                  }}
                                />
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "400",
                          }}
                        >
                          <span
                            style={{
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              display: "inline-block",
                              letterSpacing: "0.01px",
                            }}
                          >
                            {" "}
                            Yours Sincerely,
                          </span>
                          <img
                            src={
                              applicationDetail?.getUserData?.filePath
                                ? applicationDetail?.getUserData.filePath
                                : NoSign
                            }
                            alt="Signature"
                            style={{
                              width: "120px",
                              height: "50px",
                              display: "block",
                              objectFit: "contain",
                            }}
                          />
                          <p
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "16px",
                              fontWeight: "400",
                              padding: "15px 0px 3px",
                              lineHeight: "13px",
                              letterSpacing: "0.01px",
                            }}
                          >
                            {PdfUsername
                              ? PdfUsername?.replace(/"/g, "")
                              : "N/A"}
                          </p>
                          <p
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "16px",
                              fontWeight: "400",
                              padding: "5px 0px",
                              lineHeight: "13px",
                              letterSpacing: "0.01px",
                            }}
                          >
                            {PdfRolename
                              ? PdfRolename?.replace(/"/g, "")
                              : "N/A"}
                          </p>

                          <div
                            style={{
                              marginBottom: "0px",
                              color: "#000",
                              fontSize: "18px",
                              fontWeight: "400",
                              padding: "25px 0px 5px",
                              lineHeight: "13px",
                              display: "flex",
                            }}
                          >
                            {
                              applicationDetail?.bankData?.length > 0 ? (
                                <>
                                  <p
                                    style={{
                                      marginBottom: "0px",
                                      fontSize: "18px",
                                      fontWeight: "400",
                                      paddingRight: "10px",
                                      letterSpacing: "0.01px",
                                    }}
                                  >
                                    TO:
                                  </p>
                                  <div>
                                    {applicationDetail?.bankData.map((item) => {
                                      return (
                                        <p
                                          style={{
                                            marginBottom: "3px",
                                            letterSpacing: "0.01px",
                                            fontSize: "18px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          {item.bankName}
                                        </p>
                                      );
                                    })}
                                  </div>
                                </>
                              ) : (
                                ""
                              )
                            }
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
           
            </div>
          </div>
        </div>
        {/* generate pdf coed end */}
      </form>

    </>
  );
};

export default ExportCircularsCreateForm;
