import { delay } from "../utils";
import { Command } from "../command-registry";

export const sleep: Command = {
  name: "sleep",
  shortDescription: "Wait for N seconds",
  description: (
    <div>
      <div>sleep: sleep [-N]</div>
      <div>Options: </div>
      <div>-N Wait for N seconds, if N is not specified, wait for 1 second</div>
    </div>
  ),
  run: async ({ args }) => {
    const sec = Number(args[1]) || 1;

    await delay(sec * 1000);
  },
};
