import { VFile } from '@astro-m2dx/common';
import { Plugin } from 'unified';

const DEFAULT_PROPERTY = 'mdx';
/**
 * Structured options for plugin remark-astro-raw-mdx
 *
 * Use in astro.config.mjs like
 *
 * ```
 * markdown: {
 *     remarkPlugins: [[rawMdx, {property: "raw"}]],
 *     ...
 */
export interface Options {
    /**
     * Name of Astro layout files to detect in the directory of the MDX-page.
     *
     * The default is '_layout.astro'
     */
    property: string;
}

/**
 * Plugin
 * @param options optional `name` property for the layout file
 * @returns transformer function, that operates only on VFile level
 */
export const plugin: Plugin<[Partial<Options>], unknown> = (options = {}) => {
    const { property = DEFAULT_PROPERTY } = options;

    return function transformer(_: unknown, file: VFile) {
        file.data.astro.frontmatter[property] = file.value;
    };
};

export default plugin;
