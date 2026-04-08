import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import mdx from '@mdx-js/rollup';
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeLink from './src/helpers/rehypeLink';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
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
