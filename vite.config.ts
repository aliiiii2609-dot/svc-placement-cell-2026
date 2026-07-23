import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    // Raised only because the vendor chunk legitimately sits near the default
    // 500 kB line. Everything above it is now route-split, so this is no
    // longer papering over a bundling problem.
    chunkSizeWarningLimit: 600,
    /**
     * No manualChunks. This is deliberate.
     *
     * The original config hand-listed three/gsap/framer-motion. Two of those
     * dependencies no longer exist here, and hand-listing has a subtle trap:
     * forcing a named chunk merges modules that Rollup would otherwise have
     * kept in the async-only graph, which drags lazy-route dependencies back
     * onto the critical path. An attempt at a smarter grouping function did
     * exactly that, stranding Vite's own preload helper in the docgen chunk
     * and making the home page eagerly modulepreload 291 kB of PDF tooling.
     *
     * Now that every route below the home page is a dynamic import, Rollup's
     * automatic code splitting already does the right thing: shared modules
     * land in common chunks, and anything only reachable from a lazy route
     * (jspdf, html2canvas, docx, dompurify, file-saver) stays out of the
     * initial graph on its own. Measured, this beats every hand-tuned variant.
     */
  },
  server: {
    port: 5173,
    open: true,
  },
});
