import api from './api';
import { JobMatchResult } from '../types';

export const matchJob = async (resumeId: number, description: string, title?: string): Promise<JobMatchResult> => {
  const res = await api.post<JobMatchResult>('/jobs/match', {
    resume_id: resumeId,
    description,
    title: title || 'Software Engineer',
  });
  return res.data;
};
