# Financial Interface Service - API Endpoints Documentation

## Overview
This document outlines all REST endpoints available in the Financial Interface Service, including request/response formats and UI integration hooks.

---

## Endpoint 1: Get Landing Data

### Mapping
- **URL**: `GET /invoice`
- **Base URL**: `http://localhost:8080/invoice`
- **Method**: GET
- **Request Parameters**: 
  - `businessUnit` (String, required): Business unit code (e.g., "US", "EU")
  - `opco` (String, required): Operating company code (e.g., "001", "002")

### Description
Retrieves initial invoice listing data filtered by business unit and operating company. This endpoint is used to populate the landing page with available invoices.

### Request Example
```
GET /invoice?businessUnit=US&opco=001
```

### Positive Response (HTTP 200 OK)
```json
{
  "message": "Data successfully retrieved from Database",
  "status": "SUCCESS",
  "records": [
    {
      "businessUnit": "US",
      "opco": "001",
      "invoiceNumber": "INV-2024-001",
      "invoiceKey": "US001INV-2024-001",
      "targetStatus": "COMPLETED"
    },
    {
      "businessUnit": "US",
      "opco": "001",
      "invoiceNumber": "INV-2024-002",
      "invoiceKey": "US001INV-2024-002",
      "targetStatus": "PENDING"
    }
  ]
}
```

### Negative Response (HTTP 400 Bad Request)
```json
{
  "message": "Records not found for Business Unit: XX, and Opco: 999",
  "status": "FAILED",
  "records": []
}
```

### UI Hook
**Event Trigger**: Search button clicked
- **UI Components**:
  - Dropdown menu for Business Unit selection
  - Dropdown menu for Operating Company selection
  - Search/Filter button
- **Action**:
  1. Capture selected values from Business Unit dropdown
  2. Capture selected values from Opco dropdown
  3. On "Search" button click, call this endpoint with the selected parameters
  4. Display results in a table with columns: Invoice Number, Business Unit, Opco, Target Status
  5. Make "Invoice Number" column clickable (hyperlinks)
  6. Clicking invoice number hyperlink triggers Endpoint 2 and Endpoint 3

---

## Endpoint 2: Get Invoice Records Data

### Mapping
- **URL**: `GET /invoice/record`
- **Base URL**: `http://localhost:8080/invoice/record`
- **Method**: GET
- **Request Parameters**: 
  - `invoiceKey` (String, required): Unique invoice identifier (e.g., "US001INV-2024-001")

### Description
Retrieves detailed transaction records for a specific invoice across all data flows (Flow_StgToRDS_AR, Flow_ARData_Cora_API, Flow_ARData_HR_API, Flow_ECAS_Kinesis_Stream, Flow_ECAS_Kafka, Flow_ECAS_SQS_IDS/WD/SUS). Returns records from all 5 sequence paths.

### Request Example
```
GET /invoice/record?invoiceKey=US001INV-2024-001
```

### Positive Response (HTTP 200 OK)
```json
{
  "message": "Data successfully retrieved from Database",
  "status": "SUCCESS",
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
    },
    {
      "businessUnit": "US",
      "opco": "001",
      "invoiceNumber": "INV-2024-001",
      "flowName": "Flow_ARData_Cora_API",
      "seqId": "2",
      "invoiceKey": "US001INV-2024-001",
      "transactionId": "TXN-002-CORA",
      "transactionTimestamp": "2024-01-15T10:45:00",
      "targetStatus": "COMPLETED"
    },
    {
      "businessUnit": "US",
      "opco": "001",
      "invoiceNumber": "INV-2024-001",
      "flowName": "Flow_ECAS_Kinesis_Stream",
      "seqId": "3",
      "invoiceKey": "US001INV-2024-001",
      "transactionId": "TXN-003-KINESIS",
      "transactionTimestamp": "2024-01-15T11:00:00",
      "targetStatus": "COMPLETED"
    }
  ]
}
```

### Negative Response (HTTP 400 Bad Request)
```json
{
  "message": "Records not found for invoiceKey: INVALID_KEY_123",
  "status": "FAILED",
  "records": []
}
```

### UI Hook
**Event Trigger**: Invoice number hyperlink clicked from landing page
- **UI Components**:
  - Main content area (central section of screen)
  - Tabbed or expandable view for each sequence (Seq 1-5)
- **Action**:
  1. Extract invoiceKey from clicked invoice number row
  2. Call this endpoint with the invoiceKey parameter
  3. Display results in a table or expandable rows grouped by seqId
  4. Show columns: Flow Name, Seq ID, Transaction ID, Timestamp, Status
  5. Display in the main content area of the page
  6. Simultaneously call Endpoint 3 to fetch missing records data

---

## Endpoint 3: Get Missing Records Data

### Mapping
- **URL**: `GET /invoice/missing`
- **Base URL**: `http://localhost:8080/invoice/missing`
- **Method**: GET
- **Request Parameters**: 
  - `invoiceKey` (String, required): Unique invoice identifier (e.g., "US001INV-2024-001")

### Description
Retrieves data quality status for an invoice by checking presence of records in each of the 5 processing sequences. Returns a 5-character string where each character represents one sequence (1-5): 'Y' if at least one record exists for that sequence, 'N' if no records found.

### Request Example
```
GET /invoice/missing?invoiceKey=US001INV-2024-001
```

### Positive Response (HTTP 200 OK)
```json
{
  "invoiceKey": "US001INV-2024-001",
  "missingRecords": "YYYYY"
}
```

**Interpretation**:
- Position 1 (Seq 1): Y = records exist
- Position 2 (Seq 2): Y = records exist
- Position 3 (Seq 3): Y = records exist
- Position 4 (Seq 4): Y = records exist
- Position 5 (Seq 5): Y = records exist
- All flows present, data flow is complete

### Negative Response (HTTP 400 Bad Request)
```json
{
  "invoiceKey": "INVALID_KEY",
  "missingRecords": ""
}
```

### Alternative Response (Partial Data)
```json
{
  "invoiceKey": "US001INV-2024-001",
  "missingRecords": "YNYNY"
}
```

**Interpretation**:
- Position 1 (Seq 1): Y = records exist
- Position 2 (Seq 2): N = NO records (missing flow)
- Position 3 (Seq 3): Y = records exist
- Position 4 (Seq 4): N = NO records (missing flow)
- Position 5 (Seq 5): Y = records exist
- Flows 2 and 4 have missing data

### UI Hook
**Event Trigger**: Invoice number hyperlink clicked from landing page (simultaneous with Endpoint 2)
- **UI Components**:
  - Status indicator bar displayed at the top of the page
  - 5 circular indicators (health check circles)
  - Position left to right representing Seq 1-5
  
- **Visual Representation**:
  ```
  Seq 1: Y → Green Circle (✓)
  Seq 2: N → Red Circle (✗)
  Seq 3: Y → Green Circle (✓)
  Seq 4: N → Red Circle (✗)
  Seq 5: Y → Green Circle (✓)
  ```

- **Styling**:
  - **Green Circle**: Background color #4CAF50, border 2px solid #45a049
    - Indicates healthy flow (record exists)
    - Not clickable in current version
  
  - **Red Circle**: Background color #f44336, border 2px solid #da190b, cursor: pointer
    - Indicates missing data/failed flow
    - **Clickable**: Future implementation for health check diagnostics
    - On click: Reserved for showing detailed error messages, retry options, or flow-specific logs

- **Layout**:
  ```
  ┌─────────────────────────────────────────┐
  │ Seq Status:  🟢 🔴 🟢 🔴 🟢             │
  │            (Seq 1-5 status indicators)  │
  │ Invoice: US001INV-2024-001              │
  └─────────────────────────────────────────┘
  ```

- **Action**:
  1. Call this endpoint with invoiceKey when invoice number hyperlink is clicked
  2. Parse the missingRecords string character by character
  3. For each character (1-5):
     - If 'Y': Render green circle with checkmark icon
     - If 'N': Render red circle with X icon, attach click event handler
  4. Display status bar at top of screen, centered or right-aligned
  5. On red circle click (future feature):
     - Show tooltip or modal with diagnostic information
     - Potentially call health check endpoint (future)
     - Log missing sequence for troubleshooting

---

## User Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│ LANDING PAGE                                           │
│ - Business Unit Dropdown                              │
│ - Opco Dropdown                                       │
│ - Search Button                                       │
└────────────────────────────────────────────────────────┘
                          ↓ (Search clicked)
                  [Call Endpoint 1]
                          ↓
┌────────────────────────────────────────────────────────┐
│ RESULTS TABLE                                          │
│ Invoice Number (clickable) | BU | Opco | Status      │
│ INV-2024-001 ← HYPERLINK                              │
│ INV-2024-002 ← HYPERLINK                              │
└────────────────────────────────────────────────────────┘
                          ↓ (Invoice hyperlink clicked)
      ┌───────────────────┴───────────────────┐
      ↓                                       ↓
[Call Endpoint 2]                    [Call Endpoint 3]
(Invoice Records)                  (Missing Records)
      ↓                                       ↓
┌─────────────────────┐          ┌──────────────────────┐
│ MAIN CONTENT AREA   │          │ STATUS BAR (TOP)     │
│ Seq 1-5 data table  │          │ 🟢🔴🟢🔴🟢 circles  │
│ with flow details   │          │ (clickable red ones) │
│                     │          │                      │
└─────────────────────┘          └──────────────────────┘
```

---

## Error Handling

### Common Error Scenarios

| Scenario | HTTP Status | Response | Solution |
|----------|-----------|----------|----------|
| Missing required parameter | 400 | `"Records not found"` | Verify businessUnit/opco/invoiceKey provided |
| No records found in database | 400 | Empty records array | Check if data exists for the query |
| Database connection error | 500 | Server error | Contact system administrator |
| Invalid parameter format | 400 | Validation error | Ensure parameters match expected format |

---

## Integration Notes

1. **CORS**: Ensure API is configured for cross-origin requests if frontend runs on different domain
2. **Authentication**: Currently no auth required; add JWT/OAuth if needed in production
3. **Rate Limiting**: Consider implementing rate limits for production deployment
4. **Caching**: Landing page results (Endpoint 1) could be cached for 5-10 minutes to reduce load
5. **Async Queries**: Endpoints 2-5 results use async DB queries for performance optimization

---

## Testing Recommendations

1. Test with valid businessUnit/opco combinations
2. Test with non-existent invoiceKey values
3. Test edge cases: invoices with all sequences present vs. partially missing sequences
4. Performance test with large result sets (100+ records)
5. Test UI responsiveness when calling all 3 endpoints in rapid succession

