import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

// Using the public chromium pack URL
const chromiumPack = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

export const maxDuration = 300; // 5 minutes timeout

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: process.env.NODE_ENV === 'development' 
        ? process.env.CHROME_EXECUTABLE_PATH 
        : await chromium.executablePath(chromiumPack),
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const title = await page.evaluate(() => document.title);
    await browser.close();

    return NextResponse.json({ title });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch title' },
      { status: 500 }
    );
  }
} 