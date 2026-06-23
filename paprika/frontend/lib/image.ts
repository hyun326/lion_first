import api from './api';

export async function uploadImage(file: File, folder = 'products'): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await api.post<{ data: string }>('/api/v1/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function uploadImages(files: File[], folder = 'products'): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('folder', folder);

  const res = await api.post<{ data: string[] }>('/api/v1/images/upload/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

/**
 * Cloudinary URL에 변환 파라미터를 삽입해 반환
 *
 * 사용 예:
 *   cloudinaryUrl(url, 'w_300,h_300,c_fill')   // 썸네일
 *   cloudinaryUrl(url, 'f_auto,q_auto')         // 웹 최적화
 *   cloudinaryUrl(url, 'w_800,f_auto,q_auto')   // 상세 이미지
 */
export function cloudinaryUrl(url: string, transforms: string): string {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/${transforms}/`);
}
