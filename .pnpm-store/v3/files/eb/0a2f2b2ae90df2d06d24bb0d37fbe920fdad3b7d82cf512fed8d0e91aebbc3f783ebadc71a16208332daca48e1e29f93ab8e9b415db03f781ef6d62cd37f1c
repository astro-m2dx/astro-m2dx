import fs from "fs";
import * as colors from "kleur/colors";
import { bgGreen, black, cyan, dim, green, magenta } from "kleur/colors";
import npath from "path";
import { fileURLToPath } from "url";
import {
  joinPaths,
  prependForwardSlash,
  removeLeadingForwardSlash,
  removeTrailingForwardSlash
} from "../../core/path.js";
import { BEFORE_HYDRATION_SCRIPT_ID, PAGE_SCRIPT_ID } from "../../vite-plugin-scripts/index.js";
import { call as callEndpoint } from "../endpoint/index.js";
import { debug, info } from "../logger/core.js";
import { render } from "../render/core.js";
import { callGetStaticPaths } from "../render/route-cache.js";
import { createLinkStylesheetElementSet, createModuleScriptsSet } from "../render/ssr-element.js";
import { createRequest } from "../request.js";
import { matchRoute } from "../routing/match.js";
import { getOutputFilename } from "../util.js";
import { getOutFile, getOutFolder } from "./common.js";
import { eachPageData, getPageDataByComponent, sortedCSS } from "./internal.js";
import { getTimeStat } from "./util.js";
const MAX_CONCURRENT_RENDERS = 1;
function* throttle(max, inPaths) {
  let tmp = [];
  let i = 0;
  for (let path of inPaths) {
    tmp.push(path);
    if (i === max) {
      yield tmp;
      tmp.length = 0;
      i = 0;
    } else {
      i++;
    }
  }
  if (tmp.length) {
    yield tmp;
  }
}
function shouldSkipDraft(pageModule, astroConfig) {
  var _a;
  return !astroConfig.markdown.drafts && "frontmatter" in pageModule && ((_a = pageModule.frontmatter) == null ? void 0 : _a.draft) === true;
}
function rootRelativeFacadeId(facadeId, astroConfig) {
  return facadeId.slice(fileURLToPath(astroConfig.root).length);
}
function chunkIsPage(astroConfig, output, internals) {
  if (output.type !== "chunk") {
    return false;
  }
  const chunk = output;
  if (chunk.facadeModuleId) {
    const facadeToEntryId = prependForwardSlash(
      rootRelativeFacadeId(chunk.facadeModuleId, astroConfig)
    );
    return internals.entrySpecifierToBundleMap.has(facadeToEntryId);
  }
  return false;
}
async function generatePages(opts, internals) {
  const timer = performance.now();
  info(opts.logging, null, `
${bgGreen(black(" generating static routes "))}`);
  const ssr = opts.astroConfig.output === "server";
  const serverEntry = opts.buildConfig.serverEntry;
  const outFolder = ssr ? opts.buildConfig.server : opts.astroConfig.outDir;
  const ssrEntryURL = new URL("./" + serverEntry + `?time=${Date.now()}`, outFolder);
  const ssrEntry = await import(ssrEntryURL.toString());
  const builtPaths = /* @__PURE__ */ new Set();
  for (const pageData of eachPageData(internals)) {
    await generatePage(opts, internals, pageData, ssrEntry, builtPaths);
  }
  info(opts.logging, null, dim(`Completed in ${getTimeStat(timer, performance.now())}.
`));
}
async function generatePage(opts, internals, pageData, ssrEntry, builtPaths) {
  let timeStart = performance.now();
  const renderers = ssrEntry.renderers;
  const pageInfo = getPageDataByComponent(internals, pageData.route.component);
  const linkIds = sortedCSS(pageData);
  const scripts = (pageInfo == null ? void 0 : pageInfo.hoistedScript) ?? null;
  const pageModule = ssrEntry.pageMap.get(pageData.component);
  if (!pageModule) {
    throw new Error(
      `Unable to find the module for ${pageData.component}. This is unexpected and likely a bug in Astro, please report.`
    );
  }
  if (shouldSkipDraft(pageModule, opts.astroConfig)) {
    info(opts.logging, null, `${magenta("\u26A0\uFE0F")}  Skipping draft ${pageData.route.component}`);
    return;
  }
  const generationOptions = {
    pageData,
    internals,
    linkIds,
    scripts,
    mod: pageModule,
    renderers
  };
  const icon = pageData.route.type === "page" ? green("\u25B6") : magenta("\u03BB");
  info(opts.logging, null, `${icon} ${pageData.route.component}`);
  const paths = await getPathsForRoute(pageData, pageModule, opts, builtPaths);
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    await generatePath(path, opts, generationOptions);
    const timeEnd = performance.now();
    const timeChange = getTimeStat(timeStart, timeEnd);
    const timeIncrease = `(+${timeChange})`;
    const filePath = getOutputFilename(opts.astroConfig, path, pageData.route.type);
    const lineIcon = i === paths.length - 1 ? "\u2514\u2500" : "\u251C\u2500";
    info(opts.logging, null, `  ${cyan(lineIcon)} ${dim(filePath)} ${dim(timeIncrease)}`);
  }
}
async function getPathsForRoute(pageData, mod, opts, builtPaths) {
  let paths = [];
  if (pageData.route.pathname) {
    paths.push(pageData.route.pathname);
    builtPaths.add(pageData.route.pathname);
  } else {
    const route = pageData.route;
    const result = await callGetStaticPaths({
      mod,
      route: pageData.route,
      isValidate: false,
      logging: opts.logging,
      ssr: opts.astroConfig.output === "server"
    }).then((_result) => {
      const label = _result.staticPaths.length === 1 ? "page" : "pages";
      debug(
        "build",
        `\u251C\u2500\u2500 ${colors.bold(colors.green("\u2714"))} ${route.component} \u2192 ${colors.magenta(
          `[${_result.staticPaths.length} ${label}]`
        )}`
      );
      return _result;
    }).catch((err) => {
      debug("build", `\u251C\u2500\u2500 ${colors.bold(colors.red("\u2717"))} ${route.component}`);
      throw err;
    });
    opts.routeCache.set(route, result);
    paths = result.staticPaths.map((staticPath) => staticPath.params && route.generate(staticPath.params)).filter((staticPath) => {
      if (!builtPaths.has(removeTrailingForwardSlash(staticPath))) {
        return true;
      }
      const matchedRoute = matchRoute(staticPath, opts.manifest);
      return matchedRoute === route;
    });
    for (const staticPath of paths) {
      builtPaths.add(removeTrailingForwardSlash(staticPath));
    }
  }
  return paths;
}
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "file":
          return false;
      }
    }
  }
}
function addPageName(pathname, opts) {
  const trailingSlash = opts.astroConfig.trailingSlash;
  const buildFormat = opts.astroConfig.build.format;
  const pageName = shouldAppendForwardSlash(trailingSlash, buildFormat) ? pathname.replace(/\/?$/, "/").replace(/^\//, "") : pathname.replace(/^\//, "");
  opts.pageNames.push(pageName);
}
function getUrlForPath(pathname, base, origin, format, routeType) {
  const ending = format === "directory" ? "/" : ".html";
  let buildPathname;
  if (pathname === "/" || pathname === "") {
    buildPathname = base;
  } else if (routeType === "endpoint") {
    const buildPathRelative = removeLeadingForwardSlash(pathname);
    buildPathname = base + buildPathRelative;
  } else {
    const buildPathRelative = removeTrailingForwardSlash(removeLeadingForwardSlash(pathname)) + ending;
    buildPathname = base + buildPathRelative;
  }
  const url = new URL(buildPathname, origin);
  return url;
}
async function generatePath(pathname, opts, gopts) {
  var _a;
  const { astroConfig, logging, origin, routeCache } = opts;
  const { mod, internals, linkIds, scripts: hoistedScripts, pageData, renderers } = gopts;
  if (pageData.route.type === "page") {
    addPageName(pathname, opts);
  }
  debug("build", `Generating: ${pathname}`);
  const site = astroConfig.base !== "/" ? joinPaths(((_a = astroConfig.site) == null ? void 0 : _a.toString()) || "http://localhost/", astroConfig.base) : astroConfig.site;
  const links = createLinkStylesheetElementSet(linkIds, site);
  const scripts = createModuleScriptsSet(hoistedScripts ? [hoistedScripts] : [], site);
  if (astroConfig._ctx.scripts.some((script) => script.stage === "page")) {
    const hashedFilePath = internals.entrySpecifierToBundleMap.get(PAGE_SCRIPT_ID);
    if (typeof hashedFilePath !== "string") {
      throw new Error(`Cannot find the built path for ${PAGE_SCRIPT_ID}`);
    }
    const src = prependForwardSlash(npath.posix.join(astroConfig.base, hashedFilePath));
    scripts.add({
      props: { type: "module", src },
      children: ""
    });
  }
  for (const script of astroConfig._ctx.scripts) {
    if (script.stage === "head-inline") {
      scripts.add({
        props: {},
        children: script.content
      });
    }
  }
  const ssr = opts.astroConfig.output === "server";
  const url = getUrlForPath(
    pathname,
    opts.astroConfig.base,
    origin,
    opts.astroConfig.build.format,
    pageData.route.type
  );
  const options = {
    adapterName: void 0,
    links,
    logging,
    markdown: {
      ...astroConfig.markdown,
      isAstroFlavoredMd: astroConfig.legacy.astroFlavoredMarkdown
    },
    mod,
    mode: opts.mode,
    origin,
    pathname,
    scripts,
    renderers,
    async resolve(specifier) {
      const hashedFilePath = internals.entrySpecifierToBundleMap.get(specifier);
      if (typeof hashedFilePath !== "string") {
        if (specifier === BEFORE_HYDRATION_SCRIPT_ID) {
          return "data:text/javascript;charset=utf-8,//[no before-hydration script]";
        }
        throw new Error(`Cannot find the built path for ${specifier}`);
      }
      return prependForwardSlash(npath.posix.join(astroConfig.base, hashedFilePath));
    },
    request: createRequest({ url, headers: new Headers(), logging, ssr }),
    route: pageData.route,
    routeCache,
    site: astroConfig.site ? new URL(astroConfig.base, astroConfig.site).toString() : astroConfig.site,
    ssr,
    streaming: true
  };
  let body;
  if (pageData.route.type === "endpoint") {
    const result = await callEndpoint(mod, options);
    if (result.type === "response") {
      throw new Error(`Returning a Response from an endpoint is not supported in SSG mode.`);
    }
    body = result.body;
  } else {
    const response = await render(options);
    if (response.status !== 200 || !response.body) {
      return;
    }
    body = await response.text();
  }
  const outFolder = getOutFolder(astroConfig, pathname, pageData.route.type);
  const outFile = getOutFile(astroConfig, outFolder, pathname, pageData.route.type);
  pageData.route.distURL = outFile;
  await fs.promises.mkdir(outFolder, { recursive: true });
  await fs.promises.writeFile(outFile, body, "utf-8");
}
export {
  chunkIsPage,
  generatePages,
  rootRelativeFacadeId
};
