#!/usr/bin/env node
/**
 * Main Server Entry Point
 * 
 * Starts the API Documentation Generator CLI system.
 * All services (T023-T031) are available through the CLI interface.
 */

import { CLIService } from './cli/cli-service';

/**
 * Main server startup function
 */
async function startServer(): Promise<void> {
  console.log('🚀 Starting API Documentation Generator - CLI System');
  console.log('='.repeat(80));
  
  try {
    // Initialize the CLI service
    new CLIService();
    
    console.log('\n✅ API Documentation Generator CLI is ready!');
    console.log('\n📋 Available Commands:');
    console.log('  • npx api-doc-gen generate <file>     - Generate documentation');
    console.log('  • npx api-doc-gen validate <file>     - Validate API specs');
    console.log('  • npx api-doc-gen diff <v1> <v2>      - Generate changelog');
    console.log('  • npx api-doc-gen init                - Initialize config');
    console.log('  • npx api-doc-gen config              - Manage configuration');
    console.log('\n🎯 All T023-T031 services are integrated and ready!');
    console.log('\nExample usage:');
    console.log('  npx api-doc-gen generate ./api-spec.yaml');
    console.log('  npx api-doc-gen validate --strict ./openapi.json');
    console.log('  npx api-doc-gen diff v1/api.yaml v2/api.yaml');
    console.log('\nFor detailed help: npx api-doc-gen --help');

  } catch (error) {
    console.error('❌ Failed to start API Documentation Generator:', error);
    process.exit(1);
  }
}

// Start the server if this file is executed directly
if (require.main === module) {
  startServer().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { startServer };
