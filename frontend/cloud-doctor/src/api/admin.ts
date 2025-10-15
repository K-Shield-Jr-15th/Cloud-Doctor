import axios from './axios';
import { Service, GuidelineDetail } from '../types/guideline';

interface LoginResponse {
  message: string;
  username: string;
}

export const adminApi = {
  login: async (username: string, password: string): Promise<boolean> => {
    try {
      await axios.post<LoginResponse>('/api/auth/login', { username, password });
      sessionStorage.setItem('username', username);
      return true;
    } catch (error: any) {
      console.error('로그인 실패:', error.response?.data || error.message);
      return false;
    }
  },

  register: async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
      return true;
    } catch {
      return false;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axios.post('/api/auth/logout');
    } finally {
      sessionStorage.removeItem('username');
    }
  },

  getServices: async (): Promise<Service[]> => {
    const { data } = await axios.get('/admin/services');
    return data;
  },

  saveService: async (service: Omit<Service, 'id'>): Promise<void> => {
    await axios.post('/admin/services', service);
  },

  updateService: async (id: string, service: Partial<Service>): Promise<void> => {
    await axios.put(`/admin/services/${id}`, service);
  },

  deleteService: async (serviceId: string): Promise<void> => {
    await axios.delete(`/admin/services/${serviceId}`);
  },

  getGuidelines: async (): Promise<GuidelineDetail[]> => {
    const { data } = await axios.get('/api/guidelines');
    return data;
  },

  saveGuideline: async (guideline: Omit<GuidelineDetail, 'id'>): Promise<void> => {
    await axios.post('/admin/guidelines', guideline);
  },

  deleteGuideline: async (guidelineId: string): Promise<void> => {
    await axios.delete(`/admin/guidelines/${guidelineId}`);
  },

  getUsers: async (): Promise<any[]> => {
    const { data } = await axios.get('/admin/users');
    return data;
  }
};