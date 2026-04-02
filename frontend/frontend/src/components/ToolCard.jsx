import { Link } from 'react-router-dom';

export default function ToolCard({ tool }) {
  return (
    <div className="card-glass rounded-xl p-4 border border-slate-700 shadow-xl hover:shadow-2xl transition duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{tool.name}</h3>
          <p className="text-xs text-[#8b5cf6] font-semibold mt-1">{tool.category}</p>
        </div>
        <span className="text-xs bg-[#1e3a8a] text-cyan-200 px-2 py-1 rounded-full">Pop {tool.popularity}</span>
      </div>
      <div className="mt-2 text-xs text-cyan-100">⭐ {tool.averageRating || 0} ({tool.ratingCount || 0}) • ❤️ {tool.favoriteCount || 0}</div>
      <p className="mt-2 text-sm text-slate-300 line-clamp-3">{tool.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tool.tags?.map(tag => (
          <span key={tag} className="text-xs bg-[#1c2857] text-slate-300 px-2 py-1 rounded-full border border-slate-600">{tag}</span>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {tool.website && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400">Official Website</h4>
            <a
              href={tool.website}
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-[#10b981] text-cyan-100 px-2 py-1 rounded-lg hover:bg-[#059669]"
            >
              Open Official Site
            </a>
          </div>
        )}
        {tool.learningLinks?.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400">Resources</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {tool.learningLinks.map((link, idx) => (
                <a
                  key={`${tool.id}-link-${idx}`}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs bg-[#134e90] text-cyan-100 px-2 py-1 rounded-lg hover:bg-[#1a62b0]"
                >
                  Open Link {idx+1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/tools/${tool.id}`}
        className="mt-4 inline-block text-[#a78bfa] hover:text-white text-sm font-semibold"
      >
        View details
      </Link>
    </div>
  );
}
