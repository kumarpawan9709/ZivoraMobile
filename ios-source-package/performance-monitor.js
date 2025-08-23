#!/usr/bin/env node
// Real-time performance monitoring for Zivora startup optimization
import { performance } from 'perf_hooks';

const startTime = performance.now();
let serverStartTime = null;
let firstResponseTime = null;

console.log('📊 Performance Monitor Started');

// Monitor server startup
async function monitorStartup() {
  const attempts = 20;
  let attempt = 0;
  
  while (attempt < attempts) {
    try {
      const requestStart = performance.now();
      const response = await fetch('http://localhost:5000/api/health', {
        timeout: 2000
      });
      
      if (response.ok) {
        const requestEnd = performance.now();
        
        if (!serverStartTime) {
          serverStartTime = performance.now();
          console.log(`🚀 Server Ready: ${(serverStartTime - startTime).toFixed(0)}ms`);
        }
        
        if (!firstResponseTime) {
          firstResponseTime = requestEnd - requestStart;
          console.log(`⚡ First Response: ${firstResponseTime.toFixed(0)}ms`);
          
          // Get additional metrics
          await getPerformanceMetrics();
          break;
        }
      }
    } catch (error) {
      // Server not ready yet
    }
    
    attempt++;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  if (!serverStartTime) {
    console.log('❌ Server failed to start within 4 seconds');
  }
}

async function getPerformanceMetrics() {
  try {
    // Memory usage
    const memUsage = process.memoryUsage();
    console.log(`💾 Memory: ${(memUsage.heapUsed / 1024 / 1024).toFixed(1)}MB heap`);
    
    // Load average (if available)
    try {
      const { loadavg } = await import('os');
      console.log(`⚙️ Load: ${loadavg()[0].toFixed(2)}`);
    } catch {}
    
    // Test multiple endpoints for comprehensive timing
    const endpoints = ['/api/health', '/', '/mobile-onboarding'];
    
    console.log('\n🔍 Endpoint Response Times:');
    for (const endpoint of endpoints) {
      try {
        const start = performance.now();
        const response = await fetch(`http://localhost:5000${endpoint}`, {
          timeout: 3000
        });
        const end = performance.now();
        
        const status = response.ok ? '✅' : '❌';
        console.log(`  ${status} ${endpoint}: ${(end - start).toFixed(0)}ms`);
      } catch (error) {
        console.log(`  ❌ ${endpoint}: timeout/error`);
      }
    }
    
    // Performance summary
    console.log(`\n📈 PERFORMANCE SUMMARY:`);
    console.log(`  Total Startup: ${(serverStartTime - startTime).toFixed(0)}ms`);
    console.log(`  First Response: ${firstResponseTime.toFixed(0)}ms`);
    console.log(`  Memory Usage: ${(memUsage.heapUsed / 1024 / 1024).toFixed(1)}MB`);
    
    // Performance rating
    const totalTime = serverStartTime - startTime;
    let rating = '🔴 Slow (>4s)';
    if (totalTime < 2000) rating = '🟢 Excellent (<2s)';
    else if (totalTime < 3000) rating = '🟡 Good (<3s)';
    else if (totalTime < 4000) rating = '🟠 Fair (<4s)';
    
    console.log(`  Rating: ${rating}`);
    
  } catch (error) {
    console.log('❌ Failed to get performance metrics:', error.message);
  }
}

// Start monitoring
monitorStartup();

// Keep monitoring for 30 seconds
setTimeout(() => {
  console.log('\n🏁 Performance monitoring complete');
  process.exit(0);
}, 30000);