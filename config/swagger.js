const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Management API",
      version: "1.0.0",
      description: "API documentation for Inventory Management system",
    },
    servers: [
      {
        url: "https://inventory-management-backened.onrender.com",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Dashboard", description: "Dashboard and analytics APIs" },
      { name: "Categories", description: "Category management APIs" },
      { name: "Stock", description: "Stock and inventory APIs" },
      { name: "Products", description: "Product management APIs" },
    ],
  },

  // ✅ ABSOLUTE PATH (THIS IS THE KEY)
  apis: [path.join(__dirname, "../routes/*.js")],
};

module.exports = swaggerJSDoc(options);
