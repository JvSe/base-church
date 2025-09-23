import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/client.ts", "src/seed.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  target: "node20",
  outDir: "dist",
  external: ["@prisma/client"],
  treeshake: true,
  bundle: true,
});
