# Astro M²DX - Remark plugin for auto-import

remark plugin to define default JSX component imports for all MDX files in a directory.

[Astro M²DX](https://astro-m2dx.netlify.app) is a set of plugins allowing you to define an [Astro](https://astro.build) 🚀 publishing pipeline for Markdown/MDX documents with full [MDX](https://mdxjs.com) features, but without the technical fuss, i.e. you and your non-tech editors can write **clean** markdown.

Have a look at the other [`astro-m2dx` plugins](https://www.npmjs.com/org/astro-m2dx).

## Content <!-- omit in toc -->

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin for markdown files in the context of [Astro](https://docs.astro.build/en/guides/integrations-guide/mdx) site generation, that allows you to define a set of JSX components that can be used in all MDX files without explicitly importing them.

## When should I use this?

In Astro you usually have to import components (Astro, jsx, ...) that you want to use in your MDX file within the file. With this plugin you can define a set of "known" components, that can be used in all MDX files in that directory and subdirectory without the need to explicitly import them.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with `npm`:

```sh
npm install -D @astro-m2dx/remark-astro-auto-import
```

## Use

In your `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import autoLayout from '@astro-m2dx/remark-astro-auto-import';
// ^^^

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [autoImport],
    //              ^^^
    extendDefaultPlugins: true,
  },
});
```

This uses the default options, where the name of the auto-import file is `_auto-import.ts`.

Now create an auto-import file with a default export for all known components:

```js
import { Code } from 'astro/components';

const imports = {
  Code,
};

export default imports;
```

The default export must be a map/object of components and their JSX name.

### Options

If you want to use a different name for the auto-import file, you can specify it in the plugin's `name` option like so:

```js
    remarkPlugins: [[autoImport, {name: "_my-imports.ts"}]],
```
