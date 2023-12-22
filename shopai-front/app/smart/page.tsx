import Image from 'next/image';
import avatar from '../../avatar_sf.png';
import { ImageIcon, MessageSquareText } from 'lucide-react';
import { VoiceRecorder } from 'components/voice-recorder';
import { Carousel } from 'components/carousel';

const LandingUI = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-2 py-4 sm:px-4 md:px-8 md:py-8">
      <div className="grid w-full grid-cols-5 gap-2 sm:gap-4 md:gap-6">
        <div className="col-span-3 flex flex-col items-center justify-center">
          <Carousel />
        </div>

        <div className="col-span-2 flex w-fit flex-col items-center rounded-2xl border bg-gray-100/10 p-2 shadow-md md:p-6">
          <div className="flex items-center px-2">
            <div className="flex flex-col items-center space-y-4">
              <VoiceRecorder />
              <button
                className={`transform rounded-full bg-gray-100/30 p-4 text-gray-100 transition duration-200 ease-in-out hover:scale-105 hover:bg-slate-100/50 focus:outline-none `}
              >
                <ImageIcon size={24} />
              </button>
              <button
                className={`transform rounded-full bg-gray-100/30 p-4 text-gray-100 transition duration-200 ease-in-out hover:scale-105 hover:bg-slate-100/50 focus:outline-none `}
              >
                <MessageSquareText size={24} />
              </button>
            </div>

            <div className="flex h-full flex-col items-center space-y-4 md:space-y-6">
              <Image src={avatar} alt="Picture of the author" width={180} height={300} />
              <h2 className="text-2xl font-semibold md:text-3xl">Digital Sales Assistant</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingUI;
