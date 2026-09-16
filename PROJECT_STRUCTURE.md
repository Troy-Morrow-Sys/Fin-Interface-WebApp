# Project Structure Summary

## React Financial Interface Web Application

### Root Files
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables
- `.gitignore` - Git ignore patterns
- `README.md` - Project documentation

### Source Files (`src/`)
```
src/
├── index.tsx              # React entry point
├── index.css              # Global styles
├── App.tsx                # Main application component
├── App.css                # App container styles
├── App.test.tsx           # App component tests
├── react-app-env.d.ts     # React type definitions
│
└── components/
   ├── HomePage.tsx       # Application selection home screen
   ├── HomePage.css       # Home screen styles
   ├── InvoiceSearch.tsx  # Invoice search component
   ├── InvoiceSearch.css  # Invoice search styles
    │
    ├── ResultsView.tsx    # Results table component
    ├── ResultsView.css    # Results table styles
    │
    ├── DetailView.tsx     # Detail view component
    ├── DetailView.css     # Detail view styles
    │
    ├── StatusBar.tsx      # Status indicator component
    ├── StatusBar.css      # Status indicator styles
    │
    ├── RecordsTable.tsx   # Records table component
    └── RecordsTable.css   # Records table styles
```

### Public Files (`public/`)
```
public/
└── index.html             # HTML template
```

## Color Scheme
- Primary/Secondary: #0088D8 (Blue)
- Background: #FFFFFF (White)
- Success: #4CAF50 (Green)
- Error: #f44336 (Red)

## Component Hierarchy

```
App (State Management)
├── HomePage (Application Selection)
├── InvoiceSearch (Search Interface)
│   └── Business Unit & Opco Dropdowns
│
├── ResultsView (Invoice Table)
│   └── Clickable Invoice Links
│
└── DetailView (Invoice Details)
    ├── StatusBar (5 Sequence Indicators)
    └── RecordsTable (Transaction Records by Sequence)
        └── Expandable Sequence Groups
```

## Key Features

1. **Landing Page**
   - Business Unit selection dropdown
   - Operating Company selection dropdown
   - Search button to fetch invoices

2. **Results Page**
   - Invoice table with columns: Invoice Number, Business Unit, Opco, Status
   - Clickable invoice numbers to view details
   - Back navigation to search

3. **Detail Page**
   - Status Bar with 5 circular sequence indicators
     - Green (✓): Data present
     - Red (✗): Missing data - clickable for diagnostics
   - Expandable Records Table
     - Grouped by sequence ID
     - Shows: Flow Name, Transaction ID, Timestamp, Status

## API Endpoints

The application connects to:
- `GET /invoice?businessUnit={bu}&opco={opco}` - List invoices
- `GET /invoice/record?invoiceKey={key}` - Get records
- `GET /invoice/missing?invoiceKey={key}` - Get missing data status

## Getting Started

1. Install Node.js from https://nodejs.org/
2. Navigate to project directory
3. Run `npm install`
4. Ensure backend API is running on http://localhost:8080
5. Run `npm start`
6. Application opens at http://localhost:3000

## Development

- Uses React 18 with TypeScript
- Component-based architecture
- CSS modules with centralized color scheme
- Responsive design for all screen sizes
- Async API data fetching with error handling
