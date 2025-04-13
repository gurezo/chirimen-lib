/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/gpio',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@chirimen/shared': path.resolve(__dirname, '../../libs/shared/src'),
      '@chirimen/gpio': path.resolve(__dirname, '../../libs/gpio/src'),
    },
  },
  build: {
    outDir: '../../dist/apps/gpio',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: 'src/index.ts',
      output: {
        entryFileNames: 'index.js',
        format: 'es',
      },
      external: ['@chirimen/shared', '@chirimen/gpio', 'express'],
    },
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/gpio',
      provider: 'v8',
    },
  },
});
