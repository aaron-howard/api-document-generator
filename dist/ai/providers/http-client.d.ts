/**
 * Node.js HTTP Client Implementation
 *
 * HTTP client implementation for making requests to AI providers
 * in a Node.js environment. Uses the built-in https module.
 */
/**
 * HTTP client interface for making requests
 */
export interface HTTPClient {
    request(options: {
        url: string;
        method: string;
        headers: Record<string, string>;
        body?: string;
        timeout?: number;
    }): Promise<{
        status: number;
        data: any;
    }>;
}
/**
 * Node.js HTTP client implementation
 */
export declare class NodeHTTPClient implements HTTPClient {
    request(options: {
        url: string;
        method: string;
        headers: Record<string, string>;
        body?: string;
        timeout?: number;
    }): Promise<{
        status: number;
        data: any;
    }>;
}
/**
 * Factory function to create HTTP client
 */
export declare function createHTTPClient(): HTTPClient;
export default NodeHTTPClient;
//# sourceMappingURL=http-client.d.ts.map