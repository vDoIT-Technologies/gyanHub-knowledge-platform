import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Loader2 } from 'lucide-react';

interface QuizGeneratorProps {
  topic: string;
  setTopic: (topic: string) => void;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  setDifficulty: (diff: 'Easy' | 'Medium' | 'Hard') => void;
  numberOfQuestions: number;
  setNumberOfQuestions: (num: number) => void;
  onGenerate: () => void;
  isPending: boolean;
  isError: boolean;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  numberOfQuestions,
  setNumberOfQuestions,
  onGenerate,
  isPending,
  isError,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-center mb-2">Quiz Generator</h1>
        <p className="text-gray-600 text-center">Generate and attempt multiple choice questions on any topic</p>
      </div>

      <Card className="border-gray-200 shadow-lg">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            Configure Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic of Interest
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quantum Physics, World History, React Hooks..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <Select
                value={difficulty}
                onValueChange={(value) => setDifficulty(value as 'Easy' | 'Medium' | 'Hard')}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="Mixed">Mixed (Random)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-gray-700">
                No of questions
              </label>
              <Select
                value={numberOfQuestions.toString()}
                onValueChange={(value) => setNumberOfQuestions(parseInt(value))}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={onGenerate}
            disabled={isPending || !topic.trim()}
            className="w-full"
            >
              {isPending ? (
                <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Questions...
                </>
              ) : (
              'Generate Questions'
              )}
            </Button>

          {isError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
              Failed to generate questions. Please try again or check your connection.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
