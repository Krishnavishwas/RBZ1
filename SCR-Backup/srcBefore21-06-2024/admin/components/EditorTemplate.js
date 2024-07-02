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
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
//import jsPDF from 'jspdf';

const cropAreaWidthPx = 400;
const cropAreaHeightPx = 100;
const customAspectRatioPx = cropAreaWidthPx / cropAreaHeightPx;

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
  const [headerFileUrl, setHeaderFileUrl] = useState("");
  const [footerFileUrl, setFooterFileUrl] = useState("");
  const [logoImg, setLogoImg] = useState();
  const [cropLogoImg, setCropLogoImg] = useState();

  const [footerImg, setFooterImg] = useState();

  const [cropFooterImg, setCropFooterImg] = useState();
  const contentRef = useRef(null);
  const logoImgRef = useRef(null);
  const footerImgRef = useRef(null);
  const [value, setValue] = useState("");
  const [savedLogoImg, setSavedLogoImg] = useState("");
  const [savedFooterImg, setSavedFooterImg] = useState("");

  useEffect(() => {
    console.log("getBnakData===>", getBankData);
    for (var i = 0; i < getBankData?.headerFooterData.length; i++) {
      if (getBankData?.headerFooterData[i].fileType == "Header") {
        // setBannerimage(getBankData?.headerFooterData[i]?.filePath);
        setSavedLogoImg(getBankData?.headerFooterData[i]?.filePath);
        break;
      } else {
        setBannerimage("");
      }
    }

    setEditorText(
      getBankData?.bankLetterHead ? getBankData?.bankLetterHead : ""
    );

    for (var j = 0; j < getBankData?.headerFooterData.length; j++) {
      if (getBankData?.headerFooterData[j].fileType == "Footer") {
        // setfooterimage(getBankData?.headerFooterData[j]?.filePath);
        setSavedFooterImg(getBankData?.headerFooterData[j]?.filePath);
        break;
      } else {
        setfooterimage("");
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
      width = this.width;
      height = this.height;

      formData.append("files", file);
      formData.append("bankID", bankID);
      formData.append("width", width);
      formData.append("Height", height);
      formData.append("fileType", "HeaderFile");
      formData.append("Label", "HeaderImage");
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
    };
    img.src = objectUrl;
  };
  const handleLogoImg = (e) => {
    e.preventDefault();
    let files;

    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoImg(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      toast("No files found or the file is not valid");
    }
  };

  const handleLogoImgSave = () => {
    let cropedImg = logoImgRef.current?.cropper.getCroppedCanvas().toDataURL();
    if (typeof logoImgRef.current?.cropper !== "undefined") {
      setCropLogoImg(cropedImg);
    }
    const formData = new FormData();

    formData.append("FileType", "Header");
    formData.append("Label", "BankImage");
    formData.append("PdfData", cropedImg);
    formData.append("BankId", bankID);
    formData.append("Height", "234");
    formData.append("Width", "400");
    if (logoImg) {
      axios
        .post(ImageAPI + "File/UploadBankImage", formData, {
          headers: {
            Referer: "https://dms.getanapp.co.in/",
          },
        })
        .then((res) => {
          setCropLogoImg(res.data.responseData.filePath);
          setLogoImg(null);
        })
        .catch((error) => {
          toast.error("Something went wrong", {
            autoClose: 3000,
          });
          setLogoImg(null);
        });
    }
  };
  const handleFooterImg = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFooterImg(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleFooterImgSave = () => {
    let cropedImg = footerImgRef.current?.cropper
      .getCroppedCanvas()
      .toDataURL();
    if (typeof footerImgRef.current?.cropper !== "undefined") {
      setCropFooterImg(cropedImg);
    }
    const formData = new FormData();

    formData.append("FileType", "Footer");
    formData.append("Label", "BankImage");
    formData.append("PdfData", cropedImg);
    formData.append("BankId", bankID);
    formData.append("Height", "234");
    formData.append("Width", "400");
    if (footerImg) {
      axios
        .post(ImageAPI + "File/UploadBankImage", formData, {
          headers: {
            Referer: "https://dms.getanapp.co.in/",
          },
        })
        .then((res) => {
          setCropFooterImg(res.data.responseData.filePath);
          setFooterImg(null);
        })
        .catch((error) => {
          toast.error("Something went wrong", {
            autoClose: 3000,
          });
          setFooterImg(null);
        });
    }
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
      width = this.width;
      height = this.height;

      formData.append("bankID", bankID);
      formData.append("files", file);
      formData.append("width", width);
      formData.append("Height", height);
      formData.append("fileType", "FooterFile");
      formData.append("Label", "FooterImage");
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
    };
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
        // BankLetterHead: templateIinerPdfHTML,
        // HeaderImageURL: bannerimage,
        // FooterImageURL: footerimage,
        BankLetterHead: templateIinerPdfHTML,
        HeaderImageURL: cropLogoImg,
        FooterImageURL: cropFooterImg,
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
        console.log(updateData);
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
                  <div className="col-md-8">
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
                            // handleBannerimg(e);
                            handleLogoImg(e);
                          }}
                          accept=".png, .jpg, .jpeg"
                        />
                        {logoImg && (
                          <div className="selection_container">
                            <div style={{ width: "60%" }}>
                              <Cropper
                                src={logoImg}
                                style={{ height: 400, width: "100%" }}
                                guides={false}
                                ref={logoImgRef}
                                initialAspectRatio={customAspectRatioPx}
                                aspectRatio={customAspectRatioPx}
                                viewMode={0}
                                preview=".preview"
                                dragMode="move"
                                cropBoxResizable={false}
                                toggleDragModeOnDblclick={false}
                              />

                              <button
                                className="mt-2 me-3 template-pdf-btn"
                                onClick={handleLogoImgSave}
                                disabled={!logoImg}
                              >
                                Save
                              </button>
                              <button
                                className="mt-2 me-3 template-pdf-btn"
                                onClick={() => setLogoImg(null)}
                              >
                                Close
                              </button>
                            </div>
                            <div
                              style={{
                                height: "400px",
                                width: "300px",
                                border: "1px solid #000",
                              }}
                            >
                              <div
                                className="preview"
                                style={{
                                  width: "100%",
                                  height: "100px",
                                  borderBottom: "1px solid",
                                }}
                              />
                            </div>
                          </div>
                        )}
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
                            // handleFooterimg(e);
                            handleFooterImg(e);
                          }}
                          accept=".png, .jpg, .jpeg"
                        />
                        {footerImg && (
                          <div className="selection_container">
                            <div style={{ width: "60%" }}>
                              <Cropper
                                src={footerImg}
                                style={{ height: 400, width: "100%" }}
                                guides={false}
                                ref={footerImgRef}
                                initialAspectRatio={customAspectRatioPx}
                                aspectRatio={customAspectRatioPx}
                                viewMode={0}
                                preview=".preview_footer"
                                dragMode="move"
                                cropBoxResizable={false}
                                toggleDragModeOnDblclick={false}
                              />

                              <button
                                className="mt-2 me-3 template-pdf-btn"
                                onClick={handleFooterImgSave}
                                disabled={!footerImg}
                              >
                                Save
                              </button>
                              <button
                                className="mt-2 me-3 template-pdf-btn"
                                onClick={() => setFooterImg(null)}
                              >
                                Close
                              </button>
                            </div>
                            <div
                              style={{
                                height: "400px",
                                width: "300px",
                                border: "1px solid #000",
                                display: "flex",
                                alignItems: "end",
                              }}
                            >
                              <div
                                className="preview_footer"
                                style={{
                                  width: "100%",
                                  height: "100px",
                                  borderBottom: "1px solid",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4" style={{}}>
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
                            {/* {savedLogoImg ? (
                              <img
                                src={savedLogoImg}
                                alt="Banner Preview"
                                style={{
                                  width: `${templaesetting.bannerwidth + "%"}`,
                                  padding: `${
                                    templaesetting.bannerpadding + "px"
                                  }`,
                                }}
                              />
                            ) : cropLogoImg ? (
                              <img
                                src={cropLogoImg}
                                alt="Banner Preview"
                                style={{
                                  width: `${templaesetting.bannerwidth + "%"}`,
                                  padding: `${
                                    templaesetting.bannerpadding + "px"
                                  }`,
                                }}
                              />
                            ) : (
                              <h3>logo image not present</h3>
                            )} */}
                            {cropLogoImg ? (
                              <img
                                src={cropLogoImg}
                                alt="logo preview"
                                style={{
                                  width: `${templaesetting.bannerwidth + "%"}`,
                                  padding: `${
                                    templaesetting.bannerpadding + "px"
                                  }`,
                                }}
                              />
                            ) : savedLogoImg ? (
                              <img
                                src={savedLogoImg}
                                alt="logo Preview"
                                style={{
                                  width: `${templaesetting.bannerwidth + "%"}`,
                                  padding: `${
                                    templaesetting.bannerpadding + "px"
                                  }`,
                                }}
                              />
                            ) : (
                              <h3>logo image not present</h3>
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
                            {cropFooterImg ? (
                              <img
                                src={cropFooterImg}
                                alt="Footer Preview"
                                style={{
                                  width: `${templaesetting.bannerwidth + "%"}`,
                                  padding: `${
                                    templaesetting.bannerpadding + "px"
                                  }`,
                                }}
                              />
                            ) : savedFooterImg ? (
                              <img
                                src={savedFooterImg}
                                alt="Footer Preview"
                                style={{
                                  width: `${templaesetting.bannerwidth + "%"}`,
                                  padding: `${
                                    templaesetting.bannerpadding + "px"
                                  }`,
                                }}
                              />
                            ) : (
                              <h3>Footer image not present</h3>
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
                          disabled={
                            editorText || bannerimage || footerimage
                              ? false
                              : true
                          }
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
        <div style={{ display: "none" }}>
          <table ref={pdfTargetRef}>
            <tr>
              <td>
                <div>&nbsp;</div>
              </td>
            </tr>
          </table>
        </div>
      </>
    </>
  );
};
export default EditorTemplate;
