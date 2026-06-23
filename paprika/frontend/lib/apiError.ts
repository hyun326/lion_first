import axios from 'axios';

export function getApiErrorMessage(error: unknown, fallback = '요청 처리 중 오류가 발생했습니다.'): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return '서버에 연결할 수 없습니다. 백엔드(localhost:8080)가 실행 중인지 확인해주세요.';
    }

    if (error.response.status === 500) {
      const message = error.response?.data?.message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
      return '서버 오류(500)입니다. Spring Boot 백엔드가 localhost:8080에서 실행 중인지 확인해주세요.';
    }

    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
