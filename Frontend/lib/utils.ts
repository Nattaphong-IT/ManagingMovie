import axios, { AxiosHeaders } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ✅ ฟังก์ชันสำหรับ merge className แบบฉลาด
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Axios instance พร้อม interceptor
const baseURL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api';

export const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mm_token');
    if (token) {
      if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers);
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);
