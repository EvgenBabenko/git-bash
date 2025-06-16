import { emitter, delay } from "../utils";
import { Command } from "../command-registry";

export const exit: Command = {
  name: "exit",
  description: "Exit the shell",
  run: async ({ emit }) => {
    emit("logout");
    await delay(300);
    emitter.emit("EXIT");
  },
};
