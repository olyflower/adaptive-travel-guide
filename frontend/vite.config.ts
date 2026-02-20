import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ command }) => ({
	plugins: [
		tailwind(),
		react(),

		command === "build" &&
			visualizer({
				open: true,
				gzipSize: true,
				brotliSize: true,
				filename: "stats.html",
			}),
	].filter(Boolean),
	server: {
		headers: {
			"Cross-Origin-Opener-Policy": "same-origin-allow-popups",
		},
	},
}));
