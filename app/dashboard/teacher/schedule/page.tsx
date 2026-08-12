'use client';

import { useState, useMemo } from 'react';
import { CalendarDays, Clock, Plus, Tag, Calendar, UserCheck } from 'lucide-react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import AnnouncementPanel from '../../../../components/lms/AnnouncementPanel';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../../components/AuthProvider';
import { useCourseAnnouncements, useTeacherCourses } from '../../../../lib/lms/hooks-teacher';
import { formatDate } from '../../../../lib/lms/utils';

type Event = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  type: 'lecture' | 'office-hours' | 'assignment-due';
  dateTime: string;
  location: string;
};

const initialEvents: Event[] = [
  {
    id: 'evt-1',
    courseId: 'course-react',
    courseTitle: 'React Masterclass: From Zero to Hero',
    title: 'React Custom Hooks Workshop (Live)',
    type: 'lecture',
    dateTime: '2026-07-16T15:00:00Z',
    location: 'ShikshaSetu Virtual Classroom Room 1',
  },
  {
    id: 'evt-2',
    courseId: 'course-uiux',
    courseTitle: 'UI/UX Design Foundations',
    title: 'Figma Auto-Layout & Prototyping Review',
    type: 'office-hours',
    dateTime: '2026-07-15T16:00:00Z',
    location: 'ShikshaSetu Virtual Classroom Room 2',
  },
];

export default function EducatorSchedulePage() {
  const { user } = useAuth();
  const { courses, loading: coursesLoading } = useTeacherCourses(user?.uid);
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  // Announcements hook
  const activeCourseId = selectedCourseId || (courses[0]?.id ?? '');
  const { announcements, loading: annsLoading, add: addAnnouncement } = useCourseAnnouncements(activeCourseId);

  // Events local state
  const [events, setEvents] = useState<Event[]>(initialEvents);
  
  // Create Event Fields
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<'lecture' | 'office-hours'>('lecture');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const activeCourse = useMemo(
    () => courses.find((c) => c.id === activeCourseId),
    [courses, activeCourseId]
  );

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate || !activeCourse) return;

    const newEvt: Event = {
      id: `evt-${Date.now()}`,
      courseId: activeCourse.id,
      courseTitle: activeCourse.title,
      title: eventTitle,
      type: eventType,
      dateTime: new Date(eventDate).toISOString(),
      location: eventLocation || 'Virtual Classroom',
    };

    setEvents([newEvt, ...events]);
    setEventTitle('');
    setEventDate('');
    setEventLocation('');
    setIsAddingEvent(false);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => !selectedCourseId || evt.courseId === selectedCourseId);
  }, [events, selectedCourseId]);

  return (
    <RoleProtectedRoute allowedRoles={['teacher', 'admin']}>
      <DashboardShell
        title="Study Schedule & Bulletins"
        subtitle="Configure study sessions, office hours, and broadcast course announcements."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard/teacher' }, { label: 'Schedule' }]}
      >
        <div className="space-y-6">
          {/* Top selection dropdown */}
          <div className="flex justify-end rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-soft">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="rounded-xl border border-slate-850 bg-slate-900/60 px-3 py-2 text-xs text-slate-200 outline-none focus:border-violet-500"
            >
              <option value="">Select Course Filter</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Calendar Events Planner Column */}
            <div className="space-y-6">
              <DashboardCard
                title="Class Planner Calendar"
                description="List of scheduled events for your students."
              >
                {isAddingEvent ? (
                  <form onSubmit={handleAddEvent} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 space-y-3 text-xs mb-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-semibold text-white">Create Schedule Event</span>
                      <button type="button" onClick={() => setIsAddingEvent(false)} className="text-slate-500 hover:text-white">×</button>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Event Title</label>
                      <input
                        type="text"
                        required
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        placeholder="e.g. review session, doubt solving..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Event Type</label>
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value as any)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                        >
                          <option value="lecture">Live Lecture</option>
                          <option value="office-hours">Office Hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Date & Time</label>
                        <input
                          type="datetime-local"
                          required
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">Location / Classroom Link</label>
                      <input
                        type="text"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="Virtual Classroom link..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-400 transition"
                      >
                        Publish Event
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => {
                        if (!activeCourseId) {
                          alert('Please select or create a course first.');
                          return;
                        }
                        setIsAddingEvent(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-bold text-violet-300 hover:text-white transition"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Event
                    </button>
                  </div>
                )}

                {filteredEvents.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">No scheduled sessions.</p>
                ) : (
                  <div className="space-y-3">
                    {filteredEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="rounded-2xl border border-slate-850 bg-slate-900/40 p-4 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              evt.type === 'lecture' ? 'border-violet-500/20 bg-violet-500/10 text-violet-300' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                            }`}>
                              {evt.type === 'lecture' ? 'Lecture' : 'Office Hours'}
                            </span>
                            <h4 className="text-sm font-semibold text-white mt-1.5">{evt.title}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{evt.courseTitle}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-900 text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-550" />
                            {new Date(evt.dateTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <span className="flex items-center gap-1 truncate max-w-[200px]" title={evt.location}>
                            <Tag className="h-3.5 w-3.5 text-slate-550" />
                            {evt.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DashboardCard>
            </div>

            {/* Bulletins Announcements Column */}
            <div>
              <DashboardCard
                title="Class Announcements"
                description={`Broadcasting updates for ${activeCourse?.title ?? 'selected course'}.`}
              >
                {coursesLoading || annsLoading ? (
                  <LmsSkeletonLoader type="sidebar" />
                ) : !activeCourseId ? (
                  <p className="text-center text-xs text-slate-600 py-6">Please create a course to post bulletins.</p>
                ) : (
                  <AnnouncementPanel
                    announcements={announcements}
                    onAddAnnouncement={addAnnouncement}
                  />
                )}
              </DashboardCard>
            </div>
          </div>
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
