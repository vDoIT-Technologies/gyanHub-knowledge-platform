import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  PanelLeftClose,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';
import { useAllTestsMetadata, useTestById } from '@/hooks/useMCQ';
import { useMCQStore } from '@/store';
import type { QuizHistory } from '@/types/mcq.types';

interface QuizHistorySidebarProps {
  onSelectQuiz: (quiz: QuizHistory) => void;
  currentQuiz?: {
    topic: string;
    questionCount: number;
    score?: number;
  } | null;
}

export const QuizHistorySidebar: React.FC<QuizHistorySidebarProps> = ({
  onSelectQuiz,
  currentQuiz,
}) => {
  const { isHistorySidebarOpen, toggleHistorySidebar, setHistorySidebarOpen } =
    useMCQStore();

  // ── API-driven history (same pattern as ContentHistorySidebar) ──────────────
  const { data: tests = [], isLoading } = useAllTestsMetadata();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: selectedTest, isLoading: isTestLoading } = useTestById(selectedId);

  useEffect(() => {
    if (selectedTest?.success && Array.isArray(selectedTest.test)) {
      // Build a QuizHistory-shaped object so QuizPage can display it
      const quizHistory: QuizHistory = {
        id: selectedTest.id,
        topic: selectedTest.title,
        totalQuestions: selectedTest.test.length,
        score: 0,
        percentage: 0,
        completedAt: new Date().toISOString(),
        timeSpent: 0,
        questions: selectedTest.test,
        userAnswers: [],
        results: [],
      };
      onSelectQuiz(quizHistory);
      setHistorySidebarOpen(false);
      setSelectedId(null);
    }
  }, [selectedTest]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':   return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'hard':   return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:       return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  if (!isHistorySidebarOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        onClick={toggleHistorySidebar}
      />
      <div className="fixed inset-y-0 left-0 z-40 w-[85vw] max-w-80 lg:relative lg:z-auto lg:w-80 h-full flex flex-col bg-secondary/50 backdrop-blur-sm border-r border-muted/30 flex-shrink-0 transition-all duration-300">

        {/* Header */}
        <div className="p-4 border-b border-muted/30 flex items-center justify-between bg-secondary/70">
          <h2 className="text-lg font-bold text-foreground">History</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHistorySidebar}
            className="h-8 w-8 p-0 hover:bg-muted/20"
          >
            <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">

          {/* Current session */}
          {currentQuiz && (
            <div className="mb-6 animate-in slide-in-from-left-2 duration-300">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Current Session
              </h3>
              <Card className="p-4 border-primary/30 bg-primary/10 shadow-sm backdrop-blur-sm">
                <h4 className="font-semibold text-primary line-clamp-2 mb-1">
                  {currentQuiz.topic}
                </h4>
                <div className="flex items-center gap-2 text-sm text-primary/80">
                  <FileText className="w-3 h-3" />
                  <span>{currentQuiz.questionCount} Questions</span>
                  {typeof currentQuiz.score === 'number' && (
                    <span className="ml-auto font-bold">{currentQuiz.score}%</span>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* API-driven history */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Previous Quizzes
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground/50">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Loading history…</span>
              </div>
            ) : tests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground/50">
                <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">No history yet.</p>
                <p className="text-xs">Complete a quiz to save it here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tests.map((test) => {
                  const isThisLoading = selectedId === test.id && isTestLoading;
                  return (
                    <div
                      key={test.id}
                      onClick={() => !isTestLoading && setSelectedId(test.id)}
                      className={`group relative bg-muted/10 rounded-xl p-3 border border-muted/30 shadow-sm hover:shadow-md hover:border-primary/40 hover:bg-muted/20 transition-all backdrop-blur-sm ${
                        isTestLoading ? 'cursor-wait opacity-60' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground line-clamp-2 pr-2">
                          {test.title}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isThisLoading && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                          )}
                          <span
                            className={`text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full border ${getDifficultyColor(test.difficulty)}`}
                          >
                            {test.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-1 pt-1 border-t border-muted/20">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(test.created_at)}</span>
                      </div>
                      <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};