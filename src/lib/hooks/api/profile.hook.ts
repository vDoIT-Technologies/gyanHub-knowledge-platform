import { AxiosResponse } from 'axios';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from 'react-query';

import { apiGetProfile, apiUpdateProfile } from '@/services/user.api';
import useApi from '../useApi';

export const useGetProfile = (
  options?: UseQueryOptions<any, Error>
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ['profile'],
    queryFn: apiGetProfile,
    ...options,
  });
};

export const useUpdateProfile = (
  options?: UseMutationOptions<AxiosResponse<any>, Error, any>
): UseMutationResult<AxiosResponse<any>, Error, any> => {
  const { invalidateQuery } = useApi();
  return useMutation<AxiosResponse<any>, Error, any>({
    mutationFn: apiUpdateProfile,
    onSuccess: () => {
      invalidateQuery(['profile']);
    },
    ...options,
  });
};
