import { parseArgs } from "../utils/parse-args.js";
const mkdir = {
    name: "mkdir",
    description: "Create the DIRECTORY(ies), if they do not already exist.",
    help: "Usage: mkdir [OPTION]... DIRECTORY...",
    run: ({ cli, args: [, ...rest] })=>{
        const argv = parseArgs(rest);
        const children = cli.getChildren();
        if (!children) return "unexpected error";
        const directory = [
            ...argv
        ].map((el)=>el[0]).filter((el)=>!el.includes("-"))[0];
        if (!directory) return "mkdir: missing operand";
        if (children.find((item)=>item.name === directory)) return `mkdir: cannot create directory '${directory}': File exists`;
        children.push({
            name: directory,
            type: "folder",
            path: `${cli.path}"/"${directory}`,
            children: []
        });
        return "";
    }
};
export { mkdir };
