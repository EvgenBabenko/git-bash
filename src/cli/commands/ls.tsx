import { Command } from "../command-registry";
import { Tree } from "../core";
import { parseArgs } from "../utils/parse-args";

export const ls: Command = {
  name: "ls",
  description: "List information about the FILEs",
  help: (
    <>
      Usage: ls [OPTION]... <br />
      List information about the FILEs <br />
      Sort entries alphabetically if none of -t is specified. <br />
      -l use a long listing format <br />
      -t sort by time, newest first
    </>
  ),
  run: ({ cli, args }) => {
    const argv = parseArgs(args);
    const children = cli.getChildren();

    if (!children) {
      return "no such files or directories";
    }

    let sorted: Tree[] = [];

    if (argv.has("-t")) {
      sorted = children.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else {
      sorted = children.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (argv.has("-l")) {
      return sorted.map((item) => {
        const options: Intl.DateTimeFormatOptions = {
          hour12: false,
        };

        const createdAtFormatted = new Date(item.createdAt).toLocaleString(
          "en-US",
          options
        );

        return (
          <div key={item.name}>
            <span>{createdAtFormatted}</span>{" "}
            <span>{item.type === "folder" ? `${item.name}/` : item.name}</span>
          </div>
        );
      });
    }

    return sorted.map((item) => {
      return (
        <div key={item.name}>
          <span>{item.type === "folder" ? `${item.name}/` : item.name}</span>
        </div>
      );
    });
  },
};
