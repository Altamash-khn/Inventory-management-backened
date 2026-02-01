/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

const express = require("express");
const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = getDb();

    const categories = await db.collection("categories").find().toArray();

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error or category already exists
 */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const db = getDb();
    const categories = db.collection("categories");

    // prevent duplicate category
    const existing = await categories.findOne({
      name: name.trim(),
    });

    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const result = await categories.insertOne({
      name: name.trim(),
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Category created successfully",
      categoryId: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create category" });
  }
});

/**
 * @swagger
 * /categories/category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid category ID
 *       404:
 *         description: Category not found
 */

router.delete("/category/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const db = getDb();
    const result = await db
      .collection("categories")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category" });
  }
});

module.exports = router;
