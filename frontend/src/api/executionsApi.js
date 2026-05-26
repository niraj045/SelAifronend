import { http } from './http';

export const executionsApi = {
  getByRun: async (testRunId) => {
    const res = await http.get(`/api/execute/run/${testRunId}`);
    return res.data;
  },

  getById: async (executionId) => {
    const res = await http.get(`/api/execute/${executionId}`);
    return res.data;
  },
};
