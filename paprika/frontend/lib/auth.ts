/**
 * 인증 관련 유틸리티
 * 담당: A - 민동현
 */
import { isDevOrLocalEnv } from '@/lib/env';

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const getStoredUserId = (): number | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('userId');
  if (!stored) return null;
  const parsed = Number(stored);
  return Number.isNaN(parsed) ? null : parsed;
};

function parseUserId(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

/** JWT 로그인 사용자 ID 우선, dev/local에서는 NEXT_PUBLIC_DEV_USER_ID 또는 localhost 기본값(1) */
export const getCurrentUserId = (): number | null => {
  const stored = getStoredUserId();
  if (stored != null) return stored;

  const envUserId = parseUserId(process.env.NEXT_PUBLIC_DEV_USER_ID);
  if (envUserId != null) return envUserId;

  if (isLocalhost() || isDevOrLocalEnv()) {
    return 1;
  }

  return null;
};
