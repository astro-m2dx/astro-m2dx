"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlayHintsProviderImpl = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const utils_1 = require("../utils");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const typescript_1 = __importDefault(require("typescript"));
class InlayHintsProviderImpl {
    constructor(languageServiceManager, configManager) {
        this.languageServiceManager = languageServiceManager;
        this.configManager = configManager;
    }
    async getInlayHints(document, range) {
        const { lang, tsDoc } = await this.languageServiceManager.getLSAndTSDoc(document);
        const filePath = (0, utils_1.toVirtualAstroFilePath)(tsDoc.filePath);
        const fragment = await tsDoc.createFragment();
        const start = fragment.offsetAt(fragment.getGeneratedPosition(range.start));
        const end = fragment.offsetAt(fragment.getGeneratedPosition(range.end));
        const tsPreferences = await this.configManager.getTSInlayHintsPreferences(document);
        const inlayHints = lang.provideInlayHints(filePath, { start, length: end - start }, tsPreferences);
        return inlayHints.map((hint) => {
            const result = vscode_languageserver_1.InlayHint.create(fragment.getOriginalPosition(fragment.positionAt(hint.position)), hint.text, hint.kind === typescript_1.default.InlayHintKind.Type
                ? vscode_languageserver_types_1.InlayHintKind.Type
                : hint.kind === typescript_1.default.InlayHintKind.Parameter
                    ? vscode_languageserver_types_1.InlayHintKind.Parameter
                    : undefined);
            result.paddingLeft = hint.whitespaceBefore;
            result.paddingRight = hint.whitespaceAfter;
            return result;
        });
    }
}
exports.InlayHintsProviderImpl = InlayHintsProviderImpl;
