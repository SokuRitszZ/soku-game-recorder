import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ mode }) => {
  console.log(mode);
  if (mode === 'preview') {
    return {
      plugins: [
        solidPlugin(),
      ],
      build: {
        outDir: './preview-dist',
      },
    };
  }
  return {
    plugins: [
      solidPlugin(),
    ],
    build: {
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        external: ['@soku-games/core'],
      },
    },
  };
});
