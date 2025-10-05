/**
 * GraphQL Parser Implementation
 *
 * Parses GraphQL schema definitions and resolvers into standardized AST format.
 * Supports queries, mutations, subscriptions, and type definitions.
 */
import { IParser, ParseRequest, ParseResponse, ValidationResponse } from '../parser-service';
/**
 * GraphQL Parser class implementing IParser interface
 */
export declare class GraphQLParser implements IParser {
    readonly type = "graphql";
    readonly supportedExtensions: string[];
    /**
     * Check if this parser can handle the given request
     */
    canParse(request: ParseRequest): boolean;
    /**
     * Parse GraphQL schema into standardized AST format
     */
    parse(request: ParseRequest): Promise<ParseResponse>;
    /**
     * Validate parsed GraphQL AST
     */
    validate(ast: any, rules?: string[]): Promise<ValidationResponse>;
    private loadSchema;
    private loadFromFile;
    private loadFromUrl;
    private parseGraphQLDefinitions;
    private parseTypes;
    private parseQueries;
    private parseMutations;
    private parseSubscriptions;
    private parseInputs;
    private parseScalars;
    private parseFields;
    private parseField;
    private parseArguments;
    private parseType;
    private getTypeKind;
    private extractDescription;
    private convertToAST;
    private extractEndpoints;
    private extractSchemas;
    private extractComponents;
    private extractMetadata;
    private operationToHttpMethod;
    private operationToPath;
    private convertArgsToParameters;
    private generateResponsesForOperation;
    private isRequiredType;
    private graphqlTypeToJsonType;
    private endpointToPlainObject;
    private generateParseId;
    private generateSpecId;
    private handleParseError;
    private validateGraphQLSyntax;
    private validateTypeDefinitions;
    private validateResolverDefinitions;
}
export default GraphQLParser;
//# sourceMappingURL=graphql-parser.d.ts.map