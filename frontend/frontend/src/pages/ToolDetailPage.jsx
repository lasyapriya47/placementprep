import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToolById, favoriteTool, rateTool } from '../api/aiToolsApi';

export default function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getToolById(id)
      .then(setTool)
      .catch(() => setError('Tool not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const onFavorite = () => {
    if (!tool) return;
    favoriteTool(tool.id)
      .then(setTool)
      .then(() => setStatusMessage('Added to favorites!'))
      .catch(() => setStatusMessage('Failed to add favorite.'));
  };

  const onRate = () => {
    if (!tool) return;
    rateTool(tool.id, Number(rating))
      .then(setTool)
      .then(() => setStatusMessage(`Rated ${rating} stars`))
      .catch(() => setStatusMessage('Rating failed.'));
  };

  if (loading) return <p>Loading tool details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!tool) return null;

  return (
    <div className="card-glass rounded-xl p-6 border border-slate-700">
      <button onClick={() => navigate(-1)} className="text-cyan-300 hover:text-white text-sm mb-4 inline-block">&larr; Back</button>
      <h2 className="text-3xl font-bold mb-2 text-white">{tool.name}</h2>
      <p className="text-sm text-cyan-200 mb-1">{tool.category}</p>
      <p className="text-slate-200 mb-2">{tool.description}</p>
      <div className="flex gap-3 items-center mb-4">
        <span className="text-xs text-slate-200">⭐ {tool.averageRating?.toFixed(1) || '0.0'} ({tool.ratingCount || 0})</span>
        <span className="text-xs text-cyan-200">❤️ {tool.favoriteCount || 0} favorites</span>
        <button onClick={onFavorite} className="px-3 py-1 bg-[#2563eb] text-white rounded-lg text-xs hover:bg-[#1e40af]">Favorite</button>
      </div>
      <div className="flex gap-2 items-center mb-4">
        <label className="text-slate-200 text-sm">Rate tool:</label>
        <select value={rating} onChange={e => setRating(e.target.value)} className="bg-[#1f2937] text-slate-200 px-2 py-1 rounded">
          {[5,4,3,2,1].map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <button onClick={onRate} className="px-3 py-1 bg-[#059669] text-white rounded-lg text-xs hover:bg-[#047857]">Submit</button>
      </div>
      {statusMessage && <p className="text-cyan-200 mb-3">{statusMessage}</p>}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Use Cases</h3>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            {tool.useCases.map((uc, idx) => <li key={idx}>{uc}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Learning Links</h3>
          <ul className="list-disc ml-5 text-sm text-cyan-200">
            {tool.learningLinks.map((link, idx) => (
              <li key={idx}><a href={link} target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-white hover:underline">{link}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {tool.tags.map(tag => <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{tag}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
