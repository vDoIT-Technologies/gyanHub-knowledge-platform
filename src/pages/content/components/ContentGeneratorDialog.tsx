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
import { Alert, AlertDescription } from "../../../components/ui/alert";
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
  const [validationMessage, setValidationMessage] = React.useState("");

  const teacherOptions = React.useMemo(() => {
    const classifyTeacher = (teacher: AvatarTeacherPublic) => {
      const haystack = [
        teacher.name,
        teacher.description ?? "",
        ...(teacher.topics ?? []),
      ]
        .join(" ")
        .toLowerCase();

      const isHealth = /dr\s*verma|health|healthcare|medical|wellness|doctor|nutrition|fitness/.test(
        haystack
      );

      return isHealth ? "health" : "science";
    };

    const healthTeacher =
      teachers.find((teacher) => classifyTeacher(teacher) === "health") ?? null;
    const scienceTeacher =
      teachers.find(
        (teacher) =>
          teacher.id !== healthTeacher?.id && classifyTeacher(teacher) === "science"
      ) ?? null;

    return [
      healthTeacher
        ? {
            ...healthTeacher,
            optionKey: "health" as const,
            label: "Dr Asha Verma",
            description: "healthcare coach",
          }
        : null,
      scienceTeacher
        ? {
            ...scienceTeacher,
            optionKey: "science" as const,
            label: scienceTeacher.name || "Prof xx",
            description: "science teacher",
          }
        : null,
    ].filter(Boolean) as Array<AvatarTeacherPublic & {
      optionKey: "health" | "science";
      label: string;
      description: string;
    }>;
  }, [teachers]);

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

  React.useEffect(() => {
    if (!open) {
      setValidationMessage("");
      return;
    }

    if (selectedTeacherId && topic.trim()) {
      setValidationMessage("");
    }
  }, [open, selectedTeacherId, topic]);

  const handleGenerate = () => {
    if (!selectedTeacherId) {
      setValidationMessage("Select a teacher before generating a course so the backend can use teacher-specific knowledge.");
      return;
    }

    if (!topic.trim()) {
      setValidationMessage("Enter or select a topic before generating.");
      return;
    }

    setValidationMessage("");
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
          {/* 1. Expertise Context (Teacher Selection) */}
          <div className="space-y-2">
            <label
              htmlFor="teacherId"
              className="block text-sm font-medium text-foreground flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4 text-primary" />
              Expertise Context (Teacher)
            </label>
            <Select
              value={selectedTeacherId || undefined}
              onValueChange={(value) => {
                setSelectedTeacherId(value);
                if (value !== selectedTeacherId) setTopic("");
                setValidationMessage("");
              }}
              disabled={isPending || isTeachersLoading}
            >
              <SelectTrigger className="w-full bg-background/50 border-muted/50 text-foreground">
                <SelectValue placeholder={isTeachersLoading ? "Loading teachers..." : "Select a teacher"} />
              </SelectTrigger>
              <SelectContent>
                {teacherOptions.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.label} -- {teacher.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[0.7rem] text-muted-foreground/70 pl-6 italic">
              * Pick the teacher first. Dr Asha Verma is for health topics, and the science teacher handles science and general topics.
            </p>
          </div>

          {/* 2. Topic Input */}
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-foreground"
            >
              Topic of Interest
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Diabetes management, Human digestion, Gravity, Chemical reactions..."
              className="w-full px-3 py-2.5 bg-background/50 border border-muted/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              disabled={isPending}
            />
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

          {validationMessage && (
            <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
              <AlertDescription>{validationMessage}</AlertDescription>
            </Alert>
          )}

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
              disabled={isPending || !topic.trim() || !selectedTeacherId}
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
