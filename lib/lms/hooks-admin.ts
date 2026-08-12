'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Course } from './types';
import type { AdminUser, PlatformIssue } from './data/admin-data';
import {
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourseAdmin,
  getPlatformIssues,
  resolvePlatformIssue,
  createPlatformIssue,
} from './firestore-admin';

/* ── useAdminUsers ────────────────────────────────────────── */

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const changeRole = useCallback(async (uid: string, role: 'student' | 'teacher' | 'admin') => {
    await updateUserRole(uid, role);
    await refresh();
  }, [refresh]);

  const toggleStatus = useCallback(async (uid: string, currentStatus: 'active' | 'suspended') => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await updateUserStatus(uid, nextStatus);
    await refresh();
  }, [refresh]);

  const removeUser = useCallback(async (uid: string) => {
    await deleteUser(uid);
    await refresh();
  }, [refresh]);

  return { users, loading, refresh, changeRole, toggleStatus, removeUser };
}

/* ── useAdminCourses ───────────────────────────────────────── */

export function useAdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getAllCoursesAdmin();
    setCourses(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeCourse = useCallback(async (courseId: string) => {
    await deleteCourseAdmin(courseId);
    await refresh();
  }, [refresh]);

  return { courses, loading, refresh, removeCourse };
}

/* ── useAdminIssues ────────────────────────────────────────── */

export function useAdminIssues() {
  const [issues, setIssues] = useState<PlatformIssue[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getPlatformIssues();
    setIssues(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const resolveIssue = useCallback(async (issueId: string) => {
    await resolvePlatformIssue(issueId);
    await refresh();
  }, [refresh]);

  const fileIssue = useCallback(async (issueInput: Omit<PlatformIssue, 'id' | 'createdAt' | 'status'>) => {
    await createPlatformIssue(issueInput);
    await refresh();
  }, [refresh]);

  return { issues, loading, refresh, resolveIssue, fileIssue };
}

/* ── useAdminAnalytics ─────────────────────────────────────── */

export function useAdminAnalytics() {
  const { users, loading: usersLoading } = useAdminUsers();
  const { courses, loading: coursesLoading } = useAdminCourses();
  const { issues, loading: issuesLoading } = useAdminIssues();

  const loading = usersLoading || coursesLoading || issuesLoading;

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const teachersCount = users.filter((u) => u.role === 'teacher').length;
    const studentsCount = users.filter((u) => u.role === 'student').length;
    const coursesCount = courses.length;
    
    // Open issues count
    const openIssues = issues.filter((i) => i.status === 'open').length;

    // Platform stability / health indicator
    const platformHealth = openIssues === 0 
      ? 'Excellent' 
      : openIssues < 3 
      ? 'Good' 
      : 'Review Needed';

    return {
      totalUsers,
      teachersCount,
      studentsCount,
      coursesCount,
      openIssues,
      platformHealth,
    };
  }, [users, courses, issues]);

  // Aggregate user growth distribution
  const usersRoleRatio = useMemo(() => {
    const teachers = users.filter((u) => u.role === 'teacher').length;
    const students = users.filter((u) => u.role === 'student').length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const total = users.length || 1;

    return {
      teachers: Math.round((teachers / total) * 100),
      students: Math.round((students / total) * 100),
      admins: Math.round((admins / total) * 100),
    };
  }, [users]);

  return {
    stats,
    usersRoleRatio,
    loading,
  };
}
