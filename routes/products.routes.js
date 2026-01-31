const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* ================= GET ALL PRODUCTS ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const products = await db.collection("products").find().toArray();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/* ================= GET SINGLE PRODUCT ================= */
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  // ❌ Invalid MongoDB ID
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const db = getDb();
  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

/* ================= ADD PRODUCT ================= */
router.post("/", authMiddleware, async (req, res) => {
  const { name, price, quantity, category } = req.body;

  // 🔍 Validation
  if (!name || price == null || quantity == null) {
    return res.status(400).json({
      message: "Name, price and quantity are required",
    });
  }

  if (price < 0 || quantity < 0) {
    return res.status(400).json({
      message: "Price or quantity cannot be negative",
    });
  }

  const db = getDb();

  const result = await db.collection("products").insertOne({
    name,
    price,
    quantity,
    category: category || "General",
    createdAt: new Date(),
  });

  res.status(201).json({
    message: "Product added successfully",
    productId: result.insertedId,
  });
});

/* ================= UPDATE PRODUCT ================= */
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, category } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  if (!name && price == null && quantity == null && !category) {
    return res.status(400).json({
      message: "At least one field required to update",
    });
  }

  if (price < 0 || quantity < 0) {
    return res.status(400).json({
      message: "Price or quantity cannot be negative",
    });
  }

  const db = getDb();

  const result = await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...(name && { name }),
        ...(price != null && { price }),
        ...(quantity != null && { quantity }),
        ...(category && { category }),
      },
    },
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product updated successfully" });
});

/* ================= DELETE PRODUCT ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const db = getDb();
  const result = await db
    .collection("products")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted successfully" });
});

module.exports = router;
