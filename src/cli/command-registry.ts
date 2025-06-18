import { Cli } from "./core";

export interface CommandContext {
  args: string[];
  emit: (output: React.ReactNode) => void;
  cli: Cli;
  abortController: AbortController;
}

export interface Command {
  name: string;
  description: string;
  help?: React.ReactNode;
  run: (ctx: CommandContext) => React.ReactNode | Promise<void>;
}

export class CommandRegistry {
  private commands: Record<string, Command> = {};

  register(command: Command) {
    this.commands[command.name] = command;
  }

  get(commandName: string): Command | undefined {
    return this.commands[commandName];
  }

  getAll(): Command[] {
    return Object.values(this.commands);
  }
}
