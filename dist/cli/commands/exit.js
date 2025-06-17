import { delay, emitter } from "../utils.js";
const exit = {
    name: "exit",
    description: "Exit the shell",
    run: async ({ emit })=>{
        emit("logout");
        await delay(300);
        emitter.emit("EXIT");
    }
};
export { exit };
