import { Command } from "../command-registry";

export const open: Command = {
  name: "open",
  shortDescription: "open file",
  run: ({ args: [, filename], cli }) => {
    const children = cli.getChildren();

    const item = children?.find((el) => el.name === filename);

    if (!item) {
      return `The system cannot find the file ${filename}`;
    }

    return "";
  },
};
