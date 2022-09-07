import glob from "fast-glob";
import fs from "fs";
import { bgGreen, bgMagenta, black, dim } from "kleur/colors";
import { fileURLToPath } from "url";
import * as vite from "vite";
import { createBuildInternals } from "../../core/build/internal.js";
import { prependForwardSlash } from "../../core/path.js";
import { emptyDir, isModeServerWithNoAdapter, removeDir } from "../../core/util.js";
import { runHookBuildSetup } from "../../integrations/index.js";
import { PAGE_SCRIPT_ID } from "../../vite-plugin-scripts/index.js";
import { info } from "../logger/core.js";
import { generatePages } from "./generate.js";
import { trackPageData } from "./internal.js";
import { getTimeStat } from "./util.js";
import { vitePluginAnalyzer } from "./vite-plugin-analyzer.js";
import { rollupPluginAstroBuildCSS } from "./vite-plugin-css.js";
import { vitePluginHoistedScripts } from "./vite-plugin-hoisted-scripts.js";
import { vitePluginInternals } from "./vite-plugin-internals.js";
import { vitePluginPages } from "./vite-plugin-pages.js";
import { injectManifest, vitePluginSSR } from "./vite-plugin-ssr.js";
async function staticBuild(opts) {
  const { allPages, astroConfig } = opts;
  if (isModeServerWithNoAdapter(opts.astroConfig)) {
    throw new Error(`Cannot use \`output: 'server'\` without an adapter.
Install and configure the appropriate server adapter for your final deployment.
Learn more: https://docs.astro.build/en/guides/server-side-rendering/

  // Example: astro.config.js
  import netlify from '@astrojs/netlify';
  export default {
    output: 'server',
    adapter: netlify(),
  }
`);
  }
  const pageInput = /* @__PURE__ */ new Set();
  const facadeIdToPageDataMap = /* @__PURE__ */ new Map();
  const internals = createBuildInternals();
  const timer = {};
  timer.buildStart = performance.now();
  for (const [component, pageData] of Object.entries(allPages)) {
    const astroModuleURL = new URL("./" + component, astroConfig.root);
    const astroModuleId = prependForwardSlash(component);
    trackPageData(internals, component, pageData, astroModuleId, astroModuleURL);
    pageInput.add(astroModuleId);
    facadeIdToPageDataMap.set(fileURLToPath(astroModuleURL), pageData);
  }
  emptyDir(astroConfig.outDir, new Set(".git"));
  timer.ssr = performance.now();
  info(opts.logging, "build", `Building ${astroConfig.output} entrypoints...`);
  await ssrBuild(opts, internals, pageInput);
  info(opts.logging, "build", dim(`Completed in ${getTimeStat(timer.ssr, performance.now())}.`));
  const rendererClientEntrypoints = opts.astroConfig._ctx.renderers.map((r) => r.clientEntrypoint).filter((a) => typeof a === "string");
  const clientInput = /* @__PURE__ */ new Set([
    ...internals.discoveredHydratedComponents,
    ...internals.discoveredClientOnlyComponents,
    ...rendererClientEntrypoints,
    ...internals.discoveredScripts
  ]);
  if (astroConfig._ctx.scripts.some((script) => script.stage === "page")) {
    clientInput.add(PAGE_SCRIPT_ID);
  }
  timer.clientBuild = performance.now();
  await clientBuild(opts, internals, clientInput);
  timer.generate = performance.now();
  if (astroConfig.output === "static") {
    await generatePages(opts, internals);
    await cleanSsrOutput(opts);
  } else {
    await injectManifest(opts, internals);
    info(opts.logging, null, `
${bgMagenta(black(" finalizing server assets "))}
`);
    await ssrMoveAssets(opts);
  }
}
async function ssrBuild(opts, internals, input) {
  var _a, _b, _c;
  const { astroConfig, viteConfig } = opts;
  const ssr = astroConfig.output === "server";
  const out = ssr ? opts.buildConfig.server : astroConfig.outDir;
  const viteBuildConfig = {
    ...viteConfig,
    logLevel: opts.viteConfig.logLevel ?? "error",
    mode: "production",
    build: {
      ...viteConfig.build,
      emptyOutDir: false,
      manifest: false,
      outDir: fileURLToPath(out),
      rollupOptions: {
        ...(_a = viteConfig.build) == null ? void 0 : _a.rollupOptions,
        input: [],
        output: {
          format: "esm",
          chunkFileNames: "chunks/[name].[hash].mjs",
          assetFileNames: "assets/[name].[hash][extname]",
          ...(_c = (_b = viteConfig.build) == null ? void 0 : _b.rollupOptions) == null ? void 0 : _c.output,
          entryFileNames: opts.buildConfig.serverEntry
        }
      },
      ssr: true,
      target: "esnext",
      minify: false,
      polyfillModulePreload: false,
      reportCompressedSize: false
    },
    plugins: [
      vitePluginInternals(input, internals),
      vitePluginPages(opts, internals),
      rollupPluginAstroBuildCSS({
        buildOptions: opts,
        internals,
        target: "server",
        astroConfig
      }),
      ...viteConfig.plugins || [],
      opts.astroConfig.output === "server" && vitePluginSSR(internals, opts.astroConfig._ctx.adapter),
      vitePluginAnalyzer(internals)
    ],
    publicDir: ssr ? false : viteConfig.publicDir,
    envPrefix: "PUBLIC_",
    base: astroConfig.base
  };
  await runHookBuildSetup({
    config: astroConfig,
    pages: internals.pagesByComponent,
    vite: viteBuildConfig,
    target: "server",
    logging: opts.logging
  });
  return await vite.build(viteBuildConfig);
}
async function clientBuild(opts, internals, input) {
  var _a, _b, _c;
  const { astroConfig, viteConfig } = opts;
  const timer = performance.now();
  const ssr = astroConfig.output === "server";
  const out = ssr ? opts.buildConfig.client : astroConfig.outDir;
  if (!input.size) {
    if (ssr) {
      await copyFiles(astroConfig.publicDir, out);
    }
    return null;
  }
  info(opts.logging, null, `
${bgGreen(black(" building client "))}`);
  const viteBuildConfig = {
    ...viteConfig,
    logLevel: "info",
    mode: "production",
    build: {
      ...viteConfig.build,
      emptyOutDir: false,
      minify: "esbuild",
      outDir: fileURLToPath(out),
      rollupOptions: {
        ...(_a = viteConfig.build) == null ? void 0 : _a.rollupOptions,
        input: Array.from(input),
        output: {
          format: "esm",
          entryFileNames: "[name].[hash].js",
          chunkFileNames: "chunks/[name].[hash].js",
          assetFileNames: "assets/[name].[hash][extname]",
          ...(_c = (_b = viteConfig.build) == null ? void 0 : _b.rollupOptions) == null ? void 0 : _c.output
        },
        preserveEntrySignatures: "exports-only"
      },
      target: "esnext"
    },
    plugins: [
      vitePluginInternals(input, internals),
      vitePluginHoistedScripts(astroConfig, internals),
      rollupPluginAstroBuildCSS({
        buildOptions: opts,
        internals,
        target: "client",
        astroConfig
      }),
      ...viteConfig.plugins || []
    ],
    envPrefix: "PUBLIC_",
    base: astroConfig.base
  };
  await runHookBuildSetup({
    config: astroConfig,
    pages: internals.pagesByComponent,
    vite: viteBuildConfig,
    target: "client",
    logging: opts.logging
  });
  const buildResult = await vite.build(viteBuildConfig);
  info(opts.logging, null, dim(`Completed in ${getTimeStat(timer, performance.now())}.
`));
  return buildResult;
}
async function cleanSsrOutput(opts) {
  const files = await glob("**/*.mjs", {
    cwd: fileURLToPath(opts.astroConfig.outDir)
  });
  await Promise.all(
    files.map(async (filename) => {
      const url = new URL(filename, opts.astroConfig.outDir);
      await fs.promises.rm(url);
    })
  );
}
async function copyFiles(fromFolder, toFolder) {
  const files = await glob("**/*", {
    cwd: fileURLToPath(fromFolder)
  });
  await Promise.all(
    files.map(async (filename) => {
      const from = new URL(filename, fromFolder);
      const to = new URL(filename, toFolder);
      const lastFolder = new URL("./", to);
      return fs.promises.mkdir(lastFolder, { recursive: true }).then(() => fs.promises.copyFile(from, to));
    })
  );
}
async function ssrMoveAssets(opts) {
  info(opts.logging, "build", "Rearranging server assets...");
  const serverRoot = opts.astroConfig.output === "static" ? opts.buildConfig.client : opts.buildConfig.server;
  const clientRoot = opts.buildConfig.client;
  const serverAssets = new URL("./assets/", serverRoot);
  const clientAssets = new URL("./assets/", clientRoot);
  const files = await glob("assets/**/*", {
    cwd: fileURLToPath(serverRoot)
  });
  await fs.promises.mkdir(clientAssets, { recursive: true });
  await Promise.all(
    files.map(async (filename) => {
      const currentUrl = new URL(filename, serverRoot);
      const clientUrl = new URL(filename, clientRoot);
      return fs.promises.rename(currentUrl, clientUrl);
    })
  );
  removeDir(serverAssets);
}
export {
  staticBuild
};
