# IntelliSub - Intelligent Subscription Management System

A full-stack subscription management platform with AI-powered churn prediction, built as a Final Year Project (ISMS - Team 4).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts |
| **Backend** | Spring Boot 3.5, Java 17, Spring Data JPA, Maven |
| **AI Service** | Python, Flask, scikit-learn, pandas |
| **Database** | H2 (dev) / MySQL (prod) |

## Project Structure

```
├── frontend/       # React SPA - user & admin dashboards
├── backend/        # Spring Boot REST API
├── ai_service/     # Python ML service for churn prediction
└── docs/           # Project documentation
```

## Features

- **User Authentication** - Registration & login for Users and Admins (BCrypt hashed passwords)
- **Subscription Management** - Subscribe, cancel, upgrade, and downgrade plans
- **Admin Dashboard** - Plan management, analytics, and user oversight
- **AI Churn Prediction** - ML-based customer churn risk analysis using scikit-learn
- **Usage Tracking** - Monitor subscription usage records
- **Audit Logging** - Automatic logging of all subscription mutations
- **Discount Management** - Create and apply discount codes
- **Multi-language Support** - Internationalization via LanguageContext
- **Chatbot** - Built-in support chatbot

## Prerequisites

- **Java 17+**
- **Node.js 18+** (or Bun)
- **Python 3.10+**
- **Maven** (or use the included `mvnw` wrapper)
- **MySQL** (optional - H2 is used by default for development)

## Getting Started

### 1. Backend (Spring Boot)

```bash
cd backend

# Build and run
./mvnw clean package
./mvnw spring-boot:run
```

The API starts at `http://localhost:8080`. H2 console is available at `http://localhost:8080/h2-console`.

### 2. Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app starts at `http://localhost:5173`.

### 3. AI Service (Python)

```bash
cd ai_service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the service
python app.py
```

The ML service starts at `http://localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/user` | Register a new user |
| POST | `/api/auth/register/admin` | Register a new admin |
| POST | `/api/auth/login/user` | User login |
| POST | `/api/auth/login/admin` | Admin login |
| GET | `/api/auth/health` | Health check |

### Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions` | List subscriptions |
| POST | `/api/subscriptions` | Create subscription |
| PUT | `/api/subscriptions/{id}` | Update subscription |
| DELETE | `/api/subscriptions/{id}` | Cancel subscription |

### Other
- `/api/plans` - Plan management
- `/api/discounts` - Discount management
- `/api/usage-records` - Usage tracking
- `/api/audit-logs` - Audit logs
- `/api/analytics` - Analytics dashboard data
- `/api/ai` - AI churn prediction
- `/api/admin/plans` - Admin plan management

## Team

**ISMS - Team 4** (Final Year Project)
