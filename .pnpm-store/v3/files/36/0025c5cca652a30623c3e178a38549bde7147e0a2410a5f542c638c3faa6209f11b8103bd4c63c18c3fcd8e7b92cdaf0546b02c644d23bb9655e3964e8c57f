import { Position, Location } from 'vscode-languageserver-protocol';
import { AstroDocument } from '../../../core/documents';
import { TypeDefinitionProvider } from '../../interfaces';
import { LanguageServiceManager } from '../LanguageServiceManager';
export declare class TypeDefinitionsProviderImpl implements TypeDefinitionProvider {
    private languageServiceManager;
    constructor(languageServiceManager: LanguageServiceManager);
    getTypeDefinitions(document: AstroDocument, position: Position): Promise<Location[]>;
}
