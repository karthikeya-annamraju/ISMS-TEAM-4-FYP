# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

- **Build:** `./mvnw clean package` (or `./mvnw clean package -DskipTests`)
- **Run:** `./mvnw spring-boot:run` (starts on port 8080)
- **Run tests:** `./mvnw test`
- **Run single test:** `./mvnw test -Dtest=SubscriptionApplicationTests`
- **H2 Console:** Available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:intellisubdb`, user: `sa`, no password)

## Architecture

This is a **Spring Boot 3.5 / Java 17** subscription management system ("IntelliSub") using Maven. It uses an in-memory H2 database by default (MySQL config is present but commented out in `application.properties`).

### Package Structure (`com.example.subscription`)

The app follows a standard layered architecture: **Controller → Service → Repository → Entity**.

- **entity/** — JPA entities: `User` (USER/ADMIN roles, BCrypt passwords), `Plan` (name, price, data quota), `Subscription` (ACTIVE/CANCELLED/EXPIRED/PAUSED statuses), `Discount`, `UsageRecord`, `AuditLog`
- **repository/** — Spring Data JPA repositories for each entity
- **service/** — Business logic. `SubscriptionService` handles subscribe/cancel/upgrade/downgrade and writes audit logs. `UserService` handles auth with BCrypt.
- **controller/** — REST API under `/api/**`. Key controllers:
  - `AuthController` (`/api/auth`) — register/login for users and admins, separate endpoints per role
  - `SubscriptionController` (`/api/subscriptions`) — CRUD subscription operations
  - `PlanController`, `DiscountController`, `UsageRecordController`, `AuditLogController`, `UserController`
  - `AnalyticsController` (`/api/analytics`) — returns hardcoded summary/trend data (mock)
  - `AIController` (`/api/ai`) — returns hardcoded churn risk data (mock)
  - `AdminPlanController` (`/api/admin/plans`) — admin plan management
- **dto/** — `RegisterRequest`, `LoginRequest`, `LoginResponse`
- **config/** — `WebConfig` sets up CORS for `/api/**` using `cors.allowed.origins` property

### AI/ML Module (`com.example.subscription.ai`)

A churn prediction subsystem that communicates with an external **Python ML service** (expected at `http://localhost:5000`):
- `PythonMLClient` — REST client calling `/api/train` and `/api/predict` on the Python service
- `AIService` — orchestrates CSV upload, model training, churn prediction, and risk-level recommendations
- Entities: `MLModel`, `ChurnPrediction` with their own repositories and DTOs

Note: The `AIController` in the main controller package returns **mock data** and is separate from the real AI service layer.

### Key Design Notes

- No Spring Security filter chain configured — authentication is handled manually via BCrypt password comparison in `UserService`
- CORS is configured globally in `WebConfig` and also via `@CrossOrigin` annotations on some controllers
- All subscription mutations (subscribe, cancel, upgrade, downgrade) are automatically audit-logged
- Entities use manual getters/setters (Lombok is a dependency but not used on most entities)
- The test package is `com.example.demo` (differs from main package `com.example.subscription`)
