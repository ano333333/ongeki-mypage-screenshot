import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";

export default defineConfig({
	root: "src",
	build: {
		outDir: "../dist",
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
			input: {
				main: resolve(__dirname, "src/index.html"),
			},
		},
	},
	plugins: [
		{
			name: "inject-build-datetime",
			enforce: "post",
			transformIndexHtml(html) {
				const now = new Date();
				const pad = (n: number) => String(n).padStart(2, "0");
				const datetime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
				return html.replace("BUILD_DATETIME", datetime);
			},
		},
		{
			name: "inject-bookmarklet",
			enforce: "post",
			transformIndexHtml(html) {
				try {
					// dist/embed.js を読み込む
					const embedJsPath = resolve(__dirname, "dist/embed.js");
					const embedJsContent = readFileSync(embedJsPath, "utf-8");

					// エスケープ (javascript: プレフィックスは既に HTML にある)
					const escapedContent = encodeURIComponent(embedJsContent);

					// HTML 内の MAIN_JS を置換
					return html.replace("MAIN_JS", escapedContent);
				} catch (error) {
					console.warn(
						"Warning: Could not read dist/embed.js, using placeholder",
					);
					return html;
				}
			},
		},
	],
});
