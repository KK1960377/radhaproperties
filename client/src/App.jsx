import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./api/axios";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TeamMemberDetail from "./pages/TeamMemberDetail";
import PropertyDetail from "./pages/PropertyDetail";
import OwnerPage from "./pages/OwnerPage";
import CompanyPage from "./pages/CompanyPage";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";

export default function App() {
  // Apply the admin-managed favicon site-wide, if one has been set.
  useEffect(() => {
    api
      .get("/settings")
      .then((res) => {
        const favicon = res.data?.favicon;
        if (!favicon) return;
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = favicon;
      })
      .catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/team/:id" element={<TeamMemberDetail />} />
        <Route path="/owner" element={<OwnerPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
