# 🐾 HappyTails — Backend

> Secure and scalable REST API powering the HappyTails pet adoption platform.

## 🌐 Live URL

[https://happytails-server-eight.vercel.app](https://happytails-server-eight.vercel.app)

---

## 📌 Purpose

This is the Express.js backend for HappyTails — a full-stack MERN pet adoption platform. It provides a secure RESTful API for managing pets, adoption requests, and user data. The server handles JWT-based authentication via HTTPOnly cookies, protects private routes with middleware, and communicates with a MongoDB Atlas database using environment-secured credentials.

---

## ✨ Features

- **RESTful API for Pets** — Full CRUD endpoints for pet listings: create, read, update, and delete pets, with MongoDB-powered search using `$regex` (name search) and `$in` (species filter) operators.
- **Adoption Request Management** — Endpoints to submit, retrieve, approve, reject, and cancel adoption requests. Business logic enforces that only one request per pet can be approved, and owners cannot request adoption of their own pets.
- **JWT Authentication Middleware** — Issues signed JWT tokens on login and stores them in HTTPOnly cookies. A reusable middleware function verifies tokens and protects all private API routes.
- **Adoption Status Control** — When an adoption request is approved, the pet is automatically marked as `adopted`, preventing further requests from being submitted for that listing.
- **Secure MongoDB Integration** — All database credentials are stored in environment variables via `dotenv`. The MongoDB connection is never exposed in source code.
- **CORS Configuration** — Properly configured CORS policy to allow secure cross-origin requests from the frontend deployment URL only, preventing unauthorized access.

---

## 📦 NPM Packages Used

| Package | Purpose |
|---|---|
| `express` | Web framework and routing |
| `mongodb` | Official MongoDB Node.js driver |
| `cors` | Cross-Origin Resource Sharing configuration |
| `dotenv` | Environment variable management |
| `jose-cjs` | JWT signing and verification (HTTPOnly cookie auth) |
| `nodemon` | Auto-restart during development |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/happytails-server.git
cd happytails-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your MongoDB URI and JWT secret

# Start the development server
npm run dev
```

Server runs on [http://localhost:5000](http://localhost:5000) by default.

---

## 🔐 Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=happytails
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=https://happytails-hub.vercel.app
PORT=5000
```

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 🗂️ API Endpoints

### Pets
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/pets` | Public | Get all pets (supports search & filter) |
| `GET` | `/api/pets/:id` | Public | Get single pet details |
| `POST` | `/api/pets` | Private | Add a new pet listing |
| `PUT` | `/api/pets/:id` | Private | Update a pet listing (owner only) |
| `DELETE` | `/api/pets/:id` | Private | Delete a pet listing (owner only) |

### Adoption Requests
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/requests` | Private | Submit an adoption request |
| `GET` | `/api/requests/my` | Private | Get current user's requests |
| `GET` | `/api/requests/pet/:petId` | Private | Get all requests for a listing (owner only) |
| `PATCH` | `/api/requests/:id/approve` | Private | Approve a request (owner only) |
| `PATCH` | `/api/requests/:id/reject` | Private | Reject a request (owner only) |
| `DELETE` | `/api/requests/:id` | Private | Cancel a request (requester only) |

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login and receive JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clear JWT cookie |

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB Atlas
- **Auth:** JWT via `jose-cjs` (HTTPOnly cookies)
- **Deployment:** Render

---

*© 2025 HappyTails. All rights reserved.*
