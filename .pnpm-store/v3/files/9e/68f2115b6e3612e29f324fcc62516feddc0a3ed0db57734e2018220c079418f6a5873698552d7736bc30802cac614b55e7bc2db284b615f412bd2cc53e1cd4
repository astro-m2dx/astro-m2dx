import type { AppCompletionList, CompletionsProvider } from '../../interfaces';
import type { AstroDocument } from '../../../core/documents';
import { CompletionContext, Position } from 'vscode-languageserver';
import { LanguageServiceManager as TypeScriptLanguageServiceManager } from '../../typescript/LanguageServiceManager';
export declare class CompletionsProviderImpl implements CompletionsProvider {
    private readonly languageServiceManager;
    private lastCompletion;
    directivesHTMLLang: import("vscode-html-languageservice").LanguageService;
    constructor(languageServiceManager: TypeScriptLanguageServiceManager);
    getCompletions(document: AstroDocument, position: Position, completionContext?: CompletionContext): Promise<AppCompletionList | null>;
    private getComponentScriptCompletion;
    private getPropCompletionsAndFilePath;
    private getImportedSymbol;
    private getPropType;
    private getCompletionItemForProperty;
}
