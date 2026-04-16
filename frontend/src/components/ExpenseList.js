function ExpenseList({ expenses, onDelete, onEdit }) {
  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense._id}>
          {expense.title} - ₹{expense.amount}

          {/* send full object so parent can populate form */}
          <button onClick={() => onEdit(expense)}>
            Edit
          </button>

          <button onClick={() => onDelete(expense._id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
