'use client';

import type { QuizQuestion } from '../lms/types';
import { createClient } from '../supabase/client';

export type AiSummaryResponse = {
  summary: string;
  takeaways: string[];
  flashcards: { front: string; back: string }[];
  mindMap?: string;
};

export type AiPlanItem = {
  week: string;
  title: string;
  tasks: string[];
};

export type AiPlanResponse = {
  plan: AiPlanItem[];
};

export type RecommendationsResponse = {
  focusRecommendation: string;
  recommendedCourseIds: string[];
};

export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? '';
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

export async function askAiTutor(message: string, history: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'chat', message, history }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error('AI Tutor API Error:', err);
    return 'Sorry, there was an error contacting the study tutor. Please check your setup and API configuration.';
  }
}

export async function generateAiQuiz(topic: string, text?: string): Promise<QuizQuestion[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'quiz', topic, text }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.questions || [];
  } catch (err) {
    console.error('Quiz Generator API Error:', err);
    return [];
  }
}

export async function generateNotesAndSummary(text: string, mode: 'summary' | 'detailed' = 'summary'): Promise<AiSummaryResponse> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'summary', text, mode }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Summarizer API Error:', err);
    return {
      summary: 'Could not summarize text due to an error contacting the AI service.',
      takeaways: [],
      flashcards: [],
    };
  }
}

export async function generateStudyPlan(
  courseTitle: string,
  days: number,
  hours: number
): Promise<AiPlanResponse> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'planner', courseTitle, days, hours }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Planner API Error:', err);
    return { plan: [] };
  }
}

export async function smartSearchCourses(
  query: string,
  coursesList: { id: string; title: string; description: string; category: string; tags: string[]; level: string }[]
): Promise<string[]> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'search', query, courses: coursesList }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.rankedIds || [];
  } catch (err) {
    console.error('Smart Search API Error:', err);
    return [];
  }
}

export async function getAiRecommendations(
  enrollments: { courseId: string; progress: number }[],
  availableCourses: { id: string; title: string; category: string; level: string; tags: string[] }[]
): Promise<RecommendationsResponse> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'recommendations', enrollments, availableCourses }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('Recommendations API Error:', err);
    return {
      focusRecommendation: 'Unable to load study focus recommendation due to an API error.',
      recommendedCourseIds: [],
    };
  }
}

export async function explainConcept(concept: string, level: string): Promise<string> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'explain', concept, level }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.explanation;
  } catch (err) {
    console.error('Explain API Error:', err);
    return 'Sorry, there was an error generating the explanation. Please try again.';
  }
}

