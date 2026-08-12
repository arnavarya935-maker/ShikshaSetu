export type Announcement = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  message: string;
  createdAt: string;
};

export const mockAnnouncements: Announcement[] = [];
