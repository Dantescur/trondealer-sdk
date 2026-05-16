import { defineConfig } from "bumpp";

export default defineConfig({
  execute: "pnpm run changelog && git add CHANGELOG.md",
});
