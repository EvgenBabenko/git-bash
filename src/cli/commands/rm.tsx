import { Command } from "../command-registry";
import { extractValues } from "../utils/extract-values";
import { parseArgs } from "../utils/parse-args";

export const rm: Command = {
  name: "rm",
  description: "Remove the FILE(s).",
  help: (
    <>
      Usage: rm [OPTION]... [FILE]... <br />
      <br />
      -f ignore nonexistent files and arguments, never prompt <br />
      -r remove directories and their contents recursively <br />
      -i prompt before every removal <br />
      <br />
      By default, rm does not remove directories. Use the -r option to remove
      each listed directory, too, along with all of its contents.
    </>
  ),
  run: async ({ cli, args }) => {
    const argv = parseArgs(args);
    const toDelete = extractValues(args, []);
    const children = cli.getChildren();

    if (!children) {
      return "unexpected error";
    }

    const results: string[] = [];

    for (const name of toDelete) {
      const item = children.find((i) => i.name === name);

      if (!item) {
        if (!argv.has("-f")) {
          results.push(
            `rm: cannot remove '${name}': No such file or directory`
          );
        }

        continue;
      }

      if (argv.has("-i") && !argv.has("-f")) {
        const question = `rm: remove ${item.type} '${name}'?`;
        const answer = await cli.promptUser(question);

        if (!/^y(es)?$/i.test(answer.trim())) {
          continue;
        }
      }

      if (item.type === "folder" && !argv.has("-r")) {
        if (!argv.has("-f")) {
          results.push(`rm: cannot remove '${name}': Is a directory`);
        }

        continue;
      }

      children.splice(children.indexOf(item), 1);
    }

    return (
      <>
        {results.map((res, i) => (
          <div key={i}>{res}</div>
        ))}
      </>
    );
  },
};
