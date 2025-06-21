import { Command } from "../command-registry";
import { extractValues } from "../utils/extract-values";
// import { parseArgs } from "../utils/parse-args";

export const mkdir: Command = {
  name: "mkdir",
  description: "Create the DIRECTORY(ies), if they do not already exist.",
  help: "Usage: mkdir [OPTION]... DIRECTORY...",
  run: ({ cli, args }) => {
    // const argv = parseArgs(args);
    const children = cli.fs.getChildren();

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

    const name = extractValues(args, [])[0];

    if (!name) {
      return "mkdir: missing operand";
    }

    const dir = cli.fs.find(name);

    if (dir) {
      return `mkdir: cannot create directory '${name}': File exists`;
    }

    cli.fs.createFolder(name, []);

    return "";
  },
};
