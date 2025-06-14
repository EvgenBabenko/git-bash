import React, { useEffect, useRef, useState } from "react";
import { Cli, Item, Tree } from "@/cli/core";

import { Shell } from "./Shell/Shell";
import { ShellTitle } from "./ShellTitle/ShellTitle";
import { emitter } from "@/cli/utils";

const USER_NAME = "guest";

interface Props {
  tree: Tree;
  onInit?: (props: {
    path: string;
    userName: string;
  }) => Promise<void | React.ReactNode>;
}

export const Terminal = ({ onInit, tree }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState("");
  const [processing, setProcessing] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const cli = useRef<Cli | null>(null);
  const [initialization, setInitialization] = useState(true);
  const [initComponent, setInitComponent] = useState<React.ReactNode>(null);
  const [prompt, setPrompt] = useState<{
    id: string;
    question: string;
    resolve: (value: string) => void;
  } | null>(null);

  useEffect(() => {
    cli.current = new Cli(tree, inputRef, terminalRef);

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
    emitter.on("CLI_INITIALIZATION", (status) => {
      setInitialization(status);
    });
    emitter.on("CLI_UPDATE_ITEM", (command) => {
      setItems((prev) =>
        prev.map((item) => (item.id === command.id ? command : item))
      );
    });
    emitter.on("CLI_ADD_ITEM", (item) => {
      if (cli.current) {
        cli.current.addItem(item);
      }

      setItems((prev) => [...prev, item]);
    });
    emitter.on("CLI_PROMPT", (item) => {
      setPrompt({
        id: item.id,
        question: item.question,
        resolve: item.resolve,
      });
    });

    if (onInit) {
      onInit({ path: cli.current.path, userName: USER_NAME })
        .then((res) => {
          if (React.isValidElement(res)) {
            setInitComponent(res);
          }
        })
        .catch((err) => console.error(err));
    } else {
      setInitialization(false);
      setProcessing(false);
    }

    return () => {
      controller.abort();

      cli.current?.removeEventListener();

      emitter.off("CLI_PATH");
      emitter.off("CLI_CLEAR");
      emitter.off("CLI_PROCESSING_STATUS");
      emitter.off("CLI_INITIALIZATION");
      emitter.off("CLI_UPDATE_ITEM");
      emitter.off("CLI_ADD_ITEM");
      emitter.off("CLI_PROMPT");
    };
  }, []);

  useEffect(() => {
    if (!processing) {
      inputRef.current?.focus();
    }
  }, [processing]);

  return (
    <Shell path={path} terminalRef={terminalRef} userName={USER_NAME}>
      {initialization && initComponent}

      {items.map((item) => {
        return (
          <div key={item.id}>
            <ShellTitle path={item.path} userName={USER_NAME} />
            <div>$ {item.input}</div>
            {item.output}
          </div>
        );
      })}

      {prompt && (
        <>
          <div>{prompt.question}</div>
          <input
            type="text"
            autoFocus
            style={{ caretColor: "white" }}
            autoComplete="off"
            className="bg-transparent border-none text-white outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = e.currentTarget.value;
                e.currentTarget.value = "";
                prompt.resolve(value);
                setPrompt(null);
              }
            }}
          />
        </>
      )}

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
