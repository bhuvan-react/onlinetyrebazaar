# Tyre Bazaar API Reference

This document provides a list of API endpoints used by the Tyre Bazaar ecosystem (Web and Mobile).

## Customer APIs (Next.js Web App)

Used for searching tyres, creating leads, and managing vehicle profiles.

| Category     | Endpoint                                              | Method | Description                                         |
| :----------- | :---------------------------------------------------- | :----- | :-------------------------------------------------- |
| **Auth**     | `/api/v1/auth/customer/send-otp`                      | POST   | Triggers SMS OTP for login                          |
|              | `/api/v1/auth/customer/verify-otp`                    | POST   | Verifies OTP and returns JWT                        |
| **Tyres**    | `/api/v1/tyres`                                       | GET    | List available tyres (with filters for size/brand)  |
|              | `/api/v1/tyres/{id}`                                  | GET    | Get individual tyre details                         |
| **Leads**    | `/api/v1/customer/leads`                              | POST   | Create a lead (persists vehicle info and `tyre_id`) |
|              | `/api/v1/customer/leads`                              | GET    | List leads created by the logged-in customer        |
|              | `/api/v1/customer/leads/{id}/offers`                  | GET    | View dealer bids/offers for a specific lead         |
|              | `/api/v1/customer/leads/{id}/select-offer/{dealerId}` | POST   | Select a dealer's bid (Triggers lead unlock)        |
| **Vehicles** | `/api/v1/vehicles`                                    | GET    | List customer's saved vehicles                      |
|              | `/api/v1/vehicles`                                    | POST   | Add a new vehicle to profile                        |

## Dealer APIs (Expo Mobile App)

Used for discovering leads, purchasing them (bidding), and managing the transaction lifecycle.

| Category      | Endpoint                          | Method | Description                                         |
| :------------ | :-------------------------------- | :----- | :-------------------------------------------------- |
| **Auth**      | `/api/v1/auth/dealer/login`       | POST   | Mobile/password login for dealers                   |
|               | `/api/v1/auth/dealer/register`    | POST   | Multi-step registration for new dealers             |
| **Lead Feed** | `/api/v1/leads`                   | GET    | Discovery feed of active leads in the dealer's area |
|               | `/api/v1/leads/{id}`              | GET    | Get lead details (Contacts unlocked if selected)    |
|               | `/api/v1/leads/unlocked`          | GET    | List of leads where the dealer was selected         |
| **Actions**   | `/api/v1/leads/{id}/offer`        | POST   | Submit price bid and tyre availability              |
|               | `/api/v1/leads/{id}/status`       | PUT    | Update lead status (e.g., FOLLOW_UP, SKIPPED)       |
|               | `/api/v1/leads/{id}/replace-tyre` | PUT    | Mark as `CONVERTED` after tyre replacement          |
| **Wallet**    | `/api/v1/wallet`                  | GET    | Check current balance and history                   |
|               | `/api/v1/wallet/recharge`         | POST   | Add credits to the virtual wallet                   |

---

## Authentication Note

All endpoints (except `/auth/*`) require an `Authorization: Bearer <TOKEN>` header.

- **Dealer Role**: Required for `/api/v1/leads/*` and `/api/v1/wallet/*`.
- **Customer Role**: Required for `/api/v1/customer/leads/*` and `/api/v1/vehicles/*`.
