export interface Slide {
  id: string;
  title: string;
  content: string;
  audioBase64?: string | null; 
}

export interface ContentResponse {
  success: boolean;
  id: string;
  title: string;
  slides: Slide[];
}

export interface ContentGenerateRequest {
  topic: string;
  num_slides: number;
  teacherId?: string;
}

export interface ContentHistory {
  id: string;
  title: string;
  topic: string;
  totalSlides: number;
  createdAt: string;
  slides: Slide[];
}
