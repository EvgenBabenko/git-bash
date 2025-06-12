import external_react_default from "react";
import { CommandRegistry } from "./command-registry.js";
import { cd } from "./commands/cd.js";
import { help } from "./commands/help.js";
import { ls } from "./commands/ls.js";
import { clear } from "./commands/clear.js";
import { emitter, scrollToBottom } from "./utils.js";
import { exit } from "./commands/exit.js";
import { CommandHistory } from "./command-history.js";
import { sleep } from "./commands/sleep.js";
import { mkdir } from "./commands/mkdir.js";
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
            if (!element) {
                const output = `bash: ${arg}: No such file or directory`;
                emitter.emit("CLI_ADD_ITEM", {
                    ...item,
                    output
                });
                return;
            }
            if (!element.content) {
                const output = `bash: ${element.content}: content not found`;
                emitter.emit("CLI_ADD_ITEM", {
                    ...item,
                    output
                });
                return;
            }
            const output = "function" == typeof element.content ? /*#__PURE__*/ external_react_default.createElement(element.content) : element.content ?? "";
            emitter.emit("CLI_ADD_ITEM", {
                ...item,
                output
            });
            return;
        }
        const command = this.registry.get(args[0]);
        if (!command) {
            const output = `bash: ${args[0]}: command not found`;
            emitter.emit("CLI_ADD_ITEM", {
                ...item,
                output
            });
            return;
        }
        emitter.emit("CLI_ADD_ITEM", item);
        const emit = (output)=>{
            emitter.emit("CLI_UPDATE_ITEM", {
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
export { Cli };
