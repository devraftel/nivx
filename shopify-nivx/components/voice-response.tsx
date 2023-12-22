'use client';
import { useVoiceStore } from './store/voice-response';

export const VoiceResponse = () => {
  const { voice } = useVoiceStore();

  if (!voice) return null;

  return (
    <div>
      <h2 className="text-2xl font-medium">{voice}</h2>
    </div>
  );
};
