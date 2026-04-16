const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ADD transaction
router.post("/", authMiddleware, async (req, res) => {
  const { title, amount, type, category, date } = req.body;

  const transaction = new Transaction({
    title,
    amount,
    type,
    category,
    date: date || new Date(),
    userId: req.userId
  });

  await transaction.save();
  res.status(201).json(transaction);
});

// GET all transactions
router.get("/", authMiddleware, async (req, res) => {
  const transactions = await Transaction.find({ userId: req.userId });
  res.json(transactions);
});

// UPDATE a transaction
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, amount, type, category, date } = req.body;
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // update fields if provided
    if (title !== undefined) transaction.title = title;
    if (amount !== undefined) transaction.amount = amount;
    if (type !== undefined) transaction.type = type;
    if (category !== undefined) transaction.category = category;
    if (date !== undefined) transaction.date = date;

    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ message: "Unable to update transaction" });
  }
});

// DELETE a transaction
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Transaction.deleteOne({ _id: transaction._id });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("delete error", err);
    res.status(400).json({ message: "Unable to delete transaction" });
  }
});

module.exports = router;