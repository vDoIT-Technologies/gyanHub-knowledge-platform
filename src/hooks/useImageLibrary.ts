import { useMutation } from 'react-query';
import api from '@/services';

export interface ImageLibraryParams {
  url: string;
  description: string;
  tags: string[];
}

export function useImageLibrary() {
  return useMutation<any, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/admin/image-library', formData);
      return res.data;
    },
  });
}