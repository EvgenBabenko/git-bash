import { Command } from "../command-registry";
import { emitter } from "../utils";

export const cd: Command = {
  name: "cd",
  description: "Change the shell working directory.",
  help: (
    <div>
      <div>cd: cd [-P]</div>
      <div>Options: </div>
      <div>
        -P Change to path P, if P is not specified, change to the root directory
      </div>
    </div>
  ),
  run: ({ args: [P], cli }) => {
    const path = P;
    const rootPath = "";

    // Go to root if no path is provided
    if (!path) {
      cli.path = rootPath;
      emitter.emit("PATH", cli.path);
      return "";
    }

    // Normalize the current path into an array
    let currentPathSegments = cli.path.split("/").filter(Boolean);

    const parts = path.split("/").filter(Boolean);

    let currentChildren = cli.getChildren();

    for (const part of parts) {
      if (part === "..") {
        currentPathSegments.pop();
        currentChildren = cli.getChildren(currentPathSegments.join("/"));
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
      currentChildren = cli.getChildren(currentPathSegments.join("/"));
    }

    cli.path = currentPathSegments.join("/");
    emitter.emit("PATH", cli.path);

    return "";
  },
};
