import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardHeader, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import type { Slide } from '../../../types/content.types';
import { SlideAudioPlayer } from './SlideAudioPlayer';

interface SlideDisplayProps {
  slide: Slide;
  currentSlideIndex: number;
  totalSlides: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const SlideDisplay: React.FC<SlideDisplayProps> = ({
  slide,
  currentSlideIndex,
  totalSlides,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="flex-1 min-w-0 space-y-6">
      <Card className="shadow-lg border-muted/30 bg-secondary/50 backdrop-blur-sm">
        <CardHeader className="pb-6 border-b border-muted/20">

          {/* Top row: slide badge + audio player */}
          <div className="flex items-center justify-between mb-4 gap-4">
            {/* Left: slide counter */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
            </div>

            {/* Right: audio player — compact inline version */}
            <div className="flex-1 max-w-xs sm:max-w-sm">
              <SlideAudioPlayer
                audioBase64={slide.audioBase64 ?? null}
                slideTitle={slide.title}
                compact
              />
            </div>
          </div>

          {/* Slide title */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {slide.title}
          </h2>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="prose prose-invert max-w-none
            prose-p:text-foreground/80 prose-p:leading-relaxed
            prose-headings:text-foreground prose-headings:font-bold
            prose-li:text-foreground/80
            prose-strong:text-primary
            prose-code:text-accent-foreground prose-code:bg-muted/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-muted/20 prose-pre:border prose-pre:border-muted/30
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {slide.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between rounded-xl">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-2 px-6 py-6 h-auto text-sm font-medium hover:bg-muted/20 hover:text-foreground border-muted/30 shadow-sm bg-secondary/50 backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Previous</div>
            <div>Slide</div>
          </div>
        </Button>

        <Button
          variant="default"
          onClick={onNext}
          disabled={currentSlideIndex === totalSlides - 1}
          className="flex items-center gap-2 px-6 py-6 h-auto text-sm font-medium shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-primary-foreground/70 uppercase tracking-widest">Next</div>
            <div>Slide</div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};