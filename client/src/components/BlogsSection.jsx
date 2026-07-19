import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import api from "../api/axios";

export default function BlogsSection() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api
      .get("/blogs")
      .then((res) => setBlogs(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section id="blogs" className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">Insights</p>
          <h2 className="font-display text-3xl sm:text-5xl">From Our Blog</h2>
        </div>
        <Link to="/blogs" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-navy/70 hover:text-gold transition">
          View All <ArrowRight size={15} />
        </Link>
      </div>
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
              {b.excerpt && <p className="text-sm text-navy/60 line-clamp-2">{b.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
      <Link to="/blogs" className="sm:hidden mt-8 flex items-center justify-center gap-1 text-sm font-semibold text-navy/70">
        View All Posts <ArrowRight size={15} />
      </Link>
    </section>
  );
}
