/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard and analytics APIs
 */

const express = require("express");
const { getDb } = require("../data/database");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Get inventory dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: number
 *                   example: 120
 *                 totalQuantity:
 *                   type: number
 *                   example: 540
 *                 lowStock:
 *                   type: number
 *                   example: 8
 *                 outOfStock:
 *                   type: number
 *                   example: 3
 *       401:
 *         description: Unauthorized
 */

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const productsCollection = db.collection("products");

    const totalProducts = await productsCollection.countDocuments();

    const outOfStock = await productsCollection.countDocuments({
      quantity: 0,
    });

    const lowStock = await productsCollection.countDocuments({
      quantity: { $gt: 0, $lte: 5 },
    });

    const totalQuantityAgg = await productsCollection
      .aggregate([
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$quantity" },
          },
        },
      ])
      .toArray();

    const totalQuantity =
      totalQuantityAgg.length > 0 ? totalQuantityAgg[0].totalQuantity : 0;

    res.json({
      totalProducts,
      totalQuantity,
      lowStock,
      outOfStock,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard summary" });
  }
});

module.exports = router;
