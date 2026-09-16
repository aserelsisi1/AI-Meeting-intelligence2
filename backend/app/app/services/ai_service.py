
import ollama


def generate_summary(transcription):

    prompt = f"""
You are an AI Meeting Intelligence assistant.

Analyze the following meeting transcription:

{transcription}

Provide a professional analysis using exactly these sections:

SUMMARY:
Write a short paragraph explaining what the meeting was about.

KEY POINTS:
- List the most important points discussed.

ACTION ITEMS:
- List tasks that need to be completed.

DECISIONS:
- List important decisions made in the meeting.

Keep the information accurate and do not invent information that
was not mentioned in the transcription.
"""

    response = ollama.chat(
        model="llama3.2:3b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]

