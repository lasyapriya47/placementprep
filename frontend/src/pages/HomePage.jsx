import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getFeatured } from '../api/aiToolsApi';
import SearchBar from '../components/SearchBar';
import ToolCard from '../components/ToolCard';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([getCategories(), getFeatured()])
      .then(([cats, tools]) => {
        setCategories(cats);
        setFeatured(tools);
      })
      .catch(err => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  const onSearch = q => {
    if (q) {
      navigate(`/recommendation?q=${encodeURIComponent(q)}`);
      return;
    }
    navigate('/tools');
  };

  return (
    <div className="space-y-6">
      <div className="card-glass rounded-xl p-6 border border-slate-700">
        <h1 className="text-3xl font-bold text-white">Find your perfect AI tool</h1>
        <p className="text-slate-300 mt-2">Search 500+ AI tools with smart recommendations.</p>
        <div className="mt-4"><SearchBar onSearch={onSearch} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-glass p-5 rounded-xl border border-slate-700">
          <h2 className="font-semibold text-lg mb-3 text-white">Categories</h2>
          {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => navigate(`/tools?category=${encodeURIComponent(cat)}`)}
                  className="px-3 py-1.5 bg-[#2a3a60] text-cyan-200 rounded-full text-xs hover:bg-[#3f4f83]"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card-glass p-5 rounded-xl border border-slate-700">
          <h2 className="font-semibold text-lg mb-3 text-white">Helpful Hint</h2>
          <p className="text-slate-300 text-sm">Try queries like "I want to create a website", "generate blog post", "edit a video", "analyze data".</p>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-2xl mb-4 text-white">Featured AI Tools</h2>
        {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        )}
      </div>
    </div>
  );
}
