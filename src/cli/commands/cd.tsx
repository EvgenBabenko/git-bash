import { Command } from "../command-registry";
import { emitter } from "../utils";
import { extractValues } from "../utils/extract-values";

export const cd: Command = {
  name: "cd",
  description: "Change the shell working directory.",
  help: (
    <>
      Usage: cd [DIR] <br />
      Change the current directory to DIR. The default DIR is the value of the
      HOME shell variable. <br />
      `..' is processed by removing the immediately previous pathname component
      back to a slash or the beginning of DIR. <br />
      If DIR is not specified, change to the root directory
    </>
  ),
  run: ({ args, cli }) => {
    const path = extractValues(args, [])[0];

    // Go to root if no path is provided
    if (!path) {
      cli.fs.path = "";
      emitter.emit("PATH", cli.fs.path);

      return "";
    }

    // Normalize the current path into an array
    let currentPathSegments = cli.fs.path.split("/").filter(Boolean);

    const parts = path.split("/").filter(Boolean);

    let currentChildren = cli.fs.getChildren();

    for (const part of parts) {
      if (part === "..") {
        currentPathSegments.pop();
        currentChildren = cli.fs.getChildren(currentPathSegments.join("/"));

        continue;
      }

      if (!currentChildren) {
        return `bash: cd: ${part}: No such file or directory`;
      }

      const nextDir = currentChildren.find((el) => el.name === part);

      if (!nextDir) {
        return `bash: cd: ${part}: No such file or directory`;
      }

      currentPathSegments.push(part);
      currentChildren = cli.fs.getChildren(currentPathSegments.join("/"));
    }

    cli.fs.path = currentPathSegments.join("/");
    emitter.emit("PATH", cli.fs.path);

    return "";
  },
};
