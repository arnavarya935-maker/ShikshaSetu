import { createClient } from '../supabase/client';
import type {
  Enrollment,
  Note,
  Bookmark,
  Notification,
  Certificate,
  QuizAttempt,
  AssignmentSubmission,
  Course,
} from './types';
import { generateCertificateId } from './utils';
import { courses } from './data/courses';
import {
  mockEnrollments,
  mockNotes,
  mockBookmarks,
  mockNotifications,
  mockCertificates,
} from './data/enrollments';

/* ────────────────────────────────────────────────────────────
   Supabase helpers — gracefully fall back to mock data
   when Supabase is unavailable (missing config / offline).
   ──────────────────────────────────────────────────────────── */

function getDb() {
  return createClient();
}

/* ── Enrollments ──────────────────────────────────────────── */

export async function getEnrollments(userId: string): Promise<Enrollment[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('userId', userId);

    if (error || !data?.length) {
      return mockEnrollments.filter((e) => e.userId === userId || e.userId === 'mock-user');
    }

    const merged = [...data as Enrollment[]];
    for (const mockEnroll of mockEnrollments) {
      if (mockEnroll.userId === 'mock-user' && !merged.some((e) => e.courseId === mockEnroll.courseId)) {
        merged.push(mockEnroll);
      }
    }
    return merged;
  } catch {
    return mockEnrollments.filter((e) => e.userId === 'mock-user');
  }
}

export async function getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
  try {
    const supabase = getDb();
    const docId = `${userId}_${courseId}`;
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', docId)
      .single();

    if (error || !data) {
      return mockEnrollments.find((e) => e.userId === 'mock-user' && e.courseId === courseId) ?? null;
    }
    return data as Enrollment;
  } catch {
    return mockEnrollments.find((e) => e.userId === 'mock-user' && e.courseId === courseId) ?? null;
  }
}

export async function enrollInCourse(userId: string, courseId: string): Promise<Enrollment> {
  const course = courses.find((c) => c.id === courseId);
  const firstLessonId = course?.curriculum[0]?.lessons[0]?.id ?? '';
  const now = new Date().toISOString();

  const enrollment: Enrollment = {
    id: `${userId}_${courseId}`,
    userId,
    courseId,
    progress: 0,
    completedLessons: [],
    currentLessonId: firstLessonId,
    enrolledAt: now,
    lastAccessedAt: now,
    certificateEarned: false,
  };

  try {
    const supabase = getDb();
    await supabase.from('enrollments').upsert(enrollment);
  } catch {
    // fall through to return the local object
  }

  return enrollment;
}

export async function updateLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  totalLessons: number
): Promise<Enrollment | null> {
  const docId = `${userId}_${courseId}`;

  try {
    const supabase = getDb();
    const { data: existing } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', docId)
      .single();

    if (existing) {
      const data = existing as Enrollment;
      const completed = data.completedLessons.includes(lessonId)
        ? data.completedLessons
        : [...data.completedLessons, lessonId];
      const progress = Math.round((completed.length / totalLessons) * 100);

      await supabase
        .from('enrollments')
        .update({
          completedLessons: completed,
          progress,
          currentLessonId: lessonId,
          lastAccessedAt: new Date().toISOString(),
          certificateEarned: progress >= 100,
        })
        .eq('id', docId);

      return { ...data, completedLessons: completed, progress, certificateEarned: progress >= 100 };
    }
  } catch {
    // fall through
  }

  // Local fallback
  const enrollment = mockEnrollments.find((e) => e.courseId === courseId);
  if (enrollment) {
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
    enrollment.currentLessonId = lessonId;
    enrollment.certificateEarned = enrollment.progress >= 100;
  }
  return enrollment ?? null;
}

/* ── Notes ────────────────────────────────────────────────── */

export async function getNotes(userId: string, courseId: string): Promise<Note[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('userId', userId)
      .eq('courseId', courseId);

    if (error || !data?.length) return mockNotes.filter((n) => n.courseId === courseId);
    return data as Note[];
  } catch {
    return mockNotes.filter((n) => n.courseId === courseId);
  }
}

export async function saveNote(
  userId: string,
  courseId: string,
  lessonId: string,
  content: string,
  existingNoteId?: string
): Promise<Note> {
  const now = new Date().toISOString();
  const noteId = existingNoteId ?? `note-${Date.now()}`;

  const note: Note = {
    id: noteId,
    userId,
    courseId,
    lessonId,
    content,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const supabase = getDb();
    await supabase.from('notes').upsert(note);
  } catch {
    // fall through
  }

  return note;
}

export async function deleteNote(noteId: string): Promise<void> {
  try {
    const supabase = getDb();
    await supabase.from('notes').delete().eq('id', noteId);
  } catch {
    // fall through
  }
}

/* ── Bookmarks ────────────────────────────────────────────── */

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('userId', userId);

    if (error || !data?.length) return mockBookmarks;
    return data as Bookmark[];
  } catch {
    return mockBookmarks;
  }
}

export async function toggleBookmark(
  userId: string,
  courseId: string,
  lessonId: string,
  lessonTitle: string,
  courseTitle: string
): Promise<{ added: boolean }> {
  const bookmarkId = `${userId}_${courseId}_${lessonId}`;

  try {
    const supabase = getDb();
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('id', bookmarkId)
      .single();

    if (existing) {
      await supabase.from('bookmarks').delete().eq('id', bookmarkId);
      return { added: false };
    }

    const bookmark: Bookmark = {
      id: bookmarkId,
      userId,
      courseId,
      lessonId,
      lessonTitle,
      courseTitle,
      createdAt: new Date().toISOString(),
    };
    await supabase.from('bookmarks').insert(bookmark);
    return { added: true };
  } catch {
    return { added: true };
  }
}

/* ── Notifications ────────────────────────────────────────── */

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId);

    if (error) return mockNotifications;

    const dbNotifs = (data as Notification[]) ?? [];
    const merged = [...dbNotifs];
    for (const mockNotif of mockNotifications) {
      if (!merged.some((n) => n.id === mockNotif.id)) {
        merged.push(mockNotif);
      }
    }
    return merged;
  } catch {
    return mockNotifications;
  }
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  try {
    const supabase = getDb();
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
  } catch {
    // fall through
  }
  const notif = mockNotifications.find((n) => n.id === notificationId);
  if (notif) notif.read = true;
}

/* ── Certificates ─────────────────────────────────────────── */

export async function getCertificates(userId: string): Promise<Certificate[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('userId', userId);

    if (error) return mockCertificates;

    const dbCerts = (data as Certificate[]) ?? [];
    const merged = [...dbCerts];
    for (const mockCert of mockCertificates) {
      if (!merged.some((c) => c.id === mockCert.id)) {
        merged.push(mockCert);
      }
    }
    return merged;
  } catch {
    return mockCertificates;
  }
}

export async function issueCertificate(
  userId: string,
  courseId: string,
  courseName: string,
  userName: string
): Promise<Certificate> {
  const cert: Certificate = {
    id: `cert-${Date.now()}`,
    userId,
    courseId,
    courseName,
    userName,
    earnedAt: new Date().toISOString(),
    certificateNumber: generateCertificateId(),
  };

  try {
    const supabase = getDb();
    await supabase.from('certificates').insert(cert);
  } catch {
    // fall through
  }

  return cert;
}

/* ── Quiz Attempts ────────────────────────────────────────── */

export async function submitQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
  const full: QuizAttempt = { ...attempt, id: `qa-${Date.now()}` };

  try {
    const supabase = getDb();
    await supabase.from('quizAttempts').insert(full);
  } catch {
    // fall through
  }

  return full;
}

/* ── Assignment Submissions ───────────────────────────────── */

export async function submitAssignment(
  userId: string,
  assignmentId: string,
  content: string
): Promise<AssignmentSubmission> {
  const submission: AssignmentSubmission = {
    id: `sub-${Date.now()}`,
    userId,
    content,
    submittedAt: new Date().toISOString(),
  };

  try {
    const supabase = getDb();
    await supabase.from('submissions').insert({ ...submission, assignmentId });
  } catch {
    // fall through
  }

  return submission;
}

export async function getCourses(): Promise<Course[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'published');

    if (error || !data?.length) return courses;
    return data as Course[];
  } catch (e) {
    console.error('Failed to get courses from Supabase:', e);
    return courses;
  }
}

export async function getCourseBySlug(idOrSlug: string): Promise<Course | null> {
  try {
    const supabase = getDb();
    const { data: bySlug } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', idOrSlug)
      .single();

    if (bySlug) return bySlug as Course;

    const { data: byId } = await supabase
      .from('courses')
      .select('*')
      .eq('id', idOrSlug)
      .single();

    if (byId) return byId as Course;

    return courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
  } catch (e) {
    console.error('Failed to get course by slug or ID:', e);
    return courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
  }
}
