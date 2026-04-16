import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import AddTransactionPage from "./pages/AddTransactionPage";
import ChartsPage from "./pages/ChartsPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleTransactionAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar onLogout={handleLogout} />
        <Routes>
          <Route path="/dashboard" element={<DashboardPage key={refreshKey} />} />
          <Route path="/transactions" element={<TransactionsPage key={refreshKey} />} />
          <Route path="/add-transaction" element={<AddTransactionPage onSuccess={handleTransactionAdded} />} />
          <Route path="/charts" element={<ChartsPage key={refreshKey} />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
