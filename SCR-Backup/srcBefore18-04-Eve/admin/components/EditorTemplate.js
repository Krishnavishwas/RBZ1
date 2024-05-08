import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
//import ReactQuill from "react-quill";
//import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { APIURL, IMGURL, ImageAPI } from "../../constant";
import BankMasterTable from "../tables/BankMasterTable";
import { Storage } from "../../login/Storagesetting";
import { toast } from "react-toastify";
//import jsPDF from 'jspdf';

const EditorTemplate = ({
  bankID,
  setbanknameEditpdfF,
  banknameEditpdfF,
  getBankData,
}) => {
  const navigate = useNavigate();
  const userId = Storage.getItem("userID");
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const fileInputRef4 = useRef(null);
  const waterInputRef = useRef(null);
  const paraonelignhightRef = useRef(null);
  const imagesizeRef = useRef(null);
  const fontsizeRef = useRef(null);
  const paddingRef = useRef(null);
  const paddingRef2 = useRef(null);
  const marginRef = useRef(null);
  const imagesizRef = useRef(null);
  const footertextRef = useRef(null);
  const footertextSizeRef = useRef(null);
  const footertextColorRef = useRef(null);
  const footerpostionRef = useRef(null);
  const footerflexRef = useRef(null);
  const footertextgapRef = useRef(null);
  const footerbgRef = useRef(null);
  const [showBankMasterTable, setShowBankMasterTable] = useState(false);
  const targetRef = useRef();
  const pdfTargetRef = useRef(null);
  const [editorText, setEditorText] = useState("");
  const [bannerimage, setBannerimage] = useState("");
  const [watermarkimage, setwatermarkimage] = useState("");
  const [footerimage, setfooterimage] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const editorRef = useRef(null);
  const contentRef = useRef(null);
  const [value, setValue] = useState("");
  
  useEffect(() => {    

    for(var i = 0; i < getBankData?.headerFooterData.length; i++) {
      if (getBankData?.headerFooterData[i].fileType == 'HeaderFile') {
          setBannerimage(getBankData?.headerFooterData[i]?.filePath);
          break;
      }else{
        setBannerimage('');
      }
    }    
    
    setEditorText(      
      getBankData?.bankLetterHead ? getBankData?.bankLetterHead : ""
    );

    for(var j = 0; j < getBankData?.headerFooterData.length; j++) {
      if (getBankData?.headerFooterData[j].fileType == 'FooterFile') {
        setfooterimage(getBankData?.headerFooterData[j]?.filePath);
          break;
      }else{
        setfooterimage('');
      }
    }


    // setfooterimage(
    //   (getBankData?.headerFooterData[1]?.fileType == 'FooterFile')? getBankData?.headerFooterData[1]?.filePath : ''
    //   //getBankData?.footerImageURL ? getBankData?.footerImageURL : ""
    // );
  }, [getBankData]);

  const [templaesetting, setTemplaesetting] = useState({
    bannimg: "",
    bannercolor: "",
    bannerwidth: "",
    bannerpadding: "",
    banneralign: "",
    bannealignment: "",
    paraonetxt: "",
    paraonealign: "",
    paraoneweight: "",
    paraonesize: "",
    paraonelignhight: "",
    paraonemargin: "",
    paraonecolor: "",
    headingtop: "",
    footerimg: "",
    footercolor: "",
    footerwidth: "",
    footerpadding: "",
    footeralign: "",
    footeralignment: "",
    footertext: "",
    footertextsize: "",
    footertextcolor: "",
    footerpostion: "",
    footerflex: "",
    footertextgap: "",
  });

  const options = {
    method: "open",
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.SMALL,
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      orientation: "landscape",
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

  const [headerFileUrl, setHeaderFileUrl] = useState("");
  const [footerFileUrl, setFooterFileUrl] = useState("");

  //Adding banner image
  const handleBannerimg = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    var img, width, height;
    img = new Image();
    console.log("img", img);
    var objectUrl = URL.createObjectURL(file);
    console.log("objectUrl", objectUrl);
    img.onload = function () {
      width = (this.width);
      height = (this.height);

    formData.append("files", file);
    formData.append("bankID", bankID);
    formData.append("width", width);
    formData.append("Height", height);    
    formData.append("fileType", 'HeaderFile');
    formData.append("Label", 'HeaderImage');
    if (file) {
      axios
        .post(ImageAPI + "File/UploadFile", formData)
        .then((res) => {
          console.log(res.data.responseData);
          setBannerimage(res.data.responseData.filePath);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  }
  img.src = objectUrl;
  };

  //Adding footer image
  const handleFooterimg = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    var img, width, height;
    img = new Image();
    var objectUrl = URL.createObjectURL(file);
    img.onload = function () {
      //alert(this.width + " " + this.height);
      width = (this.width);
      height = (this.height);
    
    formData.append("bankID", bankID);
    formData.append("files", file);
    formData.append("width", width);
    formData.append("Height", height);
    formData.append("fileType", 'FooterFile');
    formData.append("Label", 'FooterImage');
    if (file) {
      axios
        .post(ImageAPI + "File/UploadFile", formData)
        .then((res) => {
          setfooterimage(res.data.responseData.filePath);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
    
  }
  img.src = objectUrl;
  };

  /*const handleWatermark = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (allowedTypes.includes(file.type)) {
        setwatermarkimage(URL.createObjectURL(file));
      } else {
        alert("Please select a valid PNG, JPEG, or JPG file.");
        e.target.value = null;
      }
    }
  };

  const Tempalehandel = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTemplaesetting((prevBannerimg) => ({
      ...prevBannerimg,
      [name]: value,
    }));
  };

  const resetHandel = () => {
    setTemplaesetting({});
    setBannerimage("");
    setwatermarkimage("");
    setfooterimage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (fileInputRef2.current) {
      fileInputRef2.current.value = "";
    }
    if (fileInputRef3.current) {
      fileInputRef3.current.value = "";
    }
    if (fileInputRef4.current) {
      fileInputRef4.current.value = "";
    }
    if (imagesizeRef.current) {
      imagesizeRef.current.value = "";
    }
    if (marginRef.current) {
      marginRef.current.value = "";
    }
    if (fontsizeRef.current) {
      fontsizeRef.current.value = "";
    }
    if (paddingRef.current.value) {
      paddingRef.current.value = "";
    }
    if (paddingRef2.current.value) {
      paddingRef2.current.value = "";
    }
    if (waterInputRef.current.value) {
      waterInputRef.current.value = "";
    }
    if (paraonelignhightRef.current.value) {
      paraonelignhightRef.current.value = "";
    }
    if (imagesizRef.current.value) {
      imagesizRef.current.value = "";
    }
    if (footertextSizeRef.current.value) {
      footertextSizeRef.current.value = "";
    }
    if (footertextRef.current.value) {
      footertextRef.current.value = "";
    }
    if (footertextColorRef.current.value) {
      footertextColorRef.current.value = "";
    }
    if (footerpostionRef.current.value) {
      footerpostionRef.current.value = "";
    }
    if (footerflexRef.current.value) {
      footerflexRef.current.value = "";
    }
    if (footertextgapRef.current.value) {
      footertextgapRef.current.value = "";
    }
    if (footerbgRef.current.value) {
      footerbgRef.current.value = "";
    }
  };*/

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6] }],
      [{ font: [] }],
      [{ table: [] }],
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

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.innerHTML = value;
  }, [value]);

  const onChangeHandler = (content) => {
    setValue(content);
  };

  const handleSubmitHtml = async (e) => {
    e.preventDefault();
    const templateIinerPdfHTML = editorText;
    try {
      const letterHead = {
        ID: bankID,
        BankLetterHead: templateIinerPdfHTML,
        HeaderImageURL: bannerimage,
        FooterImageURL: footerimage,
      };
      const updateResponse = await fetch(
        APIURL + "Admin/UpdateBankLetterHead",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(letterHead),
        }
      );
      const updateData = await updateResponse.json();
      if (updateData.responseCode === "200") {
        setShowBankMasterTable(true);
      } else {
        console.error("Failed to update bank letter head.");
      }
    } catch (error) {
      console.error("Error handling submission:", error);
    }
  };

  const successResponse = () => {
    toast.success("Letterhead Saved Successfully");
  };

  return (
    <>
      {showBankMasterTable ? (
        <BankMasterTable />
      ) : (
        <section className="section dashboard adminDashboard">
          <div className="row">
            <div className="cont-md-12">
              <div className="card p-4 editor-box">
                <div className="row">
                  <div className="col-md-12">
                    <div
                      class="back-btn"
                      onClick={() => {
                        setShowBankMasterTable(true);
                        setbanknameEditpdfF("");
                      }}
                    >
                      <i class="bi bi-arrow-left"></i>{" "}
                    </div>
                    <h3 className="bank_editname">{banknameEditpdfF}</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-5">
                    <div className="form-pdf">
                      <div className="form-box-outer">
                        <h2 className="mt-0">Top Banner</h2>
                        <label>
                          Logo <small>(.png, .jpg, .jpeg)</small>
                        </label>
                        <input
                          type="file"
                          className="form-control bx"
                          name="bannerimage"
                          ref={fileInputRef}
                          onChange={(e) => {
                            handleBannerimg(e);
                          }}
                          accept=".png, .jpg, .jpeg"
                        />
                      </div>

                      {/* For the time being its commented from backend */}
                      {/* <div className="form-box-outer" style={{display:"none"}}>
                        <label>Paragraph</label>
                        <SunEditor
                              value={editorText}
                              setContents={editorText}
                              modules={modules}
                              onChange={(newComntent) => setEditorText(newComntent)}
                              setOptions={{
                                buttonList: [
                                  ["undo", "redo"],
                                  ["font", "fontSize"],
                                  [
                                    "bold",
                                    "underline",
                                    "italic",
                                    "strike",
                                    "subscript",
                                    "superscript",
                                  ],
                                  ["fontColor", "hiliteColor"],
                                  ["align", "list", "lineHeight"],
                                  ["outdent", "indent"],

                                  [
                                    "table",
                                    "horizontalRule",
                                    "link",
                                    "image",
                                    "video",
                                  ],
                                  ["preview", "print"],
                                  ["removeFormat"],
                                ],
                                defaultTag: "div",
                                minHeight: "120px",
                                showPathLabel: false,
                              }}
                            />                        
                      </div> */}
                      <div className="form-box-outer">
                        <h2>Footer</h2>
                        <label>
                          Image <small>(.png, .jpg, .jpeg)</small>
                        </label>
                        <input
                          type="file"
                          className="form-control bx"
                          name="footerimage"
                          ref={fileInputRef4}
                          onChange={(e) => {
                            handleFooterimg(e);
                          }}
                          accept=".png, .jpg, .jpeg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="outer-tampale-pdf">
                      <form
                        onSubmit={handleSubmitHtml}
                        className="editor-review"
                      >
                        <div ref={targetRef} className="template-pdf">
                          <div
                            className="header-pdf"
                            style={{                              
                              textAlign: `${templaesetting.banneralign}`,
                            }}
                          >
                            {bannerimage && (
                              <img
                                src={bannerimage}
                                alt="Banner Preview"
                                style={{
                                  width: `${templaesetting.bannerwidth + "%"}`,
                                  padding: `${
                                    templaesetting.bannerpadding + "px"
                                  }`,
                                }}
                              />
                            )}
                          </div>
                          <div className="template-iiner-pdf">                            
                            {/* {templaesetting.headingtop ? (
                              <h2
                                style={{
                                  margin: `${
                                    templaesetting.paraonemargin + "px"
                                  }`,
                                }}
                              >
                                <pre>{templaesetting.headingtop}</pre>
                              </h2>
                            ) : (
                              ""
                            )}
                            <pre
                              style={{
                                textAlign: `${templaesetting.paraonealign}`,
                                fontWeight: `${templaesetting.paraoneweight}`,
                                fontSize: `${
                                  templaesetting.paraonesize + "px"
                                }`,
                                lineHeight: `${
                                  templaesetting.paraonelignhight + "px"
                                }`,
                                margin: `${
                                  templaesetting.paraonemargin + "px"
                                }`,
                                color: `${templaesetting.paraonecolor}`,
                              }}
                            >
                              <pre
                                dangerouslySetInnerHTML={{ __html: editorText }}
                              />
                              {/* <div ref={pdfTargetRef} style={{display:"none"}}><div dangerouslySetInnerHTML={{ __html: editorText }} /></div> */}
                            {/* </pre> */}
                          </div>
                          <div
                            className="pdf-footer"
                            style={{
                              background: `${templaesetting.footercolor}`,
                              textAlign: `${templaesetting.footeralign}`,
                              position: `${templaesetting.footerpostion}`,
                              justifyContent: `${templaesetting.footerflex}`,
                              columnGap: `${
                                templaesetting.footertextgap + "px"
                              }`,
                            }}
                          >
                            {footerimage && (
                              <img
                                src={footerimage}
                                style={{
                                  width: `${templaesetting.footerwidth + "%"}`,
                                  padding: `${
                                    templaesetting.footerpadding + "px"
                                  }`,
                                }}
                              />
                            )}
                            {templaesetting.footertext ? (
                              <h4
                                style={{
                                  fontSize: `${
                                    templaesetting.footertextsize + "px"
                                  }`,
                                  padding: `${
                                    templaesetting.footerpadding + "px"
                                  }`,
                                  color: `${templaesetting.footertextcolor}`,
                                }}
                              >
                                {templaesetting.footertext}
                              </h4>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <button
                          className="template-pdf-btn"
                          disabled={editorText || bannerimage || footerimage ? false : true}
                          onClick={() => successResponse()}
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <>
        <div style={{display:"none"}}>
          <table ref={pdfTargetRef}>
            <tr>
              <td>
                <div >&nbsp;</div>
              </td>
            </tr>
          </table>
        </div>
      </>  
    </>
  );
};
export default EditorTemplate;
