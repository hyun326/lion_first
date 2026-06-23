/**
 * 환경 변수 유틸
 */

export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8080'
  );
}

/** dev/local 환경 여부 (production에서는 false) */
export function isDevOrLocalEnv(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  const appEnv = process.env.NEXT_PUBLIC_APP_ENV;
  if (appEnv === 'development' || appEnv === 'local') {
    return true;
  }

  return process.env.NODE_ENV === 'development';
}

/** dev/local에서만 사용. production에서는 null */
export function getDevUserId(): string | null {
  if (!isDevOrLocalEnv()) {
    return null;
  }
  return process.env.NEXT_PUBLIC_DEV_USER_ID ?? null;
}
