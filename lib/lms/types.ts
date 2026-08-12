/* ────────────────────────────────────────────────────────────
   LMS Type Definitions
   ──────────────────────────────────────────────────────────── */

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';
export type LessonType = 'video' | 'text' | 'quiz' | 'assignment';
export type ResourceType = 'pdf' | 'link' | 'doc' | 'video';
export type NotificationType = 'enrollment' | 'completion' | 'assignment' | 'quiz' | 'certificate' | 'general';

/* ── Resource ─────────────────────────────────────────────── */
export type Resource = {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
};

/* ── Quiz ─────────────────────────────────────────────────── */
export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
  timeLimitMinutes: number;
};

/* ── Assignment ───────────────────────────────────────────── */
export type AssignmentSubmission = {
  id: string;
  userId: string;
  content: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
};

export type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissions: AssignmentSubmission[];
};

/* ── Lesson ───────────────────────────────────────────────── */
export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: number; // minutes
  videoUrl?: string;
  content?: string;
  resources: Resource[];
  quiz?: Quiz;
  assignment?: Assignment;
};

/* ── Module ───────────────────────────────────────────────── */
export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

/* ── Course Instructor ────────────────────────────────────── */
export type Instructor = {
  name: string;
  avatar: string; // initials fallback
  bio: string;
  title: string;
};

/* ── Course ───────────────────────────────────────────────── */
export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string; // gradient CSS or image URL
  category: string;
  tags: string[];
  instructor: Instructor;
  price: number; // 0 = free
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  duration: number; // total minutes
  level: CourseLevel;
  curriculum: Module[];
  status: CourseStatus;
  createdAt: string;
  whatYoullLearn: string[];
  requirements: string[];
};

/* ── Category ─────────────────────────────────────────────── */
export type CourseCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  courseCount: number;
};

/* ── Enrollment & Progress ────────────────────────────────── */
export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // 0-100
  completedLessons: string[]; // lesson IDs
  currentLessonId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  certificateEarned: boolean;
};

/* ── Note ─────────────────────────────────────────────────── */
export type Note = {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

/* ── Bookmark ─────────────────────────────────────────────── */
export type Bookmark = {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  createdAt: string;
};

/* ── Notification ─────────────────────────────────────────── */
export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkUrl?: string;
};

/* ── Certificate ──────────────────────────────────────────── */
export type Certificate = {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  earnedAt: string;
  certificateNumber: string;
};

/* ── Quiz Attempt ─────────────────────────────────────────── */
export type QuizAttempt = {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  answers: Record<string, string>; // questionId → selectedOptionId
  score: number;
  passed: boolean;
  completedAt: string;
};
