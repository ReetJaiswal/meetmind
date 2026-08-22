from faster_whisper import WhisperModel

class TranscriptionService:
    def __init__(self):
        self.model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

    def transcribe(self, audio_path: str):

        segments, info = self.model.transcribe(
            audio_path,
            beam_size=5
        )

        transcript_segments = []
        full_text = []

        for segment in segments:
            text = segment.text.strip()

            if not text:
                continue

            transcript_segments.append({
                "start": round(segment.start, 2),
                "end": round(segment.end, 2),
                "text": text
            })

            full_text.append(text)

        return {
            "language": info.language,
            "language_probability": round(
                info.language_probability,
                3
            ),
            "text": " ".join(full_text),
            "segments": transcript_segments
        }
transcription_service = TranscriptionService()