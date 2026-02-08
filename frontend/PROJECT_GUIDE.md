# 🎨 SelAI Frontend - Modern AI Testing Dashboard

## Overview

A cutting-edge React frontend built with Vite, Tailwind CSS, and Framer Motion that provides a beautiful, animated interface for your AI-powered Selenium testing platform.

## 🌟 Key Features

### 1. **Dashboard (Projects Management)**
- Create new test projects by entering any website URL
- View all existing projects in an animated grid layout
- One-click test execution with visual feedback
- Staggered card animations for a polished entrance effect

### 2. **Live Test Runner**
- Real-time test execution monitoring
- Animated 3-stage pipeline visualization:
  - 🧠 **AI Analysis** (Python GPT-4 integration)
  - 💻 **Orchestration** (Java backend coordination)
  - 🌐 **Execution** (Selenium browser automation)
- Live console logs with typewriter effect
- Automatic status polling (checks every 2 seconds)
- Beautiful success/failure result cards

### 3. **Modern UI/UX**
- **Glass AI** design aesthetic (inspired by OpenAI/Vercel)
- Smooth page transitions
- Hover effects and micro-interactions
- Responsive design (mobile-first)
- Accessibility-friendly

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── Motion.jsx  # Reusable animated components
│   ├── pages/
│   │   ├── Dashboard.jsx   # Main projects page
│   │   └── TestRunStatus.jsx  # Live test monitor
│   ├── services/
│   │   └── api.js          # Backend API integration
│   ├── App.jsx             # Router configuration
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles + Tailwind
├── index.html
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── package.json            # Dependencies
└── setup.sh                # Quick setup script
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 16+** (check with `node -v`)
- **npm** or **yarn**

### Installation

#### Option 1: Automatic Setup (Recommended)
```bash
cd frontend
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual Setup
```bash
cd frontend
npm install
npm run dev
```

The app will open at **http://localhost:5173**

### Building for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 🔌 Backend Integration

The frontend expects your Java API Gateway to be running on **http://localhost:8080**

### API Endpoints Used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/projects` | Fetch all projects |
| POST | `/api/projects` | Create new project |
| POST | `/api/test-runs` | Start test execution |
| GET | `/api/test-runs/:id` | Poll test status |
| GET | `/api/reports/:id/execution` | Download report |

### Request/Response Examples

**Create Project:**
```json
POST /api/projects
{
  "name": "google.com",
  "url": "https://google.com",
  "description": "Created via UI",
  "browserType": "chrome",
  "testType": "smoke"
}
```

**Start Test Run:**
```json
POST /api/test-runs
{
  "projectId": 1,
  "url": "https://google.com",
  "browser": "chrome",
  "testType": "smoke"
}
```

**Status Response:**
```json
GET /api/test-runs/42
{
  "id": 42,
  "status": "RUNNING",  // PENDING | RUNNING | PASSED | FAILED
  "projectId": 1,
  "startTime": "2026-02-06T10:30:00Z"
}
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563EB` (Tailwind `blue-600`)
- **Success Green**: `#10B981` (Tailwind `green-500`)
- **Warning Yellow**: `#F59E0B` (Tailwind `yellow-500`)
- **Error Red**: `#EF4444` (Tailwind `red-500`)
- **Neutral Gray**: `#6B7280` (Tailwind `gray-500`)

### Typography
- **Heading Font**: System UI Stack (Inter-like)
- **Body Font**: Sans-serif
- **Code Font**: Monospace (for terminal logs)

### Animation Timings
- **Card Entry**: 0.4s ease-out
- **Button Hover**: 1.02x scale
- **Button Tap**: 0.95x scale
- **Status Check**: Every 2 seconds

## 🧩 Component Architecture

### Reusable Components

#### `FadeInCard`
Animated card wrapper with staggered delays
```jsx
<FadeInCard delay={0.2}>
  {/* Your content */}
</FadeInCard>
```

#### `BouncyButton`
Interactive button with scale animations
```jsx
<BouncyButton 
  onClick={handleClick}
  className="bg-blue-600 text-white"
>
  Click Me
</BouncyButton>
```

### Page Components

#### `Dashboard`
- Fetches projects on mount
- Handles project creation
- Triggers test runs
- Navigates to status page

#### `TestRunStatus`
- Polls backend every 2s for status updates
- Displays animated 3-stage pipeline
- Shows live logs
- Auto-stops polling when complete

## 📦 Dependencies

### Core
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `vite` ^5.0.8

### Routing
- `react-router-dom` ^6.20.1

### HTTP Client
- `axios` ^1.6.2

### UI/Animation
- `framer-motion` ^10.16.16
- `lucide-react` ^0.294.0
- `clsx` ^2.0.0
- `tailwind-merge` ^2.2.0

### Styling
- `tailwindcss` ^3.4.0
- `autoprefixer` ^10.4.16
- `postcss` ^8.4.32

## 🎯 Usage Flow

### Creating a Project
1. User enters URL (e.g., `https://google.com`)
2. Click **"Initialize"** button
3. Frontend extracts hostname as project name
4. POST request to `/api/projects`
5. Project appears in grid with ID badge

### Running a Test
1. User clicks **Play** button on project card
2. POST request to `/api/test-runs` with projectId
3. Backend returns `runId`
4. Frontend navigates to `/run/:runId`
5. Status page begins polling

### Monitoring Test Execution
1. Every 2 seconds, GET `/api/test-runs/:runId`
2. Update pipeline animation based on status:
   - **PENDING**: AI Analysis glowing
   - **RUNNING**: All stages active, line animation
   - **PASSED**: Success message + green indicator
   - **FAILED**: Error message + red indicator
3. Logs appear in terminal-style console
4. Polling stops on completion

## 🔧 Configuration

### Changing API Base URL
Edit [src/services/api.js](src/services/api.js):
```javascript
const API_BASE_URL = 'http://your-server:8080/api';
```

### Adjusting Poll Interval
Edit [src/pages/TestRunStatus.jsx](src/pages/TestRunStatus.jsx):
```javascript
const interval = setInterval(checkStatus, 3000); // 3 seconds
```

### Customizing Colors
Edit [tailwind.config.js](tailwind.config.js):
```javascript
theme: {
  extend: {
    colors: {
      brand: '#YOUR_COLOR'
    }
  }
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
# or
lsof -ti:5173 | xargs kill -9
```

### CORS Errors
Ensure your Java backend has CORS enabled:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### Node Version Issues
```bash
# Using nvm (Node Version Manager)
nvm install 18
nvm use 18
```

## 📸 Screenshots

### Dashboard
- Clean header with "SelAi" branding
- Green "System Operational" indicator
- URL input bar with validation
- Grid of project cards with hover effects

### Test Runner
- Gradient top border (blue → purple → pink)
- 3-stage pipeline with icons
- Animated connecting lines
- Terminal-style log output
- Status-specific result cards

## 🎓 Learning Resources

### Framer Motion
- [Official Docs](https://www.framer.com/motion/)
- Layout animations with `layoutId`
- Gesture animations (`whileHover`, `whileTap`)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- Utility-first CSS framework
- Responsive design utilities

### React Router
- [React Router Docs](https://reactrouter.com/)
- Client-side routing
- URL parameters with `useParams`

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag `dist` folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

## 📄 License

This project is part of the SelAI testing platform.

---

**Built with ❤️ using React, Vite, and Framer Motion**

For backend documentation, see the main project README.
