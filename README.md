# URL Title Fetcher

A simple web application that fetches webpage titles using Puppeteer. Built with Next.js and Tailwind CSS, deployed on Vercel.

## Features

- Clean, Google-like interface
- Fetches webpage titles from any valid URL
- Works both locally and in production (Vercel)
- Uses @sparticuz/chromium-min for serverless compatibility

## Prerequisites

- Node.js (v16 or higher)
- For local development: Google Chrome installed
- Vercel Pro account (required due to execution time limits)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dcarlbom/vercel-puppeteer.git
cd vercel-puppeteer
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```bash
CHROME_EXECUTABLE_PATH="/usr/bin/google-chrome"  # for Linux
# CHROME_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"  # for Mac
# CHROME_EXECUTABLE_PATH="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"  # for Windows 
```

Also make sure to add the following to the Vercel environment variables:

```bash
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## WSL Setup

If running in WSL, install Chrome:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt update
sudo apt install ./google-chrome-stable_current_amd64.deb -y
```


## How It Works

The application uses different configurations for development and production:

### Development
- Uses local Chrome installation
- Requires CHROME_EXECUTABLE_PATH environment variable
- Direct access to Chrome binary

### Production (Vercel)
- Uses @sparticuz/chromium-min for serverless compatibility
- Downloads chromium from a hosted tar file
- Runs in serverless environment with specific configurations

## Technical Details

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Next.js API Routes
- **Browser Automation**: puppeteer-core
- **Chromium**: @sparticuz/chromium-min v132.0.0
- **Deployment**: Vercel (Pro plan required)

## Important Notes

1. **Vercel Pro Required**: The application requires Vercel Pro due to:
   - Execution time limits (>10 seconds needed)
   - Memory requirements for Chromium
   - Function size limitations

2. **Environment Specific Code**: The application detects the environment and uses appropriate configurations:
   ```javascript
   executablePath: process.env.NODE_ENV === 'development' 
     ? process.env.CHROME_EXECUTABLE_PATH 
     : await chromium.executablePath(chromiumPack)
   ```

3. **Timeout Configuration**: The API route includes a 5-minute timeout:
   ```javascript
   export const maxDuration = 300; // seconds
   ```

## Limitations

- Requires Vercel Pro account
- Some websites might block automated access
- Title fetching might fail for JavaScript-rendered content
- Maximum execution time of 5 minutes

## Tech Stack

- Next.js 14.2.23
- Tailwind CSS
- puppeteer-core ^24.1.1
- @sparticuz/chromium-min 132.0.0

## License

MIT
