import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { recommendTools } from '../api/aiToolsApi';
import ToolCard from '../components/ToolCard';
import SearchBar from '../components/SearchBar';

const getQueryValue = (search, key) => new URLSearchParams(search).get(key) || '';

export default function RecommendationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = getQueryValue(location.search, 'q');

  useEffect(() => {
    if (!query) {
      setTools([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    recommendTools(query)
      .then(data => setTools(data))
      .catch(() => setError('Unable to fetch recommendations'))
      .finally(() => setLoading(false));
  }, [query]);

  const onSearch = (q) => {
    if (!q) {
      navigate('/tools');
      return;
    }
    navigate(`/recommendation?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="space-y-6">
      <SearchBar initialValue={query} onSearch={onSearch} />
      <div className="card-glass rounded-xl border border-slate-700 p-5">
        <h2 className="text-2xl font-bold text-white">Recommendations</h2>
        <p className="text-cyan-200">Search Query: <span className="font-semibold text-white">{query || 'N/A'}</span></p>
      </div>
      {loading ? <p className="text-slate-200">Loading recommendations...</p> : error ? <p className="text-red-400">{error}</p> : (
        tools.length === 0 ? <p className="text-slate-200">No recommendations found for "{query}".</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        )
      )}
    </div>
  );
}
