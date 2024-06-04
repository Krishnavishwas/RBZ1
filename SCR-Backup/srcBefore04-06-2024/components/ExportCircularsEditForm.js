import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExportformDynamicField from "./ExportformDynamicField";
import { Storage } from "../login/Storagesetting";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { APIURL, ImageAPI } from "../constant";
import moment from "moment";
import { toast } from "react-toastify";
import Select from "react-select";
import UpdatePopupMessage from "./UpdatePopupMessage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import logo from "../rbz_LOGO.png";
import dummysign from "../dummy_sign.png";
import Modal from "react-bootstrap/Modal";
//import SunEditor from "suneditor-react";
//import "suneditor/dist/css/suneditor.min.css";
import NoSign from "../NoSign.png";
import { MultiSelect } from "primereact/multiselect";
import jsPDF from "jspdf";

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
import ExportCirculargenInfo from "./ExportCirculargenInfo";
// import MultiSelect from "react-multi-select-component";
import CustomBankMultiSelect from './SearchUI/CustomBankMultiSelect'
import DirectiveMultiSelectComponent from './SearchUI/DirectiveMultiSelectComponent'

const ExportCircularsEditForm = ({
  applicationDetail,
  setApplicationDetail,
  EditModalClose,
  handleData,
  allcomment,
  applicationstaus,
  setapplicationstaus,
  GetRoleHandle,
  userRole,
  asignUser,
  SupervisorRoleId,
  SupervisorNameID,
  supervisorHangechangeBankuser,
  supervisorHangechange,
  supervisorHangechangeRole,
  setAsignUser,
  AssignUserID,
  setAssignUserID,
  setSupervisorRoleId,
  setnextlevelvalue,
  nextlevelvalue,
  tatHistory,
  Actiondata,
  showdataLoader,
  noDataComment,
  responceCount,
  GetHandelDetail,
}) => {
  const ratevalue = applicationDetail?.rate;
  // console.log("applicationDetail",applicationDetail);
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


  const {
    companies,
    Supervisors,
    masterBank,

  } = ExportformDynamicField();

  const BPNCodeRef = useRef(null);
  const TINRef = useRef(null);
  const amountRef = useRef(null);
  const applicantRef = useRef(null);
  const BeneficiaryNameRef = useRef(null);
  const applicantCommentsRef = useRef(null);
  const applicantReferenceNumberRef = useRef(null);
  // const applicantYearRef = useRef(null);

  const applicationTypeRef = useRef(null);
  const assignedToRef = useRef(null);
  const companyNameRef = useRef(null);
  const currencyRef = useRef(null);
  const govtAgencieRef = useRef(null);
  const applicationPurposeRef = useRef(null);
  const relatedexchangeControlNumberRef = useRef(null);
  const sectorRef = useRef(null);
  const subsectorRef = useRef(null);
  const typeExporterRef = useRef(null);
  const rateRef = useRef(null);
  const usdEquivalentRef = useRef(null);
  const dateExpirydisplayRef = useRef(null);
  const optionExpirydisplayRef = useRef(null);
  const CoverigLetterRef = useRef(null);
  const FrequencyRef = useRef(null);
  const FrequencyDateRef = useRef(null);

  const UserID = Storage.getItem("userID");
  const bankID = Storage.getItem("bankID");
  const roleNamelocal = Storage.getItem("roleName");
  const bankName = Storage.getItem("bankName");
  const PdfUsername = Storage.getItem("name");
  const PdfRolename = Storage.getItem("roleName");
  const bankidcheck = bankID !== "" ? "1" : "3";
  const roleID = Storage.getItem("roleIDs");

  const userSign = Storage.getItem("signImageURL");

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState(null);
  const [checksectorchange, setchecksectorchange] = useState(false);

  const [adminDirectives, setAdminDirectives] = useState([]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [geninfoTab, setgeninfoTab] = useState(true);
  const [analystTab, setanalystTab] = useState(roleID == 5 ? true : false);
  const [sranalystTab, setsranalystTab] = useState(roleID == 6 ? true : false);
  const [principalanalystTab, setprincipalanalystTab] = useState(
    roleID == 7 ? true : false
  );
  const [deputyTab, setdeputyTab] = useState(roleID == 8 ? true : false);
  const [director, setdirector] = useState(roleID == 9 ? true : false);
  const [sharefiletab, setsharefiletab] = useState(false);

  const [recomdAnalyst, setRecomdAnalyst] = useState("121");
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedDirectives, setSelectedDirectives] = useState([]);
  const [registerusertype, setregisterusertype] = useState(
    applicationDetail?.userTypeID
  );
  const [supervisordecision, setsupervisordecision] = useState(false);

  const [files, setFiles] = useState([]);

  const [otherfiles, setOtherfiles] = useState([]);

  const [userfiles, setuserFiles] = useState([]);

  const [otheruserfiles, setOtheruserfiles] = useState([]);

  const [sharefile, setsharefile] = useState([]);
  const [othersharefile, setOthersharefile] = useState([]);


  const [releasingDate, setReleasingDate] = useState('');
  // const [releasingDate, setReleasingDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [applicationType, setapplicationType] = useState([]);
  const [subsectorData, setsubsectorData] = useState([]);
  const [checkSupervisor, setcheckSupervisor] = useState(false);
  const [attachmentData, setAttachmentData] = useState([
    { filename: "File Upload", upload: "" },
  ]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [value, setValue] = useState("Company Name");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [Description, setDescription] = useState("");
  const [updatepopup, setupdatepopup] = useState(false);

  const [ExpiringDate, setExpiringDate] = useState(new Date());
  const [asignnextLeveldata, setasignnextLeveldata] = useState({
    Notes: "",
    Comment: "",
  });
  const [DateExpiryOption, setDateExpiryOption] = useState("");
  const [defaultnoExpiry, setdefaultnoExpiry] = useState("0");

  const [IsReturnOption, setIsReturnOption] = useState("");
  const [AllFrequency, setAllFrequency] = useState([]);
  const [getFrequencyID, setGetFrequencyID] = useState("0");
  const [IsReturn, setIsReturn] = useState("0");
  const [IsReturndisplay, setIsReturndisplay] = useState("");
  const [IsReturnExpiringDate, setIsReturnExpiringDate] = useState(new Date());
  const [DateExpirydisplay, setDateExpirydisplay] = useState("");
  const [curRate, setCurrate] = useState();

  const [userRoleRecordofficer, setuserRoleRecordofficer] = useState([]);
  const [selectuserRoleRecordofficer, setselectuserRoleRecordofficer] =
    useState("");
  const [getalluser, setGetalluser] = useState([]);

  const [getBlankFile, setgetBlankFile] = useState([]);
  const [viewShareFile, setviewShareFile] = useState([]);
  const [geninfoFile, setgeninfoFile] = useState([]);
  const [newData, setnewData] = useState([]);
  const [SubmitBtnLoader, setSubmitBtnLoader] = useState(false);
  const [content, setEditorContent] = useState("<p></p>");
  const applicationNumber = applicationDetail.rbzReferenceNumber;
  const heading = "Updated Successfully!";
  const para = "Export request updated successfully!";

  const ChangeApplicationStatus = (e) => {
    const values = e.target.value;
    setapplicationstaus(values);
    // setAsignUser([]);
    // setAssignUserID("");
  };

  const handleUserRole = (e) => {
    const value = e.target.value;
    setSupervisorRoleId(value);
  };

  useEffect(() => {
    setEditorContent(applicationDetail?.content);
  }, [content]);

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
  // directives api call start
  const directiveDate = async () => {
    await axios
      .post(APIURL + 'Admin/GetAllDirectives')
      .then((res) => {
        if (res.data.responseCode === "200") {
          setAdminDirectives(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //directive api end
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
    if (editorAnalyst) {
      editorAnalyst.commands.setContent(applicationDetail?.content);
      setDescription(editorAnalyst.getHTML());
    }
  }, [applicationDetail]);

  const editorAnalyst = useEditor({
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
    content: applicationDetail?.content,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorSrAnalyst) {
      editorSrAnalyst.commands.setContent(
        applicationDetail?.content
      );
      setDescription(editorSrAnalyst.getHTML());
    }
  }, [applicationDetail]);

  const editorSrAnalyst = useEditor({
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
    content: applicationDetail?.content,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorDeputy) {
      editorDeputy.commands.setContent(applicationDetail?.content);
      setDescription(editorDeputy.getHTML());
    }
  }, [applicationDetail]);

  const editorDeputy = useEditor({
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
    content: applicationDetail?.content,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorPrincipleAnalyst) {
      editorPrincipleAnalyst.commands.setContent(
        applicationDetail?.content
      );
      setDescription(editorPrincipleAnalyst.getHTML());
    }
  }, [applicationDetail]);

  const editorPrincipleAnalyst = useEditor({
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
    content: applicationDetail?.content,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorDirector) {
      editorDirector.commands.setContent(applicationDetail?.content);
      setDescription(editorDirector.getHTML());
    }
  }, [applicationDetail]);

  const editorDirector = useEditor({
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
    content: applicationDetail?.content,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  const ChangeNextlevelHandle = (e) => {
    const value = e.target.value;
    setSupervisorRoleId("");
    setSupervisorRoleId("");

    setnextlevelvalue(value);
    setAsignUser([]);
  };

  useEffect(() => {
    if (editor) {
      setDescription(editor.getHTML());
    }

    if (editorAnalyst) {
      setDescription(editorAnalyst.getHTML());
    }

    if (editorSrAnalyst) {
      setDescription(editorSrAnalyst.getHTML());
    }

    if (editorPrincipleAnalyst) {
      setDescription(editorPrincipleAnalyst.getHTML());
    }

    if (editorDeputy) {
      setDescription(editorDeputy.getHTML());
    }

    if (editorDirector) {
      setDescription(editorDirector.getHTML());
    }
  }, [
    editor,
    editorAnalyst,
    editorSrAnalyst,
    editorPrincipleAnalyst,
    editorDeputy,
    editorDirector,
  ]);

  useEffect(() => {
    if (applicationDetail?.applicationTypeID) {
      axios
        .post(APIURL + "Master/GetAttachmentData", {
          ApplicationTypeID: applicationDetail?.applicationTypeID,
          ApplicationSubTypeID: "0",
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setgetBlankFile(res.data.responseData);
          } else {
            setgetBlankFile([]);
            // setFiles([]);
            // setOtherfiles([]);
            // setOtherfilesupload([]);
          }
        });
    }
  }, [applicationDetail]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6] }],
      [{ font: [] }],
      [{ size: ["small", "large", "huge"] }],
      [{ color: [] }],
      [{ background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["bold", "italic", "underline"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "+1" },
        { indent: "-1" },
      ],
    ],
  };

  const GetApplicationTypes = async () => {
    await axios
      .post(APIURL + "Master/GetApplicationTypesByDepartmentID", {
        DepartmentID: "1",
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setapplicationType(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    GetApplicationTypes();
    if (applicationDetail?.subSector) {
      axios
        .post(APIURL + "Master/GetSubSectorBySectorID", {
          SectorID: parseInt(applicationDetail.sector),
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setsubsectorData(res.data.responseData);
          } else {
            setsubsectorData([]);
            console.log(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [applicationDetail.sector]);

  useEffect(() => {
    setIsReturn(
      applicationDetail?.isReturnNeeded
        ? `${applicationDetail?.isReturnNeeded}`
        : "0"
    );
    setIsReturnOption(
      applicationDetail?.isReturnNeeded
        ? `${applicationDetail?.isReturnNeeded}`
        : "0"
    );
    setGetFrequencyID(
      applicationDetail?.returnFrequencyType
        ? `${applicationDetail?.returnFrequencyType}`
        : "0"
    );
    setIsReturnExpiringDate(
      applicationDetail?.returnDate ? applicationDetail?.returnDate : new Date()
    );
    setdefaultnoExpiry(applicationDetail?.expiringDate ? "1" : "0");
    setDateExpiryOption(applicationDetail?.expiringDate ? "1" : "0");
    setDateExpirydisplay(applicationDetail?.expiringDate ? "0" : "1");

    // setsharefile(applicationDetail?.sharedFiles)

    const bankSdata = applicationDetail?.bankData?.map((items, i) => {
      return {
        label: items.bankName,
        value: items.id,
      };
    });
    setSelectedBanks(bankSdata);
    const directiveSData = applicationDetail?.directiveData?.map((item, i) => {
      return {
        label: item.directiveName,
        value: item.id
      }
    })
    setSelectedDirectives(directiveSData);
    setExpiringDate(
      applicationDetail?.expiringDate
        ? applicationDetail?.expiringDate
        : new Date()
    );





    // setSelectedBanks(bankdtata);

    if (applicationDetail?.isReturnNeeded == 1) {
      axios
        .post(APIURL + "Master/GetAllFrequencies")
        .then((res) => {
          if (res.data.responseCode == 200) {
            setAllFrequency(res.data.responseData);
          } else {
            setAllFrequency([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [applicationDetail]);

  const formatecopyresponse = selectedBanks?.map((item) => {
    return item.code;
  });

  const copyresponse = selectedBanks?.map((res) => ({
    ApplicationID: applicationDetail?.id,
    BankID: res?.code,
    CopyingResponse: 1,
    CopiedResponse: formatecopyresponse?.join(),
  }));

  const changeHandelForm = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    let newErrors = {};
    let valid = true;

    if (name == "applicationPurpose" && value.charAt(0) === " ") {
      newErrors.applicationPurpose = "First character cannot be a blank space";
      valid = false;
    }
    //  else if (name == "applicationPurpose" && specialChars.test(value.charAt(0))) {
    //   newErrors.applicationPurpose = "Special characters not allowed";
    //   valid = false;
    // }
    else if (name == "applicant" && value.charAt(0) === " ") {
      newErrors.applicant = "First character cannot be a blank space";
      valid = false;
    } else if (name == "applicant" && specialChars.test(value)) {
      newErrors.applicant = "Special characters not allowed";
      valid = false;
    } else if (name == "applicantComment" && value.charAt(0) === " ") {
      newErrors.applicantComment = "First character cannot be a blank space";
      valid = false;
    } else if (name == "beneficiaryName" && value.charAt(0) === " ") {
      newErrors.beneficiaryName = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "beneficiaryName" &&
      (specialChars.test(value) ||
        /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value.charAt(0)))
    ) {
      newErrors.beneficiaryName = "Special characters not allowed";
      valid = false;
    } else if (name == "tinNumber" && value.charAt(0) === " ") {
      newErrors.tinNumber = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "tinNumber" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("]"))
    ) {
      newErrors.tinNumber = "Special characters not allowed";
      valid = false;
    } else if (name == "bpnCode" && value.charAt(0) === " ") {
      newErrors.bpnCode = "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "bpnCode" &&
      (specialChars.test(value) ||
        value?.includes("_") ||
        value?.includes("+") ||
        value?.includes("=") ||
        value?.includes("'") ||
        value?.includes(";") ||
        value?.includes("[") ||
        value?.includes("]") ||
        value?.includes("]"))
    ) {
      newErrors.bpnCode = "Special characters not allowed";
      valid = false;
    } else if (
      name == "applicantReferenceNumber" &&
      (value.charAt(0) === " " || value.charAt(0) == "/")
    ) {
      newErrors.applicantReferenceNumber =
        "First character cannot be a blank space or / ";
      valid = false;
    } else if (
      name == "applicantReferenceNumber" &&
      /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)
    ) {
      newErrors.applicantReferenceNumber = "Special characters not allowed";
      valid = false;
    } else if (
      name == "relatedexchangeControlNumber" &&
      value.charAt(0) === " "
    ) {
      newErrors.relatedexchangeControlNumber =
        "First character cannot be a blank space";
      valid = false;
    } else if (
      name == "relatedexchangeControlNumber" &&
      specialChars.test(value)
    ) {
      newErrors.relatedexchangeControlNumber = "Special characters not allowed";
      valid = false;
    } else {
      setErrors({});
      setApplicationDetail((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    setErrors(newErrors);

  };

  const HandleDateExpiryOption = (e) => {
    const { name, value } = e.target;
    setDateExpiryOption(e.target.value);
    setdefaultnoExpiry(value);

    if (value == 0) {
      setDateExpirydisplay("");
      if (dateExpirydisplayRef.current) dateExpirydisplayRef.current.value = "";
      if (optionExpirydisplayRef.current) optionExpirydisplayRef.current = "";
    }
  };

  const HandleIsReturnOption = (e) => {
    const { name, value } = e.target;
    setIsReturnOption(e.target.value);
    setIsReturn(value);

    if (value == 0) {
      setIsReturndisplay("");
      setIsReturnExpiringDate(new Date());
      setGetFrequencyID("");
      if (FrequencyRef.current) FrequencyRef.current.value = "";
      if (FrequencyDateRef.current) FrequencyDateRef.current = "";
    } else {
      axios
        .post(APIURL + "Master/GetAllFrequencies")
        .then((res) => {
          if (res.data.responseCode == 200) {
            setAllFrequency(res.data.responseData);
          } else {
            setAllFrequency([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const SelectReturnFrequency = (e) => {
    const { name, value } = e.target;

    if (value == 1) {
      setGetFrequencyID(value);
      setIsReturnExpiringDate(new Date());
    } else {
      setGetFrequencyID(value);
      setIsReturnExpiringDate(new Date());
    }
  };

  const handleshareFileChange = (e, id) => {
    const file = e.target.files[0];
    const index = userfiles?.findIndex((item) => item.id === id);
    if (index !== -1) {
      setsharefile((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, id };
        return newFiles;
      });
    } else {
      setsharefile((prevFiles) => [...prevFiles, { file, id }]);
    }
  };

  const handlesharefileAddMore = (e) => {
    setOthersharefile([...othersharefile, null]);
  };

  const removeshareImage = (index, id) => {
    const updatedShareFile = sharefile?.filter((item) => item.id !== id);
    setsharefile(updatedShareFile);
  };

  const removeUserImage = (index, id) => {
    const updatedUserFile = userfiles?.filter((item) => item.id !== id);
    setuserFiles(updatedUserFile);
  };

  const removefileImage = (label) => {
    const updatedUserFile = files?.filter((item, i) => item?.label != label);
    setFiles(updatedUserFile);
  };

  const [blobdata, setblobdata] = useState(null);

  /* PDF Preview code starts */
  const GetHandelDetailPDF = async () => {
    setBtnLoader(true);
    setTimeout(() => {
      const doc = new jsPDF({
        format: "a4",
        unit: "pt",
      });

      axios
        .post(APIURL + "Admin/GetBankByID", {
          id: applicationDetail?.bankID,
        })
        .then((response) => {
          if (response.data.responseCode === "200") {
            if (
              response.data.responseData?.headerFooterData["0"]?.fileType ==
              "HeaderFile"
            ) {
              var headerImage =
                response.data.responseData.headerFooterData["0"].filePath;
              var headerImagewidth =
                response.data.responseData.headerFooterData["0"].imageWidth;
            } else {
              var headerImage = "";
            }
            if (
              response.data.responseData?.headerFooterData["1"]?.fileType ==
              "FooterFile"
            ) {
              var footerImage =
                response.data.responseData.headerFooterData["1"].filePath;
              var footerImagewidth =
                response.data.responseData.headerFooterData["1"].imageWidth;
            } else {
              var footerImage = "";
            }

            const addHeader = (doc) => {
              if (roleID != 3) {
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
              } else {
                if (headerImage != "") {
                  const pageCount = doc.internal.getNumberOfPages();
                  var pagewidth = doc.internal.pageSize.width;
                  if (pagewidth > headerImagewidth) {
                    var diff = parseInt(pagewidth) - parseInt(headerImagewidth);
                    var positionLeft = parseInt(diff / 2);
                  } else {
                    var positionLeft = 250;
                  }

                  for (var i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.addImage(
                      headerImage,
                      "png",
                      positionLeft,
                      10,
                      80,
                      80,
                      "Header",
                      "NONE",
                      0
                    );
                  }
                } else {
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(20);
                  doc.text("Final Letter", 250, 40);
                }
              }
            };

            const addWaterMark = (doc) => {
              const pageCount = doc.internal.getNumberOfPages();
              for (var i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setTextColor("#cccaca");
                doc.saveGraphicsState();
                doc.setGState(new doc.GState({ opacity: 0.4 }));
                doc.setFont("helvetica", "normal");
                doc.setFontSize(80);
                //doc.text("PREVIEW", 50, 150, {align: 'center', baseline: 'middle'})
                doc.text(
                  doc.internal.pageSize.width / 3,
                  doc.internal.pageSize.height / 2,
                  "Preview",
                  { angle: 45 }
                );
                doc.restoreGraphicsState();
              }
            };
            doc.setFont("helvetica", "normal");
            doc.setFontSize(3);
            let docWidth = doc.internal.pageSize.getWidth();
            const refpdfview =
              roleID == 3 && nextlevelvalue == 10
                ? PdfPrivewsupervisorRef
                : roleID == 3 && nextlevelvalue == ""
                  ? CoverigLetterRef
                  : PdfPrivewRef;
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
                addWaterMark(doc);
                doc.setProperties({
                  title: `${applicationDetail?.rbzReferenceNumber}`,
                });
                var blob = doc.output("blob");
                window.open(URL.createObjectURL(blob), "_blank");
              },
            });
            setBtnLoader(false);
          } else {
            var headerImage = "";
            var footerImage = "";
          }
        });
    }, 1500);
  };
  /* Ends Here */

  const HandleNextleveldata = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    const specialCharsnote = /[!@#$%^*|<>]/;
    let newErrors = {};
    let valid = true;

    if (name == "Notes" && value.charAt(0) === " ") {
      newErrors.Notes = "First character cannot be a blank space";
      valid = false;
    } else if (name == "Comment" && value.charAt(0) === " ") {
      newErrors.Comment = "First character cannot be a blank space";
      valid = false;
    } else {
      setErrors({});
      setasignnextLeveldata((pre) => ({
        ...pre,
        [name]: value,
      }));
    }
    setErrors(newErrors);
  };

  const getRoleHandle = async () => {
    await axios
      .post(APIURL + "Master/GetRoles", {
        RoleID: "4",
        Status: "35",
      })
      .then((res) => {
        if (res.data.responseCode == 200) {
          setuserRoleRecordofficer(res.data.responseData);
        } else {
          setuserRoleRecordofficer([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const supervisorHangechangeRoleRecordofficer = (e) => {
    const value = e.target.value;
    setErrors({});
    setselectuserRoleRecordofficer(value);
    setAssignUserID("");
    setSupervisorRoleId("");
    if (value == "") {
      setGetalluser([]);
    } else {
      axios
        .post(APIURL + "User/GetUsersByRoleID", {
          RoleID: value,
          DepartmentID: "1",
          UserID: UserID.replace(/"/g, ""),
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setGetalluser(res.data.responseData);
          } else {
            setGetalluser([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleuserByrecordOfficer = (e) => {
    const value = e.target.value;

    if (value == "") {
      setAssignUserID("");
      setSupervisorRoleId("");
    } else {
      setAssignUserID(value);
      setSupervisorRoleId(selectuserRoleRecordofficer);
      setErrors({});
    }
  };

  useEffect(() => {
    getRoleHandle();
  }, []);

  const convertedRate =
    parseFloat(curRate ? curRate : ratevalue) *
    parseFloat(applicationDetail?.amount);

  const handleuserAddMore = (e) => {
    setOtheruserfiles([...otheruserfiles, null]);
  };

  const handleFileChange = (e, label) => {
    const file = e.target.files[0];
    const index = files?.findIndex((item) => item.label === label);
    if (index !== -1) {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, label };
        return newFiles;
      });
    } else {
      setFiles((prevFiles) => [...prevFiles, { file, label }]);
    }
  };

  const HandleFileUpload = (e, label, indx) => {
    const file = e.target.files[0];
    const index = files?.findIndex((item, i) => i === indx);
    if (index !== -1) {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, label };
        return newFiles;
      });
    } else {
      setFiles((prevFiles) => [...prevFiles, { file, label }]);
    }
  };

  const handleuserFileChange = (e, id) => {
    const file = e.target.files[0];
    const index = userfiles?.findIndex((item) => item.id === id);
    if (index !== -1) {
      setuserFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = { file, id };
        return newFiles;
      });
    } else {
      setuserFiles((prevFiles) => [...prevFiles, { file, id }]);
    }
  };

  const handleOthrefile = (e, id) => {
    const otherfile = e.target.files[0];
    setOtherfilesupload([...otherfilesupload, { otherfile, id }]);
  };

  const handleAddMore = (e) => {
    setOtherfiles([...otherfiles, null]);
  };

  const handleFIleview = () => {
    axios
      .post(APIURL + "ExportApplication/GetSharedFileData", {
        ID: applicationDetail.id,
      })
      .then((res) => {
        if (res.data.responseCode == "200") {
          setviewShareFile(res.data.responseData);
        } else {
          setviewShareFile([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post(APIURL + "ExportApplication/GetFilesByApplicationID", {
        ID: applicationDetail.id,
      })
      .then((res) => {
        if (res.data.responseCode == "200") {
          setgeninfoFile(res.data.responseData);
        } else {
          setgeninfoFile([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    handleFIleview();
  }, [applicationDetail]);

  const HandelSupervisorcheck = () => {
    setcheckSupervisor(!checkSupervisor);
    //Temporary Solution  later we will pass 0
    // if (roleID == 3 && checkSupervisor == true) {
    //   setAssignUserID("0");
    // } else if (roleID == 3 && checkSupervisor == false) {
    //   setAssignUserID("");
    // }
    // setAssignUserID("");
    // setSupervisorRoleId("");
    // setselectuserRoleRecordofficer("");
  };

  const getNextvaluesupervisor = (e) => {
    const value = e.target.checked;

    if (value == false) {
      setnextlevelvalue("");
    }
    setapplicationstaus("");
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (applicationDetail.applicationPurpose === "") {
      newErrors.applicationPurpose = "Purpose of the application is required";
      valid = false;
    }

    if (applicationDetail.name === "") {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (applicationDetail.subject === "") {
      newErrors.subject = "Subject is required";
      valid = false;
    }
    if (applicationDetail.content === "") {
      newErrors.content = "Content is required";
      valid = false;
    }
    if (
      AssignUserID == "" &&
      (nextlevelvalue == "10") &&
      roleID == 6 &&
      checkSupervisor == true
    ) {
      newErrors.assignUserID = "User is required";
      valid = false;
    }
    if (
      AssignUserID == "" &&
      (nextlevelvalue == "10") &&
      roleID == 7 &&
      checkSupervisor == true
    ) {
      newErrors.assignUserID = "User is required";
      valid = false;
    }
    // if (
    //   SupervisorRoleId == "" &&
    //   ( nextlevelvalue == "15") &&
    //   roleID == 6 &&
    //   checkSupervisor == true
    // ) {
    //   newErrors.SupervisorRoleId = "User is required";
    //   valid = false;
    // }
    // if (applicationDetail.directiveData.length == '0') {
    //   newErrors.directiveData = "Directive is required";
    //   valid = false;
    // } if (applicationDetail.bankData.length == '0') {
    //   newErrors.bankData = "Bank is required";
    //   valid = false;
    // }
    if (releasingDate == null) {
      newErrors.releasingDate = "Releasing date is required";
      valid = false;
    }
    if (releasingDate == null) {
      newErrors.releasingDate = "Releasing date is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };


  const onShow = () => {
    setTimeout(() => {
      let selectAllCheckbox = document.querySelector(
        ".p-multiselect-header > .p-multiselect-select-all"
      );
      if (selectAllCheckbox) {
        // Create a new span element
        let selectAllSpan = document.createElement("span");
        selectAllSpan.className = "select_all";
        selectAllSpan.textContent = "Select All";

        // Append the span after the select all checkbox
        selectAllCheckbox.after(selectAllSpan);
      }
    }, 0);
  };

  const filtertin_bpn = companies?.find((company) => {
    if (company.id === getCompanyName?.value) {
      return {
        getbpn: company.bpnNumber,
        gettin: company.tinNumber,
      };
    }
  });

  // const vOption = masterBank?.map((res) => ({
  //   name: res.bankName,
  //   code: res.id,
  // }));

  const vOption = masterBank?.map((res) => ({
    label: res.bankName,
    value: res.id,
  }));

  const handleChangeBank = (e) => {
    const values = e;
    setSelectedBanks(values);
  };
  const DirectiveOption = adminDirectives?.map((res) => ({
    label: res.directiveName,
    value: res.id,
  }));

  const handleChangeDirective = (e) => {
    const values = e;
    setSelectedDirectives(values);
  };
  const PdftargetRef = useRef();
  const PdfPrivewRef = useRef();
  const PdfPrivewsupervisorRef = useRef();

  const closePopupHandle = () => {
    navigate("/BankADLADashboard");
    EditModalClose();
    handleData();
    setupdatepopup(false);
    setApplicationDetail({});

    setSupervisorRoleId("");

    setAssignUserID("");
    setselectuserRoleRecordofficer("");
    if (BPNCodeRef.current) BPNCodeRef.current.value = "";
    if (TINRef.current) TINRef.current.value = "";
    if (amountRef.current) amountRef.current.value = "";
    if (applicantRef.current) applicantRef.current.value = "";
    if (applicantCommentsRef.current) applicantCommentsRef.current.value = "";
    if (BeneficiaryNameRef.current) BeneficiaryNameRef.current.value = "";
    if (applicantReferenceNumberRef.current)
      applicantReferenceNumberRef.current.value = "";
    // if(applicantYearRef.current) applicantYearRef.current.value = '';
    if (applicationTypeRef.current) applicationTypeRef.current.value = "";
    if (assignedToRef.current) assignedToRef.current.value = "";
    if (companyNameRef.current) companyNameRef.current.value = "";
    if (currencyRef.current) currencyRef.current.value = "";
    if (govtAgencieRef.current) govtAgencieRef.current.value = "";

    if (applicationPurposeRef.current) applicationPurposeRef.current.value = "";
    if (relatedexchangeControlNumberRef.current)
      relatedexchangeControlNumberRef.current.value = "";
    if (sectorRef.current) sectorRef.current.value = "";
    if (subsectorRef.current) subsectorRef.current.value = "";

    if (typeExporterRef.current) typeExporterRef.current.value = "";
    if (usdEquivalentRef.current) usdEquivalentRef.current.value = "";

    if (rateRef.current) rateRef.current.value = "";

    if (FrequencyDateRef.current) FrequencyDateRef.current.value = "";
    if (FrequencyRef.current) FrequencyRef.current.value = "";
  };

  // select BankiId & Directived Id start 

  const bankSelectedID = selectedBanks?.map((res) => res.value);
  const directiveSelectedID = selectedDirectives?.map((res) => res.value);
  // select BankiId & Directived Id end

  // Code start for save form
  const HandleSubmit = async (e) => {
    // setSubmitBtnLoader(true);
    let formData = new FormData();
    e.preventDefault();
    if (validateForm()) {
      setSubmitBtnLoader(true);
      await axios
        .post(APIURL + "Circular/UpdateCircular", {
          ID: applicationDetail?.id,
          UserID: UserID.replace(/"/g, ""),
          RoleID: roleID,
          Name: applicationDetail?.name,
          Subject: applicationDetail.subject,
          // Description: Description,
          // Content: applicationDetail.content,
          Content: Description,
          ReleasingDate: releasingDate,
          BankID: bankSelectedID?.join(),
          DirectiveID: directiveSelectedID?.join(),
          AssignedTo: (AssignUserID == "" || AssignUserID == null) &&
            roleID != 5 &&
            roleID != 4
            ? ""
            : AssignUserID ? AssignUserID
              : UserID.replace(/"/g, ""),
          // AssignedToRoleID: SupervisorRoleId ? SupervisorRoleId : roleID,
          AssignedToRoleID: (AssignUserID == "" || AssignUserID == null) &&
            roleID != 5 &&
            roleID != 4
            ? "0"
            : SupervisorRoleId
              ? SupervisorRoleId
              : AssignUserID && SupervisorRoleId == "" && nextlevelvalue != "20"
                ? parseInt(roleID) + 1
                : roleID,
          CircularStatus:
            roleID == 8
              ? applicationstaus
              : nextlevelvalue == "" && roleID != 8
                ? applicationstaus
                : applicationDetail?.analystRecommendation,
          // ActionStatus: nextlevelvalue,
          ActionStatus:
            (AssignUserID == "" || AssignUserID == null) &&
              roleID != 5 &&
              roleID != 4
              ? "100"
              : nextlevelvalue,
          Comment: asignnextLeveldata.Comment,
          Notes: asignnextLeveldata.Notes,
          // AssignedToRoleID: SupervisorRoleId,

        })
        .then((res) => {
          if (res.data.responseCode === '200') {

            const fileupload = userfiles.length > 0 ? userfiles : files;
            for (let i = 0; i < fileupload?.length; i++) { // Corrected loop condition
              formData.append("files", fileupload[i].file);
              formData.append("Label", fileupload[i].id);
            }
            formData.append("CircularID", res.data.responseData.id);
            formData.append("circularActivityID", res.data.responseData.circularActivityID);
            formData.append("DepartmentID", "2");
            formData.append("UserID", UserID.replace(/"/g, ""));
            axios.post(ImageAPI + 'File/UploadCircularDocs', formData)
              .then((res) => {

              })
              .catch((err) => {
                console.log("file Upload ", err)
              })
            toast.success(res.data.responseMessage, { autoClose: 2000 })
            setTimeout(() => {
              EditModalClose();
              handleData();
              setToastDisplayed(false);
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
        toast.warning("Please fill all mandatory fields");
      }
      setToastDisplayed(true);
      // setSubmitBtnLoader(false);
    }
  };
  // End code for save form


  useEffect(() => {
    handleData();
    directiveDate();
  }, []);

  const handleChangecompany = (selectedOption) => {
    setgetCompanyName(selectedOption);
  };

  const handleInputChangecompany = (input) => {
    setInputValue(input);
    if (input?.length >= 3) {
      // Filter options when input length is at least 3 characters
      const filteredOptions = companies
        ?.filter((company) =>
          company?.companyName?.toLowerCase().includes(input.toLowerCase())
        )
        ?.map((company) => ({
          value: company?.id,
          label: company?.companyName,
        }));
      setOptions(filteredOptions?.length > 0 ? filteredOptions : []);
    } else {
      // Reset options when input length is less than 3 characters
      setOptions([]);
    }
  };

  const handleClear = () => {
    setValue(null);
    setInputValue("");
    setOptions([]);
  };

  useEffect(() => {
    if (toastDisplayed) {
      setTimeout(() => {
        setToastDisplayed(false);
      }, 1500);
    }
  }, [toastDisplayed]);

  const CCValue = applicationDetail?.copiedResponses?.length
    ? applicationDetail?.copiedResponses?.map((v, i) => (
      <li key={i}>{v.bankName}</li>
    ))
    : null;



  // const finalArray = getBlankFile?.map((blankFile) => {
  //   const attachedFile = applicationDetail?.attachedFiles?.find(
  //     (file) => file.label === blankFile.name
  //   );
  //   if (attachedFile) {
  //     return {
  //       ...attachedFile,
  //       ...blankFile,
  //     };
  //   } else {
  //     return blankFile;
  //   }
  // });

  // Combine attachedFiles and getBlankFile arrays

  //   const finalArray = applicationDetail?.attachedFiles?.map(attachedFile => {
  //     const matchingFile = getBlankFile?.find(blankFile => blankFile.name == attachedFile.label);

  //     if (matchingFile) {
  //         // Combine properties from both objects
  //         return { ...matchingFile, ...attachedFile };
  //     } else {
  //         // If there's no matching file, return the attachedFile as is
  //         return attachedFile;
  //     }
  // });

  // const labelSet = new Set(getBlankFile?.map((item) => item.name));
  // geninfoFile?.forEach((item) => labelSet.add(item.label));

  // Create the finalArray by merging attachedFiles and getBlankFile based on the labelSet

  useEffect(() => {
    let newData1 = getBlankFile?.filter((blankFile) => {
      return !geninfoFile?.some(
        (infoFile) => infoFile.label === blankFile.name
      );
    });
    setnewData(newData1);
    // setFiles(geninfoFile);
  }, [applicationDetail, geninfoFile, allcomment]);

  const handleRemovfile = (id) => {
    axios
      .post(APIURL + "File/DeleteFile", {
        ID: id,
      })
      .then((res) => {
        handleFIleview();
      })
      .catch((error) => {
        console.log("FileRemove Error", error);
      });
  };


  console.log("releasingDate", releasingDate);

  return (
    <>
      {/* <h3 className="export-pop-heading">
        {applicationDetail?.rbzReferenceNumber
          ? applicationDetail.rbzReferenceNumber
          : ""}
      </h3> */}

      {
        // (!tatHistory?.length && roleID != 2 || roleID != 3 ) ||
        showdataLoader == true ? (
          <label className="outerloader2">
            {" "}
            <span className="loader"></span>
            <span className="loaderwait">Please Wait...</span>
          </label>
        ) : (
          <>
            <h5
              className={
                geninfoTab
                  ? "section_top_subheading mt-0 py-3 btn-collapse_active cursorpointer"
                  : "section_top_subheading mt-0 py-3 cursorpointer"
              }
              onClick={() => setgeninfoTab(!geninfoTab)}
            >
              Circular Info{" "}
              <span className="btn-collapse">
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>

            <form className="circular-form">
              <div className={geninfoTab ? "customtab" : "d-none"}>

                <div className="tab-content pt-2">
                  <div
                    className={
                      roleID
                        ? "tab-pane fade show active"
                        : "tab-pane fade show"
                    }
                    id="analyst-justified-home"
                    role="tabpanel"
                    aria-labelledby="analyst"
                  >

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
                            // value={exportForm.name}
                            value={applicationDetail.name}
                            disabled={applicationDetail?.userID !== UserID.replace(/"/g, "") ? true : false}
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


                    <div
                      className={
                        roleID
                          ? "inner_form_new align-items-start mt-2"
                          : "d-none"
                      }

                    >
                      <label className="controlform">Content</label>
                      <div className="form-bx editorFieldBox" >
                        {applicationDetail?.userID == UserID.replace(/"/g, "") ?
                          <div className="mt-2 py-1">
                            <MenuBar editor={editorAnalyst} />
                            <EditorContent editor={editorAnalyst} />

                            <span className="sspan"></span>
                            {(errors.Description && Description == " ") ||
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
                            )}
                          </div>
                          : <div className="form-bx">
                              <p className="showData mt-2 py-1" dangerouslySetInnerHTML={applicationDetail?.content ? { __html: applicationDetail.content } : { __html: "-" }}></p>
                          </div>}
                      </div>
                    </div>
                    {/* end form-bx  */}

                    {attachmentData?.map((items, index) => {
                      return (
                        <div
                          className="attachemt_form-bx  mt-2"
                          key={items.id}
                        >
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
                                handleuserFileChange(e, "circular" + (index + 1))
                              }
                              disabled={applicationDetail?.userID !== UserID.replace(/"/g, "") ? true : false}
                            />
                          </div>
                          <span className="filename">
                            {userfiles?.find(
                              (f) => f.id === "circular" + (index + 1)
                            )?.file?.name || "No file chosen"}
                          </span>
                          {userfiles?.length &&
                            userfiles?.find((f) => f.id === "circular" + (index + 1))
                              ?.file?.name ? (
                            <button
                              type="button"
                              className="remove-file"
                              onClick={() =>
                                removeUserImage(index, "circular" + (index + 1))
                              }
                            >
                              Remove
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}

                    {otheruserfiles.map((file, index) => (
                      <div
                        key={"other" + (index + 1)}
                        className="attachemt_form-bx"
                      >
                        <label
                          style={{
                            background: "#d9edf7",
                            padding: "9px 3px",
                            border: "0px",
                          }}
                        >
                          <b>
                            Other File
                            {index + 1}
                          </b>
                        </label>
                        <div className="browse-btn">
                          Browse{" "}
                          <input
                            type="file"
                            onChange={(e) => {
                              handleuserFileChange(e, "other" + index);
                              handleOthrefile(e, `other ${index}`);
                            }}
                          />
                        </div>
                        <span className="filename">
                          {userfiles?.find((f) => f.id === "other" + index)
                            ?.file?.name || "No file chosen"}
                        </span>

                        {userfiles?.length &&
                          userfiles?.find((f) => f.id === "other" + index)
                            ?.file?.name ? (
                          <button
                            type="button"
                            className="remove-file"
                            onClick={() =>
                              removeUserImage(index, "other" + index)
                            }
                          >
                            Remove
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}

                    {otheruserfiles?.length || userfiles?.length ? (
                      <div className="attachemt_form-bx">
                        <label style={{ border: "0px" }}>{""}</label>
                        <button
                          type="button"
                          className="addmore-btn mt-0"
                          onClick={(e) => handleuserAddMore(e)}
                        >
                          {" "}
                          Add More File{" "}
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="inner_form_new">
                      <label className="controlform">Bank</label>
                      <div className="cccto">
                        <div className="multiselect flex justify-content-center">
                          {/* <MultiSelect
                            value={selectedBanks}
                            onChange={(e) => setSelectedBanks(e.value)}
                            options={vOption}
                            optionLabel="name"
                            onShow={onShow}
                            placeholder="Select Banks"
                            display="chip"
                            disabled={applicationDetail?.userID !== UserID.replace(/"/g, "") ? true : false}
                          /> */}
                          <CustomBankMultiSelect
                            key="multyselectprinciple"
                            options={vOption}
                            onChange={(e) => handleChangeBank(e)}
                            value={selectedBanks}
                            isSelectAll={true}
                            menuPlacement={"bottom"}
                            disabled={applicationDetail?.userID !== UserID.replace(/"/g, "") ? true : false}
                          />
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
                            value={applicationDetail.subject}
                            disabled={applicationDetail?.userID !== UserID.replace(/"/g, "") ? true : false}
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
                      <div className="cccto">
                        <div className="flex justify-content-center multiSelect">
                          {/* <MultiSelect
                            value={selectedDirectives}
                            onChange={(e) => setSelectedDirectives(e.value)}
                            options={DirectiveOption}
                            optionLabel="name"
                            name="directiveData"
                            placeholder="Select Directives"
                            display="chip"
                            disabled={applicationDetail?.userID !== UserID.replace(/"/g, "") ? true : false}
                          /> */}
                          <DirectiveMultiSelectComponent
                            key="multyselectprinciple"
                            options={DirectiveOption}
                            onChange={(e) => handleChangeDirective(e)}
                            value={selectedDirectives}
                            isSelectAll={true}

                            menuPlacement={"bottom"}
                            disabled={applicationDetail?.userID !== UserID.replace(/"/g, "") ? true : false}
                          />
                          {/* {errors?.directiveData ? (
                            <small className="errormsg">{errors.directiveData}</small>
                          ) : (
                            ""
                          )} */}
                        </div>
                      </div>
                    </div>
                    {/* end form-bx  */}
                    <div className="inner_form_new ">
                      <label className="controlform">Releasing Date</label>
                      <div className="form-bx">
                        <DatePicker
                          ref={FrequencyDateRef}
                          placeholderText="Select Releasing Date"
                          closeOnScroll={(e) => e.target === document}
                          selected={releasingDate ? releasingDate : applicationDetail.releasingDate}
                          onChange={(date) => setReleasingDate(date)}
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          minDate={new Date()}
                          dropdownMode="select"
                          dateFormat="dd/MMM/yyyy"
                          disabled={applicationDetail?.userID !== UserID.replace(/"/g, "") ? true : false}
                        />
                        {
                          errors?.releasingDate ? (
                            <small className="errormsg">{errors.releasingDate}</small>
                          ) : (" ")
                        }
                      </div>
                    </div>
                    {/* end form-bx  */}
                    {applicationDetail?.userID == UserID.replace(/"/g, "") ?
                      <div className="inner_form_new ">
                        <label className="controlform">Assign to Next Level</label>
                        <input
                          type="checkbox"
                          onChange={HandelSupervisorcheck}
                          checked={checkSupervisor}
                          disabled={applicationDetail?.userID !== UserID.replace(/"/g, "") ? true : false}

                        />
                      </div>
                      : ""}




                    {roleID >= "5" && checkSupervisor == true ? (
                      <>
                        <div className="inner_form_new">
                          {/* <label className="controlform">Select Analyst</label> */}
                          <label className="controlform">
                            {
                              roleID == "5" ? " Senior Analyst" : roleID == "6" ? " Principal Analyst" : roleID == "7" ? " Deputy Director" : " Director"
                            }
                          </label>
                          <div className="form-bx">
                            <label>
                              <select
                                ref={assignedToRef}
                                name="assignedTo"
                                onChange={supervisorHangechangeBankuser}
                                className={
                                  errors.assignedTo && !AssignUserID ? "error" : ""
                                }
                              >
                                <option value="">
                                  {
                                    roleID == "5" ? " Senior Analyst" : roleID == "6" ? " Principal Analyst" : roleID == "7" ? " Deputy Director" : " Director"
                                  }
                                </option>
                                {Supervisors?.map((item, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={JSON?.stringify(item)}
                                      selected={
                                        item.userID == applicationDetail?.assignedTo
                                      }
                                    >
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </select>
                              <span className="sspan"></span>
                              {errors.assignedTo && !AssignUserID ? (
                                <small className="errormsg">
                                  {errors.assignedTo}
                                </small>
                              ) : (
                                ""
                              )}
                            </label>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    <div
                      class=
                      {
                        applicationDetail?.circularStatus == 0 ? "d-none" : "row"
                      }
                    >
                      <div class="col-md-6">
                        <div class="inner_form_new ">
                          <label class="controlform">Assigned To Role</label>
                          <div class="form-bx">
                            <label>
                              <input
                                type="text"
                                class=""
                                disabled
                                value={
                                  applicationDetail?.assignedToRoleName
                                    ? applicationDetail?.assignedToRoleName
                                    : "N/A"
                                }
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="inner_form_new-sm ">
                          <label class="controlform-sm">Assigned To User</label>
                          <div class="form-bx-sm">
                            <label>
                              <input
                                type="text"
                                class=""
                                disabled
                                value={
                                  applicationDetail?.assignedToName
                                    ? applicationDetail?.assignedToName
                                    : "N/A"
                                }
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* previous edit form end   */}
                    {/* upload file Data Start */}


                    <h5 className="section_top_subheading mt-2">Attachments</h5>

                    {applicationDetail?.attachedFiles.length > 0 ? (
                      applicationDetail?.attachedFiles?.map((item) => {
                        return (
                          < div
                            className={
                              item?.filePath != null
                                ? "attachemt_form-bx"
                                : "d-none"
                            }
                          >
                            <label
                              style={{
                                background: "#d9edf7",
                                padding: "9px 3px",
                                border: "0px",
                              }}
                            >
                              {item?.fileName ? (
                                <span style={{ fontWeight: "500" }}>
                                  {item?.fileName}
                                </span>
                              ) : (
                                <span style={{ fontWeight: "500" }}>Cover Letter</span>
                              )}
                            </label>
                            {item?.filePath ? (
                              <span className="filename">
                                <Link
                                  to={item?.filePath}
                                  target="_blank"
                                  className={
                                    item?.filePath
                                      ? "viewbtn_file"
                                      : "viewbtn_file pe-none"
                                  }
                                >
                                  View File
                                </Link>
                              </span>
                            ) : (
                              <span className="disabletext">Not Found</span>
                            )}
                          </div>
                        )
                      })

                    ) : (
                      ""
                    )}
                  </div>

                </div>

              </div>
              {/* -------------start next level------- */}
              {/* analyst analyst code start */}
              {/* {applicationDetail?.userID !== UserID.replace(/"/g, "") && roleID >= 5 ? ( */}
              {roleID >= 5 ? (
                <>
                  <h5
                    className={
                      analystTab
                        ? "section_top_subheading mt-0 py-3 btn-collapse_active cursorpointer"
                        : "section_top_subheading mt-0 py-3 cursorpointer"
                    }
                    onClick={() => setanalystTab(!analystTab)}
                  >
                    Analyst{" "}
                    <span className="btn-collapse">
                      <i className="bi bi-caret-down-fill"></i>
                    </span>
                  </h5>
                  <div className={analystTab ? "customtab" : "d-none"}>


                    {allcomment?.map((cur, i) => {
                      if (cur.assignedToRoleID == 5) {
                        return (
                          <ul
                            className={
                              cur?.circularActivityData?.length >= 1
                                ? "nav nav-pills mb-3"
                                : "d-none"
                            }
                            role="tablist"
                          >
                            <li
                              className={roleID == 5 ? "nav-item" : "d-none"}
                              role="presentation"
                            >
                              <button
                                className={
                                  roleID == 5
                                    ? "nav-link w-100 border-radius0 active"
                                    : "nav-link w-100 border-radius0"
                                }
                                id="analyst"
                                data-bs-toggle="tab"
                                data-bs-target="#analyst-justified-home"
                                type="button"
                                role="tab"
                                aria-controls="home"
                                aria-selected="true"
                              >
                                Action
                              </button>
                            </li>
                            {cur?.circularActivityData
                              ?.slice()
                              ?.reverse()
                              .map((items, index) => {
                                return (
                                  <li className="nav-item" role="presentation">
                                    <button
                                      className={
                                        index == 0 && roleID > 5
                                          ? "nav-link w-100 border-radius0 active"
                                          : "nav-link border-radius0 w-100 "
                                      }
                                      id={"analyst" + index}
                                      data-bs-toggle="tab"
                                      data-bs-target={
                                        "#analyst-justified-home" + index
                                      }
                                      type="button"
                                      role="tab"
                                      aria-controls="home"
                                      aria-selected="true"
                                    >

                                      Response{" "}
                                      {cur?.circularActivityData?.length -
                                        index}
                                    </button>
                                  </li>
                                );
                              })}
                          </ul>
                        );
                      }
                    })

                    }

                    <div className="tab-content pt-2">
                      <div
                        className={
                          roleID >= 5
                            ? "tab-pane fade show active"
                            : "tab-pane fade show"
                        }
                        id="analyst-justified-home"
                        role="tabpanel"
                        aria-labelledby="analyst"
                      >
                        {Actiondata?.map((cur) => {

                          const firstItem = cur?.circularActivityData?.[0];
                          // Accessing the first element directly

                          if (cur?.assignedToRoleID === 5 && firstItem) {
                            // Check if firstItem exists
                            return (
                              <div className="bakgroundaction">
                                <div key={firstItem.actionID}>
                                  {" "}
                                  {/* Remember to add a unique key */}
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="inner_form_new">
                                        <label className="controlform">
                                          Action Type
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              // value={firstItem?.actionStatusName}
                                              value={
                                                firstItem?.actionStatusName ==
                                                  "Approved" ||
                                                  firstItem?.actionStatusName ==
                                                  "Reject" ||
                                                  firstItem?.actionStatusName ==
                                                  "Cancelled" ||
                                                  firstItem?.actionStatusName ==
                                                  "Draft"
                                                  ? "Assigned"
                                                  : firstItem?.actionStatusName
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          User{" "}
                                          <i
                                            className="bi bi-info-circle icons-info"
                                            title={`Role : ${firstItem?.actionRoleName}`}
                                          ></i>
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={firstItem?.actionUserName}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          {firstItem?.actionStatusName ==
                                            "Approved" ||
                                            firstItem?.actionStatusName ==
                                            "Reject" ||
                                            firstItem?.actionStatusName ==
                                            "Cancelled"
                                            ? "Assigned"
                                            : firstItem?.actionStatusName}{" "}
                                          Date
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={moment(
                                                firstItem?.createdDate
                                              ).format("DD/MMM/yyyy")}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionNotes
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Note
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionNotes}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionComment
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Comment
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionComment}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                        {/* previous edit form start  */}
                        {/* <div className="inner_form_new ">
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
                                // value={exportForm.name}
                                value={applicationDetail.name}
                                disabled={roleID > 5}
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
                     
                        <div
                          className={
                            roleID == 5
                              ? "inner_form_new align-items-start mt-2"
                              : "d-none"
                          }
                        >
                          <label className="controlform">Content</label>
                          <div className="form-bx editorFieldBox">
                            <div className="mt-2 py-1">
                              <MenuBar editor={editorAnalyst} />
                              <EditorContent editor={editorAnalyst} />

                              <span className="sspan"></span>
                              {(errors.Description && Description == " ") ||
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
                              )}
                            </div>
                          </div>
                        </div>
                    

                        {attachmentData?.map((items, index) => {
                          return (
                            <div
                              className="attachemt_form-bx  mt-2"
                              key={items.id}
                            >
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
                                    handleuserFileChange(e, "circular" + (index + 1))
                                  }
                                />
                              </div>
                              <span className="filename">
                                {userfiles?.find(
                                  (f) => f.id === "circular" + (index + 1)
                                )?.file?.name || "No file chosen"}
                              </span>
                              {userfiles?.length &&
                                userfiles?.find((f) => f.id === "circular" + (index + 1))
                                  ?.file?.name ? (
                                <button
                                  type="button"
                                  className="remove-file"
                                  onClick={() =>
                                    removeUserImage(index, "circular" + (index + 1))
                                  }
                                >
                                  Remove
                                </button>
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        })}

                        {otheruserfiles.map((file, index) => (
                          <div
                            key={"other" + (index + 1)}
                            className="attachemt_form-bx"
                          >
                            <label
                              style={{
                                background: "#d9edf7",
                                padding: "9px 3px",
                                border: "0px",
                              }}
                            >
                              <b>
                                Other File
                                {index + 1}
                              </b>
                            </label>
                            <div className="browse-btn">
                              Browse{" "}
                              <input
                                type="file"
                                onChange={(e) => {
                                  handleuserFileChange(e, "other" + index);
                                  handleOthrefile(e, `other ${index}`);
                                }}
                              />
                            </div>
                            <span className="filename">
                              {userfiles?.find((f) => f.id === "other" + index)
                                ?.file?.name || "No file chosen"}
                            </span>

                            {userfiles?.length &&
                              userfiles?.find((f) => f.id === "other" + index)
                                ?.file?.name ? (
                              <button
                                type="button"
                                className="remove-file"
                                onClick={() =>
                                  removeUserImage(index, "other" + index)
                                }
                              >
                                Remove
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        ))}

                        {otheruserfiles?.length || userfiles?.length ? (
                          <div className="attachemt_form-bx">
                            <label style={{ border: "0px" }}>{""}</label>
                            <button
                              type="button"
                              className="addmore-btn mt-0"
                              onClick={(e) => handleuserAddMore(e)}
                            >
                              {" "}
                              Add More File{" "}
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="inner_form_new">
                          <label className="controlform">Bank</label>
                          <div className="form-bx">
                            <div className="multiselect flex justify-content-center">
                              <MultiSelect
                                value={selectedBanks}
                                onChange={(e) => setSelectedBanks(e.value)}
                                options={vOption}
                                optionLabel="name"
                                // selected={applicationDetail?.bankData?.map((item) => item.bankName == vOption.name)}
                                onShow={onShow}
                                placeholder="Select Banks"
                                display="chip"
                                disabled={roleID > 5}
                              />
                            </div>

                          </div>
                        </div>
                     
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
                                value={applicationDetail.subject}
                                disabled={roleID > 5}
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

                      
                        <div className="inner_form_new ">
                          <label className="controlform">Directives</label>
                          <div className="form-bx">
                            <div className="multiselect flex justify-content-center">
                              <MultiSelect
                                value={selectedDirectives}
                                onChange={(e) => setSelectedDirectives(e.value)}
                                options={DirectiveOption}
                                optionLabel="name"
                                name="directiveData"
                                placeholder="Select Directives"
                                display="chip"
                                disabled={roleID > 5}
                              />
                              {errors?.directiveData ? (
                                <small className="errormsg">{errors.directiveData}</small>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                     
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
                              disabled={roleID > 5}
                            />
                            {
                              errors?.releasingDate ? (
                                <small className="errormsg">{errors.releasingDate}</small>
                              ) : (" ")
                            }
                          </div>
                        </div>
                     
                        <div className="inner_form_new ">
                          <label className="controlform">Assign to Next Level</label>
                          <input
                            type="checkbox"
                            onChange={HandelSupervisorcheck}
                            checked={checkSupervisor}
                            // disabled={roleID >= 6 ? true : false}
                            disabled={roleID > 5}
                          />
                        </div>
                      


                        {roleID == "5" && checkSupervisor == true ? (
                          <>
                            <div className="inner_form_new">
                              <label className="controlform">Select Analyst</label>
                              <div className="form-bx">
                                <label>
                                  <select
                                    ref={assignedToRef}
                                    name="assignedTo"
                                    onChange={supervisorHangechangeBankuser}
                                    className={
                                      errors.assignedTo && !AssignUserID ? "error" : ""
                                    }
                                  >
                                    <option value="">Select Analyst</option>
                                    {Supervisors?.map((item, index) => {
                                      return (
                                        <option
                                          key={index}
                                          value={JSON?.stringify(item)}
                                          selected={
                                            item.userID == applicationDetail?.assignedTo
                                          }
                                        >
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <span className="sspan"></span>
                                  {errors.assignedTo && !AssignUserID ? (
                                    <small className="errormsg">
                                      {errors.assignedTo}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </label>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}

                      <h5 className="section_top_subheading mt-2">Attachments</h5>

                        {applicationDetail?.attachedFiles.length > 0 ? (
                          applicationDetail?.attachedFiles?.map((item) => {
                            return (
                              < div
                                className={
                                  item?.filePath != null
                                    ? "attachemt_form-bx"
                                    : "d-none"
                                }
                              >
                                <label
                                  style={{
                                    background: "#d9edf7",
                                    padding: "9px 3px",
                                    border: "0px",
                                  }}
                                >
                                  {item?.fileName ? (
                                    <span style={{ fontWeight: "500" }}>
                                      {item?.fileName}
                                    </span>
                                  ) : (
                                    <span style={{ fontWeight: "500" }}>Cover Letter</span>
                                  )}
                                </label>
                                {item?.filePath ? (
                                  <span className="filename">
                                    <Link
                                      to={item?.filePath}
                                      target="_blank"
                                      className={
                                        item?.filePath
                                          ? "viewbtn_file"
                                          : "viewbtn_file pe-none"
                                      }
                                    >
                                      View File
                                    </Link>
                                  </span>
                                ) : (
                                  <span className="disabletext">Not Found</span>
                                )}
                              </div>
                            )
                          })

                        ) : (
                          ""
                        )} */}

                      </div>
                      {allcomment?.map((cur) => {

                        return cur?.circularActivityData
                          ?.slice()
                          ?.reverse()
                          .map((item, index) => {

                            if (cur?.assignedToRoleID == 5) {
                              return (
                                <>
                                  <div
                                    key={index}
                                    className={
                                      index == 0 && roleID != 5
                                        ? "tab-pane fade show active"
                                        : "tab-pane fade show  "
                                    }
                                    id={"analyst-justified-home" + index}
                                    role="tabpanel"
                                    aria-labelledby={"analyst" + index}
                                  >
                                    <div className={item?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action Type
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={

                                                    item?.actionStatusName ==
                                                      "Approved" ||
                                                      item?.actionStatusName ==
                                                      "Reject" ||
                                                      item?.actionStatusName ==
                                                      "Cancelled"
                                                      ? "Assigned" ||
                                                      item?.actionStatusName ==
                                                      "Draft"
                                                      : item?.actionStatusName
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-3">
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              User{" "}
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${item?.actionRoleName}`}
                                              ></i>
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={item?.actionUserName}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-3">
                                          <div className="inner_form_new-sm">
                                            <label className="controlform-sm">
                                              {item?.actionStatusName ==
                                                "Approved" ||
                                                item?.actionStatusName ==
                                                "Reject" ||
                                                item?.actionStatusName ==
                                                "Cancelled"
                                                ? "Assigned"
                                                : item?.actionStatusName}{" "}
                                              Date
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={moment(
                                                    item?.createdDate
                                                  ).format("DD/MMM/yyyy")}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionNotes
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Note
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={item?.actionNotes}
                                            />
                                          </label>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionComment
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Comment
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={item?.actionComment}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>



                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Name
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            value={item?.name}
                                            disabled
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Content
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          {/* <input
                                        type="text"
                                        className=""
                                        value={item?.content}
                                        disabled
                                      /> */}
                                          <p className="showData" dangerouslySetInnerHTML={applicationDetail?.content ? { __html: applicationDetail.content } : { __html: "-" }}></p>
                                        </label>
                                      </div>
                                    </div>



                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Attachments
                                      </label>

                                      <div className="form-bx">
                                        {item?.filesData?.length ? (
                                          item?.filesData?.map(
                                            (items, index) => {
                                              return (
                                                <div
                                                  className="attachemt_form-bx mb-0 width-80"
                                                  key={items.id}
                                                >
                                                  <label className="mb-2 mb-0 pt-2 pb-2">
                                                    {/* {items.filename} */}
                                                    {items?.fileName
                                                      ? items?.fileName
                                                      : `FileUpload ${index}`}
                                                  </label>
                                                  <div
                                                    className={
                                                      roleID == 2 || roleID == 3
                                                        ? "browse-btn"
                                                        : "d-none"
                                                    }
                                                  >
                                                    Browse{" "}
                                                    <input
                                                      type="file"
                                                      onChange={(e) =>
                                                        handleFileChange(
                                                          e,
                                                          items.id
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                  <span className="filename">
                                                    <Link
                                                      to={items?.filePath}
                                                      target="_blank"
                                                      className="viewbtn"
                                                    >
                                                      View File
                                                    </Link>
                                                  </span>
                                                </div>
                                              );
                                            }
                                          )
                                        ) : (
                                          <label className="notfound">
                                            File Not Found
                                          </label>
                                        )}
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Bank
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.bankData
                                              ?.length ? (
                                              item?.bankData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.bankName}</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Subject
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            value={item?.subject}
                                            disabled
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Directive
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.directiveData
                                              ?.length ? (
                                              item?.directiveData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.directiveName
                                                    }</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Releasing Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              item?.releasingDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                    {/* <div class="row">
                                  <div class="col-md-12">
                                    <div class="inner_form_new ">
                                      <label class="controlform">
                                        Action
                                      </label>
                                      <div class="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            class=""
                                            disabled
                                            value={
                                              item?.assignedAction ==
                                                "Approved" ||
                                                item?.assignedAction ==
                                                "Reject" ||
                                                item?.assignedAction ==
                                                "Cancelled"
                                                ? "Assigned"
                                                : item?.assignedAction
                                            }
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div> */}


                                    <div
                                      className={
                                        item?.assignedToName == null &&
                                          item?.assignedToName == null
                                          ? "d-none"
                                          : "row"
                                      }
                                    >
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Assigned To Role
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.roleName
                                                    ? item?.roleName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            Assigned To User
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.assignedToName
                                                    ? item?.assignedToName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          });
                      })}
                      {/* {noDataComment?.map((data, i) => {
                        if (data.roleID == 5 && data.isDataAvailable == 0) {
                          return (
                            <div
                              className={
                                analystTab ? "customtab" : "d-none"
                              }
                              key={i}
                            >
                              <div className="text-center">No Data Found</div>
                            </div>
                          );
                        }
                      })} */}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {/* analyst analyst code end */}


              {/* senior analyst code start */}
              {roleID >= 6 ? (
                <>
                  <h5
                    className={
                      sranalystTab
                        ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                        : "section_top_subheading mt-3 py-3 cursorpointer"
                    }
                    onClick={() => setsranalystTab(!sranalystTab)}
                  >
                    Senior Analyst{" "}

                    <span className="btn-collapse">
                      <i className="bi bi-caret-down-fill"></i>
                    </span>
                  </h5>

                  <div className={sranalystTab ? "customtab" : "d-none"}>

                    {/* {applicationDetail?.id != 6 && applicationDetail && roleID != 6 ? <ExportCirculargenInfo applicationDetail={applicationDetail}  /> : ""} */}

                    {allcomment?.map((cur, i) => {

                      if (cur.assignedToRoleID == 6) {
                        return (
                          <ul
                            className={
                              cur?.circularActivityData?.length >= 1
                                ? "nav nav-pills mb-3"
                                : "d-none"
                            }
                            role="tablist"
                          >
                            <li
                              className={roleID == 6 ? "nav-item" : "d-none"}
                              role="presentation"
                            >
                              <button
                                className={
                                  roleID == 6
                                    ? "nav-link w-100 border-radius0 active"
                                    : "nav-link w-100 border-radius0"
                                }
                                id="sranalystab"
                                data-bs-toggle="tab"
                                data-bs-target="#sranalystab-justified-home"
                                type="button"
                                role="tab"
                                aria-controls="home"
                                aria-selected="true"
                              >
                                Action
                              </button>
                            </li>

                            {cur?.circularActivityData
                              ?.slice()
                              ?.reverse()
                              .map((items, index) => {
                                return (
                                  <li className="nav-item" role="presentation">
                                    <button
                                      className={
                                        index == 0 && roleID != 6
                                          ? "nav-link w-100 border-radius0 active"
                                          : "nav-link border-radius0 w-100 "
                                      }
                                      id={"sranalystab" + index}
                                      data-bs-toggle="tab"
                                      data-bs-target={
                                        "#sranalystab-justified-home" + index
                                      }
                                      type="button"
                                      role="tab"
                                      aria-controls="home"
                                      aria-selected="true"
                                    >

                                      Response{" "}
                                      {cur?.circularActivityData?.length -
                                        index}
                                    </button>
                                  </li>
                                );
                              })}
                          </ul>
                        );
                        // } else {
                        //   return (
                        //     <div>
                        //       {applicationDetail?.roleID == 6 ? <ExportCirculargenInfo applicationDetail={applicationDetail} /> : applicationDetail?.roleID != 6 && applicationDetail && roleID != 6 ? "No Data" : " "}
                        //     </div>
                        //   )
                        // }
                      }

                    })}

                    <div className="tab-content pt-2">
                      <div
                        className={
                          roleID >= 6
                            ? "tab-pane fade show active"
                            : "tab-pane fade show "
                        }
                        id="sranalystab-justified-home"
                        role="tabpanel"
                        aria-labelledby="sranalystab"
                      >
                        {Actiondata?.map((cur) => {
                          const firstItem = cur?.circularActivityData?.[0]; // Accessing the first element directly

                          if (cur?.assignedToRoleID === 6 && firstItem) {
                            // Check if firstItem exists
                            return (
                              <div className="bakgroundaction">
                                <div key={firstItem.actionID}>
                                  {" "}
                                  {/* Remember to add a unique key */}
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="inner_form_new">
                                        <label className="controlform">
                                          Action Type
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              // value={firstItem?.actionStatusName}
                                              value={
                                                firstItem?.actionStatusName ==
                                                  "Approved" ||
                                                  firstItem?.actionStatusName ==
                                                  "Reject" ||
                                                  firstItem?.actionStatusName ==
                                                  "Cancelled"
                                                  ? "Assigned" ||
                                                  firstItem?.actionStatusName ==
                                                  "Draft"
                                                  : firstItem?.actionStatusName
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          User{" "}
                                          <i
                                            className="bi bi-info-circle icons-info"
                                            title={`Role : ${firstItem?.actionRoleName}`}
                                          ></i>
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={firstItem?.actionUserName}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          {firstItem?.actionStatusName ==
                                            "Approved" ||
                                            firstItem?.actionStatusName ==
                                            "Reject" ||
                                            firstItem?.actionStatusName ==
                                            "Cancelled"
                                            ? "Assigned"
                                            : firstItem?.actionStatusName}{" "}
                                          Date
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={moment(
                                                firstItem?.createdDate
                                              ).format("DD/MMM/yyyy")}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionNotes
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Note
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionNotes}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionComment
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Comment
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionComment}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}

                        {/* next level data show and assign behalf of not equal userID  start*/}
                        {applicationDetail?.userID !== UserID.replace(/"/g, "") && roleID == 6 ?
                          <>
                            <div
                              className={
                                roleID == 6
                                  ? "inner_form_new align-items-center"
                                  : "d-none"
                              }
                            >
                              <label className="controlform">Next Action</label>
                              <div className="row">
                                <div className="col-md-12 my-2">
                                  <div className="hidden-toggles">

                                    <input
                                      type="radio"
                                      id="srasignto"
                                      onChange={(e) => {
                                        setcheckSupervisor(true);
                                        supervisorHangechangeRole(e);
                                        ChangeNextlevelHandle(e);
                                        GetRoleHandle(10);
                                        setAssignUserID("");
                                        setapplicationstaus(
                                          applicationDetail?.analystRecommendation
                                        );
                                      }}
                                      onClick={() => setRecomdAnalyst("10")}
                                      name="nextaction"
                                      className="hidden-toggles__input"
                                      value="10"
                                      disabled={roleID > 6}
                                    />
                                    <label
                                      for="srasignto"
                                      className="hidden-toggles__label"
                                    >
                                      Assign
                                    </label>

                                    <input
                                      type="radio"
                                      id="srcoloration-Refer"
                                      onChange={(e) => {
                                        ChangeNextlevelHandle(e);
                                        // ChangeApplicationStatus(e);
                                        setcheckSupervisor(true);
                                        GetRoleHandle(15);
                                        setAssignUserID("");
                                        setapplicationstaus(
                                          applicationDetail?.analystRecommendation
                                        );
                                      }}
                                      onClick={() => setRecomdAnalyst("")}
                                      name="nextaction"
                                      // name="applicationstaus"
                                      value="15"
                                      className="hidden-toggles__input"
                                      disabled={roleID > 6}
                                    />
                                    <label
                                      for="srcoloration-Refer"
                                      className="hidden-toggles__label"
                                    >
                                      Refer Back
                                    </label>

                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className={checkSupervisor == true ? "row" : "d-none"}
                            >
                              <div className="col-md-12 d-flex c-gap">
                                <div
                                  className={
                                    nextlevelvalue == 15 ? "w-50" : "d-none"
                                  }
                                >
                                  {checkSupervisor == true && roleID == 6 ? (
                                    <>
                                      <div className="inner_form_new">
                                        <label className="controlform">Role </label>

                                        <div className="form-bx">
                                          <label>
                                            <select
                                              ref={assignedToRef}
                                              name="SupervisorRoleId"
                                              onChange={(e) => {
                                                supervisorHangechangeRole(e);
                                                handleUserRole(e);
                                              }}
                                              className={
                                                errors.assignedTo &&
                                                  !SupervisorRoleId
                                                  ? "error"
                                                  : ""
                                              }
                                            >
                                              <option value="">Select Role</option>
                                              {userRole?.map((item, index) => {
                                                return (
                                                  <option
                                                    key={index}
                                                    value={item.id}
                                                  >
                                                    {item.designation}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                            <span className="sspan"></span>
                                            {errors.SupervisorRoleId &&
                                              (
                                                <small className="errormsg">
                                                  Role is required{" "}
                                                </small>
                                              )}
                                          </label>
                                        </div>
                                      </div>
                                      {/* end form-bx  */}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div
                                  className={
                                    nextlevelvalue == 15 ? "w-50" : "w-100"
                                  }
                                >
                                  {roleID == 6 && recomdAnalyst != "121" ? (
                                    <>
                                      <div className="inner_form_new">
                                        <label className="controlform">User </label>

                                        <div className="form-bx">
                                          <label>
                                            <select
                                              ref={assignedToRef}
                                              name="AssignUserID"
                                              onChange={(e) =>
                                                supervisorHangechange(e)
                                              }
                                              className={
                                                errors.assignUserID && !AssignUserID
                                                  ? "error"
                                                  : ""
                                              }
                                            >
                                              <option value="">Select User</option>
                                              {asignUser?.map((item, index) => {
                                                return (
                                                  <option
                                                    key={index}
                                                    value={item.userID}
                                                  >
                                                    {item.name}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                            <span className="sspan"></span>
                                            {errors.assignUserID &&
                                              (
                                                <small className="errormsg">
                                                  {errors.assignUserID}
                                                </small>
                                              )}
                                          </label>
                                        </div>
                                      </div>
                                      {/* end form-bx  */}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* end form-bx  */}
                              </div>
                            </div>
                            {roleID == 6 && <p>
                              {attachmentData?.map((items, index) => {
                                return (
                                  <div
                                    className="attachemt_form-bx  mt-2"
                                    key={items.id}
                                  >
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
                                          handleuserFileChange(e, "circular" + (index + 1))
                                        }
                                      />
                                    </div>
                                    <span className="filename">
                                      {userfiles?.find(
                                        (f) => f.id === "circular" + (index + 1)
                                      )?.file?.name || "No file chosen"}
                                    </span>
                                    {userfiles?.length &&
                                      userfiles?.find((f) => f.id === "circular" + (index + 1))
                                        ?.file?.name ? (
                                      <button
                                        type="button"
                                        className="remove-file"
                                        onClick={() =>
                                          removeUserImage(index, "circular" + (index + 1))
                                        }
                                      >
                                        Remove
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                );
                              })}

                              {otheruserfiles.map((file, index) => (
                                <div
                                  key={"other" + (index + 1)}
                                  className="attachemt_form-bx"
                                >
                                  <label
                                    style={{
                                      background: "#d9edf7",
                                      padding: "9px 3px",
                                      border: "0px",
                                    }}
                                  >
                                    <b>
                                      Other File
                                      {index + 1}
                                    </b>
                                  </label>
                                  <div className="browse-btn">
                                    Browse{" "}
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        handleuserFileChange(e, "other" + index);
                                        handleOthrefile(e, `other ${index}`);
                                      }}
                                    />
                                  </div>
                                  <span className="filename">
                                    {userfiles?.find((f) => f.id === "other" + index)
                                      ?.file?.name || "No file chosen"}
                                  </span>

                                  {userfiles?.length &&
                                    userfiles?.find((f) => f.id === "other" + index)
                                      ?.file?.name ? (
                                    <button
                                      type="button"
                                      className="remove-file"
                                      onClick={() =>
                                        removeUserImage(index, "other" + index)
                                      }
                                    >
                                      Remove
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ))}

                              {otheruserfiles?.length || userfiles?.length ? (
                                <div className="attachemt_form-bx">
                                  <label style={{ border: "0px" }}>{""}</label>
                                  <button
                                    type="button"
                                    className="addmore-btn mt-0"
                                    onClick={(e) => handleuserAddMore(e)}
                                  >
                                    {" "}
                                    Add More File{" "}
                                  </button>
                                </div>
                              ) : (
                                ""
                              )
                              }
                            </p>}
                            {/* end form-bx  */}

                            <div
                              className={
                                roleID == 6
                                  ? "inner_form_new align-items-start mt-2"
                                  : "d-none"
                              }
                            >
                              <label className="controlform">Recommendation</label>
                              <div className="form-bx editorFieldBox">
                                <div className="mt-2 py-1">
                                  <MenuBar editor={editorSrAnalyst} />
                                  <EditorContent editor={editorSrAnalyst} />

                                  <span className="sspan"></span>
                                  {(errors.Description && Description == " ") ||
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
                                  )}
                                </div>
                              </div>
                            </div>

                            <div
                              className={roleID == 6 ? "inner_form_new " : "d-none"}
                            >
                              <label className="controlform">
                                {nextlevelvalue == "10"
                                  ? "Assign Notes"

                                  : nextlevelvalue == "15"
                                    ? "Refer Back Notes"
                                    : "Notes"}
                              </label>

                              <div className="form-bx">
                                <label>
                                  <textarea
                                    name="Notes"
                                    onChange={(e) => {
                                      HandleNextleveldata(e);
                                    }}
                                    placeholder={
                                      nextlevelvalue == "10"
                                        ? "Assign Notes"
                                        : nextlevelvalue == "15"
                                          ? "Refer Back Notes"
                                          : "Notes"
                                    }
                                    className={errors.Notes ? "error" : ""}
                                    value={asignnextLeveldata.Notes}
                                  />
                                  <span className="sspan"></span>
                                  {errors.Notes ? (
                                    <small className="errormsg">
                                      {nextlevelvalue == "10"
                                        ? "Assign notes is required"
                                        : nextlevelvalue == "20"
                                          ? "Delegate notes is required"
                                          : nextlevelvalue == "35"
                                            ? "Referred to other department notes is required"
                                            : nextlevelvalue == "15"
                                              ? "Refer back notes is required"
                                              : "Notes is required"}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </label>
                              </div>
                            </div>
                            {/* end form-bx  */}

                            <div
                              className={roleID == 6 ? "inner_form_new " : "d-none"}
                            >
                              <label className="controlform">
                                {nextlevelvalue == "10"
                                  ? "Assign Comments"
                                  : nextlevelvalue == "20"
                                    ? "Delegate Comments"
                                    : nextlevelvalue == "35"
                                      ? "Referred to Other Department Comments"
                                      : nextlevelvalue == "15"
                                        ? "Refer Back Comments"
                                        : "Comments"}
                              </label>

                              <div className="form-bx">
                                <label>
                                  <textarea
                                    name="Comment"
                                    onChange={(e) => {
                                      HandleNextleveldata(e);
                                    }}
                                    placeholder={
                                      nextlevelvalue == "10"
                                        ? "Assign Comments"
                                        : nextlevelvalue == "20"
                                          ? "Delegate Comments"
                                          : nextlevelvalue == "35"
                                            ? "Referred to Other Department Comments"
                                            : nextlevelvalue == "15"
                                              ? "Refer Back Comments"
                                              : "Comments"
                                    }
                                    className={errors.Comment ? "error" : ""}
                                    value={asignnextLeveldata.Comment}
                                  />
                                  <span className="sspan"></span>
                                  {errors.Comment ? (
                                    <small className="errormsg">
                                      {nextlevelvalue == "10"
                                        ? "Assign comments is required"
                                        : nextlevelvalue == "20"
                                          ? "Delegate comments is required"
                                          : nextlevelvalue == "35"
                                            ? "Referred to other department comments is required"
                                            : nextlevelvalue == "15"
                                              ? "Refer back comments is required"
                                              : "Comments is required"}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </label>
                              </div>
                            </div>

                            <div className={roleID == 6 ? "inner_form_new align-items-center" : "d-none"}>
                              <label className="controlform">Bank</label>
                              <div className=" cccto">
                                <div className="flex justify-content-center multiSelect">
                                  <CustomBankMultiSelect
                                    key="multyselectprinciple"
                                    options={vOption}
                                    onChange={(e) => handleChangeBank(e)}
                                    value={selectedBanks}
                                    isSelectAll={true}
                                    menuPlacement={"bottom"}

                                  />

                                </div>
                              </div>
                            </div>
                            {/* end form-bx  */}
                            <div className={roleID == 6 ? "inner_form_new " : "d-none"}>
                              <label className="controlform">Directives</label>
                              <div className="cccto">
                                <div className="flex justify-content-center multiSelect">
                                  <DirectiveMultiSelectComponent
                                    key="multyselectprinciple"
                                    options={DirectiveOption}
                                    onChange={(e) => handleChangeDirective(e)}
                                    value={selectedDirectives}
                                    isSelectAll={true}
                                    menuPlacement={"bottom"}

                                  />
                                  {errors?.directiveData ? (
                                    <small className="errormsg">{errors.directiveData}</small>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* end form-bx  */}
                            {/* end form-bx  */}
                            <div className={roleID == 6 ? "inner_form_new " : "d-none"}>
                              <label className="controlform">Releasing Date </label>
                              <div className="form-bx">
                                <DatePicker
                                  placeholderText="Select Releasing Date"
                                  closeOnScroll={(e) => e.target === document}
                                  selected={releasingDate ? releasingDate : applicationDetail.releasingDate}
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
                          </>
                          : (
                            <span>
                              {/* {noDataComment?.map((data, i) => {
                                if (data.roleID == 6 && data.isDataAvailable == 0) {
                                  return (
                                    <div
                                      className={
                                        sranalystTab ? "customtab" : "d-none"
                                      }
                                      key={i}
                                    >
                                      <div className="text-center">No Data Found</div>
                                    </div>
                                  );
                                }
                              })} */}
                            </span>
                          )
                        }
                        {/* next level data show and assign behalf of not equal userID  end*/}
                      </div>
                      {allcomment?.map((cur) => {
                        return cur?.circularActivityData
                          ?.slice()
                          ?.reverse()
                          .map((item, index) => {

                            if (cur?.assignedToRoleID == 6) {
                              return (
                                <>
                                  <div
                                    key={index}
                                    className={
                                      index == 0 && roleID != 6
                                        ? "tab-pane fade show active"
                                        : "tab-pane fade show  "
                                    }
                                    id={"sranalystab-justified-home" + index}
                                    role="tabpanel"
                                    aria-labelledby={"sranalystab" + index}
                                  >
                                    <div className={item?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action Type
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  // value={item?.actionStatusName}
                                                  value={
                                                    item?.actionStatusName ==
                                                      "Approved" ||
                                                      item?.actionStatusName ==
                                                      "Reject" ||
                                                      item?.actionStatusName ==
                                                      "Cancelled"
                                                      ? "Assigned" ||
                                                      item?.actionStatusName ==
                                                      "Draft"
                                                      : item?.actionStatusName
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-3">
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              User{" "}
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${item?.actionRoleName}`}
                                              ></i>
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={item?.actionUserName}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-3">
                                          <div className="inner_form_new-sm">
                                            <label className="controlform-sm">
                                              {item?.actionStatusName ==
                                                "Approved" ||
                                                item?.actionStatusName ==
                                                "Reject" ||
                                                item?.actionStatusName ==
                                                "Cancelled"
                                                ? "Assigned"
                                                : item?.actionStatusName}{" "}
                                              Date
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={moment(
                                                    item?.createdDate
                                                  ).format("DD/MMM/yyyy")}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionNotes
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Note
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={item?.actionNotes}
                                            />
                                          </label>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionComment
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Comment
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={item?.actionComment}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Recommendation
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <div
                                            className="viewdiscription tableEditorData circularEdiorDisData"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.content
                                                ? item?.content
                                                : "N/A",
                                            }}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Notes
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            name="Notes"
                                            placeholder="Notes"
                                            className=""
                                            disabled
                                          >
                                            {item?.notes ? item?.notes : "N/A"}
                                          </textarea>
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Comments
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            name="Notes"
                                            placeholder="Notes"
                                            className=""
                                            disabled
                                          >
                                            {item?.comment
                                              ? item?.comment
                                              : "N/A"}
                                          </textarea>
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Attachments
                                      </label>
                                      <div className="form-bx">
                                        {item?.filesData?.length ? (
                                          item?.filesData?.map(
                                            (items, index) => {
                                              return (
                                                <div
                                                  className="attachemt_form-bx mb-0 width-80"
                                                  key={items.id}
                                                >
                                                  <label className="mb-2 mb-0 pt-2 pb-2">
                                                    {/* {items.filename} */}
                                                    {items?.fileName
                                                      ? items?.fileName
                                                      : `FileUpload ${index}`}
                                                  </label>
                                                  <div
                                                    className={
                                                      roleID == 2 || roleID == 3
                                                        ? "browse-btn"
                                                        : "d-none"
                                                    }
                                                  >
                                                    Browse{" "}
                                                    <input
                                                      type="file"
                                                      onChange={(e) =>
                                                        handleFileChange(
                                                          e,
                                                          items.id
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                  <span className="filename">
                                                    <Link
                                                      to={items?.filePath}
                                                      target="_blank"
                                                      className="viewbtn"
                                                    >
                                                      View File
                                                    </Link>
                                                  </span>
                                                </div>
                                              );
                                            }
                                          )
                                        ) : (
                                          <label className="notfound">
                                            File Not Found
                                          </label>
                                        )}
                                      </div>
                                    </div>

                                    {/* <div className="inner_form_new ">
                                      <label className="controlform">
                                        Bank 
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.bankData
                                              ?.length ? (
                                              item?.bankData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.bankName}</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Directives
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.directiveData
                                              ?.length ? (
                                              item?.directiveData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.directiveName}</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div> */}
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Releasing Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              item?.releasingDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                    {/* <div class="row">
                                      <div class="col-md-12">
                                        <div class="inner_form_new ">
                                          <label class="controlform">
                                            Action
                                          </label>
                                          <div class="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                class=""
                                                disabled
                                                value={
                                                  item?.assignedAction ==
                                                    "Approved" ||
                                                    item?.assignedAction ==
                                                    "Reject" ||
                                                    item?.assignedAction ==
                                                    "Cancelled"
                                                    ? "Assigned"
                                                    : item?.assignedAction
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div> */}


                                    <div
                                      className={
                                        item?.assignedToName == null &&
                                          item?.assignedToName == null
                                          ? "d-none"
                                          : "row"
                                      }
                                    >
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Assigned To Role
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.roleName
                                                    ? item?.roleName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            Assigned To User
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.assignedToName
                                                    ? item?.assignedToName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          });
                      })}

                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {/* senior analyst code end */}
              {/* Principal analyst code start */}

              {roleID >= 7 ? (
                <>
                  <h5
                    className={
                      principalanalystTab
                        ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                        : "section_top_subheading mt-3 py-3 cursorpointer"
                    }
                    onClick={() => setprincipalanalystTab(!principalanalystTab)}
                  >
                    Principal Analyst{" "}

                    <span className="btn-collapse">
                      <i className="bi bi-caret-down-fill"></i>
                    </span>
                  </h5>

                  <div className={principalanalystTab ? "customtab" : "d-none"}>

                    {allcomment?.map((cur, i) => {
                      if (cur.assignedToRoleID == 7) {
                        return (
                          <ul
                            className={
                              cur?.circularActivityData?.length >= 1
                                ? "nav nav-pills mb-3"
                                : "d-none"
                            }
                            role="tablist"
                          >
                            <li
                              className={roleID == 7 ? "nav-item" : "d-none"}
                              role="presentation"
                            >
                              <button
                                className={
                                  roleID == 7
                                    ? "nav-link w-100 border-radius0 active"
                                    : "nav-link w-100 border-radius0"
                                }
                                id="pranalyst"
                                data-bs-toggle="tab"
                                data-bs-target="#pranalyst-justified-home"
                                type="button"
                                role="tab"
                                aria-controls="home"
                                aria-selected="true"
                              >
                                Action
                              </button>
                            </li>

                            {cur?.circularActivityData
                              ?.slice()
                              ?.reverse()
                              .map((items, index) => {
                                return (
                                  <li className="nav-item" role="presentation">
                                    <button
                                      className={
                                        index == 0 && roleID != 7
                                          ? "nav-link w-100 border-radius0 active"
                                          : "nav-link border-radius0 w-100 "
                                      }
                                      id={"pranalyst" + index}
                                      data-bs-toggle="tab"
                                      data-bs-target={
                                        "#pranalyst-justified-home" + index
                                      }
                                      type="button"
                                      role="tab"
                                      aria-controls="home"
                                      aria-selected="true"
                                    >

                                      Response{" "}
                                      {cur?.circularActivityData?.length -
                                        index}
                                    </button>
                                  </li>
                                );
                              })}
                          </ul>
                        );
                      }

                    })}


                    <div className="tab-content pt-2">
                      <div
                        className={
                          roleID >= 7
                            ? "tab-pane fade show active"
                            : "tab-pane fade show "
                        }
                        id="pranalyst-justified-home"
                        role="tabpanel"
                        aria-labelledby="pranalyst"
                      >
                        {Actiondata?.map((cur) => {
                          const firstItem = cur?.circularActivityData?.[0]; // Accessing the first element directly
                          if (cur?.assignedToRoleID === 7 && firstItem) {
                            // Check if firstItem exists
                            return (
                              <div className="bakgroundaction">
                                <div key={firstItem.circularID}>
                                  {" "}
                                  {/* Remember to add a unique key */}
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="inner_form_new">
                                        <label className="controlform">
                                          Action Type
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              // value={firstItem?.actionStatusName}
                                              value={
                                                firstItem?.actionStatusName ==
                                                  "Approved" ||
                                                  firstItem?.actionStatusName ==
                                                  "Reject" ||
                                                  firstItem?.actionStatusName ==
                                                  "Cancelled" ||
                                                  firstItem?.actionStatusName ==
                                                  "Draft"
                                                  ? "Assigned"
                                                  : firstItem?.actionStatusName
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          User{" "}
                                          <i
                                            className="bi bi-info-circle icons-info"
                                            title={`Role : ${firstItem?.actionRoleName}`}
                                          ></i>
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={firstItem?.actionUserName}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          {firstItem?.actionStatusName ==
                                            "Approved" ||
                                            firstItem?.actionStatusName ==
                                            "Reject" ||
                                            firstItem?.actionStatusName ==
                                            "Cancelled"
                                            ? "Assigned"
                                            : firstItem?.actionStatusName}{" "}
                                          Date
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={moment(
                                                firstItem?.createdDate
                                              ).format("DD/MMM/yyyy")}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionNotes
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Note
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionNotes}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionComment
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Comment
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionComment}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                        {/* next level data show and assign behalf of not equal userID  start*/}
                        {applicationDetail?.userID !== UserID.replace(/"/g, "") && roleID == 7 ?
                          <>
                            <div
                              className={
                                roleID == 7
                                  ? "inner_form_new align-items-center"
                                  : "d-none"
                              }
                            >
                              <label className="controlform">Next Action</label>
                              <div className="row">
                                <div className="col-md-12 my-2">
                                  <div className="hidden-toggles">

                                    <input
                                      type="radio"
                                      id="prasignto"
                                      onChange={(e) => {
                                        setcheckSupervisor(true);
                                        supervisorHangechangeRole(e);
                                        ChangeNextlevelHandle(e);
                                        setAssignUserID("");
                                        GetRoleHandle(10);
                                        setapplicationstaus(
                                          applicationDetail?.analystRecommendation
                                        );
                                      }}
                                      onClick={() => setRecomdAnalyst("")}
                                      name="nextactionprincipal"
                                      className="hidden-toggles__input"
                                      value="10"
                                    />
                                    <label
                                      for="prasignto"
                                      className="hidden-toggles__label"
                                    >
                                      Assign
                                    </label>

                                    <input
                                      type="radio"
                                      id="prcoloration-Refer"
                                      onChange={(e) => {
                                        ChangeNextlevelHandle(e);
                                        // ChangeApplicationStatus(e);
                                        setcheckSupervisor(true);
                                        GetRoleHandle(15);
                                        setAssignUserID("");
                                        setapplicationstaus(
                                          applicationDetail?.analystRecommendation
                                        );
                                      }}
                                      onClick={() => setRecomdAnalyst("")}
                                      name="nextactionprincipal"
                                      // name="applicationstaus"
                                      value="15"
                                      className="hidden-toggles__input"
                                    />
                                    <label
                                      for="prcoloration-Refer"
                                      className="hidden-toggles__label"
                                    >
                                      Refer Back
                                    </label>


                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className={checkSupervisor == true ? "row" : "d-none"}
                            >
                              <div className="col-md-12 d-flex c-gap">
                                <div
                                  className={
                                    nextlevelvalue == 15 ? "w-50" : "d-none"
                                  }
                                >
                                  {checkSupervisor == true &&
                                    roleID == 7 &&
                                    recomdAnalyst != "121" ? (
                                    <>
                                      <div className="inner_form_new">
                                        <label className="controlform">Role</label>

                                        <div className="form-bx">
                                          <label>
                                            <select
                                              ref={assignedToRef}
                                              name="SupervisorRoleId"
                                              onChange={(e) => {
                                                supervisorHangechangeRole(e);
                                                handleUserRole(e);
                                              }}
                                              className={
                                                errors.assignedTo &&
                                                  !SupervisorRoleId
                                                  ? "error"
                                                  : ""
                                              }
                                            >
                                              <option value="">Select Role</option>
                                              {userRole?.map((item, index) => {
                                                return (
                                                  <option
                                                    key={index}
                                                    value={item.id}
                                                  >
                                                    {item.designation}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                            <span className="sspan"></span>
                                            {errors.assignedTo &&
                                              !SupervisorRoleId ? (
                                              <small className="errormsg">
                                                Role is required{" "}
                                              </small>
                                            ) : (
                                              ""
                                            )}
                                          </label>
                                        </div>
                                      </div>
                                      {/* end form-bx  */}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div
                                  className={
                                    nextlevelvalue == 15 ? "w-50" : "w-100"
                                  }
                                >
                                  {roleID == 7 && recomdAnalyst != "121" ? (
                                    <>
                                      <div className="inner_form_new">
                                        <label className="controlform">User</label>

                                        <div className="form-bx">
                                          <label>
                                            <select
                                              ref={assignedToRef}
                                              name="AssignUserID"
                                              onChange={(e) =>
                                                supervisorHangechange(e)
                                              }
                                              className={
                                                errors.assignUserID && !AssignUserID
                                                  ? "error"
                                                  : ""
                                              }
                                            >
                                              <option value="">Select User</option>
                                              {asignUser?.map((item, index) => {
                                                return (
                                                  <option
                                                    key={index}
                                                    value={item.userID}
                                                  >
                                                    {item.name}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                            <span className="sspan"></span>
                                            {errors.assignUserID &&
                                              !AssignUserID ? (
                                              <small className="errormsg">
                                                {errors.assignUserID}
                                              </small>
                                            ) : (
                                              ""
                                            )}
                                          </label>
                                        </div>
                                      </div>
                                      {/* end form-bx  */}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* end form-bx  */}
                              </div>
                            </div>
                            {roleID == 7 && <p>
                              {attachmentData?.map((items, index) => {
                                return (
                                  <div
                                    className="attachemt_form-bx  mt-2"
                                    key={items.id}
                                  >
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
                                          handleuserFileChange(e, "circular" + (index + 1))
                                        }
                                      />
                                    </div>
                                    <span className="filename">
                                      {userfiles?.find(
                                        (f) => f.id === "circular" + (index + 1)
                                      )?.file?.name || "No file chosen"}
                                    </span>
                                    {userfiles?.length &&
                                      userfiles?.find((f) => f.id === "circular" + (index + 1))
                                        ?.file?.name ? (
                                      <button
                                        type="button"
                                        className="remove-file"
                                        onClick={() =>
                                          removeUserImage(index, "circular" + (index + 1))
                                        }
                                      >
                                        Remove
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                );
                              })}

                              {otheruserfiles.map((file, index) => (
                                <div
                                  key={"other" + (index + 1)}
                                  className="attachemt_form-bx"
                                >
                                  <label
                                    style={{
                                      background: "#d9edf7",
                                      padding: "9px 3px",
                                      border: "0px",
                                    }}
                                  >
                                    <b>
                                      Other File
                                      {index + 1}
                                    </b>
                                  </label>
                                  <div className="browse-btn">
                                    Browse{" "}
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        handleuserFileChange(e, "other" + index);
                                        handleOthrefile(e, `other ${index}`);
                                      }}
                                    />
                                  </div>
                                  <span className="filename">
                                    {userfiles?.find((f) => f.id === "other" + index)
                                      ?.file?.name || "No file chosen"}
                                  </span>

                                  {userfiles?.length &&
                                    userfiles?.find((f) => f.id === "other" + index)
                                      ?.file?.name ? (
                                    <button
                                      type="button"
                                      className="remove-file"
                                      onClick={() =>
                                        removeUserImage(index, "other" + index)
                                      }
                                    >
                                      Remove
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ))}

                              {otheruserfiles?.length || userfiles?.length ? (
                                <div className="attachemt_form-bx">
                                  <label style={{ border: "0px" }}>{""}</label>
                                  <button
                                    type="button"
                                    className="addmore-btn mt-0"
                                    onClick={(e) => handleuserAddMore(e)}
                                  >
                                    {" "}
                                    Add More File{" "}
                                  </button>
                                </div>
                              ) : (
                                ""
                              )}
                            </p>}
                            <div
                              className={
                                roleID == 7
                                  ? "inner_form_new align-items-start mt-2"
                                  : "d-none"
                              }
                            >
                              <label className="controlform">Recommendation</label>
                              <div className="form-bx editorFieldBox">
                                <div className="mt-2 py-1">
                                  <MenuBar editor={editorPrincipleAnalyst} />
                                  <EditorContent editor={editorPrincipleAnalyst} />

                                  <span className="sspan"></span>
                                  {(errors.Description && Description == " ") ||
                                    Description == null ||
                                    Description == "<p></p>" ||
                                    !Description ? (
                                    <small className="errormsg">
                                      {errors.Description}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>

                            <div
                              className={roleID == 7 ? "inner_form_new " : "d-none"}
                            >
                              <label className="controlform">
                                {nextlevelvalue == "10"
                                  ? "Assign Notes"
                                  : nextlevelvalue == "20"
                                    ? "Delegate Notes"
                                    : nextlevelvalue == "35"
                                      ? "Referred to Other Department Notes"
                                      : nextlevelvalue == "15"
                                        ? "Refer Back Notes"
                                        : "Notes"}
                              </label>

                              <div className="form-bx">
                                <label>
                                  <textarea
                                    name="Notes"
                                    onChange={(e) => {
                                      HandleNextleveldata(e);
                                    }}
                                    placeholder={
                                      nextlevelvalue == "10"
                                        ? "Assign Notes"
                                        : nextlevelvalue == "20"
                                          ? "Delegate Notes"
                                          : nextlevelvalue == "35"
                                            ? "Referred to Other Department Notes"
                                            : nextlevelvalue == "15"
                                              ? "Refer Back Notes"
                                              : "Notes"
                                    }
                                    className={errors.Notes ? "error" : ""}
                                    value={asignnextLeveldata.Notes}
                                  />
                                  <span className="sspan"></span>
                                  {errors.Notes ? (
                                    <small className="errormsg">
                                      {nextlevelvalue == "10"
                                        ? "Assign notes is required"
                                        : nextlevelvalue == "20"
                                          ? "Delegate notes is required"
                                          : nextlevelvalue == "35"
                                            ? "Referred to other department notes is required"
                                            : nextlevelvalue == "15"
                                              ? "Refer back notes is required"
                                              : "Notes is required"}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </label>
                              </div>
                            </div>
                            {/* end form-bx  */}

                            <div
                              className={roleID == 7 ? "inner_form_new " : "d-none"}
                            >
                              <label className="controlform">
                                {nextlevelvalue == "10"
                                  ? "Assign Comments"
                                  : nextlevelvalue == "20"
                                    ? "Delegate Comments"
                                    : nextlevelvalue == "35"
                                      ? "Referred to Other Department Comments"
                                      : nextlevelvalue == "15"
                                        ? "Refer Back Comments"
                                        : "Comments"}
                              </label>

                              <div className="form-bx">
                                <label>
                                  <textarea
                                    name="Comment"
                                    onChange={(e) => {
                                      HandleNextleveldata(e);
                                    }}
                                    placeholder={
                                      nextlevelvalue == "10"
                                        ? "Assign Comments"
                                        : nextlevelvalue == "20"
                                          ? "Delegate Comments"
                                          : nextlevelvalue == "35"
                                            ? "Referred to Other Department Comments"
                                            : nextlevelvalue == "15"
                                              ? "Refer Back Comments"
                                              : "Comments"
                                    }
                                    className={errors.Comment ? "error" : ""}
                                    value={asignnextLeveldata.Comment}
                                  />
                                  <span className="sspan"></span>
                                  {errors.Comment ? (
                                    <small className="errormsg">
                                      {nextlevelvalue == "10"
                                        ? "Assign comments is required"
                                        : nextlevelvalue == "20"
                                          ? "Delegate comments is required"
                                          : nextlevelvalue == "35"
                                            ? "Referred to other department comments is required"
                                            : nextlevelvalue == "15"
                                              ? "Refer back comments is required"
                                              : "Comments is required"}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </label>
                              </div>
                            </div>

                            <div className={roleID == 7 ? "inner_form_new align-items-center" : "d-none"} >
                              <label className="controlform">Bank </label>
                              <div className=" cccto">
                                <div className="flex justify-content-center multiSelect">
                                  <CustomBankMultiSelect
                                    key="multyselectprinciple"
                                    options={vOption}
                                    onChange={(e) => handleChangeBank(e)}
                                    value={selectedBanks}
                                    isSelectAll={true}
                                    menuPlacement={"bottom"}

                                  />

                                </div>
                              </div>
                            </div>
                            {/* end form-bx  */}
                            <div className={roleID == 7 ? "inner_form_new" : "d-none"}>
                              <label className="controlform">Directives</label>
                              <div className="cccto">
                                <div className="flex justify-content-center multiSelect">
                                  <DirectiveMultiSelectComponent
                                    key="multyselectprinciple"
                                    options={DirectiveOption}
                                    onChange={(e) => handleChangeDirective(e)}
                                    value={selectedDirectives}
                                    isSelectAll={true}

                                    menuPlacement={"bottom"}

                                  />
                                </div>
                              </div>
                            </div>
                            {/* end form-bx  */}
                            {/* end form-bx  */}
                            <div className={roleID == 7 ? "inner_form_new" : "d-none"}>
                              <label className="controlform">Releasing Date</label>
                              <div className="form-bx">
                                <DatePicker
                                  placeholderText="Select Releasing Date"
                                  closeOnScroll={(e) => e.target === document}
                                  selected={releasingDate ? releasingDate : applicationDetail.releasingDate}
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

                          </> : (
                            <span>
                              {/* {noDataComment?.map((v, i) => {
                          if (v.roleID == 7 && v.isDataAvailable == 0) {
                            return (
                              <div
                                className={principalanalystTab ? "customtab" : "d-none"}
                              >
                                <div class="text-center">No Data Found</div>
                              </div>
                            );
                          }
                        })} */}
                            </span>
                          )
                        }
                        {/* next level data show and assign behalf of not equal userID  end*/}
                      </div>
                      {allcomment?.map((cur) => {
                        return cur?.circularActivityData
                          ?.slice()
                          ?.reverse()
                          .map((item, index) => {
                            if (cur?.assignedToRoleID == 7) {
                              return (
                                <>
                                  <div
                                    key={index}
                                    className={
                                      index == 0 && roleID != 7
                                        ? "tab-pane fade show active"
                                        : "tab-pane fade show  "
                                    }
                                    id={"pranalyst-justified-home" + index}
                                    role="tabpanel"
                                    aria-labelledby={"pranalyst" + index}
                                  >
                                    <div className={item?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action Type
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  // value={item?.actionStatusName}
                                                  value={
                                                    item?.actionStatusName ==
                                                      "Approved" ||
                                                      item?.actionStatusName ==
                                                      "Reject" ||
                                                      item?.actionStatusName ==
                                                      "Cancelled" ||
                                                      item?.actionStatusName ==
                                                      "Draft"
                                                      ? "Assigned"
                                                      : item?.actionStatusName
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-3">
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              User{" "}
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${item?.actionRoleName}`}
                                              ></i>
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={item?.actionUserName}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-3">
                                          <div className="inner_form_new-sm">
                                            <label className="controlform-sm">
                                              {item?.actionStatusName ==
                                                "Approved" ||
                                                item?.actionStatusName ==
                                                "Reject" ||
                                                item?.actionStatusName ==
                                                "Cancelled"
                                                ? "Assigned"
                                                : item?.actionStatusName}{" "}
                                              Date
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={moment(
                                                    item?.createdDate
                                                  ).format("DD/MMM/yyyy")}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionNotes
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Note
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={
                                                item?.actionNotes
                                                  ? item?.actionNotes
                                                  : "N/A"
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionComment
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Comment
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={item?.actionComment}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>


                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Recommendation hey
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <div
                                            className="tableEditorData disabled viewdiscription circularEdiorDisData"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.content
                                                ? item?.content
                                                : "N/A",
                                            }}
                                            disabled
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Notes
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            name="Notes"
                                            placeholder="Notes"
                                            className=""
                                            disabled
                                          >
                                            {item?.notes ? item?.notes : "N/A"}
                                          </textarea>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Comments
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            name="Notes"
                                            placeholder="Comments"
                                            className=""
                                            disabled
                                          >
                                            {item?.comment
                                              ? item?.comment
                                              : "N/A"}
                                          </textarea>
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Attachments
                                      </label>
                                      <div className="form-bx">
                                        {item?.filesData?.length ? (
                                          item?.filesData?.map(
                                            (items, index) => {
                                              return (
                                                <div
                                                  className="attachemt_form-bx mb-0 width-80"
                                                  key={items.id}
                                                >
                                                  <label className="mb-2 mb-0 pt-2 pb-2">

                                                    {items?.fileName
                                                      ? items?.fileName
                                                      : `FileUpload ${index}`}
                                                  </label>
                                                  <div
                                                    className={
                                                      roleID == 2 || roleID == 3
                                                        ? "browse-btn"
                                                        : "d-none"
                                                    }
                                                  >
                                                    Browse{" "}
                                                    <input
                                                      type="file"
                                                      onChange={(e) =>
                                                        handleFileChange(
                                                          e,
                                                          items.id
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                  <span className="filename">
                                                    <Link
                                                      to={items?.filePath}
                                                      target="_blank"
                                                      className="viewbtn"
                                                    >
                                                      View File
                                                    </Link>
                                                  </span>
                                                </div>
                                              );
                                            }
                                          )
                                        ) : (
                                          <label className="notfound">
                                            File Not Found
                                          </label>
                                        )}
                                      </div>
                                    </div>

                                    {/* <div className="inner_form_new ">
                                      <label className="controlform">
                                        Bank
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.bankData
                                              ?.length ? (
                                              item?.bankData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.bankName}</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Directives 
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.directiveData
                                              ?.length ? (
                                              item?.directiveData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.directiveName}</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div> */}
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Releasing Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              item?.releasingDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.assignedToName == null &&
                                          item?.assignedToName == null
                                          ? "d-none"
                                          : "row"
                                      }
                                    >
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Assigned To Role
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.roleName
                                                    ? item?.roleName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            Assigned To User
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.assignedToName
                                                    ? item?.assignedToName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          });
                      })}

                    </div>
                  </div>
                </>
              ) : (
                ""
              )}

              {/* Principal analyst code end */}
              {/* Dupty director code start */}
              {roleID >= 8 ? (
                <>
                  <h5
                    className={
                      deputyTab
                        ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                        : "section_top_subheading mt-3 py-3 cursorpointer"
                    }
                    onClick={() => setdeputyTab(!deputyTab)}
                  >
                    Deputy Director{" "}

                    <span className="btn-collapse">
                      <i className="bi bi-caret-down-fill"></i>
                    </span>
                  </h5>

                  <div className={deputyTab ? "customtab" : "d-none"}>


                    {allcomment?.map((cur, i) => {
                      if (cur.assignedToRoleID == 8) {
                        return (
                          <ul
                            className={
                              cur?.circularActivityData?.length >= 1
                                ? "nav nav-pills mb-3"
                                : "d-none"
                            }
                            role="tablist"
                          >
                            <li
                              className={roleID == 8 ? "nav-item" : "d-none"}
                              role="presentation"
                            >
                              <button
                                className={
                                  roleID == 8
                                    ? "nav-link w-100 border-radius0 active"
                                    : "nav-link w-100 border-radius0"
                                }
                                id="deputy"
                                data-bs-toggle="tab"
                                data-bs-target="#deputy-justified-home"
                                type="button"
                                role="tab"
                                aria-controls="home"
                                aria-selected="true"
                              >
                                Action
                              </button>
                            </li>

                            {cur?.circularActivityData
                              ?.slice()
                              ?.reverse()
                              .map((items, index) => {
                                return (
                                  <li className="nav-item" role="presentation">
                                    <button
                                      className={
                                        index == 0 && roleID != 8
                                          ? "nav-link w-100 border-radius0 active"
                                          : "nav-link border-radius0 w-100 "
                                      }
                                      id={"deputy" + index}
                                      data-bs-toggle="tab"
                                      data-bs-target={
                                        "#deputy-justified-home" + index
                                      }
                                      type="button"
                                      role="tab"
                                      aria-controls="home"
                                      aria-selected="true"
                                    >

                                      Response{" "}
                                      {cur?.circularActivityData?.length -
                                        index}
                                    </button>
                                  </li>
                                );
                              })}
                          </ul>
                        );
                      }
                    })
                    }

                    <div className="tab-content pt-2">
                      <div
                        className={
                          roleID >= 8
                            ? "tab-pane fade show active"
                            : "tab-pane fade show "
                        }
                        id="deputy-justified-home"
                        role="tabpanel"
                        aria-labelledby="deputy"
                      >
                        {Actiondata?.map((cur) => {
                          const firstItem = cur?.circularActivityData?.[0]; // Accessing the first element directly

                          if (cur?.assignedToRoleID === 8 && firstItem) {
                            // Check if firstItem exists
                            return (
                              <div className="bakgroundaction">
                                <div key={firstItem.actionID}>
                                  {" "}
                                  {/* Remember to add a unique key */}
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="inner_form_new">
                                        <label className="controlform">
                                          Action Type
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              // value={firstItem?.actionStatusName}
                                              value={
                                                firstItem?.actionStatusName ==
                                                  "Approved" ||
                                                  firstItem?.actionStatusName ==
                                                  "Reject" ||
                                                  firstItem?.actionStatusName ==
                                                  "Cancelled" ||
                                                  firstItem?.actionStatusName ==
                                                  "Draft"
                                                  ? "Assigned"
                                                  : firstItem?.actionStatusName
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          User{" "}
                                          <i
                                            className="bi bi-info-circle icons-info"
                                            title={`Role : ${firstItem?.actionRoleName}`}
                                          ></i>
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={firstItem?.actionUserName}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          {firstItem?.actionStatusName ==
                                            "Approved" ||
                                            firstItem?.actionStatusName ==
                                            "Reject" ||
                                            firstItem?.actionStatusName ==
                                            "Cancelled"
                                            ? "Assigned"
                                            : firstItem?.actionStatusName}{" "}
                                          Date
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={moment(
                                                firstItem?.createdDate
                                              ).format("DD/MMM/yyyy")}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionNotes
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Note
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionNotes}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionComment
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Comment
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionComment}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                        {/* next level data show and assign behalf of not equal userID  start*/}
                        {applicationDetail?.userID !== UserID.replace(/"/g, "") && roleID == 8 ?
                          <>
                            <div
                              className={
                                roleID == 8
                                  ? "inner_form_new align-items-center"
                                  : "d-none"
                              }
                            >
                              <label className="controlform">Next Action</label>
                              <div className="row">
                                <div className="col-md-12 my-2">
                                  <div className="hidden-toggles">
                                    <input
                                      type="radio"
                                      id="deptyrecomndByAnalyst"
                                      // onChange={(e) => {
                                      //   setcheckSupervisor(true);
                                      //   supervisorHangechangeRole(e);
                                      //   ChangeNextlevelHandle(e);
                                      //   GetRoleHandle(121);
                                      // }}
                                      onClick={() => {
                                        setRecomdAnalyst("121");
                                        setnextlevelvalue("");
                                        setAssignUserID("");
                                        setSupervisorRoleId("");
                                        setAsignUser([]);
                                        setapplicationstaus(
                                          applicationDetail?.analystRecommendation
                                        );
                                      }}
                                      name="nextactiondupty"
                                      className={
                                        applicationDetail?.analystRecommendation ==
                                          "" ||
                                          applicationDetail?.analystRecommendation ==
                                          "0"
                                          ? "d-none"
                                          : "hidden-toggles__input"
                                      }
                                      value="121"
                                      checked={
                                        recomdAnalyst == "121" ? true : false
                                      }
                                    />
                                    <label
                                      for="deptyrecomndByAnalyst"
                                      className={
                                        applicationDetail?.analystRecommendation ==
                                          "" ||
                                          applicationDetail?.analystRecommendation ==
                                          "0"
                                          ? "d-none"
                                          : "hidden-toggles__label"
                                      }
                                    >
                                      As Recommended by Analyst
                                    </label>

                                    <input
                                      type="radio"
                                      id="deptyasignto"
                                      onChange={(e) => {
                                        setcheckSupervisor(true);
                                        supervisorHangechangeRole(e);
                                        ChangeNextlevelHandle(e);
                                        setAssignUserID("");
                                        GetRoleHandle(10);
                                        setapplicationstaus(
                                          applicationDetail?.analystRecommendation
                                        );
                                      }}
                                      onClick={() => setRecomdAnalyst("")}
                                      name="nextactiondupty"
                                      className="hidden-toggles__input"
                                      value="10"
                                    />
                                    <label
                                      for="deptyasignto"
                                      className="hidden-toggles__label"
                                    >
                                      Assign
                                    </label>

                                    <input
                                      type="radio"
                                      id="deptyasignto-Refer"
                                      onChange={(e) => {
                                        ChangeNextlevelHandle(e);
                                        // ChangeApplicationStatus(e);
                                        setcheckSupervisor(true);
                                        GetRoleHandle(15);
                                        setAssignUserID("");
                                        setapplicationstaus(
                                          applicationDetail?.analystRecommendation
                                        );
                                      }}
                                      name="nextactiondupty"
                                      onClick={() => setRecomdAnalyst("")}
                                      value="15"
                                      className="hidden-toggles__input"
                                    />
                                    <label
                                      for="deptyasignto-Refer"
                                      className="hidden-toggles__label"
                                    >
                                      Refer Back
                                    </label>


                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className={checkSupervisor == true ? "row" : "d-none"}
                            >
                              <div className="col-md-12 d-flex c-gap">
                                <div
                                  className={
                                    nextlevelvalue == 15 ? "w-50" : "d-none"
                                  }
                                >
                                  {checkSupervisor == true && roleID == 8 ? (
                                    <>
                                      <div className="inner_form_new">
                                        <label className="controlform">Role</label>

                                        <div className="form-bx">
                                          <label>
                                            <select
                                              ref={assignedToRef}
                                              name="SupervisorRoleId"
                                              onChange={(e) => {
                                                supervisorHangechangeRole(e);
                                                handleUserRole(e);
                                              }}
                                              className={
                                                errors.assignedTo &&
                                                  !SupervisorRoleId
                                                  ? "error"
                                                  : ""
                                              }
                                            >
                                              <option value="">Select Role</option>
                                              {userRole?.map((item, index) => {
                                                return (
                                                  <option
                                                    key={index}
                                                    value={item.id}
                                                  >
                                                    {item.designation}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                            <span className="sspan"></span>
                                            {errors.assignedTo &&
                                              !SupervisorRoleId ? (
                                              <small className="errormsg">
                                                Role is required{" "}
                                              </small>
                                            ) : (
                                              ""
                                            )}
                                          </label>
                                        </div>
                                      </div>
                                      {/* end form-bx  */}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div
                                  className={
                                    nextlevelvalue == 15 ? "w-50" : "w-100"
                                  }
                                >
                                  {roleID == 8 && recomdAnalyst != "121" ? (
                                    <>
                                      <div className="inner_form_new">
                                        <label className="controlform">User</label>

                                        <div className="form-bx">
                                          <label>
                                            <select
                                              ref={assignedToRef}
                                              name="AssignUserID"
                                              onChange={(e) =>
                                                supervisorHangechange(e)
                                              }
                                              className={
                                                errors.assignUserID && !AssignUserID
                                                  ? "error"
                                                  : ""
                                              }
                                            >
                                              <option value="">Select User</option>
                                              {asignUser?.map((item, index) => {
                                                return (
                                                  <option
                                                    key={index}
                                                    value={item.userID}
                                                  >
                                                    {item.name}
                                                  </option>
                                                );
                                              })}
                                            </select>
                                            <span className="sspan"></span>
                                            {errors.assignUserID &&
                                              !AssignUserID ? (
                                              <small className="errormsg">
                                                {errors.assignUserID}
                                              </small>
                                            ) : (
                                              ""
                                            )}
                                          </label>
                                        </div>
                                      </div>
                                      {/* end form-bx  */}
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* end form-bx  */}
                              </div>
                            </div>
                            {roleID == 8 && <p>
                              {attachmentData?.map((items, index) => {
                                return (
                                  <div
                                    className="attachemt_form-bx  mt-2"
                                    key={items.id}
                                  >
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
                                          handleuserFileChange(e, "circular" + (index + 1))
                                        }
                                      />
                                    </div>
                                    <span className="filename">
                                      {userfiles?.find(
                                        (f) => f.id === "circular" + (index + 1)
                                      )?.file?.name || "No file chosen"}
                                    </span>
                                    {userfiles?.length &&
                                      userfiles?.find((f) => f.id === "circular" + (index + 1))
                                        ?.file?.name ? (
                                      <button
                                        type="button"
                                        className="remove-file"
                                        onClick={() =>
                                          removeUserImage(index, "circular" + (index + 1))
                                        }
                                      >
                                        Remove
                                      </button>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                );
                              })}

                              {otheruserfiles.map((file, index) => (
                                <div
                                  key={"other" + (index + 1)}
                                  className="attachemt_form-bx"
                                >
                                  <label
                                    style={{
                                      background: "#d9edf7",
                                      padding: "9px 3px",
                                      border: "0px",
                                    }}
                                  >
                                    <b>
                                      Other File
                                      {index + 1}
                                    </b>
                                  </label>
                                  <div className="browse-btn">
                                    Browse{" "}
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        handleuserFileChange(e, "other" + index);
                                        // handleOthrefile(e,   `other ${index}`);
                                      }}
                                    />
                                  </div>
                                  <span className="filename">
                                    {userfiles?.find((f) => f.id === "other" + index)
                                      ?.file?.name || "No file chosen"}
                                  </span>

                                  {userfiles?.length &&
                                    userfiles?.find((f) => f.id === "other" + index)
                                      ?.file?.name ? (
                                    <button
                                      type="button"
                                      className="remove-file"
                                      onClick={() =>
                                        removeUserImage(index, "other" + index)
                                      }
                                    >
                                      Remove
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ))}

                              {otheruserfiles?.length || userfiles?.length ? (
                                <div className="attachemt_form-bx">
                                  <label style={{ border: "0px" }}>{""}</label>
                                  <button
                                    type="button"
                                    className="addmore-btn mt-0"
                                    onClick={(e) => handleuserAddMore(e)}
                                  >
                                    {" "}
                                    Add More File{" "}
                                  </button>
                                </div>
                              ) : (
                                ""
                              )}
                            </p>}
                            {/* end form-bx  */}

                            <div
                              className={roleID == 8 ? "inner_form_new align-items-start" : "d-none"}
                            >
                              <label className="controlform">Recommendation</label>
                              <div className="form-bx editorFieldBox">
                                <div className="mt-2 py-1">
                                  <MenuBar editor={editorDeputy} />
                                  <EditorContent editor={editorDeputy} />
                                  <span className="sspan"></span>
                                  {(errors.Description && Description == " ") ||
                                    Description == null ||
                                    Description == "<p></p>" ||
                                    !Description ? (
                                    <small className="errormsg">
                                      {errors.Description}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>

                            <div
                              className={roleID == 8 ? "inner_form_new " : "d-none"}
                            >
                              <label className="controlform">
                                {nextlevelvalue == "10"
                                  ? "Assign Notes"
                                  : nextlevelvalue == "20"
                                    ? "Delegate Notes"
                                    : nextlevelvalue == "35"
                                      ? "Referred to Other Department Notes"
                                      : nextlevelvalue == "15"
                                        ? "Refer Back Notes"
                                        : "Notes"}
                              </label>

                              <div className="form-bx">
                                <label>
                                  <textarea
                                    name="Notes"
                                    onChange={(e) => {
                                      HandleNextleveldata(e);
                                    }}
                                    placeholder={
                                      nextlevelvalue == "10"
                                        ? "Assign Notes"
                                        : nextlevelvalue == "20"
                                          ? "Delegate Notes"
                                          : nextlevelvalue == "35"
                                            ? "Referred to Other Department Notes"
                                            : nextlevelvalue == "15"
                                              ? "Refer Back Notes"
                                              : "Notes"
                                    }
                                    className={errors.Notes ? "error" : ""}
                                    value={asignnextLeveldata.Notes}
                                  />
                                  <span className="sspan"></span>
                                  {errors.Notes ? (
                                    <small className="errormsg">
                                      {nextlevelvalue == "10"
                                        ? "Assign notes is required"
                                        : nextlevelvalue == "20"
                                          ? "Delegate notes is required"
                                          : nextlevelvalue == "35"
                                            ? "Referred to other department notes is required"
                                            : nextlevelvalue == "15"
                                              ? "Refer back notes is required"
                                              : "Notes is required"}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </label>
                              </div>
                            </div>
                            {/* end form-bx  */}

                            <div
                              className={roleID == 8 ? "inner_form_new " : "d-none"}
                            >
                              <label className="controlform">
                                {nextlevelvalue == "10"
                                  ? "Assign Comments"
                                  : nextlevelvalue == "20"
                                    ? "Delegate Comments"
                                    : nextlevelvalue == "35"
                                      ? "Referred to Other Department Comments"
                                      : nextlevelvalue == "15"
                                        ? "Refer Back Comments"
                                        : "Comments"}
                              </label>

                              <div className="form-bx">
                                <label>
                                  <textarea
                                    name="Comment"
                                    onChange={(e) => {
                                      HandleNextleveldata(e);
                                    }}
                                    placeholder={
                                      nextlevelvalue == "10"
                                        ? "Assign Comments"
                                        : nextlevelvalue == "20"
                                          ? "Delegate Comments"
                                          : nextlevelvalue == "35"
                                            ? "Referred to Other Department Comments"
                                            : nextlevelvalue == "15"
                                              ? "Refer Back Comments"
                                              : "Comments"
                                    }
                                    className={errors.Comment ? "error" : ""}
                                    value={asignnextLeveldata.Comment}
                                  />
                                  <span className="sspan"></span>
                                  {errors.Comment ? (
                                    <small className="errormsg">
                                      {nextlevelvalue == "10"
                                        ? "Assign comments is required"
                                        : nextlevelvalue == "20"
                                          ? "Delegate comments is required"
                                          : nextlevelvalue == "35"
                                            ? "Referred to other department comments is required"
                                            : nextlevelvalue == "15"
                                              ? "Refer back comments is required"
                                              : "Comments is required"}
                                    </small>
                                  ) : (
                                    ""
                                  )}
                                </label>
                              </div>
                            </div>

                            <div className={roleID == 8 ? "inner_form_new align-items-start" : "d-none"}>
                              <label className="controlform">Bank</label>
                              <div className=" cccto">
                                <div className="flex justify-content-center multiSelect">
                                  <CustomBankMultiSelect
                                    key="multyselectprinciple"
                                    options={vOption}
                                    onChange={(e) => handleChangeBank(e)}
                                    value={selectedBanks}
                                    isSelectAll={true}
                                    menuPlacement={"bottom"}

                                  />


                                </div>
                              </div>
                            </div>
                            {/* end form-bx  */}
                            <div className={roleID == 8 ? "inner_form_new" : "d-none"}>
                              <label className="controlform">Directives</label>
                              <div className="cccto">
                                <div className="flex justify-content-center multiSelect">
                                  <DirectiveMultiSelectComponent
                                    key="multyselectprinciple"
                                    options={DirectiveOption}
                                    onChange={(e) => handleChangeDirective(e)}
                                    value={selectedDirectives}
                                    isSelectAll={true}

                                    menuPlacement={"bottom"}

                                  />
                                </div>
                              </div>
                            </div>
                            {/* end form-bx  */}

                            {/* end form-bx  */}
                            <div className={roleID == 8 ? "inner_form_new" : "d-none"}>
                              <label className="controlform">Releasing Date</label>
                              <div className="form-bx">
                                <DatePicker
                                  placeholderText="Select Releasing Date"
                                  closeOnScroll={(e) => e.target === document}
                                  selected={releasingDate ? releasingDate : applicationDetail.releasingDate}
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

                            <div
                              className={
                                (roleID == 8 && nextlevelvalue == "") ||
                                  recomdAnalyst == "121"
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
                                        GetRoleHandle(10);
                                        // supervisorHangechangeRole(e);
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

                                    {/* <input
                                  type="radio"
                                  id="srcoloration-Rejected"
                                  value="30"
                                  onChange={(e) => {
                                    ChangeApplicationStatus(e);
                                   
                                  }}
                                  name="applicationstausdp"
                                  className="hidden-toggles__input"
                                  checked={
                                    applicationstaus == "30" ? true : false
                                  }
                                />
                                <label
                                  for="srcoloration-Rejected"
                                  className="hidden-toggles__label"
                                >
                                  Rejected
                                </label> */}

                                    {/* <input
                                  type="radio"
                                  id="srcoloration-Deferred"
                                  onChange={(e) => {
                                    ChangeApplicationStatus(e);
                                   
                                  }}
                                  name="applicationstausdp"
                                  value="40"
                                  className="hidden-toggles__input"
                                  checked={
                                    applicationstaus == "40" ? true : false
                                  }
                                />
                                <label
                                  for="srcoloration-Deferred"
                                  className="hidden-toggles__label"
                                >
                                  Deferred
                                </label> */}

                                    <input
                                      type="radio"
                                      id="srcoloration-Cancelled"
                                      onChange={(e) => {
                                        ChangeApplicationStatus(e);

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
                          </> : (
                            <span>
                              {/* {noDataComment?.map((v, i) => {
                              if (v.roleID == 8 && v.isDataAvailable == 0) {
                                return (
                                  <div className={deputyTab ? "customtab" : "d-none"}>
                                    <div class="text-center">No Data Found</div>
                                  </div>
                                );
                              }
                            })} */}
                            </span>
                          )
                        }
                        {/* next level data show and assign behalf of not equal userID  end*/}
                      </div>

                      {allcomment?.map((cur) => {
                        return cur?.circularActivityData
                          ?.slice()
                          ?.reverse()
                          .map((item, index) => {
                            if (cur?.assignedToRoleID == 8) {
                              return (
                                <>
                                  <div
                                    key={index}
                                    className={
                                      index == 0 && roleID != 8
                                        ? "tab-pane fade show active"
                                        : "tab-pane fade show  "
                                    }
                                    id={"deputy-justified-home" + index}
                                    role="tabpanel"
                                    aria-labelledby={"deputy" + index}
                                  >
                                    <div className={item?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action Type
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  // value={item?.actionStatusName}
                                                  value={
                                                    item?.actionStatusName ==
                                                      "Approved" ||
                                                      item?.actionStatusName ==
                                                      "Reject" ||
                                                      item?.actionStatusName ==
                                                      "Cancelled" ||
                                                      item?.actionStatusName ==
                                                      "Draft"
                                                      ? "Assigned"
                                                      : item?.actionStatusName
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-3">
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              User{" "}
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${item?.actionRoleName}`}
                                              ></i>
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={item?.actionUserName}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-3">
                                          <div className="inner_form_new-sm">
                                            <label className="controlform-sm">
                                              {item?.actionStatusName ==
                                                "Approved" ||
                                                item?.actionStatusName ==
                                                "Reject" ||
                                                item?.actionStatusName ==
                                                "Cancelled"
                                                ? "Assigned"
                                                : item?.actionStatusName}{" "}
                                              Date
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={moment(
                                                    item?.createdDate
                                                  ).format("DD/MMM/yyyy")}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionNotes
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Note
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={item?.actionNotes}
                                            />
                                          </label>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionComment
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Comment
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={item?.actionComment}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>



                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Recommendation
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <div
                                            className="tableEditorData disabled viewdiscription"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.content
                                                ? item?.content
                                                : "N/A",
                                            }}
                                            disabled
                                          />
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Notes
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            name="Notes"
                                            placeholder="Notes"
                                            className=""
                                            disabled
                                          >
                                            {item?.notes ? item?.notes : "N/A"}
                                          </textarea>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Comments
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            name="Notes"
                                            placeholder="Notes"
                                            className=""
                                            disabled
                                          >
                                            {item?.comment
                                              ? item?.comment
                                              : "N/A"}
                                          </textarea>
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Attachments
                                      </label>
                                      <div className="form-bx">
                                        {item?.filesData?.length ? (
                                          item?.filesData?.map(
                                            (items, index) => {
                                              return (
                                                <div
                                                  className="attachemt_form-bx mb-0 width-80"
                                                  key={items.id}
                                                >
                                                  <label className="mb-2 mb-0 pt-2 pb-2">
                                                    {/* {items.filename} */}
                                                    {items?.fileName
                                                      ? items?.fileName
                                                      : `FileUpload ${index}`}
                                                  </label>
                                                  <div
                                                    className={
                                                      roleID == 2 || roleID == 3
                                                        ? "browse-btn"
                                                        : "d-none"
                                                    }
                                                  >
                                                    Browse{" "}
                                                    <input
                                                      type="file"
                                                      onChange={(e) =>
                                                        handleFileChange(
                                                          e,
                                                          items.id
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                  <span className="filename">
                                                    <Link
                                                      to={items?.filePath}
                                                      target="_blank"
                                                      className="viewbtn"
                                                    >
                                                      View File
                                                    </Link>
                                                  </span>
                                                </div>
                                              );
                                            }
                                          )
                                        ) : (
                                          <label className="notfound">
                                            File Not Found
                                          </label>
                                        )}
                                      </div>
                                    </div>

                                    {/* <div className="inner_form_new ">
                                      <label className="controlform">
                                        Bank 
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.bankData
                                              ?.length ? (
                                              item?.bankData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.bankName}</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Directives
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.directiveData
                                              ?.length ? (
                                              item?.directiveData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.directiveName}</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div> */}
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Releasing Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              item?.releasingDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div
                                      className={
                                        item?.assignedToName == null &&
                                          item?.assignedToName == null
                                          ? "d-none"
                                          : "row"
                                      }
                                    >
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Assigned To Role
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.roleName
                                                    ? item?.roleName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            Assigned To User
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.assignedToName
                                                    ? item?.assignedToName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          });
                      })}

                    </div>
                  </div>
                </>
              ) : (
                ""
              )}

              {/* Dupty director code end */}
              {/* director code start */}

              {roleID >= 9 ? (
                <>
                  <h5
                    className={
                      director
                        ? "section_top_subheading mt-3 py-3 btn-collapse_active cursorpointer"
                        : "section_top_subheading mt-3 py-3 cursorpointer"
                    }
                    onClick={() => setdirector(!director)}
                  >
                    Director{" "}

                    <span className="btn-collapse">
                      <i className="bi bi-caret-down-fill"></i>
                    </span>
                  </h5>

                  <div className={director ? "customtab mb-3" : "d-none"}>



                    {allcomment?.map((cur, i) => {
                      if (cur.assignedToRoleID == 9) {
                        return (
                          <ul
                            className={
                              cur?.circularActivityData?.length >= 1
                                ? "nav nav-pills mb-3"
                                : "d-none"
                            }
                            role="tablist"
                          >
                            <li
                              className={roleID == 9 ? "nav-item" : "d-none"}
                              role="presentation"
                            >
                              <button
                                className={
                                  roleID == 9
                                    ? "nav-link w-100 border-radius0 active"
                                    : "nav-link w-100 border-radius0"
                                }
                                id="director"
                                data-bs-toggle="tab"
                                data-bs-target="#director-justified-home"
                                type="button"
                                role="tab"
                                aria-controls="home"
                                aria-selected="true"
                              >
                                Action
                              </button>
                            </li>

                            {cur?.circularActivityData
                              ?.slice()
                              ?.reverse()
                              .map((items, index) => {
                                return (
                                  <li className="nav-item" role="presentation">
                                    <button
                                      className={
                                        index == 0 && roleID != 9
                                          ? "nav-link w-100 border-radius0 active"
                                          : "nav-link border-radius0 w-100 "
                                      }
                                      id={"director" + index}
                                      data-bs-toggle="tab"
                                      data-bs-target={
                                        "#director-justified-home" + index
                                      }
                                      type="button"
                                      role="tab"
                                      aria-controls="home"
                                      aria-selected="true"
                                    >

                                      Response{" "}
                                      {cur?.circularActivityData?.length -
                                        index}
                                    </button>
                                  </li>
                                );
                              })}
                          </ul>
                        );
                      }
                    })
                    }


                    <div className="tab-content pt-2 mb-2">
                      <div
                        className={
                          roleID >= 9
                            ? "tab-pane fade show active"
                            : "tab-pane fade show "
                        }
                        id="director-justified-home"
                        role="tabpanel"
                        aria-labelledby="director"
                      >
                        {Actiondata?.map((cur) => {
                          const firstItem = cur?.circularActivityData?.[0]; // Accessing the first element directly

                          if (cur?.assignedToRoleID === 9 && firstItem) {
                            // Check if firstItem exists
                            return (
                              <div className="bakgroundaction">
                                <div key={firstItem.actionID}>
                                  {" "}
                                  {/* Remember to add a unique key */}
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="inner_form_new">
                                        <label className="controlform">
                                          Action Type
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              // value={firstItem?.actionStatusName}
                                              value={
                                                firstItem?.actionStatusName ==
                                                  "Approved" ||
                                                  firstItem?.actionStatusName ==
                                                  "Reject" ||
                                                  firstItem?.actionStatusName ==
                                                  "Cancelled" ||
                                                  firstItem?.actionStatusName ==
                                                  "Draft"
                                                  ? "Assigned"
                                                  : firstItem?.actionStatusName
                                              }
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          User{" "}
                                          <i
                                            className="bi bi-info-circle icons-info"
                                            title={`Role : ${firstItem?.actionRoleName}`}
                                          ></i>
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            {" "}
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={firstItem?.actionUserName}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-md-3">
                                      <div className="inner_form_new-sm">
                                        <label className="controlform-sm">
                                          {firstItem?.actionStatusName ==
                                            "Approved" ||
                                            firstItem?.actionStatusName ==
                                            "Reject" ||
                                            firstItem?.actionStatusName ==
                                            "Cancelled"
                                            ? "Assigned"
                                            : firstItem?.actionStatusName}{" "}
                                          Date
                                        </label>
                                        <div className="form-bx-sm">
                                          <label>
                                            <input
                                              type="text"
                                              className=""
                                              disabled
                                              value={moment(
                                                firstItem?.createdDate
                                              ).format("DD/MMM/yyyy")}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionNotes
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Note
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionNotes}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      firstItem?.actionComment
                                        ? "inner_form_new"
                                        : "d-none"
                                    }
                                  >
                                    <label className="controlform">
                                      Action Comment
                                    </label>
                                    <div className="form-bx">
                                      <label>
                                        {" "}
                                        <textarea
                                          type="text"
                                          className=""
                                          disabled
                                          value={firstItem?.actionComment}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}
                        {/* next level data show and assign behalf of not equal userID  start*/}
                        {applicationDetail?.userID !== UserID.replace(/"/g, "") && roleID == 9 ? <>
                          <div
                            className={
                              roleID == 9
                                ? "inner_form_new align-items-center"
                                : "d-none"
                            }
                          >
                            <label className="controlform">Next Action</label>
                            <div className="row">
                              <div className="col-md-12 my-2">
                                <div className="hidden-toggles">
                                  <input
                                    type="radio"
                                    id="direcotsrecomndByAnalyst"
                                    name="nextactionbuton"
                                    onClick={() => {
                                      setRecomdAnalyst("121");
                                      setnextlevelvalue("");
                                      setAssignUserID("");
                                      setSupervisorRoleId("");
                                      setAsignUser([]);
                                      setapplicationstaus(
                                        applicationDetail?.analystRecommendation
                                      );
                                    }}
                                    className={
                                      applicationDetail?.analystRecommendation ==
                                        "" ||
                                        applicationDetail?.analystRecommendation ==
                                        "0"
                                        ? "d-none"
                                        : "hidden-toggles__input"
                                    }
                                    value="121"
                                    checked={
                                      recomdAnalyst == "121" ? true : false
                                    }
                                  />
                                  <label
                                    for="direcotsrecomndByAnalyst"
                                    className={
                                      applicationDetail?.analystRecommendation ==
                                        "" ||
                                        applicationDetail?.analystRecommendation ==
                                        "0"
                                        ? "d-none"
                                        : "hidden-toggles__label"
                                    }
                                  >
                                    As Recommended by Analyst
                                  </label>

                                  <input
                                    type="radio"
                                    id="direcotsRefer"
                                    onChange={(e) => {
                                      ChangeNextlevelHandle(e);
                                      // ChangeApplicationStatus(e);
                                      setcheckSupervisor(true);
                                      GetRoleHandle(15);
                                      setapplicationstaus(
                                        applicationDetail?.analystRecommendation
                                      );
                                    }}
                                    name="nextactionbuton"
                                    onClick={() => setRecomdAnalyst("")}
                                    value="15"
                                    className="hidden-toggles__input"
                                  />
                                  <label
                                    for="direcotsRefer"
                                    className="hidden-toggles__label"
                                  >
                                    Refer Back
                                  </label>


                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className={checkSupervisor == true ? "row" : "d-none"}
                          >
                            <div className="col-md-12 d-flex c-gap">
                              <div
                                className={
                                  nextlevelvalue == 15 ? "w-50" : "d-none"
                                }
                              >
                                {checkSupervisor == true && roleID == 9 ? (
                                  <>
                                    <div className="inner_form_new">
                                      <label className="controlform">Role</label>

                                      <div className="form-bx">
                                        <label>
                                          <select
                                            ref={assignedToRef}
                                            name="SupervisorRoleId"
                                            onChange={(e) => {
                                              supervisorHangechangeRole(e);
                                              handleUserRole(e);
                                            }}
                                            className={
                                              errors.assignedTo &&
                                                !SupervisorRoleId
                                                ? "error"
                                                : ""
                                            }
                                          >
                                            <option value="">Select Role</option>
                                            {userRole?.map((item, index) => {
                                              return (
                                                <option
                                                  key={index}
                                                  value={item.id}
                                                >
                                                  {item.designation}
                                                </option>
                                              );
                                            })}
                                          </select>
                                          <span className="sspan"></span>
                                          {errors.assignedTo &&
                                            !SupervisorRoleId ? (
                                            <small className="errormsg">
                                              Role is required{" "}
                                            </small>
                                          ) : (
                                            ""
                                          )}
                                        </label>
                                      </div>
                                    </div>
                                    {/* end form-bx  */}
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div
                                className={
                                  nextlevelvalue == 15 ? "w-50" : "w-100"
                                }
                              >
                                {roleID == 9 && recomdAnalyst != "121" ? (
                                  <>
                                    <div className="inner_form_new">
                                      <label className="controlform">User</label>

                                      <div className="form-bx">
                                        <label>
                                          <select
                                            ref={assignedToRef}
                                            name="AssignUserID"
                                            onChange={(e) =>
                                              supervisorHangechange(e)
                                            }
                                            className={
                                              errors.assignUserID && !AssignUserID
                                                ? "error"
                                                : ""
                                            }
                                          >
                                            <option value="">Select User</option>
                                            {asignUser?.map((item, index) => {
                                              return (
                                                <option
                                                  key={index}
                                                  value={item.userID}
                                                >
                                                  {item.name}
                                                </option>
                                              );
                                            })}
                                          </select>
                                          <span className="sspan"></span>
                                          {errors.assignUserID &&
                                            !AssignUserID ? (
                                            <small className="errormsg">
                                              {errors.assignUserID}
                                            </small>
                                          ) : (
                                            ""
                                          )}
                                        </label>
                                      </div>
                                    </div>
                                    {/* end form-bx  */}
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>

                              {/* end form-bx  */}
                            </div>
                          </div>
                          {roleID == 9 && <p>
                            {attachmentData?.map((items, index) => {
                              return (
                                <div
                                  className="attachemt_form-bx  mt-2"
                                  key={items.id}
                                >
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
                                        handleuserFileChange(e, "circular" + (index + 1))
                                      }
                                    />
                                  </div>
                                  <span className="filename">
                                    {userfiles?.find(
                                      (f) => f.id === "circular" + (index + 1)
                                    )?.file?.name || "No file chosen"}
                                  </span>
                                  {userfiles?.length &&
                                    userfiles?.find((f) => f.id === "circular" + (index + 1))
                                      ?.file?.name ? (
                                    <button
                                      type="button"
                                      className="remove-file"
                                      onClick={() =>
                                        removeUserImage(index, "circular" + (index + 1))
                                      }
                                    >
                                      Remove
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              );
                            })}

                            {otheruserfiles.map((file, index) => (
                              <div
                                key={"other" + (index + 1)}
                                className="attachemt_form-bx"
                              >
                                <label
                                  style={{
                                    background: "#d9edf7",
                                    padding: "9px 3px",
                                    border: "0px",
                                  }}
                                >
                                  <b>
                                    Other File
                                    {index + 1}
                                  </b>
                                </label>
                                <div className="browse-btn">
                                  Browse{" "}
                                  <input
                                    type="file"
                                    onChange={(e) => {
                                      handleuserFileChange(e, "other" + index);
                                      handleOthrefile(e, `other ${index}`);
                                    }}
                                  />
                                </div>
                                <span className="filename">
                                  {userfiles?.find((f) => f.id === "other" + index)
                                    ?.file?.name || "No file chosen"}
                                </span>

                                {userfiles?.length &&
                                  userfiles?.find((f) => f.id === "other" + index)
                                    ?.file?.name ? (
                                  <button
                                    type="button"
                                    className="remove-file"
                                    onClick={() =>
                                      removeUserImage(index, "other" + index)
                                    }
                                  >
                                    Remove
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            ))}

                            {otheruserfiles?.length || userfiles?.length ? (
                              <div className="attachemt_form-bx">
                                <label style={{ border: "0px" }}>{""}</label>
                                <button
                                  type="button"
                                  className="addmore-btn mt-0"
                                  onClick={(e) => handleuserAddMore(e)}
                                >
                                  {" "}
                                  Add More File{" "}
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </p>}
                          <div
                            className={
                              roleID == 9
                                ? "inner_form_new align-items-start mt-2"
                                : "d-none"
                            }
                          >
                            <label className="controlform">Recommendation</label>
                            <div className="form-bx editorFieldBox">
                              <div className="mt-2 py-1">
                                <MenuBar editor={editorDirector} />
                                <EditorContent editor={editorDirector} />
                                <span className="sspan"></span>
                                {(errors.Description && Description == " ") ||
                                  Description == null ||
                                  Description == "<p></p>" ||
                                  !Description ||
                                  Description == "<p><br></p>" ? (
                                  <small
                                    className="errormsg"
                                    style={{ bottom: "-13px" }}
                                  >
                                    {errors.Description}
                                  </small>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>

                          <div
                            className={roleID == 9 ? "inner_form_new " : "d-none"}
                          >
                            <label className="controlform">
                              {nextlevelvalue == "10"
                                ? "Assign Notes"
                                : nextlevelvalue == "20"
                                  ? "Delegate Notes"
                                  : nextlevelvalue == "35"
                                    ? "Referred to Other Department Notes"
                                    : nextlevelvalue == "15"
                                      ? "Refer Back Notes"
                                      : "Notes"}
                            </label>

                            <div className="form-bx">
                              <label>
                                <textarea
                                  name="Notes"
                                  onChange={(e) => {
                                    HandleNextleveldata(e);
                                  }}
                                  placeholder={
                                    nextlevelvalue == "10"
                                      ? "Assign Notes"
                                      : nextlevelvalue == "20"
                                        ? "Delegate Notes"
                                        : nextlevelvalue == "35"
                                          ? "Referred to Other Department Notes"
                                          : nextlevelvalue == "15"
                                            ? "Refer Back Notes"
                                            : "Notes"
                                  }
                                  className={errors.Notes ? "error" : ""}
                                  value={asignnextLeveldata.Notes}
                                />
                                <span className="sspan"></span>
                                {errors.Notes ? (
                                  <small className="errormsg">
                                    {nextlevelvalue == "10"
                                      ? "Assign notes is required"
                                      : nextlevelvalue == "20"
                                        ? "Delegate notes is required"
                                        : nextlevelvalue == "35"
                                          ? "Referred to other department notes is required"
                                          : nextlevelvalue == "15"
                                            ? "Refer back notes is required"
                                            : "Notes is required"}
                                  </small>
                                ) : (
                                  ""
                                )}
                              </label>
                            </div>
                          </div>
                          {/* end form-bx  */}

                          <div
                            className={roleID == 9 ? "inner_form_new " : "d-none"}
                          >
                            <label className="controlform">
                              {nextlevelvalue == "10"
                                ? "Assign Comments"
                                : nextlevelvalue == "20"
                                  ? "Delegate Comments"
                                  : nextlevelvalue == "35"
                                    ? "Referred to Other Department Comments"
                                    : nextlevelvalue == "15"
                                      ? "Refer Back Comments"
                                      : "Comments"}
                            </label>

                            <div className="form-bx">
                              <label>
                                <textarea
                                  name="Comment"
                                  onChange={(e) => {
                                    HandleNextleveldata(e);
                                  }}
                                  placeholder={
                                    nextlevelvalue == "10"
                                      ? "Assign Comments"
                                      : nextlevelvalue == "20"
                                        ? "Delegate Comments"
                                        : nextlevelvalue == "35"
                                          ? "Referred to Other Department Comments"
                                          : nextlevelvalue == "15"
                                            ? "Refer Back Comments"
                                            : "Comments"
                                  }
                                  className={errors.Comment ? "error" : ""}
                                  value={asignnextLeveldata.Comment}
                                />
                                <span className="sspan"></span>
                                {errors.Comment ? (
                                  <small className="errormsg">
                                    {nextlevelvalue == "10"
                                      ? "Assign comments is required"
                                      : nextlevelvalue == "20"
                                        ? "Delegate comments is required"
                                        : nextlevelvalue == "35"
                                          ? "Referred to other department comments is required"
                                          : nextlevelvalue == "15"
                                            ? "Refer back comments is required"
                                            : "Comments is required"}
                                  </small>
                                ) : (
                                  ""
                                )}
                              </label>
                            </div>
                          </div>

                          <div className={roleID == 9 ? "inner_form_new align-items-center" : "d-none"}>
                            <label className="controlform">Bank</label>
                            <div className="cccto">
                              <div className="flex justify-content-center multiSelect">
                                <CustomBankMultiSelect
                                  key="multyselectprinciple"
                                  options={vOption}
                                  onChange={(e) => handleChangeBank(e)}
                                  value={selectedBanks}
                                  isSelectAll={true}
                                  menuPlacement={"bottom"}
                                />
                              </div>
                            </div>
                          </div>

                          {/* end form-bx  */}
                          <div className={roleID == 9 ? "inner_form_new" : "d-none"}>
                            <label className="controlform">Directives</label>
                            <div className="cccto">
                              <div className="flex justify-content-center multiSelect">
                                <DirectiveMultiSelectComponent
                                  key="multyselectprinciple"
                                  options={DirectiveOption}
                                  onChange={(e) => handleChangeDirective(e)}
                                  value={selectedDirectives}
                                  isSelectAll={true}

                                  menuPlacement={"bottom"}

                                />
                              </div>
                            </div>
                          </div>
                          {/* end form-bx  */}

                          {/* end form-bx  */}
                          <div className={roleID == 9 ? "inner_form_new" : "d-none"}>
                            <label className="controlform">Releasing Date</label>
                            <div className="form-bx">
                              <DatePicker
                                placeholderText="Select Releasing Date"
                                closeOnScroll={(e) => e.target === document}
                                selected={releasingDate ? releasingDate : applicationDetail.releasingDate}
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
                          <div
                            className={
                              (roleID == 9 && nextlevelvalue == "") ||
                                recomdAnalyst == "121"
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
                                    id="srcoloration-Approvedved5"
                                    value="10"
                                    onChange={(e) => {
                                      ChangeApplicationStatus(e);
                                      GetRoleHandle(10);
                                      // supervisorHangechangeRole(e);
                                    }}
                                    name="applicationstausdir"
                                    className="hidden-toggles__input"
                                    checked={
                                      applicationstaus == "10" ? true : false
                                    }
                                  />
                                  <label
                                    for="srcoloration-Approvedved5"
                                    className="hidden-toggles__label"
                                  >
                                    Approved
                                  </label>

                                  {/* <input
                                  type="radio"
                                  id="srcoloration-Rejected"
                                  value="30"
                                  onChange={(e) => {
                                    ChangeApplicationStatus(e);
                                   
                                  }}
                                  name="applicationstausdir"
                                  className="hidden-toggles__input"
                                  checked={
                                    applicationstaus == "30" ? true : false
                                  }
                                />
                                <label
                                  for="srcoloration-Rejected"
                                  className="hidden-toggles__label"
                                >
                                  Rejected
                                </label> */}

                                  {/* <input
                                  type="radio"
                                  id="srcoloration-Deferred"
                                  onChange={(e) => {
                                    ChangeApplicationStatus(e);
                                    
                                  }}
                                  name="applicationstausdir"
                                  value="40"
                                  className="hidden-toggles__input"
                                  checked={
                                    applicationstaus == "40" ? true : false
                                  }
                                />
                                <label
                                  for="srcoloration-Deferred"
                                  className="hidden-toggles__label"
                                >
                                  Deferred
                                </label> */}

                                  <input
                                    type="radio"
                                    id="srcoloration-Cancelled"
                                    onChange={(e) => {
                                      ChangeApplicationStatus(e);

                                    }}
                                    name="applicationstausdir"
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
                        </> : (<span>
                          {/* {noDataComment?.map((data, i) => {
                            if (data.roleID == 9 && data.isDataAvailable == 0) {
                              return (
                                <div
                                  className={director ? "customtab" : "d-none"}
                                  key={i}
                                >
                                  <div class="text-center">No Data Found</div>
                                </div>
                              );
                            }
                          })} */}
                        </span>)}
                        {/* next level data show and assign behalf of not equal userID  start*/}
                      </div>

                      {allcomment?.map((cur, indexcomment) => {
                        return cur?.circularActivityData
                          ?.slice()
                          ?.reverse()
                          ?.map((item, index) => {
                            if (cur?.assignedToRoleID == 9) {
                              return (
                                <>
                                  <div
                                    key={index}
                                    className={
                                      index == 0 && roleID != 9
                                        ? "tab-pane fade show active"
                                        : "tab-pane fade show  "
                                    }
                                    id={"director-justified-home" + index}
                                    role="tabpanel"
                                    aria-labelledby={"director" + index}
                                  >
                                    <div className={item?.actionStatusName ? "bakgroundaction" : "d-none"}>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="inner_form_new ">
                                            <label className="controlform">
                                              Action Type
                                            </label>
                                            <div className="form-bx">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  // value={item?.actionStatusName}
                                                  value={
                                                    item?.actionStatusName ==
                                                      "Approved" ||
                                                      item?.actionStatusName ==
                                                      "Reject" ||
                                                      item?.actionStatusName ==
                                                      "Cancelled" ||
                                                      item?.actionStatusName ==
                                                      "Draft"
                                                      ? "Assigned"
                                                      : item?.actionStatusName
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div
                                          className={
                                            item?.actionUserNam
                                              ? "col-md-3"
                                              : "d-none"
                                          }
                                        >
                                          <div className="inner_form_new-sm ">
                                            <label className="controlform-sm">
                                              User{" "}
                                              <i
                                                className="bi bi-info-circle icons-info"
                                                title={`Role : ${item?.actionRoleName}`}
                                              ></i>
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={item?.actionUserName}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>

                                        <div
                                          className={
                                            item?.actionUserNam
                                              ? "col-md-3"
                                              : "col-md-6"
                                          }
                                        >
                                          <div className="inner_form_new-sm">
                                            <label className="controlform-sm">
                                              {item?.actionStatusName ==
                                                "Approved" ||
                                                item?.actionStatusName ==
                                                "Reject" ||
                                                item?.actionStatusName ==
                                                "Cancelled"
                                                ? "Assigned"
                                                : item?.actionStatusName}{" "}
                                              Date
                                            </label>
                                            <div className="form-bx-sm">
                                              <label>
                                                <input
                                                  type="text"
                                                  className=""
                                                  disabled
                                                  value={moment(
                                                    item?.createdDate
                                                  ).format("DD/MMM/yyyy")}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionNotes
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Note
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={item?.actionNotes}
                                            />
                                          </label>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          item?.actionComment
                                            ? "inner_form_new "
                                            : "d-none"
                                        }
                                      >
                                        <label className="controlform">
                                          Action Comment
                                        </label>
                                        <div className="form-bx">
                                          <label>
                                            <textarea
                                              disabled
                                              value={item?.actionComment}
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Recommendation
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <div
                                            className="tableEditorData disabled viewdiscription"
                                            dangerouslySetInnerHTML={{
                                              __html: item?.content
                                                ? item?.content
                                                : "N/A",
                                            }}
                                            disabled
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Notes
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            name="Notes"
                                            placeholder="Notes"
                                            className=""
                                            disabled
                                          >
                                            {item?.notes}
                                          </textarea>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Comments
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <textarea
                                            name="Notes"
                                            placeholder="Comments"
                                            className=""
                                            disabled
                                          >
                                            {item?.comment}
                                          </textarea>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Attachments
                                      </label>
                                      <div className="form-bx">
                                        {item?.filesData?.length ? (
                                          item?.filesData?.map(
                                            (items, index) => {
                                              return (
                                                <div
                                                  className="attachemt_form-bx mb-0 width-80"
                                                  key={items.id}
                                                >
                                                  <label className="mb-2 mb-0 pt-2 pb-2">
                                                    {/* {items.filename} */}
                                                    {items?.fileName
                                                      ? items?.fileName
                                                      : `FileUpload ${index}`}
                                                  </label>
                                                  <div
                                                    className={
                                                      roleID == 2 || roleID == 3
                                                        ? "browse-btn"
                                                        : "d-none"
                                                    }
                                                  >
                                                    Browse{" "}
                                                    <input
                                                      type="file"
                                                      onChange={(e) =>
                                                        handleFileChange(
                                                          e,
                                                          items.id
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                  <span className="filename">
                                                    <Link
                                                      to={items?.filePath}
                                                      target="_blank"
                                                      className="viewbtn"
                                                    >
                                                      View File
                                                    </Link>
                                                  </span>
                                                </div>
                                              );
                                            }
                                          )
                                        ) : (
                                          <label className="notfound">
                                            File Not Found
                                          </label>
                                        )}
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Bank
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.bankData
                                              ?.length ? (
                                              item?.bankData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.bankName}</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new ">
                                      <label className="controlform">
                                        Directives
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <ul className="nalist">
                                            {item?.directiveData
                                              ?.length ? (
                                              item?.directiveData?.map(
                                                (res) => {
                                                  return (
                                                    <li>{res?.directiveName}</li>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <li className="disabletext">
                                                N/A
                                              </li>
                                            )}
                                          </ul>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="inner_form_new">
                                      <label className="controlform">
                                        Releasing Date
                                      </label>
                                      <div className="form-bx">
                                        <label>
                                          <input
                                            type="text"
                                            className=""
                                            disabled
                                            value={moment(
                                              item?.releasingDate
                                            ).format("DD/MMM/yyyy")}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                    {/* <div class="row">
                                      <div class="col-md-12">
                                        <div class="inner_form_new ">
                                          <label class="controlform">
                                            Action
                                          </label>
                                          <div class="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                class=""
                                                disabled
                                                value={
                                                  item?.assignedAction ==
                                                    "Approved" ||
                                                    item?.assignedAction ==
                                                    "Reject" ||
                                                    item?.assignedAction ==
                                                    "Cancelled"
                                                    ? "Assigned"
                                                    : item?.assignedAction
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div> */}


                                    <div
                                      className={
                                        item?.assignedToName == null &&
                                          item?.assignedToName == null
                                          ? "d-none"
                                          : "row"
                                      }
                                    >
                                      <div className="col-md-6">
                                        <div className="inner_form_new ">
                                          <label className="controlform">
                                            Assigned To Role
                                          </label>
                                          <div className="form-bx">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.roleName
                                                    ? item?.roleName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="inner_form_new-sm ">
                                          <label className="controlform-sm">
                                            Assigned To User
                                          </label>
                                          <div className="form-bx-sm">
                                            <label>
                                              <input
                                                type="text"
                                                className=""
                                                disabled
                                                value={
                                                  item?.assignedToName
                                                    ? item?.assignedToName
                                                    : ""
                                                }
                                              />
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </div>


                                  </div>
                                </>
                              );
                            }
                          });
                      })}

                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
              {/* director code end */}

              <div className="form-footer mt-5 mb-3">
                <button
                  type="reset"
                  onClick={(e) => {
                    EditModalClose(e);
                  }}
                  className="register"
                >
                  Close
                </button>

                <div>
                  {/* {(roleID > 5 &&
                    recomdAnalyst == "121" &&
                    applicationstaus != "25") ||
                    (roleID == 3 &&
                      applicationstaus &&
                      applicationstaus != 0 &&
                      applicationstaus != "25") ||
                    (roleID == 3 &&
                      nextlevelvalue == "10" &&
                      applicationstaus != "25") ? (
                    <>
                      <button
                        type="button"
                        className="login m-end-4"
                        onClick={() => GetHandelDetailPDF()}
                        disabled={btnLoader}
                      >
                        {btnLoader ? (
                          <span className="loaderwait">Please Wait...</span>
                        ) : (
                          <span>Preview PDF</span>
                        )}
                      </button>
                    </>
                  ) : (
                    ""
                  )} */}

                  <button
                    type="button"

                    onClick={(e) => {
                      HandleSubmit(e);
                    }}
                    className="login"
                    // disabled={(roleID == "6" || roleID == "7") && nextlevelvalue.length == 0 ? true : false}
                    disabled={nextlevelvalue == "" &&
                      (roleID == 6 && (applicationDetail.userID != UserID.replace(/"/g, ""))) ||
                      (nextlevelvalue == "" && roleID == 7 && (applicationDetail.userID != UserID.replace(/"/g, ""))) ||
                      ((applicationstaus == "0" || applicationstaus == undefined) &&
                        (roleID == 8) && (nextlevelvalue == "") && (applicationDetail.userID != UserID.replace(/"/g, ""))) ||
                      (SubmitBtnLoader == true) || (applicationDetail.roleID == 0 && checkSupervisor == false)
                      ? true
                      : false
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
              {/* pdf-preview data start Arun Verma Final Pdf Generation and Preview */}
              <div className="login_inner" style={{ display: "none" }}>
                <div className="login_form_panel" style={{ display: "none" }}>
                  <div
                    ref={PdftargetRef}
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
                          Exchange &nbsp; Control &nbsp; Ref
                          <br />
                          Previous &nbsp; Exchange &nbsp; Control &nbsp; Ref
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
                            : {applicationDetail?.rbzReferenceNumber}
                            <br />: N/A
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
                            applicationDetail?.applicationSubmittedDate
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
                          The Head - Exchange Control
                          <br />
                          {applicationDetail?.bankName}
                          <br />
                          {applicationDetail?.bankAddress1 != null ||
                            applicationDetail?.bankAddress1 != ""
                            ? applicationDetail?.bankAddress1 + "," + " "
                            : ""}
                          <br></br>
                          {applicationDetail?.bankAddress2 != null ||
                            applicationDetail?.bankAddress2 != ""
                            ? applicationDetail?.bankAddress2 + "," + " "
                            : ""}
                          <br></br>
                          {applicationDetail?.bankAddress3 != null ||
                            applicationDetail?.bankAddress3 != ""
                            ? applicationDetail?.bankAddress3
                            : ""}
                          <br />
                          {/* <span
                            style={{
                              borderBottom: "1px solid #000",
                              fontWeight: "800",
                              fontSize: "18px",
                              letterSpacing: "0.01px"
                            }}
                            className="text-uppercase"
                          >
                            {applicationDetail?.bankCity != null ||
                            applicationDetail?.bankCity != ""
                              ? applicationDetail?.bankCity
                              : ""}
                          </span> */}
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
                          {/* {applicationDetail?.applicantType == 1
                            ? applicationDetail?.companyName
                            : applicationDetail?.applicantType == 2
                            ? applicationDetail?.name
                            : applicationDetail?.applicantType == 3
                            ? applicationDetail?.agencyName
                            : " "} */}
                          {applicationDetail?.companyName == null ||
                            applicationDetail?.companyName == ""
                            ? applicationDetail?.name
                            : applicationDetail?.companyName}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <table width="100%">
                            <tr>
                              <td colSpan="2">
                                <p
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    borderBottom: "1px solid #000",
                                    marginBottom: "0px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  RE &nbsp;:&nbsp;{" "}
                                  {applicationDetail?.applicationType}
                                </p>
                              </td>
                            </tr>
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
                                Exporter
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
                                {applicationDetail?.companyName == null ||
                                  applicationDetail?.companyName == ""
                                  ? applicationDetail?.name
                                  : applicationDetail?.companyName}
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
                                Date Submitted
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
                                  applicationDetail?.applicationSubmittedDate
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
                                Currency and Amount
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
                                  {applicationDetail?.currencyCode}
                                </span>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.amount}
                                </span>
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
                                USD Equivalent
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
                                  USD
                                </span>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.usdEquivalent}
                                </span>
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
                                Status/Decision
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
                                {applicationstaus == "10"
                                  ? "Approved"
                                  : applicationstaus == "30"
                                    ? "Rejected"
                                    : applicationstaus == "40"
                                      ? "Deferred"
                                      : applicationstaus == "25"
                                        ? "Cancelled"
                                        : ""}
                                {/* {applicationDetail?.statusName} */}
                              </td>
                            </tr>
                            <tr
                              className={
                                applicationDetail?.expiringDate == null ||
                                  applicationDetail?.expiringDate == ""
                                  ? "d-none"
                                  : ""
                              }
                            >
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Expiry Date
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
                                {applicationDetail?.expiringDate == null ||
                                  applicationDetail?.expiringDate == "" ||
                                  applicationDetail?.expiringDate ==
                                  "0001-01-01T00:00:00"
                                  ? "N/A"
                                  : moment(
                                    applicationDetail?.expiringDate
                                  ).format("DD MMMM YYYY")}
                              </td>
                            </tr>
                            <tr
                              className={
                                applicationDetail?.returnFrequencyName ==
                                  null ||
                                  applicationDetail?.returnFrequencyName == ""
                                  ? "d-none"
                                  : ""
                              }
                            >
                              <td
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  color: "#000",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Returns Frequency
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
                                {applicationDetail?.returnFrequencyName ==
                                  null ||
                                  applicationDetail?.returnFrequencyName == ""
                                  ? "N/A"
                                  : applicationDetail?.returnFrequencyName}
                              </td>
                            </tr>
                            {applicationDetail?.returnFrequencyName ==
                              "Once" ? (
                              <tr>
                                <td
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "400",
                                    color: "#000",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  Returns Date
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
                                  {applicationDetail?.returnDate == null ||
                                    applicationDetail?.returnDate == "" ||
                                    applicationDetail?.returnDate ==
                                    "0001-01-01T00:00:00"
                                    ? "N/A"
                                    : moment(
                                      applicationDetail?.returnDate
                                    ).format("DD MMMM YYYY")}
                                </td>
                              </tr>
                            ) : (
                              ""
                            )}
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
                                          Response / Conditions
                                        </span>
                                      </div>
                                      <div
                                        className="tableEditorData"
                                        dangerouslySetInnerHTML={{
                                          __html: Description
                                            ? Description
                                            : applicationDetail?.content,
                                        }}
                                        style={{ letterSpacing: "0.01px" }}
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
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "15px 0px 3px",
                                    lineHeight: "13px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <p
                                  style={{
                                    marginBottom: "0px",
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "5px 0px",
                                    lineHeight: "13px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  EXCHANGE &nbsp; CONTROL
                                </h3>
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
                                  {applicationDetail?.copiedResponses?.length >
                                    0 ? (
                                    <>
                                      <p
                                        style={{
                                          marginBottom: "0px",
                                          fontSize: "18px",
                                          fontWeight: "400",
                                          paddingRight: "10px",
                                        }}
                                      >
                                        CC:
                                      </p>
                                      <div>
                                        {selectedBanks.map((item) => {
                                          return (
                                            <p
                                              style={{
                                                marginBottom: "3px",
                                                letterSpacing: "0.01px",
                                                fontSize: "18px",
                                                fontWeight: "400",
                                              }}
                                            >
                                              {item.name}
                                            </p>
                                          );
                                        })}
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}
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
              {/* pdf-preview data end */}

              {/* Supervisor level final close application Arun Verma */}
              <div className="login_inner" style={{ display: "none" }}>
                <div className="login_form_panel" style={{ display: "none" }}>
                  <div
                    ref={CoverigLetterRef}
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
                          Exchange &nbsp; Control &nbsp; Ref
                          <br />
                          Previous &nbsp; Exchange &nbsp; Control &nbsp; Ref
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
                            : {applicationDetail?.rbzReferenceNumber}
                            <br />: N/A
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
                            applicationDetail?.applicationSubmittedDate
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
                          The Head - Exchange Control
                          <br />
                          {applicationDetail?.bankName}
                          <br />
                          {applicationDetail?.bankAddress1 != null ||
                            applicationDetail?.bankAddress1 != ""
                            ? applicationDetail?.bankAddress1 + "," + " "
                            : ""}
                          <br></br>
                          {applicationDetail?.bankAddress2 != null ||
                            applicationDetail?.bankAddress2 != ""
                            ? applicationDetail?.bankAddress2 + "," + " "
                            : ""}
                          <br></br>
                          {applicationDetail?.bankAddress3 != null ||
                            applicationDetail?.bankAddress3 != ""
                            ? applicationDetail?.bankAddress3
                            : ""}
                          <br />
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
                          {applicationDetail?.companyName == null ||
                            applicationDetail?.companyName == ""
                            ? applicationDetail?.name
                            : applicationDetail?.companyName}
                          ,
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <table width="100%">
                            <tr>
                              <td colSpan="2">
                                <p
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    borderBottom: "1px solid #000",
                                    marginBottom: "0px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  RE &nbsp;:&nbsp;{" "}
                                  {applicationDetail?.applicationType}
                                </p>
                              </td>
                            </tr>
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
                                Exporter
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
                                {applicationDetail?.companyName == null ||
                                  applicationDetail?.companyName == ""
                                  ? applicationDetail?.name
                                  : applicationDetail?.companyName}
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
                                Date Submitted
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
                                  applicationDetail?.applicationSubmittedDate
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
                                Currency and Amount
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
                                  {applicationDetail?.currencyCode}
                                </span>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.amount}
                                </span>
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
                                USD Equivalent
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
                                  USD
                                </span>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.usdEquivalent}
                                </span>
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
                                Status/Decision
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
                                {applicationstaus == "10"
                                  ? "Approved"
                                  : applicationstaus == "30"
                                    ? "Rejected"
                                    : applicationstaus == "40"
                                      ? "Deferred"
                                      : applicationstaus == "25"
                                        ? "Cancelled"
                                        : ""}
                                {/* {applicationDetail?.statusName} */}
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
                                          __html: asignnextLeveldata
                                            ? // ? asignnextLeveldata.Notes
                                            Description
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
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "15px 0px 3px",
                                    lineHeight: "13px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <p
                                  style={{
                                    marginBottom: "0px",
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "5px 0px",
                                    lineHeight: "13px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {applicationDetail?.bankName}
                                </h3>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
              {/* coveri letter data end Arun Verma */}

              <div className="login_inner" style={{ display: "none" }}>
                <div className="login_form_panel" style={{ display: "none" }}>
                  <div
                    ref={PdfPrivewRef}
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
                          Exchange &nbsp; Control &nbsp; Ref
                          <br />
                          Previous &nbsp; Exchange &nbsp; Control &nbsp; Ref
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
                            : {applicationDetail?.rbzReferenceNumber}
                            <br />: N/A
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
                            applicationDetail?.applicationSubmittedDate
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
                          The Head - Exchange Control
                          <br />
                          {applicationDetail?.bankName
                            ? applicationDetail?.bankName
                            : ""}
                          {applicationDetail?.bankName == null ? (
                            <span>
                              Reserve Bank of Zimbabwe. 80 Samora Machel Avenue,{" "}
                              <br /> P.O. Box 1283, Harare, Zimbabwe.
                            </span>
                          ) : (
                            <>
                              <br />
                              {applicationDetail?.bankAddress1 != null ||
                                applicationDetail?.bankAddress1 != ""
                                ? applicationDetail?.bankAddress1 + "," + " "
                                : ""}
                              <br></br>
                              {applicationDetail?.bankAddress2 != null ||
                                applicationDetail?.bankAddress2 != ""
                                ? applicationDetail?.bankAddress2 + "," + " "
                                : ""}
                              <br></br>
                              {applicationDetail?.bankAddress3 != null ||
                                applicationDetail?.bankAddress3 != ""
                                ? applicationDetail?.bankAddress3
                                : ""}
                              <br />
                            </>
                          )}
                          {/* <span
                            style={{
                              borderBottom: "1px solid #000",
                              fontWeight: "800",
                              fontSize: "18px",
                              letterSpacing: "0.01px"
                            }}
                            className="text-uppercase"
                          >
                            {applicationDetail?.bankCity != null ||
                            applicationDetail?.bankCity != ""
                              ? applicationDetail?.bankCity
                              : ""}
                          </span> */}
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
                          {/* {applicationDetail?.applicantType == 1
                            ? applicationDetail?.companyName
                            : applicationDetail?.applicantType == 2
                            ? applicationDetail?.name
                            : applicationDetail?.applicantType == 3
                            ? applicationDetail?.agencyName
                            : " "} */}
                          {applicationDetail?.companyName == null ||
                            applicationDetail?.companyName == ""
                            ? applicationDetail?.name
                            : applicationDetail?.companyName}

                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <table width="100%">
                            <tr>
                              <td colSpan="2">
                                <p
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    borderBottom: "1px solid #000",
                                    marginBottom: "0px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  RE &nbsp;:&nbsp;{" "}
                                  {applicationDetail?.applicationType}
                                </p>
                              </td>
                            </tr>
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
                                Exporter
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
                                {applicationDetail?.companyName == null ||
                                  applicationDetail?.companyName == ""
                                  ? applicationDetail?.name
                                  : applicationDetail?.companyName}

                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                Date Submitted
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
                                  applicationDetail?.applicationSubmittedDate
                                ).format("DD MMMM  YYYY")}
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
                                Currency and Amount
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
                                  {applicationDetail?.currencyCode}
                                </span>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.amount}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                USD &nbsp; Equivalent
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
                                  USD
                                </span>
                                <span
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  {applicationDetail?.usdEquivalent}
                                </span>
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
                                Status/Decision
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
                                {applicationstaus == "10"
                                  ? "Approved"
                                  : applicationstaus == "30"
                                    ? "Rejected"
                                    : applicationstaus == "40"
                                      ? "Deferred"
                                      : applicationstaus == "25"
                                        ? "Cancelled"
                                        : ""}
                                {/* {applicationDetail?.statusName} */}
                              </td>
                            </tr>
                            <tr
                              className={
                                applicationDetail?.expiringDate == null ||
                                  applicationDetail?.expiringDate == ""
                                  ? "d-none"
                                  : ""
                              }
                            >
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Expiry Date
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
                                {applicationDetail?.expiringDate == null ||
                                  applicationDetail?.expiringDate == "" ||
                                  applicationDetail?.expiringDate ==
                                  "0001-01-01T00:00:00"
                                  ? "N/A"
                                  : moment(
                                    applicationDetail?.expiringDate
                                  ).format("DD MMMM YYYY")}
                              </td>
                            </tr>
                            <tr
                              className={
                                applicationDetail?.returnFrequencyName ==
                                  null ||
                                  applicationDetail?.returnFrequencyName == ""
                                  ? "d-none"
                                  : ""
                              }
                            >
                              <td
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "400",
                                  color: "#000",
                                  letterSpacing: "0.01px",
                                }}
                              >
                                Returns Frequency
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                }}
                              >
                                :{" "}
                                {applicationDetail?.returnFrequencyName ==
                                  null ||
                                  applicationDetail?.returnFrequencyName == ""
                                  ? "N/A"
                                  : applicationDetail?.returnFrequencyName}
                              </td>
                            </tr>
                            {applicationDetail?.returnFrequencyName ==
                              "Once" ? (
                              <tr>
                                <td
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: "400",
                                    color: "#000",
                                  }}
                                >
                                  Returns Date
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
                                  {applicationDetail?.returnDate == null ||
                                    applicationDetail?.returnDate == "" ||
                                    applicationDetail?.returnDate ==
                                    "0001-01-01T00:00:00"
                                    ? "N/A"
                                    : moment(
                                      applicationDetail?.returnDate
                                    ).format("DD MMMM  YYYY")}
                                </td>
                              </tr>
                            ) : (
                              ""
                            )}
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
                                          }}
                                        >
                                          Response &nbsp;/&nbsp; Conditions
                                        </span>
                                      </div>
                                      <div
                                        className="tableEditorData"
                                        dangerouslySetInnerHTML={{
                                          __html: Description
                                            ? Description
                                            : applicationDetail?.content,
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
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "15px 0px 3px",
                                    lineHeight: "13px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <p
                                  style={{
                                    marginBottom: "0px",
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "5px 0px",
                                    lineHeight: "13px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  EXCHANGE &nbsp; CONTROL
                                </h3>
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
                                  {applicationDetail?.copiedResponses?.length >
                                    0 ? (
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
                                        CC:
                                      </p>
                                      <div>
                                        {selectedBanks.map((item) => {
                                          return (
                                            <p
                                              style={{
                                                marginBottom: "3px",
                                                letterSpacing: "0.01px",
                                                fontSize: "18px",
                                                fontWeight: "400",
                                              }}
                                            >
                                              {item.name}
                                            </p>
                                          );
                                        })}
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}
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
                          Exchange &nbsp; Control &nbsp; Ref
                          <br />
                          Previous &nbsp; Exchange &nbsp; Control &nbsp; Ref
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
                            : {applicationDetail?.rbzReferenceNumber}
                            <br />: N/A
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
                            applicationDetail?.applicationSubmittedDate
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
                          The Head - Exchange Control
                          <br />
                          {applicationDetail?.bankName
                            ? applicationDetail?.bankName
                            : ""}
                          {applicationDetail?.bankName == null ? (
                            <span>
                              Reserve Bank of Zimbabwe. 80 Samora Machel Avenue,{" "}
                              <br /> P.O. Box 1283, Harare, Zimbabwe.
                            </span>
                          ) : (
                            <>
                              <br />
                              {applicationDetail?.bankAddress1 != null ||
                                applicationDetail?.bankAddress1 != ""
                                ? applicationDetail?.bankAddress1 + "," + " "
                                : ""}
                              <br></br>
                              {applicationDetail?.bankAddress2 != null ||
                                applicationDetail?.bankAddress2 != ""
                                ? applicationDetail?.bankAddress2 + "," + " "
                                : ""}
                              <br></br>
                              {applicationDetail?.bankAddress3 != null ||
                                applicationDetail?.bankAddress3 != ""
                                ? applicationDetail?.bankAddress3
                                : ""}
                              <br />
                            </>
                          )}
                          {/* <span
                            style={{
                              borderBottom: "1px solid #000",
                              fontWeight: "800",
                              fontSize: "18px",
                              letterSpacing: "0.01px"
                            }}
                            className="text-uppercase"
                          >
                            {applicationDetail?.bankCity != null ||
                            applicationDetail?.bankCity != ""
                              ? applicationDetail?.bankCity
                              : ""}
                          </span> */}
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
                          {/* {applicationDetail?.applicantType == 1
                            ? applicationDetail?.companyName
                            : applicationDetail?.applicantType == 2
                            ? applicationDetail?.name
                            : applicationDetail?.applicantType == 3
                            ? applicationDetail?.agencyName
                            : " "} */}
                          {applicationDetail?.companyName == null ||
                            applicationDetail?.companyName == ""
                            ? applicationDetail?.name
                            : applicationDetail?.companyName}

                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <table width="100%">
                            <tr>
                              <td colSpan="2">
                                <p
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                    borderBottom: "1px solid #000",
                                    marginBottom: "0px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  RE &nbsp;:&nbsp;{" "}
                                  {applicationDetail?.applicationType}
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">&nbsp;</td>
                            </tr>
                            {/* <tr>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                Exporter
                              </td>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "800",
                                  letterSpacing: "0.01px"
                                }}
                              >
                                :{" "}
                                {applicationDetail?.companyName == null || applicationDetail?.companyName == ""
                                  ? applicationDetail?.name
                                  : applicationDetail?.companyName} 
                                 
                              </td>
                            </tr> */}
                            <tr>
                              <td
                                style={{
                                  color: "#000",
                                  fontSize: "18px",
                                  fontWeight: "400",
                                }}
                              >
                                Date Submitted
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
                                  applicationDetail?.applicationSubmittedDate
                                ).format("DD MMMM  YYYY")}
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
                                          }}
                                        >
                                          Description
                                        </span>
                                      </div>
                                      <div
                                        className="tableEditorData"
                                        dangerouslySetInnerHTML={{
                                          __html: Description
                                            ? Description
                                            : applicationDetail?.content,
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
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "15px 0px 3px",
                                    lineHeight: "13px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfUsername
                                    ? PdfUsername.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <p
                                  style={{
                                    marginBottom: "0px",
                                    color: "#000",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    padding: "5px 0px",
                                    lineHeight: "13px",
                                    letterSpacing: "0.01px",
                                  }}
                                >
                                  {PdfRolename
                                    ? PdfRolename.replace(/"/g, "")
                                    : "N/A"}
                                </p>
                                <h3
                                  style={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: "800",
                                  }}
                                >
                                  EXCHANGE &nbsp; CONTROL
                                </h3>
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
                                  {applicationDetail?.copiedResponses?.length >
                                    0 ? (
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
                                        CC:
                                      </p>
                                      <div>
                                        {selectedBanks.map((item) => {
                                          return (
                                            <p
                                              style={{
                                                marginBottom: "3px",
                                                letterSpacing: "0.01px",
                                                fontSize: "18px",
                                                fontWeight: "400",
                                              }}
                                            >
                                              {item.name}
                                            </p>
                                          );
                                        })}
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}
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

              {updatepopup == true ? (
                <UpdatePopupMessage
                  heading={heading}
                  para={para}
                  applicationNumber={applicationNumber}
                  closePopupHandle={closePopupHandle}
                ></UpdatePopupMessage>
              ) : (
                ""
              )}
            </form>
          </>
        )
      }
    </>
  );
};

export default ExportCircularsEditForm;
