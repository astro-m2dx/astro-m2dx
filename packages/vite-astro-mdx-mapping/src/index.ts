import { findUp } from '@astro-m2dx/common';
import { dirname, join } from 'path';
import { Plugin } from 'unified';

const DEFAULT_NAME = '_mdx-mapping.ts';
const EXISTING_EXPORT = /export\s+const\s+components\s+=\s+{/;

/**
 * Structured options for plugin remark-astro-auto-layout
 *
 * Use in astro.config.mjs like
 *
 * ```
 * markdown: {
 *     remarkPlugins: [[mdxMapping, {name: "_map-this.ts"}]],
 *     ...
 */
export interface Options {
  /**
   * Name of Astro layout files to detect in the directory of the MDX-page.
   *
   * The default is '_mdx-mapping.ts'
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

  const stop = join(process.cwd(), 'src');
  function findMappingFile(dir: string) {
    let found: string | undefined = cache[dir];
    if (!found) {
      found = findUp(name, dir, stop);
      if (found) {
        cache[dir] = found;
      }
    }
    return found;
  }

  return {
    name: 'vite-astro-mdx-mapping',
    enforce: 'post',

    async transform(src: string, id: string) {
      if (id.endsWith('.mdx')) {
        const mapping = findMappingFile(dirname(id));
        if (mapping) {
          const found = src.match(EXISTING_EXPORT);
          if (!found) {
            return `
export { components } from '${mapping}';
${src}`;
          } else {
            const start = found.index!;
            const length = found[0].length;
            return `
${src.slice(0, start)}
import { components as _injected_components } from '${mapping}';
export const components = {
  ..._injected_components,${src.slice(start + length)}`;
          }
        }
      }
      return undefined;
    },
  };
};

export default plugin;
