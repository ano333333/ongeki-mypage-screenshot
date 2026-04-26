import { defineConfig } from "vite";
import { resolve } from "path";

const GITHUB_PAGES_MAIN_JS_URL =
	"https://ano333333.github.io/ongeki-mypage-screenshot/main.js";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
	define: {
		"import.meta.env.VITE_MAIN_JS_URL": JSON.stringify(
			isDev ? "http://localhost:4173/main.js" : GITHUB_PAGES_MAIN_JS_URL,
		),
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/embed.ts"),
			name: "embed",
			fileName: () => "embed.js",
			formats: ["iife"],
		},
		outDir: "dist",
		emptyOutDir: false,
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: false,
			},
			format: {
				comments: false,
			},
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
	},
});
