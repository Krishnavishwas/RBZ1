import React, { useEffect, useRef } from "react";
import moment from "moment";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import logo from "../rbz_LOGO.png";
import dummysign from "../dummy_sign.png";

const ExportPdf = ({ applicationDetail, pdfState }) => {
  const PdftargetRef = useRef();

  const Pdfoption = {
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

//   generatePDF(PdftargetRef, { filename: "page.pdf", Pdfoption })


  return (
    <div>
      <div
        ref={PdftargetRef}
        className="p-5 mx-auto"
        style={{ position: "relative" }}
      >
        <h6 className="text_preview">Preview</h6>
        <table width="100%" className="pdfTable">
          <tr>
            <td width="25%">
              <p
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "0px",
                  marginLeft: "auto",
                }}
              >
                <img src={logo} alt="logo" className="w-100" />
              </p>
            </td>
            <td className="align-middle" width="75%">
              <p
                style={{
                  marginBottom: "0px",
                  color: "#000",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                Reserve Bank of Zimbabwe. 80 Samora Machel Avenue, P.O. Box
                1283, Harare, Zimbabwe.
              </p>
              <p
                style={{
                  // marginBottom: "0px",
                  color: "#000",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                Tel: 263 242 703000, 263 8677000477, Website: www.rbz.co.zw
              </p>
            </td>
          </tr>
          <tr>
            <td
              width="20%"
              style={{
                marginBottom: "0px",
                color: "#000",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Exchange Control Ref
              <br />
              Previous Exchange Control Ref
            </td>
            <td width="80%">
              <p
                style={{
                  marginBottom: "0px",
                  color: "#000",
                  fontSize: "14px",
                  textAlign: "left",
                  fontWeight: "600",
                }}
              >
                : {applicationDetail?.rbzReferenceNumber}
                <br />: N/A
              </p>
            </td>
          </tr>
          <tr>
            <td
              colSpan="2"
              style={{
                color: "#000",
                fontSize: "16px",
                fontWeight: "400",
              }}
            >
              {moment(applicationDetail?.applicationSubmittedDate).format(
                "DD MMMM YYYY"
              )}
            </td>
          </tr>
          <tr>
            <td
              colSpan="2"
              style={{
                color: "#000",
                fontSize: "16px",
                fontWeight: "400",
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
              {applicationDetail?.bankAddress2 != null ||
              applicationDetail?.bankAddress2 != ""
                ? applicationDetail?.bankAddress2 + "," + " "
                : ""}
              {applicationDetail?.bankAddress3 != null ||
              applicationDetail?.bankAddress3 != ""
                ? applicationDetail?.bankAddress3
                : ""}
              <br />
              <u className="text-uppercase" style={{ fontWeight: "600" }}>
                {applicationDetail?.bankCity != null ||
                applicationDetail?.bankCity != ""
                  ? applicationDetail?.bankCity
                  : ""}
              </u>
            </td>
          </tr>
          <tr>
            <td
              colSpan="2"
              style={{
                color: "#000",
                fontSize: "16px",
                fontWeight: "400",
              }}
            >
              Dear Sir/Madam,
            </td>
          </tr>
          <tr>
            <td className="p-0" colSpan="2">
              <table width="100%" className="return-tables">
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      padding: "5px 15px 15px",
                    }}
                  >
                    <p
                      style={{
                        color: "#000",
                        fontSize: "16px",
                        fontWeight: "600",
                        borderBottom: "1px solid #000",
                        marginBottom: "0px",
                      }}
                    >
                      RE: EXTENSION OF ACQUITTAL PERIOD FOR ADVANCE PAYMENTS
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    width="25%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    Exporter
                  </td>
                  <td
                    width="75%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    :{" "}
                    {applicationDetail?.companyName != null
                      ? applicationDetail?.companyName
                      : applicationDetail?.name}
                  </td>
                </tr>
                <tr>
                  <td
                    width="25%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    Date Submitted
                  </td>
                  <td
                    width="75%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    :{" "}
                    {moment(applicationDetail?.applicationSubmittedDate).format(
                      "DD MMMM YYYY"
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    width="25%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    Currency and Amount
                  </td>
                  <td
                    width="75%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    : {applicationDetail?.currencyCode}
                    &nbsp;
                    {applicationDetail?.amount}
                  </td>
                </tr>
                <tr>
                  <td
                    width="25%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    USD Equivalent
                  </td>
                  <td
                    width="75%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    : USD &nbsp;
                    {applicationDetail?.usdEquivalent}
                  </td>
                </tr>
                <tr>
                  <td
                    width="25%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    Status/Decision
                  </td>
                  <td
                    width="75%"
                    style={{
                      color: "#000",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    : {applicationDetail?.statusName}
                  </td>
                </tr>
                <tr>
                  <td
                    width="25%"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    Expiry Date
                  </td>
                  <td
                    width="75%"
                    style={{
                      color: "#000",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    :{" "}
                    {applicationDetail?.expiringDate == null ||
                    applicationDetail?.expiringDate == ""
                      ? "N/A"
                      : applicationDetail?.expiringDate}
                  </td>
                </tr>
                <tr>
                  <td
                    width="25%"
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#000",
                    }}
                  >
                    Returns Frequency
                  </td>
                  <td
                    width="75%"
                    style={{
                      color: "#000",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    :{" "}
                    {applicationDetail?.returnFrequencyName == null ||
                    applicationDetail?.returnFrequencyName == ""
                      ? "N/A"
                      : applicationDetail?.returnFrequencyName}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td className="p-0" colSpan="2">
              <table>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: "600",
                      textDecoration: "underline",
                      padding: "15px 15px 15px",
                    }}
                  >
                    Response/Conditions
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="p-0">
                    <table width="100%">
                      <tr>
                        <td
                          style={{
                            color: "#000",
                            fontSize: "16px",
                            fontWeight: "400",
                          }}
                        >
                          <div
                            className="header_content"
                            dangerouslySetInnerHTML={{
                              __html: applicationDetail?.analystDescription,
                            }}
                          />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "400",
                      padding: "5px 15px 15px",
                    }}
                  >
                    Yours Sincerely,
                    <img
                      src={dummysign}
                      alt="Signature"
                      style={{
                        width: "120px",
                        height: "50px",
                        borderBottom: "2px dotted #000",
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
                        padding: "10px 0px",
                      }}
                    >
                      deputydirector7
                    </p>
                    <h3
                      style={{
                        color: "#000",
                        fontSize: "16px",
                        fontWeight: "600",
                        textDecoration: "underline",
                      }}
                    >
                      EXCHANGE CONTROL
                    </h3>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default ExportPdf;
