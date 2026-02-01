/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: Stock and inventory tracking APIs
 */

const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /stock/low:
 *   get:
 *     summary: Get low stock products
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of low stock products
 *       401:
 *         description: Unauthorized
 */

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

/**
 * @swagger
 * /stock/out:
 *   get:
 *     summary: Get out of stock products
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of out of stock products
 *       401:
 *         description: Unauthorized
 */

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

/**
 * @swagger
 * /stock/update:
 *   patch:
 *     summary: Update product stock quantity
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64f1a9c8b4d2c6a123456789
 *               quantity:
 *                 type: number
 *                 example: 25
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 */

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
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const db = getDb();

    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(productId) }, { $set: { quantity } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update stock" });
  }
});

module.exports = router;
