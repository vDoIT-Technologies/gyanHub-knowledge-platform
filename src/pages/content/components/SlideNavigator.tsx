import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Map, RotateCcw } from 'lucide-react';
import type { Slide } from '../../../types/content.types';

interface SlideNavigatorProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onReset: () => void;
}

export const SlideNavigator: React.FC<SlideNavigatorProps> = ({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onReset,
}) => {
  return (
    <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
      <Card className="sticky top-4 shadow-lg border-muted/30 bg-secondary/50 backdrop-blur-sm">
        <CardHeader className="pb-4 bg-muted/10 border-b border-muted/20">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <Map className="w-4 h-4" />
            Slide Navigator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Slide Grid */}
          <div className="space-y-2">
            {slides.map((slide, index) => {
              const isActive = index === currentSlideIndex;

              return (
                <Button
                  key={slide.id}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => onSelectSlide(index)}
                  className={`w-full justify-start text-left h-auto py-3 px-4 transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' 
                      : 'hover:bg-muted/20 text-foreground border-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted/30 text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium line-clamp-2">
                      {slide.title}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Progress Info */}
          <div className="bg-muted/10 rounded-lg p-4 space-y-2 border border-muted/20">
            <div className="flex justify-between items-center text-sm font-medium text-foreground">
              <span>Progress</span>
              <span>{currentSlideIndex + 1} / {slides.length}</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={onReset}
              variant="outline"
              className="w-full border-primary/30 text-primary hover:bg-primary/10"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
