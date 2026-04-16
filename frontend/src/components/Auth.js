import { useState } from "react";
import API from "../api";

function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        isLogin ? "/auth/login" : "/auth/signup",
        { email, password }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        onLogin();
      } else {
        setError("No token received");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server not reachable"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? "Login" : "Signup"}</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded mb-4">
          {isLogin ? "Login" : "Signup"}
        </button>

        <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-blue-500">
          Switch to {isLogin ? "Signup" : "Login"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
}

export default Auth;