import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", "@maistro/ui", "@maistro/types"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
});
