'use client';
import { useGeminiVoiceOutputStore } from './store/gemini-voice-output-store';

export const GeminiVoiceOutput = () => {
  const { voice } = useGeminiVoiceOutputStore();

  if (!voice) return null;

  return (
    <div>
      <h2 className="text-2xl font-medium">{voice}</h2>
    </div>
  );
};
