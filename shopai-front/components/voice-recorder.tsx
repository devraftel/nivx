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
      <div className="flex h-screen w-full flex-col items-center justify-center bg-transparent">
        <button
          className={`transform rounded-full bg-yellow-800 p-4 text-white transition duration-200 ease-in-out hover:scale-105 focus:outline-none ${
            recorderControls.isRecording ? 'animate-spin' : ''
          }`}
          onClick={recorderControls.isRecording ? stopRecording : recorderControls.startRecording}
        >
          {recorderControls.isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
        </button>
        {recorderControls.isRecording ? (
          <p className="mt-4 text-xl ">
            <AudioLines size={24} />
          </p>
        ) : (
          <p className="mt-4 text-xl text-gray-400">Click the microphone to start recording</p>
        )}
      </div>
    </div>
  );
};
