import api from '@/services';

export const apiGetProfile = async () => {
   return await api.get('/user/get');
};

export const apiGetAnalyticsData = async () => {
  return await api.get('/user/getAnalytics');
};

export const apiUpdateProfile = async (payload: {
  name?:string;
  email?:string;
  profilePhoto?:string;
}) => {
  return await api.put('/user/update', payload);
};
