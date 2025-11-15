#!/bin/bash

echo "🎨 Starting Akinator Frontend..."
echo "================================"
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✓ Starting development server on http://localhost:5173"
echo ""

npm run dev
