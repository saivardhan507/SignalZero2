#!/usr/bin/env python3
import sys
import json
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage

EMERGENT_KEY = "sk-emergent-dD305B76791E0CcC5B"

async def main():
    try:
        data = json.load(sys.stdin)
        message = data.get("message", "")
        session_id = data.get("session_id", "default")
        system_message = data.get("system_message", "You are a helpful assistant.")
        history = data.get("history", [])

        # Build system message with conversation history for context
        full_system = system_message
        if history:
            full_system += "\n\n--- Conversation History ---\n"
            for msg in history:
                role = "User" if msg["role"] == "user" else "Assistant"
                full_system += f"{role}: {msg['message']}\n"
            full_system += "--- End History ---\n\nRespond to the user's latest message above, considering the conversation history."

        chat = LlmChat(
            api_key=EMERGENT_KEY,
            session_id=session_id,
            system_message=full_system,
        ).with_model("gemini", "gemini-2.5-flash")

        user_msg = UserMessage(text=message)
        response = await chat.send_message(user_msg)

        json.dump({"success": True, "response": response}, sys.stdout)
    except Exception as e:
        json.dump({"success": False, "error": str(e)}, sys.stdout)

asyncio.run(main())
