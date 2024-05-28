import React, { useEffect, useRef, useState } from "react";
import { Storage } from "../login/Storagesetting";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import { APIURL, ImageAPI } from "../constant";
import { toast } from "react-toastify";
import { MultiSelect } from 'primereact/multiselect';

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

/* Tiptp Editor Ends */

const ExportCircularsCreateForm = ({ handleFormClose, handleCircularListData }) => {

  // const purposeApplicationRef = useRef(null);
  const userID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const roleID = Storage.getItem("roleIDs");
  const bankidcheck = bankID !== "" ? "1" : "3";
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [errors, setErrors] = useState({});
  const [checkAnalyst, setAnalyst] = useState(false);
  const [selectedBankOption, setSelectedBankOption] = useState([]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [selectedDirectivesOpt, setSelectedDirectivesOpt] = useState(null);
  const [analystUser, setAnalystUser] = useState([]);
  const [files, setFiles] = useState([]);
  const [otherfiles, setOtherfiles] = useState([]);
  const [Description, setDescription] = useState("");
  const [releasingDate, setReleasingDate] = useState(new Date());
  const [exportForm, setExportForm] = useState({
    name: "",
    subject: "",
    content: "",
    circularReference: "",
    directiveSelectValue: [],
    bankSelectValue: [],
    analyst: "",
  });
  const [content, setEditorContent] = useState("<p></p>");
  const handelAnalystCheck = () => {
    setAnalyst(!checkAnalyst)
  }

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

  //---bank data start
  const bankData = async () => {
    await axios
      .post(APIURL + 'Master/GetMasterBank')
      .then((res) => {
        setSelectedBankOption(res.data.responseData)

      })
  }

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
    // if (Description.length == 7) {
    //   newErrors.Description = "Content is required";
    //   valid = false;
    // }

    if (exportForm.directiveSelectValue.length == '0') {
      newErrors.directiveSelectValue = "Directive is required";
      valid = false;
    } if (exportForm.bankSelectValue.length == '0') {
      newErrors.bankSelectValue = "Bank is required";
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
  const bankSelectedID = exportForm?.bankSelectValue.map((res) => res.id);
  const directiveSelectedID = exportForm?.directiveSelectValue.map((res) => res.directiveID);


  const HandleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();

    const data = {
      UserID: userID.replace(/"/g, ""),
      RoleID: checkAnalyst != true ? "0" : roleID,
      Name: exportForm.name,
      // BankID: '"'+bankSelectedID.join()+'"',
      BankID: bankSelectedID.join(),
      Subject: exportForm.subject,
      // Content: exportForm.content,
      Content: Description,
      DirectiveID: directiveSelectedID.join(),
      // Description: Description,
      AssignedTo: checkAnalyst ? exportForm.analyst : userID.replace(/"/g, ""),
      // AssignedToRoleID: checkAnalyst ? "6" : roleID,
      AssignedToRoleID: checkAnalyst ? parseInt(roleID) + 1 : checkAnalyst != true ? "0" : roleID,
      // FutureDate: futureDate,
      ReleasingDate: releasingDate,
      DepartmentID: "2"

    }


    if (validateForm()) {
      await axios
        .post(APIURL + "Circular/CreateCircular", data)
        .then((res) => {

          if (res.data.responseCode === '200') {
            for (let i = 0; i < files?.length; i++) { // Corrected loop condition
              formData.append("files", files[i].file);
              formData.append("Label", files[i].label);
            }
            formData.append("CircularReferenceNumber", res.data.responseData.circularReferenceNumber);
            formData.append("CircularID", res.data.responseData.id);
            formData.append("DepartmentID", "2");
            formData.append("UserID", userID.replace(/"/g, ""));
            axios.post(ImageAPI + 'File/UploadCircularDocs', formData)
              .then((res) => {

              })
              .catch((err) => {
                console.log("file Upload ", err)
              })
            toast.success(res.data.responseMessage, { autoClose: 2000 })
            setTimeout(() => {
              setToastDisplayed(false)
              handleFormClose();
              handleCircularListData();
              setExportForm({
                name: "",
                subject: "",
                content: "",
                circularReference: "",
                directiveSelectValue: [],
                bankSelectValue: [],
                analyst: "",
              })
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
          <div className="form-bx">
            <div className="multiselect flex justify-content-center">
              <MultiSelect
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
              />
              {errors?.bankSelectValue ? (
                <span className="errormsg">
                  {errors?.bankSelectValue}
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
          <div className="form-bx">
            <div className="multiselect flex justify-content-center">
              <MultiSelect
                value={exportForm.directiveSelectValue}
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                options={selectedDirectivesOpt}
                optionLabel="directiveName"
                // filter
                name="directiveSelectValue"
                placeholder="Select Directives"
                display="chip"
              // maxSelectedLabels={3}
              />
              {errors?.directiveSelectValue ? (
                <small className="errormsg">{errors.directiveSelectValue}</small>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {/* end form-bx  */}
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
        <div className="inner_form_new ">
          <label className="controlform">Assign to
            {
              roleID == "5" ? " Senior Analyst" : roleID == "6" ? " Principal Analyst" : roleID == "7" ? " Deputy Director" : " Director"
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
            <label className="controlform">Select  {
              roleID == "5" ? " Senior Analyst" : roleID == "6" ? " Principal Analyst" : roleID == "7" ? " Deputy Director" : " Director"
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
                  <option value="" selected>
                    Select  {
                      roleID == "5" ? " Senior Analyst" : roleID == "6" ? " Principal Analyst" : roleID == "7" ? " Deputy Director" : " Director"
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
        <h5 className="section_top_subheading mt-3">Attachments</h5>

        <div className="attachemt_form-bx" >
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


        </div>
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
            disabled={toastDisplayed ? true : false}
          >
            Submit
          </button>
        </div>

      </form>

    </>
  );
};

export default ExportCircularsCreateForm;
