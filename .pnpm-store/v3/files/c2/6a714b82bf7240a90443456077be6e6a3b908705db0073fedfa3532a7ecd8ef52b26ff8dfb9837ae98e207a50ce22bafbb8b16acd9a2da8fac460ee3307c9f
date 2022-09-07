"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoldingRangesProviderImpl = void 0;
const typescript_1 = __importDefault(require("typescript"));
const vscode_languageserver_1 = require("vscode-languageserver");
const utils_1 = require("../utils");
class FoldingRangesProviderImpl {
    constructor(languageServiceManager) {
        this.languageServiceManager = languageServiceManager;
    }
    async getFoldingRanges(document) {
        const html = document.html;
        const { lang, tsDoc } = await this.languageServiceManager.getLSAndTSDoc(document);
        const filePath = (0, utils_1.toVirtualAstroFilePath)(tsDoc.filePath);
        const outliningSpans = lang.getOutliningSpans(filePath).filter((span) => {
            const node = html.findNodeAt(span.textSpan.start);
            // Due to how our TSX output transform those tags into function calls or template literals
            // TypeScript thinks of those as outlining spans, which is fine but we don't want folding ranges for those
            return node.tag !== 'script' && node.tag !== 'style';
        });
        const scriptOutliningSpans = [];
        document.scriptTags.forEach((scriptTag) => {
            const { snapshot: scriptTagSnapshot, filePath: scriptFilePath } = (0, utils_1.getScriptTagSnapshot)(tsDoc, document, scriptTag.container);
            scriptOutliningSpans.push(...lang.getOutliningSpans(scriptFilePath).map((span) => {
                span.textSpan.start = document.offsetAt(scriptTagSnapshot.getOriginalPosition(scriptTagSnapshot.positionAt(span.textSpan.start)));
                return span;
            }));
        });
        const foldingRanges = [];
        for (const span of [...outliningSpans, ...scriptOutliningSpans]) {
            const start = document.positionAt(span.textSpan.start);
            const end = adjustFoldingEnd(start, document.positionAt(span.textSpan.start + span.textSpan.length), document);
            // When using this method for generating folding ranges, TypeScript tend to return some
            // one line / one character ones that we should be able to safely ignore
            if (start.line === end.line && start.character === end.character) {
                continue;
            }
            foldingRanges.push(vscode_languageserver_1.FoldingRange.create(start.line, end.line, start.character, end.character, transformFoldingRangeKind(span.kind)));
        }
        return foldingRanges;
    }
}
exports.FoldingRangesProviderImpl = FoldingRangesProviderImpl;
function transformFoldingRangeKind(tsKind) {
    switch (tsKind) {
        case typescript_1.default.OutliningSpanKind.Comment:
            return vscode_languageserver_1.FoldingRangeKind.Comment;
        case typescript_1.default.OutliningSpanKind.Imports:
            return vscode_languageserver_1.FoldingRangeKind.Imports;
        case typescript_1.default.OutliningSpanKind.Region:
            return vscode_languageserver_1.FoldingRangeKind.Region;
    }
}
// https://github.com/microsoft/vscode/blob/bed61166fb604e519e82e4d1d1ed839bc45d65f8/extensions/typescript-language-features/src/languageFeatures/folding.ts#L61-L73
function adjustFoldingEnd(start, end, document) {
    // workaround for #47240
    if (end.character > 0) {
        const foldEndCharacter = document.getText({
            start: { line: end.line, character: end.character - 1 },
            end,
        });
        if (['}', ']', ')', '`'].includes(foldEndCharacter)) {
            const endOffset = Math.max(document.offsetAt({ line: end.line, character: 0 }) - 1, document.offsetAt(start));
            return document.positionAt(endOffset);
        }
    }
    return end;
}
