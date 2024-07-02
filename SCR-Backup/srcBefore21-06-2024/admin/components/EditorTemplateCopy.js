import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet'
import AdminDashboardLayout from './AdminDashboardLayout'
import 'jodit';
import JoditEditor from 'jodit-react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const EditorTemplate = () => {
    const editor = useRef(null);
    const [editorText, setEditorText] = useState("")
    const [headerImg, setHeaderImg] = useState('')

    const [editorValue, setEditorValue] = useState({
        headerBgColor: "",
        headingtop: "",
        paragraph: "",
    })

    const handleEditorChange = (e) => {
        const { name, value } = e.target;
        setEditorValue((prevEditorValue) => ({
            ...prevEditorValue, [name]: value
        }))

    }
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6] }],
            [{font: []}],
            [{size: []}],
            
            ["bold",'italic','underline'],
            [
                {list : 'ordered'},
                {list:'bullet'},
                {indent: '+1'},
                {indent:'-1'},
              
            ],
            []
        ]

    }
    const handleHeaderImg = (e) => {
        console.log("e", e.target.files);
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (allowedTypes.includes(file.type)) {
                console.log("include", URL.createObjectURL(file));
                setHeaderImg(URL.createObjectURL(file));
            } else {
                alert('Please select a valid PNG, JPEG, or JPG file.');
                e.target.value = null;
            }
        }

    }
    console.log("editorText", editorText);
    return (
        <>
            <Helmet><title>Editor</title></Helmet>
            <AdminDashboardLayout>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active">Bank</li>
                    </ol>
                </nav>

                <section className="section dashboard adminDashboard">



                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='datatable'>

                                <div className='row'>
                                    <div className='col-md-5'>
                                        <div className='form-left-editor '>
                                            <div className='form-box-outer'>
                                                <h2 className='mt-0'>Top Banner</h2>

                                                <label>Logo<small>(.png, .jpg, .jpeg)</small></label>
                                                <input type='file' className='form-control bx2' onChange={(e) => handleHeaderImg(e)} />
                                            </div>
                                            <div className='form-box-outer'>
                                                <label>Background color</label>
                                                <input type='color' className='form-control bx2' name='headerBgColor' onChange={(e) => handleEditorChange(e)} />
                                            </div>
                                            <div className='form-box-outer'>
                                                <h2>Text Body One</h2>
                                                <label>heading</label>
                                                <textarea name='headingtop' className='form-control bx2' onChange={(e) => handleEditorChange(e)} />
                                            </div>
                                            <div className='form-box-outer'>
                                                <label>Paragraph</label>
                                                {/* <textarea name='paragraph' className='form-control bx' onChange={(e) => handleEditorChange(e)} /> */}
                                                {/* <JoditEditor
                                                    ref={editor}
                                                   
                                                    value={content}
                                                    onChange={newComntent => setContent(newComntent)}

                                                /> */}


                                                <ReactQuill
                                                    theme="snow"
                                                    value={editorText}
                                                    modules={modules}
                                                    onChange={newComntent => setEditorText(newComntent)} />

                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-7'>
                                        <div className='form-right-editor template-pdf'>
                                            <div className='header-editor-data header-pdf' style={{ background: `${editorValue.headerBgColor}` }}>
                                                {headerImg && <img src={headerImg} alt='header-img' />}
                                            </div>
                                            <div className='template-iiner-pdf'>
                                                {editorValue?.headingtop ? <h2> <pre>{editorValue?.headingtop}</pre></h2> : ""}
                                            </div>
                                            <h2>Hello to welcome Editor right side </h2>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </section>


            </AdminDashboardLayout>
        </>
    )
}

export default EditorTemplate