import { FoldingRange } from 'vscode-languageserver';
import { AstroDocument } from '../../../core/documents';
import { FoldingRangesProvider } from '../../interfaces';
import { LanguageServiceManager } from '../LanguageServiceManager';
export declare class FoldingRangesProviderImpl implements FoldingRangesProvider {
    private readonly languageServiceManager;
    constructor(languageServiceManager: LanguageServiceManager);
    getFoldingRanges(document: AstroDocument): Promise<FoldingRange[] | null>;
}
