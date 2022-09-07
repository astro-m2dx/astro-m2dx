import { transform } from "@astrojs/compiler";
import { fileURLToPath } from "url";
import { AstroErrorCodes } from "../core/errors.js";
import { prependForwardSlash } from "../core/path.js";
import { viteID } from "../core/util.js";
const configCache = /* @__PURE__ */ new WeakMap();
function getNormalizedID(filename) {
  try {
    const filenameURL = new URL(`file://${filename}`);
    return fileURLToPath(filenameURL);
  } catch (err) {
    return filename;
  }
}
async function compile({
  config,
  filename,
  moduleId,
  source,
  ssr,
  transformStyleWithVite,
  viteDevServer,
  pluginContext
}) {
  var _a;
  const normalizedID = getNormalizedID(filename);
  let cssDeps = /* @__PURE__ */ new Set();
  let cssTransformError;
  if (!pluginContext.addWatchFile) {
    pluginContext.addWatchFile = () => {
    };
  }
  const transformResult = await transform(source, {
    pathname: `/@fs${prependForwardSlash(moduleId)}`,
    projectRoot: config.root.toString(),
    site: (_a = config.site) == null ? void 0 : _a.toString(),
    sourcefile: filename,
    sourcemap: "both",
    internalURL: `/@fs${prependForwardSlash(
      viteID(new URL("../runtime/server/index.js", import.meta.url))
    )}`,
    experimentalStaticExtraction: true,
    preprocessStyle: async (value, attrs) => {
      const lang = `.${(attrs == null ? void 0 : attrs.lang) || "css"}`.toLowerCase();
      try {
        const result = await transformStyleWithVite.call(pluginContext, {
          id: normalizedID,
          source: value,
          lang,
          ssr,
          viteDevServer
        });
        if (!result)
          return null;
        for (const dep of result.deps) {
          cssDeps.add(dep);
        }
        let map;
        if (result.map) {
          if (typeof result.map === "string") {
            map = result.map;
          } else if (result.map.mappings) {
            map = result.map.toString();
          }
        }
        return { code: result.code, map };
      } catch (err) {
        cssTransformError = err;
        return null;
      }
    }
  }).catch((err) => {
    err.code = err.code || AstroErrorCodes.UnknownCompilerError;
    throw err;
  }).then((result) => {
    if (cssTransformError) {
      cssTransformError.code = cssTransformError.code || AstroErrorCodes.UnknownCompilerCSSError;
      throw cssTransformError;
    }
    return result;
  });
  const compileResult = Object.create(transformResult, {
    cssDeps: {
      value: cssDeps
    },
    source: {
      value: source
    }
  });
  return compileResult;
}
function isCached(config, filename) {
  return configCache.has(config) && configCache.get(config).has(filename);
}
function getCachedSource(config, filename) {
  if (!isCached(config, filename))
    return null;
  let src = configCache.get(config).get(filename);
  if (!src)
    return null;
  return src.source;
}
function invalidateCompilation(config, filename) {
  if (configCache.has(config)) {
    const cache = configCache.get(config);
    cache.delete(filename);
  }
}
async function cachedCompilation(props) {
  const { config, filename } = props;
  let cache;
  if (!configCache.has(config)) {
    cache = /* @__PURE__ */ new Map();
    configCache.set(config, cache);
  } else {
    cache = configCache.get(config);
  }
  if (cache.has(filename)) {
    return cache.get(filename);
  }
  const compileResult = await compile(props);
  cache.set(filename, compileResult);
  return compileResult;
}
export {
  cachedCompilation,
  getCachedSource,
  invalidateCompilation,
  isCached
};
