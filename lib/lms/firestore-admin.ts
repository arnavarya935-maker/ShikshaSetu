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
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../firebase';
import type { Course } from './types';
import { courses as initialCourses } from './data/courses';
import { mockAdminUsers, mockPlatformIssues, type AdminUser, type PlatformIssue } from './data/admin-data';

function getDb() {
  return getFirebaseFirestore();
}

// Stateful local copies to support additions/deletions in memory when offline or Firestore not configured
let localAdminUsers = [...mockAdminUsers];
let localPlatformIssues = [...mockPlatformIssues];
let localCourses = [...initialCourses];

/* ── User & Role Administration ───────────────────────────── */

export async function getAllUsers(): Promise<AdminUser[]> {
  const db = getDb();
  if (!db) return localAdminUsers;

  try {
    const q = collection(db, 'users');
    const snap = await getDocs(q);
    const dbUsers = snap.docs.map((d) => {
      const data = d.data();
      return {
        uid: d.id,
        name: data.name ?? 'User',
        email: data.email ?? '',
        role: data.role ?? 'student',
        institute: data.institute ?? '',
        onboardingComplete: !!data.onboardingComplete,
        createdAt: data.createdAt ?? new Date().toISOString(),
        status: data.status ?? 'active',
      } as AdminUser;
    });

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
  const db = getDb();
  const idx = localAdminUsers.findIndex((u) => u.uid === uid);
  if (idx !== -1) {
    localAdminUsers[idx].role = role;
  }

  if (db) {
    try {
      await updateDoc(doc(db, 'users', uid), { role });
    } catch (e) {
      console.error('Failed to update user role in Firestore:', e);
    }
  }
}

export async function updateUserStatus(uid: string, status: 'active' | 'suspended'): Promise<void> {
  const db = getDb();
  const idx = localAdminUsers.findIndex((u) => u.uid === uid);
  if (idx !== -1) {
    localAdminUsers[idx].status = status;
  }

  if (db) {
    try {
      await updateDoc(doc(db, 'users', uid), { status });
    } catch (e) {
      console.error('Failed to update user status in Firestore:', e);
    }
  }
}

export async function deleteUser(uid: string): Promise<void> {
  const db = getDb();
  localAdminUsers = localAdminUsers.filter((u) => u.uid !== uid);

  if (db) {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (e) {
      console.error('Failed to delete user in Firestore:', e);
    }
  }
}

/* ── Platform Course Administration ────────────────────────── */

export async function getAllCoursesAdmin(): Promise<Course[]> {
  const db = getDb();
  if (!db) return localCourses;

  try {
    const q = collection(db, 'courses');
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

export async function deleteCourseAdmin(courseId: string): Promise<void> {
  const db = getDb();
  localCourses = localCourses.filter((c) => c.id !== courseId);

  if (db) {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
    } catch (e) {
      console.error('Failed to delete course by admin in Firestore:', e);
    }
  }
}

/* ── Platform Support & Troubleshooting ────────────────────── */

export async function getPlatformIssues(): Promise<PlatformIssue[]> {
  const db = getDb();
  if (!db) return localPlatformIssues;

  try {
    const q = collection(db, 'platformIssues');
    const snap = await getDocs(q);
    const dbIssues = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PlatformIssue);

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
  const db = getDb();
  const idx = localPlatformIssues.findIndex((i) => i.id === issueId);
  if (idx !== -1) {
    localPlatformIssues[idx].status = 'resolved';
  }

  if (db) {
    try {
      await updateDoc(doc(db, 'platformIssues', issueId), { status: 'resolved' });
    } catch (e) {
      console.error('Failed to resolve issue in Firestore:', e);
    }
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

  const db = getDb();
  if (db) {
    try {
      await setDoc(doc(db, 'platformIssues', id), newIssue);
    } catch (e) {
      console.error('Failed to file issue in Firestore:', e);
    }
  }

  localPlatformIssues.unshift(newIssue);
  return newIssue;
}
