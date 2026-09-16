# Financial Interface Service - Health Endpoint Documentation

## Overview
This document describes the health check endpoint used to validate the service status for a specific check step. The endpoint calls the underlying health check logic and returns whether the service is healthy or unhealthy.

---

## Endpoint: Check Service Health

### Mapping
- **URL**: `GET /invoice/health`
- **Base URL**: `http://localhost:8080/invoice/health`
- **Method**: GET
- **Request Parameters**:
  - `step` (Integer, required): Health check step to run. Supported values: `1`, `2`, `3`, `4`, `5`

### Description
This endpoint checks the health of the service by executing the corresponding health check step. The logic determines if the dependency or system being validated is available and healthy.

At the moment, Step 1 performs an external health check against a downstream service at:
- `http://localhost:8083/health`

Other steps are placeholders for future health checks.

### Request Example
```
GET /invoice/health?step=1
```

### Positive Response (HTTP 200 OK)
```json
"Service is healthy"
```

**Meaning**:
- The health check step completed successfully
- The downstream system responded as healthy
- The service is operating normally

### Negative Response (HTTP 503 Service Unavailable)
```json
"Service is unhealthy"
```

**Meaning**:
- The health check step returned a status that is not `UP`
- The downstream dependency is unhealthy or unreachable
- The service should be considered unhealthy for this check

### Invalid Step Response (HTTP 400 or 500 depending on error handling)
If a step outside of `1-5` is passed, the service may throw an exception or fail validation.

Example:
```json
{
  "error": "Invalid step"
}
```

**Meaning**:
- The health check step requested is not supported
- The request should use a valid integer between 1 and 5

---

## Health Check Implementation Details

### Internal Operation
The controller calls:
```java
String response = healthCheckService.healthCheck(step);
```

The service method then evaluates the step and performs the health check logic:

```java
switch (step) {
    case 1:
        healthResponse = cmsHealthCheck(env.getProperty("apic.token"), env.getProperty("syy.request.id"));
        break;
    case 2:
        // Perform second health check
        break;
    case 3:
        // Perform third health check
        break;
    case 4:
        // Perform fourth health check
        break;
    case 5:
        // Perform fifth health check
        break;
    default:
        throw new IllegalArgumentException("Invalid step");
}
```

### Downstream Health Call
For step 1, the app calls a downstream service using:
```java
String shipToCallUrl = "http://localhost:8083/health";
```

And sends headers:
- `Authorization`
- `Syy-Request-Id`

The dependency response is mapped to:
```java
class HealthResponse {
    private String status;
}
```

---

## UI Hook

### Event Trigger
**Manual health check trigger**
- Usually fired when a user opens the application dashboard or clicks a health status button
- Can also be used in a monitoring widget, page load event, or service status checker

### UI Components
- Health status badge or indicator in the header or dashboard
- Optional button: "Check Service Health"
- Display area showing `Healthy` or `Unhealthy`

### Behavior
1. User triggers the health check request
2. Send a GET request to:
   ```
   /invoice/health?step=1
   ```
3. If response is `200 OK` with body `Service is healthy`:
   - Render a green status indicator
   - Show label: `Healthy`
4. If response is `503 Service Unavailable` with body `Service is unhealthy`:
   - Render a red status indicator
   - Show label: `Unhealthy`
5. If invalid step or service error occurs:
   - Show a warning message or error banner

### UI Example (JavaScript)
```javascript
async function checkHealth() {
  try {
    const response = await fetch('http://localhost:8080/invoice/health?step=1');

    if (response.ok) {
      const result = await response.text();
      document.getElementById('healthStatus').textContent = result;
      document.getElementById('healthStatus').className = 'healthy';
    } else {
      const result = await response.text();
      document.getElementById('healthStatus').textContent = result;
      document.getElementById('healthStatus').className = 'unhealthy';
    }
  } catch (error) {
    document.getElementById('healthStatus').textContent = 'Health check failed';
    document.getElementById('healthStatus').className = 'unhealthy';
  }
}
```

### UI Example (HTML)
```html
<div id="healthStatus" class="status">Checking...</div>
<button onclick="checkHealth()">Check Service Health</button>
```

### UI Styling Example
```css
.healthy {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 8px 12px;
  border-radius: 4px;
}

.unhealthy {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 8px 12px;
  border-radius: 4px;
}
```

---

## Example Workflow

```text
User opens dashboard
       ↓
Click "Check Service Health"
       ↓
GET /invoice/health?step=1
       ↓
Backend calls downstream /health service
       ↓
If status = UP → return "Service is healthy"
If status != UP → return "Service is unhealthy"
       ↓
UI updates status badge color and message
```

---

## Error Handling

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| Service healthy | 200 | `Service is healthy` |
| Service unhealthy | 503 | `Service is unhealthy` |
| Invalid step | 400/500 | Error message | 
| Downstream unavailable | 503 | `Service is unhealthy` |

---

## Notes
- Currently only `step=1` is implemented
- Additional steps are placeholders for future health checks
- The endpoint is intended to support service monitoring and a lightweight UI dashboard indicator
