import React, { useEffect, useRef, useState } from "react";
import { Cli, Item } from "@/cli/core";

import { Shell } from "./Shell/Shell";
import { ShellTitle } from "./ShellTitle/ShellTitle";
import { emitter } from "@/cli/utils";
import { Input } from "./Input/Input";
import { Fs } from "@/cli/fs";

interface Props {
  fs: Fs;
  onInit?: (props: {
    path: string;
    userName: string;
  }) => Promise<void | React.ReactNode>;
  userName?: string;
}

export const Terminal = ({ onInit, fs, userName = "guest" }: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tempInputRef = useRef<HTMLTextAreaElement>(null);
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
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    cli.current = new Cli(fs, terminalRef);

    setPath(cli.current.fs.path);

    const controller = new AbortController();

    // initial focus
    inputRef.current?.focus();

    // keep inputs always focused
    document.addEventListener(
      "click",
      () => {
        inputRef.current?.focus();
        tempInputRef.current?.focus();
      },
      {
        signal: controller.signal,
      }
    );

    emitter.on("EXIT", () => {
      setIsExiting(true);
    });
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
      onInit({ path: cli.current.fs.path, userName })
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

      emitter.off("EXIT");
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

    if (processing) {
      tempInputRef.current?.focus();
    }
  }, [processing]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!cli.current || !inputRef.current) {
      return;
    }

    if (e.code === "ArrowUp") {
      const input = cli.current.history.prev();

      inputRef.current.value = input;
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(input.length, input.length);
      });
    }

    if (e.code === "ArrowDown") {
      const input = cli.current.history.next();

      inputRef.current.value = input;
      inputRef.current.setSelectionRange(input.length, input.length);
    }

    if (e.code === "NumpadEnter" || e.code === "Enter") {
      e.preventDefault();

      const input = inputRef.current!.value;

      inputRef.current.value = "";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      cli.current.execute(input);
    }
  }

  if (isExiting) {
    return null;
  }

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

      {processing && (
        <Input
          ref={tempInputRef}
          onKeyDown={(e) => {
            if (e.code === "KeyC" && e.ctrlKey) {
              // prevent default copy behavior
              e.preventDefault();

              cli.current?.controller?.abort();
              emitter.emit("PROCESSING_STATUS", false);
            }
          }}
        />
      )}

      {prompt && (
        <div className="text-white">
          <div>{prompt.question}</div>
          <input
            type="text"
            autoFocus
            style={{ caretColor: "white" }}
            autoComplete="off"
            className="bg-transparent border-none outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = e.currentTarget.value;

                e.currentTarget.value = "";
                prompt?.resolve(value);
                setPrompt(null);
              }
            }}
          />
        </div>
      )}

      <div
        style={{
          visibility: processing ? "hidden" : "visible",
          position: processing ? "absolute" : "static",
          height: processing ? 0 : undefined,
        }}
      >
        <ShellTitle path={path} userName={userName} />
        <div className="relative w-full text-white">
          <span className="absolute left-0 top-[1.7px]">$</span>
          <Input ref={inputRef} onKeyDown={onInputKeyDown} />
        </div>
      </div>
    </Shell>
  );
};
