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

The page requests puzzle data from the undocumented endpoint `https://www.nytimes.com/svc/spelling-bee/v1/{date}.json`. NYT may change or discontinue this endpoint. Browser access may also be blocked by cross-origin (CORS) policy; if that happens, the page reports the problem rather than guessing puzzle data or generating an unreliable badge. A small server-side proxy (for example, a Cloudflare Worker) would be the next step if browser requests are blocked.

The badge checksum is an MD5 digest of the exact query string `d=DATE&l=LETTERS&p=POINTS&r=Genius`, matching the format used by NYT's badge URL.

## Disclaimer

This is an unofficial fan-made project and is not affiliated with, endorsed by, or sponsored by The New York Times. NYT Spelling Bee names and badge assets belong to their respective owners.
