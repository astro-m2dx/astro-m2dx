import crypto from "crypto";
import esbuild from "esbuild";
import npath from "path";
import { isCSSRequest } from "../render/util.js";
import { relativeToSrcDir } from "../util.js";
import { getTopLevelPages, moduleIsTopLevelPage, walkParentInfos } from "./graph.js";
import {
  eachPageData,
  getPageDataByViteID,
  getPageDatasByClientOnlyID,
  getPageDatasByHoistedScriptId,
  isHoistedScript
} from "./internal.js";
const MAX_NAME_LENGTH = 70;
function rollupPluginAstroBuildCSS(options) {
  const { internals, buildOptions } = options;
  const { astroConfig } = buildOptions;
  let resolvedConfig;
  function nameifyPage(id) {
    let rel = relativeToSrcDir(astroConfig, id);
    if (rel.startsWith("pages/")) {
      rel = rel.slice(6);
    }
    const ext = npath.extname(rel);
    const noext = rel.slice(0, rel.length - ext.length);
    const named = noext.replace(/\//g, "-");
    return named;
  }
  function createNameForParentPages(id, ctx) {
    const parents = Array.from(getTopLevelPages(id, ctx));
    const proposedName = parents.map(([page]) => nameifyPage(page.id)).sort().join("-");
    if (proposedName.length <= MAX_NAME_LENGTH) {
      return proposedName;
    }
    const hash = crypto.createHash("sha256");
    for (const [page] of parents) {
      hash.update(page.id, "utf-8");
    }
    return hash.digest("hex").slice(0, 8);
  }
  function* getParentClientOnlys(id, ctx) {
    for (const [info] of walkParentInfos(id, ctx)) {
      yield* getPageDatasByClientOnlyID(internals, info.id);
    }
  }
  return [
    {
      name: "astro:rollup-plugin-build-css",
      outputOptions(outputOptions) {
        const manualChunks = outputOptions.manualChunks || Function.prototype;
        outputOptions.manualChunks = function(id, ...args) {
          if (typeof manualChunks == "object") {
            if (id in manualChunks) {
              return manualChunks[id];
            }
          } else if (typeof manualChunks === "function") {
            const outid = manualChunks.call(this, id, ...args);
            if (outid) {
              return outid;
            }
          }
          if (isCSSRequest(id)) {
            return createNameForParentPages(id, args[0]);
          }
        };
      },
      async generateBundle(_outputOptions, bundle) {
        const appendCSSToPage = (pageData, meta, depth) => {
          for (const importedCssImport of meta.importedCss) {
            if (pageData == null ? void 0 : pageData.css.has(importedCssImport)) {
              const cssInfo = pageData == null ? void 0 : pageData.css.get(importedCssImport);
              if (depth < cssInfo.depth) {
                cssInfo.depth = depth;
              }
            } else {
              pageData == null ? void 0 : pageData.css.set(importedCssImport, { depth });
            }
          }
        };
        for (const [_, chunk] of Object.entries(bundle)) {
          if (chunk.type === "chunk") {
            const c = chunk;
            if ("viteMetadata" in chunk) {
              const meta = chunk["viteMetadata"];
              if (meta.importedCss.size) {
                if (options.target === "server") {
                  for (const id of Object.keys(c.modules)) {
                    internals.cssChunkModuleIds.add(id);
                  }
                }
                if (options.target === "client") {
                  if (Object.keys(c.modules).every((id) => internals.cssChunkModuleIds.has(id))) {
                    for (const importedCssImport of meta.importedCss) {
                      delete bundle[importedCssImport];
                    }
                    return;
                  }
                }
                if (options.target === "client") {
                  for (const id of Object.keys(c.modules)) {
                    for (const pageData of getParentClientOnlys(id, this)) {
                      for (const importedCssImport of meta.importedCss) {
                        pageData.css.set(importedCssImport, { depth: -1 });
                      }
                    }
                  }
                }
                for (const id of Object.keys(c.modules)) {
                  for (const [pageInfo, depth] of walkParentInfos(id, this)) {
                    if (moduleIsTopLevelPage(pageInfo)) {
                      const pageViteID = pageInfo.id;
                      const pageData = getPageDataByViteID(internals, pageViteID);
                      if (pageData) {
                        appendCSSToPage(pageData, meta, depth);
                      }
                    } else if (options.target === "client" && isHoistedScript(internals, pageInfo.id)) {
                      for (const pageData of getPageDatasByHoistedScriptId(
                        internals,
                        pageInfo.id
                      )) {
                        appendCSSToPage(pageData, meta, -1);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    {
      name: "astro:rollup-plugin-single-css",
      enforce: "post",
      configResolved(config) {
        resolvedConfig = config;
      },
      generateBundle(_, bundle) {
        if (!resolvedConfig.build.cssCodeSplit) {
          const cssChunk = Object.values(bundle).find(
            (chunk) => chunk.type === "asset" && chunk.name === "style.css"
          );
          if (cssChunk) {
            for (const pageData of eachPageData(internals)) {
              pageData.css.set(cssChunk.fileName, { depth: -1 });
            }
          }
        }
      }
    },
    {
      name: "astro:rollup-plugin-build-css-minify",
      enforce: "post",
      async generateBundle(_outputOptions, bundle) {
        var _a, _b;
        if (options.target === "server") {
          for (const [, output] of Object.entries(bundle)) {
            if (output.type === "asset") {
              if (((_a = output.name) == null ? void 0 : _a.endsWith(".css")) && typeof output.source === "string") {
                const cssTarget = (_b = options.astroConfig.vite.build) == null ? void 0 : _b.cssTarget;
                const { code: minifiedCSS } = await esbuild.transform(output.source, {
                  loader: "css",
                  minify: true,
                  ...cssTarget ? { target: cssTarget } : {}
                });
                output.source = minifiedCSS;
              }
            } else if (output.type === "chunk") {
              for (const [imp, bindings] of Object.entries(output.importedBindings)) {
                if (imp.startsWith("chunks/") && !bundle[imp] && output.code.includes(imp)) {
                  const depChunk = {
                    type: "chunk",
                    fileName: imp,
                    name: imp,
                    facadeModuleId: imp,
                    code: `/* Pure CSS chunk ${imp} */ ${bindings.map((b) => `export const ${b} = {};`).join("")}`,
                    dynamicImports: [],
                    implicitlyLoadedBefore: [],
                    importedBindings: {},
                    imports: [],
                    referencedFiles: [],
                    exports: Array.from(bindings),
                    isDynamicEntry: false,
                    isEntry: false,
                    isImplicitEntry: false,
                    modules: {}
                  };
                  bundle[imp] = depChunk;
                }
              }
            }
          }
        }
      }
    }
  ];
}
export {
  rollupPluginAstroBuildCSS
};
