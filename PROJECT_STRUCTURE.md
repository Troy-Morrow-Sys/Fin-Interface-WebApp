# Project Structure

```text
Fin-Interface-WebApp/
├── public/
│   ├── index.html             # Static HTML entry point and API configuration
│   ├── app.js                 # Plain JavaScript UI and API behavior
│   ├── styles.css             # Responsive styles
│   └── images/sysco-logo.png  # Portal logo
├── API_DOCUMENTATION.md
├── DROPDOWN_ENDPOINTS_DOCUMENTATION.md
└── HEALTH_ENDPOINT_DOCUMENTATION.md
```

Open `public/index.html` directly in a browser. The app has no build or server requirement. API requests from a `file://` page require the backend to allow the browser's `null` origin through CORS.
