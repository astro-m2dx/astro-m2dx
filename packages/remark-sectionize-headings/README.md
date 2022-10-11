# Astro M²DX - Remark plugin to wrap headings in sections

> **DEPRECATED:** Please consider using the plugin [astro-m2dx](https://www.npmjs.com/package/astro-m2dx), which bundles all features from the different `@astro-m2dx` plugins in one plugin (all features are opt-in).

remark plugin to wrap markdown headings and the following paragraphs in HTML sections.

An alternative could be [remark-sectionize](https://www.npmjs.com/package/remark-sectionize), but this plugin offers a few more options and adds a CSS class according to the heading level to the resulting section.

[Astro M²DX](https://astro-m2dx.netlify.app) is a set of plugins allowing you to define an [Astro](https://astro.build) 🚀 publishing pipeline for Markdown/MDX documents with full [MDX](https://mdxjs.com) features, but without the technical fuss, i.e. you and your non-tech editors can write **clean** markdown.

Have a look at the other [`astro-m2dx` plugins](https://www.npmjs.com/org/astro-m2dx).

## Content <!-- omit in toc -->

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin to wrap markdown headings and the following paragraphs in HTML sections. It does not make any assumptions on the use of Astro.

## When should I use this?

If you want to style sections of your document according to heading levels.

This is a pure remark plugin and can be used easily outside of an Astro context.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install -D @astro-m2dx/remark-sectionize-headings
```

## Use

In your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sectionizeHeadings from '@astro-m2dx/remark-sectionize-headings';
// ^^^

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [sectionizeHeadings],
    //              ^^^
    extendDefaultPlugins: true,
  },
});
```

This uses the default options, where all headings are wrapped according to their level.

### Options

If you want to wrap only headings on particular levels, you can pass the `levels` option (`number[]`) like so:

```js
remarkPlugins: [[sectionizeHeadings, {levels: [2]}]],
```

which would wrap only heading level 2.
