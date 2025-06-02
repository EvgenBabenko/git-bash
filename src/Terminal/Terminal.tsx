import { useEffect, useRef, useState } from "react";
import Typewriter from "typewriter-effect";
import { Cli, Item } from "../cli";
import { fs } from "../constants/fs";

import { Shell } from "./Shell/Shell";
import { ShellTitle } from "./ShellTitle/ShellTitle";
import { emitter } from "../cli/utils";

const USER_NAME = "guest";

interface Props {
  onClose: () => void;
  onMinimize: () => void;
  onExpand: () => void;
}

export const Terminal = ({ onClose, onMinimize, onExpand }: Props) => {
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState("/");
  // TODO dont forget to set to true
  const [processing, setProcessing] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const cli = useRef<Cli | null>(null);
  // TODO dont forget to set to true
  const [initialization, setInitialization] = useState(false);

  useEffect(() => {
    cli.current = new Cli(fs, inputRef, terminalRef);

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
    <Shell
      onClose={onClose}
      onMinimize={onMinimize}
      onExpand={onExpand}
      path={path}
      terminalRef={terminalRef}
      userName={USER_NAME}
    >
      {/* {initialization && (
          <>
            <ShellTitle path={path} userName={USER_NAME} />
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .pasteString("$ ", null)
                  .pauseFor(2500)
                  .typeString("./hello.sh<br>")
                  .pauseFor(700)
                  .typeString("Hello World!")
                  .pauseFor(1200)
                  .deleteChars(6)
                  .typeString(
                    "I'm frontend developer. Turning ideas into code and challenges into problems"
                  )
                  .pauseFor(1500)
                  .deleteChars(8)
                  .typeString("solutions.")
                  .callFunction((state) => {
                    state.elements.cursor.remove();
                    setProcessing(false);
                    cli.current?.addItem({
                      id: Date.now().toString(),
                      input: "./hello.sh",
                      output:
                        "Hello I'm frontend developer. Turning ideas into code and challenges into solutions.",
                      path: cli.current?.path,
                    });
                    setInitialization(false);
                  })
                  .start();
              }}
            />
          </>
        )} */}

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
