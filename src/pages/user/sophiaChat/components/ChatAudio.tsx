import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const isApple = (): boolean => {
  const userAgent = navigator.userAgent || "";
  const isIOSDevice = [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod",
  ].includes(userAgent);
  const isMacBook = userAgent.includes("Mac");
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  return isIOSDevice || (isMacBook && isSafari);
};

export const ChatAudio: React.FC = () => {
  const { audio, setAudio } = useChatStore();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const [isAudioUrlReady, setIsAudioUrlReady] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "true" || params.get("select") === "true") {
      setAudio(null);
      setIsAudioUrlReady(false);
      setIsAudioPlaying(false);
      setAudioBlobUrl("");
    }
  }, [location.search]);
  useEffect(() => {
    if (audio) {
      if (audio instanceof Blob) {
        const audioObjectURL = URL.createObjectURL(audio);
        setAudioBlobUrl(audioObjectURL);
        setIsAudioUrlReady(true);

        return () => URL.revokeObjectURL(audioObjectURL);
      } else {
        console.error("Expected audio to be a Blob but received:", audio);
      }
    } else {
      setAudioBlobUrl("");
      setIsAudioUrlReady(false);
    }
  }, [audio]);

  const handlePlay = useCallback(async () => {
    if (!audioRef.current || !isAudioUrlReady) return;

    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume();
    }
    audioRef.current.play();
    setIsAudioPlaying(true);
  }, [isAudioUrlReady]);

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
    }

    if (audioRef.current && !sourceRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);
  useEffect(() => {
    setIsAudioUrlReady(false);
    setIsAudioPlaying(false);
  }, []);

  useEffect(() => {
    if (!isApple() && isAudioUrlReady && audioBlobUrl) {
      handlePlay();
    }
  }, [audioBlobUrl, handlePlay, isAudioUrlReady]);

  useEffect(() => {
    if (isAudioPlaying && canvasRef.current && analyserRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawWaveform = () => {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#2B0A1E"); // Dark Maroon
        gradient.addColorStop(0.33, "#4C1F3D"); // Deep Plum
        gradient.addColorStop(0.66, "#5B2845"); // Dark Rose
        gradient.addColorStop(1, "#1F0B14"); // Very Dark Purple

        ctx.fillStyle = gradient;

        const barWidth = (canvas.width / bufferLength) * 12;
        const centerY = canvas.height / 2;
        const borderRadius = 3;

        dataArray.forEach((item, i) => {
          const barHeight = (item / 2.5) * 0.8;
          const x = i * (barWidth + 4);

          ctx.beginPath();
          ctx.moveTo(x + borderRadius, centerY - barHeight / 2);
          ctx.lineTo(x + barWidth - borderRadius, centerY - barHeight / 2);
          ctx.quadraticCurveTo(
            x + barWidth,
            centerY - barHeight / 2,
            x + barWidth,
            centerY - barHeight / 2 + borderRadius
          );
          ctx.lineTo(x + barWidth, centerY + barHeight / 2 - borderRadius);
          ctx.quadraticCurveTo(
            x + barWidth,
            centerY + barHeight / 2,
            x + barWidth - borderRadius,
            centerY + barHeight / 2
          );
          ctx.lineTo(x + borderRadius, centerY + barHeight / 2);
          ctx.quadraticCurveTo(
            x,
            centerY + barHeight / 2,
            x,
            centerY + barHeight / 2 - borderRadius
          );
          ctx.lineTo(x, centerY - barHeight / 2 + borderRadius);
          ctx.quadraticCurveTo(
            x,
            centerY - barHeight / 2,
            x + borderRadius,
            centerY - barHeight / 2
          );
          ctx.closePath();
          ctx.fill();
        });

        requestAnimationFrame(drawWaveform);
      };

      drawWaveform();
    }
  }, [isAudioPlaying]);

  return (
    <div className="flex flex-col items-center ">
      <audio ref={audioRef} src={audioBlobUrl} onEnded={handleStop} />
      <div className="flex items-center justify-end w-full gap-2 mb-0 pb-2 md:py-0 md:mb-2 relative">
        <Button
          onClick={isAudioPlaying ? handlePause : handlePlay}
          disabled={!isAudioUrlReady}
          className="rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0 z-10"
          size="icon"
          variant="ghost"
        >
          {isAudioPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </Button>
        <Button
          onClick={handleMuteToggle}
          size="icon"
          disabled={!isAudioUrlReady}
          className="rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0 mr-2 z-10"
          variant="ghost"
        >
          {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
        </Button>

        {isAudioPlaying && (
          <canvas
            ref={canvasRef}
            className="absolute top-0 bottom-0 left-0 right-12 h-full w-full pointer-events-none opacity-50 z-0"
            style={{
              filter: "drop-shadow(0px 0px 4px rgba(219, 39, 119, 0.5))",
            }}
          />
        )}
      </div>
    </div>
  );
};
