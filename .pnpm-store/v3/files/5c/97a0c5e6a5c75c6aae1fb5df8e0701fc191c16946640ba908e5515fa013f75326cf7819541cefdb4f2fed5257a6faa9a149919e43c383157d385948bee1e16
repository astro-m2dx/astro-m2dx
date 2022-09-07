import eol from "eol";
import fs from "fs";
import path from "path";
import resolve from "resolve";
import slash from "slash";
import { fileURLToPath, pathToFileURL } from "url";
import { prependForwardSlash, removeTrailingForwardSlash } from "./path.js";
const ASTRO_VERSION = "1.1.5";
function isObject(value) {
  return typeof value === "object" && value != null;
}
function arraify(target) {
  return Array.isArray(target) ? target : [target];
}
function padMultilineString(source, n = 2) {
  const lines = source.split(/\r?\n/);
  return lines.map((l) => ` `.repeat(n) + l).join(`
`);
}
const REGEXP_404_OR_500_ROUTE = /(404)|(500)\/?$/;
function getOutputFilename(astroConfig, name, type) {
  if (type === "endpoint") {
    return name;
  }
  if (name === "/" || name === "") {
    return path.posix.join(name, "index.html");
  }
  if (astroConfig.build.format === "file" || REGEXP_404_OR_500_ROUTE.test(name)) {
    return `${removeTrailingForwardSlash(name || "index")}.html`;
  }
  return path.posix.join(name, "index.html");
}
function parseNpmName(spec) {
  if (!spec || spec[0] === "." || spec[0] === "/")
    return void 0;
  let scope;
  let name = "";
  let parts = spec.split("/");
  if (parts[0][0] === "@") {
    scope = parts[0];
    name = parts.shift() + "/";
  }
  name += parts.shift();
  let subpath = parts.length ? `./${parts.join("/")}` : void 0;
  return {
    scope,
    name,
    subpath
  };
}
function createSafeError(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function codeFrame(src, loc) {
  if (!loc)
    return "";
  const lines = eol.lf(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}
function resolveDependency(dep, projectRoot) {
  const resolved = resolve.sync(dep, {
    basedir: fileURLToPath(projectRoot)
  });
  return pathToFileURL(resolved).toString();
}
function viteID(filePath) {
  return slash(fileURLToPath(filePath));
}
const VALID_ID_PREFIX = `/@id/`;
function unwrapId(id) {
  return id.startsWith(VALID_ID_PREFIX) ? id.slice(VALID_ID_PREFIX.length) : id;
}
function removeDir(_dir) {
  const dir = fileURLToPath(_dir);
  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
}
function emptyDir(_dir, skip) {
  const dir = fileURLToPath(_dir);
  if (!fs.existsSync(dir))
    return void 0;
  for (const file of fs.readdirSync(dir)) {
    if (skip == null ? void 0 : skip.has(file)) {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true, maxRetries: 3 });
  }
}
function resolvePages(config) {
  return new URL("./pages", config.srcDir);
}
function isInPagesDir(file, config) {
  const pagesDir = resolvePages(config);
  return file.toString().startsWith(pagesDir.toString());
}
function isPublicRoute(file, config) {
  const pagesDir = resolvePages(config);
  const parts = file.toString().replace(pagesDir.toString(), "").split("/").slice(1);
  for (const part of parts) {
    if (part.startsWith("_"))
      return false;
  }
  return true;
}
function endsWithPageExt(file, config) {
  for (const ext of config._ctx.pageExtensions) {
    if (file.toString().endsWith(ext))
      return true;
  }
  return false;
}
function isPage(file, config) {
  if (!isInPagesDir(file, config))
    return false;
  if (!isPublicRoute(file, config))
    return false;
  return endsWithPageExt(file, config);
}
function isModeServerWithNoAdapter(config) {
  return config.output === "server" && !config._ctx.adapter;
}
function relativeToSrcDir(config, idOrUrl) {
  let id;
  if (typeof idOrUrl !== "string") {
    id = unwrapId(viteID(idOrUrl));
  } else {
    id = idOrUrl;
  }
  return id.slice(slash(fileURLToPath(config.srcDir)).length);
}
function emoji(char, fallback) {
  return process.platform !== "win32" ? char : fallback;
}
function getLocalAddress(serverAddress, host) {
  if (typeof host === "boolean" || host === "localhost") {
    return "localhost";
  } else {
    return serverAddress;
  }
}
async function resolveIdToUrl(viteServer, id) {
  const result = await viteServer.pluginContainer.resolveId(id);
  if (!result) {
    return VALID_ID_PREFIX + id;
  }
  if (path.isAbsolute(result.id)) {
    return "/@fs" + prependForwardSlash(result.id);
  }
  return VALID_ID_PREFIX + result.id;
}
export {
  ASTRO_VERSION,
  VALID_ID_PREFIX,
  arraify,
  codeFrame,
  createSafeError,
  emoji,
  emptyDir,
  getLocalAddress,
  getOutputFilename,
  isModeServerWithNoAdapter,
  isObject,
  isPage,
  padMultilineString,
  parseNpmName,
  relativeToSrcDir,
  removeDir,
  resolveDependency,
  resolveIdToUrl,
  resolvePages,
  unwrapId,
  viteID
};
