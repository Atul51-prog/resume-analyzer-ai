import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'InterviewAI - Resume Analyzer & AI Mock Interview Platform',
  description: 'Analyze resumes, match job descriptions, practice AI technical mock interviews, and build personalized roadmaps.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#18181b',
                color: '#fafafa',
                border: '1px solid #27272a',
                borderRadius: '16px',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
