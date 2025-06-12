import { jsx, jsxs } from "react/jsx-runtime";
import external_react_default, { useEffect, useRef, useState } from "react";
import { Cli } from "../cli/core.js";
import { Shell } from "./Shell/Shell.js";
import { ShellTitle } from "./ShellTitle/ShellTitle.js";
import { emitter } from "../cli/utils.js";
const USER_NAME = "guest";
const Terminal = ({ onInit, fs })=>{
    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const [path, setPath] = useState("");
    const [processing, setProcessing] = useState(true);
    const [items, setItems] = useState([]);
    const cli = useRef(null);
    const [initialization, setInitialization] = useState(true);
    const [initComponent, setInitComponent] = useState(null);
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
        emitter.on("CLI_INITIALIZATION", (status)=>{
            setInitialization(status);
        });
        emitter.on("CLI_UPDATE_ITEM", (command)=>{
            setItems((prev)=>prev.map((item)=>item.id === command.id ? command : item));
        });
        emitter.on("CLI_ADD_ITEM", (item)=>{
            if (cli.current) cli.current.addItem(item);
            setItems((prev)=>[
                    ...prev,
                    item
                ]);
        });
        if (onInit) onInit({
            path: cli.current.path,
            userName: USER_NAME
        }).then((res)=>{
            if (/*#__PURE__*/ external_react_default.isValidElement(res)) setInitComponent(res);
        }).catch((err)=>console.error(err));
        else {
            setInitialization(false);
            setProcessing(false);
        }
        return ()=>{
            controller.abort();
            cli.current?.removeEventListener();
            emitter.off("CLI_PATH");
            emitter.off("CLI_CLEAR");
            emitter.off("CLI_PROCESSING_STATUS");
            emitter.off("CLI_INITIALIZATION");
            emitter.off("CLI_UPDATE_ITEM");
            emitter.off("CLI_ADD_ITEM");
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
            initialization && initComponent,
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
