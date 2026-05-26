import { http } from './http';

export const projectsApi = {
  getAll: async () => {
    const res = await http.get('/api/projects');
    return res.data;
  },

  getById: async (id) => {
    const res = await http.get(`/api/projects/${id}`);
    return res.data;
  },

  create: async (payload) => {
    const res = await http.post('/api/projects', payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await http.put(`/api/projects/${id}`, payload);
    return res.data;
  },

  delete: async (id) => {
    await http.delete(`/api/projects/${id}`);
  },

  search: async (query) => {
    const res = await http.get(`/api/projects/search`, { params: { q: query } });
    return res.data;
  },

  getByType: async (testType) => {
    const res = await http.get(`/api/projects/by-type/${testType}`);
    return res.data;
  },
};
