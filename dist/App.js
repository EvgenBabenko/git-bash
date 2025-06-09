import { jsx } from "react/jsx-runtime";
import "./App.css";
import { Terminal } from "./Terminal/Terminal.js";
import "./index.css";
const App = ()=>/*#__PURE__*/ jsx("div", {
        className: "content",
        children: /*#__PURE__*/ jsx(Terminal, {})
    });
const src_App = App;
export { src_App as default };
