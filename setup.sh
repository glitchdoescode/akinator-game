#!/bin/bash

echo "🧞 Akinator Setup Script"
echo "========================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python found: $(python3 --version)"
echo ""

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r backend/requirements.txt

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "✓ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env:"
echo "   cp .env.example .env"
echo ""
echo "2. Edit .env and add your API keys:"
echo "   - GOOGLE_API_KEY: Get from https://aistudio.google.com/app/apikey"
echo "   - TAVILY_API_KEY: Get from https://tavily.com"
echo ""
echo "3. Run the application:"
echo "   # Terminal 1 - Backend:"
echo "   ./start-backend.sh"
echo ""
echo "   # Terminal 2 - Frontend:"
echo "   ./start-frontend.sh"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
