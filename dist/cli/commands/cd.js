import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { emitter } from "../utils.js";
import { extractValues } from "../utils/extract-values.js";
const cd = {
    name: "cd",
    description: "Change the shell working directory.",
    help: /*#__PURE__*/ jsxs(Fragment, {
        children: [
            "Usage: cd [DIR] ",
            /*#__PURE__*/ jsx("br", {}),
            "Change the current directory to DIR. The default DIR is the value of the HOME shell variable. ",
            /*#__PURE__*/ jsx("br", {}),
            "`..' is processed by removing the immediately previous pathname component back to a slash or the beginning of DIR. ",
            /*#__PURE__*/ jsx("br", {}),
            "If DIR is not specified, change to the root directory"
        ]
    }),
    run: ({ args, cli })=>{
        const path = extractValues(args, [])[0];
        if (!path) {
            cli.path = "";
            emitter.emit("PATH", cli.path);
            return "";
        }
        let currentPathSegments = cli.path.split("/").filter(Boolean);
        const parts = path.split("/").filter(Boolean);
        let currentChildren = cli.getChildren();
        for (const part of parts){
            if (".." === part) {
                currentPathSegments.pop();
                currentChildren = cli.getChildren(currentPathSegments.join("/"));
                continue;
            }
            if (!currentChildren) return `bash: cd: ${part}: No such file or directory`;
            const nextDir = currentChildren.find((el)=>el.name === part);
            if (!nextDir) return `bash: cd: ${part}: No such file or directory`;
            currentPathSegments.push(part);
            currentChildren = cli.getChildren(currentPathSegments.join("/"));
        }
        cli.path = currentPathSegments.join("/");
        emitter.emit("PATH", cli.path);
        return "";
    }
};
export { cd };
