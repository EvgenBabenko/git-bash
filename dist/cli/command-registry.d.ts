import { Cli } from "./core";
export interface CommandContext {
    args: string[];
    emit: (output: React.ReactNode) => void;
    cli: Cli;
}
export interface Command {
    name: string;
    description: string;
    help?: React.ReactNode;
    run: (ctx: CommandContext) => React.ReactNode | Promise<void>;
}
export declare class CommandRegistry {
    private commands;
    register(command: Command): void;
    get(commandName: string): Command | undefined;
    getAll(): Command[];
}
