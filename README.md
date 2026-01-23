
<div align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <h1>Wayfare Backend</h1>
  <p>The robust server-side application powering the <strong>Wayfare</strong> travel platform.</p>
</div>

## 🌍 Abstract

**Wayfare** is a comprehensive travel platform designed to connect wanderlust-driven users with top-tier travel agencies. It serves as a one-stop solution where users can:
- **Plan Trips & Book Packages**: Compare agencies, view detailed itineraries, and book trips seamlessly.
- **AI-Powered Itineraries**: For short trips or indecisive travelers, our integrated AI generates personalized itineraries instantly.
- **Social Connection**: Connect with other travelers heading to the same destination on the same dates via real-time chat and video calls.
- **Agency Management**: Agencies have dedicated dashboards to manage bookings, track revenue, and handle payouts via a secure wallet system.

This repository houses the **Backend API**, built with **NestJS**, following **Clean Architecture** principles to ensure scalability, maintainability, and testability.

## 🚀 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Architecture**: Domain-Driven Design (DDD) & Clean Architecture
- **Real-time Communication**: [Socket.io](https://socket.io/) (Chat & Video calls)
- **AI Integration**: OpenAI (Itinerary generation)
- **Queue System**: BullMQ & Redis (Background jobs)
- **Search Engine**: Elasticsearch (Advanced search capabilities)
- **Services**:
    - **Stripe** (Payments & Payouts)
    - **Cloudinary** (Image management)
    - **Nodemailer** (Email notifications)
- **Authentication**: JWT, Passport, Google OAuth

## 📂 Project Structure

This project follows a strict **Clean Architecture** layout:

```
src/
├── application/    # Business logic, Use Cases, DTOs
├── domain/         # Entities, Repository Interfaces, Enums (Core Logic)
├── infrastructure/ # Database implementation, External services, Mappers
├── presentation/   # Controllers, Modules (Entry points)
└── main.ts         # Application entry point
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or later)
- Docker & Docker Compose (optional, for DB/Redis)
- PostgreSQL
- Redis

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and configure the necessary variables (Database URL, API keys, etc.).
   ```bash
   cp .env.example .env
   ```

4. **Database Setup**
   Run Prisma migrations to set up your database schema.
   ```bash
   npx prisma migrate dev
   ```

5. **Run the Application**

   *Development Mode*
   ```bash
   npm run start:dev
   ```

   *Production Mode*
   ```bash
   npm run start:prod
   ```

## 📜 Key Features

### ✈️ for Travelers
- **Smart Search**: Find packages using Elasticsearch.
- **AI Itinerary**: Generate travel plans automatically.
- **Community**: Chat and video call with fellow travelers.

### 🏢 for Agencies
- **Dashboard**: Analytics and booking management.
- **Wallet & Payouts**: Track earnings, view balance, and request payouts to bank accounts.
- **Package Management**: Create and update travel packages.

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🤝 Support
For any issues or feature requests, please contact the development team.
