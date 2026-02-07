import { chromium } from '@playwright/test';

const viewports = [
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

async function takeScreenshots() {
  const browser = await chromium.launch();

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000); // Wait for animations to settle
    await page.screenshot({ path: `screenshot-${vp.name}.png`, fullPage: false });
    console.log(`Captured ${vp.name} (${vp.width}x${vp.height})`);
    await context.close();
  }

  await browser.close();
  console.log('Done!');
}

takeScreenshots();
