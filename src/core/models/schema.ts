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
  
  // Numeric constraints
  readonly multipleOf?: number;
  readonly maximum?: number;
  readonly exclusiveMaximum?: boolean | number;
  readonly minimum?: number;
  readonly exclusiveMinimum?: boolean | number;
  
  // String constraints
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly pattern?: string;
  
  // Array constraints
  readonly items?: SchemaObject | SchemaObject[];
  readonly additionalItems?: boolean | SchemaObject;
  readonly maxItems?: number;
  readonly minItems?: number;
  readonly uniqueItems?: boolean;
  readonly contains?: SchemaObject;
  
  // Object constraints
  readonly properties?: Record<string, SchemaObject>;
  readonly additionalProperties?: boolean | SchemaObject;
  readonly required?: string[];
  readonly maxProperties?: number;
  readonly minProperties?: number;
  readonly patternProperties?: Record<string, SchemaObject>;
  readonly propertyNames?: SchemaObject;
  
  // Composition
  readonly allOf?: SchemaObject[];
  readonly oneOf?: SchemaObject[];
  readonly anyOf?: SchemaObject[];
  readonly not?: SchemaObject;
  
  // Conditional schemas
  readonly if?: SchemaObject;
  readonly then?: SchemaObject;
  readonly else?: SchemaObject;
  
  // References
  readonly $ref?: string;
  readonly $id?: string;
  readonly $schema?: string;
  readonly $comment?: string;
  
  // OpenAPI-specific
  readonly discriminator?: Discriminator;
  readonly readOnly?: boolean;
  readonly writeOnly?: boolean;
  readonly xml?: XmlObject;
  readonly externalDocs?: {
    readonly description?: string;
    readonly url: string;
  };
  readonly deprecated?: boolean;
  
  // Extensions
  readonly [key: string]: any;
}

export enum SchemaType {
  NULL = 'null',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  NUMBER = 'number',
  INTEGER = 'integer',
  STRING = 'string',
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
export class SchemaUtils {
  /**
   * Resolve a schema reference to the actual schema object
   */
  static resolveReference(ref: string, document: any): SchemaObject | undefined {
    if (!ref.startsWith('#/')) {
      throw new Error(`External references not supported: ${ref}`);
    }
    
    const path = ref.substring(2).split('/');
    let current = document;
    
    for (const segment of path) {
      current = current[segment];
      if (current === undefined) {
        return undefined;
      }
    }
    
    return current as SchemaObject;
  }

  /**
   * Check if a schema is a reference
   */
  static isReference(schema: SchemaObject): boolean {
    return schema.$ref !== undefined;
  }

  /**
   * Get all required properties for an object schema
   */
  static getRequiredProperties(schema: SchemaObject): string[] {
    return schema.required || [];
  }

  /**
   * Get all properties for an object schema, including inherited ones
   */
  static getAllProperties(schema: SchemaObject, document?: any): Record<string, SchemaObject> {
    const properties: Record<string, SchemaObject> = { ...schema.properties };
    
    // Handle allOf composition
    if (schema.allOf) {
      for (const subSchema of schema.allOf) {
        const resolvedSchema = this.isReference(subSchema) && document
          ? this.resolveReference(subSchema.$ref!, document)
          : subSchema;
        
        if (resolvedSchema?.properties) {
          Object.assign(properties, resolvedSchema.properties);
        }
      }
    }
    
    return properties;
  }

  /**
   * Check if a schema represents a primitive type
   */
  static isPrimitive(schema: SchemaObject): boolean {
    if (!schema.type) return false;
    
    const primitiveTypes = [
      SchemaType.STRING,
      SchemaType.NUMBER,
      SchemaType.INTEGER,
      SchemaType.BOOLEAN,
      SchemaType.NULL
    ];
    
    if (Array.isArray(schema.type)) {
      return schema.type.every(type => primitiveTypes.includes(type));
    }
    
    return primitiveTypes.includes(schema.type);
  }

  /**
   * Generate a default value for a schema
   */
  static generateDefaultValue(schema: SchemaObject): any {
    if (schema.default !== undefined) {
      return schema.default;
    }
    
    if (schema.const !== undefined) {
      return schema.const;
    }
    
    if (schema.enum && schema.enum.length > 0) {
      return schema.enum[0];
    }
    
    switch (schema.type) {
      case SchemaType.STRING:
        return '';
      case SchemaType.NUMBER:
      case SchemaType.INTEGER:
        return 0;
      case SchemaType.BOOLEAN:
        return false;
      case SchemaType.ARRAY:
        return [];
      case SchemaType.OBJECT:
        return {};
      case SchemaType.NULL:
        return null;
      default:
        return undefined;
    }
  }

  /**
   * Generate an example value for a schema
   */
  static generateExampleValue(schema: SchemaObject, document?: any, visited = new Set<string>()): any {
    // Prevent infinite recursion
    if (schema.$ref && visited.has(schema.$ref)) {
      return null;
    }
    
    if (schema.$ref) {
      visited.add(schema.$ref);
      const resolvedSchema = document 
        ? this.resolveReference(schema.$ref, document)
        : undefined;
      
      if (resolvedSchema) {
        return this.generateExampleValue(resolvedSchema, document, visited);
      }
    }
    
    if (schema.example !== undefined) {
      return schema.example;
    }
    
    if (schema.examples && schema.examples.length > 0) {
      return schema.examples[0];
    }
    
    if (schema.enum && schema.enum.length > 0) {
      return schema.enum[0];
    }
    
    switch (schema.type) {
      case SchemaType.STRING:
        return this.generateStringExample(schema);
      case SchemaType.NUMBER:
        return this.generateNumberExample(schema);
      case SchemaType.INTEGER:
        return this.generateIntegerExample(schema);
      case SchemaType.BOOLEAN:
        return true;
      case SchemaType.ARRAY:
        return this.generateArrayExample(schema, document, visited);
      case SchemaType.OBJECT:
        return this.generateObjectExample(schema, document, visited);
      case SchemaType.NULL:
        return null;
      default:
        return undefined;
    }
  }

  private static generateStringExample(schema: SchemaObject): string {
    if (schema.format) {
      switch (schema.format) {
        case 'date':
          return '2024-01-15';
        case 'date-time':
          return '2024-01-15T10:30:00Z';
        case 'email':
          return 'user@example.com';
        case 'uri':
          return 'https://example.com';
        case 'uuid':
          return '123e4567-e89b-12d3-a456-426614174000';
        case 'password':
          return '********';
        default:
          return 'string';
      }
    }
    
    if (schema.pattern) {
      // Simple pattern-based examples
      if (schema.pattern.includes('[0-9]')) {
        return '123';
      }
      if (schema.pattern.includes('[a-z]')) {
        return 'abc';
      }
    }
    
    const minLength = schema.minLength || 0;
    const maxLength = schema.maxLength || Math.max(10, minLength);
    const length = Math.min(maxLength, Math.max(minLength, 5));
    
    return 'example'.substring(0, length).padEnd(length, 'x');
  }

  private static generateNumberExample(schema: SchemaObject): number {
    const min = schema.minimum || 0;
    const max = schema.maximum || 100;
    return Math.random() * (max - min) + min;
  }

  private static generateIntegerExample(schema: SchemaObject): number {
    const min = schema.minimum || 0;
    const max = schema.maximum || 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static generateArrayExample(schema: SchemaObject, document?: any, visited = new Set<string>()): any[] {
    if (!schema.items) {
      return [];
    }
    
    const minItems = schema.minItems || 0;
    const maxItems = schema.maxItems || Math.max(3, minItems);
    const length = Math.min(maxItems, Math.max(minItems, 1));
    
    const items = Array.isArray(schema.items) ? schema.items[0] : schema.items;
    if (!items) {
      return [];
    }
    const example = this.generateExampleValue(items, document, visited);
    
    return Array(length).fill(null).map(() => example);
  }

  private static generateObjectExample(schema: SchemaObject, document?: any, visited = new Set<string>()): any {
    const example: any = {};
    const properties = this.getAllProperties(schema, document);
    const required = this.getRequiredProperties(schema);
    
    // Generate examples for required properties
    for (const propName of required) {
      if (propName in properties) {
        const propSchema = properties[propName];
        if (propSchema) {
          example[propName] = this.generateExampleValue(propSchema, document, visited);
        }
      }
    }
    
    // Generate examples for a few optional properties
    const optionalProps = Object.keys(properties).filter(name => !required.includes(name));
    const numOptional = Math.min(2, optionalProps.length);
    
    for (let i = 0; i < numOptional; i++) {
      const propName = optionalProps[i];
      if (propName && propName in properties) {
        const propSchema = properties[propName];
        if (propSchema) {
          example[propName] = this.generateExampleValue(propSchema, document, visited);
        }
      }
    }
    
    return example;
  }
}