CREATE TABLE public.writing_improvements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  task_id INTEGER NOT NULL CHECK (task_id IN (1, 2, 3)),
  original_text TEXT NOT NULL,
  improved_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, session_id, task_id)
);

ALTER TABLE public.writing_improvements ENABLE ROW LEVEL SECURITY;

-- Users can read their own improvements
CREATE POLICY "Users can read own improvements"
  ON public.writing_improvements FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own improvements
CREATE POLICY "Users can insert own improvements"
  ON public.writing_improvements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_writing_improvements_session
  ON public.writing_improvements(user_id, session_id);
