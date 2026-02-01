/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const products = await db.collection("products").find().toArray();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Keyboard
 *               price:
 *                 type: number
 *                 example: 1499
 *               quantity:
 *                 type: number
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Validation error
 */
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

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Product not found
 */
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
