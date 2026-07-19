import { useEffect, useState } from "react";
import { Building2, Users2, MessageSquareText, Tags } from "lucide-react";
import api from "../../api/axios";

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white border border-navy/10 rounded-2xl p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-display">{value}</p>
        <p className="text-xs text-navy/50">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const [stats, setStats] = useState({ properties: 0, team: 0, inquiries: 0, categories: 0 });
  const [loading, setLoading] = useState(true);
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/properties/all"),
      api.get("/team/all"),
      api.get("/inquiries"),
      api.get("/categories"),
    ])
      .then(([properties, team, inquiries, categories]) => {
        setStats({
          properties: properties.data.length,
          team: team.data.length,
          inquiries: inquiries.data.length,
          categories: categories.data.length,
        });
        setRecentInquiries(inquiries.data.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-navy/50 text-sm">Loading dashboard...</p>;

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={Building2} label="Total Properties" value={stats.properties} accent="bg-navy" />
        <StatCard icon={Tags} label="Property Categories" value={stats.categories} accent="bg-gold" />
        <StatCard icon={Users2} label="Team Members" value={stats.team} accent="bg-emerald-500" />
        <StatCard icon={MessageSquareText} label="Total Inquiries" value={stats.inquiries} accent="bg-amber-500" />
      </div>

      <div className="bg-white border border-navy/10 rounded-2xl p-6">
        <h3 className="font-display text-lg mb-4">Recent Inquiries</h3>
        {recentInquiries.length === 0 ? (
          <p className="text-sm text-navy/50">No inquiries yet.</p>
        ) : (
          <div className="space-y-3">
            {recentInquiries.map((inq) => (
              <div key={inq._id} className="flex items-center justify-between border-b border-navy/5 last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="text-sm font-semibold">{inq.name}</p>
                  <p className="text-xs text-navy/50">{inq.phone} &middot; {inq.interest || "General enquiry"}</p>
                </div>
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-navy/5 text-navy/60">{inq.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
