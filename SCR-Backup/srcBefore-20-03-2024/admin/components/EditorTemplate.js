import React, { useState, useRef, useEffect } from 'react';
import { useLocation , useNavigate} from "react-router-dom";
import { Helmet } from 'react-helmet'
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import AdminDashboardLayout from '../components/AdminDashboardLayout'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import axios from 'axios';
import { APIURL,IMGURL } from "../../constant";
const EditorTemplate = () => {
    // const editor = useRef(null);
    const navigate = useNavigate();
    const banktoEditorPage = useLocation();
    const bankID = banktoEditorPage.state;

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
    const footerbgRef = useRef(null)

    const targetRef = useRef();
    const [editorText, setEditorText] = useState("")
    const [bannerimage, setBannerimage] = useState('');
    const [watermarkimage, setwatermarkimage] = useState('');
    const [footerimage, setfooterimage] = useState('');

    // const editorRef = useRef();
    // const contentRef = useRef();
    const [editorValue, setEditorValue] = useState("");
    const editorRef = useRef(null);
    const contentRef = useRef(null);
    const [value, setValue] = useState("");
    // editor option start

    const editorOptions = {
        font: ["Arial",
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
            "Helvetica"],
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
                "#CCCCCC"
            ]
        ],
    };
    //editor option end 

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
        footertextgap: ''
    });


    const options = {
        // default is `save`
        method: 'open',
        resolution: Resolution.HIGH,
        page: {
            margin: Margin.SMALL,
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            orientation: 'landscape',
        },
        canvas: {
            mimeType: 'image/png',
            qualityRatio: 1
        },
        overrides: {
            // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
            pdf: {
                compress: true
            },
            canvas: {
                useCORS: true
            }
        },
    };
    // let imgUrl = "http://localhost:3000/"
   

    const handleBannerimg = (e) => {
        const file = e.target.files[0];

        if (file) {
           
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (allowedTypes.includes(file.type)) {
                setBannerimage(URL.createObjectURL(file));
                //  setBannerimage(imgUrl(file.type));
            } else {
                alert('Please select a valid PNG, JPEG, or JPG file.');
                e.target.value = null;
            }
        }
     
        
            // if (file) {
            //     const localUrl = URL.createObjectURL(file);
            //    console.log("localUrl",localUrl);
            //     const localToLiveUrl = localUrl.replace('https://dmsupgrade.in', 'http://localhost:3000');
            //     const liveToLocalUrl = localUrl.replace('http://localhost:3000','https://dmsupgrade.in');
            //     console.log("file", liveToLocalUrl);
        
            //     const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            //     if (allowedTypes.includes(file.type)) {
            //         // setBannerimage(localToLiveUrl);
            //         setBannerimage(liveToLocalUrl);
            //     } else {
            //         alert('Please select a valid PNG, JPEG, or JPG file.');
            //         e.target.value = null;
            //     }
            // }
      
        
    };

    const handleFooterimg = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (allowedTypes.includes(file.type)) {
                setfooterimage(URL.createObjectURL(file));
            } else {
                alert('Please select a valid PNG, JPEG, or JPG file.');
                e.target.value = null;
            }
        }
    };


    const handleWatermark = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (allowedTypes.includes(file.type)) {
                setwatermarkimage(URL.createObjectURL(file));
            } else {
                alert('Please select a valid PNG, JPEG, or JPG file.');
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
        setBannerimage('');
        setwatermarkimage('');
        setfooterimage('')


        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (fileInputRef2.current) {
            fileInputRef2.current.value = '';
        }
        if (fileInputRef3.current) {
            fileInputRef3.current.value = '';
        }
        if (fileInputRef4.current) {
            fileInputRef4.current.value = '';
        }
        if (imagesizeRef.current) {
            imagesizeRef.current.value = '';
        }
        if (marginRef.current) {
            marginRef.current.value = ''
        }
        if (fontsizeRef.current) {
            fontsizeRef.current.value = '';
        }
        if (paddingRef.current.value) {
            paddingRef.current.value = '';
        }
        if (paddingRef2.current.value) {
            paddingRef2.current.value = '';
        }
        if (waterInputRef.current.value) {
            waterInputRef.current.value = ''
        }
        if (paraonelignhightRef.current.value) {
            paraonelignhightRef.current.value = ''
        }
        if (imagesizRef.current.value) {
            imagesizRef.current.value = ''
        }
        if (footertextSizeRef.current.value) {
            footertextSizeRef.current.value = ''
        }
        if (footertextRef.current.value) {
            footertextRef.current.value = ''
        }
        if (footertextColorRef.current.value) {
            footertextColorRef.current.value = ''
        }
        if (footerpostionRef.current.value) {
            footerpostionRef.current.value = ""
        }
        if (footerflexRef.current.value) {
            footerflexRef.current.value = ''
        }
        if (footertextgapRef.current.value) {
            footertextgapRef.current.value = ''
        }
        if (footerbgRef.current.value) {
            footerbgRef.current.value = ''
        }

    }

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6] }],
            [{ font: [] }],
            [{ table: [] }],
            [{ size: ['small', 'large', 'huge'] }],
            [{ color: [] }],
            [{ background: [] }],
            [{'script': 'sub'}, {'script': 'super'}],
            ["bold", 'italic', 'underline'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '+1' },
                { indent: '-1' },

            ],
            // [{ 'highlight': 'toggle' }],
            // [{ 'disHighlight': 'toggle' }]
        ]

    }

    useEffect(() => {
        if (!contentRef.current) return;
        contentRef.current.innerHTML = value;
    }, [value]);

    const onChangeHandler = (content) => {
        //console.log("onChange", content);
        setValue(content);
    };

    // send Editor Html data

    const handleSubmitHtml = async (e) => {
        // alert("hui")
        e.preventDefault();
        const htmlValue = e.target.innerHTML; // Get the innerHTML of the target element
      
        //  localStorage.setItem("htmlData", htmlValue); // Store the HTML content as a string
        try {
            const letterHead = {
                ID: bankID,
                BankLetterHead: htmlValue
            }
        
            const response = await fetch(APIURL + 'Admin/UpdateBankLetterHead', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(letterHead)
            });
            const data = await response.json();
          
            if (data.responseCode === '200') { 
                navigate('/BankMaster')
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <>
            <AdminDashboardLayout >
                <Helmet><title>Editor</title></Helmet>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active">Editor</li>
                    </ol>
                </nav>


                <section className="section dashboard adminDashboard">

                    <div className="row">
                        <div className="cont-md-12">
                            <div className="card p-4 editor-box">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className='form-pdf'>
                                            <div className='form-box-outer'>
                                                <h2 className='mt-0'>Top Banner</h2>
                                                <label>Logo <small>(.png, .jpg, .jpeg)</small></label>
                                                <input type='file' className='form-control bx' name='bannerimage' ref={fileInputRef} onChange={(e) => { handleBannerimg(e) }} accept='.png, .jpg, .jpeg' />
                                            </div>
                                            <div className='form-box-outer'>
                                                <label>Background Color</label>
                                                <input type='color' className='form-control bx' name='bannercolor' ref={waterInputRef} onChange={(e) => { Tempalehandel(e) }} accept='.png, .jpg, .jpeg' />
                                            </div>
                                            {/* <div className='form-box-outer'>
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Alignment</label>
                                                            <select className='form-control bx' name='banneralign' onChange={(e) => { Tempalehandel(e) }}>
                                                                <option>center</option>
                                                                <option>left</option>
                                                                <option>right</option>
                                                                <option>justify</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Image Size <small>(If needed in %)</small></label>
                                                            <input type='number' min={2} name='bannerwidth' ref={imagesizeRef} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Padding <small>(If needed in PX)</small></label>
                                                            <input type='number' min={0} name='bannerpadding' ref={paddingRef} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                            {/* <div className='form-box-outer'>
                                            <h2>Watermark</h2>
                                            <label>Image <small>(.png, .jpg, .jpeg)</small></label>
                                            <input type='file' className='form-control bx' name='watermarkimage' ref={waterInputRef} onChange={(e) => { handleWatermark(e) }} accept='.png, .jpg, .jpeg' />
                                        </div> */}

                                            {/* <div className='form-box-outer'>
                                                <h2>Text Body One</h2>
                                                <label>heading</label>
                                                <textarea name='headingtop' className='form-control bx2' ref={fileInputRef2} onChange={(e) => { Tempalehandel(e) }} />

                                            </div> */}

                                            <div className='form-box-outer'>
                                                <label>Paragraph</label>
                                                {/* <SunEditor
                                                  ref={editorRef}
                                                  setOptions={editorOptions}
                                                  lang="es"
                                                  value={editorValue}
                                            
                                                
                                            onChange={newComntent => setEditorValue(newComntent)} 
                                                 /> */}
                                                {/* <SunEditor
                                                    ref={editorRef}
                                                    setOptions={editorOptions}
                                                    lang="es"
                                                    // onImageUploadError={onImageUploadError}
                                                    onChange={onChangeHandler}
                                                /> */}
                                                <ReactQuill
                                                    theme="snow"

                                                    value={editorText}
                                                    modules={modules}
                                                    onChange={newComntent => setEditorText(newComntent)} />
                                                {/* <textarea name='paraonetxt' className='form-control bx' ref={fileInputRef3} onChange={(e) => { Tempalehandel(e) }} /> */}
                                            </div>

                                            {/* <div className='form-box-outer'>
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Alignment</label>
                                                            <select className='form-control bx' name='paraonealign' onChange={(e) => { Tempalehandel(e) }}>
                                                                <option>left</option>
                                                                <option>center</option>
                                                                <option>right</option>
                                                                <option>justify</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Font Size <small>(If needed in PX)</small></label>
                                                            <input type='number' min={9} name='paraonesize' ref={fontsizeRef} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>

                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Font Weight </label>
                                                            <select className='form-control bx' name='paraoneweight' onChange={(e) => { Tempalehandel(e) }}>
                                                                <option>normal</option>
                                                                <option>500</option>
                                                                <option>bold</option>
                                                            </select>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='form-box-outer'>
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Line Height <small>(If needed in PX)</small></label>
                                                            <input type='number' min={22} className='form-control bx' ref={paraonelignhightRef} name='paraonelignhight' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>

                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Margin <small>(If needed in PX)</small></label>
                                                            <input type='number' min={0} name='paraonemargin' ref={marginRef} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>

                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Font Color </label>
                                                            <input type='color' className='form-control bx' name='paraonecolor' onChange={(e) => { Tempalehandel(e) }} />

                                                        </div>
                                                    </div>

                                                </div>
                                            </div> */}

                                            <div className='form-box-outer'>
                                                <h2>Footer</h2>

                                                <label>Image <small>(.png, .jpg, .jpeg)</small></label>
                                                <input type='file' className='form-control bx' name='footerimage' ref={fileInputRef4} onChange={(e) => { handleFooterimg(e) }} accept='.png, .jpg, .jpeg' />
                                            </div>



                                            <div className='form-box-outer'>
                                                <label>Background Color</label>
                                                <input type='color' className='form-control bx' ref={footerbgRef} name='footercolor' onChange={(e) => { Tempalehandel(e) }} accept='.png, .jpg, .jpeg' />
                                            </div>

                                            <div className='row'>
                                                <div className='col-md-12'>
                                                    <div className='form-box-outer'>
                                                        <label>Footer Text </label>
                                                        <input type='text' name='footertext' ref={footertextRef} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className='form-box-outer mt-0'>
                                                <div className='row'>
                                                    

                                                    <div className='col-md-4'>
                                                        <label>Content Spacing</label>
                                                        <select className='form-control bx' onChange={(e) => { Tempalehandel(e) }} name='footerflex' ref={footerflexRef}>
                                                            <option>flex-start</option>
                                                            <option>flex-end</option>
                                                            <option>space-between</option>
                                                            <option>space-around</option>
                                                            <option>space-evenly</option>
                                                        </select>
                                                    </div>

                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Image Size <small>(If needed in %)</small></label>
                                                            <input type='number' min={0} name='footerwidth' ref={imagesizRef} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>

                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Padding <small>(If needed in PX)</small></label>
                                                            <input type='number' min={0} name='footerpadding' ref={paddingRef2} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Text Size <small>(If needed in PX)</small> </label>
                                                            <input type='number' min={0} name='footertextsize' ref={footertextSizeRef} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Text Color </label>
                                                            <input type='color' name='footertextcolor' ref={footertextColorRef} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <label>Footer Position</label>
                                                        <select className='form-control bx' onChange={(e) => { Tempalehandel(e) }} name='footerpostion' ref={footerpostionRef}>
                                                            <option>absolute</option>
                                                            <option>relative</option>
                                                        </select>
                                                    </div>


                                                    <div className='col-md-4'>
                                                        <div className='form-box-outer'>
                                                            <label>Content Gap </label>
                                                            <input type='number' name='footertextgap' min={0} ref={footertextgapRef} className='form-control bx' onChange={(e) => { Tempalehandel(e) }} />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div> */}

                                            <button onClick={() => generatePDF(targetRef, { filename: 'page.pdf', options })} className='template-pdf-btn'>Download PDF</button>

                                            {/* <button onClick={() => resetHandel()} className='template-pdf-btn mx-3'>Reset PDF</button> */}

                                        </div>



                                    </div>

                                    <div className="col-md-7">

                                        <div className='outer-tampale-pdf'>
                                            <form onSubmit={handleSubmitHtml} className='editor-review'>
                                                <div ref={targetRef} className='template-pdf'>

                                                    <div className='header-pdf' style={{ background: `${templaesetting.bannercolor}`, textAlign: `${templaesetting.banneralign}` }}>
                                                        {bannerimage && <img src={bannerimage} alt="Banner Preview" style={{ width: `${templaesetting.bannerwidth + "%"}`, padding: `${templaesetting.bannerpadding + "px"}` }} />}
                                                    </div>


                                                    <div className='template-iiner-pdf'>
                                                        {templaesetting.headingtop ? <h2 style={{ margin: `${templaesetting.paraonemargin + "px"}` }}><pre>{templaesetting.headingtop}</pre></h2> : ""}
                                                        <pre style={{ textAlign: `${templaesetting.paraonealign}`, fontWeight: `${templaesetting.paraoneweight}`, fontSize: `${templaesetting.paraonesize + "px"}`, lineHeight: `${templaesetting.paraonelignhight + "px"}`, margin: `${templaesetting.paraonemargin + "px"}`, color: `${templaesetting.paraonecolor}` }}><pre dangerouslySetInnerHTML={{ __html: editorText }} /></pre>
                                                    </div>


                                                    {watermarkimage && <img src={watermarkimage} alt="Banner Preview" className='pdfwatermark'/>}

                                                    <div className='pdf-footer' style={{ background: `${templaesetting.footercolor}`, textAlign: `${templaesetting.footeralign}`, position: `${templaesetting.footerpostion}`, justifyContent: `${templaesetting.footerflex}`, columnGap: `${templaesetting.footertextgap + 'px'}` }}>

                                                        {footerimage && <img src={footerimage} style={{ width: `${templaesetting.footerwidth + "%"}`, padding: `${templaesetting.footerpadding + "px"}` }} />
                                                        }

                                                        {templaesetting.footertext ? <h4 style={{ fontSize: `${templaesetting.footertextsize + "px"}`, padding: `${templaesetting.footerpadding + "px"}`, color: `${templaesetting.footertextcolor}`, }}>{templaesetting.footertext}</h4> : ""}
                                                    </div>




                                                </div>
                                                <button className='template-pdf-btn'>Submit</button>

                                            </form>
                                        </div>



                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                    {/* <div dangerouslySetInnerHTML={{ __html: htmlData }} ></div> */}
                </section>
            </AdminDashboardLayout>
        </>
    )
}

export default EditorTemplate
