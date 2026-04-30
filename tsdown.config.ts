import { defineConfig } from "tsdown";

export default defineConfig({
  dts: {
    tsgo: true,
  },
  clean: true,
  minify: true,
  banner: {
    js: "// Trondealer V2 SDK\n// https://github.com/Dantescur/trondealer-sdk\n",
  },
  exports: true,
});
