import { delay } from "../utils";
import { Command } from "../command-registry";

export const sleep: Command = {
  name: "sleep",
  description: "Pause for NUMBER seconds.",
  help: "Usage: sleep NUMBER",
  run: async ({ args: [N], emit }) => {
    if (!N) {
      emit("sleep: missing operand");

      return;
    }

    const sec = Number(N);

    await delay(sec * 1000);
  },
};
