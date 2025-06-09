import { useEffect, useRef, useState } from "react";
import { Cli, Item } from "cli";
import { fs } from "constants/fs";

import { Shell } from "./Shell/Shell";
import { ShellTitle } from "./ShellTitle/ShellTitle";
import { emitter } from "cli/utils";

const USER_NAME = "guest";

// interface Props {}

export const Terminal = () => {
  // const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState("");
  // TODO dont forget to set to true
  const [processing, setProcessing] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const cli = useRef<Cli | null>(null);
  // TODO dont forget to set to true
  // const [initialization, setInitialization] = useState(false);

  console.log("path", path);

  useEffect(() => {
    cli.current = new Cli(fs, inputRef, terminalRef);

    setPath(cli.current.path);

    const controller = new AbortController();

    // initial focus
    inputRef.current?.focus();

    // keep input always focused
    document.addEventListener(
      "click",
      () => {
        inputRef.current?.focus();
      },
      {
        signal: controller.signal,
      }
    );

    cli.current.addEventListener();

    emitter.on("CLI_PATH", (path) => {
      setPath(path);
    });
    emitter.on("CLI_CLEAR", () => {
      setItems([]);
    });
    emitter.on("CLI_PROCESSING_STATUS", (status) => {
      setProcessing(status);
    });
    emitter.on("CLI_ON_UPDATE_ITEM", (command) => {
      setItems((prev) =>
        prev.map((item) => (item.id === command.id ? command : item))
      );
    });
    emitter.on("CLI_ON_ADD_ITEM", (command) => {
      setItems((prev) => [...prev, command]);
    });

    return () => {
      controller.abort();

      cli.current?.removeEventListener();

      emitter.off("CLI_PATH");
      emitter.off("CLI_CLEAR");
      emitter.off("CLI_PROCESSING_STATUS");
      emitter.off("CLI_ON_UPDATE_ITEM");
      emitter.off("CLI_ON_ADD_ITEM");
    };
  }, []);

  useEffect(() => {
    if (!processing) {
      inputRef.current?.focus();
    }
  }, [processing]);

  return (
    <Shell path={path} terminalRef={terminalRef} userName={USER_NAME}>
      {items.map((item) => {
        return (
          <div key={item.id}>
            <ShellTitle path={item.path} userName={USER_NAME} />
            <div>$ {item.input}</div>
            {item.output}
          </div>
        );
      })}

      <div
        style={{
          visibility: processing ? "hidden" : "visible",
          position: processing ? "absolute" : "static",
          height: processing ? 0 : undefined,
        }}
      >
        <ShellTitle path={path} userName={USER_NAME} />
        <div>
          <label htmlFor="input">$ </label>
          <input
            ref={inputRef}
            id="input"
            type="text"
            name="input"
            autoFocus
            autoComplete="off"
            className="bg-transparent border-none text-white outline-none"
            style={{ caretColor: "white" }}
          />
        </div>
      </div>
    </Shell>
  );
};
