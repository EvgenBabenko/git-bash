import { delay } from "../utils";
import { Command } from "../command-registry";
import { extractValues } from "../utils/extract-values";

function parseDuration(duration: string) {
  const regex = /^(\d+(?:\.\d+)?)(ms|s|m|h)?$/i;
  const match = duration.match(regex);

  if (!match) {
    throw new Error(`sleep: invalid time interval '${duration}'`);
  }

  const value = parseFloat(match[1]);
  const unit = (match[2] || "s").toLowerCase(); // Default to 's' if no unit

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}

export const sleep: Command = {
  name: "sleep",
  description: "Pause for NUMBER seconds.",
  help: (
    <>
      Usage: sleep NUMBER[SUFFIX]... <br />
      Pause for NUMBER seconds. SUFFIX may be 'ms' for milliseconds, 's' for
      seconds (the default), 'm' for minutes, 'h' for hours or 'd' for days.
      NUMBER need not be an integer. Given two or more arguments, pause for the
      amount of time specified by the sum of their values.
    </>
  ),
  run: async ({ args, emit }) => {
    const durations = extractValues(args, []);

    if (durations.length === 0) {
      emit("sleep: missing operand");

      return;
    }

    try {
      const result = durations.reduce((a, b) => a + parseDuration(b), 0);

      await delay(result);
    } catch (error) {
      if (error instanceof Error) {
        emit(error.message);
      }
    }
  },
};
