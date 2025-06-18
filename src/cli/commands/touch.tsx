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
    const children = cli.getChildren();

    if (!children) {
      return "unexpected error";
    }

    toCreate.forEach((el) => {
      const item = children.find((item) => item.name === el);

      if (item) {
        return "";
      }

      children.push({
        type: "file",
        name: el,
        path: `${cli.path}"/"${el}`,
        createdAt: new Date().toISOString(),
        content: "",
      });
    });

    return "";
  },
};
