# Database Reference - Meta-Prompting SaaS

**Last Updated**: 2025-01-18\
**Purpose**: Database schema, configuration, and access patterns

---

## Overview

This document describes the planned database schema for the Meta-Prompting SaaS
application using Supabase (PostgreSQL).

**Status**: 📋 Planned - Database integration not yet implemented

---

## Schema Design

### Core Tables

#### `users`

Stores user account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
```

#### `prompts`

Stores user-created prompt templates.

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  goal TEXT NOT NULL,
  template TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_prompts_user_id ON prompts(user_id);
CREATE INDEX idx_prompts_is_public ON prompts(is_public);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
```

#### `prompt_answers`

Stores answers to clarifying questions for each prompt.

```sql
CREATE TABLE prompt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  question_id VARCHAR(100) NOT NULL,
  question_text TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_prompt_answers_prompt_id ON prompt_answers(prompt_id);
```

#### `test_results`

Stores prompt testing results.

```sql
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  model VARCHAR(50) NOT NULL,
  temperature DECIMAL(3,2) NOT NULL,
  variable_values JSONB NOT NULL,
  resolved_prompt TEXT NOT NULL,
  result TEXT,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_test_results_prompt_id ON test_results(prompt_id);
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_model ON test_results(model);
```

#### `prompt_templates`

Community-shared prompt templates.

```sql
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100),
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  uses_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_prompt_templates_category ON prompt_templates(category);
CREATE INDEX idx_prompt_templates_likes ON prompt_templates(likes_count DESC);
CREATE INDEX idx_prompt_templates_uses ON prompt_templates(uses_count DESC);
```

#### `user_favorites`

Tracks user's favorite templates.

```sql
CREATE TABLE user_favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES prompt_templates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, template_id)
);

-- Indexes
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
```

---

## Row Level Security (RLS)

### Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Prompts table policies
CREATE POLICY "Users can view own prompts" ON prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public prompts" ON prompts
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own prompts" ON prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON prompts
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

---

## Database Functions

### Stored Procedures

#### `increment_likes_count`

```sql
CREATE OR REPLACE FUNCTION increment_likes_count(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompt_templates
  SET likes_count = likes_count + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;
```

#### `increment_uses_count`

```sql
CREATE OR REPLACE FUNCTION increment_uses_count(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompt_templates
  SET uses_count = uses_count + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;
```

#### `get_popular_templates`

```sql
CREATE OR REPLACE FUNCTION get_popular_templates(
  limit_count INTEGER DEFAULT 10,
  category_filter VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  goal TEXT,
  category VARCHAR,
  likes_count INTEGER,
  uses_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.id,
    p.title,
    p.goal,
    pt.category,
    pt.likes_count,
    pt.uses_count
  FROM prompt_templates pt
  JOIN prompts p ON pt.prompt_id = p.id
  WHERE pt.category = COALESCE(category_filter, pt.category)
  ORDER BY pt.likes_count DESC, pt.uses_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

---

## Data Access Patterns

### Common Queries

#### Get user's prompts

```typescript
// lib/db/prompts.ts
export async function getUserPrompts(userId: string) {
    const { data, error } = await supabase
        .from("prompts")
        .select(`
      *,
      prompt_answers(*)
    `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    return { data, error };
}
```

#### Create new prompt

```typescript
export async function createPrompt(promptData: {
    userId: string;
    title: string;
    goal: string;
    template: string;
    variables: string[];
    answers: Record<string, string>;
}) {
    // Start transaction
    const { data: prompt, error: promptError } = await supabase
        .from("prompts")
        .insert({
            user_id: promptData.userId,
            title: promptData.title,
            goal: promptData.goal,
            template: promptData.template,
            variables: promptData.variables,
        })
        .select()
        .single();

    if (promptError) return { error: promptError };

    // Insert answers
    const answers = Object.entries(promptData.answers).map(([key, value]) => ({
        prompt_id: prompt.id,
        question_id: key,
        question_text: key, // In real implementation, map to actual question text
        answer: value,
    }));

    const { error: answersError } = await supabase
        .from("prompt_answers")
        .insert(answers);

    return { data: prompt, error: answersError };
}
```

#### Search public templates

```typescript
export async function searchTemplates(query: string, category?: string) {
    let queryBuilder = supabase
        .from("prompt_templates")
        .select(`
      *,
      prompts!inner(title, goal, template)
    `);

    if (category) {
        queryBuilder = queryBuilder.eq("category", category);
    }

    if (query) {
        queryBuilder = queryBuilder.or(
            `prompts.title.ilike.%${query}%,prompts.goal.ilike.%${query}%`,
        );
    }

    const { data, error } = await queryBuilder
        .order("likes_count", { ascending: false })
        .limit(20);

    return { data, error };
}
```

---

## Migration Strategy

### Initial Setup

```bash
# Create migrations
supabase migration new create_users_table
supabase migration new create_prompts_tables
supabase migration new create_rls_policies

# Apply migrations
supabase db push
```

### Migration Files Structure

```
supabase/migrations/
├── 20250118000001_create_users_table.sql
├── 20250118000002_create_prompts_tables.sql
├── 20250118000003_create_rls_policies.sql
└── 20250118000004_create_functions.sql
```

---

## Backup and Recovery

### Backup Strategy

1. **Automated Backups**: Supabase provides daily automated backups
2. **Point-in-Time Recovery**: Available for Pro tier
3. **Manual Exports**: Periodic exports of critical data

### Recovery Procedures

```bash
# Restore from backup
supabase db restore --backup-id <backup-id>

# Export data
pg_dump <connection-string> > backup.sql
```

---

## Performance Optimization

### Indexing Strategy

- Primary keys on all tables
- Foreign key indexes for relationships
- Composite indexes for common query patterns
- Full-text search indexes for template search

### Query Optimization

- Use database functions for complex operations
- Implement pagination for large result sets
- Cache frequently accessed data
- Use connection pooling

---

## Monitoring

### Key Metrics

- Query performance (p95, p99)
- Connection pool utilization
- Storage usage
- Index usage statistics

### Alerts

- Slow query alerts (> 1s)
- Connection pool exhaustion
- Storage threshold (80%)
- Failed authentication attempts

---

This database reference will be updated as the schema evolves and new
requirements emerge.
