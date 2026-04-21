import React from 'react';
import { Loader2, UploadCloud, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useUserStore } from '@/store';
import { apiGetAvatarTeachers, AvatarTeacherPublic } from '@/services/chat.api';
import { useContentIngestion } from '@/hooks/useContentIngestion';

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** idx;
  return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
}

const ACCEPTED_MIME_TYPES = [
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ACCEPTED_EXTENSIONS = ['.txt', '.pdf', '.doc', '.docx'];

export function ContentIngestionTab() {
  const ingestMutation = useContentIngestion();
  const { user } = useUserStore();

  const [teachers, setTeachers] = React.useState<AvatarTeacherPublic[]>([]);
  const [isTeachersLoading, setIsTeachersLoading] = React.useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = React.useState('');

  const [title, setTitle] = React.useState('');
  const [text, setText] = React.useState('');
  const [files, setFiles] = React.useState<File[]>([]);

  React.useEffect(() => {
    const fetchTeachers = async () => {
      setIsTeachersLoading(true);
      try {
        const data = await apiGetAvatarTeachers();
        setTeachers(data);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      } finally {
        setIsTeachersLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const onPickFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const { accepted, rejected } = selected.reduce<{
      accepted: File[];
      rejected: File[];
    }>(
      (acc, file) => {
        const ext = `.${file.name.split('.').pop() || ''}`.toLowerCase();
        const okType = ACCEPTED_MIME_TYPES.includes(file.type);
        const okExt = ACCEPTED_EXTENSIONS.includes(ext);
        (okType || okExt ? acc.accepted : acc.rejected).push(file);
        return acc;
      },
      { accepted: [], rejected: [] }
    );

    if (rejected.length) {
      toast({
        title: 'Some files were skipped',
        description: `Only ${ACCEPTED_EXTENSIONS.join(', ')} are supported.`,
        variant: 'destructive',
      });
    }

    if (accepted.length) {
      setFiles((prev) => {
        const existing = new Set(prev.map((f) => `${f.name}:${f.size}:${f.lastModified}`));
        const merged = [...prev];
        for (const file of accepted) {
          const key = `${file.name}:${file.size}:${file.lastModified}`;
          if (!existing.has(key)) merged.push(file);
        }
        return merged;
      });
    }

    e.target.value = '';
  };

  const hasText = text.trim().length > 0;
  const hasFiles = files.length > 0;
  const canSubmit = (hasText || hasFiles) && !ingestMutation.isLoading;

  const handleSubmit = async () => {
    if (!hasText && !hasFiles) {
      toast({
        title: 'Nothing to add',
        description: 'Paste some text or upload at least one document.',
        variant: 'destructive',
      });
      return;
    }
    if (hasText && hasFiles) {
      toast({
        title: 'Choose one input',
        description: 'Please add either text or documents, not both.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await ingestMutation.mutateAsync({
        teacherId: selectedTeacherId || undefined,
        title: title.trim() || undefined,
        text: hasText ? text.trim() : undefined,
        ownerId: user?.userId || user?.id,
        files,
      });

      toast({
        title: 'Content added',
        description: 'Saved successfully.',
      });

      setTitle('');
      setText('');
      setFiles([]);
    } catch (err) {
      toast({
        title: 'Failed to add content',
        description:
          err instanceof Error ? err.message : 'Please try again or check your connection.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Add Content</h1>
        <p className="text-muted-foreground">
          Upload documents or paste text to store them in the knowledge base.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-primary" />
            Target Knowledge Base (Teacher)
          </label>
          <Select
            value={selectedTeacherId || 'none'}
            onValueChange={(value) => setSelectedTeacherId(value === 'none' ? '' : value)}
            disabled={ingestMutation.isLoading || isTeachersLoading}
          >
            <SelectTrigger className="w-full bg-background/50 border-muted/50 text-foreground">
              <SelectValue placeholder={isTeachersLoading ? 'Loading teachers...' : 'My / Generic Vault'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">My / Generic Vault</SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[0.7rem] text-muted-foreground/70 pl-6 italic">
            * If you pick a teacher, the content is added to that teacher&apos;s knowledge base.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Title (optional)</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Unit 3 notes, Policy PDF, Chapter summary…"
            disabled={ingestMutation.isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Paste Text (optional)</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type text to store…"
            className="rounded-lg min-h-44"
            disabled={ingestMutation.isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Upload Documents (optional)
          </label>
          <Input
            type="file"
            multiple
            accept={ACCEPTED_EXTENSIONS.join(',')}
            onChange={onPickFiles}
            disabled={ingestMutation.isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Supported: {ACCEPTED_EXTENSIONS.join(', ')}. Please use either text or documents.
          </p>

          {files.length > 0 && (
            <div className="rounded-lg border border-muted/40 bg-background/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-foreground">Selected files</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiles([])}
                  disabled={ingestMutation.isLoading}
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={`${file.name}:${file.size}:${file.lastModified}`}
                    className="flex items-center justify-between gap-4 rounded-md bg-muted/20 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm text-foreground truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatBytes(file.size)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFiles((prev) =>
                          prev.filter(
                            (f) =>
                              !(
                                f.name === file.name &&
                                f.size === file.size &&
                                f.lastModified === file.lastModified
                              )
                          )
                        )
                      }
                      disabled={ingestMutation.isLoading}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {ingestMutation.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 mr-2" />
                Add to DB
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setTitle('');
              setText('');
              setFiles([]);
            }}
            disabled={ingestMutation.isLoading}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
