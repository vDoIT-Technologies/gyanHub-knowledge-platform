import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SlideAudioPlayerProps {
  audioBase64: string | null;
  slideTitle: string;
  compact?: boolean; // true = slim header version, false = full version
}

export const SlideAudioPlayer: React.FC<SlideAudioPlayerProps> = ({
  audioBase64,
  slideTitle,
  compact = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Build object URL from base64 whenever the slide changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    if (!audioBase64) {
      setAudioUrl(null);
      return;
    }

    const byteChars = atob(audioBase64);
    const byteNums = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNums[i] = byteChars.charCodeAt(i);
    }
    const blob = new Blob([byteNums], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [audioBase64]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    audio.src = audioUrl;
    audio.load();

    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
    audio.play();
    setIsPlaying(true);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const seekTime = (value[0] / 100) * duration;
    audio.currentTime = seekTime;
    setProgress(value[0]);
    setCurrentTime(seekTime);
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── No audio available ────────────────────────────────────────────────────
  if (!audioBase64) {
    if (compact) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/10 border border-muted/20 text-muted-foreground/40 text-xs select-none">
          <Headphones className="w-3.5 h-3.5" />
          <span>No audio</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/10 border border-muted/20 text-muted-foreground/50 text-sm">
        <Volume2 className="w-4 h-4" />
        <span>Audio not available for this slide</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full 
        bg-white/5 border border-white/10 backdrop-blur-sm">
  
        <audio ref={audioRef} preload="metadata" className="hidden" />
  
        {/* Play */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-7 h-7 rounded-full 
          bg-primary text-white hover:opacity-90 transition"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 ml-0.5" />
          )}
        </button>
  
        {/* Progress */}
        <Slider
          value={[progress]}
          min={0}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          className="flex-1 h-1.5"
        />
  
        {/* Time */}
        <span className="text-[11px] text-muted-foreground w-20 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
  
        {/* Volume */}
        <button
          onClick={toggleMute}
          className="p-1 rounded-full hover:bg-white/10 transition"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
    );
  }
  // ── FULL mode — standalone block ──────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm">
      <audio ref={audioRef} preload="metadata" className="hidden" />

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={togglePlay}
          className="h-9 w-9 p-0 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </Button>

        <div className="flex-1 flex flex-col gap-1">
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="h-1.5 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60 select-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Button size="sm" variant="ghost" onClick={handleRestart}
          className="h-8 w-8 p-0 rounded-full hover:bg-muted/20 text-muted-foreground">
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>

        <Button size="sm" variant="ghost" onClick={toggleMute}
          className="h-8 w-8 p-0 rounded-full hover:bg-muted/20 text-muted-foreground">
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground/50 truncate pl-0.5">
        🎧 {slideTitle}
      </p>
    </div>
  );
};