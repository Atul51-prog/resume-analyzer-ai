import api from './api';

export const generateCoverLetter = async (
  resumeText: string,
  jobDescription: string
): Promise<{ cover_letter: string }> => {
  const res = await api.post<{ cover_letter: string }>('/cover-letter', {
    resume_text: resumeText,
    job_description: jobDescription,
  });
  return res.data;
};
