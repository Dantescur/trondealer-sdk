import { defineConfig } from "tsdown";

export default defineConfig({
  dts: {
    tsgo: true,
  },
  clean: true,
  minify: true,
  banner: {
    js: "/* Tron Dealer V2 SDK — https://github.com/Dantescur/trondealer-sdk */",
  },
  exports: true,
});
