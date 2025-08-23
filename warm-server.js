// Server warming script - keeps app responsive
import http from 'http';

const WARM_INTERVAL = 45000; // 45 seconds (before Replit 60s timeout)
const MAX_RETRIES = 3;

async function keepWarm() {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        console.log(`🔥 Server warmed at ${new Date().toISOString()}`);
        return;
      }
    } catch (error) {
      retries++;
      console.log(`🧊 Warm attempt ${retries} failed:`, error.message);
      
      if (retries < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  console.log('❄️ Server warming failed after max retries');
}

// Initial warm
keepWarm();

// Keep warming every 45 seconds
setInterval(keepWarm, WARM_INTERVAL);

console.log('🌡️ Server warming service started');