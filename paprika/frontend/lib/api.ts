import axios from 'axios';
import { getCurrentUserId } from '@/lib/auth';
import { getApiBaseUrl } from '@/lib/env';

/** 브라우저에서도 백엔드로 직접 호출 (X-User-Id 등 커스텀 헤더가 rewrite 프록시에서 누락되는 문제 방지) */
function resolveBaseUrl(): string {
  return getApiBaseUrl();
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    const userId = getCurrentUserId();
    if (userId != null) {
      config.headers.set('X-User-Id', String(userId));
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // TODO: refresh token으로 재발급 로직 추가
    }
    return Promise.reject(error);
  }
);

export default api;
