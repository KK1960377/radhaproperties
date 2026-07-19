import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, UserRound, Tag } from "lucide-react";
import api from "../api/axios";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api
      .get(`/blogs/${slug}`)
      .then((res) => setBlog(res.data))
      .catch(() => setError("This blog post could not be found."))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-paper">
      <header className="px-5 sm:px-8 py-6">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-navy/70 hover:text-gold transition">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        {loading ? (
          <p className="text-navy/50 text-sm">Loading...</p>
        ) : error || !blog ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <article>
            {blog.coverImage && (
              <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-8">
                <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="font-display text-3xl sm:text-4xl mb-4 leading-tight">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-navy/50 mb-8">
              <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              {blog.author && <span className="flex items-center gap-1"><UserRound size={12} /> {blog.author}</span>}
            </div>
            <div className="text-navy/80 leading-relaxed whitespace-pre-line text-base">{blog.content}</div>
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-navy/10">
                {blog.tags.map((t) => (
                  <span key={t} className="text-xs bg-navy/5 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Tag size={11} /> {t}
                  </span>
                ))}
              </div>
            )}
          </article>
        )}
      </main>
    </div>
  );
}
