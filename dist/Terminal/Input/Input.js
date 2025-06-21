import { jsx } from "react/jsx-runtime";
import "react";
const Input = ({ ref, onKeyDown })=>/*#__PURE__*/ jsx("textarea", {
        ref: ref,
        className: "bg-transparent border-none outline-none pl-3 w-full resize-none",
        style: {
            caretColor: "white",
            minHeight: "1.5em",
            lineHeight: "1.5"
        },
        rows: 1,
        onKeyDown: onKeyDown,
        onInput: (e)=>{
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
        }
    });
export { Input };
