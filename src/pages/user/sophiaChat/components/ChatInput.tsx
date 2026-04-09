// import { useState } from "react";
// import { BsSend } from "react-icons/bs";
// import { ChatAudio } from "./ChatAudio";
// import SophiaLaptop from "@/assets/images/SophiaLaptop.svg";
// import { Textarea } from "@/components/ui/textarea";
// import { Skeleton } from "@/components/ui/skeleton";
// import TextareaAutosize from "react-textarea-autosize";
// const MessageInput = ({ onSubmit, disabled, avatarImg }) => {
//   const [inputValue, setInputValue] = useState("");
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(inputValue);
//     setInputValue("");
//   };
//   const handleKeyPress = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleSubmit(event);
//     }
//   };

//   return (
//     <div className="flex items-center justify-between gap-2.5 px-2 bottom-4 w-full ">
//       <form className="w-full relative pb-2" onSubmit={handleSubmit}>
//         <div className="w-full relative z-50 rounded-full">
//           <TextareaAutosize
//             minRows={1}
//             maxRows={1}
//             style={{
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//             className="border border-white/20 bg-[#0B0D15] text-md block w-[89%] sm:w-[96%] pl-3 pr-6 py-3 rounded-full focus:border-transparent transition duration-300 ease-in-out shadow-xl hover:shadow-lg transform overflow-y-auto resize-none no-scrollbar"
//             placeholder="Ask anything"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={handleKeyPress}
//             disabled={disabled}
//           />

//           <button
//             type="submit"
//             className="absolute inset-y-0 end-0 flex items-center pe-3 pr-16 md:pr-10"
//           >
//             <BsSend
//               style={{
//                 color: inputValue ? "#DB2777" : "inherit", // Pink if inputValue is present
//                 transition: "color 0.3s ease-in-out", // Smooth transition for color change
//               }}
//             />
//           </button>
//         </div>
//       </form>
//       <ChatAudio />
//       <img
//         src="/img/teachers.png"
//         alt={avatarImg ? "Assistant" : "Loading..."}
//         className={`w-full ${avatarImg ? " max-w-xl opacity-50 hidden md:block absolute -z-10 bottom-4 -right-24 lg:-right-56" : "max-w-lg animate-pulse shadow-lg opacity-60 hidden md:block absolute -z-10 bottom-4 -right-24 lg:-right-64"}`}
//       />
//     </div>
//   );
// };
// export default MessageInput;

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { BsSend, BsFillMicFill, BsFillStopCircleFill } from "react-icons/bs";
import { ChatAudio } from "./ChatAudio";
import SophiaLaptop from "@/assets/images/SophiaLaptop.svg";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store";

interface MessageInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSubmit, disabled }) => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
    }
  }, []);

  const startRecording = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSubmit(transcript);
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue("");
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };
  return (
    <div className="flex items-center justify-between gap-2.5 px-2 bottom-4 w-full relative">
      <form className="w-full relative pb-2" onSubmit={handleSubmit}>
        <div className="w-full relative z-50 rounded-full">
          <textarea
            rows={1}
            className="border border-white/20 bg-[#0B0D15] text-md block w-full pl-3 pr-6 py-3 rounded-full focus:border-transparent transition duration-300 ease-in-out shadow-xl hover:shadow-lg transform overflow-hidden resize-none"
            placeholder="Ask anything"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={disabled}
          />

          <button
            type="submit"
            className="absolute inset-y-0 end-0 flex items-center pe-3"
          >
            <BsSend />
          </button>
        </div>
      </form>
      {isSpeechSupported && (
        <Button
          variant="outline"
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center justify-center rounded-full bg-primary mb-2`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          disabled={disabled}
        >
          {isRecording ? (
            <BsFillStopCircleFill size={22} />
          ) : (
            <BsFillMicFill size={22} />
          )}
        </Button>
      )}
      <ChatAudio />
      {/* <img
        src={"/img/teachers.png"}
        className="max-w-xl w-full opacity-50 hidden md:block absolute -z-10 bottom-4 -right-24 lg:-right-56 opacity/90"
        alt="sophia image"
      /> */}
    </div>
  );
};

export default MessageInput;
