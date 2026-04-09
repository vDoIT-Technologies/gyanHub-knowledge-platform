import {
    QueryClient,
    useQuery as useGet,
    useMutation as usePost,
  } from 'react-query';
  
  export const queryClient = new QueryClient();
  type UseApiReturnType = {
    useQuery: typeof useGet;
    useMutate: typeof usePost;
    invalidateQuery: (queryKey: string[]) => void;
  };
  
  const useApi = (): UseApiReturnType => {
    const invalidateQuery = (queryKey: string[]) => {
      queryClient.invalidateQueries({ queryKey });
    };
  
    return {
      useQuery: useGet,
      useMutate: usePost,
      invalidateQuery,
    };
  };
  
  export default useApi;
  