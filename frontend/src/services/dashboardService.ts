import api from './api';
import { DashboardData } from '../types';

export const getDashboardData = async (): Promise<DashboardData> => {
  const res = await api.get<DashboardData>('/dashboard');
  return res.data;
};
