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
import "react-quill/dist/quill.snow.css"; 
import logo from "../rbz_LOGO.png";  
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
import CustomMultiSelect from "./SearchUI/CustomMultiSelect"; 
/* Tiptp Editor Ends */

// import MultiSelect from "react-multi-select-component";


const FINDashboardRenewEditDetails = ({
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
  IsDeferred
}) => {
  const ratevalue = applicationDetail?.rate;

  const validationMessageRef = useRef();


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
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData, 
    masterBank,
    countries
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
  const bankSupervisorRef = useRef(null);
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

  const fileInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null), 
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null), 
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const fileInputRefsother = [ useRef(null),useRef(null),useRef(null), useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null), useRef(null)];

  const [startDate, setStartDate] = useState("");
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [getCompanyName, setgetCompanyName] = useState(null);
  const [checksectorchange, setchecksectorchange] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [geninfoTab, setgeninfoTab] = useState(true);
  const [banksuperTab, setbanksuperTab] = useState(roleID == 3 ? true : false);
  const [recordTab, setrecordTab] = useState(roleID == 4 ? true : false);
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

  const [errors, setErrors] = useState({});
  const [applicationType, setapplicationType] = useState([]);
  const [subsectorData, setsubsectorData] = useState([]);
  const [checkSupervisor, setcheckSupervisor] = useState(roleID == 4 ? true : false);
  const [attachmentData, setAttachmentData] = useState([
    { filename: "File Upload", upload: "" },
  ]);
  const [otherfilesupload, setOtherfilesupload] = useState([]);
  const [value, setValue] = useState("Company Name");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [Description, setDescription] = useState("");
  const [updatepopup, setupdatepopup] = useState(false);
const [lastComments, setLastComments] = useState({});
  const [ExpiringDate, setExpiringDate] = useState(new Date());
  const [asignnextLeveldata, setasignnextLeveldata] = useState({
    Notes: "",
    Comment: "",
  });
  const [DateExpiryOption, setDateExpiryOption] = useState("");
  const [defaultnoExpiry, setdefaultnoExpiry] = useState("0");
  const [applicationSubTypeValue, setapplicationSubTypeValue]= useState('');
  const [IsReturnOption, setIsReturnOption] = useState("");
  const [AllFrequency, setAllFrequency] = useState([]);
  const [getFrequencyID, setGetFrequencyID] = useState("0");
  const [IsReturn, setIsReturn] = useState("0");
  const [IsReturndisplay, setIsReturndisplay] = useState("");
  const [IsReturnExpiringDate, setIsReturnExpiringDate] = useState(new Date());
  const [DateExpirydisplay, setDateExpirydisplay] = useState("");
  const [curRate, setCurrate] = useState();
const [Supervisors, setSupervisors]= useState([]);
  const [userRoleRecordofficer, setuserRoleRecordofficer] = useState([]);
  const [selectuserRoleRecordofficer, setselectuserRoleRecordofficer] =
    useState("");
  const [getalluser, setGetalluser] = useState([]);
  const [applicationSubType, setapplicationSubType] = useState([]);
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
    setEditorContent(applicationDetail?.analystDescription);
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
          <i className="bi bi-table"></i>
        </button>
        <button
          type="button"
          title="Add Column Before"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!editor.can().addColumnBefore()}
        >
          <i className="bi bi-list-columns-reverse"></i>
        </button>
        <button
          type="button"
          title="Add Column After"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.can().addColumnAfter()}
        >
          <i className="bi bi-list-columns"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.can().deleteColumn()}
        >
          <i className="bi bi-archive"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={!editor.can().addRowBefore()}
        >
          <i className="bi bi-arrow-bar-up"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.can().addRowAfter()}
        >
          <i className="bi bi-arrow-bar-down"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!editor.can().deleteRow()}
        >
          <i className="bi bi-archive"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
        >
          <i className="bi bi-archive"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
        >
          <i className="bi bi-union"></i>
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
          <i className="bi bi-layout-split"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          disabled={!editor.can().toggleHeaderRow()}
        >
          <i className="bi bi-toggle-off"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderCell().run()}
          disabled={!editor.can().toggleHeaderCell()}
        >
          <i className="bi bi-toggle-off"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().mergeOrSplit().run()}
          disabled={!editor.can().mergeOrSplit()}
        >
          <i className="bi bi-subtract"></i>
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
          <i className="bi bi-kanban"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().fixTables().run()}
          disabled={!editor.can().fixTables()}
        >
          <i className="bi bi-file-spreadsheet"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().goToNextCell().run()}
          disabled={!editor.can().goToNextCell()}
        >
          <i className="bi bi-arrow-right-square"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().goToPreviousCell().run()}
          disabled={!editor.can().goToPreviousCell()}
        >
          <i className="bi bi-arrow-left-square"></i>
        </button>
        <button
          type="button"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <i className="bi bi-type-bold"></i>
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <i className="bi bi-type-italic"></i>
        </button>
        <button
          type="button"
          title="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          <i className="bi bi-type-strikethrough"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          <i className="bi bi-code-slash"></i>
        </button>
        <button
          type="button"
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          <i className="bi bi-paragraph"></i>
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
          <i className="bi bi-type-h1"></i>
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
          <i className="bi bi-type-h2"></i>
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
          <i className="bi bi-type-h3"></i>
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
          <i className="bi bi-type-h4"></i>
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
          <i className="bi bi-type-h5"></i>
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
          <i className="bi bi-type-h6"></i>
        </button>
        <button
          type="button"
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <i className="bi bi-list-ul"></i>
        </button>
        <button
          type="button"
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <i className="bi bi-list-ol"></i>
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
          <i className="bi bi-quote"></i>
        </button>
        <button
          type="button"
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <i className="bi bi-hr"></i>
        </button>
        <button
          type="button"
          title="Hard Break"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <i className="bi bi-file-break"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          <i className="bi bi-text-left"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          <i className="bi bi-text-center"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          <i className="bi bi-text-right"></i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          <i className="bi bi-justify"></i>
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
            <i className="bi bi-palette-fill"></i>
          </button>
        </span>
      </>
    );
  };

useEffect(() => {
    setasignnextLeveldata({
      Notes: lastComments?.notes,
      Comment: lastComments?.comment,
    });
  }, [lastComments]);
  
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
      editor.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : ""
      );
      setDescription(editor.getHTML());
    }
  }, [applicationDetail, lastComments]);

  useEffect(() => {
    if (editorAnalyst) {
      editorAnalyst.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorAnalyst.getHTML());
    }
  }, [applicationDetail, lastComments]);

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
    content: applicationDetail.analystDescription,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorSrAnalyst) {
      editorSrAnalyst.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorSrAnalyst.getHTML());
    }
  }, [applicationDetail, lastComments]);

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
    content: applicationDetail.analystDescription,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorDeputy) {
      editorDeputy.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorDeputy.getHTML());
    }
  }, [applicationDetail, lastComments]);

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
    content: applicationDetail.analystDescription,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorPrincipleAnalyst) {
      editorPrincipleAnalyst.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorPrincipleAnalyst.getHTML());
    }
  }, [applicationDetail, lastComments]);

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
    content: applicationDetail.analystDescription,
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editorDirector) {
      editorDirector.commands.setContent(
        applicationDetail.parentApplicationID !== 0 && lastComments
          ? lastComments?.description
          : applicationDetail?.analystDescription
      );
      setDescription(editorDirector.getHTML());
    }
  }, [applicationDetail, lastComments]);

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
    content: applicationDetail.analystDescription,
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
        DepartmentID: "4",
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

    const bankdtata = applicationDetail?.copiedResponses?.map((items, i) => {
      return {
        value: items.bankID,
        label: items.bankName,
       
      };
    });

    const lastResponseCCTodata = lastComments?.copiedResponseData?.map(
      (items, i) => {
        return {
          value: items.bankID,
          label: items.bankName,
        };
      }
    );

    setExpiringDate(
      applicationDetail?.expiringDate
        ? applicationDetail?.expiringDate
        : new Date()
    );

    setSelectedBanks(lastResponseCCTodata ? lastResponseCCTodata : bankdtata);

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
  }, [applicationDetail, lastComments]);

  const formatecopyresponse = selectedBanks?.map((item) => {
    return item.value;
  });

  const copyresponse = selectedBanks?.map((res) => ({
    ApplicationID: applicationDetail?.id,
    BankID: res?.value,
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

    if (name === "sector") {
      axios
        .post(APIURL + "Master/GetSubSectorBySectorID", {
          SectorID: value,
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setchecksectorchange(true);
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
    if (name == "subSector") {
      setchecksectorchange(false);
    }
    if (name === "applicationTypeID") {
      axios
        .post(APIURL + "Admin/GetSubApplicationTypeByApplicationTypeID", {
          ID: value,
        })
        .then((res) => { 
          if (res.data.responseCode === "200") {
            setapplicationSubType(res.data.responseData);
          } else {
            setAttachmentData([]);
            setFiles([]);
            setOtherfiles([]);
            setOtherfilesupload([]);
          }
        });
    } 

    if (name === "currency" && value != "") {
      axios
        .post(APIURL + "Master/GetRateByCurrencyID", {
          Id: value,
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setCurrate(res.data.responseData.currencyRate);
          } else {
            setCurrate([]);
            console.log(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (name === "applicationTypeID") {
      axios
        .post(APIURL + "Master/GetAttachmentData", {
          ApplicationTypeID: value != "" ? value : -1,
          ApplicationSubTypeID: "0",
        })
        .then((res) => {
          if (res.data.responseCode == "200") {
            setAttachmentData(res.data.responseData);
          } else {
            setAttachmentData([]);
            setFiles([]);
            setuserFiles([]);
            setOtheruserfiles([]);
            setOtherfiles([]);
            setOtherfilesupload([]);
          }
        });
    }
  };

  useEffect(()=>{
    if (applicationDetail?.applicationTypeID) {
      axios
        .post(APIURL + "Admin/GetSubApplicationTypeByApplicationTypeID", {
          ID: applicationDetail?.applicationTypeID,
        })
        .then((res) => { 
          if (res.data.responseCode === "200") {
            setapplicationSubType(res.data.responseData);
          } else {
            setAttachmentData([]);
            setFiles([]);
            setOtherfiles([]);
            setOtherfilesupload([]);
          }
        });
    }
    setapplicationSubTypeValue(applicationDetail?.applicationSubTypeID)

    const HanldeSuperVisor = async ()=>{
      await axios
        .post(APIURL + "User/GetSupervisors", {
          BankID: bankID,
          UserID: UserID,
          DepartmentID:"4",
          RoleID: roleID,
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
            setSupervisors(res.data.responseData);
          } else {
            console.log(res.data.responseMessage);
            setSupervisors([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    HanldeSuperVisor();

  },[applicationDetail])
  
  const changeHandelFormSubtype = (e)=>{
    setapplicationSubTypeValue(e.target.value)
  }
console.log("applicationDetail", applicationDetail)
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

  
 
  const clearInputFile = (index) => { 
    
    if (fileInputRefs[index].current) fileInputRefs[index].current.value = "";
  };
 const clearInputFileother = (index) =>{
  if (fileInputRefsother[index]?.current) fileInputRefsother[index].current.value = "";
 }

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
                var string = doc.output('dataurlnewwindow');
                // var blob = doc.output("blob");
                // window.open(URL.createObjectURL(blob), "_blank");
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
    if(bankSupervisorRef.current) bankSupervisorRef.current.value = "";
    if (value == "") {
      setGetalluser([]);
    } else {
      axios
        .post(APIURL + "User/GetUsersByRoleID", {
          RoleID: value,
          DepartmentID: "4",
          UserID: UserID?.replace(/"/g, ""),
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
      .post(APIURL + "FINApplication/GetFINSharedFileData", {
        ApplicationID: applicationDetail.id,
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
      .post(APIURL + "FINApplication/GetFINFilesByApplicationID", {
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
    if (roleID == 3 && checkSupervisor == true) {
      setAssignUserID("0");
    } else if (roleID == 3 && checkSupervisor == false) {
      setAssignUserID("");
    }
    setAssignUserID("");
    setSupervisorRoleId("");
    setselectuserRoleRecordofficer("");
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
    if (
      applicationDetail.applicantType == "1" &&
      applicationDetail.companyName == "" &&
      !getCompanyName
    ) {
      newErrors.companyName = "Company name is required";
      valid = false;
    }
    if (applicationDetail.applicationTypeID === "") {
      newErrors.applicationTypeID = "Application Category is required";
      valid = false;
    }
    if(applicationSubTypeValue == "" && (roleID == 3 || roleID == 2)){
      newErrors.applicationSubTypeValue = "Nature of application is required";
      valid = false;
    }
    if (
      AssignUserID == "" &&
      (nextlevelvalue == "20" || nextlevelvalue == "10") &&
      roleID == 5 &&
      checkSupervisor == true
    ) {
      newErrors.assignUserID = "User is required--";
      valid = false;
    }
    if (getFrequencyID == "0" && IsReturn == "1" && roleID >= 5) {
      newErrors.frequency = "Frequency is required";
      valid = false;
    }
    if (
      AssignUserID == "" &&
      roleID > 5 &&
      checkSupervisor == true &&
      recomdAnalyst != "121"
    ) {
      newErrors.assignUserID = "User is required";
      valid = false;
    }
    if (
      supervisordecision == true &&
      (applicationstaus == "" || applicationstaus == "0") &&
      roleID == 3 &&
      nextlevelvalue != 20
    ) {
      newErrors.supervisordecision = "Decision is required";
      valid = false;
    }
    if (nextlevelvalue == "" && roleID == 3 && supervisordecision == false) {
      newErrors.supervisoraction = "Action is required";
    }
    if (
      (Description == "" || Description == "<p></p>") &&
      applicationDetail?.analystDescription == null &&
      roleID >= 5
    ) {
      newErrors.Description = "Description is required";
      valid = false;
    }

    if (
      //  (checkSupervisor == false && nextlevelvalue == "" &&  roleID == 3 && Description == "<p></p>") ||
      Description == null ||
      (Description == "<p></p>" &&
        roleID == 3 &&
        nextlevelvalue == "" &&
        nextlevelvalue != "20") ||
      (nextlevelvalue == "10" &&
        Description == "<p></p>" &&
        roleID == 3 &&
        nextlevelvalue != "20") ||
      (Description == "<p></p>" &&
        supervisordecision == true &&
        roleID == 3 &&
        nextlevelvalue != "20")
    ) {
      newErrors.Description = "Description is required-11";
      valid = false;
    }
    if (
      checkSupervisor == false &&
      roleID == 3 &&
      AssignUserID == "" &&
      nextlevelvalue == 20
    ) {
      newErrors.Descsupervisruser = "User is required";
      valid = false;
    }

    if (
      bankID == "" &&
      registerusertype === "3" &&
      applicationDetail.govtAgencie === ""
    ) {
      newErrors.govtAgencie = "Government agencies name is required";
      valid = false;
    }
    if (
      applicationDetail.applicantType == "2" &&
      applicationDetail.name == ""
    ) {
      newErrors.applicant = "Applicant name is required";
      valid = false;
    }
    // if (
    //   asignnextLeveldata.Notes === "" &&
    //   (AssignUserID == "" || AssignUserID == null) &&
    //   roleID >= 5
    // ) {
    //   newErrors.Notes = "Notes is required";
    //   valid = false;
    // }
    // if (
    //   asignnextLeveldata.Comment === "" &&
    //   (AssignUserID == "" || AssignUserID == null) &&
    //   roleID >= 5
    // ) {
    //   newErrors.Comment = "Comments is required";
    //   valid = false;
    // }

    if (applicationDetail.bankSupervisor == "" && checkSupervisor == true && roleID == 2) {
      newErrors.assignedTo = "Bank Supervisor is required";
      valid = false;
    }

    if (
      selectuserRoleRecordofficer == "" &&
      checkSupervisor == true &&
      roleID == 4
    ) {
      newErrors.selectuserRoleRecordofficer = "Role is required";
      valid = false;
    }
    if (applicationDetail.bankSupervisor == "" && checkSupervisor == true && roleID == 4) {
      newErrors.AssignUserID = "User is required";
      valid = false;
    }

    if (
      DateExpirydisplay == 0 &&
      DateExpiryOption == 1 &&
      // roleID == "5" &&
      (ExpiringDate === "" || ExpiringDate == null)
    ) {
      newErrors.ExpiringDate = "Expiry Date is required";
      valid = false;
    }

    if (
      IsReturn == 1 &&
      getFrequencyID == 1 &&
      (IsReturnExpiringDate === "" || IsReturnExpiringDate == null)
    ) {
      newErrors.IsReturnExpiringDate = "Frequency Date is required";
      valid = false;
    }

    if (applicationDetail.currency === "") {
      newErrors.currency = "Currency is required";
      valid = false;
    }
    if (applicationDetail.amount === "") {
      newErrors.amount = "Amount is required";
      valid = false;
    }
    if (applicationDetail.applicationType === "") {
      newErrors.applicationType = "Application Type number is required";
      valid = false;
    }
    if (applicationDetail.sector === "") {
      newErrors.sector = "Sector is required";
      valid = false;
    }
    if ((applicationDetail.subSector === "" || checksectorchange === true) && applicationDetail.sector != 2 ) {
      newErrors.subSector = "Sub sector is required";
      valid = false;
    }
    if (applicationDetail.applicantComment === "") {
      newErrors.applicantComment = "Applicant comments is required";
      valid = false;
    }
    if (
      checkSupervisor == true &&
      (AssignUserID == "" || AssignUserID == null) &&
      recomdAnalyst != "121"
    ) {
      newErrors.assignedTo = "Bank supervisor is required";
      valid = false;
    }
    if (checkSupervisor == true && getalluser == "" && roleID == 4) {
      newErrors.selectuserRole = "Role is required";
      valid = false;
    }

    // if(files.length < attachmentData.length){
    //   newErrors.files = "All Files Required";
    //   valid = false;
    // }

    setErrors(newErrors);
    return valid;
  };
  //console.log("--t", AssignUserID == "" , nextlevelvalue == "20" , nextlevelvalue == "10"  ,  checkSupervisor == true)

  console.log("AssignUserID", AssignUserID);
  console.log("nextlevelvalue", nextlevelvalue);
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

  const vOption = masterBank?.map((res) => ({
    value: res.id,
    label: res.bankName,
  }));

   


  const handleChangeBank = (e) => {    
    const values = e;
    setSelectedBanks(values); 
  };

  console.log("selectedBanks", selectedBanks)



  const PdftargetRef = useRef();
  const PdfPrivewRef = useRef();
  const PdfPrivewsupervisorRef = useRef();

  const closePopupHandle = () => {
    navigate("/FINVDashboard");
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

  // Code start for save form
  const HandleSubmit = async (e) => {
    // setSubmitBtnLoader(true);
    e.preventDefault();
    let formData = new FormData();
    let shareformData = new FormData();

    if (validateForm()) {
      setSubmitBtnLoader(true);
      await axios
        .post(APIURL + "FINApplication/UpdateFINApplications", {
          RBZReferenceNumber: applicationDetail?.rbzReferenceNumber,
          ID: applicationDetail?.id,
          DepartmentID: "4",
          IsDeferred:IsDeferred,
          UserID: UserID.replace(/"/g, ""),
          RoleID: roleID,
          AssignedTo:  roleID >= 3 && AssignUserID == ""
              ? ""
              : AssignUserID
              ? AssignUserID
              : UserID.replace(/"/g, ""),

          BankID: applicationDetail?.bankID,
          CompanyID:
            (applicationDetail?.applicantType == "1" ||
              applicationDetail?.userTypeID == "1") &&
            applicationDetail?.bankID !== ""
              ? getCompanyName
                ? getCompanyName.value
                : applicationDetail?.companyID
              : "",
          ApplicationPurpose: applicationDetail?.applicationPurpose,
          UserTypeID: applicationDetail?.userTypeID, 
          Name: applicationDetail?.name,
          BeneficiaryName: applicationDetail?.beneficiaryName,
          BeneficiaryCountry:applicationDetail?.beneficiaryCountry,
          BPNCode:
            filtertin_bpn || filtertin_bpn != undefined
              ? filtertin_bpn?.bpnNumber?.toUpperCase()
              : applicationDetail?.bpnCode,
          TINNumber:
            filtertin_bpn || filtertin_bpn != undefined
              ? filtertin_bpn?.tinNumber?.toUpperCase()
              : applicationDetail?.tinNumber,
          ApplicantReferenceNumber:
            applicationDetail?.applicantReferenceNumber?.toUpperCase(),
          ApplicationTypeID: applicationDetail?.applicationTypeID,
          ApplicationSubTypeID:applicationSubTypeValue,
          Currency: applicationDetail?.currency,
          Amount: applicationDetail?.amount,
          Rate: !curRate ? applicationDetail?.rate : curRate,
          USDEquivalent: convertedRate
            ? convertedRate
            : applicationDetail?.usdEquivalent,
          RECNumber: applicationDetail?.recNumber?.toUpperCase(),
          Sector: applicationDetail?.sector,
          SubSector: applicationDetail?.subSector,
          ApplicantComment: applicationDetail?.applicantComment,
          ApplicationDate: startDate
            ? startDate
            : applicationDetail?.applicationDate,
          Comment: asignnextLeveldata.Comment,
          // AssignedToRoleID: SupervisorRoleId
          //   ? SupervisorRoleId
          //   : AssignUserID && SupervisorRoleId == ""
          //   ? parseInt(roleID) + 1
          //   : roleID,

          AssignedToRoleID: SupervisorRoleId
            ? SupervisorRoleId
            : AssignUserID && SupervisorRoleId == "" && nextlevelvalue != "20"
            ? parseInt(roleID) + 1
            : roleID,

          Notes: asignnextLeveldata.Notes,
          ExpiringDate: defaultnoExpiry == "0" ? "" : ExpiringDate,
          ApplicationStatus:
            roleID == 5
              ? applicationstaus
              : nextlevelvalue == "" && roleID != 5
              ? applicationstaus
              : applicationDetail?.analystRecommendation,
          ActionStatus:
            (AssignUserID == "" || AssignUserID == null) &&
            roleID != 5 &&
            roleID != 2 &&
            //roleID != 3 &&
            roleID != 4
              ? "100"
              : nextlevelvalue,
          Description: Description
            ? Description
            : applicationDetail?.analystDescription,
          IsReturnNeeded: IsReturn,
          ReturnFrequencyType: IsReturn == "1" ? getFrequencyID : "",
          ReturnDate:
            IsReturn == "1" && getFrequencyID == "1"
              ? IsReturnExpiringDate
              : "",
          CopiedResponse: formatecopyresponse?.join(),
        })
        .then((res) => {
          if (res.data.responseCode === "200") {
            if (roleID == 2 || roleID == 4 || roleID == 5) {
              setupdatepopup(true);
            }

            // setupdatepopup(true);
            if (
              (AssignUserID == "" || AssignUserID == null) &&
              roleID != 5 &&
              roleID != 2 &&
              roleID != 4
            ) {
              //When application gets closed by bank supervisor
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
                        response.data.responseData?.headerFooterData["0"]
                          ?.fileType == "HeaderFile"
                      ) {
                        var headerImage =
                          response.data.responseData.headerFooterData["0"]
                            .filePath;
                        var headerImagewidth =
                          response.data.responseData.headerFooterData["0"]
                            .imageWidth;
                      } else {
                        var headerImage = "";
                      }
                      if (
                        response.data.responseData?.headerFooterData["1"]
                          ?.fileType == "FooterFile"
                      ) {
                        var footerImage =
                          response.data.responseData.headerFooterData["1"]
                            .filePath;
                        var footerImagewidth =
                          response.data.responseData.headerFooterData["1"]
                            .imageWidth;
                      } else {
                        var footerImage = "";
                      }

                      const addFooters = (doc) => {
                        //if (roleID != 3) {
                          const pageCount = doc.internal.getNumberOfPages();
                          const footerpositionfromleft =
                            doc.internal.pageSize.width - 10;
                          const footerpositionfromTop =
                            doc.internal.pageSize.height - 10;
                          doc.setFont("helvetica", "italic");
                          doc.setFontSize(8);
                          for (var i = 1; i <= pageCount; i++) {
                            doc.setPage(i);
                            doc.text(
                              "Page " + String(i) + " of " + String(pageCount),
                              footerpositionfromleft,
                              footerpositionfromTop,
                              {
                                align: "right",
                              }
                            );
                          }
                        //} else {
                          // if (footerImage != "") {
                          //   const footerpositionfromTop =
                          //     doc.internal.pageSize.height - 90;
                          //   const pageCount = doc.internal.getNumberOfPages();

                          //   var pagewidth = doc.internal.pageSize.width;
                          //   if (pagewidth > footerImagewidth) {
                          //     var diff =
                          //       parseInt(pagewidth) -
                          //       parseInt(footerImagewidth);
                          //     var positionLeftFooter = parseInt(diff / 2);
                          //   } else {
                          //     var positionLeftFooter = 250;
                          //   }

                          //   for (var i = 1; i <= pageCount; i++) {
                          //     doc.setPage(i);
                          //     doc.addImage(
                          //       footerImage,
                          //       "png",
                          //       positionLeftFooter,
                          //       footerpositionfromTop,
                          //       150,
                          //       80,
                          //       "Footer",
                          //       "NONE",
                          //       0
                          //     );
                          //   }
                          // }

                          /*const footerpositionfromTop = doc.internal.pageSize.height-90;
                          const pageCount = doc.internal.getNumberOfPages();
                          for (var i = 1; i <= pageCount; i++) {
                            doc.setPage(i)
                            doc.addImage(footerImage, 'png', 230, footerpositionfromTop, 150, 80, 'DMS-RBZ','NONE', 0)
                          }*/
                        //}
                      };

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
                              var diff =
                                parseInt(pagewidth) -
                                parseInt(headerImagewidth);
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

                          /*const pageCount = doc.internal.getNumberOfPages();
                          for (var i = 1; i <= pageCount; i++) {
                            doc.setPage(i)
                            doc.addImage(headerImage, 'png', 250, 10, 80, 80, 'DMS-RBZ2','NONE', 0)                                            
                          }*/
                        }
                      };

                      doc.setFont("helvetica", "normal");
                      doc.setFontSize(3);
                      let docWidth = doc.internal.pageSize.getWidth();

                      doc
                        .html(PdftargetRef.current, {
                          x: 12,
                          y: 12,
                          width: 513,
                          height: doc.internal.pageSize.getHeight(),
                          margin: [110, 80, 60, 35],
                          windowWidth: 1000,
                          pagebreak: true,
                          async callback(doc) {
                            addHeader(doc);
                            //addFooters(doc);
                            const blobPDF = doc.output("datauristring");
                            let formData = new FormData();

                            formData.append("UserID", UserID.replace(/"/g, ""));
                            formData.append("FileType", "FinalResponsePDF");
                            formData.append("Label", "Final Response");
                            formData.append(
                              "RBZReferenceNumber",
                              applicationDetail?.rbzReferenceNumber
                            );
                            formData.append(
                              "ApplicationID",
                              applicationDetail?.id
                            );
                            formData.append("PdfData", blobPDF);
                            axios
                              .post(ImageAPI + "File/UploadPdf", formData)
                              .then((res) => {
                                if (res.data.responseCode == "Success") {
                                  setSupervisorRoleId("");
                                  setupdatepopup(true);
                                  setSubmitBtnLoader(false);
                                  setAssignUserID("");
                                  setselectuserRoleRecordofficer("");
                                } else {
                                  setupdatepopup(true);
                                }
                                // setSupervisorRoleId("");
                                // setupdatepopup(true);
                                //   setSubmitBtnLoader(false);
                                // setAssignUserID("");
                                // setselectuserRoleRecordofficer("");
                              })
                              .catch((error) =>
                                console.log("DATA SAVE ERROR--", error)
                              );
                            //doc.save('result');
                          },
                        })
                        .then(async (response) => {
                          console.log("response-- pdf", response);
                        })
                        .catch((error) => console.log("pdferror--", error));
                    }
                  });
                // setBtnLoader(false);
              }, 1500);
            } else {
              //When application moved to next step
              if (roleID == 3 && nextlevelvalue == "10") {
                setTimeout(async () => {
                  const doc = new jsPDF({
                    format: "a4",
                    unit: "pt",
                  });

                  await axios
                    .post(APIURL + "Admin/GetBankByID", {
                      id: applicationDetail?.bankID,
                    })
                    .then(async (response) => {
                      if (response.data.responseCode === "200") {
                        if (
                          response.data.responseData?.headerFooterData["0"]
                            ?.fileType == "HeaderFile"
                        ) {
                          var headerImage =
                            response.data.responseData.headerFooterData["0"]
                              .filePath;
                          var headerImagewidth =
                            response.data.responseData.headerFooterData["0"]
                              .imageWidth;
                        } else {
                          var headerImage = "";
                        }
                        //console.log('FooterData---',response.data.responseData.headerFooterData['1']);
                        if (
                          response.data.responseData?.headerFooterData["1"]
                            ?.fileType == "FooterFile"
                        ) {
                          var footerImage =
                            response.data.responseData.headerFooterData["1"]
                              .filePath;
                          var footerImagewidth =
                            response.data.responseData.headerFooterData["1"]
                              .imageWidth;
                        } else {
                          var footerImage = "";
                        }

                        const addFooters = (doc) => {
                          if (footerImage != "") {
                            const footerpositionfromTop =
                              doc.internal.pageSize.height - 90;
                            const pageCount = doc.internal.getNumberOfPages();

                            var pagewidth = doc.internal.pageSize.width;
                            if (pagewidth > footerImagewidth) {
                              var diff =
                                parseInt(pagewidth) -
                                parseInt(footerImagewidth);
                              var positionLeftFooter = parseInt(diff / 2);
                            } else {
                              var positionLeftFooter = 250;
                            }

                            for (var i = 1; i <= pageCount; i++) {
                              doc.setPage(i);
                              doc.addImage(
                                footerImage,
                                "png",
                                positionLeftFooter,
                                footerpositionfromTop,
                                150,
                                80,
                                "Footer",
                                "NONE",
                                0
                              );
                            }
                          }
                        };

                        const addHeader = (doc) => {
                          if (headerImage != "") {
                            const pageCount = doc.internal.getNumberOfPages();
                            var pagewidth = doc.internal.pageSize.width;
                            if (pagewidth > headerImagewidth) {
                              var diff =
                                parseInt(pagewidth) -
                                parseInt(headerImagewidth);
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
                            doc.text("Cover Letter", 250, 40);
                          }
                        };

                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(3);

                        let docWidth = doc.internal.pageSize.getWidth();
                        await doc
                          .html(PdfPrivewsupervisorRef.current, {
                            x: 12,
                            y: 12,
                            width: 513,
                            height: doc.internal.pageSize.getHeight(),
                            margin: [110, 80, 60, 35],
                            windowWidth: 1000,
                            pagebreak: true,
                            async callback(doc) {
                              addHeader(doc);
                              //addFooters(doc);
                              const blobPDF = doc.output("datauristring");
                              let formData = new FormData();
                              formData.append(
                                "UserID",
                                UserID.replace(/"/g, "")
                              );
                              formData.append("FileType", "LetterHeadPDF");
                              formData.append("Label", "CoverLetter");
                              formData.append(
                                "RBZReferenceNumber",
                                applicationDetail?.rbzReferenceNumber
                              );
                              formData.append(
                                "ApplicationID",
                                applicationDetail?.id
                              );
                              formData.append("PdfData", blobPDF);
                              await axios
                                .post(ImageAPI + "File/UploadPdf", formData)
                                .then(async (res) => {
                                  if (res.data.responseCode == "Success") {
                                    setSupervisorRoleId("");
                                    setupdatepopup(true);
                                    setSubmitBtnLoader(false);
                                    setAssignUserID("");
                                    setselectuserRoleRecordofficer("");
                                  } else {
                                    setupdatepopup(true);
                                  }
                                })
                                .catch((error) =>
                                  console.log("DATA SAVE ERROR--", error)
                                );
                              //doc.save('coveringletter');
                            },
                          })
                          .then(async (response) => {
                            // console.log(response)
                          })
                          .catch((error) => console.log("pdferror--", error));
                      }
                    });
                  setBtnLoader(false);
                }, 1500);
              } else {
                setupdatepopup(true);
                setSubmitBtnLoader(false);
              }
            }

            const fileupload = userfiles.length > 0 ? userfiles : files;

            for (let i = 0; i < fileupload?.length; i++) {
              // Corrected loop condition
              formData.append("files", fileupload[i].file);
              formData.append("Label", fileupload[i].label);
            }
            formData.append(
              "ApplicationActivityID",
              roleID == 2 || roleID == 4
                ? ""
                : res.data.responseData?.applicationActivityID
            );
            formData.append(
              "RBZReferenceNumber",
              applicationDetail?.rbzReferenceNumber
            );
            formData.append("ApplicationID", applicationDetail?.id);
            formData.append("DepartmentID", "4");
            formData.append("UserID", UserID.replace(/"/g, ""));

            axios
              .post(ImageAPI + "File/UploadFile", formData)
              .then((res) => {})
              .catch((err) => {
                console.log("file Upload ", err);
              });

            axios
              .post(APIURL + "FINApplication/CopyingResponsesFIN", copyresponse)
              .then((resposnse) => {})
              .catch((error) => {
                console.log("error", error);
              });

            // sharefileupload

            for (let i = 0; i < sharefile?.length; i++) {
              // Corrected loop condition
              shareformData.append("files", sharefile[i].file);
              shareformData.append("fileInfoID", sharefile[i].fileInfoID);
            }
            shareformData.append(
              "RBZReferenceNumber",
              applicationDetail?.rbzReferenceNumber
            );
            shareformData.append("ApplicationID", applicationDetail?.id);
            shareformData.append("IsSharedDoc", "1");
            shareformData.append("UserID", UserID.replace(/"/g, ""));

            axios
              .post(ImageAPI + "File/UploadSharedDocs", shareformData)
              .then((res) => {})
              .catch((err) => {
                console.log("sharefile Upload ", err);
              });

            handleData();

            // setSupervisorRoleId("");
            // setupdatepopup(true);
            //   setSubmitBtnLoader(false);
            // setAssignUserID("");
            // setselectuserRoleRecordofficer("");
          } else {
            toast.error(res.data.responseMessage);
            // setSubmitBtnLoader(false);
          }
        })
        .catch((err) => {
          // setSubmitBtnLoader(false);
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

  // console.log("applicationDetail--applicationDetail", applicationDetail);

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
    //     const finalArray = Array.from(labelSet)?.map(label => {
    //       const attachedFile = geninfoFile?.find(item => item.label === label);
    //       const getBlankFileItem = getBlankFile?.find(item => item.name === label);
    //       if (attachedFile) {
    //           return { ...attachedFile, status: 0 };
    //       } else if (getBlankFileItem) {
    //           return { ...getBlankFileItem, status: 0 };
    //       }
    //   });
    //   console.log("finalArray", finalArray)
    // if(finalArray){
    // setFiles(finalArray)
    // }

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
 


  const getLastComment = async (id) => {
    await axios
      .post(APIURL + "FINApplication/GetLastApplicationDataByIDFIN", {
        ApplicationID: id,
        RoleID: roleID,
      })
      .then((res) => {
        setLastComments(res.data.responseData);

        setDescription(res.data.responseData.description);
      })
      .catch((error) => {
        console.log("GetLastApplicationDataByID Error", error);
      });
  };
  
  const GetApplicationTypeName = applicationType.find(
    (option) => option.id == applicationDetail.applicationTypeID
  );

  console.log("applicationType", applicationType)
  console.log("applicationDetail.applicationType", applicationDetail.applicationType)

  console.log("applicationDetail - ", applicationDetail);
  console.log("lastComments - ", lastComments);

  return (
    <>
      {showdataLoader == true || !noDataComment?.length ? (
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
              General Info{" "}
              <span className="btn-collapse">
                <i className="bi bi-caret-down-fill"></i>
              </span>
            </h5>
            <form>
              <div className={geninfoTab ? "customtab" : "d-none"}>
                              <div className="inner_form_new ">
                  <label className="controlform">User</label>
                  <div className="form-bx">
                    <label>
                      <input
                        type="text"
                        name="user"
                        value={applicationDetail.userName?.replace(/"/g, "")}
                        onChange={(e) => {
                          changeHandelForm(e);
                        }}
                        disabled
                      />
                      <span className="sspan"></span>
                    </label>
                  </div>
                </div>

                {bankName != "null" && (
                  <div className="inner_form_new ">
                    <label className="controlform">Name of Bank</label>

                    <div className="form-bx">
                      <label>
                        <input
                          type="text"
                          value={
                            roleID == 2
                              ? bankName.replace(/"/g, "")
                              : applicationDetail?.bankName
                              ? applicationDetail?.bankName
                              : "N/A"
                          }
                          disabled
                        />
                        <span className="sspan"></span>
                      </label>
                    </div>
                  </div>
                )}

                {/* <div className="inner_form_new ">
                  <label className="controlform">
                    Purpose of the Application
                  </label>

                  <div className="form-bx">
                    <label>
                      <textarea
                        name="applicationPurpose"
                        ref={applicationPurposeRef}
                        onChange={(e) => {
                          changeHandelForm(e);
                        }}
                        placeholder="Purpose of the Application"
                        className={errors.applicationPurpose ? "error" : ""}
                        value={applicationDetail.applicationPurpose}
                        disabled={roleID == 2 || roleID == 4 ? false : true}
                      />
                      <span className="sspan"></span>
                      {errors.applicationPurpose ? (
                        <small className="errormsg">
                          {errors.applicationPurpose}
                        </small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div> */}

                <div className="inner_form_new ">
                  <label className="controlform">Type of Exporter</label>
                  <div className="form-bx-radio mt-4">
                    <label>
                      <input
                        type="radio"
                        checked={
                          applicationDetail?.applicantType === 1 ? true : false
                        }
                        disabled={
                          applicationDetail?.applicantType === 1 ? false : true
                        }
                      />{" "}
                      <span>Corporate</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={
                          applicationDetail?.applicantType === 2 ? true : false
                        }
                        disabled={
                          applicationDetail?.applicantType === 2 ? false : true
                        }
                      />{" "}
                      <span>Individual</span>
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="exporterType"
                        checked={
                          applicationDetail?.applicantType === 3 ? true : false
                        }
                        disabled
                      />{" "}
                      <span>Government Agencies</span>
                    </label>

                    {/* {errors.niu && bankData.ApplicantType === '' ? <small className='errormsg'>{errors.ApplicantType}</small> : ""} */}
                  </div>
                </div>

                {applicationDetail?.applicantType == "1" && bankID != "" ? (
                  <>
                    <div className="inner_form_new ">
                      <label className="controlform">Company Name</label>
                      <div className="form-bx">
                        <Select
                          placeholder={
                            applicationDetail.companyName
                              ? applicationDetail.companyName
                              : "Select company name"
                          }
                          value={getCompanyName}
                          onChange={handleChangecompany}
                          onInputChange={handleInputChangecompany}
                          options={options}
                          isSearchable
                          noOptionsMessage={({ inputValue }) =>
                            inputValue?.length >= 3
                              ? "No company found"
                              : "Please provide at least 3 characters for auto search of Company Name"
                          }
                          onMenuClose={handleClear}
                          className="selectinput"
                          isDisabled={roleID == 2 || roleID == 4 ? false : true}
                        />

                        {errors.companyName ? (
                          <small className="errormsg2">
                            {errors.companyName}
                          </small>
                        ) : (
                          ""
                        )}

                        <small className="informgs">
                          {" "}
                          Please provide at least 3 characters for auto search
                          of Company Name.
                        </small>
                      </div>
                    </div>

                    <div className="inner_form_new ">
                      <label className="controlform">TIN Number</label>
                      <div className="form-bx">
                        <label>
                          <input
                            type="text"
                            name="tinNumber"
                            onChange={(e) => {
                              changeHandelForm(e);
                            }}
                            placeholder="TIN Number"
                            value={
                              filtertin_bpn?.tinNumber
                                ? filtertin_bpn?.tinNumber
                                : applicationDetail?.tinNumber
                            }
                            className="text-uppercase"
                            disabled
                          />
                          <span className="sspan"></span>
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {/* end form-bx  */}

                {applicationDetail?.applicantType == "2" && bankID != "" ? (
                  <>
                    <div className="inner_form_new ">
                      <label className="controlform">Applicant</label>
                      <div className="form-bx">
                        <label>
                          <input
                            type="text"
                            ref={applicantRef}
                            name="name"
                            onChange={(e) => {
                              changeHandelForm(e);
                            }}
                            placeholder="Applicant"
                            value={applicationDetail?.name}
                            className={
                              errors.applicant && applicationDetail?.name === ""
                                ? "error"
                                : ""
                            }
                            disabled={roleID == 2 || roleID == 4 ? false : true}
                          />
                          <span className="sspan"></span>
                          {errors.applicant && applicationDetail.name === "" ? (
                            <small className="errormsg">
                              {errors.applicant}
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

                {/* end form-bx  */}

                {applicationDetail?.applicantType == "1" && bankID != "" ? (
                  <div className="inner_form_new ">
                    <label className="controlform">BPN Code</label>

                    <div className="form-bx">
                      <label>
                        <input
                          ref={BPNCodeRef}
                          type="text"
                          min={0}
                          name="bpnCode"
                          value={
                            filtertin_bpn?.bpnNumber
                              ? filtertin_bpn?.bpnNumber?.trim()
                              : applicationDetail?.bpnCode
                          }
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          placeholder="BPN Code"
                          className={
                            errors.bpnCode
                              ? "error text-uppercase"
                              : "text-uppercase"
                          }
                          disabled
                        />
                        <span className="sspan"></span>
                        {errors.bpnCode ? (
                          <small className="errormsg">{errors.bpnCode}</small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {/* end form-bx  */}

                {bankID == "" ? (
                  <div className="inner_form_new ">
                    <label className="controlform">Government Agencies</label>

                    <div className="form-bx">
                      <label>
                        <select
                          ref={govtAgencieRef}
                          name="govtAgencie"
                          onChange={(e) => {
                            changeHandelForm(e);
                          }}
                          className={
                            errors.govtAgencie &&
                            applicationDetail?.govtAgencie === ""
                              ? "error"
                              : ""
                          }
                          disabled={roleID == 2 || roleID == 4 ? false : true}
                        >
                          <option value="">
                            Select Government Agencies Name
                          </option>
                          {GovernmentAgencies?.map((item, index) => {
                            return (
                              <option value={item.id} key={index}>
                                {item.agencyName}
                              </option>
                            );
                          })}
                        </select>
                        <span className="sspan"></span>
                        {errors.govtAgencie &&
                        applicationDetail?.govtAgencie === "" ? (
                          <small className="errormsg">
                            {errors.govtAgencie}
                          </small>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {/* end form-bx  */}

                {/* <div className="inner_form_new ">
                  <label className="controlform">
                    Applicant Reference Number
                  </label>

                  <div className="form-bx">
                    <label>
                      <input
                        ref={applicantReferenceNumberRef}
                        type="text"
                        name="applicantReferenceNumber"
                        onChange={(e) => {
                          changeHandelForm(e);
                        }}
                        placeholder="Applicant Reference Number"
                        className={
                          errors.applicantReferenceNumber
                            ? "error text-uppercase"
                            : "text-uppercase"
                        }
                        value={
                          applicationDetail?.applicantReferenceNumber
                            ? applicationDetail?.applicantReferenceNumber
                            : ""
                        }
                        disabled={roleID == 2 || roleID == 4 ? false : true}
                      />
                      <span className="sspan"></span>
                      {errors.applicantReferenceNumber ? (
                        <small className="errormsg">
                          {errors.applicantReferenceNumber}
                        </small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div> */}
                {/* end form-bx  */}

                <div className="inner_form_new ">
                  <label className="controlform">Application Date</label>

                  <div className="form-bx">
                    {/* <label> */}
                    <DatePicker
                      closeOnScroll={(e) => e.target === document}
                      selected={
                        startDate
                          ? startDate
                          : applicationDetail?.applicationDate
                      }
                      onChange={(date) => setStartDate(date)}
                      peekNextMonth
                      showMonthDropdown
                      maxDate={new Date()}
                      minDate="01/01/2018"
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd/MMM/yyyy"
                      disabled={roleID == 2 || roleID == 4 ? false : true}
                      onKeyDown={(e) => {
                        const key = e.key;
                        const allowedKeys = /[0-9\/]/; // Allow numbers and '/'
                        if (
                          !allowedKeys.test(key) &&
                          key !== "Backspace" &&
                          key !== "Delete"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />

                    <span className="sspan"></span>
                    {/* </label> */}
                  </div>
                </div>
                {/* end form-bx  */}

                <div className="inner_form_new ">
                  <label className="controlform">Application Category</label>

                  <div className="form-bx">
                    <label>
                      <select
                        ref={applicationTypeRef}
                        name="applicationTypeID"
                        onChange={(e) => {
                          changeHandelForm(e); setapplicationSubTypeValue("")
                        }}
                        className={errors.applicationTypeID ? "error" : ""}
                        disabled={roleID == 2 || roleID == 4 ? false : true}
                      >
                        <option value="">Select Application Type</option>
                        {applicationType?.map((item, ind) => {
                          return (
                            <option
                              key={item.id}
                              value={item.id}
                              selected={
                                applicationDetail?.applicationTypeID ===
                                item?.id
                              }
                            >
                              {item.name} 
                            </option>
                          );
                        })}
                      </select>
                      <span className="sspan"></span>
                      {errors.applicationTypeID ? (
                        <small className="errormsg">
                          {errors.applicationTypeID}
                        </small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>
                {/* end form-bx  */}

                {applicationDetail?.applicationSubTypeID !== "" ? (
          <div className="inner_form_new ">
            <label className="controlform">
              Nature of Application
              {GetApplicationTypeName?.name !== ""
                ? `(${GetApplicationTypeName?.name})`
                : ""}
            </label>
            <div className="form-bx">
              <label>
                <select
                  // ref={applicationSubTypeRef}
                  name="applicationSubTypeValue"
                  onChange={(e) => {
                    changeHandelFormSubtype(e);
                  }}
                  className={
                    errors.applicationSubTypeValue &&
                    applicationSubTypeValue == ""
                      ? "error"
                      : ""
                  }
                >
                  <option value="">Select Nature of Application</option>
                  {applicationSubType?.map((item, ind) => {
                    return (
                      <option key={item.id} value={item.id} selected={applicationDetail?.applicationSubTypeID == item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <span className="sspan"></span>
                {errors.applicationSubTypeValue &&
                applicationSubTypeValue == "" ? (
                  <small className="errormsg">
                    {errors.applicationSubTypeValue}
                  </small>
                ) : (
                  ""
                )}
                 
              </label>
            </div>
          </div>
        ) : (
          ""
        )}

                <div className="inner_form_new ">
          <label className="controlform">Beneficiary Name</label>
          <div className="form-bx">
            <label>
              <input
                type="text"
                ref={BeneficiaryNameRef}
                name="BeneficiaryName"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                placeholder="Beneficiary Name"
                value={applicationDetail.beneficiaryName}
              />
              <span className="sspan"></span>
              {errors.BeneficiaryName || applicationDetail.BeneficiaryName === "" ? (
                <small className="errormsg">{errors.BeneficiaryName}</small>
              ) : (
                ""
              )}
            </label>
          </div>
        </div>

        <div className="inner_form_new ">
          <label className="controlform">Baneficiary Country</label>
          <div className="form-bx">
            <label>
              <select
                name="beneficiaryCountry"
                onChange={(e) => {
                  changeHandelForm(e);
                }}
                // className={
                //   errors.baneficiaryCountry && FINForm.baneficiaryCountry === ""
                //     ? "error"
                //     : ""
                // }
              >
                 <option value="">
                 Select Beneficiary Country
                      </option>
                      
                {countries?.map((item, ind) => {
                  return (
                    <option key={item.id} value={item.id} selected={applicationDetail?.countryName == item.countryName}>
                      {item.countryName}
                    </option>
                  );
                })}
              </select>
              <span className="sspan"></span>
            </label>
          </div>
        </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="inner_form_new">
                      <label className="controlform">Currency</label>

                      <div className="form-bx">
                        <label>
                          <select
                            ref={currencyRef}
                            name="currency"
                            onChange={(e) => {
                              changeHandelForm(e);
                            }}
                            className={
                              errors.currency &&
                              applicationDetail?.currency === ""
                                ? "error"
                                : ""
                            }
                            disabled={roleID == 2 || roleID == 4 ? false : true}
                          >
                            <option value="">Select Currency</option>
                            {currency?.map((cur, ind) => {
                              return (
                                <option
                                  key={cur.id}
                                  value={cur.id}
                                  selected={
                                    applicationDetail?.currency == cur.id
                                  }
                                >
                                  {cur.currencyCode}
                                </option>
                              );
                            })}
                          </select>
                          <span className="sspan"></span>
                          {errors.currency &&
                          applicationDetail.currency === "" ? (
                            <small className="errormsg">
                              {errors.currency}
                            </small>
                          ) : (
                            ""
                          )}
                        </label>
                      </div>
                    </div>
                    {/* end form-bx  */}
                  </div>

                  <div className="col-md-3">
                    <div className="inner_form_new-sm">
                      <label className="controlform-sm">Amount</label>

                      <div className="form-bx-sm">
                        <label>
                          <input
                            ref={amountRef}
                            type="number"
                            min={0}
                            name="amount"
                            onChange={(e) => {
                              changeHandelForm(e);
                            }}
                            value={applicationDetail?.amount}
                            placeholder="Amount"
                            className={
                              errors.amount && applicationDetail?.amount === ""
                                ? "error"
                                : ""
                            }
                            disabled={roleID == 2 || roleID == 4 ? false : true}
                          />
                          <span className="sspan"></span>
                          {errors.amount && applicationDetail?.amount === "" ? (
                            <small className="errormsg">{errors.amount}</small>
                          ) : (
                            ""
                          )}
                        </label>
                      </div>
                    </div>
                    {/* end form-bx  */}
                  </div>

                  <div className="col-md-3">
                    <div className="inner_form_new-sm">
                      <label className="controlform-sm">Rate</label>

                      <div className="form-bx-sm">
                        <label>
                          <input
                            ref={rateRef}
                            type="text"
                            name="rate"
                            value={
                              applicationDetail?.currency
                                ? curRate
                                  ? curRate
                                  : applicationDetail.rate
                                : "Rate"
                            }
                            onChange={(e) => {
                              changeHandelForm(e);
                            }}
                            placeholder="Rate"
                            disabled
                          />
                          <span className="sspan"></span>
                        </label>
                      </div>
                    </div>
                    {/* end form-bx  */}
                  </div>
                </div>

                <div className="inner_form_new ">
                  <label className="controlform">USD Equivalent</label>

                  <div className="form-bx">
                    <label>
                      <input
                        ref={usdEquivalentRef}
                        type="text"
                        name="usdEquivalent"
                        value={
                          applicationDetail?.currency &&
                          applicationDetail?.amount
                            ? convertedRate == NaN
                              ? applicationDetail?.usdEquivalent
                              : convertedRate.toFixed(2)
                            : convertedRate == 0
                            ? convertedRate.toFixed(2)
                            : "USD Equivalent"
                        }
                        onChange={(e) => {
                          changeHandelForm(e);
                        }}
                        placeholder="USD Equivalent"
                        disabled
                      />
                      <span className="sspan"></span>
                    </label>
                  </div>
                </div>
                {/* end form-bx  */}

                <div className="inner_form_new ">
                  <label className="controlform">
                    Related Exchange Control Reference Number
                  </label>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="d-flex">
                        <div className="form-bx">
                          <label>
                            <input
                              ref={relatedexchangeControlNumberRef}
                              type="text"
                              min={0}
                              name="recNumber"
                              value={applicationDetail?.recNumber}
                              onChange={(e) => {
                                changeHandelForm(e);
                              }}
                              placeholder="Related Exchange Control Reference Number"
                              className={
                                errors.relatedexchangeControlNumber
                                  ? "error text-uppercase"
                                  : "text-uppercase"
                              }
                              disabled={
                                roleID == 2 || roleID == 4 ? false : true
                              }
                            />
                            <span className="sspan"></span>
                            {errors.relatedexchangeControlNumber ? (
                              <small className="errormsg">
                                {errors.relatedexchangeControlNumber}
                              </small>
                            ) : (
                              ""
                            )}
                          </label>
                        </div>
                        <button type="button" className="primrybtn  v-button">
                          Validate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inner_form_new ">
                  <label className="controlform">Sector</label>
                  <div className="form-bx">
                    <label>
                      <select
                        ref={sectorRef}
                        name="sector"
                        onChange={(e) => {
                          changeHandelForm(e);
                        }}
                        className={
                          errors.sector && applicationDetail?.sector === ""
                            ? "error"
                            : ""
                        }
                        disabled={roleID == 2 || roleID == 4 ? false : true}
                      >
                        <option value="">Select Sector</option>
                        {sectorData?.map((item, ind) => {
                          return (
                            <option
                              key={item.id}
                              value={item.id}
                              selected={applicationDetail?.sector === item.id}
                            >
                              {item.sectorName}
                            </option>
                          );
                        })}
                      </select>
                      <span className="sspan"></span>
                      {errors.sector && applicationDetail?.sector === "" ? (
                        <small className="errormsg">{errors.sector}</small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>

                <div className="inner_form_new">
                  <label className="controlform">Subsector</label>
                  <div className="form-bx">
                    <label>
                      <select
                        ref={subsectorRef}
                        name="subSector"
                        onChange={(e) => {
                          changeHandelForm(e);
                        }}
                        disabled={
                          applicationDetail.sector === "" ||
                          (roleID == 2 || roleID == 4 ? false : true)
                            ? true
                            : false
                        }
                        className={errors.subSector ? "error" : ""}
                      >
                        <option value="">Subsector</option>
                        {subsectorData?.map((item, index) => {
                          return (
                            <option
                              key={item.id}
                              value={item.id}
                              selected={applicationDetail?.subSector == item.id}
                            >
                              {item.subSectorName}
                            </option>
                          );
                        })}
                      </select>
                      <span className="sspan"></span>
                      {errors.subSector ? (
                        <small className="errormsg">{errors.subSector}</small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>

                <div className="inner_form_new ">
                  <label className="controlform">Applicant Comments</label>
                  <div className="form-bx">
                    <label>
                      <textarea
                        ref={applicantCommentsRef}
                        name="applicantComment"
                        onChange={(e) => {
                          changeHandelForm(e);
                        }}
                        placeholder="Applicant Comments"
                        className={errors.applicantComment ? "error" : ""}
                        value={applicationDetail.applicantComment}
                        disabled={roleID == 2 || roleID == 4 ? false : true}
                      />
                      <span className="sspan"></span>
                      {errors.applicantComment ? (
                        <small className="errormsg">
                          {errors.applicantComment}
                        </small>
                      ) : (
                        ""
                      )}
                    </label>
                  </div>
                </div>

                <div
                  className={
                    applicationDetail?.applicationStatus == 0 ? "d-none" : "row"
                  }
                >
                  <div className="col-md-6">
                    <div className="inner_form_new ">
                      <label className="controlform">Assigned To Role</label>
                      <div className="form-bx">
                        <label>
                          <input
                            type="text"
                            className=""
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
                  <div className="col-md-6">
                    <div className="inner_form_new-sm ">
                      <label className="controlform-sm">Assigned To User</label>
                      <div className="form-bx-sm">
                        <label>
                          <input
                            type="text"
                            className=""
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

                <div className={roleID == 4 ? "d-none" : "inner_form_new "}>
                  <label className="controlform">Submit To Next Level </label>
                  <input
                    type="checkbox"
                    onChange={HandelSupervisorcheck}
                    checked={checkSupervisor}
                    disabled={roleID == 2 ? false : true}
                  />
                </div> 

                {checkSupervisor === true && roleID == 2 ? (
          <div className="inner_form_new ">
            <label className="controlform">Select Bank Supervisor</label>
            <div className="form-bx">
              <label>
                <select
                  ref={bankSupervisorRef}
                  name="bankSupervisor"
                  onChange={(e) => {
                    changeHandelForm(e);
                  }}
                  className={
                    errors.bankSupervisor && applicationDetail.bankSupervisor === ""
                      ? "error"
                      : ""
                  }
                >
                  <option value="" selected>
                    Select Bank Supervisor
                  </option>
                  {Supervisors?.map((item, index) => {
                    return (
                      <option key={index} value={item.userID}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                <span className="sspan"></span>
                {errors.bankSupervisor && applicationDetail.bankSupervisor === "" ? (
                  <small className="errormsg">{errors.bankSupervisor}</small>
                ) : (
                  ""
                )}
              </label>
            </div>
          </div>
        ) : (
          ""
        )}

{checkSupervisor == true && roleID == 4 ? (
          <div className="inner_form_new ">
            <label className="controlform">RBZ Record Officer Submit to</label>
            <div className="form-bx">
              <label>
                <select
                  name="SupervisorRoleId"
                  onChange={(e) => {
                    supervisorHangechangeRoleRecordofficer(e);
                  }}
                  // className={
                  //   errors.assignedTo && !SupervisorRoleId
                  //     ? "error"
                  //     : ""
                  // }
                >
                  <option value="">Select Role</option>
                  {userRole?.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {item.designation}
                      </option>
                    );
                  })}
                </select>
                <span className="sspan"></span>
                {errors.selectuserRoleRecordofficer && selectuserRoleRecordofficer === "" ? (
                  <small className="errormsg">Role is required</small>
                ) : (
                  ""
                )}
              </label>
            </div>
          </div>
        ) : (
          ""
        )} 
        {console.log("getalluser", getalluser)}
        {console.log("bankSupervisorRef", bankSupervisorRef)}

{checkSupervisor == true && roleID == 4 && getalluser.length > 0 ? (
          <div className="w-100">
            <div className="inner_form_new">
              <label className="controlform">User</label>

              <div className="form-bx">
                <label>
                  <select
                    ref={bankSupervisorRef}
                    name="bankSupervisor"
                    onChange={(e) => {
                      changeHandelForm(e);
                    }}
                    className={
                      errors.bankSupervisor && applicationDetail.bankSupervisor === ""
                        ? "error"
                        : ""
                    }
                  >
                    <option value="" selected>
                      Select User
                    </option>
                    {getalluser?.map((item, index) => {
                      return (
                        <option key={index} value={item.userID}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <span className="sspan"></span>
                  {errors.bankSupervisor && applicationDetail.bankSupervisor === "" ? (
                    <small className="errormsg">User is required</small>
                  ) : (
                    ""
                  )}
                </label>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}


                <h5 className="section_top_subheading mt-2">Attachments</h5>

                {applicationDetail?.fileName || applicationDetail?.filePath ? (
                  <div
                    className={
                      applicationDetail?.filePath != null
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
                      {applicationDetail?.fileName ? (
                        <span style={{ fontWeight: "500" }}>
                          {applicationDetail?.fileName}
                        </span>
                      ) : (
                        <span style={{ fontWeight: "500" }}>Cover Letter</span>
                      )}
                    </label>
                    {applicationDetail?.filePath ? (
                      <span className="filename">
                        <Link
                          to={applicationDetail?.filePath}
                          target="_blank"
                          className={
                            applicationDetail?.filePath
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
                ) : (
                  ""
                )}

                {roleID == 2 || roleID == 4
                  ? newData?.map((items, index) => {
                      return (
                        <div className="attachemt_form-bx" key={items.id}>
                          <label
                            style={{
                              background: "#d9edf7",
                              padding: "9px 3px",
                              border: "0px",
                            }}
                          >
                            {/* <i className="bi bi-forward"></i> */}
                            <span style={{ fontWeight: "500" }}>
                              {" "}
                              {items.name}{" "}
                            </span>
                          </label>
                          <div className="browse-btn">
                            Browse{" "}
                            <input
                              type="file"
                              ref={fileInputRefs[index]}
                              onChange={(e) =>
                                HandleFileUpload(
                                  e,
                                  items.label ? items.label : items.name
                                )
                              }
                            />
                          </div>
                          <span className="filename">
                            {files.find((f) => f.label === items?.name)?.file
                              ?.name || "No file chosen"}
                          </span>

                          {files?.length &&
                          files?.find((f) => f.label === items.name)?.file
                            ?.name ? (
                            <button
                              type="button"
                              className="remove-file"
                              onClick={() => {removefileImage(items?.name); clearInputFile(index)}}
                            >
                              Remove
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })
                  : ""}

                {geninfoFile?.length ? (
                  geninfoFile?.map((items, index) => {
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
                            {items.label ? items.label : items.name}
                          </span>
                        </label>

                        <span className="filename">
                          <Link
                            className="viewbtn_file"
                            to={items?.filePath}
                            target="_blank"
                          >
                            View File
                          </Link>
                        </span>

                        {roleID == 2 || roleID == 4 ? (
                          <button
                            type="button"
                            onClick={(e) => handleRemovfile(items?.id)}
                            className="remove-file"
                          >
                            Remove
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })
                ) : applicationDetail?.filePath != null ||
                  applicationDetail?.filePath != "" ? (
                  ""
                ) : (
                  <div className="text-center">File Not Found</div>
                )}

                {roleID == 2 || roleID == 4
                  ? otherfiles.map((file, index) => (
                      <div
                        key={"other file" + (index + 1)}
                        className="attachemt_form-bx"
                      >
                        <label
                          style={{
                            background: "#d9edf7",
                            padding: "9px 3px",
                            border: "0px",
                          }}
                        >
                          <span style={{ fontWeight: "500" }}>
                            {" "}
                            Other File {index + 1}{" "}
                          </span>
                        </label>
                        <div className="browse-btn">
                          Browse{" "}
                          <input
                            type="file"
                            ref={fileInputRefsother[index]}
                            onChange={(e) => {
                              handleFileChange(e, "other file" + (index + 1));
                            }}
                          />
                        </div>
                        <span className="filename">
                          {files.find(
                            (f) => f.label === "other file" + (index + 1)
                          )?.file?.name || "No file chosen"}
                        </span>

                        {files?.length &&
                        files?.find(
                          (f) => f.label == "other file" + (index + 1)
                        )?.file?.name ? (
                          <button
                            type="button"
                            className="remove-file"
                            onClick={() =>
                             { removefileImage("other file" + (index + 1));
                             clearInputFileother(index)
                            }
                            }
                          >
                            Remove
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ))
                  : ""}
                {roleID == 2 || roleID == 4 ? (
                  <button
                    type="button"
                    className="addmore-btn mb-2"
                    onClick={(e) => handleAddMore(e)}
                  >
                    {" "}
                    Add More File{" "}
                  </button>
                ) : (
                  ""
                )}
              </div>

               

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
                  {(roleID > 5 &&
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
                  )}

                  <button
                  type="button"
                  onClick={(e) => {
                    HandleSubmit(e);
                  }}
                  disabled={
                    (!checkSupervisor && roleID == 4) ||
                    (checkSupervisor && !AssignUserID && roleID == 4)
                      ? true
                      : false
                  }
                  className="login"
                >
                  Submit{" "}
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
                                            : applicationDetail?.analystDescription,
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
                                    ? PdfUsername?.replace(/"/g, "")
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
                                    ? PdfRolename?.replace(/"/g, "")
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
                                               {item.label}
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
                                    ? PdfUsername?.replace(/"/g, "")
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
                                    ? PdfRolename?.replace(/"/g, "")
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
                                            : applicationDetail?.analystDescription,
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
                                    ? PdfUsername?.replace(/"/g, "")
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
                                    ? PdfRolename?.replace(/"/g, "")
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
                                               {item.label}
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
                                  {console.log(applicationDetail)}
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
                                            : applicationDetail?.analystDescription,
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
                                    ? PdfUsername?.replace(/"/g, "")
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
                                    ? PdfRolename?.replace(/"/g, "")
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
                                               {item.label}
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

export default FINDashboardRenewEditDetails;
