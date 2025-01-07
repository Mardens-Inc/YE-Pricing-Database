import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),
        // legacy({
        //     targets: ["defaults", "not IE 11", "Chrome >= 49"], // Specify browser versions
        //     additionalLegacyPolyfills: ["regenerator-runtime/runtime"] // To support async/await
        // })
    ],
    esbuild: {legalComments: "none"},
    server: {
        port: 2024
    }
});

