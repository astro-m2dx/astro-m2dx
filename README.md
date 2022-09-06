# Astro M²DX - Magic MDX in Astro

This project provides an example of how magic the use of [MDX](https://mdxjs.com) in [Astro](https://astro.build) can be, to create beautiful and function-rich web sites, even for non-tech editors.

The goal is, to provide content-editors with the ability to write almost clean markdown, with only a few sprinkles of JSX and without overloading the frontmatter.

## The web site

The source for the web site can be found in `apps/web`. It tries to be a good example how MDX can be used in combination with some Astro components to create a web site.

## The plugins

The plugins can be found in `packages/*` and will be published to [NPM](https://www.npmjs.com/org/astro-m2dx)

The following plugins are planned:

- **remark-astro-auto-layout** - lets users define a default layout for all MDX-pages in a directory and its subdirectories.
- **remark-astro-auto-import** - lets users define a set of components that can be used in MDX-files without explicitly being imported.
