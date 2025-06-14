import { Command, CommandRegistry } from "../command-registry";

export function help(regisrty: CommandRegistry): Command {
  return {
    name: "help",
    description: "Display information about built-in commands",
    run: () => {
      const commands = regisrty.getAll();

      return (
        <>
          GNU bash, version 5.1.16(1)-release (x86_64-pc-msys) <br />
          These shell commands are defined internally. <br />
          Type `name --help' to find out more about the function `name'. <br />
          <br />
          {commands.map((c) => {
            return (
              <div key={c.name}>
                {c.name}: {c.description}
              </div>
            );
          })}
        </>
      );
    },
  };
}
