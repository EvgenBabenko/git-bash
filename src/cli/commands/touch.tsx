import { Command } from "../command-registry";
import { extractValues } from "../utils/extract-values";
// import { parseArgs } from "../utils/parse-args";

export const touch: Command = {
  name: "touch",
  description: "Create the FILE(s).",
  help: "Usage: touch [OPTION]... FILE...",
  run: ({ cli, args }) => {
    // const argv = parseArgs(args);
    const toCreate = extractValues(args, []);
    const children = cli.fs.getChildren();

    if (!children) {
      return "unexpected error";
    }

    toCreate.forEach((name) => {
      const file = cli.fs.find(name);

      if (file) {
        return "";
      }

      cli.fs.createFile(name, "");
    });

    return "";
  },
};
