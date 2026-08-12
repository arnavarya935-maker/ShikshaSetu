import { NextResponse } from 'next/server';

// Helper to verify Firebase ID token via REST endpoint
async function verifyFirebaseToken(token: string, firebaseApiKey: string): Promise<boolean> {
  if (!token || !firebaseApiKey) return false;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    // Verify token to ensure user is logged in
    if (firebaseApiKey && token) {
      const isValid = await verifyFirebaseToken(token, firebaseApiKey);
      if (!isValid) {
        return NextResponse.json({ error: 'Unauthorized: Invalid credentials token' }, { status: 401 });
      }
    } else if (process.env.NODE_ENV === 'production') {
      // In production, enforce authentication strictly
      return NextResponse.json({ error: 'Unauthorized: Credentials required' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please configure GEMINI_API_KEY in your environment.' },
        { status: 500 }
      );
    }

    // Direct Gemini REST API fetch
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    if (action === 'chat') {
      const { message, history } = body;
      const historyPrompt = (history ?? [])
        .map((h: any) => `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.content}`)
        .join('\n');
      
      const prompt = `You are a helpful, encouraging AI study tutor for ShikshaSetu (an LMS).
Solve the student's doubts, explain coding/design concepts clearly, and provide brief examples.
Respond in formatted Markdown (headers, bullet points, code blocks).

Conversation history:
${historyPrompt}
Student's question: ${message}
Tutor:`;

      const reply = await callGemini(geminiUrl, prompt);
      return NextResponse.json({ reply });
    }

    if (action === 'quiz') {
      const { topic, text } = body;
      const context = text || topic;
      const prompt = `You are an educational quiz generator. Generate exactly 3 multiple choice questions about the following topic or source material:
"${context}"

Output MUST be valid JSON conforming to this TypeScript type:
{
  questions: Array<{
    id: string;
    question: string;
    options: Array<{ id: string; text: string }>;
    correctOptionId: string; // 'a', 'b', 'c', or 'd'
    explanation: string;
  }>
}
Output only the JSON block. Do not write markdown tags or text around the JSON.`;

      const responseText = await callGemini(geminiUrl, prompt);
      const json = cleanAndParseJson(responseText);
      return NextResponse.json(json);
    }

    if (action === 'summary') {
      const { text } = body;
      const prompt = `You are an academic text summarizer. Create notes and flashcards for the following text:
"${text}"
Output MUST be valid JSON conforming to this TypeScript type:
{
  summary: string; // Brief executive summary
  takeaways: string[]; // List of core bullet point details
  flashcards: Array<{ front: string; back: string }>; // Key terms and definitions
}
Output only the JSON block. Do not write markdown tags or text around the JSON.`;

      const responseText = await callGemini(geminiUrl, prompt);
      const json = cleanAndParseJson(responseText);
      return NextResponse.json(json);
    }

    if (action === 'planner') {
      const { courseTitle, days, hours } = body;
      const prompt = `Create a weekly study timeline for course "${courseTitle}" spanning ${days} days with ${hours} hours daily commit.
Output MUST be valid JSON conforming to this TypeScript type:
{
  plan: Array<{
    week: string; // e.g. "Week 1"
    title: string; // e.g. "Foundations"
    tasks: string[]; // specific tasks
  }>
}
Output only the JSON block. Do not write markdown tags or text around the JSON.`;

      const responseText = await callGemini(geminiUrl, prompt);
      const json = cleanAndParseJson(responseText);
      return NextResponse.json(json);
    }

    if (action === 'search') {
      const { query, courses } = body;
      const coursesPrompt = (courses ?? []).map((c: any) => `ID: ${c.id}\nTitle: ${c.title}\nDescription: ${c.description}\nCategory: ${c.category}\nTags: ${c.tags?.join(', ')}\nLevel: ${c.level}`).join('\n\n');
      
      const prompt = `You are an educational search assistant for ShikshaSetu LMS.
Given a student's search query and a list of available courses, perform a semantic search.
Identify which courses are relevant to the query and rank them in order of relevance.
Return the results as a JSON object containing a list of course IDs sorted from most relevant to least relevant:
{
  "rankedIds": string[]
}
If no courses are relevant, return an empty array for "rankedIds".
Output only the JSON block. Do not write markdown tags or text around the JSON.

Search query: "${query}"

Available courses:
${coursesPrompt}`;

      const responseText = await callGemini(geminiUrl, prompt);
      const json = cleanAndParseJson(responseText);
      return NextResponse.json(json);
    }

    if (action === 'recommendations') {
      const { enrollments, availableCourses } = body;
      const enrollmentsPrompt = (enrollments ?? []).map((e: any) => `Course ID: ${e.courseId}, Progress: ${e.progress}%`).join('\n');
      const coursesPrompt = (availableCourses ?? []).map((c: any) => `ID: ${c.id}\nTitle: ${c.title}\nCategory: ${c.category}\nLevel: ${c.level}\nTags: ${c.tags?.join(', ')}`).join('\n\n');

      const prompt = `You are an educational advisor for ShikshaSetu LMS.
Given a student's enrolled courses and their progress, plus a list of all available courses in the catalog:
1. Write a personalized, highly encouraging, and specific study recommendation on what they should focus on next (e.g., resuming a course they are currently in and mentioning their exact progress). Limit this text to under 3 sentences.
2. Suggest exactly 2 courses from the available courses list that the student is NOT currently enrolled in (progress is not present or 0) that match their learning interests/categories.
Return the results as a JSON object of this structure:
{
  "focusRecommendation": string,
  "recommendedCourseIds": string[]
}
Output only the JSON block. Do not write markdown tags or text around the JSON.

Enrolled courses:
${enrollmentsPrompt || 'None (no active enrollments)'}

Available catalog courses:
${coursesPrompt}`;

      const responseText = await callGemini(geminiUrl, prompt);
      const json = cleanAndParseJson(responseText);
      return NextResponse.json(json);
    }

    return NextResponse.json({ error: `Invalid action type parameters: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error('Server AI endpoint error:', err);
    return NextResponse.json({ error: err.message || 'Server error calling AI API' }, { status: 500 });
  }
}

async function callGemini(url: string, prompt: string): Promise<string> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  
  if (!res.ok) throw new Error('Gemini API query failed');
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

function cleanAndParseJson(text: string) {
  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/gi, '')
    .trim();
  return JSON.parse(cleaned);
}

