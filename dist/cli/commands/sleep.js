import { delay } from "../utils.js";
const sleep = {
    name: "sleep",
    description: "Pause for NUMBER seconds.",
    help: "Usage: sleep NUMBER",
    run: async ({ args: [N], emit })=>{
        if (!N) return void emit("sleep: missing operand");
        const sec = Number(N);
        await delay(1000 * sec);
    }
};
export { sleep };
