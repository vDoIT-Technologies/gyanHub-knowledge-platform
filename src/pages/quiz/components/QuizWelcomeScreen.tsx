import React from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Sparkles, History, Brain, Trophy, Clock, Target } from 'lucide-react';

interface QuizWelcomeScreenProps {
  onStartQuiz: () => void;
  onViewHistory: () => void;
  hasHistory: boolean;
}

export const QuizWelcomeScreen: React.FC<QuizWelcomeScreenProps> = ({
  onStartQuiz,
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
          Quiz Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Test your knowledge with AI-generated quizzes on any topic. 
          Choose your difficulty, set the number of questions, and start learning!
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 relative z-10">
        {/* Generate Quiz Card */}
        <Card className="border-2 border-primary/30 bg-muted/10 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer group backdrop-blur-sm"
              onClick={onStartQuiz}>
          <CardContent className="p-5 sm:p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Generate New Quiz
              </h3>
              <p className="text-muted-foreground text-sm">
                Create a custom quiz on any topic with adjustable difficulty and question count
              </p>
              <Button 
                onClick={onStartQuiz}
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
                Quiz History
              </h3>
              <p className="text-muted-foreground text-sm">
                {hasHistory 
                  ? 'Review your past quizzes and track your progress over time'
                  : 'Complete your first quiz to start building your history'}
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
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Custom Topics</h4>
          <p className="text-sm text-muted-foreground">
            Generate quizzes on any subject you want to learn
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/10 backdrop-blur-sm border border-muted/20">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Track Progress</h4>
          <p className="text-sm text-muted-foreground">
            Monitor your scores and improvement over time
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-muted/10 backdrop-blur-sm border border-muted/20">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Instant Results</h4>
          <p className="text-sm text-muted-foreground">
            Get immediate feedback with detailed explanations
          </p>
        </div>
      </div>
    </div>
  );
};
