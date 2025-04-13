import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React from "react";
import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
import App from "./App.jsx";
// import { store } from "./app/store.js";

axios.defaults.withCredentials = true;

const container = document.getElementById("root");
const root = createRoot(container);
dayjs.extend(duration);

root.render(
    <React.StrictMode>
        {/* <Provider> */}
            <App />
        {/* </Provider> */}
    </React.StrictMode>,
);