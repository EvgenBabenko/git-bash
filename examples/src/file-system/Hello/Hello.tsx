import { useState, useEffect } from "react";
import { delay, emitter } from "@lib/cli/utils";

export const Hello = () => {
  const [res, setRes] = useState("");

  const asyncFn = async () => {
    await delay(5000).then(() => {
      emitter.emit("PROCESSING_STATUS", false);
      setRes("World");
    });
  };

  useEffect(() => {
    setRes("Hello");
    emitter.emit("PROCESSING_STATUS", true);

    asyncFn();
  }, []);

  return res;
};
