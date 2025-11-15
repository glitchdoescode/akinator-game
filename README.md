# Akinator Clone - LangGraph Edition

An AI-powered Akinator clone using LangGraph with a single agent + tools pattern, powered by Google's Gemini 2.5 Flash or OpenAI GPT models.

## Features

- **Beautiful Web Interface**: React + Chakra UI + Tailwind CSS - sleek, professional, and minimal design
- **Single Agent Architecture**: LangGraph with tool calling pattern
- **Multiple LLM Support**: Choose between Google Gemini 2.5 Flash or OpenAI GPT models
- **Web Search Integration**: Tavily API for intelligent character research
- **Real-time Gameplay**: Interactive question-answer flow
- **Quick Answer Buttons**: Yes, No, Don't Know, Maybe
- **Guess Limit**: Configurable maximum guesses (default: 20)
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Mobile-Optimized**: Fully functional on phones with ngrok support

## Tech Stack

### Backend
- **LangGraph**: Agent orchestration framework with single agent + tools pattern
- **FastAPI**: Modern, fast web framework with CORS support
- **Google Gemini 2.5 Flash** or **OpenAI GPT**: Configurable LLM providers
- **Tavily API**: Web search tool for character research
- **Python 3.10+**: Backend runtime

### Frontend
- **React + Vite**: Fast, modern development with HMR
- **Chakra UI v3**: Modern component library
- **Tailwind CSS v4**: Utility-first styling
- **Responsive Design**: Mobile-first approach with breakpoints

## How to Replicate This Project

### Prerequisites

- **Python 3.10+** installed
- **Node.js 18+** and npm installed
- **Git** installed

### Step 1: Clone the Repository

```bash
git clone https://github.com/glitchdoescode/akinator-game.git
cd akinator-game
```

### Step 2: Get API Keys

You'll need API keys for the LLM provider and web search:

1. **Choose Your LLM Provider:**
   - **Google Gemini** (recommended, free tier available):
     - Get API key from https://aistudio.google.com/app/apikey
   - **OpenAI** (paid, requires credit card):
     - Get API key from https://platform.openai.com/api-keys

2. **Tavily API** (required for web search):
   - Get free API key from https://tavily.com

### Step 3: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

Update these values in `.env`:

```bash
# Choose your LLM provider: "gemini" or "openai"
LLM_PROVIDER=gemini

# If using Gemini (default):
GOOGLE_API_KEY=your_google_api_key_here

# If using OpenAI:
# LLM_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key_here
# OPENAI_MODEL=gpt-4o-mini  # or gpt-4o, gpt-4-turbo

# Tavily API (required):
TAVILY_API_KEY=your_tavily_api_key_here

# Optional: Configure max guesses (default: 20)
MAX_GUESSES=20
```

### Step 4: Install Dependencies

#### Option A: Automated Setup (Recommended)

```bash
# Run the setup script (installs both backend and frontend)
chmod +x setup.sh
./setup.sh
```

#### Option B: Manual Setup

**Backend:**
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

**Frontend:**
```bash
# Install Node dependencies
cd frontend
npm install
cd ..
```

### Step 5: Run the Application

#### Option A: Using Scripts (Recommended)

```bash
# Make scripts executable (first time only)
chmod +x start-backend.sh start-frontend.sh

# Start backend (Terminal 1)
./start-backend.sh

# Start frontend (Terminal 2)
./start-frontend.sh
```

#### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
source venv/bin/activate
cd backend
python api.py
```
Backend runs on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

### Step 6: Play the Game!

1. Open your browser to **http://localhost:5173**
2. Click "Start Game"
3. Think of a character (real person, fictional character, animal, object, etc.)
4. Answer the AI's questions using Yes/No/Don't Know/Maybe
5. Watch the AI guess your character!

---

## Sharing with Friends (Mobile Support)

To let friends play on their phones:

### 1. Install ngrok

```bash
# Download from https://ngrok.com/download
# Or via package manager:
brew install ngrok  # macOS
# or snap install ngrok  # Linux
```

### 2. Expose Frontend via ngrok

```bash
# In a new terminal
ngrok http 5173
```

You'll get a URL like: `https://your-unique-id.ngrok-free.app`

### 3. Share the URL

Send the ngrok URL to your friends - they can play on their phones!

**Note:** The frontend proxy will automatically forward API requests to your local backend, so you only need one ngrok tunnel.

---

## Project Structure

```
akinator-game/
├── backend/
│   ├── api.py              # FastAPI server with session management
│   ├── agent.py            # LangGraph agent with multi-LLM support
│   ├── tools.py            # Web search & guess tools
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Node dependencies
│   ├── vite.config.js      # Vite config with proxy & ngrok support
│   └── postcss.config.js   # PostCSS config for Tailwind v4
├── .env                    # Environment variables (not in git)
├── .env.example            # Example environment file
├── .gitignore              # Git ignore rules
├── setup.sh                # Automated setup script
├── start-backend.sh        # Backend startup script
├── start-frontend.sh       # Frontend startup script
└── README.md               # This file
```

## How It Works

### LangGraph Agent Architecture

The system uses a **single agent + tools** pattern:

1. **Agent Node**: LLM (Gemini or OpenAI) generates questions
2. **Tool Node**: Executes web_search and make_final_guess tools
3. **State**: Tracks messages, questions asked, guesses made, game status

### Game Flow

1. User starts game → Backend creates session with initial state
2. LangGraph agent invokes LLM with system prompt
3. LLM asks strategic yes/no question
4. User answers → State updated, agent invoked again
5. Agent uses web_search tool (after 8-10 questions) to find candidates
6. Agent asks distinguishing questions based on search results
7. Agent uses make_final_guess tool when confident
8. Game ends on correct guess or after 20 guesses (configurable)

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

- `POST /api/start` - Start a new game session, returns first question
- `POST /api/answer` - Submit answer (Yes/No/Don't Know/Maybe), returns next question
- `POST /api/reset` - Reset and delete a game session
- `GET /api/sessions` - Get active session count (monitoring)
- `GET /` - Health check endpoint

## Configuration

All configuration is done via `.env` file:

| Variable | Options | Default | Description |
|----------|---------|---------|-------------|
| `LLM_PROVIDER` | `gemini`, `openai` | `gemini` | Which LLM to use |
| `GOOGLE_API_KEY` | string | - | Google Gemini API key |
| `OPENAI_API_KEY` | string | - | OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o`, `gpt-4o-mini`, etc. | `gpt-4o-mini` | OpenAI model to use |
| `TAVILY_API_KEY` | string | - | Tavily web search API key |
| `MAX_GUESSES` | number | `20` | Maximum guesses before giving up |

## Troubleshooting

### Backend won't start
- **Virtual environment**: Ensure it's activated: `source venv/bin/activate`
- **Dependencies**: Install with `pip install -r backend/requirements.txt`
- **API keys**: Verify they're set correctly in `.env`
- **LLM Provider**: Check `LLM_PROVIDER` matches your configured keys

### Frontend won't start
- **Dependencies**: Run `cd frontend && npm install`
- **Port conflict**: Make sure port 5173 is available
- **Backend running**: Frontend needs backend on port 8000

### "Failed to start game" error
- **Backend status**: Ensure backend is running on http://localhost:8000
- **Browser console**: Check for CORS or network errors
- **API keys**: Verify Gemini/OpenAI and Tavily keys are valid
- **LLM Provider**: Check if selected provider's API key is configured

### Slow responses
- **Normal behavior**: AI needs 2-5 seconds to think
- **Web search**: Adds 1-2 extra seconds when used
- **Model choice**: Gemini Flash is fastest, GPT-4o is slower but more capable
- **Network**: Check your internet connection

### Game not working on mobile (ngrok)
- **Allowed hosts**: Check `vite.config.js` has your ngrok domain in `allowedHosts`
- **Proxy setup**: Verify Vite proxy is configured for `/api` routes
- **Backend running**: Ensure backend is running locally before sharing ngrok URL

## Performance

- **Average Questions**: 10-20 to guess correctly
- **Response Time**: 1-3 seconds per turn
- **Success Rate**: High for well-known characters
- **Cost**: ~$0.01-0.05 per game (Gemini Flash pricing)

## Development

To modify or extend this project:

### Backend Development

```bash
# Auto-reload on file changes
source venv/bin/activate
cd backend
uvicorn api:app --reload --port 8000
```

### Frontend Development

```bash
# HMR (Hot Module Replacement) enabled
cd frontend
npm run dev
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build
npm run preview  # Preview production build

# Backend
# Use gunicorn or uvicorn for production deployment
```

## Tech Stack Deep Dive

**Why these choices:**

- **LangGraph**: Best for stateful agent workflows with tool calling
- **Gemini 2.5 Flash**: Fastest LLM with great reasoning, free tier available
- **OpenAI GPT**: Alternative for different use cases (paid)
- **Tavily**: Superior web search API for LLM applications
- **FastAPI**: Modern async Python framework, perfect for AI apps
- **React + Vite**: Lightning-fast development experience
- **Chakra UI v3**: Production-ready components with great DX
- **Tailwind v4**: Utility-first CSS for rapid UI development

## Contributing

Feel free to open issues or submit PRs! Areas for improvement:

- Add more LLM providers (Anthropic Claude, Cohere, etc.)
- Implement game history/statistics
- Add difficulty levels
- Support for multiple languages
- Voice input/output
- Persistent storage (database)

## Credits

- Built with [LangGraph](https://github.com/langchain-ai/langgraph)
- Powered by [Google Gemini](https://ai.google.dev/gemini-api) and [OpenAI](https://openai.com)
- Web search by [Tavily](https://tavily.com)
- UI by [Chakra UI](https://chakra-ui.com) and [Tailwind CSS](https://tailwindcss.com)

## License

MIT License - Feel free to use, modify, and distribute!

---

**Enjoy playing Akinator!** 🧞✨

Made for a technical interview showcase - demonstrating LangGraph, multi-LLM support, and full-stack development.
