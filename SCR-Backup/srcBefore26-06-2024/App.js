import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BankADLADashboard from "./pages/BankADLADashboard";
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
import CopiedResponse from "./pages/ExportCopiedResponse";
import ImportApprovedRequests from "./pages/ImportApprovedRequests";
import ImportDeferredRequests from "./pages/ImportDeferredRequests";
import ImportPendingRequests from "./pages/ImportPendingRequests";
import ImportRejectedRequests from "./pages/ImportRejectedRequests";
import ImportSubmittedRequests from "./pages/ImportSubmittedRequests";
import ActingRoleDashboard from "./pages/ActingRoleDashboard";
import ImportCancelledRequests from "./pages/ImportCancelledRequests";
import ImportsExpiredRequests from "./pages/ImportsExpiredRequests";
import ImportsExpiringRequests from "./pages/ImportsExpiringRequests";
import ImpersonateUser from "./admin/pages/ImpersonateUser";
import ExportCircularsRequests from "./pages/ExportCircularsRequests";
import ReferredDashboard from "./pages/ReferredDashboard";
import FINVSubmittedRequests from "./pages/FINVSubmittedRequests";
import Search from "./pages/Search";
import FINVPendingRequests from "./pages/FINVPendingRequests";
import FINVApprovedRequests from "./pages/FINVApprovedRequests";
import FINVRejectedRequests from "./pages/FINVRejectedRequests";
import FINVDeferredRequests from "./pages/FINVDeferredRequests";
import FINVCancelledRequests from "./pages/FINVCancelledRequests";
import FINVExpiredRequests from "./pages/FINVExpiredRequests";
import FINVExpiringRequests from "./pages/FINVExpiringRequests";
import INSNewRequest from "./pages/INSNewRequest";

import CircularNewRequest from "./pages/CircularNewRequest";
import CircularAllRequest from "./pages/CircularAllRequest";
import CircularApproveRequest from "./pages/CircularApproveRequest";
import CircularCancelledRequest from "./pages/CircularCancelledRequest";
import Home from "./pages/Home";
import INSDashboard from "./pages/INSDashboard";
import ImportCircularsRequests from "./pages/ImportCircularsRequests";
import CircularsDashboardRequests from "./pages/CircularsDashboardRequests";
import ImportSearch from "./pages/ImportSearch";
import FINSearch from "./pages/FINSearch";
import PendingReturns from "./pages/PendingReturns";

import ReturnDashboardExport from "./pages/ReturnDashboardExport";
import INSSubmittedRequests from "./pages/INSSubmittedRequests";
import INSPendingRequests from "./pages/INSPendingRequests";
import INSApprovedRequests from "./pages/INSApprovedRequests";
import INSRejectedRequests from "./pages/INSRejectedRequests";
import INSDeferredRequests from "./pages/INSDeferredRequests";
import INSCancelledRequests from "./pages/INSCancelledRequests";
import InspectorateExpiredRequests from "./pages/InspectorateExpiredRequests";
import InspectorateExpiringRequests from "./pages/InspectorateExpiringRequests";

import ImportCopiedResponse from "./pages/ImportCopiedResponse";
import FINCopiedResponse from "./pages/FINCopiedResponse";
import INSCopiedResponse from "./pages/INSCopiedResponse";
import INSSearch from "./pages/INSSearch";
import ExportAdvanceSearch from "./pages/ExportAdvanceSearch";
import ImportPendingReturns from "./pages/ImportPendingReturns";
import ImportReturnDashboard from "./pages/ImportReturnDashboard";

import FINPendingReturns from "./pages/FINPendingReturns";
import FINReturnDashboard from "./pages/FINReturnDashboard";

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
        {userName && userID && rollId == 1 ? (
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
            <Route path="/AllDashboard" element={<Home />} />
            <Route path="/BankADLADashboard" element={<BankADLADashboard />} />
            <Route path="/ExportNewRequest" element={<ExportNewRequest />} />
            <Route path="/ImportNewForm" element={<ImportNewForm />} />
            <Route path="/template" element={<TemplatePagePDF />} />
            <Route path="/ImportDashboard" element={<ImportDashboard />} />
            <Route path="/FINVDashboard" element={<FINVDashboard />} />
            <Route path="/FINVNewRequest" element={<FINVNewRequest />} />
            <Route
              path="/CircularImport"
              element={<ImportCircularsRequests />}
            />

            <Route
              path="/CircularExport"
              element={<ExportCircularsRequests />}
            />
            <Route path="/NewCircular" element={<CircularNewRequest />} />
            <Route path="/AllCircular" element={<CircularAllRequest />} />
            <Route
              path="/ApprovedCircular"
              element={<CircularApproveRequest />}
            />
            <Route
              path="/CancelledCircular"
              element={<CircularCancelledRequest />}
            />
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
            <Route
              path="/ImportApprovedRequests"
              element={<ImportApprovedRequests />}
            />
            <Route
              path="/ImportDeferredRequests"
              element={<ImportDeferredRequests />}
            />
            <Route
              path="/ImportPendingRequests"
              element={<ImportPendingRequests />}
            />
            <Route
              path="/ImportRejectedRequests"
              element={<ImportRejectedRequests />}
            />
            <Route
              path="/ImportSubmittedRequests"
              element={<ImportSubmittedRequests />}
            />
            <Route path="/Search" element={<Search />} />
            <Route
              path="/ExportExpiringRequests"
              element={<ExportExpiringRequests />}
            />
            <Route path="/CopiedResponse" element={<CopiedResponse />} />
            <Route
              path="/ActingRoleDashboard"
              element={<ActingRoleDashboard />}
            />
            <Route path="/ReferredDashboard" element={<ReferredDashboard />} />
            <Route
              path="/FINVSubmittedRequests"
              element={<FINVSubmittedRequests />}
            />
            <Route
              path="/FINVPendingRequests"
              element={<FINVPendingRequests />}
            />
            <Route
              path="/FINVApprovedRequests"
              element={<FINVApprovedRequests />}
            />
            <Route
              path="/FINVRejectedRequests"
              element={<FINVRejectedRequests />}
            />
            <Route
              path="/FINVDeferredRequests"
              element={<FINVDeferredRequests />}
            />
            <Route
              path="/FINVCancelledRequests"
              element={<FINVCancelledRequests />}
            />
            <Route
              path="/FINVExpiredRequests"
              element={<FINVExpiredRequests />}
            />
            <Route
              path="/FINVExpiringRequests"
              element={<FINVExpiringRequests />}
            />
            <Route path="/INSNewRequest" element={<INSNewRequest />} />
            <Route path="/INSDashboard" element={<INSDashboard />} />
            <Route
              path="/CircularDashboard"
              element={<CircularsDashboardRequests />}
            />
            <Route path="/SearchImport" element={<ImportSearch />} />
            <Route path="/SearchFIN" element={<FINSearch />} />
            <Route
              path="/ReturnDashboardExport"
              element={<ReturnDashboardExport />}
            />
            <Route
              path="/INSSubmittedRequests"
              element={<INSSubmittedRequests />}
            />
            <Route path="/FINPendingReturns" element={<FINPendingReturns />} />
            <Route
              path="/FINReturnDashboard"
              element={<FINReturnDashboard />}
            />
            <Route path="/PendingReturns" element={<PendingReturns />} />
            <Route
              path="/INSPendingRequests"
              element={<INSPendingRequests />}
            />
            <Route
              path="/INSApprovedRequests"
              element={<INSApprovedRequests />}
            />
            <Route
              path="/INSRejectedRequests"
              element={<INSRejectedRequests />}
            />
            <Route
              path="/INSDeferredRequests"
              element={<INSDeferredRequests />}
            />
            <Route
              path="/INSCancelledRequests"
              element={<INSCancelledRequests />}
            />
            <Route
              path="/InspectorateExpiredRequests"
              element={<InspectorateExpiredRequests />}
            />
            <Route
              path="/InspectorateExpiringRequests"
              element={<InspectorateExpiringRequests />}
            />
            <Route
              path="/CCResponseImport"
              element={<ImportCopiedResponse />}
            />
            <Route path="/FINCopiedResponse" element={<FINCopiedResponse />} />
            <Route path="/INSCopiedResponse" element={<INSCopiedResponse />} />
            <Route path="/SearchINS" element={<INSSearch />} />
            <Route path="/AdvanceSearchExport" element={<ExportAdvanceSearch />} />
            <Route
              path="/ImportPendingReturns"
              element={<ImportPendingReturns />}
            />

            <Route
              path="/ImportReturnDashboard"
              element={<ImportReturnDashboard />}
            />

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
