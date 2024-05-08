import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import TemplatePagePDF from "./pages/TemplatePagePDF";
import Login from "./login/Login";
import UserType from "./login/UserType";
import IndividualRegister from "./login/IndividualRegister";
import BankRegister from "./login/BankRegister";
import GovAgencieRegister from "./login/GovAgencieRegister";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Storage } from "./login/Storagesetting";
import ExportNewRequest from "./pages/ExportNewRequest";
import ChangePassword from "./login/ChangePassword";
import AdminHome from "./admin/pages/AdminHome";
import ApplicationType from "./admin/pages/ApplicationType";
import SectorMaster from "./admin/pages/SectorMaster";
import SubSectorList from "./admin/pages/SubSectorList";
import SubApplicationType from "./admin/pages/SubApplicationType";
import PendingUser from "./admin/pages/PendingUser";
import CurrencyMaster from "./admin/pages/CurrencyMaster";
import CountryMaster from "./admin/pages/CountryMaster";
import BankMaster from "./admin/pages/BankMaster";
import Attachment from "./admin/pages/Attachment";
import FINVDashboard from "./pages/FINVDashboard";
import FINVNewRequest from "./pages/FINVNewRequest";
import ApprovedUser from "./admin/pages/ApprovedUser";
import CompanyMaster from "./admin/pages/CompanyMaster";
import GovtAgencyMaster from "./admin/pages/GovtAgencyMaster";
import ExportSubmittedRequests from "./pages/ExportSubmittedRequests";
import ExportPendingRequests from "./pages/ExportPendingRequests";
import ExportApprovedRequests from "./pages/ExportApprovedRequests";
import ExportRejectedRequests from "./pages/ExportRejectedRequests";
import ExportDeferredRequests from "./pages/ExportDeferredRequests";
import ExportCancelledRequests from "./pages/ExportCancelledRequests";
import EditTemp from './admin/components/EditorTemplate'
import TatData from "./TatData";
import Profile from "./pages/Profile"
import NotApproveUser from "./admin/pages/NotApprovedUser";
import Directives from "./admin/pages/Directives";
import AdminNotFound from "./admin/pages/AdminNotFound";
import ImportNewForm from "./pages/ImportNewForm";
import ImportDashboard from "./pages/ImportDashboard";
import ExportExpiredRequests from "./pages/ExportExpiredRequests";
import ExportExpiringRequests from "./pages/ExportExpiringRequests";
import CircularsRequests from "./pages/CircularsRequests"


function App() {
  const loginToken = Storage.getItem("loginToken");
  const userName = Storage.getItem("userName");
  const userID = Storage.getItem("userID");
  const ipAddress = Storage.getItem("ipAddress");
  const rollId = Storage.getItem("roleIDs");

  const navigation = useNavigate();

  setTimeout(() => {
    localStorage.removeItem("resetpasswordtoken");
  }, 100000);

  return (
    <>
      <Routes>
        {loginToken && userName && userID && rollId == 1 ? (
          <>
            <Route path="/" element={<AdminHome />} />
            <Route
              path="/ApplicationSubType"
              element={<SubApplicationType />}
            />
            <Route path="/SectorMaster" element={<SectorMaster />} />
            <Route path="/SubSectorList" element={<SubSectorList />} />
            <Route path="/PendingUser" element={<PendingUser />} />
            <Route path="/ApplicationType" element={<ApplicationType />} />
            <Route path="/CurrencyMaster" element={<CurrencyMaster />} />
            <Route path="/CountryMaster" element={<CountryMaster />} />
            <Route path="/CompanyMaster" element={<CompanyMaster />} />
            <Route
              path="/GovernmentAgencyMaster"
              element={<GovtAgencyMaster />}
            />
            <Route path="/AttachmentMaster" element={<Attachment />} />
            <Route path="/ApprovedUser" element={<ApprovedUser />} />
            <Route path="/NotApprovedUser" element={<NotApproveUser />} />
            <Route path="/PendingUser" element={<PendingUser />} />
            <Route path="/BankMaster" element={<BankMaster />} />
            <Route path="/EditTemp" element={<EditTemp />} /> 
            <Route path="/Directives" element={<Directives />} />
          


            <Route path="*" element={<AdminNotFound />} />
          </>
        ) : loginToken &&
          userName &&
          userID &&
          ipAddress != null &&
          ipAddress != undefined &&
          rollId != 1 ? (
          <>
            <Route path="/BankADLADashboard" element={<Home />} />
            <Route path="/ExportNewRequest" element={<ExportNewRequest />} />
            <Route path="/ImportNewForm" element={<ImportNewForm />} />
            <Route path="/template" element={<TemplatePagePDF />} />
            <Route path="/ImportDashboard" element={<ImportDashboard />} />
            <Route path="/FINVDashboard" element={<FINVDashboard />} />
            <Route path="/FINVNewRequest" element={<FINVNewRequest />} />
            <Route
              path="/Profile"
              element={<Profile />}
            />
            <Route
              path="/ExportPendingRequests"
              element={<ExportPendingRequests />}
            />
            <Route
              path="/ExportSubmittedRequests"
              element={<ExportSubmittedRequests />}
            />
            <Route
              path="/ExportApprovedRequests"
              element={<ExportApprovedRequests />}
            />
            <Route
              path="/ExportRejectedRequests"
              element={<ExportRejectedRequests />}
            />
            <Route
              path="/ExportDeferredRequests"
              element={<ExportDeferredRequests />}
            />
            <Route
              path="/ExportCancelledRequests"
              element={<ExportCancelledRequests />}
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/ExportExpired" element={<ExportExpiredRequests />} />
            <Route path="/ExportExpiringRequests" element={<ExportExpiringRequests />} /> 
            <Route path="/Circulars" element={<CircularsRequests />}/>
          </>
        ) : (
          <>
            <Route path="/usertype" element={<UserType />} />
            <Route
              path="/IndividualRegister"
              element={<IndividualRegister />}
            />
            <Route path="/BankRegister" element={<BankRegister />} />
            <Route
              path="/GovAgencieRegister"
              element={<GovAgencieRegister />}
            />
            <Route path="*" element={<Login />} />
            <Route
              path={`/reset-password/:token`}
              element={<ChangePassword />}
            />
            <Route path="/TatData" element={<TatData />} />
          </>
        )}
      </Routes>

      <ToastContainer closeButton={false} />
    </>
  );
}

export default App;
