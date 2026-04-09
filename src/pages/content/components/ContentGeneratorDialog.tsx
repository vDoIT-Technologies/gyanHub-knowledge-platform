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

interface ContentGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: string;
  setTopic: (topic: string) => void;
  numberOfSlides: number;
  setNumberOfSlides: (num: number) => void;
  onGenerate: () => void;
  onViewHistory: () => void;
  selectedTeacherId: string;
  setSelectedTeacherId: (id: string) => void;
  isPending: boolean;
  isError: boolean;
}

export const ContentGeneratorDialog: React.FC<ContentGeneratorDialogProps> = ({
  open,
  onOpenChange,
  topic,
  setTopic,
  numberOfSlides,
  setNumberOfSlides,
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

  const handleGenerate = () => {
    onGenerate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-secondary border-muted/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-foreground">
            <Sparkles className="w-6 h-6 text-primary" />
            Generate Learning Content
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create comprehensive educational slides on any topic
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* 1. Expertise Context (Teacher Selection) - NOW AT TOP */}
          <div className="space-y-2">
            <label
              htmlFor="teacherId"
              className="block text-sm font-medium text-foreground flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4 text-primary" />
              Expertise Context (Teacher)
            </label>
            <Select
              value={selectedTeacherId || "none"}
              onValueChange={(value) => {
                const id = value === "none" ? "" : value;
                setSelectedTeacherId(id);
                // Reset topic when teacher changes to avoid confusion
                if (id !== selectedTeacherId) setTopic("");
              }}
              disabled={isPending || isTeachersLoading}
            >
              <SelectTrigger className="w-full bg-background/50 border-muted/50 text-foreground">
                <SelectValue placeholder={isTeachersLoading ? "Loading teachers..." : "Generic Teaching Mode"} />
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
              * Choosing a teacher will use their specific knowledge base for this course.
            </p>
          </div>

          {/* 2. Topic Selection - DYNAMIC DROPDOWN BASED ON TEACHER */}
          <div className="space-y-4">
            {selectedTeacherId && teachers.find(t => t.id === selectedTeacherId)?.topics?.length ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Select a Lesson Topic
                </label>
                <Select
                  value={teachers.find(t => t.id === selectedTeacherId)?.topics?.includes(topic) ? topic : (topic === "" ? "" : "custom")}
                  onValueChange={(value) => {
                    if (value === "custom") {
                      // Keep it as 'custom' visually for a moment but clear the internal state to show input
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
                    {teachers.find(t => t.id === selectedTeacherId)?.topics?.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom" className="text-primary font-medium italic">+ Use a Custom Topic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {/* Topic Input - shown if Generic mode OR Custom Topic is desired in dropdown */}
            {(!selectedTeacherId || (selectedTeacherId && !teachers.find(t => t.id === selectedTeacherId)?.topics?.includes(topic))) && (
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
                  placeholder="e.g., Quantum Physics, Healthy Habits, Modern History..."
                  className="w-full px-3 py-2.5 bg-background/50 border border-muted/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  disabled={isPending}
                />
              </div>
            )}
          </div>

          {/* 3. Number of Slides */}
          <div className="space-y-2">
            <label
              htmlFor="numberOfSlides"
              className="block text-sm font-medium text-foreground"
            >
              Course Depth (Slides)
            </label>
            <Select
              value={numberOfSlides.toString()}
              onValueChange={(value) => setNumberOfSlides(parseInt(value))}
              disabled={isPending}
            >
              <SelectTrigger className="w-full bg-background/50 border-muted/50 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 5, 7, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Slides
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {isError && (
            <div className="p-3 rounded-lg bg-destructive/20 text-destructive-foreground text-sm text-center border border-destructive/30">
              Failed to generate content. Please try again or check your
              connection.
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleGenerate}
              disabled={isPending || !topic.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Expert Content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Content
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
              View Content History
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
