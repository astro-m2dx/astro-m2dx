import autoImport from '@astro-m2dx/remark-astro-auto-import';
import frontmatter from '@astro-m2dx/remark-astro-frontmatter';
import rawMdx from '@astro-m2dx/remark-astro-raw-mdx';
import sectionizeHeadings from '@astro-m2dx/remark-sectionize-headings';
import mdxMapping from '@astro-m2dx/vite-astro-mdx-mapping';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind()],
  markdown: {
    remarkPlugins: [autoImport, frontmatter, rawMdx, [sectionizeHeadings, { levels: [2] }]],
    extendDefaultPlugins: true,
  },
  vite: {
    plugins: [mdxMapping()],
    ssr: {
      external: ['svgo'],
    },
  },
});
