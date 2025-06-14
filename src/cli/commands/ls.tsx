import { Command } from "../command-registry";

export const ls: Command = {
  name: "ls",
  description:
    "List information about the FILEs (the current directory by default).",
  run: ({ cli }) => {
    const children = cli.getChildren();

    if (!children) {
      return "no such files or directories";
    }

    return children.map((item) => {
      return (
        <div key={item.name}>
          {item.type === "folder" ? `${item.name}/` : item.name}
        </div>
      );
    });
  },
};
