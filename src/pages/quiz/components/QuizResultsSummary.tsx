import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Trophy, RefreshCcw } from 'lucide-react';

interface QuizResultsSummaryProps {
  scorePercentage: number;
  correctCount: number;
  totalCount: number;
  onReset: () => void;
}

export const QuizResultsSummary: React.FC<QuizResultsSummaryProps> = ({
  scorePercentage,
  correctCount,
  totalCount,
  onReset,
}) => {
  return (
    <Card className="mb-8 border-muted/30 shadow-lg bg-secondary/50 backdrop-blur-sm overflow-hidden relative">
      <div className={`absolute top-0 left-0 w-full h-1 ${
          scorePercentage >= 80 ? 'bg-green-400' :
          scorePercentage >= 60 ? 'bg-yellow-400' :
          'bg-red-400'
      }`}></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg flex-shrink-0 ${
                scorePercentage >= 60 ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted-foreground'
            }`}>
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-lg sm:text-xl text-foreground">Quiz Complete!</span>
          </div>
          <div className="flex items-baseline gap-1">
             <span className={`text-2xl sm:text-3xl font-bold ${
                 scorePercentage >= 80 ? 'text-green-400' :
                 scorePercentage >= 60 ? 'text-yellow-400' :
                 'text-red-400'
             }`}>
                {scorePercentage}%
             </span>
             <span className="text-muted-foreground/70 text-sm font-medium">Score</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-2">
          <div className="text-left">
            <p className="text-muted-foreground text-lg">
              You answered <span className="font-bold text-foreground">{correctCount}</span> out of <span className="font-bold text-foreground">{totalCount}</span> questions correctly.
            </p>
            <p className="text-muted-foreground/70 text-sm mt-1">
                {scorePercentage >= 80 ? 'Excellent work! You have a strong grasp of this topic.' :
                 scorePercentage >= 60 ? 'Good job! There is still some room for improvement.' :
                 'Keep practicing! Review the explanations to understand better.'}
            </p>
          </div>
          <Button onClick={onReset} variant="outline" className="shrink-0 gap-2 border-muted/30 hover:bg-muted/20 hover:text-foreground transition-colors">
            <RefreshCcw className="w-4 h-4" />
            New Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
