import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/admin/Sidebar";
import DashboardHome from "./admin/DashboardHome";
import PropertiesManager from "./admin/PropertiesManager";
import CategoriesManager from "./admin/CategoriesManager";
import TeamManager from "./admin/TeamManager";
import CompanySettings from "./admin/CompanySettings";
import OwnerProfileManager from "./admin/OwnerProfileManager";
import HomeContentManager from "./admin/HomeContentManager";
import BlogsManager from "./admin/BlogsManager";
import FAQsManager from "./admin/FAQsManager";
import TestimonialsManager from "./admin/TestimonialsManager";
import InquiriesManager from "./admin/InquiriesManager";
import UsersManager from "./admin/UsersManager";

const PANELS = {
  dashboard: DashboardHome,
  properties: PropertiesManager,
  categories: CategoriesManager,
  team: TeamManager,
  company: CompanySettings,
  owner: OwnerProfileManager,
  "home-content": HomeContentManager,
  blogs: BlogsManager,
  faqs: FAQsManager,
  testimonials: TestimonialsManager,
  inquiries: InquiriesManager,
  users: UsersManager,
};

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyName, setCompanyName] = useState("Radha Homes Properties");

  useEffect(() => {
    api.get("/settings").then((res) => setCompanyName(res.data?.companyName || "Radha Homes Properties")).catch(() => {});
  }, []);

  const ActivePanel = PANELS[tab] || DashboardHome;

  return (
    <div className="min-h-screen bg-paper flex">
      <Sidebar
        active={tab}
        onSelect={setTab}
        onLogout={logout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        companyName={companyName}
      />

      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-navy/10 px-5 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-navy" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <p className="font-display text-lg">{companyName} — Admin</p>
              <p className="text-xs text-navy/50">{admin?.email}</p>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
          <ActivePanel />
        </main>
      </div>
    </div>
  );
}
