import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("Radha Homes Properties");

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setCompanyName(res.data?.companyName || "Radha Homes Properties"))
      .catch(() => {});
  }, []);

  if (isAuthenticated) navigate("/admin/dashboard");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login fail ho gaya, dobara try karein.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-5">
      <div className="bg-paper w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-2xl">
        <p className="text-gold uppercase tracking-[0.3em] text-xs mb-2 text-center">{companyName}</p>
        <h1 className="font-display text-2xl text-center mb-8">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm w-full"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm w-full"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-navy text-paper py-3.5 rounded-xl font-semibold text-sm hover:shadow-gold transition-all disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <a href="/" className="block text-center text-xs text-navy/50 mt-6 hover:text-gold">
          &larr; Back to site
        </a>
      </div>
    </div>
  );
}
