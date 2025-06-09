import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Cli } from "../cli/index.js";
import { fs } from "../constants/fs.js";
import { Shell } from "./Shell/Shell.js";
import { ShellTitle } from "./ShellTitle/ShellTitle.js";
import { emitter } from "../cli/utils.js";
const USER_NAME = "guest";
const Terminal = ()=>{
    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const [path, setPath] = useState("");
    const [processing, setProcessing] = useState(false);
    const [items, setItems] = useState([]);
    const cli = useRef(null);
    console.log("path", path);
    useEffect(()=>{
        cli.current = new Cli(fs, inputRef, terminalRef);
        setPath(cli.current.path);
        const controller = new AbortController();
        inputRef.current?.focus();
        document.addEventListener("click", ()=>{
            inputRef.current?.focus();
        }, {
            signal: controller.signal
        });
        cli.current.addEventListener();
        emitter.on("CLI_PATH", (path)=>{
            setPath(path);
        });
        emitter.on("CLI_CLEAR", ()=>{
            setItems([]);
        });
        emitter.on("CLI_PROCESSING_STATUS", (status)=>{
            setProcessing(status);
        });
        emitter.on("CLI_ON_UPDATE_ITEM", (command)=>{
            setItems((prev)=>prev.map((item)=>item.id === command.id ? command : item));
        });
        emitter.on("CLI_ON_ADD_ITEM", (command)=>{
            setItems((prev)=>[
                    ...prev,
                    command
                ]);
        });
        return ()=>{
            controller.abort();
            cli.current?.removeEventListener();
            emitter.off("CLI_PATH");
            emitter.off("CLI_CLEAR");
            emitter.off("CLI_PROCESSING_STATUS");
            emitter.off("CLI_ON_UPDATE_ITEM");
            emitter.off("CLI_ON_ADD_ITEM");
        };
    }, []);
    useEffect(()=>{
        if (!processing) inputRef.current?.focus();
    }, [
        processing
    ]);
    return /*#__PURE__*/ jsxs(Shell, {
        path: path,
        terminalRef: terminalRef,
        userName: USER_NAME,
        children: [
            items.map((item)=>/*#__PURE__*/ jsxs("div", {
                    children: [
                        /*#__PURE__*/ jsx(ShellTitle, {
                            path: item.path,
                            userName: USER_NAME
                        }),
                        /*#__PURE__*/ jsxs("div", {
                            children: [
                                "$ ",
                                item.input
                            ]
                        }),
                        item.output
                    ]
                }, item.id)),
            /*#__PURE__*/ jsxs("div", {
                style: {
                    visibility: processing ? "hidden" : "visible",
                    position: processing ? "absolute" : "static",
                    height: processing ? 0 : void 0
                },
                children: [
                    /*#__PURE__*/ jsx(ShellTitle, {
                        path: path,
                        userName: USER_NAME
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        children: [
                            /*#__PURE__*/ jsx("label", {
                                htmlFor: "input",
                                children: "$ "
                            }),
                            /*#__PURE__*/ jsx("input", {
                                ref: inputRef,
                                id: "input",
                                type: "text",
                                name: "input",
                                autoFocus: true,
                                autoComplete: "off",
                                className: "bg-transparent border-none text-white outline-none",
                                style: {
                                    caretColor: "white"
                                }
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
export { Terminal };
