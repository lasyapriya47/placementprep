import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTools, getCategories } from '../api/aiToolsApi';
import ToolCard from '../components/ToolCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';

const getQueryValue = (search, key) => new URLSearchParams(search).get(key) || '';

export default function ToolsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(18);

  const category = getQueryValue(location.search, 'category');
  const sort = getQueryValue(location.search, 'sort');
  const q = getQueryValue(location.search, 'q');
  const queryPage = Number(getQueryValue(location.search, 'page') || 0);

  useEffect(() => {
    setPage(queryPage);
  }, [queryPage]);

  const fetchData = () => {
    setLoading(true);
    getTools(category, sort, page, size)
      .then(data => setTools(data))
      .catch((err) => {
        const message = err?.response?.data?.message || err?.message || 'Unable to fetch tools.';
        setError(`Unable to fetch tools: ${message}`);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, [category, sort, page, size]);

  useEffect(() => {
    if (q) {
      setLoading(true);
      const fetch = () => {
        getTools(category, sort).then(data => {
          const queried = data.filter(tool => tool.name.toLowerCase().includes(q.toLowerCase()) || tool.description.toLowerCase().includes(q.toLowerCase()) || tool.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase())));
          setTools(queried);
        }).catch(() => setError('Unable to search tools')).finally(() => setLoading(false));
      };
      fetch();
    }
  }, [q]);

  const handleCategory = selectedCategory => {
    setPage(0);
    const params = new URLSearchParams(location.search);
    if (selectedCategory) params.set('category', selectedCategory); else params.delete('category');
    params.set('page', 0);
    navigate(`/tools?${params.toString()}`);
  };

  const handleSort = selectedSort => {
    setPage(0);
    const params = new URLSearchParams(location.search);
    if (selectedSort) params.set('sort', selectedSort); else params.delete('sort');
    params.set('page', 0);
    navigate(`/tools?${params.toString()}`);
  };

  const onSearch = q => {
    if (!q) {
      navigate('/tools');
      return;
    }
    navigate(`/recommendation?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="space-y-6">
      <SearchBar onSearch={onSearch} />
      <FilterPanel categories={categories} selectedCategory={category} onSelectCategory={handleCategory} sortBy={sort} onSortBy={handleSort} />
      <div>
        <div className="mb-4 text-sm text-cyan-200">Showing {tools.length} tools (page {page + 1})</div>
        {loading ? <p className="text-slate-200">Loading tools...</p> : error ? <p className="text-red-400">{error}</p> : (
          <>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
            </div>
            <div className="mt-4 flex justify-center items-center gap-3">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 text-xs bg-slate-700 text-white rounded hover:bg-slate-600 disabled:opacity-50"
              >Previous</button>
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-xs bg-slate-700 text-white rounded hover:bg-slate-600"
              >Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
