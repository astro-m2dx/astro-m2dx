import autoImport from '@astro-m2dx/remark-astro-auto-import';
import autoLayout from '@astro-m2dx/remark-astro-auto-layout';
import rawMdx from '@astro-m2dx/remark-astro-raw-mdx';
import mdxMapping from '@astro-m2dx/vite-astro-mdx-mapping';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), tailwind()],
    markdown: {
        remarkPlugins: [autoImport, autoLayout, rawMdx],
        extendDefaultPlugins: true,
    },
    vite: {
        plugins: [mdxMapping()],
    },
});
