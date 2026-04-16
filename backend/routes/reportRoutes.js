const express = require("express");
const PDFDocument = require("pdfkit");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET report data
router.get("/data", authMiddleware, async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = { userId: req.userId };
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const transactions = await Transaction.find(query);
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);

  const categoryBreakdown = {};
  expenses.forEach(e => {
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
  });

  res.json({
    transactions,
    summary: {
      totalExpenses,
      totalIncomes,
      net: totalIncomes - totalExpenses
    },
    categoryBreakdown
  });
});

// GET PDF report
router.get("/pdf", authMiddleware, async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = { userId: req.userId };
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const transactions = await Transaction.find(query).sort({ date: -1 });

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
  doc.pipe(res);

  doc.fontSize(20).text('Expense Tracker Report', { align: 'center' });
  doc.moveDown();

  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);

  doc.fontSize(14).text(`Total Income: ₹${totalIncomes}`);
  doc.text(`Total Expenses: ₹${totalExpenses}`);
  doc.text(`Net: ₹${totalIncomes - totalExpenses}`);
  doc.moveDown();

  doc.text('Transactions:');
  transactions.forEach(t => {
    doc.text(`${t.date.toDateString()} - ${t.type.toUpperCase()} - ${t.title} - ₹${t.amount} (${t.category})`);
  });

  doc.end();
});

module.exports = router;