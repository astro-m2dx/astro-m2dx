# Astro M²DX - Remark plugin to inject raw MDX into frontmatter

[`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin to add the raw markdown content to the frontmatter of your [Astro](https://docs.astro.build/en/guides/integrations-guide/mdx/#remarkplugins) MDX-files.

## Content <!-- omit in toc -->

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin to add the raw markdown content to the frontmatter of your MDX files in the context of [Astro](https://docs.astro.build/en/guides/integrations-guide/mdx/#remarkplugins) site generation.

In Astro MDX files do not carry the raw MDX content anymore, once you import them. With this plugin you can access the raw content in the frontmatter `mdx` property.

## When should I use this?

If you want to have access to the raw MDX content while generating your pages.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install -D @astro-m2dx/remark-astro-raw-mdx
```

## Use

In your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import rawMdx from '@astro-m2dx/remark-astro-raw-mdx';
// ^^^

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [rawMdx],
    //              ^^^
    extendDefaultPlugins: true,
  },
});
```

This uses the default options, where the name of the property on the frontmatter is `mdx`.

### Options

If you want to use a different name for the property, you can specify it in the plugin's `name` option like so:

```js
    remarkPlugins: [[rawMdx, {property: "raw"}]],
```
