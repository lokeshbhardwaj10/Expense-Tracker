const express = require("express");
const Transaction = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST - Create a new expense or income entry
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    // Validation
    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const transaction = new Transaction({
      userId: req.userId,
      title,
      amount,
      type,
      category,
      date: date || new Date(),
      notes,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
});

// GET - Get all entries for logged-in user with filtering
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const filter = { userId: req.userId };

    if (type && ["income", "expense"].includes(type)) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 }).populate("userId", "name email");

    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

// GET - Get a single entry by ID
router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate("userId", "name email");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId._id.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(transaction);
  } catch (err) {
    next(err);
  }
});

// PUT - Update an entry
router.put("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields if provided
    if (title !== undefined) transaction.title = title;
    if (amount !== undefined) transaction.amount = amount;
    if (type !== undefined && ["income", "expense"].includes(type)) transaction.type = type;
    if (category !== undefined) transaction.category = category;
    if (date !== undefined) transaction.date = date;
    if (notes !== undefined) transaction.notes = notes;

    await transaction.save();
    res.json(transaction);
  } catch (err) {
    next(err);
  }
});

// DELETE - Delete an entry
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Transaction.deleteOne({ _id: transaction._id });
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;