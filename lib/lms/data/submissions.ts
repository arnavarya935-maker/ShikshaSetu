import type { AssignmentSubmission } from '../types';

export type TeacherSubmission = AssignmentSubmission & {
  courseId: string;
  courseTitle: string;
  assignmentId: string;
  assignmentTitle: string;
  studentName: string;
  studentEmail: string;
  status: 'graded' | 'ungraded';
};

export const mockSubmissions: TeacherSubmission[] = [];
