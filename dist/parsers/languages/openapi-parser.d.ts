/**
 * OpenAPI Parser Implementation
 *
 * Parses OpenAPI 3.x and Swagger 2.0 specifications into standardized AST format.
 * Supports schema validation, reference resolution, and comprehensive error reporting.
 */
import { IParser, ParseRequest, ParseResponse, ValidationResponse } from '../parser-service';
/**
 * OpenAPI Parser class implementing IParser interface
 */
export declare class OpenAPIParser implements IParser {
    readonly type = "openapi";
    readonly supportedExtensions: string[];
    /**
     * Check if this parser can handle the given request
     */
    canParse(request: ParseRequest): boolean;
    /**
     * Parse OpenAPI specification into standardized AST format
     */
    parse(request: ParseRequest): Promise<ParseResponse>;
    /**
     * Validate parsed OpenAPI AST
     */
    validate(ast: any, rules?: string[]): Promise<ValidationResponse>;
    private loadDocument;
    private loadFromFile;
    private loadFromUrl;
    private loadFromContent;
    private validateDocument;
    private resolveReferences;
    private convertToAST;
    private extractEndpoints;
    private extractSchemas;
    private extractComponents;
    private extractMetadata;
    private extractParameters;
    private extractRequestBody;
    private extractResponses;
    private extractSecurity;
    private extractServers;
    private extractTags;
    private endpointToPlainObject;
    private calculateDocumentSize;
    private generateParseId;
    private generateSpecId;
    private handleParseError;
    private validateOpenAPIStructure;
    private validateEndpointDefinitions;
    private validateSchemaDefinitions;
    private validateSecurityDefinitions;
}
export default OpenAPIParser;
//# sourceMappingURL=openapi-parser.d.ts.map