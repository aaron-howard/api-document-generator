/**
 * Python Docstring Parser Implementation
 *
 * Parses Python docstrings (Google, NumPy, Sphinx formats) into standardized AST format.
 * Supports function documentation, class documentation, and API endpoint extraction.
 */
import { IParser, ParseRequest, ParseResponse, ValidationResponse } from '../parser-service';
/**
 * Python Docstring Parser class implementing IParser interface
 */
export declare class PythonParser implements IParser {
    readonly type = "python";
    readonly supportedExtensions: string[];
    /**
     * Check if this parser can handle the given request
     */
    canParse(request: ParseRequest): boolean;
    /**
     * Parse Python docstrings into standardized AST format
     */
    parse(request: ParseRequest): Promise<ParseResponse>;
    /**
     * Validate parsed Python docstring AST
     */
    validate(ast: any, rules?: string[]): Promise<ValidationResponse>;
    private loadSource;
    private loadFromFile;
    private extractDocstrings;
    private getLineColumn;
    private parseDocstrings;
    private parseDocstring;
    private detectDocstringFormat;
    private parseGoogleDocstring;
    private parseNumpyDocstring;
    private parseSphinxDocstring;
    private parseSimpleDocstring;
    private saveSection;
    private parseParameterSection;
    private parseReturnSection;
    private parseRaisesSection;
    private convertToAST;
    private extractEndpoints;
    private extractRouteInfo;
    private extractSchemas;
    private extractComponents;
    private extractMetadata;
    private extractParameters;
    private extractResponses;
    private parseHttpMethod;
    private determineParameterLocation;
    private convertPythonType;
    private mapExceptionToStatus;
    private endpointToPlainObject;
    private generateParseId;
    private generateSpecId;
    private handleParseError;
    private validateDocstringFormat;
    private validateFunctionDocumentation;
    private validateTypeAnnotations;
}
export default PythonParser;
//# sourceMappingURL=python-parser.d.ts.map