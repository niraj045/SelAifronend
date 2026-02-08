# SelAI Frontend

Modern, animated React frontend for the SelAI AI-Powered Testing Platform.

## Features

- **Modern UI**: Built with React, Vite, and Tailwind CSS
- **Smooth Animations**: Framer Motion for professional transitions
- **Real-time Updates**: Live test execution monitoring
- **Responsive Design**: Works on all screen sizes

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Architecture

### Components

- **Dashboard**: Main page displaying all projects
- **TestRunStatus**: Live test execution monitor with animated pipeline
- **Motion Components**: Reusable animated UI elements

### API Integration

The frontend communicates with the Java API Gateway on port 8080:

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `POST /api/test-runs` - Start test execution
- `GET /api/test-runs/:id` - Get test status
- `GET /api/reports/:id/execution` - Get test report

## Usage

1. **Create a Project**: Enter a website URL on the dashboard
2. **Run Tests**: Click the play button on any project card
3. **Monitor Progress**: Watch the AI analyze, generate, and execute tests in real-time
4. **View Results**: See test outcomes and access detailed reports

## Styling

The UI follows a modern "Glass AI" aesthetic:
- Clean whitespace
- Subtle shadows and borders
- Smooth animations
- Responsive layouts
- Professional color palette
