from faster_whisper import WhisperModel
class TranscriptionService:
    def __init__(self):
        """
        Initialize the Whisper model.
        We use the 'base' model because it provides a good
        balance between transcription quality and local performance.
        """

        self.model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8"
        )

    def transcribe(self, audio_path: str):
        """
        Transcribe an audio file.

        Returns:
            dict containing the full transcript and timestamped segments.
        """

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
            "language_probability": round(info.language_probability, 3),
            "text": " ".join(full_text),
            "segments": transcript_segments
        }