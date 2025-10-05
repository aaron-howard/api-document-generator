"use strict";
/**
 * Schema and data model definitions for API specifications
 * Supports JSON Schema and OpenAPI schema formats
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaUtils = exports.SchemaType = void 0;
var SchemaType;
(function (SchemaType) {
    SchemaType["NULL"] = "null";
    SchemaType["BOOLEAN"] = "boolean";
    SchemaType["OBJECT"] = "object";
    SchemaType["ARRAY"] = "array";
    SchemaType["NUMBER"] = "number";
    SchemaType["INTEGER"] = "integer";
    SchemaType["STRING"] = "string";
})(SchemaType || (exports.SchemaType = SchemaType = {}));
/**
 * Utility functions for working with schemas
 */
class SchemaUtils {
    /**
     * Resolve a schema reference to the actual schema object
     */
    static resolveReference(ref, document) {
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
        return current;
    }
    /**
     * Check if a schema is a reference
     */
    static isReference(schema) {
        return schema.$ref !== undefined;
    }
    /**
     * Get all required properties for an object schema
     */
    static getRequiredProperties(schema) {
        return schema.required || [];
    }
    /**
     * Get all properties for an object schema, including inherited ones
     */
    static getAllProperties(schema, document) {
        const properties = { ...schema.properties };
        // Handle allOf composition
        if (schema.allOf) {
            for (const subSchema of schema.allOf) {
                const resolvedSchema = this.isReference(subSchema) && document
                    ? this.resolveReference(subSchema.$ref, document)
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
    static isPrimitive(schema) {
        if (!schema.type)
            return false;
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
    static generateDefaultValue(schema) {
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
    static generateExampleValue(schema, document, visited = new Set()) {
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
    static generateStringExample(schema) {
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
    static generateNumberExample(schema) {
        const min = schema.minimum || 0;
        const max = schema.maximum || 100;
        return Math.random() * (max - min) + min;
    }
    static generateIntegerExample(schema) {
        const min = schema.minimum || 0;
        const max = schema.maximum || 100;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static generateArrayExample(schema, document, visited = new Set()) {
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
    static generateObjectExample(schema, document, visited = new Set()) {
        const example = {};
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
exports.SchemaUtils = SchemaUtils;
//# sourceMappingURL=schema.js.map