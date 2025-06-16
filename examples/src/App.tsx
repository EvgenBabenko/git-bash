// import { ShellTitle } from "Terminal/ShellTitle/ShellTitle";
import "./App.css";
import { Terminal } from "@lib/Terminal/Terminal";
import { tree } from "@/file-system";
import { useEffect, useState } from "react";
import { emitter } from "@lib/cli/utils";

export const App = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    emitter.on("EXIT", () => {
      setIsVisible(false);
    });

    return () => {
      emitter.off("EXIT");
    };
  });

  return (
    <div className="content">
      <div className="w-full max-w-[600px] mx-auto h-[250px]">
        {isVisible && (
          <Terminal
            tree={tree}
            // onInit={async () => {
            //   // await delay(5000);

            //   // emitter.emit("INITIALIZATION", false);
            //   // emitter.emit("PROCESSING_STATUS", false);

            //   // Promise.resolve()
            //   //   .then(() => {
            //   //     emitter.emit("CLI_ADD_ITEM", {
            //   //       id: "1",
            //   //       input: "echo hello",
            //   //       output: "hello",
            //   //       path: "",
            //   //     });
            //   //   })
            //   //   .then(() => {
            //   //     emitter.emit("PROCESSING_STATUS", false);
            //   //   });
            // }}
          />
        )}
      </div>
    </div>
  );
};
