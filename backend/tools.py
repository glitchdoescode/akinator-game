"""Tools for the Akinator agent."""

from typing import Optional
from langchain_core.tools import tool
from tavily import TavilyClient
import os


# Initialize Tavily client
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


@tool
def web_search(query: str) -> str:
    """Search the web for information about a character, person, or topic.

    Use this tool to research characters, verify facts, or gather information
    to help narrow down possibilities or confirm a guess.

    Args:
        query: The search query string

    Returns:
        A summary of relevant search results
    """
    try:
        response = tavily_client.search(
            query=query,
            search_depth="basic",
            max_results=3
        )

        # Extract and format results
        results = []
        for result in response.get('results', []):
            results.append(f"- {result.get('title', '')}: {result.get('content', '')}")

        if not results:
            return "No results found."

        return "\n".join(results)
    except Exception as e:
        return f"Search error: {str(e)}"


@tool
def make_final_guess(character_name: str, confidence: str) -> str:
    """Make your final guess when you're confident you know the answer.

    Use this tool ONLY when you believe you have correctly identified who/what the user is thinking of.
    After calling this tool, the user will be asked if your guess is correct.

    Args:
        character_name: The name of the character/person/thing you think it is
        confidence: Your confidence level: "high", "medium", or "low"

    Returns:
        Confirmation that your guess has been registered
    """
    return f"FINAL_GUESS: {character_name} (confidence: {confidence})"


# Export all tools
TOOLS = [web_search, make_final_guess]
