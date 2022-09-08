import { defineConfig } from 'astro/config';
import mdxMapping from '@astro-m2dx/vite-astro-mdx-mapping';
import autoLayout from '@astro-m2dx/remark-astro-auto-layout';
import mdx from '@astrojs/mdx';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    integrations: [mdx(), tailwind()],
    markdown: {
        remarkPlugins: [autoLayout],
        extendDefaultPlugins: true,
    },
    vite: {
        plugins: [mdxMapping()],
    },
});
