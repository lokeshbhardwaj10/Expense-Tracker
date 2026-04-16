import { useEffect, useState } from "react";
import API from "../api";

function TransactionForm({ onLogout, onShowReports }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const categories = ["Food", "Transport", "Entertainment", "Bills", "Salary", "Freelance", "Other"];

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      } else {
        setError(err.response?.data?.message || "Failed to fetch transactions");
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (e) => {
    e.preventDefault();

    try {
      const numericAmount = Number(amount);
      if (!title || isNaN(numericAmount)) {
        setError("Please provide a valid title and amount");
        return;
      }

      const data = {
        title,
        amount: numericAmount,
        type,
        category,
        date
      };

      if (editingTransaction) {
        await API.put(`/transactions/${editingTransaction._id}`, data);
      } else {
        await API.post("/transactions", data);
      }

      setTitle("");
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split('T')[0]);
      setEditingTransaction(null);
      setError("");
      fetchTransactions();
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      } else {
        setError(err.response?.data?.message || (editingTransaction ? "Failed to update transaction" : "Failed to add transaction"));
      }
    }
  };

  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalIncomes = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

  const handleEdit = (transaction) => {
    setTitle(transaction.title);
    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category);
    setDate(new Date(transaction.date).toISOString().split('T')[0]);
    setEditingTransaction(transaction);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      else setError(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Expense & Income Tracker</h1>

      <div className="mb-4">
        <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Logout</button>
        <button onClick={onShowReports} className="bg-purple-500 text-white px-4 py-2 rounded">View Reports</button>
      </div>

      <form onSubmit={addTransaction} className="bg-white p-6 rounded shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded" required>
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          {editingTransaction ? "Update" : "Add"} Transaction
        </button>
        {editingTransaction && (
          <button
            type="button"
            onClick={() => {
              setEditingTransaction(null);
              setTitle("");
              setAmount("");
              setCategory("");
              setDate(new Date().toISOString().split('T')[0]);
              setError("");
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-bold">Total Income</h2>
          <p className="text-2xl">₹{totalIncomes}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-xl font-bold">Total Expenses</h2>
          <p className="text-2xl">₹{totalExpenses}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-xl font-bold">Net Balance</h2>
          <p className="text-2xl">₹{totalIncomes - totalExpenses}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Transactions</h2>
        {transactions.length === 0 && <p>No transactions found</p>}
        <ul>
          {transactions.map((t) => (
            <li key={t._id} className="flex justify-between items-center border-b py-2">
              <div>
                <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type.toUpperCase()}
                </span> - {t.title} - ₹{t.amount} ({t.category}) - {new Date(t.date).toLocaleDateString()}
              </div>
              <div>
                <button onClick={() => handleEdit(t)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(t._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TransactionForm;