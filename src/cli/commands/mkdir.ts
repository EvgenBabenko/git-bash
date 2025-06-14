import { Command } from "../command-registry";
import { Tree } from "../core";
import { parseArgs } from "../utils/parse-args";

export const mkdir: Command = {
  name: "mkdir",
  description: "Create the DIRECTORY(ies), if they do not already exist.",
  help: "Usage: mkdir [OPTION]... DIRECTORY...",
  run: ({ cli, args: [, ...rest] }) => {
    const argv = parseArgs(rest);

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

    const directory = [...argv]
      .map((el) => el[0])
      .filter((el) => !el.includes("-"))[0];

    if (!directory) {
      return "mkdir: missing operand";
    }

    if (children.find((item) => item.name === directory)) {
      return `mkdir: cannot create directory '${directory}': File exists`;
    }

    const newFolder: Tree = {
      name: directory,
      type: "folder",
      path: `${cli.path}"/"${directory}`,
      children: [],
    };

    children.push(newFolder);

    return "";
  },
};
