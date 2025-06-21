import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { delay } from "../utils.js";
import { extractValues } from "../utils/extract-values.js";
function parseDuration(duration) {
    const regex = /^(\d+(?:\.\d+)?)(ms|s|m|h)?$/i;
    const match = duration.match(regex);
    if (!match) throw new Error(`sleep: invalid time interval '${duration}'`);
    const value = parseFloat(match[1]);
    const unit = (match[2] || "s").toLowerCase();
    switch(unit){
        case "ms":
            return value;
        case "s":
            return 1000 * value;
        case "m":
            return 60 * value * 1000;
        case "h":
            return 60 * value * 60000;
        default:
            throw new Error(`Unknown time unit: ${unit}`);
    }
}
const sleep = {
    name: "sleep",
    description: "Pause for NUMBER seconds.",
    help: /*#__PURE__*/ jsxs(Fragment, {
        children: [
            "Usage: sleep NUMBER[SUFFIX]... ",
            /*#__PURE__*/ jsx("br", {}),
            "Pause for NUMBER seconds. ",
            /*#__PURE__*/ jsx("br", {}),
            "SUFFIX may be: ",
            /*#__PURE__*/ jsx("br", {}),
            "'ms' for milliseconds ",
            /*#__PURE__*/ jsx("br", {}),
            "'s' for seconds (the default) ",
            /*#__PURE__*/ jsx("br", {}),
            "'m' for minutes ",
            /*#__PURE__*/ jsx("br", {}),
            "'h' for hours ",
            /*#__PURE__*/ jsx("br", {}),
            "NUMBER need not be an integer. Given two or more arguments, pause for the amount of time specified by the sum of their values."
        ]
    }),
    run: async ({ args, emit, cli })=>{
        const durations = extractValues(args, []);
        if (0 === durations.length) return void emit("sleep: missing operand");
        try {
            const result = durations.reduce((a, b)=>a + parseDuration(b), 0);
            await delay(result, cli.controller?.signal);
        } catch (error) {
            if (error instanceof Error) emit(error.message);
        }
    }
};
export { sleep };
