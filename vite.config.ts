import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import {defineConfig} from 'vite';

function collectHtmlInputs() {
  const inputs: Record<string, string> = {};
  const rootFiles = fs.readdirSync(__dirname);
  for (const file of rootFiles) {
    if (file.endsWith('.html')) {
      const name = file.replace(/\.html$/, '');
      inputs[name] = path.resolve(__dirname, file);
    }
  }
  const albumsDir = path.resolve(__dirname, 'albums');
  if (fs.existsSync(albumsDir)) {
    for (const file of fs.readdirSync(albumsDir)) {
      if (file.endsWith('.html')) {
        const name = `albums/${file.replace(/\.html$/, '')}`;
        inputs[name] = path.resolve(albumsDir, file);
      }
    }
  }
  return inputs;
}

function copyStaticPortfolioAssets() {
  return {
    name: 'copy-static-portfolio-assets',
    writeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const staticFiles = ['script.js', 'album-footer.js', 'robots.txt', 'sitemap.xml'];
      for (const file of staticFiles) {
        const src = path.resolve(__dirname, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.resolve(distDir, file));
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyStaticPortfolioAssets()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: collectHtmlInputs(),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
