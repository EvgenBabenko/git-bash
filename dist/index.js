import { jsx } from "react/jsx-runtime";
import client_default from "react-dom/client";
import external_App_js_default from "./App.js";
import "./index.css";
const rootEl = document.getElementById("root");
if (rootEl) {
    const root = client_default.createRoot(rootEl);
    root.render(/*#__PURE__*/ jsx(external_App_js_default, {}));
}
