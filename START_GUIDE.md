# 🚀 TyrePlus — How to Start All Services

> **Prerequisite:** Docker must be running (for PostgreSQL & Redis)

---

## 1. Start Database (Docker)

```bash
cd /Users/credr/Downloads/tyre-bazaar-app-gemini
docker compose up -d
```

Starts PostgreSQL (:5432) and Redis (:6379).

---

## 2. Start Backend (Spring Boot — Port 8081)

```bash
cd /Users/credr/Downloads/tyre-bazaar-app-gemini
mvn spring-boot:run
```

Wait for: `Started TyrePlusDealerApplication` in the logs.

**Verify:** `curl http://localhost:8081/api/v1/vehicles/makes?type=4W`

---

## 3. Start Web Frontend (Next.js — Port 3000)

```bash
cd /Users/credr/Downloads/tyre-bazaar-app-gemini/frontend/web
npm install    # only first time
npm run dev
```

**Verify:** Open http://localhost:3000

---

## 4. Start TDealer Mobile App (Expo)

```bash
cd /Users/credr/Downloads/tyre-bazaar-app-gemini/frontend/mobile
npm install    # only first time
npx expo start
```

> ⚠️ If Expo asks to use a different port (because 8081 is taken by the backend), **press Y** to accept.

- **Android:** Press `a` in terminal to open in emulator, or scan QR with Expo Go app
- **iOS:** Press `i` in terminal to open in simulator, or scan QR with Camera app

---

## 5. API Base URL for Mobile (Physical Device)

If testing on a **physical phone**, update the API URL in:

```
frontend/mobile/src/services/api.ts
```

Change `API_BASE_URL` to your computer's LAN IP:

```js
const API_BASE_URL = "http://<YOUR-LAN-IP>:8081";
```

Find your LAN IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`

---

## Quick Reference

| Service  | Directory         | Command                | Port       |
| -------- | ----------------- | ---------------------- | ---------- |
| Database | project root      | `docker compose up -d` | 5432, 6379 |
| Backend  | project root      | `mvn spring-boot:run`  | 8081       |
| Web      | `frontend/web`    | `npm run dev`          | 3000       |
| Mobile   | `frontend/mobile` | `npx expo start`       | 8083+      |

## Stop All

```bash
# Stop backend: Ctrl+C in its terminal
# Stop web: Ctrl+C in its terminal
# Stop mobile: Ctrl+C in its terminal
# Stop database:
docker compose down
```
