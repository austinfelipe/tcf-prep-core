import { NextRequest, NextResponse } from 'next/server';
import { validateEvaluationRequest } from '@/lib/writingValidation';
import { checkRateLimit } from '@/lib/rateLimit';
import { evaluateWriting } from '@/lib/openai';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  // Auth + PRO check
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: 'Authentification requise' },
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
      { success: false, error: 'Abonnement PRO requis' },
      { status: 403 }
    );
  }

  // Rate limiting (by user ID)
  const { allowed, remaining } = checkRateLimit(user.id);
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: 'Limite de requêtes atteinte. Réessayez dans une heure.' },
      {
        status: 429,
        headers: { 'X-RateLimit-Remaining': String(remaining) },
      }
    );
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const validation = validateEvaluationRequest(body);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    );
  }

  // Extract sessionId
  const sessionId =
    typeof (body as Record<string, unknown>).sessionId === 'string'
      ? (body as Record<string, unknown>).sessionId as string
      : `eval-${Date.now()}`;

  // Call OpenAI
  try {
    const result = await evaluateWriting(validation.data.tasks, sessionId);
    return NextResponse.json(
      { success: true, result },
      {
        status: 200,
        headers: { 'X-RateLimit-Remaining': String(remaining) },
      }
    );
  } catch (err) {
    console.error('Evaluation error:', err);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'évaluation. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
