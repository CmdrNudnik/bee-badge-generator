# NYT Spelling Bee Badge Generator

A lightweight, browser-based tool that creates shareable New York Times Spelling Bee Genius badge URLs for a selected puzzle date.

## Features

- Select any puzzle date.
- Enter your actual point total, or leave it blank to calculate the minimum Genius score.
- Retrieves the puzzle letters and maximum score from NYT's Spelling Bee JSON endpoint.
- Generates the NYT badge URL and displays a preview.
- Copies the direct badge URL or Reddit-ready Markdown.
- Runs as a static page; no server or account is required.

## Use it

Open the published GitHub Pages site, choose the puzzle date, optionally enter your score, and select **Generate badge**. If the points field is blank, the tool calculates Genius as 70% of the maximum score, rounded down.

## GitHub Pages deployment

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then save.
4. After GitHub finishes deploying, the site should be available at:
   https://cmdrnudnik.github.io/bee-badge-generator/

## Technical notes

The page requests puzzle data from the undocumented endpoint `https://www.nytimes.com/svc/spelling-bee/v1/{date}.json`. NYT may change or discontinue this endpoint. Because NYT does not permit the GitHub Pages origin to read the endpoint directly in all browsers, this repository now includes `worker.js`, a small Cloudflare Worker proxy. Deploy it to a Cloudflare Workers URL, then configure the page to use that URL as its puzzle-data API. The Worker only accepts requests from this GitHub Pages site, validates the date, and forwards the request to NYT. It does not store scores or personal information.

The badge checksum is an MD5 digest of the exact query string `d=DATE&l=LETTERS&p=POINTS&r=Genius`, matching the format used by NYT's badge URL.

## Deploy the CORS proxy (one-time setup)\n\n1. Sign in to Cloudflare and open **Workers & Pages**.\n2. Create a Worker (for example, name it `bee-badge-api`).\n3. Replace the starter code with the contents of this repository's `worker.js`, then deploy.\n4. Copy the deployed Worker URL (it will look like `https://bee-badge-api.<your-subdomain>.workers.dev`).\n5. The page still needs to be pointed at that exact URL; update the `PUZZLE_API_BASE` setting in `index.html` to the Worker URL. The URL will be added after the Worker is deployed.\n\nTo test the Worker directly, open `https://YOUR-WORKER-URL/?date=2026-11-08`. It should return JSON containing the puzzle data.\n\n## Disclaimer

This is an unofficial fan-made project and is not affiliated with, endorsed by, or sponsored by The New York Times. NYT Spelling Bee names and badge assets belong to their respective owners.
