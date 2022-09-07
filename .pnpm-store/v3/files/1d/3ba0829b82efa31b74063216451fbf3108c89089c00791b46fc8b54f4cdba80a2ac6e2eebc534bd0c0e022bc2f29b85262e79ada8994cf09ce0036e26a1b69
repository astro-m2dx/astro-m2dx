import { Position, LocationLink } from 'vscode-languageserver-types';
import { AstroDocument } from '../../../core/documents';
import { DefinitionsProvider } from '../../interfaces';
import { LanguageServiceManager } from '../LanguageServiceManager';
export declare class DefinitionsProviderImpl implements DefinitionsProvider {
    private languageServiceManager;
    constructor(languageServiceManager: LanguageServiceManager);
    getDefinitions(document: AstroDocument, position: Position): Promise<LocationLink[]>;
}
