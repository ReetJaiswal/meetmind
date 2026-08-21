import json
import httpx

class LLMService:
    """
    Service responsible for communicating with the local Ollama server.
    """

    def __init__(
        self,
        model: str = "qwen3:4b",
        ollama_url: str = "http://localhost:11434"
    ):
        self.model = model
        self.ollama_url = ollama_url

    async def analyze_meeting(self, transcript: str):
        """
        Analyze a meeting transcript using the local Ollama LLM.

        Returns structured meeting insights.
        """

        prompt = f"""
You are MeetMind, an AI meeting intelligence assistant.

Analyze the following meeting transcript.

Your task is to extract:

1. An executive summary
2. Key decisions
3. Action items
4. Topics discussed

For every action item, extract:
- task
- owner
- deadline
- priority

IMPORTANT RULES:

- Do not invent information.
- Only assign an owner if the transcript explicitly identifies the person.
- If no owner is mentioned, use "Unassigned".
- If no deadline is mentioned, use null.
- Do not treat suggestions as confirmed decisions.
- Action items must represent concrete tasks.
- Keep the summary concise but informative.
- Preserve important technical terminology.
- Return ONLY valid JSON.

Expected JSON structure:

{{
    "summary": "string",

    "key_decisions": [
        "decision 1",
        "decision 2"
    ],

    "action_items": [
        {{
            "task": "string",
            "owner": "string",
            "deadline": "string or null",
            "priority": "high, medium, or low"
        }}
    ],

    "topics": [
        "topic 1",
        "topic 2"
    ]
}}

MEETING TRANSCRIPT:

{transcript}
"""

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a precise meeting analysis assistant. "
                        "Return valid JSON only."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": False,
            "format": "json",
            "think": False
        }

        async with httpx.AsyncClient(timeout=300.0) as client:

            response = await client.post(
                f"{self.ollama_url}/api/chat",
                json=payload
            )

            response.raise_for_status()

            data = response.json()

        content = data["message"]["content"]

        try:
            return json.loads(content)

        except json.JSONDecodeError as error:

            raise ValueError(
                f"Ollama returned invalid JSON: {content}"
            ) from error