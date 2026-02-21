import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { improveWriting } from '@/lib/openai';
import { WritingTaskId } from '@/types/writing';
import { createClient } from '@/lib/supabase/server';

const VALID_TASK_IDS: WritingTaskId[] = [1, 2, 3];

export async function POST(request: NextRequest) {
  // Auth + PRO check
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

  // Rate limiting (by user ID)
  const { allowed, remaining } = checkRateLimit(user.id);
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: 'Rate limit reached. Try again in an hour.' },
      {
        status: 429,
        headers: { 'X-RateLimit-Remaining': String(remaining) },
      }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  // Validate
  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const obj = body as Record<string, unknown>;

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

  const cefrLevel = typeof obj.cefrLevel === 'string' ? obj.cefrLevel : 'B1';
  const grammarNotes = Array.isArray(obj.grammarNotes) ? obj.grammarNotes : [];

  try {
    const improvedText = await improveWriting(
      obj.text as string,
      obj.prompt as string,
      cefrLevel,
      grammarNotes
    );

    return NextResponse.json(
      { success: true, improvedText },
      {
        status: 200,
        headers: { 'X-RateLimit-Remaining': String(remaining) },
      }
    );
  } catch (err) {
    console.error('Improvement error:', err);
    return NextResponse.json(
      {
        success: false,
        error: "Improvement error. Please try again.",
      },
      { status: 500 }
    );
  }
}
