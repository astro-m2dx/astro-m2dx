import { findUp, VFile } from '@astro-m2dx/common';
import { join } from 'path';
import { Plugin } from 'unified';

const DEFAULT_NAME = '_layout.astro';
/**
 * Structured options for plugin remark-astro-auto-layout
 *
 * Use in astro.config.mjs like
 *
 * ```
 * markdown: {
 *     remarkPlugins: [[autoLayout, {name: "foo.astro"}]],
 *     ...
 */
export interface Options {
  /**
   * Name of Astro layout files to detect in the directory of the MDX-page.
   *
   * The default is '_layout.astro'
   */
  name: string;
}

/**
 * Plugin
 * @param options optional `name` property for the layout file
 * @returns transformer function, that operates only on VFile level
 */
export const plugin: Plugin<[Partial<Options>], unknown> = (options = {}) => {
  const { name = DEFAULT_NAME } = options;
  const cache: Record<string, string> = {};

  async function findLayoutFile(dir: string, stop: string) {
    let found: string | undefined = cache[dir];
    if (!found) {
      found = await findUp(name, dir, stop);
      if (found) {
        cache[dir] = found;
      }
    }
    return found;
  }

  return async function transformer(_: unknown, file: VFile) {
    const dir = file.dirname ?? '';
    const stop = join(file.cwd, 'src', 'pages');
    const layoutFile = await findLayoutFile(dir, stop);
    if (layoutFile) {
      file.data.astro.frontmatter.layout = layoutFile;
    }
  };
};

export default plugin;
