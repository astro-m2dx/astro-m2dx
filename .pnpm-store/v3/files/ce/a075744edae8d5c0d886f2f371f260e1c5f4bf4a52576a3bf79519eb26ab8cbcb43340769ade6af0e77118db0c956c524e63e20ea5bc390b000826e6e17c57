import { fileURLToPath } from "url";
import { PAGE_SCRIPT_ID } from "../../../vite-plugin-scripts/index.js";
import { isPage, resolveIdToUrl } from "../../util.js";
import { render as coreRender } from "../core.js";
import { collectMdMetadata } from "../util.js";
import { getStylesForURL } from "./css.js";
import { resolveClientDevPath } from "./resolve.js";
import { getScriptsForURL } from "./scripts.js";
const svelteStylesRE = /svelte\?svelte&type=style/;
async function loadRenderer(viteServer, renderer) {
  const mod = await viteServer.ssrLoadModule(renderer.serverEntrypoint);
  return { ...renderer, ssr: mod.default };
}
async function loadRenderers(viteServer, astroConfig) {
  return Promise.all(astroConfig._ctx.renderers.map((r) => loadRenderer(viteServer, r)));
}
async function preload({
  astroConfig,
  filePath,
  viteServer
}) {
  const renderers = await loadRenderers(viteServer, astroConfig);
  const mod = await viteServer.ssrLoadModule(fileURLToPath(filePath));
  if (viteServer.config.mode === "development" || !(mod == null ? void 0 : mod.$$metadata)) {
    return [renderers, mod];
  }
  const modGraph = await viteServer.moduleGraph.getModuleByUrl(fileURLToPath(filePath));
  if (modGraph) {
    await collectMdMetadata(mod.$$metadata, modGraph, viteServer);
  }
  return [renderers, mod];
}
async function render(renderers, mod, ssrOpts) {
  var _a;
  const {
    astroConfig,
    filePath,
    logging,
    mode,
    origin,
    pathname,
    request,
    route,
    routeCache,
    viteServer
  } = ssrOpts;
  const scripts = await getScriptsForURL(filePath, astroConfig, viteServer);
  if (isPage(filePath, astroConfig) && mode === "development") {
    scripts.add({
      props: { type: "module", src: "/@vite/client" },
      children: ""
    });
    scripts.add({
      props: {
        type: "module",
        src: await resolveIdToUrl(viteServer, "astro/runtime/client/hmr.js")
      },
      children: ""
    });
  }
  for (const script of astroConfig._ctx.scripts) {
    if (script.stage === "head-inline") {
      scripts.add({
        props: {},
        children: script.content
      });
    } else if (script.stage === "page" && isPage(filePath, astroConfig)) {
      scripts.add({
        props: { type: "module", src: `/@id/${PAGE_SCRIPT_ID}` },
        children: ""
      });
    }
  }
  const { urls: styleUrls, stylesMap } = await getStylesForURL(filePath, viteServer, mode);
  let links = /* @__PURE__ */ new Set();
  [...styleUrls].forEach((href) => {
    links.add({
      props: {
        rel: "stylesheet",
        href
      },
      children: ""
    });
  });
  let styles = /* @__PURE__ */ new Set();
  [...stylesMap].forEach(([url, content]) => {
    scripts.add({
      props: {
        type: "module",
        src: url
      },
      children: ""
    });
    styles.add({
      props: {},
      children: content
    });
  });
  let response = await coreRender({
    adapterName: (_a = astroConfig.adapter) == null ? void 0 : _a.name,
    links,
    styles,
    logging,
    markdown: {
      ...astroConfig.markdown,
      isAstroFlavoredMd: astroConfig.legacy.astroFlavoredMarkdown
    },
    mod,
    mode,
    origin,
    pathname,
    scripts,
    async resolve(s) {
      if (s.startsWith("/@fs")) {
        return resolveClientDevPath(s);
      }
      return await resolveIdToUrl(viteServer, s);
    },
    renderers,
    request,
    route,
    routeCache,
    site: astroConfig.site ? new URL(astroConfig.base, astroConfig.site).toString() : void 0,
    ssr: astroConfig.output === "server",
    streaming: true
  });
  return response;
}
async function ssr(preloadedComponent, ssrOpts) {
  const [renderers, mod] = preloadedComponent;
  return await render(renderers, mod, ssrOpts);
}
export {
  loadRenderers,
  preload,
  render,
  ssr
};
