# Finance Integration Ops Portal

A static financial operations interface built with plain HTML, CSS, and JavaScript. It has no framework, build step, package dependencies, or app server.

## Open the Page

Open `public/index.html` in a browser. The static files use relative paths, so the page and logo load directly from disk.

The invoice API defaults to `http://localhost:8080`. Change `window.APP_CONFIG.apiBaseUrl` in `public/index.html` to configure another endpoint. Directly opened `file://` pages have a browser origin of `null`; the backend must allow that origin through CORS for API requests to work.

## Features

- Home screen for Invoice Search, Datadog dashboards, and the Health Check placeholder
- Business Unit and dependent Operating Company selectors
- Invoice search with number filtering and pagination
- Invoice transaction details and five sequence status indicators
- On-demand health checks for missing sequences
- Select a Datadog dashboard and open it in a new tab

## Static Files

- `public/index.html`: page shell and API configuration
- `public/app.js`: UI rendering, navigation, state, and API requests
- `public/styles.css`: responsive styling
- `public/images/sysco-logo.png`: portal logo

Each dashboard URL is configured in `public/app.js`; selecting a dashboard updates the **Open in new tab** link. Backend endpoint contracts are documented in `API_DOCUMENTATION.md`, `DROPDOWN_ENDPOINTS_DOCUMENTATION.md`, and `HEALTH_ENDPOINT_DOCUMENTATION.md`.
