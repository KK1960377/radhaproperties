import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import api from "../api/axios";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blogs").then((res) => setBlogs(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <header className="px-5 sm:px-8 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy/70 hover:text-gold transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </header>
      <main className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">Insights</p>
        <h1 className="font-display text-3xl sm:text-5xl mb-12">Our Blog</h1>

        {loading ? (
          <p className="text-navy/50 text-sm">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-navy/50 text-sm">No blog posts published yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {blogs.map((b) => (
              <Link key={b._id} to={`/blogs/${b.slug || b._id}`} className="card-hover rounded-3xl overflow-hidden bg-white border border-navy/5 block">
                {b.coverImage && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={b.coverImage} alt={b.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-[11px] text-navy/40 flex items-center gap-1 mb-2">
                    <Calendar size={11} /> {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <h3 className="font-display text-lg leading-snug mb-2 line-clamp-2">{b.title}</h3>
                  {b.excerpt && <p className="text-sm text-navy/60 line-clamp-3">{b.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
