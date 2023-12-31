'use client';
import { Mic, StopCircle, AudioLines } from 'lucide-react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { useSearchedProductsStore } from './store/searched-product-store';
import { useGeminiVoiceOutputStore } from './store/gemini-voice-output-store';

export const VoiceRecorder = () => {
  const recorderControls = useAudioRecorder();
  const { setProducts } = useSearchedProductsStore();
  const { setVoice } = useGeminiVoiceOutputStore();

  const stopRecording = async () => {
    recorderControls.stopRecording();
    recorderControls.mediaRecorder?.addEventListener('dataavailable', async (e) => {
      const blob = e.data;
      console.log(blob);

      try {
        const response = await fetch('/api/openai', {
          method: 'POST',
          body: blob,
          headers: {
            'Content-Type': 'audio/mp3'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

        if (data) {
          const newRes = await fetch('/api/fun', {
            method: 'POST',
            body: JSON.stringify({ prompt: data })
          });

          if (!newRes.ok) {
            console.error('Network response was not ok');
          }

          const newData = await newRes.json();

          console.log('new DATQ', newData);

          setProducts(newData.products);
          setVoice(newData.response);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        {recorderControls.isRecording && (
          <p className="mb-4 text-xl ">
            <AudioLines size={24} />
          </p>
        )}
        <button
          className={`bg-black/45 hover:bg-slate-700/55 transform rounded-full p-4 text-gray-100 transition duration-200 ease-in-out hover:scale-105 focus:outline-none dark:bg-gray-100/30 dark:hover:bg-slate-100/50 ${
            recorderControls.isRecording ? 'animate-spin' : ''
          }`}
          onClick={recorderControls.isRecording ? stopRecording : recorderControls.startRecording}
        >
          {recorderControls.isRecording ? <StopCircle size={24} color="red" /> : <Mic size={24} />}
        </button>
      </div>
    </div>
  );
};
