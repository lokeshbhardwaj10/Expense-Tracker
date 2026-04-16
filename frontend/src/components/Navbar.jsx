import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold">
              💰 Expense Tracker
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Transactions
            </Link>
            <Link
              to="/add-transaction"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Add Transaction
            </Link>
            <Link
              to="/charts"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Analytics
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">
              Welcome, <strong>{user.name || "User"}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none transition"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Transactions
            </Link>
            <Link
              to="/add-transaction"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Add Transaction
            </Link>
            <Link
              to="/charts"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Analytics
            </Link>
            <hr className="my-2 border-blue-500" />
            <div className="px-3 py-2 text-sm">
              Welcome, <strong>{user.name || "User"}</strong>
            </div>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
