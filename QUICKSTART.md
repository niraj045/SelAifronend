# 🚀 SelAI Frontend - Quick Start

## What is This?

A modern, animated React dashboard for your AI-powered Selenium testing platform. Think OpenAI's ChatGPT interface, but for automated web testing.

## 🎯 Quick Start (3 Commands)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## ✅ Prerequisites

- Node.js 16+ (`node -v` to check)
- Your Java backend running on port 8080

## 🎨 What You'll See

### Dashboard Page (`/`)
1. Enter any website URL (e.g., `https://amazon.com`)
2. Click **"Initialize"** to create a project
3. Click the **Play** button to run AI tests

### Live Test Monitor (`/run/:id`)
Watch your test execute in real-time with:
- 🧠 AI analyzing the site
- 💻 Java orchestrating the steps
- 🌐 Selenium executing in the browser

## 📦 Tech Stack

- **React 18** - UI framework
- **Vite** - Lightning-fast dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - API calls to Java backend

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔗 Backend Connection

The frontend expects your Java API Gateway at:
```
http://localhost:8080/api
```

### Required Backend Endpoints
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `POST /api/test-runs` - Start test
- `GET /api/test-runs/:id` - Check status

## 🎨 Features

✨ **Staggered card animations** - Cards cascade into view  
🎯 **Real-time polling** - Status updates every 2 seconds  
🌊 **Smooth transitions** - Framer Motion magic  
📱 **Responsive design** - Works on all screen sizes  
🎭 **Visual pipeline** - See AI → Java → Selenium flow  
💻 **Terminal logs** - Hacker-style console output  

## 🐛 Troubleshooting

### Port 5173 Already in Use?
```bash
npx kill-port 5173
```

### CORS Errors?
Add to your Java backend:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### Old Node Version?
```bash
# Install Node 18
nvm install 18
nvm use 18
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx       ← Main projects page
│   │   └── TestRunStatus.jsx   ← Live test monitor
│   ├── services/
│   │   └── api.js              ← Backend API calls
│   └── components/ui/
│       └── Motion.jsx          ← Animated components
├── package.json
└── vite.config.js
```

## 🎯 Usage Example

1. **Start the frontend:**
   ```bash
   npm run dev
   ```

2. **Start your Java backend** (in another terminal)

3. **Open http://localhost:5173**

4. **Create a project:**
   - Enter `https://google.com`
   - Click **Initialize**

5. **Run a test:**
   - Click the **Play** button
   - Watch the magic happen!

## 📚 Learn More

- **Full Documentation**: See `PROJECT_GUIDE.md`
- **API Details**: See `src/services/api.js`
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/

## 🎉 That's It!

You now have a production-ready, animated frontend for your AI testing platform.

---

**Need help?** Check the full guide: [PROJECT_GUIDE.md](PROJECT_GUIDE.md)
