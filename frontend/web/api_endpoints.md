# Backend API Requirements

This document lists the API endpoints required to support the frontend application features.

## 1. Authentication

The application supports two authentication modes:
1.  **Quick Auth (OTP-based)**: Used in "Buy/Sell" flows (Vehicle Selector).
2.  **Full Auth (Password-based)**: Used in dedicated Login/Register pages.

### 1.1 Quick Auth (Passwordless)
Used for quick verification in flows like "Sell Tyres".

*   **Send OTP**: `POST /api/auth/quick/send-otp`
    *   Body: `{ "mobile": "9876543210" }`
*   **Verify OTP**: `POST /api/auth/quick/verify-otp`
    *   Body: `{ "mobile": "9876543210", "otp": "1234" }`
    *   Response: `{ "token": "...", "user": { ... } }`

### 1.2 Full Login (Password)
Used on `/login` page.

*   **Login**: `POST /api/auth/login`
    *   Body: `{ "mobile": "9876543210", "password": "secure_password" }`
    *   Response: `{ "success": true, "token": "...", "user": { ... } }`

### 1.3 Registration
Used on `/register` page. Requires OTP verification of mobile number.

*   **Send Registration OTP**: `POST /api/auth/register/send-otp`
    *   Body: `{ "mobile": "9876543210" }`
*   **Complete Registration**: `POST /api/auth/register/complete`
    *   Description: Verifies OTP and creates account.
    *   Body:
        ```json
        {
          "name": "John Doe",
          "mobile": "9876543210",
          "password": "secure_password", 
          "pincode": "560001",
          "otp": "1234",
          "googleId": "optional_google_id"
        }
        ```

### 1.4 Forgot Password
Used on `/login` page when user forgets password.

*   **Send Reset OTP**: `POST /api/auth/password-reset/send-otp`
    *   Body: `{ "mobile": "9876543210" }`
*   **Verify Reset OTP**: `POST /api/auth/password-reset/verify-otp`
    *   Body: `{ "mobile": "9876543210", "otp": "1234" }`
*   **Reset Password**: `POST /api/auth/password-reset/confirm`
    *   Body: `{ "mobile": "9876543210", "newPassword": "new_secure_password" }`

### 1.5 User Profile
*   **Get Profile**: `GET /api/user/profile`
    *   Headers: `Authorization: Bearer <token>`
*   **Update Profile**: `PUT /api/user/profile`
    *   Body: `{ "name": "...", "email": "..." }`

---

## 2. Vehicle Data
Used for the cascading dropdowns in the Vehicle Selector component.

### 2.1 Get Makes
*   **Endpoint**: `GET /api/vehicles/makes`
*   **Query Params**:
    *   `type`: `2W` | `3W` | `4W`
*   **Response**:
    ```json
    {
      "makes": ["Hero", "Honda", "Bajaj", "TVS"]
    }
    ```

### 2.2 Get Models
*   **Endpoint**: `GET /api/vehicles/models`
*   **Query Params**:
    *   `type`: `2W` | `3W` | `4W`
    *   `make`: `Hero`
*   **Response**:
    ```json
    {
      "models": ["Splendor Plus", "HF Deluxe", "Passion Pro"]
    }
    ```

### 2.3 Get Variants
*   **Endpoint**: `GET /api/vehicles/variants`
*   **Query Params**:
    *   `type`: `2W` | `3W` | `4W`
    *   `make`: `Hero`
    *   `model`: `Splendor Plus`
*   **Response**:
    ```json
    {
      "variants": ["Standard", "i3S", "Black & Accent"]
    }
    ```

---

## 3. Location Services

### 3.1 Check Serviceability
*   **Endpoint**: `GET /api/location/check-pincode`
*   **Query Params**:
    *   `pincode`: `560001`
*   **Response**:
    ```json
    {
      "serviceable": true,
      "city": "Bangalore",
      "state": "Karnataka"
    }
    ```

---

## 4. Sell Tyres Flow

### 4.1 Submit Sell Request
*   **Endpoint**: `POST /api/sell-tyres/submit`
*   **Description**: Submits the tyre selling form data.
*   **Headers**: `Authorization: Bearer <token>` (if authenticated)
*   **Request Body**:
    ```json
    {
      "vehicleType": "2W",
      "tyrePosition": ["Front", "Rear"],
      "tyreMake": "MRF",
      "tyreAge": "1-2 years",
      "kmDriven": "15000",
      "expectedPrice": "2000",
      "pickupDate": "2024-03-20",
      "pickupTimeSlot": "10:00 AM - 12:00 PM",
      "mobile": "9876543210",
      "city": "Bangalore",
      "state": "Karnataka"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "message": "Request submitted successfully",
      "requestId": "REQ_12345"
    }
    ```

---

## Data Structures

### Vehicle Type Enum
*   `2W` (Two Wheeler)
*   `3W` (Three Wheeler)
*   `4W` (Four Wheeler)

### Tyre Position Enum
*   `Front`
*   `Rear`
