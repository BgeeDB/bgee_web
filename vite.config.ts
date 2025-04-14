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
// import remarkFrontmatter from "remark-frontmatter";
// import remarkMdxFrontmatter from "remark-mdx-frontmatter";
// import mdPlugin from 'vite-plugin-markdown';
// import {useMDXComponents} from '~/helpers/mdxComponents';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    mdx({
      providerImportSource: '@mdx-js/react',
      // providerImportSource: "./src/helpers/mdxComponents",
      // providerImportSource: import.meta.resolve('./src/helpers/mdxComponents.tsx'),
      // providerImportSource: useMDXComponents,
      // format: "detect",
      // include: /\.mdx?$/,
      remarkPlugins: [
        remarkGfm,
        remarkToc,
        // remarkFrontmatter,
        // remarkMdxFrontmatter,
      ],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSanitize,
        rehypeRaw,
        rehypeSlug,
      ],
    }),
    reactRouter(),
    // Custom plugin to handle .md files directly
    // {
    //   name: "markdown-plain-loader",
    //   enforce: "pre",
    //   transform(code, id) {
    //     if (id.endsWith('.md')) {
    //       return `export default ${JSON.stringify(code)};`;
    //     }
    //   }
    // },
  ],
  // assetsInclude: ["**/*.md"],
  // optimizeDeps: {
  //   include: ['react/jsx-runtime'],
  // },
  // resolve: {
  //   extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.mdx'],
  // },
})
