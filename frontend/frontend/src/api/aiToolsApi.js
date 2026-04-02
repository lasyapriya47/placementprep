import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTools = (category, sort, page, size) => {
  const params = {};
  if (category) params.category = category;
  if (sort) params.sort = sort;
  if (page !== undefined) params.page = page;
  if (size !== undefined) params.size = size;
  return api.get('/tools', { params }).then(res => res.data);
};

export const getToolById = id => api.get(`/tools/${id}`).then(res => res.data);
export const searchTools = q => api.get('/tools/search', { params: { q } }).then(res => res.data);
export const getCategories = () => api.get('/tools/categories').then(res => res.data);
export const getFeatured = () => api.get('/tools/featured').then(res => res.data);
export const recommendTools = q => api.get('/tools/recommend', { params: { q } }).then(res => res.data);

export const addTool = tool => api.post('/tools', tool).then(res => res.data);
export const updateTool = (id, updates) => api.put(`/tools/${id}`, updates).then(res => res.data);
export const deleteTool = id => api.delete(`/tools/${id}`);
export const favoriteTool = id => api.post(`/tools/${id}/favorite`).then(res => res.data);
export const rateTool = (id, rating) => api.post(`/tools/${id}/rating`, { rating }).then(res => res.data);
