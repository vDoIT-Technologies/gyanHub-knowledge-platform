import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { PanelLeftOpen } from "lucide-react";

import { QuizHistorySidebar } from "./components/QuizHistorySidebar";
import { QuizGeneratorDialog } from "./components/QuizGeneratorDialog";
import { QuizWelcomeScreen } from "./components/QuizWelcomeScreen";
import { QuestionNavigator } from "./components/QuestionNavigator";
import { QuestionDisplay } from "./components/QuestionDisplay";
import { QuizResultsSummary } from "./components/QuizResultsSummary";
import type { MCQQuestion, QuizHistory, QuizResult, UserAnswer } from "@/types/mcq.types";
import { useMCQGeneration } from "@/hooks/useMCQ";
import { useMCQStore } from "@/store";

const QuizPage: React.FC = () => {
  // --- Quiz Configuration ---
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  // --- Active Quiz ---
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [isGeneratorDialogOpen, setIsGeneratorDialogOpen] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<string>("");
  const mcqMutation = useMCQGeneration();
  const { toggleHistorySidebar, isHistorySidebarOpen, setHistorySidebarOpen } =
    useMCQStore();

  // --- Generate ---
  const handleGenerateQuestions = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }
    try {
      const response = await mcqMutation.mutateAsync({
        topic: topic.trim(),
        numberOfQuestions,
        difficulty,
        teacherId: selectedTeacherId || undefined,
      });

      // API returns "test" array
      if (response.success && Array.isArray(response.test) && response.test.length > 0) {
        setQuestions(response.test);
        setQuizDifficulty(response.difficulty || difficulty);
        setUserAnswers([]);
        setShowResults(false);
        setQuizResults([]);
        setCurrentQuestionIndex(0);
        setQuizStartTime(new Date());
        setIsGeneratorDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to generate questions:", error);
    }
  };

  // --- View a previous quiz from history sidebar ---
  const handleViewPreviousQuiz = (quiz: QuizHistory) => {
    setTopic(quiz.topic);
    setQuestions(quiz.questions);
    // When loading from history, start fresh (no previous answers)
    setUserAnswers([]);
    setQuizResults([]);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setQuizStartTime(null);
  };

  // --- Answer & Submit ---
  const handleAnswerSelect = (questionId: string, selectedOptionId: string) => {
    setUserAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedOptionId } : a
        );
      }
      return [...prev, { questionId, selectedOptionId }];
    });
  };

  const handleSubmitQuiz = () => {
    const results: QuizResult[] = questions.map((question) => {
      const userAnswer = userAnswers.find((a) => a.questionId === question.id);
      const selectedOptionId = userAnswer?.selectedOptionId || "";
      const isCorrect = question.correct_ids.includes(selectedOptionId);
      return {
        questionId: question.id,
        isCorrect,
        selectedOptionId,
        correctOptionIds: question.correct_ids,
        explanation: question.explanation,
      };
    });
    setQuizResults(results);
    setShowResults(true);
  };

  // --- Reset ---
  const handleResetQuiz = () => {
    setQuestions([]);
    setUserAnswers([]);
    setShowResults(false);
    setQuizResults([]);
    setTopic("");
    setDifficulty("Medium");
    setSelectedTeacherId("");
    setCurrentQuestionIndex(0);
    setQuizStartTime(null);
    setQuizDifficulty("");
  };

  // --- Navigation ---
  const handleNextQuestion = () =>
    setCurrentQuestionIndex((i) => Math.min(i + 1, questions.length - 1));
  const handlePreviousQuestion = () =>
    setCurrentQuestionIndex((i) => Math.max(i - 1, 0));

  const getScorePercentage = () => {
    if (quizResults.length === 0) return 0;
    const correct = quizResults.filter((r) => r.isCorrect).length;
    return Math.round((correct / quizResults.length) * 100);
  };

  const getCurrentQuizStatus = () => {
    if (questions.length === 0) return null;
    return {
      topic,
      questionCount: questions.length,
      score: showResults ? getScorePercentage() : undefined,
    };
  };

  return (
    <div className="flex h-full w-full relative bg-background">
      {/* API-driven history sidebar — no more Zustand quiz history */}
      <QuizHistorySidebar
        onSelectQuiz={handleViewPreviousQuiz}
        currentQuiz={getCurrentQuizStatus()}
      />

      {!isHistorySidebarOpen && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleHistorySidebar}
          className="absolute left-4 top-4 z-10 h-9 w-9 p-0 bg-secondary/50 backdrop-blur-sm shadow-sm hover:bg-secondary/70 border-muted/30"
        >
          <PanelLeftOpen className="w-5 h-5 text-foreground" />
        </Button>
      )}

      <div className="flex-1 bg-background h-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 md:py-12 h-full">
          <QuizGeneratorDialog
            open={isGeneratorDialogOpen}
            onOpenChange={setIsGeneratorDialogOpen}
            topic={topic}
            setTopic={setTopic}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            numberOfQuestions={numberOfQuestions}
            setNumberOfQuestions={setNumberOfQuestions}
            selectedTeacherId={selectedTeacherId}
            setSelectedTeacherId={setSelectedTeacherId}
            onGenerate={handleGenerateQuestions}
            onViewHistory={() => setHistorySidebarOpen(true)}
            isPending={mcqMutation.isLoading}
            isError={mcqMutation.isError}
          />

          {!questions.length && (
            <div className="animate-in fade-in zoom-in duration-300">
              <QuizWelcomeScreen
                onStartQuiz={() => setIsGeneratorDialogOpen(true)}
                onViewHistory={() => setHistorySidebarOpen(true)}
                hasHistory={true} // always true since history is from API
              />
            </div>
          )}

          {questions.length > 0 && (
            <div className="animate-in fade-in duration-500">
              {showResults && (
                <QuizResultsSummary
                  scorePercentage={getScorePercentage()}
                  correctCount={quizResults.filter((r) => r.isCorrect).length}
                  totalCount={questions.length}
                  onReset={handleResetQuiz}
                />
              )}

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="order-2 lg:order-1 w-full lg:w-auto">
                  <QuestionNavigator
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    userAnswers={userAnswers}
                    quizResults={quizResults}
                    showResults={showResults}
                    onSelectQuestion={setCurrentQuestionIndex}
                    onSubmit={handleSubmitQuiz}
                    onReset={handleResetQuiz}
                  />
                </div>
                <div className="order-1 lg:order-2 flex-1 w-full">
                  {questions[currentQuestionIndex] && (
                    <QuestionDisplay
                      question={questions[currentQuestionIndex]}
                      currentQuestionIndex={currentQuestionIndex}
                      totalQuestions={questions.length}
                      userAnswer={userAnswers.find(
                        (a) => a.questionId === questions[currentQuestionIndex].id
                      )}
                      quizResult={quizResults.find(
                        (r) => r.questionId === questions[currentQuestionIndex].id
                      )}
                      showResults={showResults}
                      onAnswerSelect={handleAnswerSelect}
                      difficulty={quizDifficulty}
                      onNext={handleNextQuestion}
                      onPrevious={handlePreviousQuestion}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;