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
import EditTemp from "./admin/components/EditorTemplate";
import TatData from "./TatData";
import Profile from "./pages/Profile";
import NotApproveUser from "./admin/pages/NotApprovedUser";
import Directives from "./admin/pages/Directives";
import AdminNotFound from "./admin/pages/AdminNotFound";
import ImportNewForm from "./pages/ImportNewForm";
import ImportDashboard from "./pages/ImportDashboard";
import ExportExpiredRequests from "./pages/ExportExpiredRequests";
import ExportExpiringRequests from "./pages/ExportExpiringRequests";
import CircularsRequests from "./pages/CircularsRequests";
import CopiedResponse from "./pages/ExportCopiedResponse";
import ImportApprovedRequests from "./pages/ImportApprovedRequests";
import ImportDeferredRequests from "./pages/ImportDeferredRequests";
import ImportPendingRequests from "./pages/ImportPendingRequests";
import ImportRejectedRequests from "./pages/ImportRejectedRequests";
import ImportSubmittedRequests from "./pages/ImportSubmittedRequests"; 
import ActingRoleDashboard from "./pages/ActingRoleDashboard"
import ImportCancelledRequests from "./pages/ImportCancelledRequests";
import ImportsExpiredRequests from "./pages/ImportsExpiredRequests";
import ImportsExpiringRequests from "./pages/ImportsExpiringRequests";
import ImpersonateUser from "./admin/pages/ImpersonateUser";
import ExportCircularsRequests from "./pages/ExportCircularsRequests"
import ReferredDashboard from "./pages/ReferredDashboard";
import FINVSubmittedRequests from "./pages/FINVSubmittedRequests"
import Search from "./pages/Search";
import FINVPendingRequests from "./pages/FINVPendingRequests"
import FINVApprovedRequests from "./pages/FINVApprovedRequests"
import FINVRejectedRequests from "./pages/FINVRejectedRequests"
import FINVDeferredRequests from "./pages/FINVDeferredRequests"
import FINVCancelledRequests from "./pages/FINVCancelledRequests"
import FINVExpiredRequests from "./pages/FINVExpiredRequests"
import FINVExpiringRequests from "./pages/FINVExpiringRequests"

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
            <Route path="/Impersonate" element={<ImpersonateUser />} />

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
            <Route path="/Circulars" element={<ExportCircularsRequests />}/> 
            <Route path="/Profile" element={<Profile />} />
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
            <Route
              path="/ImportCancelledRequests"
              element={<ImportCancelledRequests />}
            />
            <Route
              path="/ImportsExpiredRequests"
              element={<ImportsExpiredRequests />}
            />
            <Route
              path="/ImportsExpiringRequests"
              element={<ImportsExpiringRequests />}
            />

            <Route path="/ExportExpired" element={<ExportExpiredRequests />} />
            <Route path="/ImportApprovedRequests" element={<ImportApprovedRequests />} />
            <Route path="/ImportDeferredRequests" element={<ImportDeferredRequests />} />
            <Route path="/ImportPendingRequests" element={<ImportPendingRequests />} />
            <Route path="/ImportRejectedRequests" element={<ImportRejectedRequests />} />
            <Route path="/ImportSubmittedRequests" element={<ImportSubmittedRequests />} />
            <Route path="/Search" element={<Search />} />
            <Route
              path="/ExportExpiringRequests"
              element={<ExportExpiringRequests />}
            />
            <Route path="/Circulars" element={<CircularsRequests />} />
            <Route path="/CopiedResponse" element={<CopiedResponse />} />
            <Route path="/ActingRoleDashboard" element={<ActingRoleDashboard />} />
            <Route
              path="/ReferredDashboard"
              element={<ReferredDashboard />}
            />
            <Route path="/FINVSubmittedRequests" element={<FINVSubmittedRequests />} />
            <Route path="/FINVPendingRequests" element={<FINVPendingRequests />} />
            <Route path="/FINVApprovedRequests" element={<FINVApprovedRequests />} />
            <Route path="/FINVRejectedRequests" element={<FINVRejectedRequests />} />
            <Route path="/FINVDeferredRequests" element={<FINVDeferredRequests />} />
            <Route path="/FINVCancelledRequests" element={<FINVCancelledRequests />} />
            <Route path="/FINVExpiredRequests" element={<FINVExpiredRequests />} />
            <Route path="/FINVExpiringRequests" element={<FINVExpiringRequests />} />
            <Route path="*" element={<NotFound />} />
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
