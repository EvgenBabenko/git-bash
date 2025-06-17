import { jsx, jsxs } from "react/jsx-runtime";
import { emitter } from "../utils.js";
const cd = {
    name: "cd",
    description: "Change the shell working directory.",
    help: /*#__PURE__*/ jsxs("div", {
        children: [
            /*#__PURE__*/ jsx("div", {
                children: "cd: cd [-P]"
            }),
            /*#__PURE__*/ jsx("div", {
                children: "Options: "
            }),
            /*#__PURE__*/ jsx("div", {
                children: "-P Change to path P, if P is not specified, change to the root directory"
            })
        ]
    }),
    run: ({ args: [P], cli })=>{
        const path = P;
        const rootPath = "";
        if (!path) {
            cli.path = rootPath;
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
