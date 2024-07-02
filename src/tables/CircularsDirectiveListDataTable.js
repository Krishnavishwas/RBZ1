import React, { useState } from 'react';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from 'primereact/inputtext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet';

const CircularsDirectiveListDataTable = ({ DirectiveOption, selectedDirectives, setSelectedDirectives }) => {
  const [showDirectiveFileModal, setShowDirectiveFileModal] = useState(false);
  const [Directivefiles, setDirectivefiles] = useState([]);
  const [DirectiveName, setDirectiveName] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const handleDirectiveFileClose = () => setShowDirectiveFileModal(false);
  const handleDirectiveFileModalShow = () => setShowDirectiveFileModal(true);

  const GetApplicationFileNmae = (directivename, filePath) => { 
    setDirectivefiles(filePath);
    setDirectiveName(directivename);
  };
 
  
  const action = (rowData) => {
    return (
      <>
      <Helmet>
       <style>
        {
            `
             .p-connected-overlay-enter-done {
    z-index: 111;
    display: -webkit-box;
    z-index: 11111 !important;
}
    .p-dropdown-panel .p-dropdown-items .p-dropdown-item{
    width:100%
    }
    `
        }
      
       </style>
      </Helmet>
        <i
          className="pi pi-eye"
          style={{
            padding: "10px 5px",
            marginRight: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            GetApplicationFileNmae(rowData.label, rowData.filePath);
            handleDirectiveFileModalShow();
          }}
          onMouseEnter={(e) => {
            e.target.style.color = "var(--primary-color)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color = "";
          }}
        ></i>
      </>
    );
  };

  return (
    <>
      <div className="p-inputgroup" style={{ marginBottom: '10px' }}>
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search by directive names and tags"
        />
        <span className="p-inputgroup-addon">
          <i className="pi pi-search" />
        </span>
      </div>

      <DataTable
         value={DirectiveOption}
         scrollable
         scrollHeight="650px"
         className="mt-1"
         selection={selectedDirectives}
         onSelectionChange={(e) => setSelectedDirectives(e.value)}
         paginator
         rows={10}
         rowsPerPageOptions={[10, 50, 100]}
         paginatorPosition={"bottom"}
         dataKey="label"
         paginatorLeft
         selectionMode="checkbox"
         rowHover
         isDataSelectable={(rowData) => (rowData.data.status === 1)}
         rowClassName={(rowData) => (rowData.status === 1 ? '' : 'p-disabled')}
         emptyMessage="No Data found."
         globalFilter={globalFilter}
      >
        <Column
    selectionMode="multiple" 
    style={{ width: "40px", cursor: "pointer" }}
    exportable={false}  >
    </Column>
        <Column
           field="label"
           header="Directives"
           sortable
           style={{ width: "44%" }}
           body={(rowData) => <span style={{ textTransform: "capitalize" }}>{rowData.label}</span>}
        ></Column>
        {/* <Column
        field='tagName'
        header='Tag Name' 
        body={(rowData) => rowData.tagName.split(",").map(tag => <span className="tagsname">{tag.trim()}</span>)}
        style={{width:"36%"}}
        ></Column> */}
        <Column
    field='tagName'
    header='Tag Name' 
    body={(rowData) => 
        rowData.tagName.split(",").map(tag => {
            const trimmedTag = tag.trim();
            const capitalizedTag = trimmedTag.charAt(0).toUpperCase() + trimmedTag.slice(1);
            return <span className="tagsname">{capitalizedTag}</span>;
        })
    }
    style={{width:"36%"}}
/>
        <Column
          field=""
          header="View Files"
          style={{ width: "300px" }}
          frozen
          alignFrozen="right"
          body={action}
        ></Column>
      </DataTable>

      <Modal
        size="lg"
        show={showDirectiveFileModal}
        onHide={handleDirectiveFileClose}
        backdrop="static"
        className="directiveModal"
      >
        <div className="application-box">
          <div className="login_inner ">
            <div className="login_form ">
              <h5>
                <Modal.Header closeButton className="p-0">
                  <Modal.Title>
                  Directives Files
                  </Modal.Title>
                </Modal.Header>
              </h5>
            </div>
            <div className="login_form_panel min-h440">
              <Modal.Body className="p-0">
                <div className="form-bx mb-4">
                  <label>
                    <input
                      type="text"
                      name="directiveName"
                      className="fomcontrol text-capitalize"
                      placeholder="Directive Name"
                      value={DirectiveName}
                      disabled
                    />
                    <span className="sspan"></span>
                  </label>
                  <div className='row mt-4'>
                    <div className='col-md-12'>
                      <h4 className='filelinkheading'>Files</h4>
                      <div className="file-detail_url">
                        {
                          Directivefiles?.length ? Directivefiles?.map((item, index) => {
                            return (
                              <h6 key={index}>
                                <span>
                                  {DirectiveName} {index + 1}
                                </span>
                                <a target="_blank" href={item.filePath}
                                  className="file-action-btn"
                                >
                                  View
                                </a>
                              </h6>
                            );
                          })
                            :
                            "No file found."
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </div>
            <Modal.Footer className="justify-content-end">
              <Button variant="secondary" onClick={handleDirectiveFileClose}>Close</Button>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CircularsDirectiveListDataTable;
