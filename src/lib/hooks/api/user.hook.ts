import { apiFetchChatSession } from '@/services/chat.api';
import { AxiosResponse } from 'axios';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from 'react-query';

export const useGetSessionsList = (
    userId: string, 
    options?: UseQueryOptions<any, Error>
  ): UseQueryResult<any, Error> => {
    return useQuery<any, Error>({
      queryKey: ['chat-sessions', userId], 
      queryFn: () => apiFetchChatSession(userId),
      ...options,
    });
  };
  