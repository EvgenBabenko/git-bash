import { Command } from "../command-registry";

export const ls: Command = {
  name: "ls",
  shortDescription: "List all directories and files",
  run: ({ cli }) => {
    const children = cli.getChildren();

    if (!children) {
      return <div>no such files or directories</div>;
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
