import { Command } from "../command-registry";
import { Tree } from "../core";

export const mkdir: Command = {
  name: "mkdir",
  shortDescription: "Create a directory",
  run: ({ cli, args: [, folderName] }) => {
    if (!folderName) {
      return "mkdir: missing operand";
    }

    const children = cli.getChildren();

    if (!children) {
      return "Cannot create folder here.";
    }

    if (children.find((item) => item.name === folderName)) {
      return `mkdir: cannot create directory '${folderName}': File exists`;
    }

    const newFolder: Tree = {
      name: folderName,
      type: "folder",
      path: `${cli.path}"/"${folderName}`,
      children: [],
    };

    children.push(newFolder);

    return "";
  },
};
