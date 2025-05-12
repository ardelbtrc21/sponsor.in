import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
// import Test from "./components/Test";
import SponsorList from "./pages/SponsorList";
import SponsorDetail from "./pages/SponsorDetail";
import ReportAccountForm from "./pages/ReportAccountForm";
import Register from "./pages/Register";
import "./Style/index.css";
import ViewDetailProposal from "./pages/ViewDetailProposal";
import ViewMySubmissions from "./pages/ViewMySubmissions";
import ViewListSubmission from "./pages/ViewListProposal";
import CreateProposalForm from "./pages/CreateProposalForm";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./features/authSlice";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import ChangePassword from "./pages/ChangePassword";
import ModernLayout from "./components/Layout";
import ListApprovalProposal from "./pages/ListApprovalProposal";
import LandingScreen from "./pages/LandingScreen";
import AdminPendingSponsorsPage from "./pages/AdminSponsorApproval";
import HistoryAgreement from "./pages/HistoryAgreement";
import Home from "./pages/Home";
import AccountSetting from "./pages/AccountSettingForm";
import ListReportedAccount from "./pages/ListReportedAccounts";
import MilestoneListPage from "./components/ListMilestone";
import MilestoneDetailPage from "./pages/MilestoneDetail";
import HistoryAgreementWrapper from "./components/HistoryAgreementWrapper";

function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Statistic: {
            contentFontSize: 30,
          },
          Descriptions: {
            labelBg: "rgb(243 244 246);",
          },
          Notification: {
            zIndexPopup: 9,
          },
        },
        token: {
          colorPrimary: "rgb(2, 132, 199)",
          colorPrimaryHover: "rgb(3, 105, 161)",
          cardBg: "rgb(214 211 209)",
          colorBgContainer: "white",
          colorIcon: "#5A5A5A",
          titleColor: "rgb(14 165 233)",
          lineWidth: 1,
          colorLink: "rgb(107, 114, 128)",
          colorLinkHover: "rgb(3, 105, 161)",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

function App() {
  const dispatch = useDispatch();
  const [loadingSession, setLoadingSession] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getMe()).unwrap();
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSession(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loadingSession) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" tip="Loading Session..." />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <LandingScreen />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
          <Route path="/signUp" element={<Register />} />
          <Route path="/signIn" element={<Login />} />
          {/* <Route path="/welcome" element={user ? <ApproveButton /> : <Navigate to="/" />} /> */}
          <Route path="/sponsoree-submissions" element={user ? <ViewMySubmissions /> : <Navigate to="/" />} />
          {/* <Route path="/proposal-list" element={user ? <ViewListSubmission /> : <Navigate to="/" />} /> */}
          <Route path="/sponsors" element={user ? <SponsorList /> : <Navigate to="/" />} />
          <Route path="/sponsors/:id" element={user ? <SponsorDetail /> : <Navigate to="/" />} />
          <Route path="/report/:id" element={user ? <ReportAccountForm /> : <Navigate to="/" />} />
          <Route path="/proposal/create/:id" element={user ? <CreateProposalForm /> : <Navigate to="/" />} />
          {/* <Route path="/account-setting/:id" element={user ? <AccountSettingForm /> : <Navigate to="/" />} /> */}
          <Route path="/change-password/:id" element={user ? <ChangePassword /> : <Navigate to="/" />} />
          <Route path="/account-setting/:id" element={user ? <AccountSetting /> : <Navigate to="/" />} />
          <Route path="/proposal/detail/:id" element={user ? <ViewDetailProposal /> : <Navigate to="/" />} />
          <Route path="/list-approval-proposal/" element={user ? <ListApprovalProposal /> : <Navigate to="/" />} />
          <Route path="/list-reported-account/" element={user ? <ListReportedAccount /> : <Navigate to="/" />} />
          <Route path="/pending-sponsors" element={user ? <AdminPendingSponsorsPage /> : <Navigate to="/" />} />
          {/* <Route path="/milestones" element={user ? <MilestoneListPage /> : <Navigate to="/" />} /> */}
          <Route path="/milestones/:milestone_id" element={<MilestoneDetailPage />} />
          <Route path="/agreements" element={user ? <HistoryAgreement /> : <Navigate to="/" />} />
          <Route path="/profile/:username/agreements" element={<HistoryAgreementWrapper />}
/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;