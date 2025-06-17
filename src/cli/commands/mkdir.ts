import { Command } from "../command-registry";
import { extractValues } from "../utils/extract-values";
// import { parseArgs } from "../utils/parse-args";

export const mkdir: Command = {
  name: "mkdir",
  description: "Create the DIRECTORY(ies), if they do not already exist.",
  help: "Usage: mkdir [OPTION]... DIRECTORY...",
  run: ({ cli, args }) => {
    // const argv = parseArgs(args);
    const children = cli.getChildren();

    if (!children) {
      return "unexpected error";
    }

    // if (argv.has("-p")) {
    //   const tt = argv.get("-p");

    //   if (!tt) {
    //     return "mkdir: missing operand";
    //   }

    //   const dirs = tt.split("/");

    //   for (const dir of dirs) {
    //     if (children.find((item) => item.name === dir)) {
    //       return `mkdir: cannot create directory '${dir}': File exists`;
    //     }

    //     const newFolder: Tree = {
    //       name: dir,
    //       type: "folder",
    //       path: `${cli.path}"/"${dir}`,
    //       children: [],
    //     };

    //     children.push(newFolder);
    //   }
    // }

    const directory = extractValues(args, [])[0];

    if (!directory) {
      return "mkdir: missing operand";
    }

    if (children.find((item) => item.name === directory)) {
      return `mkdir: cannot create directory '${directory}': File exists`;
    }

    children.push({
      name: directory,
      type: "folder",
      path: `${cli.path}"/"${directory}`,
      children: [],
    });

    return "";
  },
};
