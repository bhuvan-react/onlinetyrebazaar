# TyrePlus Dealer App

## Project Structure
This project is organized as a monorepo with distinct backend and frontend directories:

- **`backend/`**: Spring Boot application (Maven project). Contains the core business logic, API, and database entities.
- **`frontend/`**: Next.js application. Contains the dealer-facing UI.

## Getting Started

### Prerequisites
- Java 21+
- Node.js 20+ (Optional, Maven handles this locally)
- Maven 3.9+
- PostgreSQL

### Build & Run
The backend controls the build process. It will automatically build the frontend and package it into the JAR.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the application:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   Access the app at `http://localhost:8080`.

### Development
- **Backend**: Open `backend/pom.xml` as a project in your IDE (IntelliJ/Eclipse).
- **Frontend**: Navigate to `frontend/` and run `npm run dev` for hot-reloading UI development. Endpoint: `http://localhost:3000`.
