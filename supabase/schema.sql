CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  goal TEXT NOT NULL,
  current_step TEXT NOT NULL CHECK (current_step IN ('landing', 'goal', 'questions', 'template', 'testing')),
  answers JSONB DEFAULT '{}',
  template TEXT,
  variables JSONB DEFAULT '{}',
  test_results JSONB DEFAULT '[]'
);

CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  template TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  resolved_prompt TEXT NOT NULL
);

CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  temperature DECIMAL(3,2) NOT NULL CHECK (temperature >= 0 AND temperature <= 2),
  response TEXT NOT NULL,
  response_time INTEGER NOT NULL -- in milliseconds
);

CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_current_step ON sessions(current_step);
CREATE INDEX idx_prompts_session_id ON prompts(session_id);
CREATE INDEX idx_results_prompt_id ON results(prompt_id);
CREATE INDEX idx_results_model ON results(model);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO models (id, name, provider, description) VALUES
  ('gpt-4', 'GPT-4', 'OpenAI', 'Most capable model'),
  ('gpt-3.5-turbo', 'GPT-3.5 Turbo', 'OpenAI', 'Fast and efficient'),
  ('claude-3-opus', 'Claude 3 Opus', 'Anthropic', 'Excellent reasoning'),
  ('claude-3-sonnet', 'Claude 3 Sonnet', 'Anthropic', 'Balanced performance');

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
