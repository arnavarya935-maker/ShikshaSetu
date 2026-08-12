import { createClient } from '../supabase/client';
import type { Course } from './types';
import { courses as initialCourses } from './data/courses';
import { mockAdminUsers, mockPlatformIssues, type AdminUser, type PlatformIssue } from './data/admin-data';

function getDb() {
  return createClient();
}

// Stateful local copies to support additions/deletions in memory when offline or Supabase not configured
let localAdminUsers = [...mockAdminUsers];
let localPlatformIssues = [...mockPlatformIssues];
let localCourses = [...initialCourses];

/* ── User & Role Administration ───────────────────────────── */

export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase.from('users').select('*');

    if (error || !data?.length) return localAdminUsers;

    const dbUsers = data.map((d: any) => ({
      uid: d.id,
      name: d.name ?? 'User',
      email: d.email ?? '',
      role: d.role ?? 'student',
      institute: d.institute ?? '',
      onboardingComplete: !!d.onboardingComplete,
      createdAt: d.createdAt ?? new Date().toISOString(),
      status: d.status ?? 'active',
    } as AdminUser));

    const merged = [...dbUsers];
    for (const localUser of localAdminUsers) {
      const dbIdx = merged.findIndex((u) => u.uid === localUser.uid);
      if (dbIdx === -1) {
        merged.push(localUser);
      } else {
        merged[dbIdx] = localUser;
      }
    }
    return merged;
  } catch {
    return localAdminUsers;
  }
}

export async function updateUserRole(uid: string, role: 'student' | 'teacher' | 'admin'): Promise<void> {
  const idx = localAdminUsers.findIndex((u) => u.uid === uid);
  if (idx !== -1) {
    localAdminUsers[idx].role = role;
  }

  try {
    const supabase = getDb();
    await supabase.from('users').update({ role }).eq('id', uid);
  } catch (e) {
    console.error('Failed to update user role in Supabase:', e);
  }
}

export async function updateUserStatus(uid: string, status: 'active' | 'suspended'): Promise<void> {
  const idx = localAdminUsers.findIndex((u) => u.uid === uid);
  if (idx !== -1) {
    localAdminUsers[idx].status = status;
  }

  try {
    const supabase = getDb();
    await supabase.from('users').update({ status }).eq('id', uid);
  } catch (e) {
    console.error('Failed to update user status in Supabase:', e);
  }
}

export async function deleteUser(uid: string): Promise<void> {
  localAdminUsers = localAdminUsers.filter((u) => u.uid !== uid);

  try {
    const supabase = getDb();
    await supabase.from('users').delete().eq('id', uid);
  } catch (e) {
    console.error('Failed to delete user in Supabase:', e);
  }
}

/* ── Platform Course Administration ────────────────────────── */

export async function getAllCoursesAdmin(): Promise<Course[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase.from('courses').select('*');

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

export async function deleteCourseAdmin(courseId: string): Promise<void> {
  localCourses = localCourses.filter((c) => c.id !== courseId);

  try {
    const supabase = getDb();
    await supabase.from('courses').delete().eq('id', courseId);
  } catch (e) {
    console.error('Failed to delete course by admin in Supabase:', e);
  }
}

/* ── Platform Support & Troubleshooting ────────────────────── */

export async function getPlatformIssues(): Promise<PlatformIssue[]> {
  try {
    const supabase = getDb();
    const { data, error } = await supabase.from('platformIssues').select('*');

    if (error || !data?.length) return localPlatformIssues;

    const dbIssues = data as PlatformIssue[];
    const merged = [...dbIssues];
    for (const localIssue of localPlatformIssues) {
      const dbIdx = merged.findIndex((i) => i.id === localIssue.id);
      if (dbIdx === -1) {
        merged.push(localIssue);
      } else {
        merged[dbIdx] = localIssue;
      }
    }
    return merged;
  } catch {
    return localPlatformIssues;
  }
}

export async function resolvePlatformIssue(issueId: string): Promise<void> {
  const idx = localPlatformIssues.findIndex((i) => i.id === issueId);
  if (idx !== -1) {
    localPlatformIssues[idx].status = 'resolved';
  }

  try {
    const supabase = getDb();
    await supabase
      .from('platformIssues')
      .update({ status: 'resolved' })
      .eq('id', issueId);
  } catch (e) {
    console.error('Failed to resolve issue in Supabase:', e);
  }
}

export async function createPlatformIssue(issueInput: Omit<PlatformIssue, 'id' | 'createdAt' | 'status'>): Promise<PlatformIssue> {
  const id = `iss-${Date.now()}`;
  const now = new Date().toISOString();
  const newIssue: PlatformIssue = {
    id,
    status: 'open',
    createdAt: now,
    ...issueInput,
  };

  try {
    const supabase = getDb();
    await supabase.from('platformIssues').insert(newIssue);
  } catch (e) {
    console.error('Failed to file issue in Supabase:', e);
  }

  localPlatformIssues.unshift(newIssue);
  return newIssue;
}
