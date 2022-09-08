# Astro M²DX - Remark plugin for auto-import

[`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin to support per-directory default component imports for [Astro](https://docs.astro.build/en/guides/integrations-guide/mdx/#remarkplugins) markdown-files.

## Content <!-- omit in toc -->

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
  - [Options](#options)

## What is this?

This package is a [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) plugin to add support for automatic import insertion to markdown-files in the context of [Astro](https://docs.astro.build/en/guides/integrations-guide/mdx/#remarkplugins) site generation.

In Astro you usually have to import components (Astro, jsx, ...) that you want to use in your MDX file within the file. With this plugin you can define a set of "known" components, than can be used in all MDX files in that directory and subdirectory without the need to explicitly import them.

## When should I use this?

If you want to use a known set of components in your MDX files and want to keep your markdown files and their frontmatter as clean as possible.

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

This uses the default options, where the name of the auto-import file `_auto-import.ts`.

Now create a auto-import file with a default export for all known components:

```js
import { Code } from 'astro/components';

const imports = {
  Code,
};

export default imports;
```

### Options

If you want to use a different name for the auto-import file, you can specify it in the plugin's `name` option like so:

```js
    remarkPlugins: [[autoImport, {name: "_my-imports.ts"}]],
```
