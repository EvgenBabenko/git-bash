import { Command } from "../command-registry";

export const promt: Command = {
  name: "promt",
  description: "Prompt user for their name and greet them.",
  async run({ emit, cli }) {
    const name = await cli.promptUser("What's your name?");
    emit(`Hello, ${name}!`);
  },
};
