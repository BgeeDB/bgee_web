import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    mdx({
      providerImportSource: "/src/helpers/mdxComponents.tsx",
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkGfm,
        remarkToc,
      ],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSanitize,
        rehypeRaw,
        rehypeSlug,
      ],
    }),
    reactRouter(),
  ],
  optimizeDeps: {
    include: [
      'react/jsx-runtime',
    ],
  },
  // assetsInclude: ["**/*.md"],
})
