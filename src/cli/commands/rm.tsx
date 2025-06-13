import { Command } from "../command-registry";

/** @description converts -rf to ["-r", "-f"] */
const parseArg = (arg: string) => {
  return arg
    .split("")
    .slice(1)
    .map((el) => `-${el}`);
};

/** @description converts ["-r", "-f", test] to { "-r": true, "-f": true, "test": true } */
const parseArgs = (args: string[]) => {
  const map = new Map();

  args.forEach((el) => {
    if (el.includes("-")) {
      parseArg(el).forEach((el) => {
        map.set(el, true);
      });
    } else {
      map.set(el, true);
    }
  });

  return map;
};

export const rm: Command = {
  name: "rm",
  description: "Removing files from the working directory",
  help: "rm [OPTION]... [FILE]...",
  run: ({ cli, args: [, ...rest] }) => {
    const argv = parseArgs(rest);

    const arrayToDelete = [...argv]
      .map((el) => el[0])
      .filter((el) => !el.includes("-"));

    const children = cli.getChildren() ?? [];

    const outputs = arrayToDelete.map((el) => {
      const item = children.find((item) => item.name === el);

      if (!item) {
        return `rm: cannot remove '${el}': No such file or directory`;
      }

      if (item?.type === "folder" && !argv.has("-r")) {
        return `rm: cannot remove '${el}': Is a directory`;
      } else {
        children.splice(children.indexOf(item), 1);
      }
    });

    return (
      <>
        {outputs.map((el) => (
          <div key={el}>{el}</div>
        ))}
      </>
    );
  },
};
