import path from "path";
import { viteID } from "../../util.js";
import { STYLE_EXTENSIONS } from "../util.js";
import { crawlGraph } from "./vite.js";
async function getStylesForURL(filePath, viteServer, mode) {
  var _a;
  const importedCssUrls = /* @__PURE__ */ new Set();
  const importedStylesMap = /* @__PURE__ */ new Map();
  for await (const importedModule of crawlGraph(viteServer, viteID(filePath), true)) {
    const ext = path.extname(importedModule.url).toLowerCase();
    if (STYLE_EXTENSIONS.has(ext)) {
      if (mode === "development" && typeof ((_a = importedModule.ssrModule) == null ? void 0 : _a.default) === "string") {
        importedStylesMap.set(importedModule.url, importedModule.ssrModule.default);
      } else {
        importedCssUrls.add(importedModule.url);
      }
    }
  }
  return {
    urls: importedCssUrls,
    stylesMap: importedStylesMap
  };
}
export {
  getStylesForURL
};
