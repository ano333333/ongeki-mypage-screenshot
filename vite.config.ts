import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: false,
    minify: 'terser',
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
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  plugins: [
    {
      name: 'inject-bookmarklet',
      enforce: 'post',
      transformIndexHtml(html) {
        try {
          // dist/main.js を読み込む
          const mainJsPath = resolve(__dirname, 'dist/main.js');
          const mainJsContent = readFileSync(mainJsPath, 'utf-8');

          // エスケープ (javascript: プレフィックスは既に HTML にある)
          const escapedContent = encodeURIComponent(mainJsContent);

          // HTML 内の MAIN_JS を置換
          return html.replace('MAIN_JS', escapedContent);
        } catch (error) {
          console.warn('Warning: Could not read dist/main.js, using placeholder');
          return html;
        }
      },
    },
  ],
});
