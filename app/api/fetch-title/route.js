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
      // Configure chromium for Vercel
      chromium.setHeadlessMode = true;
      chromium.setGraphicsMode = false;
      
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--single-process',
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true,
      });
    }

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    
    try {
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
    } catch (pageError) {
      await browser.close();
      throw pageError;
    }

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