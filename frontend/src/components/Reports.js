import { useEffect, useState } from "react";
import API from "../api";

function Reports({ onBack, onLogout }) {
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await API.get("/transactions", { params });
      const transactions = res.data;
      const expenses = transactions.filter(t => t.type === 'expense');
      const incomes = transactions.filter(t => t.type === 'income');

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);

      const categoryBreakdown = {};
      expenses.forEach(e => {
        categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
      });

      setReportData({
        transactions,
        summary: {
          totalExpenses,
          totalIncomes,
          net: totalIncomes - totalExpenses
        },
        categoryBreakdown
      });
    } catch (err) {
      if (err.response?.status === 401) onLogout();
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  if (!reportData) return <div className="max-w-4xl mx-auto p-4"><div>Loading...</div></div>;

  const { summary, categoryBreakdown } = reportData;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Financial Reports</h1>

      <div className="mb-6">
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Back to Transactions</button>
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <div className="mb-6">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded mr-2" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded mr-2" />
        <button onClick={fetchReport} className="bg-blue-500 text-white px-4 py-2 rounded">Generate Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-bold">Total Income</h2>
          <p className="text-2xl">₹{summary.totalIncomes}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-xl font-bold">Total Expenses</h2>
          <p className="text-2xl">₹{summary.totalExpenses}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-xl font-bold">Net Balance</h2>
          <p className="text-2xl">₹{summary.net}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
        <ul>
          {Object.entries(categoryBreakdown).map(([category, amount]) => (
            <li key={category} className="flex justify-between py-2 border-b">
              <span>{category}</span>
              <span>₹{amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Reports;