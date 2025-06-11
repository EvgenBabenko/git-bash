// import { ShellTitle } from "Terminal/ShellTitle/ShellTitle";
import "./App.css";
import { Terminal } from "./Terminal/Terminal";
import "./index.css";
import { fs } from "constants/fs";

export const App = () => {
  return (
    <div className="content">
      <div className="w-full max-w-[600px] mx-auto h-[250px]">
        <Terminal
          fs={fs}
          // onInit={async () => {
          //   // await delay(5000);

          //   // emitter.emit("CLI_INITIALIZATION", false);
          //   // emitter.emit("CLI_PROCESSING_STATUS", false);

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
          //   //     emitter.emit("CLI_PROCESSING_STATUS", false);
          //   //   });
          // }}
        />
      </div>
    </div>
  );
};
