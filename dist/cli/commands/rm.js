import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { extractValues } from "../utils/extract-values.js";
import { parseArgs } from "../utils/parse-args.js";
const rm = {
    name: "rm",
    description: "Remove the FILE(s).",
    help: /*#__PURE__*/ jsxs(Fragment, {
        children: [
            "Usage: rm [OPTION]... [FILE]... ",
            /*#__PURE__*/ jsx("br", {}),
            /*#__PURE__*/ jsx("br", {}),
            "-f ignore nonexistent files and arguments, never prompt ",
            /*#__PURE__*/ jsx("br", {}),
            "-r remove directories and their contents recursively ",
            /*#__PURE__*/ jsx("br", {}),
            "-i prompt before every removal ",
            /*#__PURE__*/ jsx("br", {}),
            /*#__PURE__*/ jsx("br", {}),
            "By default, rm does not remove directories. Use the -r option to remove each listed directory, too, along with all of its contents."
        ]
    }),
    run: async ({ cli, args })=>{
        const argv = parseArgs(args);
        const toDelete = extractValues(args, []);
        const children = cli.getChildren();
        if (!children) return "unexpected error";
        const results = [];
        for (const name of toDelete){
            const item = children.find((i)=>i.name === name);
            if (!item) {
                if (!argv.has("-f")) results.push(`rm: cannot remove '${name}': No such file or directory`);
                continue;
            }
            if (argv.has("-i") && !argv.has("-f")) {
                const question = `rm: remove ${item.type} '${name}'?`;
                const answer = await cli.promptUser(question);
                if (!/^y(es)?$/i.test(answer.trim())) continue;
            }
            if ("folder" === item.type && !argv.has("-r")) {
                if (!argv.has("-f")) results.push(`rm: cannot remove '${name}': Is a directory`);
                continue;
            }
            children.splice(children.indexOf(item), 1);
        }
        return /*#__PURE__*/ jsx(Fragment, {
            children: results.map((res, i)=>/*#__PURE__*/ jsx("div", {
                    children: res
                }, i))
        });
    }
};
export { rm };
