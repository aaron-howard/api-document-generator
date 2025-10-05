/**
 * JSDoc Parser Implementation
 *
 * Parses JSDoc comments from JavaScript/TypeScript files into standardized AST format.
 * Supports function documentation, type definitions, and API endpoint extraction.
 */
import { IParser, ParseRequest, ParseResponse, ValidationResponse } from '../parser-service';
/**
 * JSDoc Parser class implementing IParser interface
 */
export declare class JSDocParser implements IParser {
    readonly type = "jsdoc";
    readonly supportedExtensions: string[];
    /**
     * Check if this parser can handle the given request
     */
    canParse(request: ParseRequest): boolean;
    /**
     * Parse JSDoc comments into standardized AST format
     */
    parse(request: ParseRequest): Promise<ParseResponse>;
    /**
     * Validate parsed JSDoc AST
     */
    validate(ast: any, rules?: string[]): Promise<ValidationResponse>;
    private loadSource;
    private loadFromFile;
    private extractJSDocComments;
    private parseJSDocComments;
    private parseComment;
    private parseTagContent;
    private parseParamTag;
    private parseReturnTag;
    private parseThrowsTag;
    private parseRouteTag;
    private parseTypedefTag;
    private parsePropertyTag;
    private convertToAST;
    private extractEndpoints;
    private extractSchemas;
    private extractComponents;
    private extractMetadata;
    private extractParameters;
    private extractResponses;
    private parseHttpMethod;
    private determineParameterLocation;
    private convertJSDocType;
    private endpointToPlainObject;
    private generateParseId;
    private generateSpecId;
    private handleParseError;
    private validateJSDocFormat;
    private validateFunctionDocumentation;
    private validateTypeDefinitions;
}
export default JSDocParser;
//# sourceMappingURL=jsdoc-parser.d.ts.map