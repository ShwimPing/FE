import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage를 사용하여 토큰 관리

const apiClient = axios.create({
  baseURL: 'http://211.188.51.4',
});

apiClient.interceptors.request.use(
  async config => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  async response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (refreshToken) {
          const response = await axios.post(
            'http://211.188.51.4/auth/reissue',
            null,
            {
              headers: {
                Authorization: refreshToken,
              },
            },
          );

          const newAccessToken = response.data.results.accessToken;

          await AsyncStorage.setItem('accessToken', newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (err) {
        console.error('토큰 갱신 실패:', err);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
