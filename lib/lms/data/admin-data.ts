export type AdminUser = {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  institute: string;
  onboardingComplete: boolean;
  createdAt: string;
  status: 'active' | 'suspended';
};

export type PlatformIssue = {
  id: string;
  title: string;
  description: string;
  reporterName: string;
  reporterEmail: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
  createdAt: string;
};

export const mockAdminUsers: AdminUser[] = [];
export const mockPlatformIssues: PlatformIssue[] = [];
