import { jsx, jsxs } from "react/jsx-runtime";
import react, { useEffect, useRef, useState } from "react";
import { Cli } from "../cli/core.js";
import { Shell } from "./Shell/Shell.js";
import { ShellTitle } from "./ShellTitle/ShellTitle.js";
import { emitter } from "../cli/utils.js";
import { Input } from "./Input/Input.js";
const Terminal = ({ onInit, tree, userName = "guest" })=>{
    const inputRef = useRef(null);
    const tempInputRef = useRef(null);
    const terminalRef = useRef(null);
    const [path, setPath] = useState("");
    const [processing, setProcessing] = useState(true);
    const [items, setItems] = useState([]);
    const cli = useRef(null);
    const [initialization, setInitialization] = useState(true);
    const [initComponent, setInitComponent] = useState(null);
    const [prompt, setPrompt] = useState(null);
    const [isExiting, setIsExiting] = useState(false);
    useEffect(()=>{
        cli.current = new Cli(tree, terminalRef);
        setPath(cli.current.path);
        const controller = new AbortController();
        inputRef.current?.focus();
        document.addEventListener("click", ()=>{
            inputRef.current?.focus();
            tempInputRef.current?.focus();
        }, {
            signal: controller.signal
        });
        emitter.on("EXIT", ()=>{
            setIsExiting(true);
        });
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
            userName
        }).then((res)=>{
            if (/*#__PURE__*/ react.isValidElement(res)) setInitComponent(res);
        }).catch((err)=>console.error(err));
        else {
            setInitialization(false);
            setProcessing(false);
        }
        return ()=>{
            controller.abort();
            emitter.off("EXIT");
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
        if (processing) tempInputRef.current?.focus();
    }, [
        processing
    ]);
    function onInputKeyDown(e) {
        if (!cli.current || !inputRef.current) return;
        if ("ArrowUp" === e.code) {
            const input = cli.current.history.prev();
            inputRef.current.value = input;
            requestAnimationFrame(()=>{
                inputRef.current?.setSelectionRange(input.length, input.length);
            });
        }
        if ("ArrowDown" === e.code) {
            const input = cli.current.history.next();
            inputRef.current.value = input;
            inputRef.current.setSelectionRange(input.length, input.length);
        }
        if ("NumpadEnter" === e.code || "Enter" === e.code) {
            e.preventDefault();
            const input = inputRef.current.value;
            inputRef.current.value = "";
            inputRef.current.style.height = inputRef.current.scrollHeight + "px";
            cli.current.execute(input);
        }
    }
    if (isExiting) return null;
    return /*#__PURE__*/ jsxs(Shell, {
        path: path,
        terminalRef: terminalRef,
        userName: userName,
        children: [
            initialization && initComponent,
            items.map((item)=>/*#__PURE__*/ jsxs("div", {
                    children: [
                        /*#__PURE__*/ jsx(ShellTitle, {
                            path: item.path,
                            userName: userName
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
            processing && /*#__PURE__*/ jsx(Input, {
                ref: tempInputRef,
                onKeyDown: (e)=>{
                    if ("KeyC" === e.code && e.ctrlKey) {
                        e.preventDefault();
                        cli.current?.controller?.abort();
                        emitter.emit("PROCESSING_STATUS", false);
                    }
                }
            }),
            prompt && /*#__PURE__*/ jsxs("div", {
                className: "text-white",
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
                        className: "bg-transparent border-none outline-none",
                        onKeyDown: (e)=>{
                            if ("Enter" === e.key) {
                                const value = e.currentTarget.value;
                                e.currentTarget.value = "";
                                prompt?.resolve(value);
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
                        userName: userName
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: "relative w-full text-white",
                        children: [
                            /*#__PURE__*/ jsx("span", {
                                className: "absolute left-0 top-[1.7px]",
                                children: "$"
                            }),
                            /*#__PURE__*/ jsx(Input, {
                                ref: inputRef,
                                onKeyDown: onInputKeyDown
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
export { Terminal };
