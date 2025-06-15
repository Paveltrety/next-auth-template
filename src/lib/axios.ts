// /lib/axios.ts
import axios, { AxiosInstance } from 'axios';

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5002/api', // замени на своё
  withCredentials: true, // ⬅ обязательно, чтобы куки работали!
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(Promise.reject);
      }

      isRefreshing = true;

      try {
        await api.get('/auth/refresh'); // бэк должен выдать новый access токен через куки
        processQueue(null);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);

        if (typeof window !== 'undefined') {
          try {
            await api.post('/auth/logout');
          } finally {
            window.location.href = '/sign-in';
          }
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  },
);

export default api;
