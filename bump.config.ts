import { defineConfig } from "bumpp";

export default defineConfig({
  execute: "pnpm run changelog && oxfmt CHANGELOG.md && git add CHANGELOG.md",
});
