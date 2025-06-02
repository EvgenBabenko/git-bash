import { delay } from "../utils";
import { Command } from "../command-registry";

export const sleep: Command = {
  name: "sleep",
  shortDescription: "Pause for Number seconds",
  description: (
    <div>
      <div>sleep: sleep [-N]</div>
      <div>Options: </div>
      <div>
        -N Pause for N seconds, if N is not specified, wait for 1 second
      </div>
    </div>
  ),
  run: async ({ args: [, N] }) => {
    const sec = Number(N) || 1;

    await delay(sec * 1000);
  },
};
