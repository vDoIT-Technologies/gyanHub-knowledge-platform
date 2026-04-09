import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '@/services'; // your axios/fetch instance
import type { Slide } from '@/types/content.types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GenerateContentParams {
  topic: string;
  num_slides: number;
  teacherId?: string;
}

interface CourseResponse {
  success: boolean;
  id: string;
  title: string;
  slides: Slide[];
}

export type CourseMetadata = {
  id: string;
  title?: string;
  topic?: string;
  totalSlides?: number;
  total_slides?: number;
  createdAt?: string;
  created_at?: string;
};

type DocumentCreateResponse = Record<string, unknown>;
type DocumentGetResponse = Record<string, unknown>;

type NormalizedDocument = {
  id: string;
  title?: string;
  text?: string;
  content?: string;
  slides?: Slide[];
  createdAt?: string;
};

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined;

const asNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;

const extractDocumentId = (data: DocumentCreateResponse): string | undefined => {
  return (
    asString((data as Record<string, unknown>)?.id) ??
    asString((data as Record<string, unknown>)?.document_id) ??
    asString((data as Record<string, unknown>)?.course_id) ??
    asString((data as Record<string, unknown>)?.courseId) ??
    asString((data as Record<string, unknown>)?.doc_id) ??
    asString(asRecord((data as Record<string, unknown>)?.data)?.id) ??
    asString(asRecord((data as Record<string, unknown>)?.document)?.id) ??
    undefined
  );
};

const normalizeDocument = (data: DocumentGetResponse): NormalizedDocument | null => {
  const top = asRecord(data);
  if (!top) return null;

  const maybeDoc = asRecord(top.course) ?? asRecord(top.document) ?? asRecord(top.data) ?? top;

  const id =
    asString(maybeDoc.id) ??
    asString(top.id) ??
    asString(maybeDoc.document_id) ?? 
    asString(top.document_id) ??
    asString(maybeDoc.course_id) ??
    asString(top.course_id) ??
    asString(maybeDoc.courseId);

  if (!id) return null;

  const slides = Array.isArray((maybeDoc as Record<string, unknown>).slides)
    ? ((maybeDoc as Record<string, unknown>).slides as Slide[])
    : undefined;

  return {
    id,
    title: asString(maybeDoc.title),
    text: asString(maybeDoc.text),
    content: asString(maybeDoc.content),
    slides,
    createdAt: asString(maybeDoc.created_at) ?? asString(maybeDoc.createdAt),
  };
};

const normalizeCourseMetadata = (data: unknown): CourseMetadata | null => {
  const rec = asRecord(data);
  if (!rec) return null;

  const id =
    asString(rec.id) ??
    asString(rec.course_id) ??
    asString(rec.document_id) ??
    asString(rec.courseId) ??
    asString(rec.doc_id);

  if (!id) return null;

  return {
    id,
    title: asString(rec.title),
    topic: asString(rec.topic),
    totalSlides: asNumber(rec.totalSlides),
    total_slides: asNumber(rec.total_slides),
    createdAt: asString(rec.createdAt),
    created_at: asString(rec.created_at),
  };
};

const splitTextIntoSlides = (docId: string, text: string): Slide[] => {
  const parts = text.includes('\n---\n') ? text.split('\n---\n') : [text];

  return parts
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((content, index) => {
      const firstLine = content.split('\n')[0]?.trim() ?? '';
      const headingMatch = firstLine.match(/^#{1,6}\s+(.*)$/);
      const title = headingMatch?.[1]?.trim() || `Slide ${index + 1}`;
      return { id: `${docId}-s${index + 1}`, title, content };
    });
};

const toContentResponse = (
  doc: NormalizedDocument,
  fallbackTitle: string
): CourseResponse => {
  const title = doc.title || fallbackTitle;
  const slides =
    Array.isArray(doc.slides) && doc.slides.length > 0
      ? doc.slides
      : splitTextIntoSlides(doc.id, doc.content ?? doc.text ?? fallbackTitle);

  return { success: true, id: doc.id, title, slides };
};

// ─── Generate content as a course (POST /courses then GET /courses/:id) ───────
export function useContentGeneration() {
  const queryClient = useQueryClient();

  return useMutation<CourseResponse, Error, GenerateContentParams>({
    mutationFn: async ({ topic, num_slides, teacherId }: GenerateContentParams) => {
      // Step 1: Create course
      const { data: createData } = await api.post('/courses', {
        topic,
        num_slides: Number(num_slides),
        ...(teacherId ? { teacherId } : {}),
      });

      const documentId = extractDocumentId(createData as DocumentCreateResponse);
      if (!documentId) throw new Error('No document id returned from server');

      // Step 2: Fetch the full course by ID
      const { data: docData } = await api.get('/courses', {
        params: { course_id: documentId }
      });
      const normalized = normalizeDocument(docData as DocumentGetResponse);
      if (!normalized) throw new Error('Failed to fetch created document');

      return toContentResponse(normalized, topic);
    },
    onSuccess: () => {
      // Keep hook-compatible invalidation point (sidebar/history uses local store today).
      queryClient.invalidateQueries({ queryKey: ['content', 'history'] });
    },
    onError: (err: Error) => {
      console.error('[useContentGeneration] error:', err);
    },
  });
}

// ─── Fetch a single course by ID (GET /courses/:id) ──────────────────────────
export function useDocumentById(documentId: string | null) {
  return useQuery<CourseResponse, Error>({
    queryKey: ['course', documentId],
    queryFn: async () => {
      if (!documentId) throw new Error('Missing document id');
      const { data } = await api.get('/courses', {
        params: { course_id: documentId }
      });
      const normalized = normalizeDocument(data as DocumentGetResponse);
      if (!normalized) throw new Error('Document not found');
      return toContentResponse(normalized, normalized.title ?? documentId);
    },
    enabled: !!documentId,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Fetch all courses metadata for history sidebar ───────────────────────────
export function useAllCoursesMetadata() {
  return useQuery<CourseMetadata[], Error>({
    queryKey: ['content', 'history'],
    queryFn: async () => {
      const { data } = await api.get('/courses/all');
      if (!Array.isArray(data)) return [];
      return data
        .map((item) => normalizeCourseMetadata(item))
        .filter((item): item is CourseMetadata => Boolean(item));
    },
    staleTime: 1000 * 30,
  });
}
