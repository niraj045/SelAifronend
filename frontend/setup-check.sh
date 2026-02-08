#!/bin/bash

echo "🚀 SelAI Frontend Setup"
echo "======================="
echo ""

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

echo "Current Node.js version: $(node -v)"
echo ""

if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version is too old (need 14+)"
    echo ""
    echo "Please upgrade Node.js:"
    echo "  1. Install NVM: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  2. Reload shell: source ~/.bashrc"
    echo "  3. Install Node 18: nvm install 18"
    echo "  4. Use Node 18: nvm use 18"
    echo "  5. Run this script again"
    echo ""
    exit 1
fi

echo "✅ Node version OK"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Installation failed"
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎉 Ready to start!"
echo ""
echo "Run: npm run dev"
echo "Then open: http://localhost:5173"
echo ""
