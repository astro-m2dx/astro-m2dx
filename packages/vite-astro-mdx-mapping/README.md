# Astro M²DX - Remark plugin to export component mappings per-directory

[`Vite`](https://vitejs.dev/guide/api-plugin.html) plugin to support per-directory default component mappings for [Astro](https://docs.astro.build/en/reference/configuration-reference/#vite) markdown-files.

## Content <!-- omit in toc -->

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)

## What is this?

This package is a [`Vite`](https://vitejs.dev/guide/api-plugin.html) plugin to add support for automatic `components` mapping insertion to markdown-files in the context of [Astro](https://docs.astro.build/en/guides/integrations-guide/mdx) site generation.

In Astro you can define a mapping from HTML elements to JSX components by exporting `const components = { ... }` in any MDX file. With this plugin you can define this per directory.

## When should I use this?

If you want to use the same component mapping for all MDX-files within a directory and its subdirectories and want to keep your markdown files and their frontmatter as clean as possible.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install -D @astro-m2dx/vite-astro-mdx-mapping
```

## Use

In your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import mdxMapping from '@astro-m2dx/vite-astro-mdx-mapping';
// ^^^

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [],
    extendDefaultPlugins: true,
  },
  vite: {
    plugins: [mdxMapping()],
    //        ^^^
  },
});
```

This uses the default options, where the name of the mapping file is `_mdx-mapping.ts`.

Now create a TypeScript/JavaScript file, that exports a `components` object mapping HTML elements to arbitrary Astro, React, ... components.

```js
import { Title } from '@components/Title';

export const components = {
  h1: Title,
};
```

### Options

If you want to use a different name for the mapping file, you can specify it in the plugin's `name` option like so:

```js
plugins: [mdxMapping({name: "_components.ts"})],
```
