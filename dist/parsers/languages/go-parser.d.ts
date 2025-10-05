/**
 * Go Documentation Parser Implementation
 *
 * Parses Go documentation comments (godoc format) into standardized AST format.
 * Supports function documentation, struct documentation, and API endpoint extraction.
 */
import { IParser, ParseRequest, ParseResponse, ValidationResponse } from '../parser-service';
/**
 * Go Documentation Parser class implementing IParser interface
 */
export declare class GoDocParser implements IParser {
    readonly type = "go-doc";
    readonly supportedExtensions: string[];
    /**
     * Check if this parser can handle the given request
     */
    canParse(request: ParseRequest): boolean;
    /**
     * Parse Go documentation comments into standardized AST format
     */
    parse(request: ParseRequest): Promise<ParseResponse>;
    /**
     * Validate parsed Go documentation AST
     */
    validate(ast: any, rules?: string[]): Promise<ValidationResponse>;
    private loadSource;
    private loadFromFile;
    private extractDocComments;
    private extractNameFromComment;
    private getLineColumn;
    private parseDocComments;
    private parseComment;
    private isSectionHeader;
    private getSectionName;
    private saveSection;
    private parseRouteSection;
    private parseParametersSection;
    private parseResponsesSection;
    private convertToAST;
    private extractEndpoints;
    private inferRouteFromFunction;
    private extractSchemas;
    private extractComponents;
    private extractMetadata;
    private extractParameters;
    private extractResponses;
    private parseHttpMethod;
    private determineParameterLocation;
    private endpointToPlainObject;
    private generateParseId;
    private generateSpecId;
    private handleParseError;
    private validateGodocFormat;
    private validateFunctionDocumentation;
    private validateStructDocumentation;
}
export default GoDocParser;
//# sourceMappingURL=go-parser.d.ts.map