import { useState } from 'react';

export default function SearchBar({ initialValue = '', onSearch }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search AI tools (e.g. create website)"
        className="flex-grow border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
      >
        Search
      </button>
    </form>
  );
}
