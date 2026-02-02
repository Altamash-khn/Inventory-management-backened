# Inventory Management Tracker

Inventory Management Tracker is a backend application built to manage products, categories, and stock levels in an organized and efficient way. It provides authentication, inventory tracking, and dashboard insights for better stock control.

## Features

- User authentication (Signup & Login)
- Password hashing using bcrypt
- Secure APIs using JWT
- Product and category management
- Stock tracking (low stock / out of stock)
- Inventory summary dashboard
- API documentation using Swagger

## Tech Stack & Dependencies

- Node.js
- Express.js
- MongoDB Native Driver (database connection & queries)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors (cross-origin request handling)
- swagger (API documentation)

## Authentication Flow

- **Signup and Login routes do NOT require a token**
- After successful **signup or login**, a **JWT token** is generated
- The client must:
  - Save the token
  - Send it in the **Authorization header** for all other protected routes

### Authorization Header Format

Authorization: Bearer <your_token_here>

**Note**: All routes except authentication are protected and require a valid token.

## API Documentation

All API endpoints are documented using Swagger.

Open Swagger API Docs at:  
**[/api-docs](https://inventory-management-backened.onrender.com/api-docs/)**

## Setup & Run

1. Clone the repository
2. Install dependencies
   npm install
3. Start the server
   npm run dev
   **Note**: Make sure you change the **MongoClicent.connect(string)** to your own mongodb database.  
   The application will not work if the MongoDB connection string is not updated.

## Notes

- Always login or signup first to get a token
- Use the same token for all protected API requests
- Refer to Swagger documentation for request and response formats
