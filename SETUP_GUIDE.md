# Setup Guide

## Open Locally

1. Make sure the backend API is running at `http://localhost:8080`.
2. Open `public/index.html` in a browser.

No Node.js, npm install, build, or application server is needed.

## Configure the API

In `public/index.html`, set `window.APP_CONFIG.apiBaseUrl` to the backend base URL. The default is `http://localhost:8080`.

Browsers treat a page opened from disk as the `null` origin. The backend must allow that origin through CORS for API requests to succeed. If it does not, deploy the static files in `public/` to an existing web host allowed by the API.

## Deploy

Copy the contents of `public/` to a static web host, configure the API URL in `index.html`, and ensure the backend CORS policy allows the hosted page's origin.

## Files

- `public/index.html`: standalone HTML page and API configuration
- `public/app.js`: plain JavaScript UI and API logic
- `public/styles.css`: page styles
- `public/images/sysco-logo.png`: logo asset

See the API documentation Markdown files for endpoint request and response formats.
