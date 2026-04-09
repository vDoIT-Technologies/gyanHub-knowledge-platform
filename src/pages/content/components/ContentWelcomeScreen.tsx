import React from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Sparkles, History, BookOpen, Presentation, Lightbulb } from 'lucide-react';

interface ContentWelcomeScreenProps {
  onStartGeneration: () => void;
  onViewHistory: () => void;
  hasHistory: boolean;
}

export const ContentWelcomeScreen: React.FC<ContentWelcomeScreenProps> = ({
  onStartGeneration,
  onViewHistory,
  hasHistory,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto relative overflow-hidden">
      {/* Glassmorphism background effects */}
      <div className="absolute bg-primary/20 blur-3xl -top-16 left-28 w-[26rem] h-[10rem] rounded-full hidden sm:block" />
      <div className="absolute bg-primary/30 blur-3xl -bottom-16 right-16 w-[26rem] h-[10rem] rounded-full hidden sm:block" />
      
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Content Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create comprehensive educational slides on any topic with AI. 
          Perfect for learning, teaching, or presentations!
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 relative z-10">
        {/* Generate Content Card */}
        <Card className="border-2 border-primary/30 bg-muted/10 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer group backdrop-blur-sm"
              onClick={onStartGeneration}>
          <CardContent className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Generate New Content
              </h3>
              <p className="text-muted-foreground text-sm">
                Create structured learning slides with comprehensive explanations on any subject
              </p>
              <Button 
                onClick={onStartGeneration}
                className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Generating
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* View History Card */}
        <Card className={`border-2 transition-all hover:shadow-lg backdrop-blur-sm ${
          hasHistory 
            ? 'border-primary/30 bg-muted/10 hover:border-primary/50 hover:shadow-primary/20 cursor-pointer group' 
            : 'border-muted/20 bg-muted/5 opacity-60'
        }`}
              onClick={hasHistory ? onViewHistory : undefined}>
          <CardContent className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                hasHistory 
                  ? 'bg-primary/20 group-hover:bg-primary/30' 
                  : 'bg-muted/20'
              }`}>
                <History className={`w-8 h-8 ${hasHistory ? 'text-primary' : 'text-muted-foreground/50'}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Content History
              </h3>
              <p className="text-muted-foreground text-sm">
                {hasHistory 
                  ? 'Access your previously generated content and review your learning materials'
                  : 'Generate your first content to start building your library'}
              </p>
              <Button 
                onClick={onViewHistory}
                variant="outline"
                className="w-full mt-2 border-muted/50 hover:bg-muted/20 text-foreground"
                size="lg"
                disabled={!hasHistory}
              >
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 relative z-10">
        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/10 backdrop-blur-sm border border-muted/20">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Structured Learning</h4>
          <p className="text-sm text-muted-foreground">
            Get well-organized slides with clear explanations and key concepts
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/10 backdrop-blur-sm border border-muted/20">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Presentation className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Ready to Present</h4>
          <p className="text-sm text-muted-foreground">
            Content formatted perfectly for teaching or presentations
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/10 backdrop-blur-sm border border-muted/20">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">AI-Powered</h4>
          <p className="text-sm text-muted-foreground">
            Leverage advanced AI to create comprehensive educational content
          </p>
        </div>
      </div>
    </div>
  );
};
