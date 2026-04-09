import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Map, CheckCircle, XCircle } from 'lucide-react';
import type { MCQQuestion, UserAnswer, QuizResult } from '../../../types/mcq.types';

interface QuestionNavigatorProps {
  questions: MCQQuestion[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  quizResults: QuizResult[];
  showResults: boolean;
  onSelectQuestion: (index: number) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  quizResults,
  showResults,
  onSelectQuestion,
  onSubmit,
  onReset,
}) => {
  const getQuestionStatus = (index: number) => {
    const question = questions[index];
    const hasAnswer = userAnswers.some((answer) => answer.questionId === question.id);
    const result = quizResults.find((result) => result.questionId === question.id);

    if (showResults && result) {
      return result.isCorrect ? 'correct' : 'incorrect';
    }

    return hasAnswer ? 'answered' : 'unanswered';
  };

  const getScorePercentage = () => {
    if (quizResults.length === 0) return 0;
    const correctAnswers = quizResults.filter((result) => result.isCorrect).length;
    return Math.round((correctAnswers / quizResults.length) * 100);
  };

  return (
    <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
      <Card className="sticky top-4 shadow-lg border-muted/30 bg-secondary/50 backdrop-blur-sm">
        <CardHeader className="pb-4 bg-muted/10 border-b border-muted/20">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <Map className="w-4 h-4" />
            Navigator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Question Grid */}
          <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-5 gap-2 lg:gap-2.5">
            {questions.map((_, index) => {
              const status = getQuestionStatus(index);
              const isActive = index === currentQuestionIndex;

              return (
                <Button
                  key={index}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSelectQuestion(index)}
                  className={`relative h-10 w-full p-0 text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' 
                      : status === 'correct' 
                      ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                      : status === 'incorrect' 
                      ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30'
                      : status === 'answered' 
                      ? 'bg-primary/20 border-primary/30 text-primary hover:bg-primary/30'
                      : 'hover:bg-muted/20 text-muted-foreground border-muted/30'
                  }`}
                >
                  {index + 1}
                  {status === 'answered' && !showResults && !isActive && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full"></div>
                  )}
                  {status === 'correct' && (
                    <CheckCircle className="absolute -top-1 -right-1 w-3.5 h-3.5 text-green-400 bg-background rounded-full" />
                  )}
                  {status === 'incorrect' && (
                    <XCircle className="absolute -top-1 -right-1 w-3.5 h-3.5 text-red-400 bg-background rounded-full" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Progress Info */}
          <div className="bg-muted/10 rounded-lg p-4 space-y-2 border border-muted/20">
            <div className="flex justify-between items-center text-sm font-medium text-foreground">
              <span>Progress</span>
              <span>{userAnswers.length} / {questions.length}</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(userAnswers.length / questions.length) * 100}%` }}
              ></div>
            </div>
            {showResults && (
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-muted/20">
                <span className="text-sm font-medium text-muted-foreground">Final Score</span>
                <span className={`font-bold ${
                   getScorePercentage() >= 60 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {getScorePercentage()}%
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!showResults && (
              <Button
                onClick={onSubmit}
                disabled={userAnswers.length !== questions.length}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                size="lg"
              >
                Submit Quiz
              </Button>
            )}

            {showResults && (
              <Button
                onClick={onReset}
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/10"
                size="lg"
              >
                Start New Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
