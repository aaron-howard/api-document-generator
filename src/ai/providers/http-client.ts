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
  }): Promise<{ status: number; data: any; }>;
}

/**
 * Node.js HTTP client implementation
 */
export class NodeHTTPClient implements HTTPClient {
  async request(options: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
    timeout?: number;
  }): Promise<{ status: number; data: any; }> {
    
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

      const req = httpModule.request(requestOptions, (res: any) => {
        let data = '';
        
        res.on('data', (chunk: any) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const parsedData = data ? JSON.parse(data) : {};
            resolve({
              status: res.statusCode,
              data: parsedData
            });
          } catch (error) {
            // Return raw data if JSON parsing fails
            resolve({
              status: res.statusCode,
              data: { raw: data }
            });
          }
        });
      });

      req.on('error', (error: any) => {
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

/**
 * Factory function to create HTTP client
 */
export function createHTTPClient(): HTTPClient {
  return new NodeHTTPClient();
}

export default NodeHTTPClient;