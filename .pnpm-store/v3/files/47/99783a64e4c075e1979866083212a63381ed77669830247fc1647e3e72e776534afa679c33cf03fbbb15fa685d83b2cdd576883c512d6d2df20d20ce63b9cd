import fs from "fs";
import { fileURLToPath } from "url";
import * as vite from "vite";
import astroPostprocessVitePlugin from "../vite-plugin-astro-postprocess/index.js";
import astroViteServerPlugin from "../vite-plugin-astro-server/index.js";
import astroVitePlugin from "../vite-plugin-astro/index.js";
import configAliasVitePlugin from "../vite-plugin-config-alias/index.js";
import envVitePlugin from "../vite-plugin-env/index.js";
import htmlVitePlugin from "../vite-plugin-html/index.js";
import astroIntegrationsContainerPlugin from "../vite-plugin-integrations-container/index.js";
import jsxVitePlugin from "../vite-plugin-jsx/index.js";
import legacyMarkdownVitePlugin from "../vite-plugin-markdown-legacy/index.js";
import markdownVitePlugin from "../vite-plugin-markdown/index.js";
import astroScriptsPlugin from "../vite-plugin-scripts/index.js";
import astroScriptsPageSSRPlugin from "../vite-plugin-scripts/page-ssr.js";
import { createCustomViteLogger } from "./errors.js";
import { resolveDependency } from "./util.js";
const ALWAYS_NOEXTERNAL = /* @__PURE__ */ new Set([
  "astro",
  "astro/components",
  "@nanostores/preact",
  "@fontsource/*"
]);
function getSsrNoExternalDeps(projectRoot) {
  let noExternalDeps = [];
  for (const dep of ALWAYS_NOEXTERNAL) {
    try {
      resolveDependency(dep, projectRoot);
      noExternalDeps.push(dep);
    } catch {
    }
  }
  return noExternalDeps;
}
async function createVite(commandConfig, { astroConfig, logging, mode }) {
  const thirdPartyAstroPackages = await getAstroPackages(astroConfig);
  const commonConfig = {
    cacheDir: fileURLToPath(new URL("./node_modules/.vite/", astroConfig.root)),
    clearScreen: false,
    logLevel: "warn",
    appType: "custom",
    optimizeDeps: {
      entries: ["src/**/*"],
      exclude: ["node-fetch"]
    },
    plugins: [
      configAliasVitePlugin({ config: astroConfig }),
      astroVitePlugin({ config: astroConfig, logging }),
      astroScriptsPlugin({ config: astroConfig }),
      mode !== "build" && astroViteServerPlugin({ config: astroConfig, logging }),
      envVitePlugin({ config: astroConfig }),
      astroConfig.legacy.astroFlavoredMarkdown ? legacyMarkdownVitePlugin({ config: astroConfig, logging }) : markdownVitePlugin({ config: astroConfig, logging }),
      htmlVitePlugin(),
      jsxVitePlugin({ config: astroConfig, logging }),
      astroPostprocessVitePlugin({ config: astroConfig }),
      astroIntegrationsContainerPlugin({ config: astroConfig, logging }),
      astroScriptsPageSSRPlugin({ config: astroConfig })
    ],
    publicDir: fileURLToPath(astroConfig.publicDir),
    root: fileURLToPath(astroConfig.root),
    envPrefix: "PUBLIC_",
    define: {
      "import.meta.env.SITE": astroConfig.site ? `'${astroConfig.site}'` : "undefined"
    },
    server: {
      hmr: process.env.NODE_ENV === "test" || process.env.NODE_ENV === "production" ? false : void 0,
      proxy: {},
      watch: {
        ignored: mode === "build" ? ["**"] : void 0
      }
    },
    css: {
      postcss: astroConfig.style.postcss || {}
    },
    resolve: {
      alias: [
        {
          find: "randombytes",
          replacement: "randombytes/browser"
        },
        {
          find: /^astro$/,
          replacement: fileURLToPath(new URL("../@types/astro", import.meta.url))
        }
      ],
      conditions: ["astro"]
    },
    ssr: {
      noExternal: [...getSsrNoExternalDeps(astroConfig.root), ...thirdPartyAstroPackages]
    }
  };
  let result = commonConfig;
  result = vite.mergeConfig(result, astroConfig.vite || {});
  result = vite.mergeConfig(result, commandConfig);
  if (result.plugins) {
    sortPlugins(result.plugins);
  }
  result.customLogger = createCustomViteLogger(result.logLevel ?? "warn");
  return result;
}
function isVitePlugin(plugin) {
  return Boolean(plugin == null ? void 0 : plugin.hasOwnProperty("name"));
}
function findPluginIndexByName(pluginOptions, name) {
  return pluginOptions.findIndex(function(pluginOption) {
    return isVitePlugin(pluginOption) && pluginOption.name === name;
  });
}
function sortPlugins(pluginOptions) {
  const mdxPluginIndex = findPluginIndexByName(pluginOptions, "@mdx-js/rollup");
  if (mdxPluginIndex === -1)
    return;
  const jsxPluginIndex = findPluginIndexByName(pluginOptions, "astro:jsx");
  const mdxPlugin = pluginOptions[mdxPluginIndex];
  pluginOptions.splice(mdxPluginIndex, 1);
  pluginOptions.splice(jsxPluginIndex, 0, mdxPlugin);
}
async function getAstroPackages({ root }) {
  const pkgUrl = new URL("./package.json", root);
  const pkgPath = fileURLToPath(pkgUrl);
  if (!fs.existsSync(pkgPath))
    return [];
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const deps = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})];
  return deps.filter((dep) => {
    if (isCommonNotAstro(dep))
      return false;
    if (/^astro\-/.test(dep))
      return true;
    const depPkgUrl = new URL(`./node_modules/${dep}/package.json`, root);
    const depPkgPath = fileURLToPath(depPkgUrl);
    if (!fs.existsSync(depPkgPath))
      return false;
    const {
      dependencies = {},
      peerDependencies = {},
      keywords = []
    } = JSON.parse(fs.readFileSync(depPkgPath, "utf-8"));
    if (peerDependencies.astro || dependencies.astro)
      return true;
    if (keywords.includes("astro") || keywords.includes("astro-component"))
      return true;
    return false;
  });
}
const COMMON_DEPENDENCIES_NOT_ASTRO = [
  "autoprefixer",
  "react",
  "react-dom",
  "preact",
  "preact-render-to-string",
  "vue",
  "svelte",
  "solid-js",
  "lit",
  "cookie",
  "dotenv",
  "esbuild",
  "eslint",
  "jest",
  "postcss",
  "prettier",
  "astro",
  "tslib",
  "typescript",
  "vite"
];
const COMMON_PREFIXES_NOT_ASTRO = [
  "@webcomponents/",
  "@fontsource/",
  "@postcss-plugins/",
  "@rollup/",
  "@astrojs/renderer-",
  "@types/",
  "@typescript-eslint/",
  "eslint-",
  "jest-",
  "postcss-plugin-",
  "prettier-plugin-",
  "remark-",
  "rehype-",
  "rollup-plugin-",
  "vite-plugin-"
];
function isCommonNotAstro(dep) {
  return COMMON_DEPENDENCIES_NOT_ASTRO.includes(dep) || COMMON_PREFIXES_NOT_ASTRO.some(
    (prefix) => prefix.startsWith("@") ? dep.startsWith(prefix) : dep.substring(dep.lastIndexOf("/") + 1).startsWith(prefix)
  );
}
export {
  createVite
};
