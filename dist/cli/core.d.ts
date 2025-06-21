import React from "react";
import { CommandRegistry, Command } from "./command-registry";
import { CommandHistory } from "./command-history";
export type Tree = {
    type: "folder";
    name: string;
    path: string;
    children: Tree[];
    createdAt: string;
    updatedAt?: string;
} | {
    type: "file";
    name: string;
    path: string;
    content: React.FC | string;
    createdAt: string;
    updatedAt?: string;
};
export interface Item {
    id: string;
    input: string;
    output: React.ReactNode;
    path: string;
}
export interface PromtItem {
    id: string;
    resolve: (value: string) => void;
    question: string;
}
export declare class Cli {
    private tree;
    private terminalRef;
    private registry;
    history: CommandHistory;
    items: Item[];
    path: string;
    controller?: AbortController;
    constructor(tree: Tree, terminalRef: React.RefObject<HTMLDivElement | null>);
    getChildren(path?: string): Tree[] | null;
    addItem(item: Item): void;
    execute(input: string): void;
    promptUser(question: string): Promise<string>;
    getRegistry(): CommandRegistry;
    registerCommand(command: Command): void;
    private registerDefaultCommands;
}
