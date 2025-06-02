import { emitter } from "../utils";
import { Command } from "../command-registry";

export const clear: Command = {
  name: "clear",
  shortDescription: "Clear the shell screen.",
  run: ({ cli }) => {
    cli.items = [];
    emitter.emit("CLI_CLEAR");
    return "";
  },
};
