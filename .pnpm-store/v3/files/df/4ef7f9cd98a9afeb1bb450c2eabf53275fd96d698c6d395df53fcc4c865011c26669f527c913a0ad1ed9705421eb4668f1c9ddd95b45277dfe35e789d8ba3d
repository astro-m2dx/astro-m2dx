import { CompletionList, Position, FoldingRange, Hover, SymbolInformation, LinkedEditingRanges } from 'vscode-languageserver';
import type { Plugin } from '../interfaces';
import { ConfigManager } from '../../core/config/ConfigManager';
import { AstroDocument } from '../../core/documents/AstroDocument';
export declare class HTMLPlugin implements Plugin {
    __name: string;
    private lang;
    private attributeOnlyLang;
    private componentLang;
    private styleScriptTemplate;
    private configManager;
    constructor(configManager: ConfigManager);
    doHover(document: AstroDocument, position: Position): Promise<Hover | null>;
    /**
     * Get HTML completions
     */
    getCompletions(document: AstroDocument, position: Position): Promise<CompletionList | null>;
    getFoldingRanges(document: AstroDocument): FoldingRange[] | null;
    getLinkedEditingRanges(document: AstroDocument, position: Position): LinkedEditingRanges | null;
    doTagComplete(document: AstroDocument, position: Position): Promise<string | null>;
    getDocumentSymbols(document: AstroDocument): Promise<SymbolInformation[]>;
    /**
     * Get lang completions for style tags (ex: `<style lang="scss">`)
     */
    private getLangCompletions;
    private featureEnabled;
}
