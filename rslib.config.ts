import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      // TODO: use bundleless
      index: ["./src/index.tsx"],
      // index: ["./src/**"],
    },
  },
  lib: [
    {
      // TODO: use bundleless declaration files
      bundle: true,
      dts: true,
      format: "esm",
    },
  ],
  output: {
    target: "web",
  },
});
