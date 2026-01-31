const express = require("express");
const { connectToDatabase } = require("./data/database");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");

const app = express();

app.use(express.json());
app.use(authRoutes);
app.use("/products", productRoutes);

connectToDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error) => {
    console.log("error", error);
  });
