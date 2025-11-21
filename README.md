# Scalable E-Commerce Web Application

This project is a scalable, full-stack web application built for the Frontend Developer Intern assignment. It features a modern, responsive frontend, a robust backend with authentication, and a comprehensive dashboard for managing products and orders.

## 🚀 Features

### Frontend (React/Next.js)
*   **Responsive Design**: Built with TailwindCSS for mobile-first responsiveness.
*   **Authentication**: Secure Signup, Login, and Logout for both Users and Producers using JWT.
*   **Role-Based Access**: Separate dashboards for Users (Shopping) and Producers (Selling).
*   **Dashboard**:
    *   **Users**: Browse products, add to cart, place orders, manage profile/addresses.
    *   **Producers**: CRUD operations for products, view analytics, manage orders.
*   **Search & Filter**: Real-time search and category filtering.
*   **Geolocation**: Product sorting based on distance from the user.

### Backend (Node.js/Express)
*   **Authentication**: JWT-based auth with bcrypt password hashing.
*   **Database**: PostgreSQL with Sequelize ORM.
*   **API Documentation**: Integrated Swagger UI (`/api-docs`).
*   **Search Engine**: Meilisearch integration for high-performance search.
*   **File Uploads**: Cloudinary integration for image hosting.

## 🛠 Tech Stack

*   **Frontend**: Next.js 14, TailwindCSS, React Icons, React Toastify
*   **Backend**: Node.js, Express.js, Sequelize (PostgreSQL)
*   **Database**: PostgreSQL
*   **Search**: Meilisearch
*   **Storage**: Cloudinary
*   **Tools**: Swagger (API Docs), Postman

## 📂 Project Structure

```
root/
├── BE/                 # Backend (Node.js/Express)
│   ├── config/         # DB and app config
│   ├── controllers/    # Logic for routes
│   ├── middleware/     # Auth and upload middleware
│   ├── models/         # Sequelize models
│   ├── routes/         # API endpoints
│   ├── swaggerDocs.js  # API Documentation Config
│   ├── app.js          # App entry point
│   └── ...
├── FE/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/        # API helpers
│   │   └── ...
│   └── ...
└── README.md           # This file
```

## ⚙️ Setup Instructions

### Prerequisites
*   Node.js (v16+)
*   PostgreSQL
*   Cloudinary Account (for images)
*   Meilisearch (optional, for advanced search)

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd BE
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `BE/` with the following:
    ```env
    PORT=5000
    DATABASE_URL=postgres://user:pass@localhost:5432/dbname
    JWT_SECRET=your_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    MEILISEARCH_HOST=http://127.0.0.1:7700
    MEILISEARCH_KEY=your_master_key
    ```
4.  Run database migrations (if applicable) or let Sequelize sync on start.
5.  Start the server:
    ```bash
    npm run dev
    ```
    The server will run at `http://localhost:5000`.
    **API Docs**: Visit `http://localhost:5000/api-docs` for Swagger UI.

### 2. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd FE
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in `FE/` with:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The app will run at `http://localhost:3000`.

## 📈 Scalability Notes

To ensure this application scales effectively for production, the following strategies are recommended:

1.  **Database Optimization**:
    *   Use managed database services (AWS RDS, Google Cloud SQL) with read replicas to handle high traffic.
    *   Implement connection pooling.

2.  **Caching Strategy**:
    *   Use **Redis** to cache frequently accessed data like product categories, user sessions, and popular products to reduce database load.
    *   Implement CDN caching for static assets and product images.

3.  **Microservices Architecture**:
    *   Decouple the monolith into separate services:
        *   **Auth Service**: User/Producer management.
        *   **Product Service**: Catalog management.
        *   **Order Service**: Transaction processing.
    *   Use message queues (RabbitMQ/Kafka) for asynchronous tasks like notifications and analytics.

4.  **Search Scaling**:
    *   Host Meilisearch on a dedicated high-memory instance or use Algolia for managed search scaling.

5.  **Infrastructure**:
    *   Deploy using Docker/Kubernetes for container orchestration and auto-scaling based on CPU/Memory usage.
    *   Use a Load Balancer (AWS ALB/Nginx) to distribute traffic across multiple backend instances.

## 🔒 Security

*   **Passwords**: Hashed using `bcryptjs`.
*   **Authentication**: Stateless JWT authentication.
*   **Data Validation**: Input validation on both client and server sides.
*   **CORS**: Configured to allow trusted origins.

## 📝 API Documentation

API documentation is available via Swagger UI at:
`http://localhost:5000/api-docs`

Key endpoints include:
*   **Auth**: `/api/users/signup`, `/api/users/signin`
*   **Products**: `/api/products` (GET, POST, PUT, DELETE)
*   **Producers**: `/api/producer/signup`, `/api/producer/signin`

---
**Author**: Frontend Developer Intern Candidate
