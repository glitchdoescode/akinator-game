"""FastAPI backend for Akinator game."""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables FIRST before any other imports
load_dotenv(Path(__file__).parent.parent / ".env")

# Add parent directory to path to import agent modules
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage
from agent import akinator_graph, AkinatorState
from typing import Optional, List, Dict

app = FastAPI(title="Akinator API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage (in production, use Redis or database)
sessions: Dict[str, AkinatorState] = {}


class StartGameRequest(BaseModel):
    pass


class AnswerRequest(BaseModel):
    session_id: str
    answer: str


class GameResponse(BaseModel):
    session_id: str
    question: str
    is_guess: bool
    game_over: bool


@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Akinator API is running"}


@app.post("/api/start", response_model=GameResponse)
def start_game(request: StartGameRequest):
    """Start a new game session."""
    import uuid
    session_id = str(uuid.uuid4())

    # Initialize new game state
    initial_state: AkinatorState = {
        "messages": [
            HumanMessage(
                content="I'm thinking of someone/something. Start asking me yes/no questions!"
            )
        ],
        "questions_asked": 0,
        "guesses_made": 0,
        "user_thinking_of": "",
        "game_over": False,
    }

    # Invoke the graph to get first question
    try:
        result = akinator_graph.invoke(initial_state)
        sessions[session_id] = result

        # Get the AI's first message
        last_message = result["messages"][-1]
        message_content = last_message.content if hasattr(last_message, "content") else ""

        # Check for tool calls and final guess
        tool_calls = None
        is_final_guess = False

        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            tool_calls = [tc.get("name", "") for tc in last_message.tool_calls]
            is_final_guess = any(tc.get("name") == "make_final_guess" for tc in last_message.tool_calls)

        is_guess = is_final_guess or "FINAL_GUESS:" in message_content

        return GameResponse(
            session_id=session_id,
            question=message_content,
            is_guess=is_guess,
            game_over=False,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting game: {str(e)}")


@app.post("/api/answer", response_model=GameResponse)
def submit_answer(request: AnswerRequest):
    """Submit an answer to the current question."""
    session_id = request.session_id
    answer = request.answer.strip()

    # Check if session exists
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found. Please start a new game.")

    # Get current state
    state = sessions[session_id]

    # Check for quit/exit
    if answer.lower() in ["quit", "exit", "q"]:
        del sessions[session_id]
        return GameResponse(
            session_id=session_id,
            question="Thanks for playing! Game ended.",
            is_guess=False,
            game_over=True,
        )

    # Add user's answer to state
    state["messages"].append(HumanMessage(content=answer))
    state["questions_asked"] += 1

    # Invoke the graph with updated state
    try:
        result = akinator_graph.invoke(state)
        sessions[session_id] = result

        # Get the AI's response
        last_message = result["messages"][-1]
        message_content = last_message.content if hasattr(last_message, "content") else ""

        # Check for tool calls
        tool_calls = None
        is_final_guess = False

        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            tool_calls = [tc.get("name", "") for tc in last_message.tool_calls]
            # Check if the LLM made a final guess using the tool
            is_final_guess = any(tc.get("name") == "make_final_guess" for tc in last_message.tool_calls)

        # Check if this is a guess (LLM used make_final_guess tool OR message contains FINAL_GUESS)
        is_guess = is_final_guess or "FINAL_GUESS:" in message_content

        # Increment guesses_made if this is a guess
        if is_guess:
            result["guesses_made"] = result.get("guesses_made", 0) + 1
            sessions[session_id] = result

        # If it's a correct guess, mark game as over
        game_over = False
        if is_guess and answer.lower() in ["yes", "y", "correct", "right"]:
            game_over = True
            del sessions[session_id]
        # Check if max guesses (20) reached
        elif result.get("guesses_made", 0) >= 20:
            game_over = True
            message_content = "I give up! You win! I couldn't guess your character in 20 tries. 🎉"
            del sessions[session_id]

        return GameResponse(
            session_id=session_id,
            question=message_content,
            is_guess=is_guess,
            game_over=game_over,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing answer: {str(e)}")


@app.post("/api/reset")
def reset_game(request: StartGameRequest):
    """Reset a game session."""
    session_id = request.session_id
    if session_id in sessions:
        del sessions[session_id]
    return {"status": "ok", "message": "Session reset"}


@app.get("/api/sessions")
def get_active_sessions():
    """Get count of active sessions (for monitoring)."""
    return {"active_sessions": len(sessions)}




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
