import { jsx, jsxs } from "react/jsx-runtime";
import external_react_default, { useEffect, useRef, useState } from "react";
import external_mitt_default from "mitt";
import { Minus, Square, X } from "lucide-react";
class CommandRegistry {
    commands = {};
    register(command) {
        this.commands[command.name] = command;
    }
    get(commandName) {
        return this.commands[commandName];
    }
    getAll() {
        return Object.values(this.commands);
    }
}
function scrollToBottom(ref) {
    requestAnimationFrame(()=>{
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    });
}
const emitter = external_mitt_default();
function delay(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
const cd = {
    name: "cd",
    description: "Change the shell working directory.",
    help: /*#__PURE__*/ jsxs("div", {
        children: [
            /*#__PURE__*/ jsx("div", {
                children: "cd: cd [-P]"
            }),
            /*#__PURE__*/ jsx("div", {
                children: "Options: "
            }),
            /*#__PURE__*/ jsx("div", {
                children: "-P Change to path P, if P is not specified, change to the root directory"
            })
        ]
    }),
    run: ({ args: [commandInput, P], cli })=>{
        const path = P;
        const rootPath = "";
        if (!path) {
            cli.path = rootPath;
            emitter.emit("CLI_PATH", cli.path);
            return "";
        }
        let currentPathSegments = cli.path.split("/").filter(Boolean);
        const parts = path.split("/").filter(Boolean);
        let currentChildren = cli.getChildren();
        for (const part of parts){
            if (".." === part) {
                currentPathSegments.pop();
                currentChildren = cli.getChildren(currentPathSegments.join("/"));
                continue;
            }
            if (!currentChildren) return `bash: ${commandInput}: ${part}: No such file or directory`;
            const nextDir = currentChildren.find((el)=>el.name === part);
            if (!nextDir) return `bash: ${commandInput}: ${part}: No such file or directory`;
            currentPathSegments.push(part);
            currentChildren = cli.getChildren(currentPathSegments.join("/"));
        }
        cli.path = currentPathSegments.join("/");
        emitter.emit("CLI_PATH", cli.path);
        return "";
    }
};
function help(regisrty) {
    return {
        name: "help",
        description: "Display information about built-in commands",
        run: ({ args: [, commandInput] })=>{
            const commands = regisrty.getAll();
            if (commandInput) {
                const command = commands.find((c)=>c.name === commandInput);
                return command?.help ?? `bash: help: no help topics match "${commandInput}".`;
            }
            return /*#__PURE__*/ jsxs("div", {
                children: [
                    /*#__PURE__*/ jsx("div", {
                        children: "GNU bash, version 5.1.16(1)-release (x86_64-pc-msys)"
                    }),
                    /*#__PURE__*/ jsx("div", {
                        children: "These shell commands are defined internally. Type `help' to see this list."
                    }),
                    /*#__PURE__*/ jsx("br", {}),
                    commands.map((c)=>/*#__PURE__*/ jsxs("div", {
                            children: [
                                c.name,
                                ": ",
                                c.description
                            ]
                        }, c.name))
                ]
            });
        }
    };
}
const ls = {
    name: "ls",
    description: "List information about the FILEs (the current directory by default).",
    run: ({ cli })=>{
        const children = cli.getChildren();
        if (!children) return /*#__PURE__*/ jsx("div", {
            children: "no such files or directories"
        });
        return children.map((item)=>/*#__PURE__*/ jsx("div", {
                children: "folder" === item.type ? `${item.name}/` : item.name
            }, item.name));
    }
};
const clear = {
    name: "clear",
    description: "Clear the shell screen.",
    run: ({ cli })=>{
        cli.items = [];
        emitter.emit("CLI_CLEAR");
        return "";
    }
};
const exit = {
    name: "exit",
    description: "Exit the shell",
    run: async ({ emit })=>{
        emit("logout");
        await delay(300);
        emitter.emit("CLI_EXIT");
    }
};
class CommandHistory {
    commands = [];
    index = -1;
    add(command) {
        this.commands.push(command);
        this.index = this.commands.length;
    }
    prev() {
        if (this.index > 0) this.index--;
        return this.commands[this.index] || "";
    }
    next() {
        if (this.index < this.commands.length - 1) {
            this.index++;
            return this.commands[this.index] || "";
        }
        this.index = this.commands.length;
        return "";
    }
    reset() {
        this.index = this.commands.length;
    }
}
const sleep = {
    name: "sleep",
    description: "Pause for Number seconds",
    help: /*#__PURE__*/ jsxs("div", {
        children: [
            /*#__PURE__*/ jsx("div", {
                children: "sleep: sleep [-N]"
            }),
            /*#__PURE__*/ jsx("div", {
                children: "Options: "
            }),
            /*#__PURE__*/ jsx("div", {
                children: "-N Pause for N seconds, if N is not specified, wait for 1 second"
            })
        ]
    }),
    run: async ({ args: [, N] })=>{
        const sec = Number(N) || 1;
        await delay(1000 * sec);
    }
};
const mkdir = {
    name: "mkdir",
    description: "Create a directory",
    run: ({ cli, args: [, folderName] })=>{
        if (!folderName) return "mkdir: missing operand";
        const children = cli.getChildren();
        if (!children) return "Cannot create folder here.";
        if (children.find((item)=>item.name === folderName)) return `mkdir: cannot create directory '${folderName}': File exists`;
        const newFolder = {
            name: folderName,
            type: "folder",
            path: `${cli.path}"/"${folderName}`,
            children: []
        };
        children.push(newFolder);
        return "";
    }
};
class Cli {
    tree;
    inputRef;
    terminalRef;
    registry;
    history;
    items;
    path;
    constructor(tree, inputRef, terminalRef){
        this.tree = tree;
        this.inputRef = inputRef;
        this.terminalRef = terminalRef;
        this.registry = new CommandRegistry();
        this.history = new CommandHistory();
        this.items = [];
        this.path = "";
        this.registerDefaultCommands();
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }
    addEventListener() {
        if (this.inputRef.current) this.inputRef.current.addEventListener("keydown", this.handleKeyUp);
    }
    removeEventListener() {
        if (this.inputRef.current) this.inputRef.current.removeEventListener("keydown", this.handleKeyUp);
    }
    getChildren(path) {
        function inner(tree, targetPath) {
            if (tree.path === targetPath) return tree.children || [];
            if (tree.children.length > 0) {
                for (let item of tree.children)if ("folder" === item.type) {
                    const result = inner(item, targetPath);
                    if (null !== result) return result;
                }
            }
            return null;
        }
        return inner(this.tree, path ?? this.path);
    }
    addItem(item) {
        this.history.add(item.input);
        this.items.push(item);
        scrollToBottom(this.terminalRef);
    }
    execute(input) {
        if (!input) return;
        const args = input.split(" ").filter(Boolean);
        const arg = args[0];
        const isCommand = !arg.includes("/");
        const item = {
            id: Date.now().toString(),
            input,
            output: null,
            path: this.path
        };
        if (!isCommand) {
            const fileName = arg.split("/").pop() ?? "";
            const items = this.getChildren();
            const element = items?.find((el)=>el.name === fileName);
            if (!element) return void emitter.emit("CLI_ON_ADD_ITEM", {
                ...item,
                output: `bash: ${arg}: No such file or directory`
            });
            if (!element.content) return void emitter.emit("CLI_ON_ADD_ITEM", {
                ...item,
                output: `bash: ${element.content}: content not found`
            });
            const output = /*#__PURE__*/ external_react_default.isValidElement(element.content) ? /*#__PURE__*/ external_react_default.createElement(element.content) : element.content;
            emitter.emit("CLI_ON_ADD_ITEM", {
                ...item,
                output
            });
            return;
        }
        const command = this.registry.get(args[0]);
        if (!command) return void emitter.emit("CLI_ON_ADD_ITEM", {
            ...item,
            output: `bash: ${args[0]}: command not found`
        });
        emitter.emit("CLI_ON_ADD_ITEM", item);
        const emit = (output)=>{
            item.output = output;
            emitter.emit("CLI_ON_UPDATE_ITEM", item);
        };
        try {
            const result = command.run({
                args,
                emit,
                cli: this
            });
            if (result instanceof Promise) {
                emitter.emit("CLI_PROCESSING_STATUS", true);
                result.catch((e)=>emit(`Error: ${e.message}`)).finally(()=>{
                    emitter.emit("CLI_PROCESSING_STATUS", false);
                });
            } else emit(result);
        } catch (error) {
            emit(`Error: ${error.message}`);
        } finally{
            scrollToBottom(this.terminalRef);
        }
    }
    handleKeyUp(e) {
        switch(e.code){
            case "ArrowUp":
                if (this.inputRef.current) {
                    const input = this.history.prev();
                    this.inputRef.current.value = input;
                    requestAnimationFrame(()=>{
                        this.inputRef.current?.setSelectionRange(input.length, input.length);
                    });
                }
                return;
            case "ArrowDown":
                if (this.inputRef.current) {
                    const input = this.history.next();
                    this.inputRef.current.value = input;
                    this.inputRef.current.setSelectionRange(input.length, input.length);
                }
                return;
            case "NumpadEnter":
            case "Enter":
                {
                    const input = this.inputRef.current.value;
                    this.inputRef.current.value = "";
                    this.execute(input);
                    return;
                }
            default:
        }
    }
    getRegistry() {
        return this.registry;
    }
    registerCommand(command) {
        this.registry.register(command);
    }
    registerDefaultCommands() {
        this.registerCommand(help(this.getRegistry()));
        this.registerCommand(cd);
        this.registerCommand(ls);
        this.registerCommand(clear);
        this.registerCommand(exit);
        this.registerCommand(sleep);
        this.registerCommand(mkdir);
    }
}
import git_bash_namespaceObject from "./static/image/git-bash.png";
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
                                src: git_bash_namespaceObject,
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
const ShellTitle = ({ path, userName })=>/*#__PURE__*/ jsxs("span", {
        children: [
            /*#__PURE__*/ jsxs("span", {
                style: {
                    color: "#00cc00"
                },
                children: [
                    userName,
                    "@",
                    window.navigator.platform
                ]
            }),
            " ",
            /*#__PURE__*/ jsx("span", {
                style: {
                    color: "#cc00cc"
                },
                children: "MINGW64"
            }),
            " ",
            /*#__PURE__*/ jsxs("span", {
                style: {
                    color: "#cccc00"
                },
                children: [
                    "~",
                    path ? `/${path}` : ""
                ]
            })
        ]
    });
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
        emitter.on("CLI_ON_UPDATE_ITEM", (command)=>{
            setItems((prev)=>prev.map((item)=>item.id === command.id ? command : item));
        });
        emitter.on("CLI_ON_ADD_ITEM", (item)=>{
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
            setInitialization(false);
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
export { ShellTitle, Terminal, emitter };
