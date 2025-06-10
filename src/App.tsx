// import { ShellTitle } from "Terminal/ShellTitle/ShellTitle";
import "./App.css";
import { Terminal } from "./Terminal/Terminal";
import { delay, emitter } from "cli/utils";
import "./index.css";
import Typewriter from "typewriter-effect";
import { fs } from "constants/fs";

export const App = () => {
  return (
    <div className="content">
      <div className="w-full max-w-[600px] mx-auto h-[250px]">
        <Terminal
          fs={fs}
          onInit={async () => {
            // await delay(5000);

            // emitter.emit("CLI_INITIALIZATION", false);
            // emitter.emit("CLI_PROCESSING_STATUS", false);

            return (
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .pasteString("$ ", null)
                    .pauseFor(2500)
                    .typeString("./hello.sh<br>")
                    .pauseFor(700)
                    .typeString("Hello World")
                    // .pauseFor(1200)
                    // .deleteChars(6)
                    // .typeString(
                    //   "I'm frontend developer. Turning ideas into code and challenges into problems"
                    // )
                    // .pauseFor(1500)
                    // .deleteChars(8)
                    // .typeString("solutions.")
                    .callFunction((state) => {
                      state.elements.cursor.remove();

                      emitter.emit("CLI_ON_ADD_ITEM", {
                        id: Date.now().toString(),
                        input: "./hello.sh",
                        output:
                          "Hello I'm frontend developer. Turning ideas into code and challenges into solutions.",
                        path: "/",
                      });

                      emitter.emit("CLI_PROCESSING_STATUS", false);
                      emitter.emit("CLI_INITIALIZATION", false);

                      // setInitialization(false);
                    })
                    .start();
                }}
              />
            );

            // Promise.resolve()
            //   .then(() => {
            //     emitter.emit("CLI_ON_ADD_ITEM", {
            //       id: "1",
            //       input: "echo hello",
            //       output: "hello",
            //       path: "",
            //     });
            //   })
            //   .then(() => {
            //     emitter.emit("CLI_PROCESSING_STATUS", false);
            //   });
          }}
        />
      </div>
    </div>
  );
};
