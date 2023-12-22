import { create } from 'zustand';

type VoiceStore = {
  voice: string;
  setVoice: (voice: string) => void;
};

export const useVoiceStore = create<VoiceStore>((set) => ({
  voice: '',
  setVoice: (voice) => set({ voice })
}));
