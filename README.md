# Financial Interface Service - Web Application

A React-based web application for managing and tracking financial invoices through multiple processing sequences.

## Features

- **Home Page**: Choose between Invoice Search, Datadog, and Health Check
- **Invoice Search**: Search invoices by Business Unit and Operating Company
- **Results Table**: View matching invoices with status indicators
- **Detail View**: 
  - Status indicators showing data completeness for 5 processing sequences
  - Transaction records grouped by sequence
  - Real-time status monitoring

## Color Scheme

- **Primary Color**: #0088D8 (Blue)
- **Secondary Color**: #0088D8 (Blue)
- **Success Color**: #4CAF50 (Green)
- **Error Color**: #f44336 (Red)
- **Background**: #FFFFFF (White)

## Project Structure

```
src/
├── components/
│   ├── HomePage.tsx             # Application selection home screen
│   ├── HomePage.css
│   ├── InvoiceSearch.tsx        # Invoice search form
│   ├── InvoiceSearch.css
│   ├── HealthCheck.tsx          # Health check placeholder screen
│   ├── HealthCheck.css
│   ├── ResultsView.tsx          # Invoice results table
│   ├── ResultsView.css
│   ├── DetailView.tsx           # Invoice detail view
│   ├── DetailView.css
│   ├── StatusBar.tsx            # Sequence status indicators
│   ├── StatusBar.css
│   ├── RecordsTable.tsx         # Transaction records table
│   └── RecordsTable.css
├── App.tsx                      # Main app component
├── App.css
├── index.tsx                    # React entry point
└── index.css                    # Global styles
public/
├── index.html                   # HTML template
└── favicon.ico
```

## Installation

1. **Install Node.js and npm** (if not already installed)
   - Download from https://nodejs.org/

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The application will open automatically in your default browser at `http://localhost:3000`

## API Requirements

The application connects to the following API endpoints:

- `GET /invoice` - Get invoice listing
- `GET /invoice/record` - Get invoice transaction records
- `GET /invoice/missing` - Get missing records status

**Default API Base URL**: `http://localhost:8080`

Make sure your backend API server is running before starting the application.

## Usage

### 1. Home Page
- Select Invoice Search to open the invoice workflow.
- Datadog is currently unavailable.
- Health Check displays a placeholder until its service is implemented.

### 2. Invoice Search
- Select a Business Unit from the dropdown (US, EU, APAC, LATAM)
- Select an Operating Company (001-005)
- Click "Search" to fetch invoices

### 3. Results Page
- View all matching invoices in a table
- Click on an invoice number to view details
- Use "Back to Search" to return to the landing page

### 4. Detail Page
- **Status Bar**: Shows the health of 5 data processing sequences
  - Green circles (✓): Data present for that sequence
  - Red circles (✗): Missing data - click for diagnostic info
- **Transaction Records**: View all transaction details grouped by sequence
- Click sequence headers to expand/collapse records

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Technologies Used

- **React 18**: UI library
- **TypeScript**: Type-safe development
- **CSS3**: Styling with custom variables
- **Fetch API**: HTTP requests

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Styling Notes

- All colors use the specified color scheme (#0088D8 for primary/secondary)
- White background throughout
- Responsive design for mobile and tablet devices
- Hover effects and smooth transitions for better UX
- Accessible contrast ratios for readability

## Future Enhancements

- Add authentication/authorization
- Implement data filtering and sorting
- Add export functionality (CSV, PDF)
- Real-time data updates with WebSocket
- Advanced search and filtering options
- Detailed error diagnostics for failed sequences
