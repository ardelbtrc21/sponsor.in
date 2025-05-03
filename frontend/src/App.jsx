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
import ViewProposalStatus from "./pages/ViewProposalStatus";
import ViewListSubmission from "./pages/ViewListProposal";
import CreateProposalForm from "./pages/CreateProposalForm";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./features/authSlice";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import ModernLayout from "./components/Layout";
import ListApprovalProposal from "./pages/ListApprovalProposal";
import LandingScreen from "./pages/LandingScreen";
import AdminPendingSponsorsPage from "./pages/AdminSponsorApproval";
import HistoryAgreement from "./pages/HistoryAgreement";
// import AccountSetting from "./pages/AccountSettingForm";

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
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          {/* <Route path="landing-screen" element={ < LandingScreen/>}/> */}
          <Route path="/dashboard" element={user ? <LandingScreen /> : <Navigate to="/" />} />
          <Route path="/signUp" element={<Register />} />
          <Route path="/detailproposal" element={user ? <ViewDetailProposal /> : <Navigate to="/" />} />
          <Route path="/proposal-status" element={user ? <ViewProposalStatus /> : <Navigate to="/" />} />
          <Route path="/proposal-list" element={user ? <ViewListSubmission /> : <Navigate to="/" />} />
          {/* <Route path="/proposal-list" element={<ViewListSubmission />} /> */}
          <Route path="/sponsors" element={user ? <SponsorList /> : <Navigate to="/" />} />
          <Route path="/sponsors/:id" element={user ? <SponsorDetail /> : <Navigate to="/" />} />
          <Route path="/report/:id" element={user ? <ReportAccountForm /> : <Navigate to="/" />} />
          <Route path="/proposal/create/:id" element={user ? <CreateProposalForm /> : <Navigate to="/" />} />
          <Route path="/list-approval-proposal/" element={user ? <ListApprovalProposal /> : <Navigate to="/" />} />
          <Route path="/admin/pending-sponsors" element={<AdminPendingSponsorsPage />} />
          <Route path="/my-agreements" element={<HistoryAgreement currentUser={user} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
 
export default App;