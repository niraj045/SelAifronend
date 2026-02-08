#!/bin/bash

echo "======================================"
echo "  SelAI Frontend Setup"
echo "======================================"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "⚠️  Warning: Node.js version is $NODE_VERSION. Version 16+ is recommended."
    echo "   The app may not work correctly with older Node versions."
    echo ""
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "======================================"
    echo "  Quick Start"
    echo "======================================"
    echo ""
    echo "Development:"
    echo "  npm run dev"
    echo ""
    echo "Production build:"
    echo "  npm run build"
    echo ""
    echo "The app will be available at:"
    echo "  http://localhost:5173"
    echo ""
    echo "Make sure your Java backend is running on:"
    echo "  http://localhost:8080"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check the errors above."
    exit 1
fi
