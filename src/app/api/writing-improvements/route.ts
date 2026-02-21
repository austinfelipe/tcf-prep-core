import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { improveWriting } from '@/lib/openai';
import { createClient } from '@/lib/supabase/server';
import { WritingTaskId, WritingImprovementRecord } from '@/types/writing';

const VALID_TASK_IDS: WritingTaskId[] = [1, 2, 3];

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single();

  if (!profile?.is_pro) {
    return NextResponse.json(
      { success: false, error: 'PRO subscription required' },
      { status: 403 }
    );
  }

  const sessionId = request.nextUrl.searchParams.get('sessionId');
  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'Missing sessionId parameter' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('writing_improvements')
    .select('session_id, task_id, original_text, improved_text, created_at')
    .eq('user_id', user.id)
    .eq('session_id', sessionId)
    .order('task_id', { ascending: true });

  if (error) {
    console.error('Fetch improvements error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch improvements' },
      { status: 500 }
    );
  }

  const improvements: WritingImprovementRecord[] = (data ?? []).map((row) => ({
    sessionId: row.session_id,
    taskId: row.task_id as WritingTaskId,
    originalText: row.original_text,
    improvedText: row.improved_text,
    createdAt: row.created_at,
  }));

  return NextResponse.json({ success: true, improvements });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', user.id)
    .single();

  if (!profile?.is_pro) {
    return NextResponse.json(
      { success: false, error: 'PRO subscription required' },
      { status: 403 }
    );
  }

  const { allowed, remaining } = checkRateLimit(user.id);
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: 'Rate limit reached. Try again in an hour.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const obj = body as Record<string, unknown>;

  if (typeof obj.sessionId !== 'string' || !obj.sessionId.trim()) {
    return NextResponse.json(
      { success: false, error: 'Missing sessionId' },
      { status: 400 }
    );
  }

  if (typeof obj.taskId !== 'number' || !VALID_TASK_IDS.includes(obj.taskId as WritingTaskId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid taskId' },
      { status: 400 }
    );
  }

  if (typeof obj.text !== 'string' || !obj.text.trim()) {
    return NextResponse.json(
      { success: false, error: 'Missing text' },
      { status: 400 }
    );
  }

  if (typeof obj.prompt !== 'string' || !obj.prompt.trim()) {
    return NextResponse.json(
      { success: false, error: 'Missing prompt' },
      { status: 400 }
    );
  }

  const sessionId = obj.sessionId as string;
  const taskId = obj.taskId as WritingTaskId;
  const text = obj.text as string;
  const prompt = obj.prompt as string;
  const cefrLevel = typeof obj.cefrLevel === 'string' ? obj.cefrLevel : 'B1';
  const grammarNotes = Array.isArray(obj.grammarNotes) ? obj.grammarNotes : [];

  // Check for existing cached improvement
  const { data: existing } = await supabase
    .from('writing_improvements')
    .select('session_id, task_id, original_text, improved_text, created_at')
    .eq('user_id', user.id)
    .eq('session_id', sessionId)
    .eq('task_id', taskId)
    .single();

  if (existing) {
    const improvement: WritingImprovementRecord = {
      sessionId: existing.session_id,
      taskId: existing.task_id as WritingTaskId,
      originalText: existing.original_text,
      improvedText: existing.improved_text,
      createdAt: existing.created_at,
    };
    return NextResponse.json(
      { success: true, improvement },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  }

  try {
    const improvedText = await improveWriting(text, prompt, cefrLevel, grammarNotes);

    const { data: inserted, error: insertError } = await supabase
      .from('writing_improvements')
      .upsert({
        user_id: user.id,
        session_id: sessionId,
        task_id: taskId,
        original_text: text,
        improved_text: improvedText,
      }, { onConflict: 'user_id,session_id,task_id' })
      .select('session_id, task_id, original_text, improved_text, created_at')
      .single();

    if (insertError || !inserted) {
      console.error('Insert improvement error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to save improvement' },
        { status: 500 }
      );
    }

    const improvement: WritingImprovementRecord = {
      sessionId: inserted.session_id,
      taskId: inserted.task_id as WritingTaskId,
      originalText: inserted.original_text,
      improvedText: inserted.improved_text,
      createdAt: inserted.created_at,
    };

    return NextResponse.json(
      { success: true, improvement },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (err) {
    console.error('Improvement generation error:', err);
    return NextResponse.json(
      { success: false, error: 'Improvement error. Please try again.' },
      { status: 500 }
    );
  }
}
