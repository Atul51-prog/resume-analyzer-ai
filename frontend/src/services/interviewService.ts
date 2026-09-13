import api from './api';
import { InterviewSession, AnswerEvaluation, InterviewQuestionItem } from '../types';

export const startInterview = async (
  jobDescription: string,
  resumeId?: number,
  resumeText?: string
): Promise<{ session_id: number; questions: InterviewQuestionItem[] }> => {
  const res = await api.post('/interviews', {
    job_description: jobDescription,
    resume_id: resumeId,
    resume_text: resumeText,
  });
  return res.data;
};

export const getInterviews = async (): Promise<any[]> => {
  const res = await api.get('/interviews');
  return res.data;
};

export const getInterviewById = async (interviewId: number): Promise<InterviewSession> => {
  const res = await api.get<InterviewSession>(`/interviews/${interviewId}`);
  return res.data;
};

export const evaluateAnswer = async (
  interviewId: number,
  questionId: number,
  answerText: string
): Promise<AnswerEvaluation> => {
  const res = await api.post<AnswerEvaluation>(`/interviews/${interviewId}/answer/${questionId}`, {
    answer_text: answerText,
  });
  return res.data;
};
