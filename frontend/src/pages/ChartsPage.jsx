import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import API from "../api";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartsPage() {
  const [categoryData, setCategoryData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const [categoryRes, monthlyRes] = await Promise.all([
        API.get("/summary/category"),
        API.get("/summary/monthly"),
      ]);

      setCategoryData(categoryRes.data);
      setMonthlyData(monthlyRes.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch chart data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading charts...</div>
      </div>
    );
  }

  // Category Pie Chart
  const categoryChartData = {
    labels: categoryData?.map((item) => item._id) || [],
    datasets: [
      {
        label: "Spending by Category",
        data: categoryData?.map((item) => item.total) || [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Monthly Income vs Expense
  const monthlyChartData = {
    labels:
      monthlyData?.map(
        (item) =>
          `${item._id.month}/${item._id.year}`
      ) || [],
    datasets: [
      {
        label: "Income",
        data: monthlyData?.map((item) => item.income) || [],
        backgroundColor: "#10b981",
      },
      {
        label: "Expense",
        data: monthlyData?.map((item) => item.expense) || [],
        backgroundColor: "#ef4444",
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
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Analytics & Charts</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 h-96">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Spending by Category
          </h2>
          {categoryData && categoryData.length > 0 ? (
            <Pie data={categoryChartData} options={chartOptions} />
          ) : (
            <div className="text-center text-gray-600 py-8">
              No data available
            </div>
          )}
        </div>

        {/* Monthly Income vs Expense */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2 h-96">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Monthly Income vs Expense (Last 6 Months)
          </h2>
          {monthlyData && monthlyData.length > 0 ? (
            <Bar data={monthlyChartData} options={chartOptions} />
          ) : (
            <div className="text-center text-gray-600 py-8">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
