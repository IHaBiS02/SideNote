import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'wysiwyg-markdown.js',
    },
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        banner: '/*! @sidenote/wysiwyg-markdown | Includes third-party software; see THIRD_PARTY_LICENSES.md */',
      },
    },
  },
});
