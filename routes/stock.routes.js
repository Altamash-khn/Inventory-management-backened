const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* ================== LOW STOCK ================== */
/* GET /stock/low */
router.get("/low", authMiddleware, async (req, res) => {
  try {
    const db = getDb();

    const products = await db
      .collection("products")
      .find({ quantity: { $gt: 0, $lte: 5 } })
      .toArray();

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch low stock items" });
  }
});

/* ================== OUT OF STOCK ================== */
/* GET /stock/out */
router.get("/out", authMiddleware, async (req, res) => {
  try {
    const db = getDb();

    const products = await db
      .collection("products")
      .find({ quantity: 0 })
      .toArray();

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch out of stock items" });
  }
});

/* ================== UPDATE STOCK ================== */
/* PATCH /stock/update */
router.patch("/update", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validation
    if (!productId || quantity == null) {
      return res
        .status(400)
        .json({ message: "productId and quantity are required" });
    }

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (quantity < 0) {
      return res
        .status(400)
        .json({ message: "Quantity cannot be negative" });
    }

    const db = getDb();

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $set: { quantity } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update stock" });
  }
});

module.exports = router;
