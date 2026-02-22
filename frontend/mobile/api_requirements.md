# API Requirements for TyrePlus Dealer App

This document outlines the API endpoints required to replace the hardcoded data in the React Native application.

## 1. Authentication & User
### Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Request**: `{ "mobile": "9876543210", "otp": "123456" }` (or password)
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "dealer_123",
      "name": "Super Tyres Ltd.",
      "role": "dealer",
      "avatar": "url_to_image"
    }
  }
  ```

### Get Profile (Sidebar/Header/Settings)
- **Endpoint**: `GET /api/v1/dealer/profile`
- **Response**:
  ```json
  {
    "businessName": "Super Tyres Ltd.",
    "ownerName": "Rajesh Kumar",
    "isVerified": true,
    "mobile": "+91 98765 43210",
    "email": "dealer@supertyres.com",
    "address": "123, Auto Market, MG Road, Bangalore",
    "avatar": "url_to_image"
  }
  ```

### Update Profile (Edit Profile Screen)
- **Endpoint**: `PUT /api/v1/dealer/profile`
- **Request**:
  ```json
  {
    "businessName": "Super Tyres Ltd.",
    "ownerName": "Rajesh Kumar",
    "gstNumber": "29ABCDE1234F1Z5",
    "yearsInBusiness": 12,
    "mobile": "9876543210",
    "email": "dealer@supertyres.com",
    "whatsapp": "9876543210",
    "address": {
      "shopNumber": "123",
      "street": "Auto Market, MG Road",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001",
      "landmark": "Near Central Bank"
    },
    "businessHours": {
      "openTime": "09:00 AM",
      "closeTime": "08:00 PM",
      "openDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },
    "services": ["Tyre Sales", "Wheel Alignment"],
    "brands": ["MRF", "CEAT"]
  }
  ```

## 2. Dashboard
### Dashboard Stats & Summary
- **Endpoint**: `GET /api/v1/dealer/dashboard`
- **Response**:
  ```json
  {
    "walletBalance": 2450,
    "stats": {
      "leadsToday": 5,
      "conversionRate": 12
    },
    "recentLeads": [
      {
        "id": "1",
        "customerName": "Rajesh Kumar",
        "vehicle": "Hyundai Creta",
        "status": "New",
        "timestamp": "10:30 AM"
      }
      // ... more leads
    ]
  }
  ```

## 3. Leads Management
### Get Leads List
- **Endpoint**: `GET /api/v1/leads`
- **Query Params**: `?filter=All|New|Follow-up|Converted&sort=date_desc|date_asc|priority`
- **Response**:
  ```json
  [
    {
      "id": "1",
      "name": "Rajesh Kumar",
      "vehicle": "Hyundai Creta",
      "location": "Indiranagar",
      "date": "2023-12-28T10:30:00Z",
      "status": "New"r
    }
  ]
  ```

### Get Lead Details
- **Endpoint**: `GET /api/v1/leads/{leadId}`
- **Response**:
  ```json
  {
    "id": "1",
    "status": "New",
    "customer": {
      "name": "Rajesh Kumar",
      "mobile": "+91 9876543210",
      "location": "Indiranagar, Bangalore"
    },
    "vehicle": {
      "model": "Hyundai Creta",
      "year": "2022"
    },
    "serviceRequirement": "4 Tyres Replacement + Alignment",
    "leadCost": 50
  }
  ```

### Lead Actions
- **Buy Lead**: `POST /api/v1/leads/{leadId}/buy`
- **Skip Lead**: `POST /api/v1/leads/{leadId}/skip`
- **Update Status**: `PUT /api/v1/leads/{leadId}/status` (Body: `{ "status": "Follow-up" }`)

## 4. Wallet
### Get Wallet Details
- **Endpoint**: `GET /api/v1/dealer/wallet`
- **Response**:
  ```json
  {
    "balance": 2450,
    "transactions": [
      {
        "id": "tx_1",
        "title": "Added Money",
        "date": "2023-12-28T10:00:00Z",
        "amount": 2000,
        "type": "credit" // or "debit"
      }
    ]
  }
  ```

### Get Packages
- **Endpoint**: `GET /api/v1/dealer/packages`
- **Response**:
  ```json
  [
    {
      "id": "pkg_1",
      "name": "Starter",
      "price": 500,
      "credits": 10,
      "isPopular": false
    },
    {
      "id": "pkg_2",
      "name": "Growth",
      "price": 2000,
      "credits": 50,
      "isPopular": true
    }
  ]
  ```

### Buy Package / Add Money
- **Endpoint**: `POST /api/v1/dealer/wallet/recharge`
- **Request**: `{ "amount": 2000, "packageId": "pkg_2" }`

## 5. Stats & Performance
### Get Performance Metrics
- **Endpoint**: `GET /api/v1/dealer/stats`
- **Response**:
  ```json
  {
    "performanceScore": 8.5,
    "percentile": 95, // "Top 5%"
    "metrics": {
      "totalLeads": 124,
      "conversionRate": 42,
      "avgRating": 4.8,
      "avgResponseTime": "15m"
    },
    "ratingBreakdown": {
      "5star": 80,
      "4star": 15,
      "3star": 5,
      "2star": 0,
      "1star": 0
    }
  }
  ```

## 6. Settings & Notifications
### Get Notification Settings
- **Endpoint**: `GET /api/v1/dealer/settings/notifications`
- **Response**:
  ```json
  {
    "pushEnabled": true,
    "emailEnabled": false,
    "whatsappEnabled": true,
    "soundEnabled": false
  }
  ```

### Update Notification Settings
- **Endpoint**: `PUT /api/v1/dealer/settings/notifications`
- **Request**: `{ "pushEnabled": false, ... }`

### Get Notifications List (Modal)
- **Endpoint**: `GET /api/v1/dealer/notifications`
- **Response**:
  ```json
  [
    {
      "id": "notif_1",
      "title": "New Lead Available",
      "message": "Honda City owner looking for tyres near you.",
      "time": "2m ago",
      "read": false
    }
  ]
  ```
