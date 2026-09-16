# Financial Interface Web Application - Setup Guide

## Quick Start

### Prerequisites
- Node.js (v14 or higher) - Download from https://nodejs.org/
- npm (comes with Node.js)
- Backend API server running on `http://localhost:8080`

### Installation Steps

1. **Open Terminal/Command Prompt**
   - Navigate to the project directory:
     ```bash
     cd "c:\Users\tmor1230\UI Projects\Fin-Interface-WebApp"
     ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will download and install all required packages (React, TypeScript, etc.)

3. **Start Development Server**
   ```bash
   npm start
   ```
   The application will automatically open in your browser at `http://localhost:3000`

4. **Verify Backend Connection**
   - Make sure your backend API is running on `http://localhost:8080`
   - If the API is on a different URL, update the `.env` file:
     ```
     REACT_APP_API_BASE_URL=http://your-api-url:port
     ```
   - Restart the development server after changing the `.env` file

## Available Scripts

### `npm start`
- Runs the app in development mode
- Opens [http://localhost:3000](http://localhost:3000) in the browser
- Page reloads when you make changes
- Shows build errors and lint warnings in the console

### `npm build`
- Builds the app for production to the `build` folder
- Correctly bundles React in production mode
- Optimizes the build for the best performance

### `npm test`
- Launches the test runner
- Runs tests matching `*.test.ts` or `*.test.tsx` files
- Watch mode enabled by default

## Project Structure

```
Fin-Interface-WebApp/
├── public/
│   └── index.html                 # Main HTML file
├── src/
│   ├── components/
│   │   ├── HomePage.tsx           # Application selection home screen
│   │   ├── HomePage.css
│   │   ├── InvoiceSearch.tsx      # Search page
│   │   ├── InvoiceSearch.css
│   │   ├── ResultsView.tsx        # Results table
│   │   ├── ResultsView.css
│   │   ├── DetailView.tsx         # Detail page
│   │   ├── DetailView.css
│   │   ├── StatusBar.tsx          # Status indicators
│   │   ├── StatusBar.css
│   │   ├── RecordsTable.tsx       # Records table
│   │   └── RecordsTable.css
│   ├── App.tsx                    # Main component
│   ├── App.css
│   ├── index.tsx                  # React entry point
│   ├── index.css                  # Global styles
│   └── react-app-env.d.ts         # Type definitions
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```

## Application Flow

### 1. Landing Page (`/`)
- Select Business Unit (US, EU, APAC, LATAM)
- Select Operating Company (001-005)
- Click "Search" button
- Calls: `GET /invoice?businessUnit={bu}&opco={opco}`

### 2. Results Page
- Displays table with:
  - Invoice Number (clickable)
  - Business Unit
  - Operating Company
  - Status badge
- Click invoice number to view details
- Click "Back to Search" to return to landing page

### 3. Detail Page
- **Status Bar** (top)
  - 5 circular indicators (Seq 1-5)
  - Green ✓ = Data present
  - Red ✗ = Missing data (clickable)
  - Calls: `GET /invoice/missing?invoiceKey={key}`

- **Records Table**
  - Expandable sequence groups
  - Shows transaction details
  - Calls: `GET /invoice/record?invoiceKey={key}`

## API Endpoints

Your backend API must provide these endpoints:

### GET /invoice
**Parameters:**
- `businessUnit` (string, required): e.g., "US", "EU"
- `opco` (string, required): e.g., "001", "002"

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Data successfully retrieved from Database",
  "records": [
    {
      "businessUnit": "US",
      "opco": "001",
      "invoiceNumber": "INV-2024-001",
      "invoiceKey": "US001INV-2024-001",
      "targetStatus": "COMPLETED"
    }
  ]
}
```

### GET /invoice/record
**Parameters:**
- `invoiceKey` (string, required): e.g., "US001INV-2024-001"

**Response:**
```json
{
  "status": "SUCCESS",
  "message": "Data successfully retrieved from Database",
  "records": [
    {
      "businessUnit": "US",
      "opco": "001",
      "invoiceNumber": "INV-2024-001",
      "flowName": "Flow_StgToRDS_AR",
      "seqId": "1",
      "invoiceKey": "US001INV-2024-001",
      "transactionId": "TXN-001-STG",
      "transactionTimestamp": "2024-01-15T10:30:00",
      "targetStatus": "COMPLETED"
    }
  ]
}
```

### GET /invoice/missing
**Parameters:**
- `invoiceKey` (string, required): e.g., "US001INV-2024-001"

**Response:**
```json
{
  "invoiceKey": "US001INV-2024-001",
  "missingRecords": "YYYYY"
}
```
- Each character represents one sequence (1-5)
- 'Y' = records exist, 'N' = no records found

## Color Scheme

- **Primary/Secondary**: #0088D8 (Blue)
- **Background**: #FFFFFF (White)
- **Success**: #4CAF50 (Green)
- **Error**: #f44336 (Red)
- **Borders**: #e0e0e0 (Light Gray)

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or not in PATH
- Download and install from https://nodejs.org/

### "Cannot GET /invoice" (API errors)
- Backend API is not running
- API is running on different URL - update `.env` file
- Check backend logs for errors

### "Port 3000 is already in use"
- Another process is using port 3000
- Run: `npm start -- --port 3001`
- Or close the other application using port 3000

### Blank page or styling issues
- Clear browser cache: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Delete `node_modules` and run `npm install` again
- Check browser console (F12) for JavaScript errors

### Slow loading or network errors
- Check browser DevTools (F12) Network tab
- Verify backend API is responding
- Check `.env` file for correct API URL

## Performance Tips

1. **Development Build** (faster, default)
   - Used by `npm start`
   - Includes all debugging info
   - Slightly slower at runtime

2. **Production Build** (optimized)
   - Run: `npm run build`
   - Creates optimized files in `build/` folder
   - Smaller file sizes
   - Better performance

3. **Browser DevTools**
   - Open with F12 or Ctrl+Shift+I
   - Use Network tab to see API calls
   - Use Console tab for error messages

## Deployment

### To a Web Server
1. Build the production version:
   ```bash
   npm run build
   ```

2. Copy the contents of the `build` folder to your web server

3. Configure server to serve `index.html` for all routes

### Environment Variables for Production
Create `.env.production` with:
```
REACT_APP_API_BASE_URL=https://your-production-api-url
```

## Support

For issues or questions:
1. Check the browser console for error messages
2. Review the backend API logs
3. Verify the `.env` file configuration
4. Ensure all dependencies are installed with `npm install`

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)
