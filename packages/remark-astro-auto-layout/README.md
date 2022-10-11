# Astro M²DX - Remark plugin for auto-layout

> **DEPRECATED:** Please consider using the plugin [astro-m2dx](https://www.npmjs.com/package/astro-m2dx), which bundles all features from the different `@astro-m2dx` plugins in one plugin (all features are opt-in).

remark plugin to support per-directory default layouts for Astro markdown-pages. This plugin is deprecated, please use the plugin [`remark-astro-frontmatter`](https://www.npmjs.com/package/@astro-m2dx/remark-astro-frontmatter) instead.

[Astro M²DX](https://astro-m2dx.netlify.app) is a set of plugins allowing you to define an [Astro](https://astro.build) 🚀 publishing pipeline for Markdown/MDX documents with full [MDX](https://mdxjs.com) features, but without the technical fuss, i.e. you and your non-tech editors can write **clean** markdown.

Have a look at the other [`astro-m2dx` plugins](https://www.npmjs.com/org/astro-m2dx).

## Content <!-- omit in toc -->

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin to add support for automatic layout insertion to markdown-pages in the context of [Astro](https://docs.astro.build/en/guides/integrations-guide/mdx/#remarkplugins) site generation.

In Astro you usually define the layout for markdown pages (.md and .mdx) with the frontmatter property `layout`, which inserts the generated HTML content into that layout's default slot. With this plugin you can define this per directory.

## When should I use this?

If you want to use the same layout for all markdown-pages within a directory and its subdirectories and want to keep your markdown files and their frontmatter as clean as possible.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install -D @astro-m2dx/remark-astro-auto-layout
```

## Use

In your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import autoLayout from '@astro-m2dx/remark-astro-auto-layout';
// ^^^

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [autoLayout],
    //              ^^^
    extendDefaultPlugins: true,
  },
});
```

This uses the default options, where the name of the default Astro layout file is `_layout.astro`.

> Note the `_` in front of the name, it allows to add astro files to your pages directory, that are _not_ considered pages.

Now create a standard Astro layout file with that name in the directory with your markdown pages; it will be used for all markdown files that do not specify a `layout` property in their frontmatter.

### Options

If you want to use a different name for the layout file, you can specify it in the plugin's `name` option like so:

```js
    remarkPlugins: [[autoLayout, {name: "_blog-design.astro"}]],
```

> Note again the `_` at the start of the filename... Because the file must reside in the pages directory, but we do not want it to be generated as page, we must use a name starting with underscore.
