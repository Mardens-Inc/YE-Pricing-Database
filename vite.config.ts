import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    esbuild: {legalComments: "none"},
    define: {
        "process.env.NODE_ENV": JSON.stringify("development") // or "production", depending on your environment
    },
    server: {
        port: 2024
    }
});

