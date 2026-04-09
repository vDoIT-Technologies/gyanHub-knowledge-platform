import { QueryCache, QueryClient } from 'react-query';
import { toast } from 'sonner';

import { getErrorMessage } from '../helpers/get-message';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Something went wrong: ${getErrorMessage(error)}`);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export const invalidateQuery = (queryKey: string[]) => {
  queryClient.invalidateQueries({ queryKey });
};