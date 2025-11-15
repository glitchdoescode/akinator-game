# Akinator Clone - LangGraph Edition

An AI-powered Akinator clone using LangGraph with a single agent + tools pattern, powered by Google's Gemini 2.5 Flash.

## Features

- **Beautiful Web Interface**: React + Chakra UI + Tailwind CSS
- **Single Agent Architecture**: LangGraph with tool calling
- **Google Gemini 2.5 Flash**: Fast, intelligent question generation
- **Web Search Integration**: Tavily API for character research
- **Real-time Chat**: Interactive conversation flow
- **Quick Answer Buttons**: Yes, No, Don't Know, Maybe
- **Question Counter**: Track game progress
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Backend
- **LangGraph**: Agent orchestration framework
- **FastAPI**: Modern, fast web framework
- **Google Gemini 2.5 Flash**: Latest LLM model
- **Tavily API**: Web search tool

### Frontend
- **React + Vite**: Fast, modern development
- **Chakra UI**: Component library
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations

## Quick Start

### Option 1: Automated Setup

```bash
# Run the setup script
./setup.sh

# Start backend (Terminal 1)
./start-backend.sh

# Start frontend (Terminal 2)
./start-frontend.sh
```

Then open http://localhost:5173 in your browser!

### Option 2: Manual Setup

#### 1. Install Python Dependencies

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

#### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

#### 3. Configure API Keys

The `.env` file is already configured with API keys. If you need to update them:

```bash
# Edit .env file
nano .env
```

Add your API keys:
- `GOOGLE_API_KEY`: Get from https://aistudio.google.com/app/apikey
- `TAVILY_API_KEY`: Get from https://tavily.com

#### 4. Start the Backend

```bash
source venv/bin/activate
cd backend
python api.py
```

Backend will run on http://localhost:8000

#### 5. Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:5173

## Usage

1. **Open your browser** to http://localhost:5173
2. **Click "Start Game"**
3. **Think of a character** (real person, fictional character, etc.)
4. **Answer questions** using the quick buttons or type custom answers
5. **Watch the AI guess** your character!

## Project Structure

```
akinator/
├── backend/
│   ├── api.py              # FastAPI server
│   └── requirements.txt    # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── agent.py                # LangGraph agent
├── tools.py                # Web search & analysis tools
├── main.py                 # CLI version (optional)
├── requirements.txt        # Python dependencies
├── .env                    # API keys (configured)
├── start-backend.sh        # Backend startup script
├── start-frontend.sh       # Frontend startup script
└── README.md               # This file
```

## How It Works

### Backend Flow

1. **FastAPI Server** receives requests from frontend
2. **LangGraph Agent** processes user answers
3. **Gemini 2.5 Flash** generates strategic questions
4. **Tavily API** researches characters when needed
5. **Response** sent back to frontend

### Frontend Flow

1. **User clicks "Start Game"** → Creates session
2. **Backend returns first question**
3. **User answers** → Sends to backend
4. **Backend processes** → Returns next question or guess
5. **Repeat** until correct guess or game over

## CLI Version

You can also play the game in the terminal:

```bash
python main.py
```

## Example Game Session

```
🧞 Akinator: Is this character from a movie?
👤 You: yes

🧞 Akinator: Is this character a superhero?
👤 You: yes

🧞 Akinator: Does this character have spider-related powers?
👤 You: yes

🧞 Akinator: I think you're thinking of: Spider-Man!
👤 You: yes

🎉 Yay! I guessed it!
```

## API Endpoints

- `POST /api/start` - Start a new game session
- `POST /api/answer` - Submit an answer to a question
- `POST /api/reset` - Reset a game session
- `GET /api/sessions` - Get active session count

## Troubleshooting

### Backend won't start
- Make sure virtual environment is activated: `source venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`
- Check API keys in `.env` file

### Frontend won't start
- Install dependencies: `cd frontend && npm install`
- Make sure backend is running first

### "Failed to start game" error
- Ensure backend is running on port 8000
- Check browser console for errors
- Verify API keys are valid

### Slow responses
- This is normal! The AI is thinking
- Web search adds 1-2 seconds
- Gemini Flash is already optimized for speed

## Performance

- **Average Questions**: 10-20 to guess correctly
- **Response Time**: 1-3 seconds per turn
- **Success Rate**: High for well-known characters
- **Cost**: ~$0.01-0.05 per game (Gemini Flash pricing)

## Development

### Backend Development

```bash
# Watch for changes (auto-reload)
uvicorn backend.api:app --reload --port 8000
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Build for Production

```bash
cd frontend
npm run build
```

## Documentation

- **ARCHITECTURE.md** - Detailed system design
- **TROUBLESHOOTING.md** - Common issues and solutions
- **example_usage.py** - Programmatic usage examples

## Credits

- Built with [LangGraph](https://github.com/langchain-ai/langgraph)
- Powered by [Google Gemini 2.5 Flash](https://ai.google.dev/gemini-api)
- Web search by [Tavily](https://tavily.com)
- UI components by [Chakra UI](https://chakra-ui.com)
- Styling by [Tailwind CSS](https://tailwindcss.com)

## License

MIT License - Feel free to use and modify!

---

**Enjoy playing Akinator!** 🧞✨
