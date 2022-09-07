import { InlayHint } from 'vscode-languageserver';
import { AstroDocument } from '../../../core/documents';
import { InlayHintsProvider } from '../../interfaces';
import { LanguageServiceManager } from '../LanguageServiceManager';
import { Range } from 'vscode-languageserver-types';
import { ConfigManager } from '../../../core/config';
export declare class InlayHintsProviderImpl implements InlayHintsProvider {
    private languageServiceManager;
    private configManager;
    constructor(languageServiceManager: LanguageServiceManager, configManager: ConfigManager);
    getInlayHints(document: AstroDocument, range: Range): Promise<InlayHint[]>;
}
