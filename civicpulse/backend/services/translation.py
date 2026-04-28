from google.cloud import translate_v3 as translate
from config import settings

async def detect_language(text: str) -> str:
    """Use Google Cloud Translation API to detect language. Return BCP-47 code."""
    try:
        client = translate.TranslationServiceClient()
        parent = f"projects/{settings.GOOGLE_CLOUD_PROJECT}/locations/global"
        response = client.detect_language(
            content=text,
            parent=parent,
        )
        return response.languages[0].language_code
    except Exception as e:
        print(f"Translation detect error: {e}")
        return "en" # Fallback

async def translate_to_english(text: str, source_language: str) -> str:
    """Translate text to English using Translation API v3."""
    if source_language.startswith("en"):
        return text
    try:
        client = translate.TranslationServiceClient()
        parent = f"projects/{settings.GOOGLE_CLOUD_PROJECT}/locations/global"
        response = client.translate_text(
            contents=[text],
            target_language_code="en",
            parent=parent,
        )
        return response.translations[0].translated_text
    except Exception as e:
        print(f"Translation to en error: {e}")
        return text

async def translate_for_volunteer(text: str, target_language: str) -> str:
    """Translate activity instructions to volunteer's preferred language."""
    if target_language.startswith("en"):
        return text
    try:
        client = translate.TranslationServiceClient()
        parent = f"projects/{settings.GOOGLE_CLOUD_PROJECT}/locations/global"
        response = client.translate_text(
            contents=[text],
            target_language_code=target_language,
            parent=parent,
        )
        return response.translations[0].translated_text
    except Exception as e:
        print(f"Translation for volunteer error: {e}")
        return text
