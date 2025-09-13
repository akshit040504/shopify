# 🚀 Shopify Multi-Tenant Data Ingestion & Insights Service

Welcome to the Shopify Data Ingestion & Insights Service — built as a hands-on solution for the Xeno FDE Internship 2025 assignment. This project demonstrates enterprise-grade engineering skills: onboarding, integrating, and analyzing retailer customer data with multi-tenancy, real-time sync, and engaging dashboards.

## Table of Contents

- Features
- Tech Stack
- Architecture Overview
- Setup Instructions
- API Endpoints
- Database Schema
- Demo & Documentation
- Assumptions & Limitations
- Next Steps

---

### 🌟 Features

- Connects to multiple Shopify stores via robust **Shopify API** integration.
- Ingests **Customers, Orders, Products**, and **Custom Events** (Bonus).
- **Multi-tenant architecture:** Separate data isolate per store, identified by a tenant ID.
- Insights Dashboard (Email Auth):
    - Total customers, orders, revenue.
    - Orders by date (date-range filter).
    - Top 5 customers by spend.
    - Trend charts for business metrics (creative custom visualizations).
- Schedulable data sync (Webhooks/Scheduler).
- Deployed (Heroku/Render/Railway/Vercel).

---

### 🛠️ Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Backend    | Node.js (Express.js)                 |
| Frontend   | React.js / Next.js                   |
| Database   | PostgreSQL / MySQL                   |
| ORM        | Sequelize / Prisma                   |
| Charting   | Chart.js / Recharts                  |
| Auth       | Email Authentication (JWT/Sessions)  |
| Optional   | Redis / RabbitMQ (Async ingestion)   |

---

### 🔗 Architecture Overview

<!-- Place your architecture diagram below -->
![High-level Architecture Diagram goes here](architecture-diagram.png)

- Each Shopify store (tenant) is onboarded and isolated via a unique tenant ID.
- Data ingested securely from Shopify APIs, persisted in RDBMS using ORM.
- Scheduled job or webhooks keep data synced.
- API serves backend data to Dashboard frontend (React/Next.js).
- Auth via email ensures dashboard security.

---

### 🚦 Setup Instructions

1. **Clone the Repo**
    ```
    git clone https://github.com/<your-username>/xeno-shopify-insights.git
    cd xeno-shopify-insights
    ```

2. **Configure Environment**
    - Create a `.env` file with DB credentials, Shopify API keys, JWT secret, etc.
    - Example:
        ```
        DB_HOST=localhost
        DB_USER=your_db_user
        DB_PASS=your_db_password
        SHOPIFY_API_KEY=your_shopify_api_key
        SHOPIFY_API_SECRET=your_shopify_api_secret
        JWT_SECRET=random_secret_key
        ```

3. **Install Dependencies**
    ```
    # For backend
    cd backend
    npm install

    # For frontend
    cd ../frontend
    npm install
    ```

4. **Setup Database**
    - Run migrations (Sequelize/Prisma):
      ```
      npx sequelize db:migrate
      # or
      npx prisma migrate dev
      ```

5. **Start Development**
    ```
    cd backend
    npm run dev

    cd ../frontend
    npm start
    ```

6. **Deploy**
    - Push to Heroku, Render, Railway, or Vercel (see respective docs).

---

### 📡 API Endpoints Example

| Method | Endpoint                       | Description                   |
|--------|-------------------------------|-------------------------------|
| POST   | `/api/tenant/onboard`         | Register a new store          |
| GET    | `/api/:tenantId/customers`    | List customers of store       |
| GET    | `/api/:tenantId/orders`       | List orders, date-range filter|
| GET    | `/api/:tenantId/products`     | List products                 |
| GET    | `/api/:tenantId/metrics`      | Dashboard metrics             |

See detailed docs in `/docs/api.md`.

---

### 🗄️ Database Schema (Sample: Sequelize/Prisma)

| Table      | Key Fields                                      |
|------------|-------------------------------------------------|
| Tenants    | `id`, `name`, `shopify_store_id`, `email`       |
| Customers  | `id`, `tenant_id`, `name`, `email`, ...         |
| Orders     | `id`, `tenant_id`, `customer_id`, `date`, `total_amount`, ... |
| Products   | `id`, `tenant_id`, `sku`, `title`, ...          |
| Events     | `id`, `tenant_id`, `type`, `payload`, ...       |

---

### 🎥 Demo & Documentation

- [Demo Video Link — max 7mins]
- [Docs: `/docs/architecture.md`]
- [API + DB Schema: `/docs/api.md`]
- Demo covers features, approach, trade-offs, and creative decisions.

---

### 👀 Assumptions & Known Limitations

- Dummy development Shopify store is used for demo data.
- Data isolation is per tenant via `tenant_id`; role-based access is basic.
- Scheduled sync uses CRON jobs; full real-time sync possible with Shopify webhooks.
- Bonus custom events and async ingestion (using Redis/RabbitMQ) optional.

---

### 📈 Next Steps for Production

- Enhance authentication (OAuth2, RBAC, SSO).
- Scale data sync using event-driven architecture (RabbitMQ).
- Implement CI/CD pipelines, monitoring, and logging.
- Harden API security and perform load testing.
- Extend dashboard analytics with advanced business metrics.

---

### 📬 Contact

Questions? Reach out at [your.email@domain.com] or Xeno HR portal.

**Built for Xeno FDE Internship — 2025**

*Integrate. Adapt. Deliver. In Real-World Retail Environments.*
