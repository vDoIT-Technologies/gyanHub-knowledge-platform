export const getErrorMessage = (error: Record<string, any>) => {
  if (!error.response) {
    return 'Network error or no response received';
  }
  const { data } = error.response;
  return data?.error || data?.message || error.message || 'An unknown error occurred';
};
export const getSuccessMessage = (res: Record<string, any>) => {
    return res?.data?.message || res?.message || 'Success';
  };
  