'use client';

import { useEffect, useState, useMemo } from 'react';
import RoleProtectedRoute from '../../../../components/RoleProtectedRoute';
import DashboardShell from '../../../../components/DashboardShell';
import DashboardCard from '../../../../components/DashboardCard';
import LmsSkeletonLoader from '../../../../components/lms/LmsSkeletonLoader';
import { useAuth } from '../../../../components/AuthProvider';
import { useEnrollments } from '../../../../lib/lms/hooks';
import { courses } from '../../../../lib/lms/data/courses';
import { getFirebaseFirestore } from '../../../../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { Calendar, CheckCircle2, AlertCircle, FileText, Loader2, Sparkles } from 'lucide-react';

type Submission = {
  id: string;
  assignmentId: string;
  userId: string;
  content: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
};

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { enrollments, loading: enrollLoading } = useEnrollments(user?.uid);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);
  
  // Submission form states
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Fetch submissions from Firestore
  const loadSubmissions = async () => {
    if (!user) {
      setSubsLoading(false);
      return;
    }
    const db = getFirebaseFirestore();
    if (!db) {
      setSubsLoading(false);
      return;
    }
    try {
      const q = query(collection(db, 'submissions'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Submission);
      setSubmissions(list);
    } catch (e) {
      console.error('Failed to load submissions:', e);
    } finally {
      setSubsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [user]);

  const loading = enrollLoading || subsLoading;

  // Scan curriculum of enrolled courses for assignments
  const allAssignments = useMemo(() => {
    const list: any[] = [];
    enrollments.forEach((enrollment) => {
      const course = courses.find((c) => c.id === enrollment.courseId);
      if (!course) return;

      course.curriculum.forEach((module) => {
        module.lessons.forEach((lesson) => {
          if (lesson.type === 'assignment' && lesson.assignment) {
            list.push({
              courseId: course.id,
              courseTitle: course.title,
              lessonId: lesson.id,
              ...lesson.assignment,
            });
          }
        });
      });
    });
    return list;
  }, [enrollments]);

  // Group assignments into Pending and Submitted
  const groupedAssignments = useMemo(() => {
    const pending: any[] = [];
    const submitted: any[] = [];

    allAssignments.forEach((assignment) => {
      const submission = submissions.find((s) => s.assignmentId === assignment.id);
      if (submission) {
        submitted.push({
          ...assignment,
          submission,
        });
      } else {
        pending.push(assignment);
      }
    });

    return { pending, submitted };
  }, [allAssignments, submissions]);

  const handleSubmit = async (assignmentId: string) => {
    if (!user || !submissionText.trim()) return;
    setSubmittingId(assignmentId);
    setToast(null);

    const db = getFirebaseFirestore();
    if (db) {
      try {
        const id = `sub-${Date.now()}`;
        const newSubmission: Submission = {
          id,
          assignmentId,
          userId: user.uid,
          content: submissionText,
          submittedAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'submissions', id), newSubmission);
        setToast('✅ Assignment submitted successfully!');
        setSubmissionText('');
        
        // Refresh submissions
        await loadSubmissions();
      } catch (err) {
        console.error('Failed to submit assignment:', err);
        setToast('❌ Submission failed. Please try again.');
      } finally {
        setSubmittingId(null);
      }
    } else {
      setToast('❌ Database connection error.');
      setSubmittingId(null);
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={['student']}>
      <DashboardShell
        title="Assignments"
        subtitle="Manage your coursework deadlines, submissions, and grades."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Assignments' }
        ]}
      >
        <div className="mx-auto max-w-4xl space-y-6">
          {toast && (
            <div className="rounded-2xl border border-violet-500/30 bg-slate-900 px-6 py-4 text-sm font-semibold text-violet-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
              {toast}
            </div>
          )}

          {loading ? (
            <LmsSkeletonLoader type="lessonContent" count={2} />
          ) : allAssignments.length === 0 ? (
            <DashboardCard title="Assignments Grid" description="Course assignments overview.">
              <p className="text-sm text-slate-400 text-center py-8">
                No assignments found. Enroll in a course to view assignments.
              </p>
            </DashboardCard>
          ) : (
            <div className="space-y-8">
              {/* To Do / Pending Section */}
              <DashboardCard
                title="To Do"
                description={`${groupedAssignments.pending.length} assignment${groupedAssignments.pending.length !== 1 ? 's' : ''} pending submission`}
              >
                {groupedAssignments.pending.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">🎉 You are all caught up! No pending assignments.</p>
                ) : (
                  <div className="space-y-6">
                    {groupedAssignments.pending.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col gap-4 shadow-soft"
                      >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">
                              {assignment.courseTitle}
                            </span>
                            <h3 className="text-base font-bold text-white mt-0.5">{assignment.title}</h3>
                          </div>
                          <div className="flex items-center gap-1.5 self-start sm:self-center text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Pending
                          </div>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed">{assignment.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span>Max Points: {assignment.maxScore}</span>
                        </div>

                        <div className="border-t border-slate-800/80 pt-4 mt-2">
                          <label className="block text-xs font-bold uppercase text-slate-450 dark:text-slate-400 tracking-wider">Your Solution</label>
                          <textarea
                            value={submittingId === assignment.id ? submissionText : ''}
                            onChange={(e) => {
                              setSubmittingId(assignment.id);
                              setSubmissionText(e.target.value);
                            }}
                            placeholder="Type your solution content or code repository links here..."
                            rows={4}
                            className="mt-2.5 w-full rounded-2xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-violet-500 transition-colors resize-none"
                          />
                          <div className="flex justify-end mt-3">
                            <button
                              type="button"
                              onClick={() => handleSubmit(assignment.id)}
                              disabled={submittingId === assignment.id ? !submissionText.trim() : true}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-500 px-5 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submittingId === assignment.id ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Submit Assignment
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DashboardCard>

              {/* Submitted / Graded Section */}
              <DashboardCard
                title="Submitted & Graded"
                description={`${groupedAssignments.submitted.length} assignment${groupedAssignments.submitted.length !== 1 ? 's' : ''} submitted`}
              >
                {groupedAssignments.submitted.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No submissions yet.</p>
                ) : (
                  <div className="space-y-6">
                    {groupedAssignments.submitted.map((item) => {
                      const isGraded = item.submission.score !== undefined;
                      return (
                        <div
                          key={item.id}
                          className="rounded-3xl border border-slate-850 bg-slate-950/40 p-6 flex flex-col gap-4 shadow-soft"
                        >
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                                {item.courseTitle}
                              </span>
                              <h3 className="text-base font-bold text-slate-200 mt-0.5">{item.title}</h3>
                            </div>
                            <div className={`flex items-center gap-1.5 self-start sm:self-center text-xs font-semibold px-3 py-1 rounded-full ${
                              isGraded
                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                : 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                            }`}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {isGraded ? `Graded: ${item.submission.score}/${item.maxScore}` : 'Submitted'}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-850 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Submitted Work</p>
                            <p className="mt-2 text-sm text-slate-350 whitespace-pre-wrap">{item.submission.content}</p>
                            <p className="mt-3 text-[10px] text-slate-500">
                              Submitted on: {new Date(item.submission.submittedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                            </p>
                          </div>

                          {isGraded && (
                            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                              <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Instructor Feedback</p>
                              <p className="mt-2 text-sm text-slate-200 leading-relaxed">{item.submission.feedback}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </DashboardCard>
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleProtectedRoute>
  );
}
