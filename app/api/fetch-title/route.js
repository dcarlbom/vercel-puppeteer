import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let browser;
    
    if (process.env.NODE_ENV === 'development') {
      browser = await puppeteer.launch({
        headless: "new",
        executablePath: process.env.CHROME_EXECUTABLE_PATH,
      });
    } else {
      const executablePath = await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar"
      );

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      });
    }

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    
    const title = await page.title();
    await browser.close();

    if (!title) {
      return new Response(JSON.stringify({ title: 'No title found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ title }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error details:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch title',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 