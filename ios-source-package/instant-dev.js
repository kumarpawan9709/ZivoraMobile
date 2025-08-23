#!/usr/bin/env node
// Instant development startup - bypasses heavy compilation
import { spawn } from 'child_process';
import { existsSync } from 'fs';

console.log('⚡ Starting instant development mode...');

// Check if production build exists
const prodBuildExists = existsSync('./dist/index.js');

if (prodBuildExists && process.env.USE_PROD_BUILD === 'true') {
  console.log('🏗️ Using existing production build for faster startup');
  
  const server = spawn('node', ['dist/index.js'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  server.on('error', (err) => {
    console.error('❌ Production build failed, falling back to dev mode');
    startDevMode();
  });
} else {
  startDevMode();
}

function startDevMode() {
  console.log('🔧 Starting development mode with optimizations');
  
  const devServer = spawn('tsx', ['server/index.ts'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      TSX_DISABLE_WARNING: '1', // Reduce tsx warnings
      NODE_OPTIONS: '--max-old-space-size=512' // Limit memory for faster GC
    }
  });
  
  devServer.on('error', (err) => {
    console.error('❌ Development server failed:', err);
    process.exit(1);
  });
}