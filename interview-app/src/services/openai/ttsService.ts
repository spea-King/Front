import { openai } from './client';

export type TtsVoice = 'onyx' | 'echo' | 'nova' | 'alloy';

export function selectVoice(
  gender: 'male' | 'female',
  style: 'friendly' | 'pressure',
  language: 'ko' | 'en'
): TtsVoice {
  // Simple mapping tuned by language to slightly vary timbre
  if (language === 'en') {
    if (gender === 'male') return style === 'friendly' ? 'alloy' : 'echo';
    return style === 'friendly' ? 'nova' : 'alloy';
  }
  // Korean default mapping
  if (gender === 'male') return style === 'friendly' ? 'onyx' : 'echo';
  return style === 'friendly' ? 'nova' : 'alloy';
}

export async function generateTTS(
  text: string,
  voice: TtsVoice,
): Promise<Blob> {
  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice,
    input: text,
  });

  const arrayBuffer = await response.arrayBuffer();
  return new Blob([arrayBuffer], { type: 'audio/mpeg' });
}
