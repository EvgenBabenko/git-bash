import react from "react";
import { CommandRegistry } from "./command-registry.js";
import { cd } from "./commands/cd.js";
import { help as help_js_help } from "./commands/help.js";
import { ls } from "./commands/ls.js";
import { clear } from "./commands/clear.js";
import { emitter, scrollToBottom } from "./utils.js";
import { exit } from "./commands/exit.js";
import { CommandHistory } from "./command-history.js";
import { sleep } from "./commands/sleep.js";
import { mkdir } from "./commands/mkdir.js";
import { rm } from "./commands/rm.js";
import { touch } from "./commands/touch.js";
import { promt } from "./commands/promt.js";
import { normalizeArgs } from "./utils/normalize-args.js";
class Cli {
    tree;
    terminalRef;
    registry;
    history;
    items;
    path;
    controller;
    constructor(tree, terminalRef){
        this.tree = tree;
        this.terminalRef = terminalRef;
        this.registry = new CommandRegistry();
        this.history = new CommandHistory();
        this.items = [];
        this.path = "";
        this.registerDefaultCommands();
    }
    getChildren(path) {
        function inner(tree, targetPath) {
            if ("file" === tree.type) return null;
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
        this.controller = new AbortController();
        const rawArgs = input.split(" ").filter(Boolean);
        const [argument, ...rest] = rawArgs;
        const args = normalizeArgs(rest);
        const help = input.includes("--help");
        const isCommand = !argument.includes("/");
        const item = {
            id: Date.now().toString(),
            input,
            output: null,
            path: this.path
        };
        if (!isCommand) {
            const fileName = argument.split("/").pop() ?? "";
            const items = this.getChildren();
            const element = items?.find((el)=>el.name === fileName);
            if (!element || "folder" === element.type) {
                const output = `bash: ${argument}: No such file or directory`;
                emitter.emit("ADD_ITEM", {
                    ...item,
                    output
                });
                return;
            }
            if (!element.content) {
                const output = `bash: ${element.content}: content not found`;
                emitter.emit("ADD_ITEM", {
                    ...item,
                    output
                });
                return;
            }
            const output = "function" == typeof element.content ? /*#__PURE__*/ react.createElement(element.content) : element.content ?? "";
            emitter.emit("ADD_ITEM", {
                ...item,
                output
            });
            return;
        }
        const command = this.registry.get(argument);
        if (!command) {
            const output = `bash: ${argument}: command not found`;
            emitter.emit("ADD_ITEM", {
                ...item,
                output
            });
            return;
        }
        if (help) return void emitter.emit("ADD_ITEM", {
            ...item,
            output: command.help
        });
        emitter.emit("ADD_ITEM", item);
        const emit = (output)=>{
            emitter.emit("UPDATE_ITEM", {
                ...item,
                output
            });
        };
        try {
            const result = command.run({
                args,
                emit,
                cli: this
            });
            if (result instanceof Promise) {
                emitter.emit("PROCESSING_STATUS", true);
                result.catch((e)=>emit(`Error: ${e.message}`)).finally(()=>{
                    emitter.emit("PROCESSING_STATUS", false);
                });
            } else emit(result);
        } catch (error) {
            emit(`Error: ${error.message}`);
        } finally{
            scrollToBottom(this.terminalRef);
        }
    }
    promptUser(question) {
        return new Promise((resolve)=>{
            emitter.emit("PROMPT", {
                id: Date.now().toString(),
                resolve,
                question
            });
        });
    }
    getRegistry() {
        return this.registry;
    }
    registerCommand(command) {
        this.registry.register(command);
    }
    registerDefaultCommands() {
        this.registerCommand(help_js_help(this.getRegistry()));
        this.registerCommand(cd);
        this.registerCommand(ls);
        this.registerCommand(clear);
        this.registerCommand(exit);
        this.registerCommand(sleep);
        this.registerCommand(mkdir);
        this.registerCommand(rm);
        this.registerCommand(touch);
        this.registerCommand(promt);
    }
}
export { Cli };
