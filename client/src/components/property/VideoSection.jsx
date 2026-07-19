function toEmbedUrl(url) {
  if (!url) return "";
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  if (url.includes("/embed/")) return url;
  return url;
}

export default function VideoSection({ videoUrl, title }) {
  if (!videoUrl) return null;
  const embedUrl = toEmbedUrl(videoUrl);
  return (
    <div className="rounded-2xl overflow-hidden aspect-video border border-navy/10">
      <iframe
        src={embedUrl}
        title={`${title} video tour`}
        className="w-full h-full"
        style={{ border: 0 }}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
