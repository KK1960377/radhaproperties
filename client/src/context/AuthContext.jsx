import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("rp_admin_info");
    return saved ? JSON.parse(saved) : null;
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("rp_admin_token", data.token);
    localStorage.setItem("rp_admin_info", JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }

  function logout() {
    localStorage.removeItem("rp_admin_token");
    localStorage.removeItem("rp_admin_info");
    setAdmin(null);
  }

  const isAuthenticated = !!localStorage.getItem("rp_admin_token");

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
