import { openai } from './client';

interface TranscribeOptions {
  prompt?: string;
  language?: string;
}

export async function transcribeAudio(
  audioBlob: Blob,
  opts: TranscribeOptions = {}
): Promise<string> {
  const file = new File([audioBlob], 'recording.webm', {
    type: audioBlob.type || 'audio/webm',
  });

  try {
    const transcription = await openai.audio.transcriptions.create({
      model: 'gpt-4o-mini-transcribe',
      file,
      language: opts.language ?? 'ko',
      prompt: opts.prompt,
      temperature: 0,
    });
    return transcription.text;
  } catch {
    // Fallback to whisper-1 when mini-transcribe is unavailable or errors
    const fallback = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file,
      language: opts.language ?? 'ko',
      prompt: opts.prompt,
      temperature: 0,
    });
    return fallback.text;
  }
}
