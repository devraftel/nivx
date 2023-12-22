'use client';
import { Mic, StopCircle, AudioLines } from 'lucide-react';
import { useAudioRecorder } from 'react-audio-voice-recorder';

export const VoiceRecorder = () => {
  const recorderControls = useAudioRecorder();

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
          className={`transform rounded-full bg-gray-100/30 p-4 text-gray-100 transition duration-200 ease-in-out hover:scale-105 hover:bg-slate-100/50 focus:outline-none ${
            recorderControls.isRecording ? 'animate-spin' : ''
          }`}
          onClick={recorderControls.isRecording ? stopRecording : recorderControls.startRecording}
        >
          {recorderControls.isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
        </button>
      </div>
    </div>
  );
};
