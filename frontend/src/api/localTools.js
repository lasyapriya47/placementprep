const categories = [
  'Web Development',
  'Content Writing',
  'Image Generation',
  'Video Editing',
  'Coding',
  'Productivity',
  'Data Science',
  'Marketing',
  'Design',
  'Education'
];

const goodUseCases = [
  'Build responsive websites',
  'Generate blog content',
  'Create social media visuals',
  'Edit video clips',
  'Assist coding',
  'Manage tasks',
  'Analyze datasets',
  'Run campaigns',
  'Design UX',
  'Teach coding'
];

const tagSets = [
  'web development',
  'website builder',
  'frontend',
  'backend',
  'content writing',
  'copywriting',
  'ai design',
  'video editing',
  'programming',
  'data analytics',
  'marketing',
  'automation',
  'seo',
  'ai research'
];

const normalizeName = name => name.toLowerCase().replace(/\s+/g, '+').replace(/%/g, '');

const createTools = () => {
  const tools = [];
  for (let i = 1; i <= 520; i += 1) {
    const category = categories[(i - 1) % categories.length];
    const name = `${category} AI Tool ${String(i).padStart(3, '0')}`;
    const useCase = goodUseCases[(i - 1) % goodUseCases.length];
    const description = `AI-powered ${category.toLowerCase()} assistant used to ${useCase.toLowerCase()}.`;
    const useCases = [useCase];
    const normalized = normalizeName(name);
    const learningLinks = [
      `https://www.youtube.com/results?search_query=${normalized}+tutorial`,
      `https://www.google.com/search?q=${normalized}+ai+tool+tutorial`
    ];
    const tags = [
      tagSets[(i - 1) % tagSets.length],
      tagSets[i % tagSets.length]
    ];
    const popularity = 100 + ((i * 37) % 900);
    const favoriteCount = 10 + ((i * 13) % 60);
    const ratingCount = 5 + ((i * 17) % 50);
    const averageRating = Math.round((3.5 + ((i * 17) % 15) / 10) * 10) / 10;
    const createdAt = new Date(Date.now() - (520 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    tools.push({
      id: String(i),
      name,
      category,
      description,
      website: `https://www.google.com/search?q=${normalized}+ai+tool`,
      useCases,
      learningLinks,
      tags,
      popularity,
      favoriteCount,
      ratingCount,
      averageRating,
      createdAt
    });
  }
  return tools;
};

const tools = createTools();

const cloneTool = tool => ({ ...tool, useCases: [...tool.useCases], learningLinks: [...tool.learningLinks], tags: [...tool.tags] });

export const getCategories = () => Promise.resolve([...new Set(tools.map(tool => tool.category))]);

export const getTools = (category, sort, page = 0, size = 18) => {
  let result = [...tools];
  if (category) {
    result = result.filter(tool => tool.category === category);
  }

  if (sort === 'popular') {
    result.sort((a, b) => b.popularity - a.popularity);
  } else if (sort === 'latest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'top-rated') {
    result.sort((a, b) => b.averageRating - a.averageRating);
  } else if (sort === 'most-loved') {
    result.sort((a, b) => b.favoriteCount - a.favoriteCount);
  }

  const start = page * size;
  const data = result.slice(start, start + size).map(cloneTool);
  return Promise.resolve(data);
};

export const getToolById = id => {
  const tool = tools.find(tool => tool.id === String(id));
  if (!tool) return Promise.reject(new Error('Tool not found'));
  return Promise.resolve(cloneTool(tool));
};

export const searchTools = q => {
  if (!q) return Promise.resolve([]);
  const term = q.toLowerCase();
  const result = tools.filter(tool =>
    tool.name.toLowerCase().includes(term) ||
    tool.description.toLowerCase().includes(term) ||
    tool.tags.some(tag => tag.toLowerCase().includes(term)) ||
    tool.useCases.some(useCase => useCase.toLowerCase().includes(term))
  ).map(cloneTool);
  return Promise.resolve(result);
};

export const getFeatured = () => {
  const featured = [...tools].sort((a, b) => b.popularity - a.popularity).slice(0, 6).map(cloneTool);
  return Promise.resolve(featured);
};

export const recommendTools = q => {
  if (!q) return Promise.resolve([]);
  return searchTools(q);
};

export const addTool = tool => {
  const id = String(tools.length + 1);
  const newTool = {
    ...tool,
    id,
    popularity: tool.popularity ?? 100,
    favoriteCount: tool.favoriteCount ?? 0,
    ratingCount: tool.ratingCount ?? 0,
    averageRating: tool.averageRating ?? 0,
    createdAt: tool.createdAt ?? new Date().toISOString().split('T')[0],
    useCases: tool.useCases ?? [],
    learningLinks: tool.learningLinks ?? [],
    tags: tool.tags ?? []
  };
  tools.push(newTool);
  return Promise.resolve(cloneTool(newTool));
};

export const updateTool = (id, updates) => {
  const index = tools.findIndex(tool => tool.id === String(id));
  if (index === -1) return Promise.reject(new Error('Tool not found'));
  tools[index] = { ...tools[index], ...updates };
  return Promise.resolve(cloneTool(tools[index]));
};

export const deleteTool = id => {
  const index = tools.findIndex(tool => tool.id === String(id));
  if (index === -1) return Promise.reject(new Error('Tool not found'));
  tools.splice(index, 1);
  return Promise.resolve();
};

export const favoriteTool = id => {
  const tool = tools.find(tool => tool.id === String(id));
  if (!tool) return Promise.reject(new Error('Tool not found'));
  tool.favoriteCount += 1;
  return Promise.resolve(cloneTool(tool));
};

export const rateTool = (id, rating) => {
  const tool = tools.find(tool => tool.id === String(id));
  if (!tool) return Promise.reject(new Error('Tool not found'));
  const totalRating = tool.averageRating * tool.ratingCount + Number(rating);
  tool.ratingCount += 1;
  tool.averageRating = Math.round((totalRating / tool.ratingCount) * 10) / 10;
  return Promise.resolve(cloneTool(tool));
};
