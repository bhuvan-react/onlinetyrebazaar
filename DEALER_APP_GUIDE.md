# TyrePlus Dealer App — Complete Flow & Architecture Guide

> **Last updated:** February 2026  
> **Stack:** Next.js (Web Frontend) · React Native / Expo (Dealer Mobile App) · Spring Boot (Backend API)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Web Frontend — How a Lead is Created](#3-web-frontend--how-a-lead-is-created)
4. [Backend API — Lead Lifecycle](#4-backend-api--lead-lifecycle)
5. [Dealer Mobile App — Complete Screen Flow](#5-dealer-mobile-app--complete-screen-flow)
6. [Lead Flow: Web → Backend → Dealer App](#6-lead-flow-web--backend--dealer-app)
7. [Authentication Flow (OTP)](#7-authentication-flow-otp)
8. [Wallet & Credit System](#8-wallet--credit-system)
9. [Recent Changes](#9-recent-changes)

---

## 1. Project Overview

**TyrePlus** is a two-sided marketplace:

| Side          | Who                                   | Platform                              |
| ------------- | ------------------------------------- | ------------------------------------- |
| **Customers** | People who need tyres (buy/sell)      | Next.js Web (`/frontend/web`)         |
| **Dealers**   | Tyre shop owners who respond to leads | React Native App (`/frontend/mobile`) |

The **backend** (`/backend`) is a single Spring Boot API that serves both frontends.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Customer (Browser)                        │
│              Next.js Web App  (:3000)                       │
│    vehicle-selector → OTP login → questionnaire → lead      │
└───────────────────────┬─────────────────────────────────────┘
                        │  REST API calls
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot API  (:8081)                        │
│                                                             │
│  /api/v1/auth/customer/*   → Customer OTP login             │
│  /api/v1/customer/leads/*  → Customers create & view leads  │
│  /api/v1/leads/*           → Dealers discover & bid leads   │
│  /api/v1/auth/dealer/*     → Dealer login / register        │
│  /api/v1/dealer/*          → Dashboard, wallet, profile     │
│  /api/v1/vehicles/*        → Vehicle make/model/variant     │
└───────────────────────┬─────────────────────────────────────┘
                        │  REST API calls
                        ▼
┌─────────────────────────────────────────────────────────────┐
│          Dealer React Native App (Expo)                     │
│    Login → Dashboard → Leads → Bid → WhatsApp → Convert     │
└─────────────────────────────────────────────────────────────┘
```

**Database:** PostgreSQL  
**Cache / Tokens:** Redis (refresh tokens)  
**Migrations:** Flyway

---

## 3. Web Frontend — How a Lead is Created

### Files Involved

- `frontend/web/components/vehicle-selector.tsx` — Main entry point
- `frontend/web/components/otp-modal.tsx` — OTP verification popup
- `frontend/web/components/tyre-questionnaire.tsx` — Urgency & preference questions
- `frontend/web/lib/services/lead-service.ts` — API call to create lead
- `frontend/web/lib/services/auth-service.ts` — OTP send & verify

### Step-by-Step Customer Journey (Buy Flow)

```
Step 1: Land on homepage
         └─ VehicleSelector component loads in "Buy" mode

Step 2: Fill the vehicle form
         ├─ Select vehicle type (2W / 3W / 4W)
         ├─ Select tyre position (Front / Rear / Both) — only 2W
         ├─ Enter full name
         ├─ Select Make → Model → Variant (cascading dropdowns, API-driven)
         ├─ Select Tyre Size (auto-fetched from vehicle variant)
         └─ Enter pincode (auto-resolves city/state via geocoding API)

Step 3: Click "Find My Tyres"
         └─ If NOT already logged in:
              ├─ Calls POST /api/v1/auth/customer/send-otp  { mobile }
              └─ Shows OTP modal

Step 4: Enter OTP in modal
         ├─ Calls POST /api/v1/auth/customer/verify-otp  { mobile, otp }
         ├─ Backend returns JWT token + user info
         └─ User stored in Redux state + localStorage

Step 5: Tyre Questionnaire (after OTP verified)
         ├─ "How urgent?" (Today / This week / Just exploring)
         └─ "Preferences?" (Brand, budget, etc.)

Step 6: Submit questionnaire → Create Lead
         ├─ Calls POST /api/v1/customer/leads
         │   Body: { vehicleType, vehicleModel, tyreSize, tyreType,
         │           tyreBrand, locationArea, locationPincode,
         │           urgency, quantity }
         └─ On success → navigated to search results page
```

### Sell Flow (for used tyres)

```
Customer clicks "Sell Tyres" tab
  └─ Enter mobile number
       └─ Calls POST /api/v1/auth/customer/send-otp
            └─ Enters 4-digit OTP (auto-submits on last digit)
                 └─ On success → navigates to /sell-tyres page
```

---

## 4. Backend API — Lead Lifecycle

### Controllers & Responsibilities

| Controller               | Base Path                | Who Uses It                     |
| ------------------------ | ------------------------ | ------------------------------- |
| `CustomerAuthController` | `/api/v1/auth/customer`  | Customer — OTP login            |
| `DealerAuthController`   | `/api/v1/auth/dealer`    | Dealer — register, login, OTP   |
| `CustomerLeadController` | `/api/v1/customer/leads` | Customer — create & view leads  |
| `LeadController`         | `/api/v1/leads`          | Dealer — browse, bid, update    |
| `DealerController`       | `/api/v1/dealer`         | Dealer — profile, dashboard     |
| `WalletController`       | `/api/v1/dealer/wallet`  | Dealer — balance & recharge     |
| `VehicleController`      | `/api/v1/vehicles`       | Web — make/model/variant lookup |
| `TyreController`         | `/api/v1/tyres`          | Web — tyre search results       |
| `SellTyreController`     | `/api/v1/sell-tyre`      | Customer — list used tyres      |
| `OrderController`        | `/api/v1/orders`         | Order management                |
| `LocationController`     | `/api/v1/locations`      | Pincode lookup                  |
| `AdminController`        | `/api/v1/admin`          | Admin — platform management     |

### Lead Status State Machine

```
NEW ──────────────────────► FOLLOW_UP (dealer's wallet debited when customer selects offer)
  │                              │
  │ dealer makes offer           │ dealer chats / follows up
  ▼                              ▼
SKIPPED               CONVERTED (sale completed)
```

### Key Services

| Service                   | What it does                                                             |
| ------------------------- | ------------------------------------------------------------------------ |
| `OtpService`              | Generates 4-digit OTP, saves to DB, calls `SmsService`                   |
| `AuthService`             | Login, register, verify OTP, create guest accounts                       |
| `LeadDiscoveryService`    | Browse leads (paginated, filtered, sorted)                               |
| `LeadPurchaseService`     | Customer selects a dealer offer → deducts 100 credits from dealer wallet |
| `LeadStatusUpdateService` | Dealer updates lead status (FOLLOW_UP, CONVERTED, SKIPPED)               |
| `OfferService`            | Dealer submits a bid/offer on a lead                                     |

---

## 5. Dealer Mobile App — Complete Screen Flow

### Navigation Structure

```
App Start
  │
  ├─ Not logged in ──► LoginScreen
  │                       ├─ Enter phone number
  │                       ├─ Quick OTP login (4-digit OTP)
  │                       └─ Password login (if set)
  │
  └─ Logged in ──── Bottom Tab Navigator
                        ├─ Dashboard (DashboardScreen)
                        ├─ Leads (LeadsScreen)
                        ├─ Wallet (WalletScreen)
                        └─ Settings (SettingsScreen)
```

### Screen-by-Screen Breakdown

#### 🏠 DashboardScreen

- Calls `GET /api/v1/dealer/dashboard`
- Shows summary: total leads, converted, wallet balance
- Quick links to Leads and Wallet

#### 📋 LeadsScreen

- Calls `GET /api/v1/leads` with filters & sort
- **Filters:** All · New · Follow-up · Converted · Unlocked
- **Sort:** Date Newest / Oldest / Priority
- Each card shows customer name, vehicle, date, status
- Tapping a card → `LeadDetailsScreen`

#### 📄 LeadDetailsScreen

- Calls `GET /api/v1/leads/{leadId}`
- Shows: customer name, location, vehicle model, service requirement, questionnaire summary
- **Actions depend on status:**
  - `NEW` → "Make an Offer" button + "Skip Lead"
  - `FOLLOW_UP / BOUGHT` → "Chat on WhatsApp" (opens WhatsApp with pre-filled message)
  - `CONVERTED` → Completion badge

#### 💡 OfferSubmissionScreen

- Dealer enters offer price + note
- Calls `POST /api/v1/leads/{leadId}/offer`
- After submission → lead status tracked in backend

#### 💰 WalletScreen

- Calls `GET /api/v1/dealer/wallet`
- Shows current balance (credits)
- Lists available packages to recharge
- Calls `POST /api/v1/dealer/wallet/testRecharge` to add credits

#### ⚙️ SettingsScreen

- Calls `GET /api/v1/dealer/profile` to display profile info
- Links to EditProfile, notifications settings

#### 📝 RegisterScreens (two types)

| Screen                     | Use case               | Endpoint                                     |
| -------------------------- | ---------------------- | -------------------------------------------- |
| `RoadsideRegisterScreen`   | Quick/roadside dealer  | `POST /api/v1/auth/dealer/register/complete` |
| `FullDealerRegisterScreen` | Full shop registration | `POST /api/v1/auth/dealer/register/complete` |

Both screens:

1. Collect dealer info (name, shop name, address, business hours)
2. **Send OTP** → `POST /api/v1/auth/dealer/quick/send-otp`
3. Verify OTP → register → automatically log in with returned JWT token

---

## 6. Lead Flow: Web → Backend → Dealer App

This is the **end-to-end journey** of a single lead:

```
CUSTOMER (Web)                    BACKEND                    DEALER (Mobile App)
─────────────                     ───────                    ──────────────────
1. Fills vehicle form
2. Verifies mobile via OTP ───────► /auth/customer/send-otp
                           ◄─────── OTP delivered to WhatsApp (via MSG91)
3. Submits questionnaire
4. Creates lead ──────────────────► POST /customer/leads
                                         │
                                         ▼
                                    Lead saved in DB
                                    Status = NEW
                                         │
                                         ▼
5.                                  Dealers browse ◄── GET /leads
                                    (anonymised — no customer contact shown)
                                         │
6.                                  Dealer sees    ◄── LeadsScreen filters
                                    the new lead
                                         │
7.                                  Dealer taps lead
                                    → LeadDetailsScreen
                                         │
8.                                  Dealer submits offer ──► POST /leads/{id}/offer
                                         │
9. Customer views offers ◄─────────────  GET /customer/leads/{id}/offers
10. Customer selects dealer ──────────► POST /customer/leads/{id}/select-offer/{dealerId}
                                             │
                                             ▼
                                        100 credits deducted from dealer wallet
                                        Lead status → FOLLOW_UP (for dealer)
                                             │
11.                                     Dealer sees "FOLLOW_UP" status
                                        "Chat on WhatsApp" button appears
                                             │
12.                                     Dealer taps WhatsApp ──► Opens WhatsApp
                                        Pre-filled message with            with customer
                                        dealer name & location
                                             │
13.                                     After successful sale:
                                        Dealer marks CONVERTED ──► PUT /leads/{id}/status?status=CONVERTED
```

---

## 7. Authentication Flow (OTP)

### Customer Authentication (Web)

```
sendCustomerOtp(mobile)
  └─► POST /api/v1/auth/customer/send-otp
        └─► OtpService.generateOtp(mobile)
              ├─ Saves OTP to DB (5-min expiry)
              └─ SmsService.sendSms(mobile, "Your TyrePlus code is: XXXX")
                    └─► [WhatsApp via MSG91 in production]

verifyCustomerOtp(mobile, otp)
  └─► POST /api/v1/auth/customer/verify-otp
        └─► OtpService.validateOtp(mobile, otp)
              ├─ Find or create Customer in DB
              └─ Return JWT access token + refresh token
```

### Dealer Authentication (Mobile App)

```
Quick Login (no registration needed):
  sendOtp(mobile) ─► POST /auth/dealer/quick/send-otp
  verifyOtp(mobile, otp) ─► POST /auth/dealer/quick/verify-otp
    └─ Auto-creates a "Guest Dealer" if not registered
    └─ Returns JWT token → stored in AsyncStorage

Full Registration:
  Fill form → sendOtp → verify → POST /auth/dealer/register/complete
    └─ Creates full dealer profile + initialises wallet
```

### OTP Rules

- 4-digit code, valid for **5 minutes**
- Maximum **3 attempts** per OTP
- After 3 failed attempts, a new OTP must be requested
- Once used, the OTP is marked as consumed

---

## 8. Wallet & Credit System

Dealers pay using a **credit wallet** to access customer contact details.

| Event                           | Credit Change                     |
| ------------------------------- | --------------------------------- |
| Package recharge                | +credits (various packages)       |
| Customer selects dealer's offer | **-100 credits** from that dealer |

- Dealers can view balance in `WalletScreen`
- Recharge via Razorpay (payment keys configured via env vars)
- Wallet is created automatically on dealer registration

---

## 9. Recent Changes

### ✅ WhatsApp OTP via MSG91

**Date:** February 2026

Previously, OTPs were only logged to the backend console (`ConsoleSmsService`). The following changes were made to deliver OTPs to the customer's/dealer's WhatsApp number via **MSG91**.

#### New File

**`backend/src/main/java/com/tyreplus/dealer/infrastructure/sms/Msg91WhatsAppSmsService.java`**

- Implements the existing `SmsService` interface
- Activated by Spring profile `whatsapp` (`SPRING_PROFILES_ACTIVE=whatsapp`)
- Makes a `POST` request to MSG91's WhatsApp bulk API:
  ```
  POST https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/
  Header: authkey: <MSG91_AUTH_KEY>
  Body: { integrated_number, content_type: "template", payload: { to, template: { name, components: [otp] } } }
  ```
- Handles Indian mobile number normalisation (`+91XXXXXXXXXX` → `91XXXXXXXXXX`)
- Supports **template messages** (required by WhatsApp Business API)

#### Modified Files

| File                     | Change                                                                          |
| ------------------------ | ------------------------------------------------------------------------------- |
| `ConsoleSmsService.java` | Added `@Profile("!whatsapp")` — only active in dev when WhatsApp profile is off |
| `application.properties` | Added MSG91 config keys (values injected from env vars)                         |

#### Configuration (3 environment variables needed)

```properties
# application.properties (values from environment)
msg91.auth-key=${MSG91_AUTH_KEY:}
msg91.integrated-number=${MSG91_INTEGRATED_NUMBER:}
msg91.template-name=${MSG91_TEMPLATE_NAME:tyreplus_otp}
```

#### How to Enable

```bash
# Start backend with WhatsApp OTP active
SPRING_PROFILES_ACTIVE=whatsapp \
MSG91_AUTH_KEY=your_key_here \
MSG91_INTEGRATED_NUMBER=919876543210 \
MSG91_TEMPLATE_NAME=tyreplus_otp \
mvn spring-boot:run -f backend/pom.xml
```

No frontend or API endpoint changes were needed — the same `POST /api/v1/auth/customer/send-otp` and `POST /api/v1/auth/dealer/quick/send-otp` calls now trigger WhatsApp delivery instead of console logging.

---

## Key File Reference

| What you want to find                         | File                                                    |
| --------------------------------------------- | ------------------------------------------------------- |
| Web homepage vehicle selector & lead creation | `frontend/web/components/vehicle-selector.tsx`          |
| OTP popup on web                              | `frontend/web/components/otp-modal.tsx`                 |
| Post-OTP questionnaire                        | `frontend/web/components/tyre-questionnaire.tsx`        |
| Mobile app API service                        | `frontend/mobile/src/services/api.ts`                   |
| Mobile leads list screen                      | `frontend/mobile/src/screens/LeadsScreen.tsx`           |
| Mobile lead detail & offer                    | `frontend/mobile/src/screens/LeadDetailsScreen.tsx`     |
| Mobile offer submission                       | `frontend/mobile/src/screens/OfferSubmissionScreen.tsx` |
| OTP generation & validation                   | `backend/.../service/OtpService.java`                   |
| WhatsApp OTP delivery (MSG91)                 | `backend/.../sms/Msg91WhatsAppSmsService.java`          |
| Lead creation by customer                     | `backend/.../controller/CustomerLeadController.java`    |
| Lead browsing by dealer                       | `backend/.../controller/LeadController.java`            |
| Auth for customers                            | `backend/.../controller/CustomerAuthController.java`    |
| Auth for dealers                              | `backend/.../controller/DealerAuthController.java`      |
| Wallet & credits                              | `backend/.../controller/WalletController.java`          |
| All config / env vars                         | `backend/src/main/resources/application.properties`     |
