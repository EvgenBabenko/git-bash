import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";

export default defineConfig({
  plugins: [pluginReact(), pluginImageCompress()],
  html: {
    template: "./examples/src/index.html",
  },
  output: {
    assetPrefix: "/git-bash/",
    distPath: {
      root: "./examples/dist",
    },
    cleanDistPath: true,
  },
  source: {
    entry: {
      index: "./examples/src/index.tsx",
    },
    tsconfigPath: "./examples/tsconfig.json",
  },
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
