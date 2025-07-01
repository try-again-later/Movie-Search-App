import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/Movie-Search-App/',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
  },
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src', 'components'),
      '@ts': resolve(__dirname, 'src', 'ts'),
      '@hooks': resolve(__dirname, 'src', 'hooks'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['./src/scss'],
      },
    },
  },
  plugins: [
    svgr(),
    react({
      babel: { plugins: [['babel-plugin-react-compiler']] },
    }),
  ],
});
