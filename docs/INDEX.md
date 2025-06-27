# Documentation Index

**Last Updated**: 2025-01-18\
**Purpose**: Central navigation hub for Meta-Prompting SaaS documentation

---

## Project Overview

This is a Next.js project built with:

- **Frontend**: Next.js 14.2.16 + React 18
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **Backend**: Supabase (planned)
- **Analytics**: N/A (not implemented)
- **Package Manager**: pnpm

---

## Available Documentation

### 📋 **Project Management**

- [`progress.md`](progress.md) - Active task tracking and completion status
- [`task-archive.md`](task-archive.md) - Completed tasks archive
- [`RULES.md`](RULES.md) - Development rules and guidelines

### 🏗️ **Architecture & System**

- [`system-overview.md`](system-overview.md) - Comprehensive system architecture
  and functionality overview

### 📁 **Product Documentation**

- [`product/`](product/) - Product requirements, specifications, and user-facing
  documentation

### 🔧 **Technical Reference**

- [`tech/api-reference.md`](tech/api-reference.md) - API functions and data
  operations
- [`tech/database-reference.md`](tech/database-reference.md) - Database schema
  and configuration

### 🧪 **Core Features**

- **Goal Input**: Users define their prompt engineering goals
- **Clarifying Questions**: AI-powered questions to refine the prompt
- **Prompt Template Generation**: Create reusable templates with variables
- **Multi-LLM Testing**: Test prompts across OpenAI and Anthropic models
- **Copy & Export**: Easy copying of prompts and results

### 🔗 **Key Components**

- `goal-input.tsx` - Goal definition interface
- `clarifying-questions.tsx` - Dynamic questionnaire for prompt refinement
- `prompt-template.tsx` - Template creation with variable support
- `prompt-testing.tsx` - Multi-model testing interface
- `model-selection.tsx` - LLM provider and parameter configuration

---

## Current Project Structure

```
meta-prompting-saas/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # App layout
│   └── page.tsx           # Main page (landing + workflow)
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── goal-input.tsx     # Goal definition step
│   ├── clarifying-questions.tsx # AI-powered questions
│   ├── prompt-template.tsx # Template builder
│   ├── prompt-testing.tsx # Testing interface
│   ├── model-selection.tsx # Model config
│   └── theme-provider.tsx # Dark mode support
├── lib/                   # Utility libraries
│   ├── db/                # Supabase DB layer (planned)
│   └── utils.ts          # General utilities
├── hooks/                # Custom React hooks
│   ├── use-mobile.tsx    # Mobile detection
│   └── use-toast.ts      # Toast notifications
├── public/               # Static assets
│   └── placeholder-*.{svg,jpg,png} # Placeholder images
└── docs/                 # Documentation
    ├── INDEX.md          # This file
    ├── system-overview.md # System architecture
    ├── progress.md       # Task tracking
    ├── task-archive.md   # Completed tasks
    ├── RULES.md          # Development rules
    ├── product/          # Product documentation
    └── tech/             # Technical references
        ├── api-reference.md
        └── database-reference.md
```

---

## Development Guidelines

**Key Rules** (from [`RULES.md`](RULES.md)):

- Use pnpm as the package manager
- Use Supabase CLI for database migrations
- Use useSearchParams() with Suspense boundaries in client components
- Route database access through `lib/db/` layer
- Archive completed tasks from `progress.md` to `task-archive.md`

---

## Getting Started

1. **Install dependencies**: `pnpm install`
2. **Set up Supabase**: Configure your Supabase project (when implemented)
3. **Run development server**: `pnpm dev`
4. **Access the application**: Navigate to http://localhost:3000

---

## Status

**Documentation Status**: 🔄 Being populated with actual project information\
**Project Status**: MVP with core prompt engineering workflow

## Core Functionality

- **Goal Definition**: Users input their prompt engineering goals
- **AI Clarification**: Dynamic questions to refine prompt requirements
- **Template Generation**: Create reusable prompts with variable placeholders
- **Multi-Model Testing**: Test prompts on GPT-4, GPT-3.5, Claude 3 Opus/Sonnet
- **Parameter Tuning**: Adjust temperature and other model parameters
- **Copy & Export**: One-click copying of prompts and results

---

## Quick Task Lookup

### Common Development Tasks

| Task Type            | Documents to Read                        | Action Required                   |
| -------------------- | ---------------------------------------- | --------------------------------- |
| System Understanding | `system-overview.md`                     | Review architecture               |
| API Development      | `tech/api-reference.md`                  | Check existing endpoints          |
| Database Changes     | `tech/database-reference.md`, `RULES.md` | Follow migration rules            |
| Feature Development  | `product/` docs, `progress.md`           | Check requirements & status       |
| Bug Investigation    | `system-overview.md`, relevant tech docs | Understand data flow              |
| Performance Issues   | `system-overview.md`                     | Review architecture & limitations |

### Documentation Updates

| Change Type     | Primary Document                  | Secondary Updates              |
| --------------- | --------------------------------- | ------------------------------ |
| New Feature     | `system-overview.md`              | `INDEX.md`, relevant tech docs |
| API Changes     | `tech/api-reference.md`           | `system-overview.md`           |
| Database Schema | `tech/database-reference.md`      | `system-overview.md`           |
| Task Completion | `progress.md` → `task-archive.md` | Update completion date         |

---

**Quick Navigation:**

- 📋 [Task Progress](progress.md)
- 📜 [Development Rules](RULES.md)
- 🏗️ [System Overview](system-overview.md)
- 📁 [Product Documentation](product/)
- 🔗 [API Reference](tech/api-reference.md)
- 🗄️ [Database Reference](tech/database-reference.md)
- 📚 [Completed Tasks](task-archive.md)
