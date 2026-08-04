import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import mdx from '@mdx-js/rollup';
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeLink from './src/helpers/rehypeLink.ts';

export default defineConfig({
  // Allow CRA-style REACT_APP_* in .env alongside Vite's VITE_* (see src/api/prod/constant.ts).
  envPrefix: ['VITE_', 'REACT_APP_'],
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // FIXME `quietDeps: true` silences warnings coming from dependencies
        quietDeps: true,
        // FIXME `silenceDeprecations` silences extra warnings. Both can only be fixed with bulma v1+ update
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
  plugins: [
    mdx({
      providerImportSource: '/src/helpers/mdxComponents.tsx',
      remarkPlugins: [remarkGfm, remarkToc],
      rehypePlugins: [rehypeHighlight, rehypeSanitize, rehypeRaw, rehypeSlug, rehypeLink],
    }),
    reactRouter(),
  ],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
  },
  // assetsInclude: ["**/*.md"],
});
