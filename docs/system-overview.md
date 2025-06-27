# System Overview - Meta-Prompting SaaS

**Last Updated**: 2025-01-18\
**Purpose**: Comprehensive system architecture and functionality overview

---

## Project Summary

A meta-prompting SaaS application that helps users create perfect prompts
through an AI-guided workflow. The application walks users through goal
definition, clarifying questions, template generation with variables, and
multi-LLM testing to produce optimized, reusable prompt templates.

### Key Capabilities

- **Goal-Driven Workflow**: Users start by defining their prompt engineering
  goals
- **AI-Powered Clarification**: Dynamic questions refine requirements and gather
  context
- **Variable Template System**: Create reusable prompts with placeholders for
  flexibility
- **Multi-Model Testing**: Test prompts across OpenAI (GPT-4, GPT-3.5) and
  Anthropic (Claude 3) models
- **One-Click Export**: Copy prompts and results directly to clipboard

---

## Architecture Overview

### Technology Stack

- **Frontend Framework**: Next.js 14.2.16 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Not implemented (planned)
- **Database**: Supabase (planned, not yet implemented)
- **Language**: TypeScript
- **Package Manager**: pnpm

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                Meta-Prompting SaaS Platform                 │
├─────────────────────────────────────────────────────────────┤
│                    Presentation Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Landing Page  │  │   Goal Input    │  │  Clarifying Q  │ │
│  │   (Hero + CTA)  │  │  (User Goals)   │  │  (AI Questions)│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐                    │
│  │ Prompt Template │  │  Model Testing  │                    │
│  │ (Variable Mgmt) │  │  (Multi-LLM)    │                    │
│  └─────────────────┘  └─────────────────┘                    │
├─────────────────────────────────────────────────────────────┤
│                      Business Logic                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Workflow State │  │ Template Engine │  │  Model Config  │ │
│  │   Management    │  │ (Variable Parse)│  │  (Parameters)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                        Data Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Local State   │  │  Supabase DB   │  │   LLM APIs     │ │
│  │  (React State)  │  │   (Planned)     │  │   (Planned)    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Landing Page & Workflow Container

**Location**: `app/page.tsx`

- **Step Management**: Controls the 5-step workflow (landing → goal → questions
  → template → testing)
- **State Orchestration**: Manages goal, answers, template, and variable states
- **Animated Transitions**: Framer Motion for smooth step transitions
- **Hero Section**: Value proposition with feature cards

### 2. Goal Input Component

**Location**: `components/goal-input.tsx`

- **Rich Text Input**: Textarea with character count and validation
- **Example Prompts**: Pre-filled examples for common use cases
- **Progress Indicator**: Visual feedback for workflow position
- **Input Validation**: Ensures meaningful goals before proceeding

### 3. Clarifying Questions Component

**Location**: `components/clarifying-questions.tsx`

- **Dynamic Question Generation**: AI-powered questions based on user goal
- **Context Gathering**: Collects requirements, format, and additional details
- **Adaptive Flow**: Questions adjust based on previous answers
- **Answer Storage**: Maintains question-answer pairs for template generation

### 4. Prompt Template Builder

**Location**: `components/prompt-template.tsx`

- **Variable Detection**: Automatically identifies [VARIABLE] placeholders
- **Template Preview**: Real-time preview with syntax highlighting
- **Variable Management**: Input fields for each detected variable
- **Copy Functionality**: One-click template copying

### 5. Model Testing Interface

**Location**: `components/prompt-testing.tsx` & `components/model-selection.tsx`

- **Multi-Model Support**: GPT-4, GPT-3.5 Turbo, Claude 3 Opus/Sonnet
- **Parameter Control**: Temperature slider (0-2) for creativity control
- **Live Testing**: Simulated API responses (real API integration planned)
- **Result Display**: Formatted output with copy functionality

---

## Data Flow

### Prompt Engineering Pipeline

1. **Goal Definition**: User inputs their prompt engineering objective
2. **Question Generation**: System generates clarifying questions based on goal
3. **Context Collection**: User answers provide context and requirements
4. **Template Generation**: AI creates a template with variable placeholders
5. **Variable Population**: User fills in template variables
6. **Model Testing**: Test the resolved prompt across different LLMs
7. **Export Results**: Copy prompts and results for external use

### Data Structures

#### Workflow State

```typescript
type Step = "landing" | "goal" | "questions" | "template" | "testing";

interface WorkflowState {
  currentStep: Step;
  goal: string;
  answers: Record<string, string>;
  promptTemplate: string;
  variables: string[];
  variableValues: Record<string, string>;
  selectedModel: string;
}
```

#### Model Configuration

```typescript
interface ModelConfig {
  id: string;
  name: string;
  provider: "OpenAI" | "Anthropic";
  description: string;
  parameters: {
    temperature: number;
    maxTokens?: number;
  };
}
```

---

## Current Implementation Status

### ✅ Completed Features

- **Landing Page**: Hero section with feature highlights
- **Goal Input Interface**: Text input with examples and validation
- **Clarifying Questions**: Dynamic questionnaire system
- **Template Generation**: Creates templates with variable placeholders
- **Variable Detection**: Automatic extraction of [VARIABLE] patterns
- **Model Selection**: Support for 4 LLM models with configurations
- **Testing Interface**: Simulated testing with result display
- **Copy Functionality**: Clipboard integration for prompts/results
- **Responsive Design**: Mobile-friendly UI with shadcn components
- **Dark Mode Support**: Theme provider with system preference detection

### 🔄 In Progress

- **Database Integration**: Supabase setup for user data persistence
- **Real LLM APIs**: Integration with OpenAI and Anthropic APIs
- **User Authentication**: Login/signup flow with Supabase Auth

### 📋 Planned Features

- **Prompt History**: Save and retrieve previous prompts
- **Template Library**: Share and discover community templates
- **Advanced Testing**: Batch testing with multiple parameter sets
- **Analytics Dashboard**: Track prompt performance metrics
- **Team Collaboration**: Share prompts within organizations
- **API Access**: Programmatic access to prompt generation

---

## Algorithm Details

### Variable Extraction Algorithm

The system extracts variables from templates using:

1. **Regex Pattern Matching**: `/\[([^\]]+)\]/g` to find [VARIABLE] patterns
2. **Deduplication**: Ensures unique variable list
3. **Case Preservation**: Maintains original variable casing
4. **Real-time Updates**: Re-extracts on template modifications

### Template Resolution

Template resolution process:

1. **Variable Mapping**: Maps variable names to user-provided values
2. **Global Replacement**: Replaces all instances of each variable
3. **Fallback Handling**: Unfilled variables remain as placeholders
4. **Escaping Support**: Handles special characters in replacements

---

## Performance Considerations

### Current Limitations

- **Client-Side Only**: No server-side rendering for dynamic content
- **Simulated Responses**: LLM responses are mocked, not real API calls
- **No Persistence**: Data lost on page refresh
- **Single User**: No multi-user or collaboration features

### Optimization Strategies

- **Code Splitting**: Lazy load heavy components (charts, markdown)
- **Debounced Updates**: Prevent excessive re-renders during typing
- **Memoization**: Cache expensive computations (variable extraction)
- **Progressive Enhancement**: Core features work without JavaScript

---

## Security & Privacy

### Current Implementation

- **Client-Side Processing**: No sensitive data sent to servers
- **No Data Storage**: All data remains in browser memory
- **HTTPS Only**: Enforced in production deployment
- **Input Sanitization**: Basic XSS protection on user inputs

### Planned Security

- **Row Level Security**: Supabase RLS for user data isolation
- **API Key Management**: Secure storage of LLM API keys
- **Rate Limiting**: Prevent abuse of LLM API calls
- **Content Filtering**: Prevent harmful prompt generation

---

## Development Guidelines

### Code Organization

```
meta-prompting-saas/
├── app/                   # Next.js app router pages
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   └── *.tsx            # Feature components
├── lib/                  # Utilities and helpers
│   ├── db/              # Database layer (planned)
│   └── utils.ts         # Common utilities
├── hooks/               # Custom React hooks
├── public/              # Static assets
└── docs/                # Documentation
```

### Key Principles

- **Component Composition**: Build with small, reusable components
- **Type Safety**: Leverage TypeScript for all new code
- **Accessibility**: Follow WCAG guidelines with shadcn/ui
- **Progressive Enhancement**: Ensure core functionality without JS

---

## Deployment & Operations

### Development Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

### Production Considerations

- **Environment Variables**: Store sensitive config in Vercel/env
- **Build Optimization**: Next.js automatic optimization
- **CDN Distribution**: Static assets served via Vercel Edge
- **Error Monitoring**: Implement Sentry or similar (planned)

---

## Future Roadmap

### Phase 1: MVP Enhancement (Current)

- ✅ Core workflow implementation
- ✅ UI/UX polish with shadcn
- 🔄 Database integration
- 📋 Real LLM API integration

### Phase 2: User Management (Q1 2025)

- User authentication
- Prompt history
- Personal template library
- Usage analytics

### Phase 3: Collaboration (Q2 2025)

- Team workspaces
- Template sharing
- Community marketplace
- API access

---

This system overview provides a comprehensive understanding of the
Meta-Prompting SaaS platform's architecture, capabilities, and development
status. For specific implementation details, refer to the individual component
documentation and code comments.

---

## Template Usage Instructions

**How to use this template:**

1. **Replace all placeholders** in brackets `[PLACEHOLDER]` with your
   project-specific information
2. **Update the architecture diagram** to reflect your system's structure
3. **Customize sections** - add, remove, or modify sections based on your
   project needs
4. **Fill in data structures** with your actual interfaces and types
5. **Update status icons** using: ✅ (completed), 🔄 (in progress), 📋 (planned)
6. **Maintain consistency** with your project's documentation style
7. **Keep it updated** as your project evolves

**Key placeholders to replace:**

- `[PROJECT_NAME]` - Your project's name
- `[DATE]` - Current date
- `[Component/Feature/etc.]` - Specific components, features, algorithms, etc.
- `[Description]` - Detailed descriptions of functionality
- `[File paths]` - Actual file locations in your project
- `[Status]` - Complete, Planned, Future, etc.
- `[package-manager]` - npm, yarn, pnpm, etc.

**Optional sections to customize:**

- Add more core components if needed
- Include additional algorithms or processes
- Expand security considerations
- Add deployment-specific information
- Include monitoring and observability details
