import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
	plugins: [tailwind(), react()],
});
