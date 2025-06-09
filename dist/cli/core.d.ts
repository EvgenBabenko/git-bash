import React from "react";
import { CommandRegistry, Command as ICommand } from "./command-registry";
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
export declare class Cli {
    private tree;
    private inputRef;
    private terminalRef;
    private processing;
    private registry;
    private history;
    items: Item[];
    path: string;
    constructor(tree: Tree, inputRef: React.RefObject<HTMLInputElement | null>, terminalRef: React.RefObject<HTMLDivElement | null>);
    addEventListener(): void;
    removeEventListener(): void;
    getChildren(path?: string): Tree[] | null;
    addItem(item: Item): void;
    execute(input: string): void;
    handleKeyUp(e: KeyboardEvent): void;
    getRegistry(): CommandRegistry;
    registerCommand(command: ICommand): void;
    private registerDefaultCommands;
}
