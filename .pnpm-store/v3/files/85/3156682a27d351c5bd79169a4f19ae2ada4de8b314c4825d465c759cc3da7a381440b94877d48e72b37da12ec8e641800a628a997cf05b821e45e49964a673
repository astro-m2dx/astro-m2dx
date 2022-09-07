import { compile as mdxCompile } from "@mdx-js/mdx";
import mdxPlugin from "@mdx-js/rollup";
import { parse as parseESM } from "es-module-lexer";
import { blue, bold } from "kleur/colors";
import { VFile } from "vfile";
import { rehypeApplyFrontmatterExport } from "./astro-data-utils.js";
import {
  getFileInfo,
  getRehypePlugins,
  getRemarkPlugins,
  handleExtendsNotSupported,
  parseFrontmatter
} from "./utils.js";
const RAW_CONTENT_ERROR = "MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins";
const COMPILED_CONTENT_ERROR = "MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins";
function mdx(mdxOptions = {}) {
  return {
    name: "@astrojs/mdx",
    hooks: {
      "astro:config:setup": async ({ updateConfig, config, addPageExtension, command }) => {
        var _a, _b;
        addPageExtension(".mdx");
        mdxOptions.extendPlugins ?? (mdxOptions.extendPlugins = "markdown");
        handleExtendsNotSupported(mdxOptions.remarkPlugins);
        handleExtendsNotSupported(mdxOptions.rehypePlugins);
        if (mdxOptions.extendPlugins === "markdown" && (((_a = config.markdown.rehypePlugins) == null ? void 0 : _a.length) || ((_b = config.markdown.remarkPlugins) == null ? void 0 : _b.length))) {
          console.log(
            blue(`[MDX] Now inheriting remark and rehype plugins from "markdown" config.`)
          );
          console.log(
            `If you applied a plugin to both your Markdown and MDX configs, we suggest ${bold(
              "removing the duplicate MDX entry."
            )}`
          );
          console.log(`See "extendPlugins" option to configure this behavior.`);
        }
        const mdxPluginOpts = {
          remarkPlugins: await getRemarkPlugins(mdxOptions, config),
          rehypePlugins: getRehypePlugins(mdxOptions, config),
          jsx: true,
          jsxImportSource: "astro",
          format: "mdx",
          mdExtensions: []
        };
        updateConfig({
          vite: {
            plugins: [
              {
                enforce: "pre",
                ...mdxPlugin(mdxPluginOpts),
                async transform(code, id) {
                  if (!id.endsWith("mdx"))
                    return;
                  const { data: frontmatter, content: pageContent } = parseFrontmatter(code, id);
                  const compiled = await mdxCompile(new VFile({ value: pageContent, path: id }), {
                    ...mdxPluginOpts,
                    rehypePlugins: [
                      ...mdxPluginOpts.rehypePlugins ?? [],
                      () => rehypeApplyFrontmatterExport(frontmatter)
                    ]
                  });
                  return {
                    code: String(compiled.value),
                    map: compiled.map
                  };
                }
              },
              {
                name: "@astrojs/mdx-postprocess",
                transform(code, id) {
                  if (!id.endsWith(".mdx"))
                    return;
                  code += `
MDXContent[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);`;
                  const [, moduleExports] = parseESM(code);
                  const { fileUrl, fileId } = getFileInfo(id, config);
                  if (!moduleExports.includes("url")) {
                    code += `
export const url = ${JSON.stringify(fileUrl)};`;
                  }
                  if (!moduleExports.includes("file")) {
                    code += `
export const file = ${JSON.stringify(fileId)};`;
                  }
                  if (!moduleExports.includes("rawContent")) {
                    code += `
export function rawContent() { throw new Error(${JSON.stringify(
                      RAW_CONTENT_ERROR
                    )}) };`;
                  }
                  if (!moduleExports.includes("compiledContent")) {
                    code += `
export function compiledContent() { throw new Error(${JSON.stringify(
                      COMPILED_CONTENT_ERROR
                    )}) };`;
                  }
                  if (!moduleExports.includes("Content")) {
                    code += `
export const Content = MDXContent;`;
                  }
                  if (command === "dev") {
                    code += `
if (import.meta.hot) {
											import.meta.hot.decline();
										}`;
                  }
                  return code;
                }
              }
            ]
          }
        });
      }
    }
  };
}
export {
  mdx as default
};
