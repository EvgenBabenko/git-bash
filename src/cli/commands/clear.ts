import { emitter } from "../utils";
import { Command } from "../command-registry";

export const clear: Command = {
  name: "clear",
  description: "Clear the shell screen.",
  run: ({ cli }) => {
    cli.items = [];
    emitter.emit("CLI_CLEAR");
    return "";
  },
};
