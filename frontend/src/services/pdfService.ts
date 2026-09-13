import { jsPDF } from 'jspdf';
import { AnswerEvaluation } from '../types';

export const downloadInterviewReportPDF = (
  question: string,
  answer: string,
  evaluation: AnswerEvaluation | null
) => {
  const doc = new jsPDF();
  const pageWidth = 180;

  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('AI Interview Evaluation Report', 15, 20);

  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 28);

  let y = 40;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Question:', 15, y);
  y += 8;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const qLines = doc.splitTextToSize(question, pageWidth);
  doc.text(qLines, 15, y);
  y += qLines.length * 6 + 10;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Candidate Answer:', 15, y);
  y += 8;
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const aLines = doc.splitTextToSize(answer || 'No answer provided.', pageWidth);
  doc.text(aLines, 15, y);
  y += aLines.length * 6 + 10;

  if (evaluation) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text(`Evaluation Score: ${evaluation.score} / 100`, 15, y);
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Feedback:', 15, y);
    y += 6;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const fbLines = doc.splitTextToSize(evaluation.feedback, pageWidth);
    doc.text(fbLines, 15, y);
    y += fbLines.length * 5 + 8;

    if (evaluation.strengths?.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(22, 163, 74);
      doc.text('Strengths:', 15, y);
      y += 6;
      evaluation.strengths.forEach((s) => {
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`• ${s}`, 20, y);
        y += 5;
      });
      y += 4;
    }

    if (evaluation.improvements?.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(220, 38, 38);
      doc.text('Areas for Improvement:', 15, y);
      y += 6;
      evaluation.improvements.forEach((imp) => {
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`• ${imp}`, 20, y);
        y += 5;
      });
    }
  }

  doc.save('AI_Interview_Report.pdf');
};
