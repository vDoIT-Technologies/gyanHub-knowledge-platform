import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { CheckCircle, XCircle, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MCQQuestion, UserAnswer, QuizResult } from '../../../types/mcq.types';

interface QuestionDisplayProps {
  question: MCQQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswer?: UserAnswer;
  quizResult?: QuizResult;
  showResults: boolean;
  difficulty?: string; // ← top-level difficulty passed from parent
  onAnswerSelect: (questionId: string, optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  userAnswer,
  quizResult,
  showResults,
  difficulty,
  onAnswerSelect,
  onNext,
  onPrevious,
}) => {
  const difficultyStyles: Record<string, string> = {
    Easy:   'bg-green-500/20 text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-400',
    Hard:   'bg-red-500/20 text-red-400',
  };

  return (
    <div className="flex-1 min-w-0 space-y-6">
      <Card className="shadow-lg border-muted/30 bg-secondary/50 backdrop-blur-sm">
        <CardHeader className="pb-6 border-b border-muted/20">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                Question {currentQuestionIndex + 1}
              </span>
              {difficulty && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                    difficultyStyles[difficulty] ?? 'bg-muted/20 text-muted-foreground'
                  }`}
                >
                  {difficulty}
                </span>
              )}
            </div>
            {showResults && quizResult && (
              <div className="flex items-center gap-2 animate-in fade-in duration-300">
                {quizResult.isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-bold text-sm">Correct</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-bold text-sm">Incorrect</span>
                  </>
                )}
              </div>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            {question.question}
          </h2>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = userAnswer?.selectedOptionId === option.id;
              const isCorrect = question.correct_ids.includes(option.id);
              const showCorrectAnswer = showResults && isCorrect;
              const showIncorrectSelection = showResults && isSelected && !isCorrect;

              return (
                <label
                  key={option.id}
                  className={`group flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    showResults
                      ? showCorrectAnswer
                        ? 'bg-green-500/10 border-green-500/30 shadow-sm'
                        : showIncorrectSelection
                        ? 'bg-red-500/10 border-red-500/30 shadow-sm'
                        : 'bg-muted/5 border-muted/20 opacity-70'
                      : isSelected
                      ? 'bg-primary/10 border-primary/40 shadow-sm ring-1 ring-primary/40'
                      : 'bg-muted/10 border-muted/30 hover:border-primary/30 hover:bg-muted/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-center mt-0.5">
                    <div
                      className={`relative flex items-center justify-center w-5 h-5 rounded-full border ${
                        isSelected || showCorrectAnswer
                          ? 'border-current'
                          : 'border-muted-foreground/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => onAnswerSelect(question.id, option.id)}
                        disabled={showResults}
                        className="sr-only"
                      />
                      {(isSelected || showCorrectAnswer) && (
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            showResults && isCorrect
                              ? 'bg-green-400'
                              : showResults && !isCorrect
                              ? 'bg-red-400'
                              : 'bg-primary'
                          }`}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
                          isSelected
                            ? 'bg-primary/30 text-primary'
                            : 'bg-muted/30 text-muted-foreground group-hover:bg-muted/40'
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span
                        className={`text-base leading-relaxed ${
                          isSelected ? 'font-medium text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>
                    {showResults && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-4 flex-shrink-0" />
                    )}
                    {showResults && showIncorrectSelection && (
                      <XCircle className="w-5 h-5 text-red-400 ml-4 flex-shrink-0" />
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          {/* Explanation */}
          {showResults && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 animate-in slide-in-from-bottom-2">
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Explanation
              </h4>
              <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
                {question.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between rounded-xl">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-6 py-6 h-auto text-sm font-medium hover:bg-muted/20 hover:text-foreground border-muted/30 shadow-sm bg-secondary/50 backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Previous</div>
            <div>Question</div>
          </div>
        </Button>

        <Button
          variant="default"
          onClick={onNext}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="flex items-center gap-2 px-6 py-6 h-auto text-sm font-medium shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-primary-foreground/70 uppercase tracking-widest">Next</div>
            <div>Question</div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};