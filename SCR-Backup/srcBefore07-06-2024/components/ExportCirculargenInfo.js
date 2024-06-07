import React, { useState } from "react";
import { Storage } from "../login/Storagesetting";
import { Link } from "react-router-dom";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const ExportCirculargenInfo = ({ applicationDetail }) => {
  const roleID = Storage.getItem("roleIDs");

  return (
    <>
      <div className="inner_form_new ">
        <label className="controlform">Name</label>
        <div className="form-bx">
          <label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              // value={exportForm.name}
              value={applicationDetail?.name}
              disabled={roleID > 5}
            />
            <span className="sspan"></span>
          </label>
        </div>
      </div>
      {/* end form-bx  */}
      <div className="inner_form_new ">
        <label className="controlform">Content</label>
        <div className="form-bx">
          <label>
            <input
              type="text"
              name="content"
              placeholder="Content"
              value={applicationDetail?.content}
              disabled={roleID > 5}
            />
            <span className="sspan"></span>
          </label>
        </div>
      </div>
      {/* end form-bx  */}
      <div className="inner_form_new ">
        <label className="controlform">Attachments</label>
        <div className="form-bx">
          {applicationDetail?.attachedFiles?.length ? (
            applicationDetail?.attachedFiles?.map((items, index) => {
              return (
                <div className="attachemt_form-bx mb-0 width-80" key={items.id}>
                  <label className="mb-2 mb-0 pt-2 pb-2">
                    {/* {items.filename} */}
                    {items?.fileName ? items?.fileName : `FileUpload ${index}`}
                  </label>

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
            })
          ) : (
            <label className="notfound">File Not Found</label>
          )}
        </div>
      </div>

      <div className="inner_form_new">
        <label className="controlform">Bank</label>
        <div className="form-bx">
          <label>
            <input
              type="text"
              className=""
              disabled={roleID > 5}
              value={applicationDetail?.bankData?.map((item) => item.bankName)}
            />
          </label>
        </div>
      </div>
      {/* end form-bx  */}
      <div className="inner_form_new ">
        <label className="controlform">Subject</label>
        <div className="form-bx">
          <label>
            <textarea
              name="subject"
              placeholder="Subject"
              value={applicationDetail.subject}
              disabled={roleID > 5}
            />
            <span className="sspan"></span>
          </label>
        </div>
      </div>
      {/* end form-bx  */}
      <div className="inner_form_new ">
        <label className="controlform">Directives</label>
        <div className="form-bx">
          <label>
            <input
              type="text"
              className=""
              disabled={roleID > 5}
              value={applicationDetail?.directiveData?.map(
                (item) => item.directiveName
              )}
            />
          </label>
        </div>
      </div>
      {/* end form-bx  */}
      <div className="inner_form_new ">
        <label className="controlform">Releasing Date</label>
        <div className="form-bx">
          <label>
            <input
              type="text"
              className=""
              disabled
              value={moment(applicationDetail?.releasingDate).format(
                "DD/MMM/yyyy"
              )}
            />
          </label>
        </div>
      </div>
      {/* end form-bx  */}
    </>
  );
};

export default ExportCirculargenInfo;
