# API Documentation & Scalability Notes

## Authentication
All authenticated endpoints require a Bearer Token in the Authorization header: `Authorization: Bearer <token>`

### Users
- `POST /api/users/signup`: Register a new user. Body: `{ username, email, password }`
- `POST /api/users/signin`: Login. Body: `{ email, password }`
- `GET /api/users/me`: Get current user profile.
- `PUT /api/users/me`: Update profile.
- `POST /api/users/change-password`: Change password.

### Producers
- `POST /api/producers/signup`: Register.
- `POST /api/producers/signin`: Login.
- `GET /api/producers/profile`: Get profile.
- `PUT /api/producers/profile`: Update profile.
- `GET /api/producers/products`: Get my products.
- `POST /api/producers/kyc/upload`: Upload KYC docs.

## Products
- `GET /api/products`: List products (supports filtering by category, search `q`, pagination `limit`/`offset`, geolocation `lat`/`lon`).
- `GET /api/products/:id`: Get product details.
- `POST /api/products`: Create product (Producer only).
- `PUT /api/products/:id`: Update product (Producer only).
- `DELETE /api/products/:id`: Delete product (Producer only).

## Scalability Strategy
To scale this application for production:

1.  **Database**:
    - Use a managed database service (e.g., AWS RDS, Google Cloud SQL) for PostgreSQL.
    - Implement read replicas for heavy read operations (e.g., product listings).
    - Use database migrations (Sequelize CLI) for schema changes.

2.  **Caching**:
    - Implement Redis for caching frequently accessed data (e.g., product categories, popular products).
    - Use CDN (Cloudflare/AWS CloudFront) for static assets and uploaded images.

3.  **Search**:
    - The project already integrates Meilisearch free cloud for fast, typo-tolerant search. Ensure Meilisearch is hosted on a separate instance or managed service.

4.  **Microservices**:
    - As the application grows, separate the `User` and `Producer` logic into distinct services.
    - Move `Notification` (Push) and `Analytics` to separate worker services processing events from a message queue (RabbitMQ/Kafka).

5.  **Load Balancing**:
    - Deploy the backend behind a Load Balancer (Nginx/AWS ALB) and run multiple instances of the Node.js application (using PM2 or Docker/Kubernetes).

6.  **Frontend**:
    - Next.js is already optimized for production. Deploy on Vercel or a containerized environment for edge caching and ISR (Incremental Static Regeneration).
