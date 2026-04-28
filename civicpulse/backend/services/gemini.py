import google.generativeai as genai
from config import settings
import json
import typing

genai.configure(api_key=settings.GEMINI_API_KEY)

class GeminiPipeline:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-pro')
        self.vision_model = genai.GenerativeModel('gemini-1.5-pro')

    def _build_extraction_prompt(self, activity_type: str) -> str:
        """
        Returns the exact Gemini prompt for extraction.
        """
        return f"""
You are a field data extraction assistant for an NGO coordination platform.
Extract structured information from the following {activity_type} report.

Return ONLY a valid JSON object with this exact structure:
{{
  "demographics": {{"elderly": 0, "children": 0, "adults": 0, "total": 0}},
  "needs": [{{"category": "WASH|SHELTER|FOOD|MEDICAL|EDUCATION", "item": "string", "quantity": 0}}],
  "urgencyScore": 1-10,
  "peopleAffected": 0,
  "location": "string description",
  "summary": "2 sentence summary in English",
  "skillsNeeded": ["string"],
  "confidence": 0.0
}}

Rules:
- urgencyScore 8-10 = life threatening, 5-7 = serious, 1-4 = non-urgent
- Return ONLY the JSON object. No markdown, no explanation.
- If information is missing, use 0 or empty array.
"""

    async def process_text_report(self, text: str, activity_type: str, language: str) -> dict:
        try:
            prompt = self._build_extraction_prompt(activity_type) + f"\n\nReport content:\n{text}"
            response = self.model.generate_content(prompt)
            text_resp = response.text
            
            # Remove markdown code blocks if present
            if "```json" in text_resp:
                text_resp = text_resp.split("```json")[1].split("```")[0]
            elif "```" in text_resp:
                text_resp = text_resp.split("```")[1].split("```")[0]
                
            return json.loads(text_resp.strip())
        except Exception as e:
            print(f"Gemini processing error: {e}")
            # Return a basic structure so the pipeline doesn't crash
            return {
                "demographics": {"elderly": 0, "children": 0, "adults": 0, "total": 0},
                "needs": [],
                "urgencyScore": 5,
                "peopleAffected": 0,
                "location": "Unknown",
                "summary": "Error processing report content.",
                "skillsNeeded": [],
                "confidence": 0.0
            }


    async def process_image_report(self, image_bytes: bytes, activity_type: str) -> dict:
        """
        1. Send image + extraction prompt to Gemini Vision
        2. Extract structured data
        """
        prompt = self._build_extraction_prompt(activity_type)
        image_parts = [
            {
                "mime_type": "image/jpeg",
                "data": image_bytes
            }
        ]
        response = self.vision_model.generate_content([prompt, image_parts[0]])
        text_resp = response.text
        if text_resp.startswith("```json"):
            text_resp = text_resp[7:-3]
        return json.loads(text_resp.strip())

    async def generate_dashboard_insights(self, activities: list) -> dict:
        """
        Send all NGO activities to Gemini.
        """
        activities_str = json.dumps(activities, default=str)
        prompt = f"""
        Analyze these NGO activities and return ONLY a valid JSON object with:
        {{
            "recommended_charts": ["list of chart configs"],
            "key_insights": ["list of insight strings"],
            "top_needs_by_category": {{"category": count}},
            "geographic_hotspots": ["list of locations"]
        }}
        Activities: {activities_str}
        """
        response = self.model.generate_content(prompt)
        text_resp = response.text
        if text_resp.startswith("```json"):
            text_resp = text_resp[7:-3]
        return json.loads(text_resp.strip())

gemini_pipeline = GeminiPipeline()
