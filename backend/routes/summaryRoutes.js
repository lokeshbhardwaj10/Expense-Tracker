const express = require("express");
const mongoose = require("mongoose");
const Transaction = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET summary by category
router.get("/category", authMiddleware, async (req, res, next) => {
  try {
    const categorySummary = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          type: { $first: "$type" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(categorySummary);
  } catch (err) {
    next(err);
  }
});

// GET summary by month (last 6 months)
router.get("/monthly", authMiddleware, async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySummary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(monthlySummary);
  } catch (err) {
    next(err);
  }
});

// GET daily spending trend for current month
router.get("/daily", authMiddleware, async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dailySummary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: startOfMonth, $lte: endOfMonth },
          type: "expense",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    res.json(dailySummary);
  } catch (err) {
    next(err);
  }
});

// GET dashboard summary (total balance, income, expense)
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const summary = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
          transactionCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          balance: { $subtract: ["$totalIncome", "$totalExpense"] },
          transactionCount: 1,
        },
      },
    ]);

    const result = summary.length > 0 ? summary[0] : { totalIncome: 0, totalExpense: 0, balance: 0, transactionCount: 0 };

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
