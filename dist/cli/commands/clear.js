import { emitter } from "../utils.js";
const clear = {
    name: "clear",
    description: "Clear the shell screen.",
    run: ({ cli })=>{
        cli.items = [];
        emitter.emit("CLEAR");
        return "";
    }
};
export { clear };
