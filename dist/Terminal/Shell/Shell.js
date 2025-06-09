import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Minus, Square, X } from "lucide-react";
import git_bash_js_default from "../../assets/img/git-bash.js";
const Shell = ({ children, path, terminalRef, userName })=>{
    const pathHeader = `MINGW64:/c/${userName}${path ? `/${path}` : ""}`;
    return /*#__PURE__*/ jsxs("div", {
        className: "text-left border border-white bg-black mx-auto text-sm w-full max-w-[600px]",
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: "bg-white p-[6px_4px] flex items-center justify-between text-black",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "flex items-center justify-center gap-x-1",
                        children: [
                            /*#__PURE__*/ jsx("img", {
                                src: git_bash_js_default,
                                width: "16",
                                height: "16"
                            }),
                            pathHeader
                        ]
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: "flex items-center justify-center gap-x-3",
                        children: [
                            /*#__PURE__*/ jsx(Minus, {
                                strokeWidth: 1,
                                size: 16
                            }),
                            /*#__PURE__*/ jsx(Square, {
                                strokeWidth: 1,
                                size: 16
                            }),
                            /*#__PURE__*/ jsx(X, {
                                strokeWidth: 1,
                                size: 16
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsx("div", {
                className: "overflow-y-auto h-[250px] p-1 text-sm font-[Roboto_Mono]",
                ref: terminalRef,
                children: children
            })
        ]
    });
};
export { Shell };
