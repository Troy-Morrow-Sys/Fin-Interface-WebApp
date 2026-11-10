# Financial Interface Service - Failed Records Endpoint Documentation

## Overview
This document describes the `getFailedRecords` endpoint, which retrieves a list of failed invoice records from the system.

---

## Endpoint: getFailedRecords

### Mapping
- **URL**: `GET /invoice/failed-records`
- **Base URL**: `http://localhost:8080/invoice/failed-records`
- **Method**: `GET`
- **Controller Method**: `FinInterfaceController.getFailedRecords()`

### Request Object
There is no request body for this endpoint and no query string parameters are required.

The controller signature is:

```java
@GetMapping("/failed-records")
public ResponseEntity<FinFailedInvoiceResponse> getFailedRecords()
```

**Request object type**:
- No request DTO is used
- No request body is sent
- In practical terms, the request object is effectively `void` / no object (`null` request body)

### Request Example
```http
GET /invoice/failed-records
```

---

## Response Object
The endpoint returns a `ResponseEntity<FinFailedInvoiceResponse>`.

### `FinFailedInvoiceResponse`
This is the Java response object returned by the endpoint.

**Type**: `com.sysco.ftr.dto.FinFailedInvoiceResponse`

**Fields**:
- `status`: `String`
- `message`: `String`
- `failedRecords`: `List<FailedInvoiceDTO>`

### `FailedInvoiceDTO`
This object represents each failed invoice record.

**Type**: `com.sysco.ftr.dto.FailedInvoiceDTO`

**Fields**:
- `invoiceKey`: `String`
- `flowName`: `String`
- `transactionTimestamp`: `java.sql.Timestamp`
- `failureReason`: `String`

---

## Successful Response (HTTP 200 OK)
```json
{
  "status": "SUCCESS",
  "message": "Failed records retrieved",
  "failedRecords": [
    {
      "invoiceKey": "US001INV-2024-001",
      "flowName": "Flow_ECAS_Kinesis_Stream",
      "transactionTimestamp": "2024-01-15T11:15:00.000+00:00",
      "failureReason": "Record not found in downstream system"
    },
    {
      "invoiceKey": "US001INV-2024-002",
      "flowName": "Flow_ARData_HR_API",
      "transactionTimestamp": "2024-01-16T08:20:00.000+00:00",
      "failureReason": "Invalid payload format"
    }
  ]
}
```

### Response Meaning
- `status`: Indicates whether the request succeeded (`SUCCESS`)
- `message`: Human-readable status text
- `failedRecords`: A list of failed invoice entries, each represented by `FailedInvoiceDTO`

---

## Empty Result Response
If no failed records are present, the endpoint still returns HTTP 200 with an empty list.

```json
{
  "status": "SUCCESS",
  "message": "No failed records found",
  "failedRecords": []
}
```

---

## Backend Behavior
The service method calls:

```java
List<WrkMntDataLoadProjection> failedRecords = wrkMntFailedInvoiceRepository.findAllFailedInvoices();
```

Then it maps each item to a `FailedInvoiceDTO` and returns a `FinFailedInvoiceResponse`:

```java
return FinFailedInvoiceResponse.builder()
        .message("Failed records retrieved")
        .status("SUCCESS")
        .failedRecords(failedRecords.stream()
                .map(this::convertProjectionToFailedInvoice)
                .collect(Collectors.toList()))
        .build();
```

---

## Notes
- This endpoint does not accept an input object or request body.
- It is a read-only endpoint for retrieving failed invoice processing records.
- The response object is a Java object, not a primitive value; the `failedRecords` field is a `List` of `FailedInvoiceDTO` objects.
