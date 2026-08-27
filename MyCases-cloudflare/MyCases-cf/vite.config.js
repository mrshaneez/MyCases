import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works on GitHub Pages under /<repo>/
// as well as from a local file or any other host.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
