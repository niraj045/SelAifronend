#!/bin/bash

echo "🎨 Starting SelAI Frontend with Fantasy.co animations..."
echo ""

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node 18
nvm use 18

# Navigate to frontend
cd /home/ainosoft/NIraj-workspace/SelAiFrontend/frontend

# Start dev server
echo "🚀 Launching on http://localhost:5173"
echo ""
npm run dev
