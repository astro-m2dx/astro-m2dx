import { Plugin } from 'unified';
import { Root } from 'mdast';
import { VFile, findClosest } from '@astro-m2dx/common';
import { join } from 'path';

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

const plugin: Plugin<[Partial<Options>], Root> = (options = {}) => {
    const { name = '_layout.astro' } = options;
    return (_, file) => {
        const dir = file.dirname ?? '';
        const stop = join(file.cwd, 'src', 'pages');
        const layoutFile = findClosest(name, dir, stop);
        if (layoutFile) {
            (file as VFile).data.astro.frontmatter.layout = layoutFile;
        }
    };
};

export default plugin;
