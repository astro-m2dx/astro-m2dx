"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAstroSys = void 0;
const typescript_1 = __importDefault(require("typescript"));
const utils_1 = require("./utils");
/**
 * This should only be accessed by TS Astro module resolution.
 */
function createAstroSys(getSnapshot) {
    const fileExistsCache = new Map();
    const AstroSys = {
        ...typescript_1.default.sys,
        fileExists(path) {
            path = (0, utils_1.ensureRealFilePath)(path);
            const exists = fileExistsCache.get(path) ?? typescript_1.default.sys.fileExists(path);
            fileExistsCache.set(path, exists);
            return exists;
        },
        readFile(path) {
            const snapshot = getSnapshot(path);
            return snapshot.getText(0, snapshot.getLength());
        },
        readDirectory(path, extensions, exclude, include, depth) {
            const extensionsWithAstro = (extensions ?? []).concat(...['.astro', '.svelte', '.vue']);
            const result = typescript_1.default.sys.readDirectory(path, extensionsWithAstro, exclude, include, depth);
            return result;
        },
        deleteFile(path) {
            fileExistsCache.delete((0, utils_1.ensureRealFilePath)(path));
            return typescript_1.default.sys.deleteFile?.(path);
        },
        deleteFromCache(path) {
            fileExistsCache.delete((0, utils_1.ensureRealFilePath)(path));
        },
    };
    if (typescript_1.default.sys.realpath) {
        const realpath = typescript_1.default.sys.realpath;
        AstroSys.realpath = function (path) {
            if ((0, utils_1.isVirtualFilePath)(path)) {
                return realpath((0, utils_1.ensureRealFilePath)(path)) + '.tsx';
            }
            return realpath(path);
        };
    }
    return AstroSys;
}
exports.createAstroSys = createAstroSys;
