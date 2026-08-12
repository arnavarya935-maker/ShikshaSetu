import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../firebase';
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
   Firestore helpers — gracefully fall back to mock data
   when Firestore is unavailable (missing config / offline).
   ──────────────────────────────────────────────────────────── */

function getDb() {
  return getFirebaseFirestore();
}

/* ── Enrollments ──────────────────────────────────────────── */

export async function getEnrollments(userId: string): Promise<Enrollment[]> {
  const db = getDb();
  if (!db) return mockEnrollments.filter((e) => e.userId === userId || e.userId === 'mock-user');

  try {
    const q = query(collection(db, 'enrollments'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const dbEnrolls = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Enrollment);

    const merged = [...dbEnrolls];
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
  const db = getDb();
  if (!db) return mockEnrollments.find((e) => (e.userId === userId || e.userId === 'mock-user') && e.courseId === courseId) ?? null;

  try {
    const docId = `${userId}_${courseId}`;
    const snap = await getDoc(doc(db, 'enrollments', docId));
    if (!snap.exists()) return mockEnrollments.find((e) => e.userId === 'mock-user' && e.courseId === courseId) ?? null;
    return { id: snap.id, ...snap.data() } as Enrollment;
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

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, 'enrollments', enrollment.id), enrollment);
    } catch {
      // fall through to return the local object
    }
  }

  return enrollment;
}

export async function updateLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  totalLessons: number
): Promise<Enrollment | null> {
  const db = getDb();
  const docId = `${userId}_${courseId}`;

  if (db) {
    try {
      const ref = doc(db, 'enrollments', docId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as Enrollment;
        const completed = data.completedLessons.includes(lessonId)
          ? data.completedLessons
          : [...data.completedLessons, lessonId];
        const progress = Math.round((completed.length / totalLessons) * 100);

        await updateDoc(ref, {
          completedLessons: arrayUnion(lessonId),
          progress,
          currentLessonId: lessonId,
          lastAccessedAt: new Date().toISOString(),
          certificateEarned: progress >= 100,
        });

        return { ...data, completedLessons: completed, progress, certificateEarned: progress >= 100 };
      }
    } catch {
      // fall through
    }
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
  const db = getDb();
  if (!db) return mockNotes.filter((n) => n.courseId === courseId);

  try {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return mockNotes.filter((n) => n.courseId === courseId);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Note);
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
    createdAt: existingNoteId ? now : now,
    updatedAt: now,
  };

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, 'notes', noteId), note);
    } catch {
      // fall through
    }
  }

  return note;
}

export async function deleteNote(noteId: string): Promise<void> {
  const db = getDb();
  if (db) {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch {
      // fall through
    }
  }
}

/* ── Bookmarks ────────────────────────────────────────────── */

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const db = getDb();
  if (!db) return mockBookmarks;

  try {
    const q = query(collection(db, 'bookmarks'), where('userId', '==', userId));
    const snap = await getDocs(q);
    if (snap.empty) return mockBookmarks;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bookmark);
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
  const db = getDb();
  const bookmarkId = `${userId}_${courseId}_${lessonId}`;

  if (db) {
    try {
      const ref = doc(db, 'bookmarks', bookmarkId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await deleteDoc(ref);
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
      await setDoc(ref, bookmark);
      return { added: true };
    } catch {
      // fall through
    }
  }

  return { added: true };
}

/* ── Notifications ────────────────────────────────────────── */

export async function getNotifications(userId: string): Promise<Notification[]> {
  const db = getDb();
  if (!db) return mockNotifications;

  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const dbNotifs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notification);

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
  const db = getDb();
  if (db) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    } catch {
      // fall through
    }
  }
  // Also update mock for local state
  const notif = mockNotifications.find((n) => n.id === notificationId);
  if (notif) notif.read = true;
}

/* ── Certificates ─────────────────────────────────────────── */

export async function getCertificates(userId: string): Promise<Certificate[]> {
  const db = getDb();
  if (!db) return mockCertificates;

  try {
    const q = query(collection(db, 'certificates'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const dbCerts = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Certificate);

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

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, 'certificates', cert.id), cert);
    } catch {
      // fall through
    }
  }

  return cert;
}

/* ── Quiz Attempts ────────────────────────────────────────── */

export async function submitQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
  const full: QuizAttempt = { ...attempt, id: `qa-${Date.now()}` };

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, 'quizAttempts', full.id), full);
    } catch {
      // fall through
    }
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

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, 'submissions', submission.id), { ...submission, assignmentId });
    } catch {
      // fall through
    }
  }

  return submission;
}

export async function getCourses(): Promise<Course[]> {
  const db = getDb();
  if (!db) return courses;
  try {
    const q = query(collection(db, 'courses'), where('status', '==', 'published'));
    const snap = await getDocs(q);
    const dbCourses = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course);
    if (dbCourses.length === 0) {
      return courses;
    }
    return dbCourses;
  } catch (e) {
    console.error('Failed to get courses from Firestore:', e);
    return courses;
  }
}

export async function getCourseBySlug(idOrSlug: string): Promise<Course | null> {
  const db = getDb();
  if (!db) return courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
  try {
    const q = query(collection(db, 'courses'), where('slug', '==', idOrSlug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as Course;
    }

    const docSnap = await getDoc(doc(db, 'courses', idOrSlug));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Course;
    }

    return courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
  } catch (e) {
    console.error('Failed to get course by slug or ID:', e);
    return courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
  }
}
