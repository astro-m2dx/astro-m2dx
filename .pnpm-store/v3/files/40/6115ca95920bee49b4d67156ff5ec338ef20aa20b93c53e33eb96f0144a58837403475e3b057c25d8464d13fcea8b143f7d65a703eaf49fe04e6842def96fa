import { nodeTypes } from "@mdx-js/mdx";
import { parse } from "acorn";
import matter from "gray-matter";
import { bold, yellow } from "kleur/colors";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import { remarkInitializeAstroData } from "./astro-data-utils.js";
import rehypeCollectHeadings from "./rehype-collect-headings.js";
import remarkPrism from "./remark-prism.js";
import remarkShiki from "./remark-shiki.js";
function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
const DEFAULT_REMARK_PLUGINS = [remarkGfm, remarkSmartypants];
const DEFAULT_REHYPE_PLUGINS = [];
function getFileInfo(id, config) {
  const sitePathname = appendForwardSlash(
    config.site ? new URL(config.base, config.site).pathname : config.base
  );
  let url = void 0;
  try {
    url = new URL(`file://${id}`);
  } catch {
  }
  const fileId = id.split("?")[0];
  let fileUrl;
  const isPage = fileId.includes("/pages/");
  if (isPage) {
    fileUrl = fileId.replace(/^.*?\/pages\//, sitePathname).replace(/(\/index)?\.mdx$/, "");
  } else if (url && url.pathname.startsWith(config.root.pathname)) {
    fileUrl = url.pathname.slice(config.root.pathname.length);
  } else {
    fileUrl = fileId;
  }
  if (fileUrl && config.trailingSlash === "always") {
    fileUrl = appendForwardSlash(fileUrl);
  }
  return { fileId, fileUrl };
}
function parseFrontmatter(code, id) {
  try {
    return matter(code);
  } catch (e) {
    if (e.name === "YAMLException") {
      const err = e;
      err.id = id;
      err.loc = { file: e.id, line: e.mark.line + 1, column: e.mark.column };
      err.message = e.reason;
      throw err;
    } else {
      throw e;
    }
  }
}
function jsToTreeNode(jsString, acornOpts = {
  ecmaVersion: "latest",
  sourceType: "module"
}) {
  return {
    type: "mdxjsEsm",
    value: "",
    data: {
      estree: {
        body: [],
        ...parse(jsString, acornOpts),
        type: "Program",
        sourceType: "module"
      }
    }
  };
}
async function getRemarkPlugins(mdxOptions, config) {
  let remarkPlugins = [
    remarkInitializeAstroData
  ];
  switch (mdxOptions.extendPlugins) {
    case false:
      break;
    case "astroDefaults":
      remarkPlugins = [...remarkPlugins, ...DEFAULT_REMARK_PLUGINS];
      break;
    default:
      remarkPlugins = [
        ...remarkPlugins,
        ...markdownShouldExtendDefaultPlugins(config) ? DEFAULT_REMARK_PLUGINS : [],
        ...ignoreStringPlugins(config.markdown.remarkPlugins ?? [])
      ];
      break;
  }
  if (config.markdown.syntaxHighlight === "shiki") {
    remarkPlugins.push([await remarkShiki(config.markdown.shikiConfig)]);
  }
  if (config.markdown.syntaxHighlight === "prism") {
    remarkPlugins.push(remarkPrism);
  }
  remarkPlugins = [...remarkPlugins, ...mdxOptions.remarkPlugins ?? []];
  return remarkPlugins;
}
function getRehypePlugins(mdxOptions, config) {
  let rehypePlugins = [
    rehypeCollectHeadings,
    [rehypeRaw, { passThrough: nodeTypes }]
  ];
  switch (mdxOptions.extendPlugins) {
    case false:
      break;
    case "astroDefaults":
      rehypePlugins = [...rehypePlugins, ...DEFAULT_REHYPE_PLUGINS];
      break;
    default:
      rehypePlugins = [
        ...rehypePlugins,
        ...markdownShouldExtendDefaultPlugins(config) ? DEFAULT_REHYPE_PLUGINS : [],
        ...ignoreStringPlugins(config.markdown.rehypePlugins ?? [])
      ];
      break;
  }
  rehypePlugins = [...rehypePlugins, ...mdxOptions.rehypePlugins ?? []];
  return rehypePlugins;
}
function markdownShouldExtendDefaultPlugins(config) {
  return config.markdown.extendDefaultPlugins || config.markdown.remarkPlugins.length === 0 && config.markdown.rehypePlugins.length === 0;
}
function ignoreStringPlugins(plugins) {
  let validPlugins = [];
  let hasInvalidPlugin = false;
  for (const plugin of plugins) {
    if (typeof plugin === "string") {
      console.warn(yellow(`[MDX] ${bold(plugin)} not applied.`));
      hasInvalidPlugin = true;
    } else if (Array.isArray(plugin) && typeof plugin[0] === "string") {
      console.warn(yellow(`[MDX] ${bold(plugin[0])} not applied.`));
      hasInvalidPlugin = true;
    } else {
      validPlugins.push(plugin);
    }
  }
  if (hasInvalidPlugin) {
    console.warn(
      `To inherit Markdown plugins in MDX, please use explicit imports in your config instead of "strings." See Markdown docs: https://docs.astro.build/en/guides/markdown-content/#markdown-plugins`
    );
  }
  return validPlugins;
}
function handleExtendsNotSupported(pluginConfig) {
  if (typeof pluginConfig === "object" && pluginConfig !== null && pluginConfig.hasOwnProperty("extends")) {
    throw new Error(
      `[MDX] The "extends" plugin option is no longer supported! Astro now extends your project's \`markdown\` plugin configuration by default. To customize this behavior, see the \`extendPlugins\` option instead: https://docs.astro.build/en/guides/integrations-guide/mdx/#extendplugins`
    );
  }
}
export {
  getFileInfo,
  getRehypePlugins,
  getRemarkPlugins,
  handleExtendsNotSupported,
  jsToTreeNode,
  parseFrontmatter
};
