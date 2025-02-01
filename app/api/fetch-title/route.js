import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';

export async function POST(request) {
  try {
    const { url } = await request.json();

    // Check if the URL is valid
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Setup browser options
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url);
    const title = await page.title();
    await browser.close();

    return new Response(JSON.stringify({ title }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch title' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 