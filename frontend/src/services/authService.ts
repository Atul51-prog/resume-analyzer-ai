import api from './api';
import { AuthResponse } from '../types';

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return res.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', { email, password });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};
