<!-- Banner GIF -->
<p align="center">
  <img src="https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif" width="80%" alt="Shopify Data Insights Banner">
</p>

<h1 align="center">🚀 Shopify Multi-Tenant Data Ingestion & Insights Service</h1>

<p align="center">
  <b>Forward Deployed Engineer Internship Assignment – Xeno • 2025</b> <br>
  <img src="https://img.shields.io/badge/Backend-Node.js-blue?style=for-the-badge&logo=Node.js">
  <img src="https://img.shields.io/badge/Frontend-React.js-brightgreen?style=for-the-badge&logo=React">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-important?style=for-the-badge&logo=PostgreSQL">
</p>

<p align="center">
  <a href="https://www.getxeno.com"><img src="https://img.shields.io/badge/Xeno-Website-ff69b4?style=for-the-badge&logo=About.me"></a>
  <a href="mailto:your.email@domain.com"><img src="https://img.shields.io/badge/Email-Contact-success?style=for-the-badge&logo=Gmail"></a>
  <a href="https://www.linkedin.com/in/yourprofile"><img src="https://img.shields.io/badge/LinkedIn-yourprofile-blue?style=for-the-badge&logo=LinkedIn"></a>
  <a href="https://twitter.com/yourprofile"><img src="https://img.shields.io/badge/Twitter-@yourprofile-1da1f2?style=for-the-badge&logo=Twitter"></a>
</p>

---

## 💡 Features

- Connects and syncs with multiple Shopify stores via API integration (multi-tenancy)
- Ingests Customers, Orders, Products, plus bonus custom events (e.g., cart abandoned)
- Email-authenticated dashboard visualizes total customers, revenue, top customers, more
- Isolated data per store via tenant ID
- Trend charts and creative business insights
- Scheduler/webhook support for continuous data sync
- Clean deployment (Heroku, Render, Railway, Vercel)

---

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Backend    | Node.js (Express.js)               |
| Frontend   | React.js / Next.js                 |
| Database   | PostgreSQL / MySQL                 |
| ORM        | Sequelize / Prisma                  |
| Auth       | Email, JWT/Sessions                |
| Async      | Redis / RabbitMQ (Optional)        |
| Charts     | Chart.js, Recharts, etc.           |

---

<!-- Animated process GIF (replace with demo GIF for your project) -->
<p align="center">
  <img src="C:\Users\Akshi\OneDrive\Pictures\Screenshots\Screenshot 2025-09-14 032243.png" width="600" alt="Data Flow Demo">
</p>

---

## 🚦 Quick Start


#### Setup Instructions

1. Create `.env` with DB, API key, JWT configs  
2. Install dependencies:
3. Run database migrations  
4. Start backend and frontend servers  
5. Deploy via Heroku/Render/Railway/Vercel (follow respective guides)  

---

## 📊 Sample Dashboard Screenshot

<p align="center">
<img src="https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif" width="70%" alt="Dashboard Demo GIF">
</p>

---

## 🔗 API Endpoints

| Method | Endpoint                       | Description                             |
|--------|-------------------------------|-----------------------------------------|
| POST   | `/api/tenant/onboard`         | Register a new Shopify store            |
| GET    | `/api/:tenantId/customers`    | Get customers for a store               |
| GET    | `/api/:tenantId/orders`       | List orders (filter by date-range)      |
| GET    | `/api/:tenantId/products`     | Get products per store                  |
| GET    | `/api/:tenantId/metrics`      | Get dashboard metrics                   |

---

## 🗄️ Sample Database Schema

| Table      | Key Fields                                    |
|------------|-----------------------------------------------|
| Tenants    | id, name, shopify_store_id, email             |
| Customers  | id, tenant_id, name, email, ...               |
| Orders     | id, tenant_id, customer_id, date, total_amount|
| Products   | id, tenant_id, sku, title, ...                |
| Events     | id, tenant_id, type, payload, ...             |

---

## 🎥 Demo

Check out the [Demo Video](https://drive.google.com/demo-link) for a walkthrough (max 7 mins):  
- Features you built  
- How you solved the problem  
- Key trade-offs and design choices  

---

## 👀 Assumptions & Limitations

- Demo uses development Shopify store and sample data
- Data isolation handled per tenant_id; RBAC is basic
- Real-time sync via webhooks not fully production-level
- Redis/RabbitMQ used optionally for async event ingestion

---

## 📈 Next Steps

- Add OAuth, RBAC, SSO for fine-grained access
- Scale sync using event-driven messaging
- Setup CI/CD, monitoring, logging, robust security
- Extend dashboard analytics and business metrics

---

## 🙌 About

Built for the Xeno FDE Internship – 2025  
Integrate. Adapt. Deliver. Real-world retail engineering.  
&nbsp;

---

## 🌐 Connect With Me!

<p align="center">
<a href="mailto:your.email@domain.com"><img src="https://img.shields.io/badge/Gmail-your-email-red?style=for-the-badge&logo=Gmail"></a>
<a href="https://www.linkedin.com/in/yourprofile"><img src="https://img.shields.io/badge/LinkedIn-yourprofile-blue?style=for-the-badge&logo=LinkedIn"></a>
<a href="https://twitter.com/yourprofile"><img src="https://img.shields.io/badge/Twitter-@yourprofile-1da1f2?style=for-the-badge&logo=Twitter"></a>
</p>

<p align="center">
<img src="https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif" width="40%" alt="Thanks GIF">
</p>

---

<!-- Tips
- Replace GIF/image URLs with your own hosted project GIFs/screenshots for best results.
- Customize contact/social links as needed.  
- Add badges, emoji dividers, or more GIFs for extra flair!
-->

