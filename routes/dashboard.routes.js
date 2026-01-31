const express = require("express");
const { getDb } = require("../data/database");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/* ================== DASHBOARD SUMMARY ================== */
/* GET /dashboard/summary */
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
