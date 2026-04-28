from google.cloud import speech_v2 as speech
from config import settings

async def transcribe_audio(audio_bytes: bytes, language_code: str = "en-US") -> str:
    """
    1. Send audio to Google Cloud Speech-to-Text
    2. Get transcription
    """
    try:
        client = speech.SpeechClient()
        config = speech.RecognitionConfig(
            auto_decoding_config=speech.AutoDetectDecodingConfig(),
            language_codes=[language_code, "en-US", "hi-IN"],
            model="latest_long",
        )
        request = speech.RecognizeRequest(
            recognizer=f"projects/{settings.GOOGLE_CLOUD_PROJECT}/locations/global/recognizers/_",
            config=config,
            content=audio_bytes,
        )
        response = client.recognize(request=request)
        if not response.results:
            return ""
        return response.results[0].alternatives[0].transcript
    except Exception as e:
        print(f"Speech transcription error: {e}")
        return ""
