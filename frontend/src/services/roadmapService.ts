import api from './api';
import { LearningRoadmap } from '../types';

export const generateRoadmap = async (resumeText: string, targetRole: string): Promise<LearningRoadmap> => {
  const res = await api.post<LearningRoadmap>('/roadmap', {
    resume_text: resumeText,
    target_role: targetRole,
  });
  return res.data;
};
