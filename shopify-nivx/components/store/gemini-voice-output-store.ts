import { create } from 'zustand';

type VoiceOutputStore = {
  voice: string;
  // eslint-disable-next-line no-unused-vars
  setVoice: (voice: string) => void;
};

export const useGeminiVoiceOutputStore = create<VoiceOutputStore>((set) => ({
  voice: '',
  setVoice: (voice) => set({ voice })
}));
