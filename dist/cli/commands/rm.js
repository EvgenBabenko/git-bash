import { Fragment, jsx } from "react/jsx-runtime";
import { parseArgs } from "../utils/parse-args.js";
const rm = {
    name: "rm",
    description: "Remove the FILE(s).",
    help: "Usage: rm [OPTION]... [FILE]...",
    run: ({ cli, args: [, ...rest] })=>{
        const argv = parseArgs(rest);
        const toDelete = [
            ...argv
        ].map((el)=>el[0]).filter((el)=>!el.includes("-"));
        const children = cli.getChildren();
        if (!children) return "unexpected error";
        const outputs = toDelete.map((el)=>{
            const item = children.find((item)=>item.name === el);
            if (!item) return `rm: cannot remove '${el}': No such file or directory`;
            if (item?.type === "folder" && !argv.has("-r")) return `rm: cannot remove '${el}': Is a directory`;
            children.splice(children.indexOf(item), 1);
        });
        return /*#__PURE__*/ jsx(Fragment, {
            children: outputs.map((el)=>/*#__PURE__*/ jsx("div", {
                    children: el
                }, el))
        });
    }
};
export { rm };
