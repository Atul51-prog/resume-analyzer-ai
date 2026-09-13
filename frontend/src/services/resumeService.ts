import api from './api';
import { ResumeItem, ResumeAnalysis } from '../types';

export const uploadResume = async (file: File): Promise<ResumeItem> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post<ResumeItem>('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const analyzeResume = async (resumeId: number): Promise<ResumeAnalysis> => {
  const res = await api.post<ResumeAnalysis>(`/resumes/${resumeId}/analyze`);
  return res.data;
};

export const getResumes = async (): Promise<ResumeItem[]> => {
  const res = await api.get<ResumeItem[]>('/resumes');
  return res.data;
};

export const getResumeById = async (resumeId: number): Promise<ResumeItem> => {
  const res = await api.get<ResumeItem>(`/resumes/${resumeId}`);
  return res.data;
};

export const deleteResume = async (resumeId: number): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/resumes/${resumeId}`);
  return res.data;
};
