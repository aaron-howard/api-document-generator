/**
 * Express Parser Test Suite
 * 
 * Tests the new Express.js parser functionality
 */

const { ParserService } = require('./dist/parsers/parser-service');
const fs = require('fs-extra');
const path = require('path');

// Test Express.js files
const testExpressFile = `
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  res.json({ message: 'User created' });
});

app.get('/api/users/:id', (req, res) => {
  res.json({ user: { id: req.params.id } });
});

app.put('/api/users/:id', (req, res) => {
  res.json({ message: 'User updated' });
});

app.delete('/api/users/:id', (req, res) => {
  res.json({ message: 'User deleted' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(3000);
`;

const testRouterFile = `
const express = require('express');
const router = express.Router();

// User routes
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Middleware
router.use(authMiddleware);

function getUsers(req, res) {
  res.json({ users: [] });
}

function createUser(req, res) {
  res.json({ message: 'User created' });
}

function getUserById(req, res) {
  res.json({ user: { id: req.params.id } });
}

function updateUser(req, res) {
  res.json({ message: 'User updated' });
}

function deleteUser(req, res) {
  res.json({ message: 'User deleted' });
}

function authMiddleware(req, res, next) {
  // Auth logic
  next();
}

module.exports = router;
`;

async function testExpressParser() {
  console.log('🧪 Testing Express Parser...\n');

  try {
    const parserService = new ParserService();

    // Test 1: Parse Express app file
    console.log('📝 Test 1: Parsing Express app file...');
    const appResult = await parserService.parse({
      type: 'express',
      source: 'content',
      path: testExpressFile
    });

    console.log('✅ App Parse Result:');
    console.log(`   Status: ${appResult.status}`);
    console.log(`   Endpoints: ${appResult.metadata?.endpointCount || 0}`);
    console.log(`   Parse Time: ${appResult.metadata?.parseTime || 0}s`);
    
    if (appResult.ast?.endpoints) {
      console.log('   Routes found:');
      appResult.ast.endpoints.forEach(endpoint => {
        console.log(`     ${endpoint.method} ${endpoint.path}`);
      });
    }

    // Test 2: Parse Router file
    console.log('\n📝 Test 2: Parsing Express router file...');
    const routerResult = await parserService.parse({
      type: 'express',
      source: 'content',
      path: testRouterFile
    });

    console.log('✅ Router Parse Result:');
    console.log(`   Status: ${routerResult.status}`);
    console.log(`   Endpoints: ${routerResult.metadata?.endpointCount || 0}`);
    console.log(`   Parse Time: ${routerResult.metadata?.parseTime || 0}s`);
    
    if (routerResult.ast?.endpoints) {
      console.log('   Routes found:');
      routerResult.ast.endpoints.forEach(endpoint => {
        console.log(`     ${endpoint.method} ${endpoint.path}`);
      });
    }

    // Test 3: Test CLI integration
    console.log('\n📝 Test 3: Testing CLI integration...');
    const { GenerateCommand } = require('./dist/cli/commands/generate');
    const generateCommand = new GenerateCommand();
    
    // Test Express file detection
    const expressType = generateCommand.detectInputType('src/routes/users.js');
    console.log(`   Detected type for 'src/routes/users.js': ${expressType}`);
    
    const jsdocType = generateCommand.detectInputType('src/utils/helper.js');
    console.log(`   Detected type for 'src/utils/helper.js': ${jsdocType}`);

    // Test 4: Generate documentation
    console.log('\n📝 Test 4: Generating documentation from Express routes...');
    const generationResult = await generateCommand.execute(['src/routes/users.js'], {
      format: 'html',
      output: './test-docs'
    });

    console.log('✅ Generation Result:');
    console.log(`   Status: ${generationResult.status}`);
    if (generationResult.outputPaths) {
      console.log('   Output files:');
      generationResult.outputPaths.forEach(path => {
        console.log(`     → ${path}`);
      });
    }

    console.log('\n🎉 All Express parser tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testExpressParser();
}

module.exports = { testExpressParser };
