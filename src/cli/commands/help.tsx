import { Command, CommandRegistry } from "../command-registry";

export function help(regisrty: CommandRegistry): Command {
  return {
    name: "help",
    description: "Display information about built-in commands",
    run: ({ args: [, commandInput] }) => {
      const commands = regisrty.getAll();

      if (commandInput) {
        const command = commands.find((c) => c.name === commandInput);

        return (
          command?.help ?? `bash: help: no help topics match "${commandInput}".`
        );
      }

      return (
        <div>
          <div>GNU bash, version 5.1.16(1)-release (x86_64-pc-msys)</div>
          <div>
            These shell commands are defined internally. Type `help' to see this
            list.
          </div>
          <br />
          {commands.map((c) => {
            return (
              <div key={c.name}>
                {c.name}: {c.description}
              </div>
            );
          })}
        </div>
      );
    },
  };
}
