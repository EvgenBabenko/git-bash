import { jsx } from "react/jsx-runtime";
import client_default from "react-dom/client";
import { App } from "./App.js";
const rootEl = document.getElementById("root");
if (rootEl) {
    const root = client_default.createRoot(rootEl);
    root.render(/*#__PURE__*/ jsx(App, {}));
}
