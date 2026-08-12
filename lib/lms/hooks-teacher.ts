'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Course, Module } from './types';
import type { TeacherSubmission } from './data/submissions';
import type { Announcement } from './data/announcements';
import {
  getTeacherCourses,
  createCourse as createCourseFn,
  updateCourse as updateCourseFn,
  deleteCourse as deleteCourseFn,
  publishCourse as publishCourseFn,
  getCourseStudents,
  getCourseSubmissions,
  gradeSubmission as gradeSubmissionFn,
  getCourseAnnouncements,
  createAnnouncement as createAnnouncementFn,
  type StudentProgress,
} from './firestore-teacher';

/* ── useTeacherCourses ────────────────────────────────────── */

export function useTeacherCourses(teacherId: string | undefined) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    const data = await getTeacherCourses(teacherId);
    setCourses(data);
    setLoading(false);
  }, [teacherId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (courseInput: Partial<Course>) => {
    if (!teacherId) return null;
    const c = await createCourseFn(teacherId, courseInput);
    await refresh();
    return c;
  }, [teacherId, refresh]);

  const update = useCallback(async (courseId: string, courseInput: Partial<Course>) => {
    const c = await updateCourseFn(courseId, courseInput);
    await refresh();
    return c;
  }, [refresh]);

  const remove = useCallback(async (courseId: string) => {
    await deleteCourseFn(courseId);
    await refresh();
  }, [refresh]);

  const togglePublish = useCallback(async (courseId: string, publish: boolean) => {
    const c = await publishCourseFn(courseId, publish);
    await refresh();
    return c;
  }, [refresh]);

  return { courses, loading, refresh, create, update, remove, togglePublish };
}

/* ── useCourseSubmissions ─────────────────────────────────── */

export function useCourseSubmissions(courseId?: string) {
  const [submissions, setSubmissions] = useState<TeacherSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getCourseSubmissions(courseId);
    setSubmissions(data);
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const grade = useCallback(async (submissionId: string, score: number, feedback: string) => {
    const updated = await gradeSubmissionFn(submissionId, score, feedback);
    await refresh();
    return updated;
  }, [refresh]);

  return { submissions, loading, refresh, grade };
}

/* ── useCourseStudents ────────────────────────────────────── */

export function useCourseStudents(courseId: string) {
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    const data = await getCourseStudents(courseId);
    setStudents(data);
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { students, loading, refresh };
}

/* ── useCourseAnnouncements ───────────────────────────────── */

export function useCourseAnnouncements(courseId: string) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    const data = await getCourseAnnouncements(courseId);
    setAnnouncements(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (title: string, message: string) => {
    if (!courseId) return null;
    const ann = await createAnnouncementFn(courseId, title, message);
    await refresh();
    return ann;
  }, [courseId, refresh]);

  return { announcements, loading, add, refresh };
}

/* ── useTeacherAnalytics ──────────────────────────────────── */

export function useTeacherAnalytics(teacherId: string | undefined) {
  const { courses, loading: coursesLoading } = useTeacherCourses(teacherId);
  const { submissions, loading: subsLoading } = useCourseSubmissions();
  
  const [loading, setLoading] = useState(true);
  const [enrollmentList, setEnrollmentList] = useState<StudentProgress[]>([]);

  // Get enrolled students across all teacher's courses
  useEffect(() => {
    if (coursesLoading || courses.length === 0) {
      if (!coursesLoading) setLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      setLoading(true);
      const all: StudentProgress[] = [];
      for (const c of courses) {
        const stud = await getCourseStudents(c.id);
        all.push(...stud);
      }
      if (isMounted) {
        setEnrollmentList(all);
        setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [courses, coursesLoading]);

  const stats = useMemo(() => {
    const activeClasses = courses.filter((c) => c.status === 'published').length;
    const totalStudents = enrollmentList.length;
    
    // Submissions waiting to grade
    const pendingGrading = submissions.filter((s) => s.status === 'ungraded').length;

    // Average rating
    const avgRating = courses.length > 0
      ? Number((courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1))
      : 5.0;

    return {
      activeClasses,
      totalStudents,
      pendingGrading,
      avgRating,
    };
  }, [courses, enrollmentList, submissions]);

  // Aggregate completion distribution
  const courseCompletionRates = useMemo(() => {
    return courses.map((c) => {
      const courseEnrolls = enrollmentList.filter((e) => e.courseId === c.id);
      const completes = courseEnrolls.filter((e) => e.progress >= 100).length;
      const rate = courseEnrolls.length > 0 
        ? Math.round((completes / courseEnrolls.length) * 100)
        : 0;

      return {
        id: c.id,
        title: c.title,
        studentsCount: courseEnrolls.length,
        completionRate: rate,
      };
    });
  }, [courses, enrollmentList]);

  return {
    stats,
    courseCompletionRates,
    enrollmentList,
    loading: coursesLoading || subsLoading || loading,
  };
}
