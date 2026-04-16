import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import API from "../api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dailyData, setDailyData] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const [summaryRes, dailyRes] = await Promise.all([
        API.get("/summary/"),
        API.get("/summary/daily"),
      ]);
      setSummary(summaryRes.data);
      setDailyData(dailyRes.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch summary");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "User";

  const dailyChartData = {
    labels: dailyData?.map((item) => item._id.day) || [],
    datasets: [
      {
        label: "Daily Spending",
        data: dailyData?.map((item) => item.total) || [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.4,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-bold text-gray-800 mb-3">Dashboard</h1>
      <p className="text-2xl text-gray-700 mb-10">Welcome back, <span className="font-semibold text-gray-900">{userName}</span>.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Income Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-semibold uppercase">
            Total Income
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ₹{summary.totalIncome.toFixed(2)}
          </p>
        </div>

        {/* Total Expense Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-semibold uppercase">
            Total Expense
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ₹{summary.totalExpense.toFixed(2)}
          </p>
        </div>

        {/* Balance Card */}
        <div className={`rounded-lg shadow-md p-6 border-l-4 ${summary.balance >= 0 ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
          <p className="text-gray-600 text-sm font-semibold uppercase">
            Balance
          </p>
          <p className={`text-3xl font-bold mt-2 ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{summary.balance.toFixed(2)}
          </p>
        </div>

        {/* Transaction Count Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-semibold uppercase">
            Total Transactions
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {summary.transactionCount}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6 h-96">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Daily Spending Trend (Current Month)
        </h2>
        {dailyData && dailyData.length > 0 ? (
          <Line data={dailyChartData} options={chartOptions} />
        ) : (
          <div className="text-center text-gray-600 py-8">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
