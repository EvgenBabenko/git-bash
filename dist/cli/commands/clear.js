import { emitter } from "../utils.js";
const clear = {
    name: "clear",
    description: "Clear the shell screen.",
    run: ({ cli })=>{
        cli.items = [];
        emitter.emit("CLI_CLEAR");
        return "";
    }
};
export { clear };
