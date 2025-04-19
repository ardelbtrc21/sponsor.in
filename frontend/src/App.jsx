import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./Style/index.css";

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
  // const prov = useAuthProvider();

  return (
    <div>
      <ThemeProvider>
        {/* <AuthContext.Provider value={prov}> */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              {/* <Route path="*" element={<PageNotFound />} /> */}
            </Routes>
          </BrowserRouter>
        {/* </AuthContext.Provider> */}
      </ThemeProvider>
    </div>
  );
}

export default App;