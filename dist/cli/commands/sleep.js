import { jsx, jsxs } from "react/jsx-runtime";
import { delay } from "../utils.js";
const sleep = {
    name: "sleep",
    description: "Pause for Number seconds",
    help: /*#__PURE__*/ jsxs("div", {
        children: [
            /*#__PURE__*/ jsx("div", {
                children: "sleep: sleep [-N]"
            }),
            /*#__PURE__*/ jsx("div", {
                children: "Options: "
            }),
            /*#__PURE__*/ jsx("div", {
                children: "-N Pause for N seconds, if N is not specified, wait for 1 second"
            })
        ]
    }),
    run: async ({ args: [, N] })=>{
        const sec = Number(N) || 1;
        await delay(1000 * sec);
    }
};
export { sleep };
