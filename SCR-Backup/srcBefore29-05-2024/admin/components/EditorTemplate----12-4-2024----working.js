import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { APIURL, IMGURL, ImageAPI } from "../../constant";
import BankMasterTable from "../tables/BankMasterTable";
import { Storage } from "../../login/Storagesetting";

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
  const [editorText, setEditorText] = useState("");
  const [bannerimage, setBannerimage] = useState("");
  const [watermarkimage, setwatermarkimage] = useState("");
  const [footerimage, setfooterimage] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const editorRef = useRef(null);
  const contentRef = useRef(null);
  const [value, setValue] = useState("");
  // editor option start

  const editorOptions = {
    font: [
      "Arial",
      "Comic Sans MS",
      "Courier New",
      "Impact",
      "Georgia",
      "Tahoma",
      "Trebuchet MS",
      "Verdana",
      "Logical",
      "Salesforce Sans",
      "Garamond",
      "Sans-Serif",
      "Serif",
      "Times New Roman",
      "Helvetica",
    ],
    height: 200,
    fontSize: [12, 14, 16, 18, 20],
    buttonList: [
      ["bold", "underline", "italic"],
      ["fontColor", "hiliteColor"],
      ["align", "list"],
      ["table"],
      ["font", "fontSize"],
    ],
    colorList: [
      [
        "#828282",
        "#FF5400",
        "#676464",
        "#F1F2F4",
        "#FF9B00",
        "#F00",
        "#fa6e30",
        "#000",
        "rgba(255, 153, 0, 0.1)",
        "#FF6600",
        "#0099FF",
        "#74CC6D",
        "#FF9900",
        "#CCCCCC",
      ],
    ],
  };
  //editor option end

  useEffect(() => {
    setBannerimage(
      getBankData?.headerImageURL ? getBankData?.headerImageURL : ""
    );
    setEditorText(
      getBankData?.bankLetterHead ? getBankData?.bankLetterHead : ""
    );
    setfooterimage(
      getBankData?.footerImageURL ? getBankData?.footerImageURL : ""
    );
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

  const handleBannerimg = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("files", file);
    formData.append("bankID", bankID);
    if (file) {
      axios
        .post(ImageAPI + "File/UploadFile", formData)
        .then((res) => {
          setBannerimage(res.data.responseData.filePath);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const handleFooterimg = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("bankID", bankID);
    formData.append("files", file);
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

  const handleWatermark = (e) => {
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
  };

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

  console.log("getBankData - ", getBankData);

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.innerHTML = value;
  }, [value]);

  const onChangeHandler = (content) => {
    setValue(content);
  };

  const handleSubmitHtml = async (e) => {
    e.preventDefault();
    const templateIinerPdfHTML = document.querySelector(
      ".template-iiner-pdf"
    ).innerHTML;
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

  console.log("bannerimage", bannerimage);
  console.log("footerimage", footerimage);

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
                      <div className="form-box-outer">
                        <label>Paragraph</label>
                        <ReactQuill
                          theme="snow"
                          value={editorText}
                          modules={modules}
                          onChange={(newComntent) => setEditorText(newComntent)}
                        />
                      </div>
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
                              background: `${templaesetting.bannercolor}`,
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
                            {templaesetting.headingtop ? (
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
                            </pre>
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
                        <button className="template-pdf-btn">Submit</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default EditorTemplate;
