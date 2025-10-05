"use strict";
/**
 * Node.js HTTP Client Implementation
 *
 * HTTP client implementation for making requests to AI providers
 * in a Node.js environment. Uses the built-in https module.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHTTPClient = void 0;
exports.createHTTPClient = createHTTPClient;
/**
 * Node.js HTTP client implementation
 */
class NodeHTTPClient {
    async request(options) {
        return new Promise((resolve, reject) => {
            // Parse URL
            const urlObj = new URL(options.url);
            const isHttps = urlObj.protocol === 'https:';
            // Import appropriate module
            const httpModule = isHttps ? require('https') : require('http');
            // Request options
            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: options.method,
                headers: {
                    ...options.headers,
                    'Content-Length': options.body ? Buffer.byteLength(options.body) : 0
                },
                timeout: options.timeout || 30000
            };
            const req = httpModule.request(requestOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsedData = data ? JSON.parse(data) : {};
                        resolve({
                            status: res.statusCode,
                            data: parsedData
                        });
                    }
                    catch (error) {
                        // Return raw data if JSON parsing fails
                        resolve({
                            status: res.statusCode,
                            data: { raw: data }
                        });
                    }
                });
            });
            req.on('error', (error) => {
                reject(new Error(`HTTP request failed: ${error.message}`));
            });
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('HTTP request timeout'));
            });
            // Write body if present
            if (options.body) {
                req.write(options.body);
            }
            req.end();
        });
    }
}
exports.NodeHTTPClient = NodeHTTPClient;
/**
 * Factory function to create HTTP client
 */
function createHTTPClient() {
    return new NodeHTTPClient();
}
exports.default = NodeHTTPClient;
//# sourceMappingURL=http-client.js.map