import { Command } from "../command-registry";
import { emitter } from "../utils";

export const cd: Command = {
  name: "cd",
  shortDescription: "Change the shell working directory.",
  description: (
    <div>
      <div>cd: cd [-P]</div>
      <div>Options: </div>
      <div>
        -P Change to path P, if P is not specified, change to the root directory
      </div>
    </div>
  ),
  run: ({ args: [commandInput, path], cli }) => {
    const children = cli.getChildren();

    // TODO: implement correct -P
    if (!path) {
      cli.path =
        cli.path === "/"
          ? "/"
          : "/" + cli.path.split("/").slice(0, -1).join("/");

      emitter.emit("CLI_PATH", cli.path);

      return "";
    }

    if (!children) {
      return <div>no such file or directory</div>;
    }

    const child = children.find((el) => el.name === path);

    if (!child) {
      return `bash: ${commandInput}: ${path}: Not a directory`;
    }

    // this.path =
    //   "/" + this.path.split("/").filter(Boolean).concat(dir).join("/");
    cli.path += cli.path.startsWith("/") ? path : `/${path}`;

    emitter.emit("CLI_PATH", cli.path);

    return "";
  },
};
