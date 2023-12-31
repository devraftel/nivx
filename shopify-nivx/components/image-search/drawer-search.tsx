'use client'
import * as React from "react"
import { ImageIcon } from "lucide-react"

import { Button } from "components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "components/ui/drawer"
import { FindImageForm } from "./image-form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip"
export function DrawerImageSearch() {

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger> */}
              <button
                className={`transform rounded-full bg-black/45 dark:bg-gray-100/30 p-4 text-gray-100 transition duration-200 ease-in-out hover:scale-105  hover:bg-slate-700/55 dark:hover:bg-slate-100/40 focus:outline-none `}
              >
                <ImageIcon size={24} />
              </button>
            {/* </TooltipTrigger>
            <TooltipContent>
              <p>Image Search</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Upload Product Image (png format)</DrawerTitle>
            <DrawerDescription>Find product using Images.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <FindImageForm />
            </div>
          </div>
          <DrawerFooter className="pt-1 mt-1">
            {/* <Button>Image Search</Button> */}
            <DrawerClose asChild>
              <Button variant="outline" size={'sm'}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}


// import { Mic, StopCircle, AudioLines } from 'lucide-react';
// import { useAudioRecorder } from 'react-audio-voice-recorder';
// import { useProductsStore } from '../store/products-array';
// import { useVoiceStore } from '../store/voice-response';

// export const ImageSearch = () => {
//   const recorderControls = useAudioRecorder();
//   const { setProducts } = useProductsStore();
//   const { setVoice } = useVoiceStore();

//   const stopRecording = async () => {
//     recorderControls.stopRecording();
//     recorderControls.mediaRecorder?.addEventListener('dataavailable', async (e) => {
//       const blob = e.data;
//       console.log(blob);

//       try {
//         const response = await fetch('/api/openai', {
//           method: 'POST',
//           body: blob,
//           headers: {
//             'Content-Type': 'audio/mp3'
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         console.log(data);

//         if (data) {
//           const newRes = await fetch('/api/fun', {
//             method: 'POST',
//             body: JSON.stringify({ prompt: data })
//           });

//           if (!newRes.ok) {
//             console.error('Network response was not ok');
//           }

//           const newData = await newRes.json();

//           console.log('new DATQ', newData);

//           setProducts(newData.products);
//           setVoice(newData.response);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     });
//   };

//   return (
//     <div>
//       <div className="flex flex-col items-center">
//         {recorderControls.isRecording && (
//           <p className="mb-4 text-xl ">
//             <AudioLines size={24} />
//           </p>
//         )}
//         <button
//           className={`transform rounded-full bg-gray-100/30 p-4 text-gray-100 transition duration-200 ease-in-out hover:scale-105 hover:bg-slate-100/50 focus:outline-none ${
//             recorderControls.isRecording ? 'animate-spin' : ''
//           }`}
//           onClick={recorderControls.isRecording ? stopRecording : recorderControls.startRecording}
//         >
//           {recorderControls.isRecording ? <StopCircle size={24} color="red" /> : <Mic size={24} />}
//         </button>
//       </div>
//     </div>
//   );
// };
