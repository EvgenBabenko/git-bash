import { extractValues } from "../utils/extract-values.js";
const mkdir = {
    name: "mkdir",
    description: "Create the DIRECTORY(ies), if they do not already exist.",
    help: "Usage: mkdir [OPTION]... DIRECTORY...",
    run: ({ cli, args })=>{
        const children = cli.getChildren();
        if (!children) return "unexpected error";
        const directory = extractValues(args, [])[0];
        if (!directory) return "mkdir: missing operand";
        if (children.find((item)=>item.name === directory)) return `mkdir: cannot create directory '${directory}': File exists`;
        children.push({
            type: "folder",
            name: directory,
            path: `${cli.path}"/"${directory}`,
            createdAt: new Date().toISOString(),
            children: []
        });
        return "";
    }
};
export { mkdir };
