import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: ["./src/App.tsx"],
    },
  },
  lib: [
    {
      bundle: true,
      dts: true,
      format: "esm",
    },
  ],
  output: {
    target: "web",
  },
  plugins: [pluginReact()],
});
