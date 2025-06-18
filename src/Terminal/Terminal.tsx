import React, { useEffect, useRef, useState } from "react";
import { Cli, Item, Tree } from "@/cli/core";

import { Shell } from "./Shell/Shell";
import { ShellTitle } from "./ShellTitle/ShellTitle";
import { emitter } from "@/cli/utils";

interface Props {
  tree: Tree;
  onInit?: (props: {
    path: string;
    userName: string;
  }) => Promise<void | React.ReactNode>;
  userName?: string;
}

export const Terminal = ({ onInit, tree, userName = "guest" }: Props) => {
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

  // necessary to receive keyboard focus
  useEffect(() => {
    terminalRef.current?.focus();
  }, [processing]);

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

    emitter.on("PATH", (path) => {
      setPath(path);
    });
    emitter.on("CLEAR", () => {
      setItems([]);
    });
    emitter.on("PROCESSING_STATUS", (status) => {
      setProcessing(status);
    });
    emitter.on("INITIALIZATION", (status) => {
      setInitialization(status);
    });
    emitter.on("UPDATE_ITEM", (command) => {
      setItems((prev) =>
        prev.map((item) => (item.id === command.id ? command : item))
      );
    });
    emitter.on("ADD_ITEM", (item) => {
      if (cli.current) {
        cli.current.addItem(item);
      }

      setItems((prev) => [...prev, item]);
    });
    emitter.on("PROMPT", (item) => {
      setPrompt({
        id: item.id,
        question: item.question,
        resolve: item.resolve,
      });
    });

    if (onInit) {
      onInit({ path: cli.current.path, userName })
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

      emitter.off("PATH");
      emitter.off("CLEAR");
      emitter.off("PROCESSING_STATUS");
      emitter.off("INITIALIZATION");
      emitter.off("UPDATE_ITEM");
      emitter.off("ADD_ITEM");
      emitter.off("PROMPT");
    };
  }, []);

  useEffect(() => {
    if (!processing) {
      inputRef.current?.focus();
    }
  }, [processing]);

  return (
    <Shell path={path} terminalRef={terminalRef} userName={userName}>
      {initialization && initComponent}

      {items.map((item) => {
        return (
          <div key={item.id}>
            <ShellTitle path={item.path} userName={userName} />
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
        <ShellTitle path={path} userName={userName} />
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
