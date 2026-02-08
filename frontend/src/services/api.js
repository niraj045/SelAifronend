import axios from 'axios';

// Point strictly to the Java API Gateway
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    // --- Project Service ---
    getProjects: () => apiClient.get('/projects'),
    
    // Matches ProjectDTO.java
    createProject: (data) => apiClient.post('/projects', {
        name: data.name,
        url: data.url,
        description: data.description || "Created via UI",
        browserType: data.browserType || "chrome", // Default
        testType: data.testType || "smoke"         // Default
    }),

    // --- Orchestration Service ---
    // Matches TestRunRequest.java
    startTestRun: (projectId, url) => apiClient.post('/test-runs', {
        projectId: projectId,
        url: url,
        browser: "chrome",
        testType: "smoke"
    }),

    getTestRunStatus: (runId) => apiClient.get(`/test-runs/${runId}`),

    // --- Reporting Service ---
    getRunReport: (runId) => apiClient.get(`/reports/${runId}/execution`)
};
