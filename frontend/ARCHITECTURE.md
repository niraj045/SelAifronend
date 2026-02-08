# 🏗️ SelAI Frontend Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:5173                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
                    ┌────────────▼────────────┐
                    │   React App (Vite)      │
                    │                         │
                    │  ┌──────────────────┐   │
                    │  │  App.jsx         │   │
                    │  │  (Router)        │   │
                    │  └────────┬─────────┘   │
                    │           │             │
                    │  ┌────────▼─────────┐   │
                    │  │  Dashboard       │   │
                    │  │  (/)             │   │
                    │  └────────┬─────────┘   │
                    │           │             │
                    │  ┌────────▼─────────┐   │
                    │  │  TestRunStatus   │   │
                    │  │  (/run/:id)      │   │
                    │  └────────┬─────────┘   │
                    └───────────┼─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │   api.js Service        │
                    │   (Axios HTTP Client)   │
                    └───────────┬─────────────┘
                                │
                                │ HTTP/JSON
                                │
                    ┌───────────▼─────────────┐
                    │   Java API Gateway      │
                    │   localhost:8080/api    │
                    └─────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├── Router (react-router-dom)
│
├── Dashboard.jsx
│   ├── Motion Components
│   │   ├── FadeInCard (header)
│   │   ├── FadeInCard (create form)
│   │   └── FadeInCard (project cards) × N
│   │       └── BouncyButton (Play)
│   │
│   └── API Calls
│       ├── getProjects()
│       ├── createProject()
│       └── startTestRun()
│
└── TestRunStatus.jsx
    ├── Motion Components
    │   ├── StatusNode (AI Analysis)
    │   ├── ConnectingLine
    │   ├── StatusNode (Orchestration)
    │   ├── ConnectingLine
    │   ├── StatusNode (Execution)
    │   └── Typewriter (logs)
    │
    └── API Calls
        └── getTestRunStatus() [polls every 2s]
```

## Data Flow

### Creating a Project

```
User Input (URL)
    │
    ▼
Dashboard.handleCreate()
    │
    ▼
api.createProject()
    │
    ▼
POST http://localhost:8080/api/projects
    │
    ▼
Java Backend (test-management-service)
    │
    ▼
Database (H2/PostgreSQL)
    │
    ▼
Response: { id, name, url, ... }
    │
    ▼
Dashboard.loadProjects() [refresh list]
    │
    ▼
UI Updates with new project card
```

### Running a Test

```
User clicks "Play" on project
    │
    ▼
Dashboard.runTest(project)
    │
    ▼
api.startTestRun(projectId, url)
    │
    ▼
POST http://localhost:8080/api/test-runs
    │
    ▼
Java Orchestration Service
    │
    ├──► Python AI Engine (GPT-4)
    │    └──► Generate test steps
    │
    └──► Selenium Grid
         └──► Execute steps
    │
    ▼
Response: { id: runId, status: "PENDING" }
    │
    ▼
navigate(`/run/${runId}`)
    │
    ▼
TestRunStatus page opens
    │
    ▼
Poll status every 2 seconds
    │
    ▼
Update UI pipeline animation
```

## State Management

### Dashboard Component State

```javascript
{
  projects: Array<Project>,  // List of all projects
  newUrl: string,            // Input field value
  loading: boolean           // Create button state
}
```

### TestRunStatus Component State

```javascript
{
  status: string,     // "PENDING" | "RUNNING" | "PASSED" | "FAILED"
  logs: Array<string> // Console log messages
}
```

## API Service Interface

```javascript
// src/services/api.js

export const api = {
  // Projects
  getProjects()                    → GET /api/projects
  createProject(data)              → POST /api/projects
  
  // Test Runs
  startTestRun(projectId, url)     → POST /api/test-runs
  getTestRunStatus(runId)          → GET /api/test-runs/:id
  
  // Reports
  getRunReport(runId)              → GET /api/reports/:id/execution
}
```

## Animation Timeline

### Dashboard Page Load

```
0.0s: Page renders (blank)
0.1s: Header slides in from left
0.2s: Create form fades in
0.3s: First project card fades in
0.4s: Second project card fades in
0.5s: Third project card fades in
...
```

### Test Status Page

```
When status = "PENDING":
  - AI Analysis node: glowing + pulse
  - Other nodes: gray
  
When status = "RUNNING":
  - All nodes: colored + enlarged
  - Connecting lines: animated flow
  - Logs: typewriter effect
  
When status = "PASSED":
  - Pipeline frozen
  - Success card slides up
  - Polling stops
```

## File Dependencies

```
index.html
  └── src/main.jsx
      └── src/App.jsx
          ├── src/index.css (Tailwind)
          │   ├── tailwind.config.js
          │   └── postcss.config.js
          │
          ├── src/pages/Dashboard.jsx
          │   ├── src/services/api.js (Axios)
          │   └── src/components/ui/Motion.jsx (Framer Motion)
          │
          └── src/pages/TestRunStatus.jsx
              ├── src/services/api.js
              └── [Motion components inline]
```

## Build Process

```
npm run dev
    │
    ▼
Vite Dev Server
    │
    ├──► Compile JSX → JavaScript
    ├──► Process Tailwind → CSS
    ├──► Hot Module Replacement
    └──► Serve on localhost:5173

npm run build
    │
    ▼
Vite Build
    │
    ├──► Bundle JavaScript
    ├──► Minify CSS
    ├──► Optimize assets
    └──► Output to dist/
```

## Technology Stack Layers

```
┌─────────────────────────────────┐
│  UI Layer                        │
│  - React Components              │
│  - Framer Motion Animations      │
│  - Lucide Icons                  │
└───────────────┬─────────────────┘
                │
┌───────────────▼─────────────────┐
│  Styling Layer                   │
│  - Tailwind CSS Utilities        │
│  - Custom CSS                    │
└───────────────┬─────────────────┘
                │
┌───────────────▼─────────────────┐
│  Routing Layer                   │
│  - React Router DOM              │
│  - Client-side Navigation        │
└───────────────┬─────────────────┘
                │
┌───────────────▼─────────────────┐
│  Data Layer                      │
│  - Axios HTTP Client             │
│  - API Service Abstraction       │
└───────────────┬─────────────────┘
                │
┌───────────────▼─────────────────┐
│  Backend Layer                   │
│  - Java API Gateway              │
│  - Microservices                 │
└─────────────────────────────────┘
```

## Performance Optimizations

1. **Vite**: Lightning-fast HMR (Hot Module Replacement)
2. **Code Splitting**: React Router handles automatic route splitting
3. **Lazy Loading**: Components load on-demand
4. **Tailwind Purge**: Unused CSS removed in production
5. **Framer Motion**: GPU-accelerated animations
6. **Polling Strategy**: Only active when test is running

## Security Considerations

1. **CORS**: Backend must allow `http://localhost:5173`
2. **Input Validation**: URL validation on form submit
3. **Error Handling**: Try-catch on all API calls
4. **No Sensitive Data**: API keys managed on backend

## Deployment Architecture

```
Production:

User Browser
    │
    ▼
CDN (Vercel/Netlify)
    │
    ▼
Static Files (dist/)
    │
    ▼
API Calls → Your Java Backend
```

This architecture provides:
- ✅ Fast initial load
- ✅ Real-time updates
- ✅ Smooth animations
- ✅ Scalable structure
- ✅ Clean separation of concerns
