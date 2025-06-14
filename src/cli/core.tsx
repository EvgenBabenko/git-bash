import React from "react";
import { CommandRegistry, Command as ICommand } from "./command-registry";
import { cd } from "./commands/cd";
import { help } from "./commands/help";
import { ls } from "./commands/ls";
import { clear } from "./commands/clear";
import { scrollToBottom } from "./utils";
import { exit } from "./commands/exit";
import { CommandHistory } from "./command-history";
import { sleep } from "./commands/sleep";
import { emitter } from "./utils";
import { mkdir } from "./commands/mkdir";
import { rm } from "./commands/rm";
import { touch } from "./commands/touch";

export interface Tree {
  name: string;
  type: "folder" | "file";
  path: string;
  children: Tree[];
  content?: React.FC | string;
}

export interface Item {
  id: string;
  input: string;
  output: React.ReactNode;
  path: string;
}

export class Cli {
  private registry = new CommandRegistry();
  private history = new CommandHistory();
  public items: Item[] = [];
  public path = "";

  constructor(
    private tree: Tree,
    private inputRef: React.RefObject<HTMLInputElement | null>,
    private terminalRef: React.RefObject<HTMLDivElement | null>
  ) {
    this.registerDefaultCommands();

    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  addEventListener() {
    if (this.inputRef.current) {
      this.inputRef.current.addEventListener("keydown", this.handleKeyUp);
    }
  }

  removeEventListener() {
    if (this.inputRef.current) {
      this.inputRef.current.removeEventListener("keydown", this.handleKeyUp);
    }
  }

  getChildren(path?: string): Tree[] | null {
    function inner(tree: Tree, targetPath: string): Tree[] | null {
      if (tree.path === targetPath) {
        return tree.children || [];
      }

      if (tree.children.length > 0) {
        for (let item of tree.children) {
          if (item.type === "folder") {
            const result = inner(item, targetPath);

            if (result !== null) {
              return result;
            }
          }
        }
      }

      return null;
    }

    return inner(this.tree, path ?? this.path);
  }

  addItem(item: Item) {
    this.history.add(item.input);
    this.items.push(item);
    scrollToBottom(this.terminalRef);
  }

  execute(input: string) {
    if (!input) {
      return;
    }

    // const args = input.trim().split(/\s+/);
    const args = input.split(" ").filter(Boolean);
    const arg = args[0];
    const help = args.find((el) => el === "--help");

    const isCommand = !arg.includes("/");

    const item: Item = {
      id: Date.now().toString(),
      input,
      output: null,
      path: this.path,
    };

    if (!isCommand) {
      const fileName = arg.split("/").pop() ?? "";

      const items = this.getChildren();
      const element = items?.find((el) => el.name === fileName);

      if (!element) {
        const output = `bash: ${arg}: No such file or directory`;
        emitter.emit("CLI_ADD_ITEM", { ...item, output });

        return;
      }

      if (!element.content) {
        const output = `bash: ${element.content}: content not found`;
        emitter.emit("CLI_ADD_ITEM", { ...item, output });

        return;
      }

      const output: React.ReactNode =
        typeof element.content === "function"
          ? React.createElement(element.content)
          : element.content ?? "";
      emitter.emit("CLI_ADD_ITEM", { ...item, output });

      return;
    }

    const command = this.registry.get(arg);

    if (!command) {
      const output = `bash: ${arg}: command not found`;
      emitter.emit("CLI_ADD_ITEM", { ...item, output });

      return;
    }

    if (help) {
      emitter.emit("CLI_ADD_ITEM", { ...item, output: command.help });

      return;
    }

    emitter.emit("CLI_ADD_ITEM", item);

    const emit = (output: React.ReactNode) => {
      emitter.emit("CLI_UPDATE_ITEM", { ...item, output });
    };

    try {
      const result = command.run({ args, emit, cli: this });

      if (result instanceof Promise) {
        // Async command: let it call emit() internally
        emitter.emit("CLI_PROCESSING_STATUS", true);

        result
          .catch((e) => emit(`Error: ${e.message}`))
          .finally(() => {
            emitter.emit("CLI_PROCESSING_STATUS", false);
          });
      } else {
        // Sync command: returned output directly
        emit(result);
      }
    } catch (error: any) {
      emit(`Error: ${error.message}`);
    } finally {
      scrollToBottom(this.terminalRef);
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case "ArrowUp": {
        if (this.inputRef.current) {
          const input = this.history.prev();

          this.inputRef.current.value = input;

          requestAnimationFrame(() => {
            this.inputRef.current?.setSelectionRange(
              input.length,
              input.length
            );
          });
        }

        return;
      }
      case "ArrowDown": {
        if (this.inputRef.current) {
          const input = this.history.next();

          this.inputRef.current.value = input;
          this.inputRef.current.setSelectionRange(input.length, input.length);
        }

        return;
      }
      case "NumpadEnter":
      case "Enter": {
        const input = this.inputRef!.current!.value;
        this.inputRef!.current!.value = "";
        this.execute(input);

        return;
      }

      default:
    }
  }

  getRegistry(): CommandRegistry {
    return this.registry;
  }

  registerCommand(command: ICommand) {
    this.registry.register(command);
  }

  private registerDefaultCommands() {
    this.registerCommand(help(this.getRegistry()));
    this.registerCommand(cd);
    this.registerCommand(ls);
    this.registerCommand(clear);
    this.registerCommand(exit);
    this.registerCommand(sleep);
    this.registerCommand(mkdir);
    this.registerCommand(rm);
    this.registerCommand(touch);
  }
}
