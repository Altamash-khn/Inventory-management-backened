require("dotenv").config();
const cors = require("cors");

const express = require("express");
const { connectToDatabase } = require("./data/database");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const stockRoutes = require("./routes/stock.routes");
const categoryRoutes = require("./routes/categories.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

app.use(cors());

app.use(express.json());
app.use(authRoutes);
app.use("/products", productRoutes);
app.use("/stock", stockRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/categories", categoryRoutes);

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, {
    swaggerOptions: {
      tagsSorter: "none",
      operationsShorter: "method",
    },
  }),
);

connectToDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error) => {
    console.log("error", error);
  });
