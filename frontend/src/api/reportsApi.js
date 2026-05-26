import { http } from './http';

export const reportsApi = {
  getAll: async () => {
    const res = await http.get('/api/reports');
    return res.data;
  },

  getByTestRun: async (testRunId) => {
    const res = await http.get(`/api/reports/${testRunId}`);
    return res.data;
  },

  getHtml: async (testRunId) => {
    const res = await http.get(`/api/reports/${testRunId}/html`, { responseType: 'text' });
    return res.data;
  },

  getMarkdown: async (testRunId) => {
    const res = await http.get(`/api/reports/${testRunId}/markdown`, { responseType: 'text' });
    return res.data;
  },

  downloadPdf: async (testRunId) => {
    const res = await http.get(`/api/reports/${testRunId}/pdf`, { responseType: 'blob' });
    const blobUrl = window.URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `selai-test-run-${testRunId}.pdf`;
    link.click();
    window.URL.revokeObjectURL(blobUrl);
  },

  delete: async (testRunId) => {
    await http.delete(`/api/reports/${testRunId}`);
  },
};
