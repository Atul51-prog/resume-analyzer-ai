export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
}

export interface ResumeAnalysis {
  resume_score: number;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  projects: ResumeProject[];
}

export interface ResumeItem {
  id: number;
  filename: string;
  created_at: string;
  has_analysis: boolean;
  resume_text?: string;
  analysis?: ResumeAnalysis | null;
}

export interface JobMatchResult {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  suggestions: string[];
}

export interface InterviewQuestionItem {
  id: number;
  category: 'technical' | 'behavioral' | 'project' | string;
  question_text: string;
  order_index: number;
  answered?: boolean;
  answer?: {
    answer_text: string;
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  } | null;
}

export interface InterviewSession {
  id: number;
  status: string;
  created_at: string;
  questions: InterviewQuestionItem[];
}

export interface AnswerEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface DashboardData {
  total_resumes: number;
  total_interviews: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  latest_resume_score: number;
  recent_activity: string[];
}

export interface LearningRoadmap {
  week_1: string[];
  week_2: string[];
  week_3: string[];
  week_4: string[];
}
