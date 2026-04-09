import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Loader2, History, Sparkles, UserCircle } from "lucide-react";
import { apiGetAvatarTeachers, AvatarTeacherPublic } from "@/services/chat.api";

interface QuizGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: string;
  setTopic: (topic: string) => void;
  difficulty: "Easy" | "Medium" | "Hard";
  setDifficulty: (diff: "Easy" | "Medium" | "Hard") => void;
  numberOfQuestions: number;
  setNumberOfQuestions: (num: number) => void;
  onGenerate: () => void;
  onViewHistory: () => void;
  selectedTeacherId: string;
  setSelectedTeacherId: (id: string) => void;
  isPending: boolean;
  isError: boolean;
}

export const QuizGeneratorDialog: React.FC<QuizGeneratorDialogProps> = ({
  open,
  onOpenChange,
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  numberOfQuestions,
  setNumberOfQuestions,
  onGenerate,
  onViewHistory,
  selectedTeacherId,
  setSelectedTeacherId,
  isPending,
  isError,
}) => {
  const [teachers, setTeachers] = React.useState<AvatarTeacherPublic[]>([]);
  const [isTeachersLoading, setIsTeachersLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const fetchTeachers = async () => {
        setIsTeachersLoading(true);
        try {
          const data = await apiGetAvatarTeachers();
          setTeachers(data);
        } catch (error) {
          console.error("Failed to fetch teachers:", error);
        } finally {
          setIsTeachersLoading(false);
        }
      };
      fetchTeachers();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-secondary border-muted/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-foreground">
            <Sparkles className="w-6 h-6 text-primary" />
            Generate New Quiz
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure your quiz settings and generate questions on any topic
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">

          {/* 1. Expertise Context (Teacher Selection) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-primary" />
              Expertise Context (Teacher)
            </label>
            <Select
              value={selectedTeacherId || "none"}
              onValueChange={(value) => {
                const id = value === "none" ? "" : value;
                setSelectedTeacherId(id);
                // Reset topic when teacher changes
                if (id !== selectedTeacherId) setTopic("");
              }}
              disabled={isPending || isTeachersLoading}
            >
              <SelectTrigger className="w-full bg-background/50 border-muted/50 text-foreground">
                <SelectValue
                  placeholder={
                    isTeachersLoading ? "Loading teachers..." : "Generic Teaching Mode"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Generic Teaching Mode</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[0.7rem] text-muted-foreground/70 pl-6 italic">
              * Choosing a teacher will use their specific knowledge base for this quiz.
            </p>
          </div>

          {/* 2. Topic Selection - dynamic dropdown if teacher has topics */}
          <div className="space-y-4">
            {selectedTeacherId &&
              teachers.find((t) => t.id === selectedTeacherId)?.topics?.length ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Select a Quiz Topic
                </label>
                <Select
                  value={
                    teachers
                      .find((t) => t.id === selectedTeacherId)
                      ?.topics?.includes(topic)
                      ? topic
                      : topic === ""
                      ? ""
                      : "custom"
                  }
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setTopic("");
                    } else {
                      setTopic(value);
                    }
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full bg-background/50 border-muted/50 text-foreground">
                    <SelectValue placeholder="-- Choose a Topic --" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers
                      .find((t) => t.id === selectedTeacherId)
                      ?.topics?.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    <SelectItem value="custom" className="text-primary font-medium italic">
                      + Use a Custom Topic
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {/* Topic text input — shown in Generic mode OR when custom topic chosen */}
            {(!selectedTeacherId ||
              (selectedTeacherId &&
                !teachers
                  .find((t) => t.id === selectedTeacherId)
                  ?.topics?.includes(topic))) && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-foreground"
                >
                  {selectedTeacherId ? "Enter Custom Topic Details" : "Topic of Interest"}
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quantum Physics, World History, React Hooks..."
                  className="w-full px-3 py-2.5 bg-background/50 border border-muted/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  disabled={isPending}
                />
              </div>
            )}
          </div>

          {/* 3. Difficulty + Number of Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Difficulty
              </label>
              <Select
                value={difficulty}
                onValueChange={(value) =>
                  setDifficulty(value as "Easy" | "Medium" | "Hard")
                }
                disabled={isPending}
              >
                <SelectTrigger className="w-full bg-background/50 border-muted/50 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                No of Questions
              </label>
              <Select
                value={numberOfQuestions.toString()}
                onValueChange={(value) => setNumberOfQuestions(parseInt(value))}
                disabled={isPending}
              >
                <SelectTrigger className="w-full bg-background/50 border-muted/50 text-foreground">
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

          {/* Error Message */}
          {isError && (
            <div className="p-3 rounded-lg bg-destructive/20 text-destructive-foreground text-sm text-center border border-destructive/30">
              Failed to generate questions. Please try again or check your connection.
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={onGenerate}
              disabled={isPending || !topic.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Questions
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                onViewHistory();
                onOpenChange(false);
              }}
              variant="outline"
              className="w-full border-muted/50 hover:bg-muted/20 text-foreground"
              size="lg"
            >
              <History className="w-4 h-4 mr-2" />
              View Quiz History
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};