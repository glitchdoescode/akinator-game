#!/bin/bash

echo "🚀 Starting Akinator Backend Server..."
echo "======================================="
echo ""

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Run setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if dependencies are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r backend/requirements.txt
fi

echo "✓ Starting FastAPI server on http://localhost:8000"
echo ""

cd backend && python api.py
