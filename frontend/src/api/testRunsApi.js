import { http } from './http';

export const testRunsApi = {
  getAll: async () => {
    const res = await http.get('/api/test-runs');
    return res.data;
  },

  getById: async (id) => {
    const res = await http.get(`/api/test-runs/${id}`);
    return res.data;
  },

  getByProject: async (projectId) => {
    const res = await http.get(`/api/test-runs/project/${projectId}`);
    return res.data;
  },

  start: async (payload) => {
    const res = await http.post('/api/test-runs', payload);
    return res.data;
  },

  stop: async (id) => {
    await http.post(`/api/test-runs/${id}/stop`);
  },
};
