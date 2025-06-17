import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import react, { useEffect, useRef, useState } from "react";
import { Cli } from "../cli/core.js";
import { Shell } from "./Shell/Shell.js";
import { ShellTitle } from "./ShellTitle/ShellTitle.js";
import { emitter } from "../cli/utils.js";
const USER_NAME = "guest";
const Terminal = ({ onInit, tree })=>{
    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const [path, setPath] = useState("");
    const [processing, setProcessing] = useState(true);
    const [items, setItems] = useState([]);
    const cli = useRef(null);
    const [initialization, setInitialization] = useState(true);
    const [initComponent, setInitComponent] = useState(null);
    const [prompt, setPrompt] = useState(null);
    useEffect(()=>{
        cli.current = new Cli(tree, inputRef, terminalRef);
        setPath(cli.current.path);
        const controller = new AbortController();
        inputRef.current?.focus();
        document.addEventListener("click", ()=>{
            inputRef.current?.focus();
        }, {
            signal: controller.signal
        });
        cli.current.addEventListener();
        emitter.on("PATH", (path)=>{
            setPath(path);
        });
        emitter.on("CLEAR", ()=>{
            setItems([]);
        });
        emitter.on("PROCESSING_STATUS", (status)=>{
            setProcessing(status);
        });
        emitter.on("INITIALIZATION", (status)=>{
            setInitialization(status);
        });
        emitter.on("UPDATE_ITEM", (command)=>{
            setItems((prev)=>prev.map((item)=>item.id === command.id ? command : item));
        });
        emitter.on("ADD_ITEM", (item)=>{
            if (cli.current) cli.current.addItem(item);
            setItems((prev)=>[
                    ...prev,
                    item
                ]);
        });
        emitter.on("PROMPT", (item)=>{
            setPrompt({
                id: item.id,
                question: item.question,
                resolve: item.resolve
            });
        });
        if (onInit) onInit({
            path: cli.current.path,
            userName: USER_NAME
        }).then((res)=>{
            if (/*#__PURE__*/ react.isValidElement(res)) setInitComponent(res);
        }).catch((err)=>console.error(err));
        else {
            setInitialization(false);
            setProcessing(false);
        }
        return ()=>{
            controller.abort();
            cli.current?.removeEventListener();
            emitter.off("PATH");
            emitter.off("CLEAR");
            emitter.off("PROCESSING_STATUS");
            emitter.off("INITIALIZATION");
            emitter.off("UPDATE_ITEM");
            emitter.off("ADD_ITEM");
            emitter.off("PROMPT");
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
            prompt && /*#__PURE__*/ jsxs(Fragment, {
                children: [
                    /*#__PURE__*/ jsx("div", {
                        children: prompt.question
                    }),
                    /*#__PURE__*/ jsx("input", {
                        type: "text",
                        autoFocus: true,
                        style: {
                            caretColor: "white"
                        },
                        autoComplete: "off",
                        className: "bg-transparent border-none text-white outline-none",
                        onKeyDown: (e)=>{
                            if ("Enter" === e.key) {
                                const value = e.currentTarget.value;
                                e.currentTarget.value = "";
                                prompt.resolve(value);
                                setPrompt(null);
                            }
                        }
                    })
                ]
            }),
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
