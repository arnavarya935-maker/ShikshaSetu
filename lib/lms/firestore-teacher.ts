import { createClient } from '../supabase/client';
import type { Course, Enrollment, Module } from './types';
import { courses as initialCourses } from './data/courses';
import { mockEnrollments } from './data/enrollments';
import { mockSubmissions, type TeacherSubmission } from './data/submissions';
import { mockAnnouncements, type Announcement } from './data/announcements';

function getDb() {
  return createClient();
}

// Stateful local copy to support additions/deletions in memory when offline or Supabase not configured
let localCourses = [...initialCourses];
let localSubmissions = [...mockSubmissions];
let localAnnouncements = [...mockAnnouncements];

/* ── Course Management ────────────────────────────────────── */

export async function getTeacherCourses(userId: string): Promise<Course[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('teacherId', userId);

    if (error || !data?.length) return localCourses;

    const dbCourses = data as Course[];
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
    ...((courseInput as any).teacherId ? {} : { teacherId: userId }),
  } as unknown as Course;

  try {
    const supabase = getDb();
    await supabase.from('courses').insert(newCourse);
  } catch (e) {
    console.error('Failed to create course in Supabase:', e);
  }

  localCourses.push(newCourse);
  return newCourse;
}

export async function updateCourse(courseId: string, courseInput: Partial<Course>): Promise<Course | null> {
  const index = localCourses.findIndex((c) => c.id === courseId);
  if (index === -1) return null;

  const updatedCourse = {
    ...localCourses[index],
    ...courseInput,
  };

  if (courseInput.curriculum) {
    updatedCourse.duration = courseInput.curriculum.reduce(
      (sum, m) => sum + m.lessons.reduce((lSum, l) => lSum + l.duration, 0),
      0
    );
  }

  try {
    const supabase = getDb();
    await supabase.from('courses').upsert(updatedCourse);
  } catch (e) {
    console.error('Failed to update course in Supabase:', e);
  }

  localCourses[index] = updatedCourse;
  return updatedCourse;
}

export async function deleteCourse(courseId: string): Promise<void> {
  try {
    const supabase = getDb();
    await supabase.from('courses').delete().eq('id', courseId);
  } catch (e) {
    console.error('Failed to delete course in Supabase:', e);
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
  const course = localCourses.find((c) => c.id === courseId);
  if (!course) return [];

  const totalLessons = course.curriculum.reduce((sum, m) => sum + m.lessons.length, 0);

  try {
    const supabase = getDb();
    const { data: enrollments, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('courseId', courseId);

    if (error || !enrollments?.length) {
      const enrolls = mockEnrollments.filter((e) => e.courseId === courseId);
      return enrolls.map((e) => ({
        userId: e.userId,
        studentName: e.userId === 'mock-user' ? 'Aarav Mehta' : 'Student Learner',
        studentEmail: e.userId === 'mock-user' ? 'aarav.mehta@example.com' : 'student@example.com',
        courseId: e.courseId,
        courseTitle: course.title,
        progress: e.progress,
        completedCount: e.completedLessons.length,
        totalLessons,
        enrolledAt: e.enrolledAt,
        lastAccessedAt: e.lastAccessedAt,
        certificateEarned: e.certificateEarned,
      }));
    }

    const list: StudentProgress[] = [];
    for (const e of enrollments as Enrollment[]) {
      let studentName = 'Student Learner';
      let studentEmail = 'student@example.com';
      try {
        const { data: userDoc } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', e.userId)
          .single();
        if (userDoc) {
          studentName = userDoc.name ?? studentName;
          studentEmail = userDoc.email ?? studentEmail;
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
  let dbSubmissions: TeacherSubmission[] = [];

  try {
    const supabase = getDb();
    let query = supabase.from('submissions').select('*');
    if (courseId) query = query.eq('courseId', courseId);
    const { data } = await query;

    if (data?.length) {
      for (const s of data as TeacherSubmission[]) {
        const c = localCourses.find((course) => course.id === s.courseId);
        let studentName = s.studentName ?? 'Learner';
        let studentEmail = s.studentEmail ?? '';

        try {
          const { data: userDoc } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', s.userId)
            .single();
          if (userDoc) {
            studentName = userDoc.name ?? studentName;
            studentEmail = userDoc.email ?? studentEmail;
          }
        } catch {}

        dbSubmissions.push({
          ...s,
          courseTitle: c?.title ?? 'Course',
          studentName,
          studentEmail,
          status: s.score !== undefined ? 'graded' : 'ungraded',
        });
      }
    }
  } catch (e) {
    console.error('Failed to load submissions from Supabase:', e);
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
  const idx = localSubmissions.findIndex((s) => s.id === submissionId);
  if (idx === -1) return null;

  const updated: TeacherSubmission = {
    ...localSubmissions[idx],
    score,
    feedback,
    status: 'graded',
  };

  try {
    const supabase = getDb();
    await supabase
      .from('submissions')
      .update({ score, feedback })
      .eq('id', submissionId);
  } catch (e) {
    console.error('Failed to grade submission in Supabase:', e);
  }

  localSubmissions[idx] = updated;
  return updated;
}

/* ── Announcements ────────────────────────────────────────── */

export async function getCourseAnnouncements(courseId: string): Promise<Announcement[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('courseId', courseId);

    if (error || !data?.length) return localAnnouncements.filter((a) => a.courseId === courseId);
    return data as Announcement[];
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

  try {
    const supabase = getDb();
    await supabase.from('announcements').insert(newAnn);

    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('userId')
      .eq('courseId', courseId);

    if (enrollments?.length) {
      const notifications = enrollments.map((e: any) => ({
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: e.userId,
        type: 'general',
        title: `Announcement: ${title}`,
        message: `Announcement in "${course?.title}": ${message.substring(0, 100)}...`,
        read: false,
        createdAt: now,
        linkUrl: `/learn/${courseId}`,
      }));
      await supabase.from('notifications').insert(notifications);
    }
  } catch (e) {
    console.error('Failed to create announcement in Supabase:', e);
  }

  localAnnouncements.unshift(newAnn);
  return newAnn;
}
