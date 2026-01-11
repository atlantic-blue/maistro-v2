import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "handlers/projects": "src/handlers/projects/index.ts",
    "handlers/landing-pages": "src/handlers/landing-pages/index.ts",
    "handlers/signups": "src/handlers/signups/index.ts",
    "handlers/events": "src/handlers/events/index.ts",
    "handlers/analytics": "src/handlers/analytics/index.ts",
    "handlers/public": "src/handlers/public/index.ts",
  },
  format: ["cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["@aws-sdk/*"],
});
