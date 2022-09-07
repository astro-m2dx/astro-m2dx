import slash from "slash";
import { fileURLToPath } from "url";
import { viteID } from "../../util.js";
import { createModuleScriptElementWithSrc } from "../ssr-element.js";
import { crawlGraph } from "./vite.js";
async function getScriptsForURL(filePath, astroConfig, viteServer) {
  const elements = /* @__PURE__ */ new Set();
  const rootID = viteID(filePath);
  let rootProjectFolder = slash(fileURLToPath(astroConfig.root));
  const modInfo = viteServer.pluginContainer.getModuleInfo(rootID);
  addHoistedScripts(elements, modInfo, rootProjectFolder);
  for await (const moduleNode of crawlGraph(viteServer, rootID, true)) {
    const id = moduleNode.id;
    if (id) {
      const info = viteServer.pluginContainer.getModuleInfo(id);
      addHoistedScripts(elements, info, rootProjectFolder);
    }
  }
  return elements;
}
function addHoistedScripts(set, info, rootProjectFolder) {
  var _a, _b;
  if (!((_a = info == null ? void 0 : info.meta) == null ? void 0 : _a.astro)) {
    return;
  }
  let id = info.id;
  const astro = (_b = info == null ? void 0 : info.meta) == null ? void 0 : _b.astro;
  for (let i = 0; i < astro.scripts.length; i++) {
    const scriptId = `${id}?astro&type=script&index=${i}&lang.ts`;
    const element = createModuleScriptElementWithSrc(scriptId);
    set.add(element);
  }
}
export {
  getScriptsForURL
};
