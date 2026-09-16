# Financial Interface Service - Dropdown Endpoints Documentation

## Overview
This document outlines the two dropdown data retrieval endpoints used to populate the Business Unit and Operating Company (OPCO) dropdown menus on the landing page.

---

## Endpoint 1: Get Distinct Business Units

### Mapping
- **URL**: `GET /invoice/businessUnit`
- **Base URL**: `http://localhost:8080/invoice/businessUnit`
- **Method**: GET
- **Request Parameters**: None

### Description
Retrieves a list of all distinct business unit values available in the system. This endpoint is used to populate the Business Unit dropdown menu on the landing page, allowing users to filter invoices by their organization unit.

### Request Example
```
GET /invoice/businessUnit
```

### Positive Response (HTTP 200 OK)
```json
[
  "US",
  "EU",
  "APAC",
  "EMEA",
  "CA"
]
```

**Response Details**:
- Returns a JSON array of strings
- Each string represents a distinct business unit code
- List is typically sorted alphabetically (or by insertion order)
- Example values: US (United States), EU (Europe), APAC (Asia-Pacific), EMEA (Europe/Middle East/Africa), CA (Canada)

### Negative Response (HTTP 400 Bad Request)
```json
[]
```

**Response Details**:
- Returns an empty array
- Indicates no business units found in the database
- Typically occurs when the system has no invoice data

### UI Hook
**Event Trigger**: Page Load (On Initial Page Load)
- **UI Components**:
  - Business Unit Dropdown Menu (HTML `<select>` element)
  - Located on the landing page

- **Action**:
  1. When the landing page loads, immediately call this endpoint
  2. Receive the array of distinct business units
  3. Dynamically populate the Business Unit dropdown with the returned values
  4. Add a default/placeholder option at the top: "-- Select Business Unit --"
  5. Make the dropdown interactive so users can select a value
  6. On Business Unit selection, trigger Endpoint 2 (Get Distinct Opco) to populate the Opco dropdown

- **UI Code Example (React)**:
  ```javascript
  const [businessUnits, setBusinessUnits] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:8080/invoice/businessUnit')
      .then(response => response.json())
      .then(data => setBusinessUnits(data))
      .catch(error => console.error('Error fetching business units:', error));
  }, []);
  
  return (
    <select onChange={(e) => handleBusinessUnitChange(e.target.value)}>
      <option value="">-- Select Business Unit --</option>
      {businessUnits.map(bu => (
        <option key={bu} value={bu}>{bu}</option>
      ))}
    </select>
  );
  ```

- **UI Code Example (HTML/JavaScript)**:
  ```html
  <select id="businessUnitDropdown">
    <option value="">-- Select Business Unit --</option>
  </select>
  
  <script>
    fetch('http://localhost:8080/invoice/businessUnit')
      .then(response => response.json())
      .then(data => {
        const dropdown = document.getElementById('businessUnitDropdown');
        data.forEach(bu => {
          const option = document.createElement('option');
          option.value = bu;
          option.text = bu;
          dropdown.appendChild(option);
        });
      });
  </script>
  ```

---

## Endpoint 2: Get Distinct Opco

### Mapping
- **URL**: `GET /invoice/opco`
- **Base URL**: `http://localhost:8080/invoice/opco`
- **Method**: GET
- **Request Parameters**: 
  - `businessUnit` (String, required): Business unit code (e.g., "US", "EU")

### Description
Retrieves a list of all distinct operating company (OPCO) codes available for a specific business unit. This endpoint is used to populate the Operating Company dropdown menu, filtered by the selected business unit. Opcos are dependent on the business unit selection.

### Request Example
```
GET /invoice/opco?businessUnit=US
```

### Positive Response (HTTP 200 OK)
```json
[
  "001",
  "002",
  "003",
  "004"
]
```

**Response Details**:
- Returns a JSON array of strings
- Each string represents a distinct OPCO code for the selected business unit
- List is typically sorted numerically or alphanumerically
- Example values: "001", "002", "003", etc.
- Results are filtered to only show opcos that exist for the given businessUnit

### Alternative Response (Different Business Unit)
```
GET /invoice/opco?businessUnit=EU
```

```json
[
  "101",
  "102",
  "103"
]
```

**Response Details**:
- Different business units have different opco values
- The opco list changes based on the businessUnit parameter
- EU has codes like "101", "102", etc., while US might have "001", "002", etc.

### Negative Response (HTTP 400 Bad Request)
```json
[]
```

**Response Details**:
- Returns an empty array
- Occurs when:
  - Invalid businessUnit parameter provided
  - The specified business unit has no associated opcos
  - No data exists in the database for that business unit

### UI Hook
**Event Trigger**: Business Unit Dropdown Selection Changed
- **UI Components**:
  - Opco Dropdown Menu (HTML `<select>` element)
  - Located on the landing page, next to Business Unit dropdown
  - Disabled by default until Business Unit is selected

- **Action**:
  1. User selects a value from the Business Unit dropdown
  2. Immediately call this endpoint with the selected businessUnit value
  3. Receive the array of distinct opcos for that business unit
  4. Clear the Opco dropdown of previous values
  5. Dynamically populate the Opco dropdown with the new values
  6. Add a default/placeholder option at the top: "-- Select Opco --"
  7. Enable the Opco dropdown for user interaction
  8. On Opco selection, the user can then click the Search button (Endpoint 1 from API_DOCUMENTATION.md)

- **UI Code Example (React)**:
  ```javascript
  const [businessUnits, setBusinessUnits] = useState([]);
  const [opcos, setOpcos] = useState([]);
  const [selectedBU, setSelectedBU] = useState('');
  
  // Load business units on mount
  useEffect(() => {
    fetch('http://localhost:8080/invoice/businessUnit')
      .then(response => response.json())
      .then(data => setBusinessUnits(data))
      .catch(error => console.error('Error fetching business units:', error));
  }, []);
  
  // Load opcos when business unit changes
  const handleBusinessUnitChange = (bu) => {
    setSelectedBU(bu);
    if (bu) {
      fetch(`http://localhost:8080/invoice/opco?businessUnit=${bu}`)
        .then(response => response.json())
        .then(data => setOpcos(data))
        .catch(error => console.error('Error fetching opcos:', error));
    } else {
      setOpcos([]);
    }
  };
  
  return (
    <>
      <select onChange={(e) => handleBusinessUnitChange(e.target.value)}>
        <option value="">-- Select Business Unit --</option>
        {businessUnits.map(bu => (
          <option key={bu} value={bu}>{bu}</option>
        ))}
      </select>
      
      <select disabled={!selectedBU}>
        <option value="">-- Select Opco --</option>
        {opcos.map(opco => (
          <option key={opco} value={opco}>{opco}</option>
        ))}
      </select>
    </>
  );
  ```

- **UI Code Example (HTML/JavaScript)**:
  ```html
  <select id="businessUnitDropdown" onchange="loadOpcos(this.value)">
    <option value="">-- Select Business Unit --</option>
  </select>
  
  <select id="opcoDropdown" disabled>
    <option value="">-- Select Opco --</option>
  </select>
  
  <script>
    // Load business units on page load
    fetch('http://localhost:8080/invoice/businessUnit')
      .then(response => response.json())
      .then(data => {
        const dropdown = document.getElementById('businessUnitDropdown');
        data.forEach(bu => {
          const option = document.createElement('option');
          option.value = bu;
          option.text = bu;
          dropdown.appendChild(option);
        });
      });
    
    // Load opcos when business unit changes
    function loadOpcos(businessUnit) {
      const opcoDropdown = document.getElementById('opcoDropdown');
      opcoDropdown.innerHTML = '<option value="">-- Select Opco --</option>';
      
      if (businessUnit) {
        opcoDropdown.disabled = false;
        fetch(`http://localhost:8080/invoice/opco?businessUnit=${businessUnit}`)
          .then(response => response.json())
          .then(data => {
            data.forEach(opco => {
              const option = document.createElement('option');
              option.value = opco;
              option.text = opco;
              opcoDropdown.appendChild(option);
            });
          });
      } else {
        opcoDropdown.disabled = true;
      }
    }
  </script>
  ```

---

## Complete User Flow with Dropdowns

```
┌────────────────────────────────────────────────────────┐
│ LANDING PAGE LOADS                                      │
│ [Calls Endpoint 1: getDistinctBusinessUnits]           │
└────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│ DROPDOWN 1: Business Unit                              │
│ ┌──────────────────────────────────────────────────┐   │
│ │ -- Select Business Unit --                       │   │
│ │ US                                               │   │
│ │ EU                                               │   │
│ │ APAC                                             │   │
│ │ EMEA                                             │   │
│ └──────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
                          ↓ (User selects "US")
                  [Calls Endpoint 2: getDistinctOpco]
                          ↓
┌────────────────────────────────────────────────────────┐
│ DROPDOWN 2: Opco (Now Enabled)                         │
│ ┌──────────────────────────────────────────────────┐   │
│ │ -- Select Opco --                               │   │
│ │ 001                                              │   │
│ │ 002                                              │   │
│ │ 003                                              │   │
│ │ 004                                              │   │
│ └──────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
                          ↓ (User selects "001")
┌────────────────────────────────────────────────────────┐
│ SEARCH BUTTON (Now Ready to Click)                     │
│ ┌──────────────────────────────────────────────────┐   │
│ │              [   SEARCH   ]                      │   │
│ └──────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
                          ↓ (User clicks Search)
                  [Calls Endpoint 1 from API_DOCUMENTATION.md]
                          ↓
┌────────────────────────────────────────────────────────┐
│ RESULTS TABLE                                          │
│ (Invoice data loaded and displayed)                    │
└────────────────────────────────────────────────────────┘
```

---

## Error Handling

| Scenario | HTTP Status | Response | Solution |
|----------|-----------|----------|----------|
| Successful retrieval | 200 | Array of values | Display in dropdown |
| No data found | 400 | Empty array [] | Show message to user |
| Invalid businessUnit parameter | 400 | Empty array [] | Re-prompt user to select valid BU |
| Database connection error | 500 | Server error | Contact system administrator |
| Network timeout | N/A | No response | Retry request, implement timeout handling |

---

## Performance Considerations

1. **Caching**: Business Units and Opcos lists change infrequently
   - Consider caching the results for 1-24 hours on the client side
   - Use localStorage or sessionStorage to avoid repeated API calls
   - Invalidate cache manually if data is known to have changed

2. **Initial Load**: Fetch business units on page load before user interaction
   - Pre-populate the Business Unit dropdown immediately
   - Improves user experience and perceived performance

3. **Dependent Dropdown**: Opcos depend on Business Unit selection
   - Only fetch opcos when a valid Business Unit is selected
   - Don't fetch opcos on page load; wait for user selection

4. **Lazy Loading**: Consider implementing debouncing if opco fetches become slow
   - Add a slight delay before fetching opcos (e.g., 300ms)
   - Prevents excessive API calls during rapid business unit changes

---

## Integration Notes

1. **Load Order**:
   - Endpoint 1 (Business Units) must be called first on page load
   - Endpoint 2 (Opco) must be called after Business Unit selection

2. **Dropdown States**:
   - Business Unit dropdown: Enabled on page load after data is fetched
   - Opco dropdown: Disabled until Business Unit is selected, then enabled

3. **Default Values**:
   - Both dropdowns should have a placeholder like "-- Select --" as first option
   - Do not auto-select first value; require explicit user selection

4. **Error States**:
   - If Endpoint 1 fails, show message: "Unable to load Business Units"
   - If Endpoint 2 fails, show message: "Unable to load Opcos for selected Business Unit"
   - Provide retry button or re-fetch on user action

5. **Data Formats**:
   - Business Unit: Typically 2-4 character codes (e.g., "US", "APAC")
   - Opco: Typically 3-digit numeric codes (e.g., "001", "002")
   - Both should be treated as strings in the frontend

