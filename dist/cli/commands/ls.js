import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { parseArgs } from "../utils/parse-args.js";
const ls = {
    name: "ls",
    description: "List information about the FILEs",
    help: /*#__PURE__*/ jsxs(Fragment, {
        children: [
            "Usage: ls [OPTION]... ",
            /*#__PURE__*/ jsx("br", {}),
            "List information about the FILEs ",
            /*#__PURE__*/ jsx("br", {}),
            "Sort entries alphabetically if none of -t is specified. ",
            /*#__PURE__*/ jsx("br", {}),
            "-l use a long listing format ",
            /*#__PURE__*/ jsx("br", {}),
            "-t sort by time, newest first"
        ]
    }),
    run: ({ cli, args })=>{
        const argv = parseArgs(args);
        const children = cli.getChildren();
        if (!children) return "no such files or directories";
        let sorted = [];
        sorted = argv.has("-t") ? children.sort((a, b)=>b.createdAt.localeCompare(a.createdAt)) : children.sort((a, b)=>a.name.localeCompare(b.name));
        if (argv.has("-l")) return sorted.map((item)=>{
            const options = {
                hour12: false
            };
            const createdAtFormatted = new Date(item.createdAt).toLocaleString("en-US", options);
            return /*#__PURE__*/ jsxs("div", {
                children: [
                    /*#__PURE__*/ jsx("span", {
                        children: createdAtFormatted
                    }),
                    " ",
                    /*#__PURE__*/ jsx("span", {
                        children: "folder" === item.type ? `${item.name}/` : item.name
                    })
                ]
            }, item.name);
        });
        return sorted.map((item)=>/*#__PURE__*/ jsx("div", {
                children: /*#__PURE__*/ jsx("span", {
                    children: "folder" === item.type ? `${item.name}/` : item.name
                })
            }, item.name));
    }
};
export { ls };
