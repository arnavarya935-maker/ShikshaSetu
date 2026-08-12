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
import type { Course, Enrollment, Module } from './types';
import { courses as initialCourses } from './data/courses';
import { mockEnrollments } from './data/enrollments';
import { mockSubmissions, type TeacherSubmission } from './data/submissions';
import { mockAnnouncements, type Announcement } from './data/announcements';

function getDb() {
  return getFirebaseFirestore();
}

// Stateful local copy to support additions/deletions in memory when offline or Firestore not configured
let localCourses = [...initialCourses];
let localSubmissions = [...mockSubmissions];
let localAnnouncements = [...mockAnnouncements];

/* ── Course Management ────────────────────────────────────── */

export async function getTeacherCourses(userId: string): Promise<Course[]> {
  const db = getDb();
  if (!db) {
    return localCourses;
  }

  try {
    const q = query(collection(db, 'courses'), where('teacherId', '==', userId));
    const snap = await getDocs(q);
    const dbCourses = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Course);

    const merged = [...dbCourses];
    for (const localCourse of localCourses) {
      if (!merged.some((c) => c.id === localCourse.id)) {
        merged.push(localCourse);
      }
    }
    return merged;
  } catch {
    return localCourses;
  }
}

export async function createCourse(userId: string, courseInput: Partial<Course>): Promise<Course> {
  const now = new Date().toISOString();
  const courseId = `course-${Date.now()}`;
  const slug = (courseInput.title ?? 'new-course')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newCourse: Course = {
    id: courseId,
    slug,
    title: courseInput.title ?? 'New Course',
    description: courseInput.description ?? '',
    longDescription: courseInput.longDescription ?? '',
    thumbnail: courseInput.thumbnail ?? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    category: courseInput.category ?? 'Programming',
    tags: courseInput.tags ?? [],
    instructor: {
      name: courseInput.instructor?.name ?? 'Instructor',
      avatar: courseInput.instructor?.avatar ?? 'INS',
      bio: courseInput.instructor?.bio ?? '',
      title: courseInput.instructor?.title ?? 'Educator',
    },
    price: courseInput.price ?? 0,
    rating: 5.0,
    reviewCount: 0,
    enrolledCount: 0,
    duration: 0,
    level: courseInput.level ?? 'beginner',
    curriculum: [],
    status: 'draft',
    createdAt: now,
    whatYoullLearn: courseInput.whatYoullLearn ?? [],
    requirements: courseInput.requirements ?? [],
    ...((courseInput as any).teacherId ? {} : { teacherId: userId }), // associate with logged-in user
  } as unknown as Course;

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, 'courses', courseId), newCourse);
    } catch (e) {
      console.error('Failed to create course in Firestore:', e);
    }
  }

  // Update local memory list
  localCourses.push(newCourse);
  return newCourse;
}

export async function updateCourse(courseId: string, courseInput: Partial<Course>): Promise<Course | null> {
  const db = getDb();
  const index = localCourses.findIndex((c) => c.id === courseId);
  if (index === -1) return null;

  const updatedCourse = {
    ...localCourses[index],
    ...courseInput,
  };

  // Recalculate duration based on curriculum lessons
  if (courseInput.curriculum) {
    updatedCourse.duration = courseInput.curriculum.reduce(
      (sum, m) => sum + m.lessons.reduce((lSum, l) => lSum + l.duration, 0),
      0
    );
  }

  if (db) {
    try {
      await setDoc(doc(db, 'courses', courseId), updatedCourse, { merge: true });
    } catch (e) {
      console.error('Failed to update course in Firestore:', e);
    }
  }

  localCourses[index] = updatedCourse;
  return updatedCourse;
}

export async function deleteCourse(courseId: string): Promise<void> {
  const db = getDb();
  if (db) {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
    } catch (e) {
      console.error('Failed to delete course in Firestore:', e);
    }
  }

  localCourses = localCourses.filter((c) => c.id !== courseId);
}

export async function publishCourse(courseId: string, publish: boolean): Promise<Course | null> {
  return updateCourse(courseId, { status: publish ? 'published' : 'draft' });
}

/* ── Student Progress & Analytics ─────────────────────────── */

export type StudentProgress = {
  userId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  completedCount: number;
  totalLessons: number;
  enrolledAt: string;
  lastAccessedAt: string;
  certificateEarned: boolean;
};

export async function getCourseStudents(courseId: string): Promise<StudentProgress[]> {
  const db = getDb();
  const course = localCourses.find((c) => c.id === courseId);
  if (!course) return [];

  const totalLessons = course.curriculum.reduce((sum, m) => sum + m.lessons.length, 0);

  if (!db) {
    // Filter mock enrollments
    const enrolls = mockEnrollments.filter((e) => e.courseId === courseId);
    return enrolls.map((e) => {
      // Map names based on student ID in enrollments
      let studentName = 'Student Learner';
      let studentEmail = 'student@example.com';
      if (e.userId === 'mock-user') {
        studentName = 'Aarav Mehta';
        studentEmail = 'aarav.mehta@example.com';
      }
      return {
        userId: e.userId,
        studentName,
        studentEmail,
        courseId: e.courseId,
        courseTitle: course.title,
        progress: e.progress,
        completedCount: e.completedLessons.length,
        totalLessons,
        enrolledAt: e.enrolledAt,
        lastAccessedAt: e.lastAccessedAt,
        certificateEarned: e.certificateEarned,
      };
    });
  }

  try {
    const q = query(collection(db, 'enrollments'), where('courseId', '==', courseId));
    const snap = await getDocs(q);
    const list: StudentProgress[] = [];

    for (const d of snap.docs) {
      const e = d.data() as Enrollment;
      // Fetch user detail for profile info
      let studentName = 'Student Learner';
      let studentEmail = 'student@example.com';
      try {
        const userDoc = await getDoc(doc(db, 'users', e.userId));
        if (userDoc.exists()) {
          const u = userDoc.data();
          studentName = u.name ?? studentName;
          studentEmail = u.email ?? studentEmail;
        }
      } catch {}

      list.push({
        userId: e.userId,
        studentName,
        studentEmail,
        courseId: e.courseId,
        courseTitle: course.title,
        progress: e.progress,
        completedCount: e.completedLessons.length,
        totalLessons,
        enrolledAt: e.enrolledAt,
        lastAccessedAt: e.lastAccessedAt,
        certificateEarned: e.certificateEarned,
      });
    }
    return list;
  } catch {
    return [];
  }
}

/* ── Assignment Grading ───────────────────────────────────── */

export async function getCourseSubmissions(courseId?: string): Promise<TeacherSubmission[]> {
  const db = getDb();
  let dbSubmissions: TeacherSubmission[] = [];

  if (db) {
    try {
      const collRef = collection(db, 'submissions');
      const q = courseId
        ? query(collRef, where('courseId', '==', courseId))
        : collRef;
      const snap = await getDocs(q);

      for (const d of snap.docs) {
        const data = d.data();
        const s = data as TeacherSubmission;
        
        // Load course & student details
        const c = localCourses.find((course) => course.id === s.courseId);
        let studentName = s.studentName ?? 'Learner';
        let studentEmail = s.studentEmail ?? '';

        try {
          const userDoc = await getDoc(doc(db, 'users', s.userId));
          if (userDoc.exists()) {
            const u = userDoc.data();
            studentName = u.name ?? studentName;
            studentEmail = u.email ?? studentEmail;
          }
        } catch {}

        dbSubmissions.push({
          ...s,
          id: d.id,
          courseTitle: c?.title ?? 'Course',
          studentName,
          studentEmail,
          status: s.score !== undefined ? 'graded' : 'ungraded',
        });
      }
    } catch (e) {
      console.error('Failed to load submissions from Firestore:', e);
    }
  }

  const merged = [...dbSubmissions];
  for (const localSub of localSubmissions) {
    if (courseId && localSub.courseId !== courseId) continue;
    const dbSubIdx = merged.findIndex((s) => s.id === localSub.id);
    if (dbSubIdx === -1) {
      merged.push(localSub);
    } else {
      merged[dbSubIdx] = localSub;
    }
  }
  return merged;
}

export async function gradeSubmission(
  submissionId: string,
  score: number,
  feedback: string
): Promise<TeacherSubmission | null> {
  const db = getDb();
  const idx = localSubmissions.findIndex((s) => s.id === submissionId);
  if (idx === -1) return null;

  const updated: TeacherSubmission = {
    ...localSubmissions[idx],
    score,
    feedback,
    status: 'graded',
  };

  if (db) {
    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        score,
        feedback,
      });
    } catch (e) {
      console.error('Failed to grade submission in Firestore:', e);
    }
  }

  localSubmissions[idx] = updated;
  return updated;
}

/* ── Announcements ────────────────────────────────────────── */

export async function getCourseAnnouncements(courseId: string): Promise<Announcement[]> {
  const db = getDb();
  if (!db) {
    return localAnnouncements.filter((a) => a.courseId === courseId);
  }

  try {
    const q = query(collection(db, 'announcements'), where('courseId', '==', courseId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Announcement);
  } catch {
    return localAnnouncements.filter((a) => a.courseId === courseId);
  }
}

export async function createAnnouncement(courseId: string, title: string, message: string): Promise<Announcement> {
  const course = localCourses.find((c) => c.id === courseId);
  const now = new Date().toISOString();
  const annId = `ann-${Date.now()}`;

  const newAnn: Announcement = {
    id: annId,
    courseId,
    courseTitle: course?.title ?? 'Course',
    title,
    message,
    createdAt: now,
  };

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, 'announcements', annId), newAnn);
      
      // Also send a general notification to all enrolled users of this course
      const enrollsQuery = query(collection(db, 'enrollments'), where('courseId', '==', courseId));
      const enrollsSnap = await getDocs(enrollsQuery);
      for (const edoc of enrollsSnap.docs) {
        const e = edoc.data() as Enrollment;
        const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await setDoc(doc(db, 'notifications', notifId), {
          id: notifId,
          userId: e.userId,
          type: 'general',
          title: `Announcement: ${title}`,
          message: `Announcement in "${course?.title}": ${message.substring(0, 100)}...`,
          read: false,
          createdAt: now,
          linkUrl: `/learn/${courseId}`,
        });
      }
    } catch (e) {
      console.error('Failed to create announcement or notifications:', e);
    }
  }

  localAnnouncements.unshift(newAnn);
  return newAnn;
}
