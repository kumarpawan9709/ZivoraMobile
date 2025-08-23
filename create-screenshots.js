import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function createScreenshots() {
  console.log('Starting screenshot generation...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  
  const baseUrl = 'https://3ee4d6a9-e442-4a38-b9d4-69a8bb496f55-00-2spibzzix19bx.janeway.replit.dev';
  
  const screenshots = [
    { name: '1-onboarding-brain-anatomy', url: '/mobile-onboarding' },
    { name: '2-symptom-recognition', url: '/mobile-onboarding-2' },
    { name: '3-risk-analytics', url: '/mobile-onboarding-3' },
    { name: '4-authentication', url: '/login' },
    { name: '5-dashboard-risk-monitoring', url: '/dashboard', requiresAuth: true },
    { name: '6-daily-health-tracking', url: '/daily-log', requiresAuth: true },
    { name: '7-ai-insights', url: '/insights', requiresAuth: true },
    { name: '8-history-trends', url: '/history', requiresAuth: true }
  ];
  
  // First, authenticate
  console.log('Authenticating...');
  await page.goto(`${baseUrl}/login`);
  await page.waitForTimeout(2000);
  
  try {
    await page.type('input[type="email"]', 'demo@zivora.com');
    await page.type('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  } catch (e) {
    console.log('Auth may not be needed for some screenshots');
  }
  
  // Take screenshots
  for (const screenshot of screenshots) {
    console.log(`Taking screenshot: ${screenshot.name}`);
    
    try {
      await page.goto(`${baseUrl}${screenshot.url}`, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(3000);
      
      await page.screenshot({
        path: `zivora-screenshots/${screenshot.name}.png`,
        fullPage: false
      });
      
      console.log(`✅ ${screenshot.name}.png created`);
    } catch (error) {
      console.log(`❌ Error with ${screenshot.name}: ${error.message}`);
    }
  }
  
  await browser.close();
  console.log('Screenshot generation complete!');
}

createScreenshots().catch(console.error);