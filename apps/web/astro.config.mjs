import { defineConfig } from 'astro/config';

import autoLayout from '@astro-m2dx/remark-astro-auto-layout';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    integrations: [mdx()],
    markdown: {
        remarkPlugins: [autoLayout],
        extendDefaultPlugins: true,
    },
});
