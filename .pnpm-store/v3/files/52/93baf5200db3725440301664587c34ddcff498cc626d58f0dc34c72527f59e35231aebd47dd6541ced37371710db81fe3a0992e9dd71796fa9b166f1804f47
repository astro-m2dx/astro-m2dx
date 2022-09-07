"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptPlugin = void 0;
const typescript_1 = __importDefault(require("typescript"));
const vscode_languageserver_1 = require("vscode-languageserver");
const CompletionsProvider_1 = require("./features/CompletionsProvider");
const DiagnosticsProvider_1 = require("./features/DiagnosticsProvider");
const HoverProvider_1 = require("./features/HoverProvider");
const SignatureHelpProvider_1 = require("./features/SignatureHelpProvider");
const utils_1 = require("./utils");
const DocumentSymbolsProvider_1 = require("./features/DocumentSymbolsProvider");
const SemanticTokenProvider_1 = require("./features/SemanticTokenProvider");
const FoldingRangesProvider_1 = require("./features/FoldingRangesProvider");
const CodeActionsProvider_1 = require("./features/CodeActionsProvider");
const DefinitionsProvider_1 = require("./features/DefinitionsProvider");
const InlayHintsProvider_1 = require("./features/InlayHintsProvider");
const astro2tsx_1 = __importDefault(require("./astro2tsx"));
const utils_2 = require("./snapshots/utils");
const TypeDefinitionsProvider_1 = require("./features/TypeDefinitionsProvider");
class TypeScriptPlugin {
    constructor(configManager, languageServiceManager) {
        this.__name = 'typescript';
        this.configManager = configManager;
        this.languageServiceManager = languageServiceManager;
        this.codeActionsProvider = new CodeActionsProvider_1.CodeActionsProviderImpl(this.languageServiceManager, this.configManager);
        this.completionProvider = new CompletionsProvider_1.CompletionsProviderImpl(this.languageServiceManager, this.configManager);
        this.hoverProvider = new HoverProvider_1.HoverProviderImpl(this.languageServiceManager);
        this.definitionsProvider = new DefinitionsProvider_1.DefinitionsProviderImpl(this.languageServiceManager);
        this.typeDefinitionsProvider = new TypeDefinitionsProvider_1.TypeDefinitionsProviderImpl(this.languageServiceManager);
        this.signatureHelpProvider = new SignatureHelpProvider_1.SignatureHelpProviderImpl(this.languageServiceManager);
        this.diagnosticsProvider = new DiagnosticsProvider_1.DiagnosticsProviderImpl(this.languageServiceManager);
        this.documentSymbolsProvider = new DocumentSymbolsProvider_1.DocumentSymbolsProviderImpl(this.languageServiceManager);
        this.semanticTokensProvider = new SemanticTokenProvider_1.SemanticTokensProviderImpl(this.languageServiceManager);
        this.inlayHintsProvider = new InlayHintsProvider_1.InlayHintsProviderImpl(this.languageServiceManager, this.configManager);
        this.foldingRangesProvider = new FoldingRangesProvider_1.FoldingRangesProviderImpl(this.languageServiceManager);
    }
    async doHover(document, position) {
        if (!(await this.featureEnabled(document, 'hover'))) {
            return null;
        }
        return this.hoverProvider.doHover(document, position);
    }
    async rename(document, position, newName) {
        const { lang, tsDoc } = await this.languageServiceManager.getLSAndTSDoc(document);
        const fragment = await tsDoc.createFragment();
        const offset = fragment.offsetAt(fragment.getGeneratedPosition(position));
        let renames = lang.findRenameLocations((0, utils_1.toVirtualAstroFilePath)(tsDoc.filePath), offset, false, false, true);
        if (!renames) {
            return null;
        }
        let edit = {
            changes: {},
        };
        renames.forEach((rename) => {
            const filePath = (0, utils_1.ensureRealFilePath)(rename.fileName);
            if (!(filePath in edit.changes)) {
                edit.changes[filePath] = [];
            }
            edit.changes[filePath].push({
                newText: newName,
                range: (0, utils_1.convertToLocationRange)(fragment, rename.textSpan),
            });
        });
        return edit;
    }
    async getFoldingRanges(document) {
        return this.foldingRangesProvider.getFoldingRanges(document);
    }
    async getSemanticTokens(document, range, cancellationToken) {
        if (!(await this.featureEnabled(document, 'semanticTokens'))) {
            return null;
        }
        return this.semanticTokensProvider.getSemanticTokens(document, range, cancellationToken);
    }
    async getDocumentSymbols(document) {
        if (!(await this.featureEnabled(document, 'documentSymbols'))) {
            return [];
        }
        const symbols = await this.documentSymbolsProvider.getDocumentSymbols(document);
        return symbols;
    }
    async getCodeActions(document, range, context, cancellationToken) {
        if (!(await this.featureEnabled(document, 'codeActions'))) {
            return [];
        }
        return this.codeActionsProvider.getCodeActions(document, range, context, cancellationToken);
    }
    async getCompletions(document, position, completionContext, cancellationToken) {
        if (!(await this.featureEnabled(document, 'completions'))) {
            return null;
        }
        const completions = await this.completionProvider.getCompletions(document, position, completionContext, cancellationToken);
        return completions;
    }
    async resolveCompletion(document, completionItem, cancellationToken) {
        return this.completionProvider.resolveCompletion(document, completionItem, cancellationToken);
    }
    async getInlayHints(document, range) {
        return this.inlayHintsProvider.getInlayHints(document, range);
    }
    async getDefinitions(document, position) {
        return this.definitionsProvider.getDefinitions(document, position);
    }
    async getTypeDefinition(document, position) {
        return this.typeDefinitionsProvider.getTypeDefinitions(document, position);
    }
    async getDiagnostics(document, cancellationToken) {
        if (!(await this.featureEnabled(document, 'diagnostics'))) {
            return [];
        }
        return this.diagnosticsProvider.getDiagnostics(document, cancellationToken);
    }
    async onWatchFileChanges(onWatchFileChangesParas) {
        let doneUpdateProjectFiles = false;
        for (const { fileName, changeType } of onWatchFileChangesParas) {
            const scriptKind = (0, utils_1.getScriptKindFromFileName)(fileName);
            if (scriptKind === typescript_1.default.ScriptKind.Unknown) {
                continue;
            }
            if (changeType === vscode_languageserver_1.FileChangeType.Created && !doneUpdateProjectFiles) {
                doneUpdateProjectFiles = true;
                await this.languageServiceManager.updateProjectFiles();
            }
            else if (changeType === vscode_languageserver_1.FileChangeType.Deleted) {
                await this.languageServiceManager.deleteSnapshot(fileName);
            }
            else {
                await this.languageServiceManager.updateExistingNonAstroFile(fileName);
            }
        }
    }
    async updateNonAstroFile(fileName, changes) {
        await this.languageServiceManager.updateExistingNonAstroFile(fileName, changes);
    }
    async getSignatureHelp(document, position, context, cancellationToken) {
        return this.signatureHelpProvider.getSignatureHelp(document, position, context, cancellationToken);
    }
    getTSXForDocument(document) {
        return (0, astro2tsx_1.default)(document.getText(), (0, utils_2.classNameFromFilename)(document.getURL()));
    }
    async featureEnabled(document, feature) {
        return ((await this.configManager.isEnabled(document, 'typescript')) &&
            (await this.configManager.isEnabled(document, 'typescript', feature)));
    }
}
exports.TypeScriptPlugin = TypeScriptPlugin;
