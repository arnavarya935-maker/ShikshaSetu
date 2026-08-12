'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Course, Enrollment, Note, Bookmark, Notification, Certificate, CourseLevel } from './types';
import type { SortOption } from './utils';
import { courses as allCourses } from './data/courses';
import { searchCourses, filterByCategory, filterByLevel, sortCourses } from './utils';
import { smartSearchCourses } from '../ai/client';
import {
  getEnrollments as fetchEnrollments,
  getEnrollment as fetchEnrollment,
  getNotes as fetchNotes,
  getBookmarks as fetchBookmarks,
  getNotifications as fetchNotifications,
  getCertificates as fetchCertificates,
  markNotificationRead as markRead,
  getCourses as fetchCourses,
  getCourseBySlug as fetchCourseBySlug,
} from './firestore';

/* ── useCourses ───────────────────────────────────────────── */

type UseCoursesFilters = {
  search?: string;
  category?: string;
  level?: string;
  sort?: SortOption;
};

export function useCourses(filters: UseCoursesFilters = {}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchFilteredCourses = async () => {
      setLoading(true);
      try {
        const allDbCourses = await fetchCourses();
        let result = [...allDbCourses];

        if (filters.search?.trim()) {
          const searchParams = result.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            category: c.category,
            tags: c.tags,
            level: c.level,
          }));
          const rankedIds = await smartSearchCourses(filters.search, searchParams);
          if (!cancelled && rankedIds && rankedIds.length > 0) {
            const rankedCourses = rankedIds
              .map((id) => result.find((c) => c.id === id))
              .filter((c): c is Course => !!c);
            if (rankedCourses.length > 0) {
              result = rankedCourses;
            } else {
              result = searchCourses(result, filters.search);
            }
          } else if (!cancelled) {
            result = searchCourses(result, filters.search);
          }
        }

        if (filters.category && !cancelled) {
          result = filterByCategory(result, filters.category);
        }
        if (filters.level && !cancelled) {
          result = filterByLevel(result, filters.level);
        }
        if (!cancelled) {
          result = sortCourses(result, filters.sort ?? 'popular');
          setCourses(result);
          setTotal(result.length);
        }
      } catch (err) {
        console.error('Smart search error:', err);
        if (!cancelled) {
          const allDbCourses = await fetchCourses();
          let result = [...allDbCourses];
          if (filters.search) result = searchCourses(result, filters.search);
          if (filters.category) result = filterByCategory(result, filters.category);
          if (filters.level) result = filterByLevel(result, filters.level);
          result = sortCourses(result, filters.sort ?? 'popular');
          setCourses(result);
          setTotal(result.length);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFilteredCourses();

    return () => {
      cancelled = true;
    };
  }, [filters.search, filters.category, filters.level, filters.sort]);

  return { courses, loading, total };
}


/* ── useCourse ────────────────────────────────────────────── */

export function useCourse(idOrSlug: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const c = await fetchCourseBySlug(idOrSlug);
        if (active) {
          setCourse(c);
        }
      } catch (e) {
        console.error('Failed to load course details from Firestore:', e);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchCourse();
    return () => {
      active = false;
    };
  }, [idOrSlug]);

  return { course, loading };
}

/* ── useEnrollments ───────────────────────────────────────── */

export function useEnrollments(userId: string | undefined) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const data = await fetchEnrollments(userId);
      if (!cancelled) {
        setEnrollments(data);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  return { enrollments, loading, setEnrollments };
}

/* ── useEnrollment ────────────────────────────────────────── */

export function useEnrollment(userId: string | undefined, courseId: string) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const data = await fetchEnrollment(userId, courseId);
      if (!cancelled) {
        setEnrollment(data);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId, courseId]);

  return { enrollment, loading, setEnrollment };
}

/* ── useNotes ─────────────────────────────────────────────── */

export function useNotes(userId: string | undefined, courseId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const data = await fetchNotes(userId, courseId);
    setNotes(data);
    setLoading(false);
  }, [userId, courseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { notes, loading, setNotes, refresh };
}

/* ── useBookmarks ─────────────────────────────────────────── */

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const data = await fetchBookmarks(userId);
    setBookmarks(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { bookmarks, loading, setBookmarks, refresh };
}

/* ── useNotifications ─────────────────────────────────────── */

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const data = await fetchNotifications(userId);
      if (!cancelled) {
        setNotifications(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    await markRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  return { notifications, loading, unreadCount, markAsRead };
}

/* ── useCertificates ──────────────────────────────────────── */

export function useCertificates(userId: string | undefined) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const data = await fetchCertificates(userId);
      if (!cancelled) {
        setCertificates(data);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  return { certificates, loading };
}
