# ⚠️ Node.js Version Issue

## Problem

Your current Node.js version is **v12.20.0**, which is too old to run modern React tooling.

```bash
$ node --version
v12.20.0  # ❌ Too old!
```

## Solution Options

### Option 1: Upgrade Node.js (Recommended)

#### Using NVM (Node Version Manager) - Linux

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node 18
nvm install 18

# Use Node 18
nvm use 18

# Verify
node --version  # Should show v18.x.x
```

#### Using NodeSource Repository - Ubuntu/Debian

```bash
# Add Node 18 repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify
node --version
```

#### After Upgrading Node

```bash
cd /home/ainosoft/NIraj-workspace/SelAiFrontend/frontend

# Clean install
rm -rf node_modules package-lock.json
npm install

# Run dev server
npm run dev
```

---

### Option 2: Use Create React App (No Build Tool Upgrade Needed)

If you cannot upgrade Node, use an older setup:

```bash
cd /home/ainosoft/NIraj-workspace/SelAiFrontend

# Create React App (works with Node 12)
npx create-react-app frontend-cra --template cra-template

cd frontend-cra

# Install dependencies
npm install axios react-router-dom framer-motion@6 lucide-react

# Copy the src files from the Vite version
cp -r ../frontend/src/* src/
```

---

### Option 3: Simple HTML + CDN (No Build Step)

Create a standalone HTML file that works without Node:

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>SelAI Dashboard</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    // Your React code here
  </script>
</body>
</html>
```

---

## Why This Happens

| Tool | Minimum Node Version |
|------|---------------------|
| Vite 5 | Node 18+ |
| Vite 4 | Node 14.18+ |
| React 18 | Node 12+ ✅ |
| Tailwind 3 | Node 14+ |

Your Node v12 is too old for Vite and Tailwind.

---

## Quick Check

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check if nvm is installed
nvm --version
```

---

## Recommended Next Steps

1. **Install NVM** (easiest way to manage Node versions)
2. **Install Node 18**
3. **Reinstall dependencies**
4. **Run the project**

```bash
# One-liner to check and upgrade
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && \
source ~/.bashrc && \
nvm install 18 && \
nvm use 18 && \
cd /home/ainosoft/NIraj-workspace/SelAiFrontend/frontend && \
rm -rf node_modules package-lock.json && \
npm install && \
npm run dev
```

---

## Alternative: Docker

If you can't change the system Node version:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]
```

```bash
# Run in Docker
docker build -t selai-frontend .
docker run -p 5173:5173 selai-frontend
```

---

## Need Help?

After upgrading Node, if you still have issues:

```bash
# Full clean reinstall
cd /home/ainosoft/NIraj-workspace/SelAiFrontend/frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```
