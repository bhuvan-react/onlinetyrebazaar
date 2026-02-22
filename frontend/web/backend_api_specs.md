# TyrePlus Backend API Specifications

This document outlines the API endpoints required for the TyrePlus application, including functionality, flow, and expected payloads.

## Base Configuration

*   **Base URL**: `http://43.205.253.34:8081/api/v1`
*   **Authentication**: Bearer Token in `Authorization` header (`Authorization: Bearer <token>`)
*   **Content-Type**: `application/json`

---

## 1. Authentication Module

### 1.1 Quick Login (OTP based)
**Flow**: User enters mobile -> System sends OTP -> User enters OTP -> System verifies & returns token.
Used in: `OtpModal`, vehicle selector flows.

#### A. Send Quick OTP
*   **Endpoint**: `POST /auth/quick/send-otp`
*   **Description**: Triggers OTP SMS to the provided mobile number.
*   **Request**:
    ```json
    {
      "mobile": "9876543210"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "OTP sent successfully"
    }
    ```

#### B. Verify Quick OTP
*   **Endpoint**: `POST /auth/quick/verify-otp`
*   **Description**: Verifies the OTP. If successful, creates/retrieves the user and returns an auth token.
*   **Request**:
    ```json
    {
      "mobile": "9876543210",
      "otp": "1234"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "token": "jwt_token_here",
      "user": {
        "id": "user_123",
        "name": "Guest User",
        "mobile": "9876543210",
        "role": "customer"
      }
    }
    ```

### 1.2 Registration
**Flow**: User enters details -> Send OTP -> Verify & Create Account.

#### A. Send Register OTP
*   **Endpoint**: `POST /auth/register/send-otp`
*   **Request**: `{"mobile": "..."}`
*   **Response**: `{"success": true, "message": "..."}`

#### B. Complete Registration
*   **Endpoint**: `POST /auth/register/complete`
*   **Description**: Creates a new user profile after OTP is verified (client-side or via a previous step token).
*   **Request**:
    ```json
    {
      "name": "John Doe",
      "mobile": "9876543210",
      "pincode": "560001",
      "city": "Bangalore",
      "state": "Karnataka"
      // "otp": "..." // If verification happens here
    }
    ```
*   **Response**: Same as Quick Login Verify (Token + User).



---

## 2. Vehicle Module

### 2.1 Vehicle Master Data (Dropdowns)
**Flow**: User selects Type (2W/4W) -> Selects Make -> Selects Model -> Selects Variant -> Gets Tyre Size.

#### A. Get Makes
*   **Endpoint**: `GET /vehicles/makes?type={2W|3W|4W}`
*   **Response**: `{"makes": ["Honda", "Maruti", ...]}`

#### B. Get Models
*   **Endpoint**: `GET /vehicles/models?type={type}&make={make}`
*   **Response**: `{"models": ["City", "Civic", ...]}`

#### C. Get Variants
*   **Endpoint**: `GET /vehicles/variants?type={type}&make={make}&model={model}`
*   **Response**: `{"variants": ["VXi", "ZXi", ...]}`

#### D. Get Tyre Sizes (for selection)
*   **Endpoint**: `GET /vehicles/tyre-sizes?make={make}&model={model}&variant={variant}`
*   **Response**: `{"sizes": ["165/80 R14", "185/65 R15"]}`

### 2.2 User Vehicles (My Garage)
**Flow**: User adds their vehicle to profile for quick access.

#### A. Get User Vehicles
*   **Endpoint**: `GET /vehicles` (Auth required)
*   **Response**:
    ```json
    [
      {
        "id": "v1",
        "name": "Honda City",
        "registration": "KA01AB1234",
        "tyreSize": "165/80 R14",
        "isPrimary": true
      }
    ]
    ```

#### B. Add Vehicle
*   **Endpoint**: `POST /vehicles` (Auth required)
*   **Request**: `UserVehicle` object (name, reg, size, etc.)
*   **Response**: Created vehicle object.

#### C. Delete Vehicle
*   **Endpoint**: `DELETE /vehicles/{id}` (Auth required)

---

## 3. Tyre Module

### 3.1 Get All / Search Tyres (Function: `getAllTyres`)
**Flow**: User searches for tyres by size or filters.
*   **Endpoint**: `GET /tyres`
    *   `size`: "165/80 R14"
    *   `brand`: "Michelin"
    *   `pattern`: "Primacy 4ST"
    *   `categoryId`: "alloy-wheels"
*   **Response**: List of `Tyre` objects.
    ```json
    [
      {
        "id": "t1",
        "brand": "Michelin",
        "pattern": "Primacy 4ST",
        "size": "195/55 R16",
        "price": 8500,
        "image": "url...",
        "features": ["Low Noise", "High Grip"]
      }
    ]
    ```

### 3.2 Get Tyre Details
*   **Endpoint**: `GET /tyres/{id}`
*   **Response**: Single `Tyre` object with full details.

---

## 4. Orders & Requests Module

### 4.1 Order History
*   **Endpoint**: `GET /orders` (Auth required)
*   **Response**: List of past orders with status.

### 4.2 Order Details
*   **Endpoint**: `GET /orders/{id}` (Auth required)
*   **Response**: Full order details including items, pricing, and shipping status.

### 4.3 Active Quote Requests
*   **Endpoint**: `GET /requests` (Auth required)
*   **Response**: List of active requests where users are waiting for dealer quotes.

---

## 5. Sell Tyres Module

### 5.1 Submit Sell Request
**Flow**: User fills details of old tyres -> Validates OTP (if not logged in) -> Submits.
*   **Endpoint**: `POST /sell-tyres/submit`
*   **Request**:
    ```json
    {
      "vehicleType": "4W",
      "tyrePosition": ["Front Left"],
      "tyreMake": "Apollo",
      "tyreAge": "2 Years",
      "kmDriven": "25000",
      "expectedPrice": "1500",
      "pickupDate": "2024-02-10",
      "pickupTimeSlot": "10:00 AM - 12:00 PM",
      "mobile": "9876543210"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Request submitted",
      "requestId": "req_123"
    }
    ```

---

## 6. Location Module

### 6.1 Check Serviceability
*   **Endpoint**: `GET /location/check-pincode?pincode={pincode}`
*   **Response**:
    ```json
    {
      "serviceable": true,
      "city": "Bangalore",
      "state": "Karnataka"
    }
    ```
