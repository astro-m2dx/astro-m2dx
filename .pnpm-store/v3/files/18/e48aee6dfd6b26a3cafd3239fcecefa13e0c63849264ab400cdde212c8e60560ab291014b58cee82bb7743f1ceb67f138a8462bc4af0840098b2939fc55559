import type { PluggableList } from '@mdx-js/mdx/lib/core.js';
import type { Options as MdxRollupPluginOptions } from '@mdx-js/rollup';
import type { Options as AcornOpts } from 'acorn';
import type { AstroConfig } from 'astro';
import matter from 'gray-matter';
import type { MdxjsEsm } from 'mdast-util-mdx';
export declare type MdxOptions = {
    remarkPlugins?: PluggableList;
    rehypePlugins?: PluggableList;
    /**
     * Choose which remark and rehype plugins to inherit, if any.
     *
     * - "markdown" (default) - inherit your project’s markdown plugin config ([see Markdown docs](https://docs.astro.build/en/guides/markdown-content/#configuring-markdown))
     * - "astroDefaults" - inherit Astro’s default plugins only ([see defaults](https://docs.astro.build/en/reference/configuration-reference/#markdownextenddefaultplugins))
     * - false - do not inherit any plugins
     */
    extendPlugins?: 'markdown' | 'astroDefaults' | false;
};
interface FileInfo {
    fileId: string;
    fileUrl: string;
}
/** @see 'vite-plugin-utils' for source */
export declare function getFileInfo(id: string, config: AstroConfig): FileInfo;
/**
 * Match YAML exception handling from Astro core errors
 * @see 'astro/src/core/errors.ts'
 */
export declare function parseFrontmatter(code: string, id: string): matter.GrayMatterFile<string>;
export declare function jsToTreeNode(jsString: string, acornOpts?: AcornOpts): MdxjsEsm;
export declare function getRemarkPlugins(mdxOptions: MdxOptions, config: AstroConfig): Promise<MdxRollupPluginOptions['remarkPlugins']>;
export declare function getRehypePlugins(mdxOptions: MdxOptions, config: AstroConfig): MdxRollupPluginOptions['rehypePlugins'];
export declare function handleExtendsNotSupported(pluginConfig: any): void;
export {};
