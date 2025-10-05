/**
 * Schema and data model definitions for API specifications
 * Supports JSON Schema and OpenAPI schema formats
 */
export interface DataModel {
    readonly name: string;
    readonly schema: SchemaObject;
    readonly description?: string;
    readonly examples?: any[];
    readonly deprecated?: boolean;
    readonly externalDocs?: {
        readonly description?: string;
        readonly url: string;
    };
}
export interface SchemaObject {
    readonly type?: SchemaType | SchemaType[];
    readonly format?: string;
    readonly title?: string;
    readonly description?: string;
    readonly default?: any;
    readonly example?: any;
    readonly examples?: any[];
    readonly enum?: any[];
    readonly const?: any;
    readonly multipleOf?: number;
    readonly maximum?: number;
    readonly exclusiveMaximum?: boolean | number;
    readonly minimum?: number;
    readonly exclusiveMinimum?: boolean | number;
    readonly maxLength?: number;
    readonly minLength?: number;
    readonly pattern?: string;
    readonly items?: SchemaObject | SchemaObject[];
    readonly additionalItems?: boolean | SchemaObject;
    readonly maxItems?: number;
    readonly minItems?: number;
    readonly uniqueItems?: boolean;
    readonly contains?: SchemaObject;
    readonly properties?: Record<string, SchemaObject>;
    readonly additionalProperties?: boolean | SchemaObject;
    readonly required?: string[];
    readonly maxProperties?: number;
    readonly minProperties?: number;
    readonly patternProperties?: Record<string, SchemaObject>;
    readonly propertyNames?: SchemaObject;
    readonly allOf?: SchemaObject[];
    readonly oneOf?: SchemaObject[];
    readonly anyOf?: SchemaObject[];
    readonly not?: SchemaObject;
    readonly if?: SchemaObject;
    readonly then?: SchemaObject;
    readonly else?: SchemaObject;
    readonly $ref?: string;
    readonly $id?: string;
    readonly $schema?: string;
    readonly $comment?: string;
    readonly discriminator?: Discriminator;
    readonly readOnly?: boolean;
    readonly writeOnly?: boolean;
    readonly xml?: XmlObject;
    readonly externalDocs?: {
        readonly description?: string;
        readonly url: string;
    };
    readonly deprecated?: boolean;
    readonly [key: string]: any;
}
export declare enum SchemaType {
    NULL = "null",
    BOOLEAN = "boolean",
    OBJECT = "object",
    ARRAY = "array",
    NUMBER = "number",
    INTEGER = "integer",
    STRING = "string"
}
export interface Discriminator {
    readonly propertyName: string;
    readonly mapping?: Record<string, string>;
}
export interface XmlObject {
    readonly name?: string;
    readonly namespace?: string;
    readonly prefix?: string;
    readonly attribute?: boolean;
    readonly wrapped?: boolean;
}
/**
 * Utility functions for working with schemas
 */
export declare class SchemaUtils {
    /**
     * Resolve a schema reference to the actual schema object
     */
    static resolveReference(ref: string, document: any): SchemaObject | undefined;
    /**
     * Check if a schema is a reference
     */
    static isReference(schema: SchemaObject): boolean;
    /**
     * Get all required properties for an object schema
     */
    static getRequiredProperties(schema: SchemaObject): string[];
    /**
     * Get all properties for an object schema, including inherited ones
     */
    static getAllProperties(schema: SchemaObject, document?: any): Record<string, SchemaObject>;
    /**
     * Check if a schema represents a primitive type
     */
    static isPrimitive(schema: SchemaObject): boolean;
    /**
     * Generate a default value for a schema
     */
    static generateDefaultValue(schema: SchemaObject): any;
    /**
     * Generate an example value for a schema
     */
    static generateExampleValue(schema: SchemaObject, document?: any, visited?: Set<string>): any;
    private static generateStringExample;
    private static generateNumberExample;
    private static generateIntegerExample;
    private static generateArrayExample;
    private static generateObjectExample;
}
//# sourceMappingURL=schema.d.ts.map