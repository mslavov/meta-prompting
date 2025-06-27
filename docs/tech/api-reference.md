# API Reference - Meta-Prompting SaaS

**Last Updated**: 2025-01-18\
**Purpose**: Technical reference for API functions and data operations

---

## Overview

This document provides a comprehensive reference for all API functions, data
operations, and utility functions used in the Meta-Prompting SaaS application.

---

## Core Functions

### Prompt Generation Functions

#### `generatePromptTemplate(goal: string, answers: Record<string, string>): string`

**Location**: `app/page.tsx`

Generates a prompt template based on user's goal and clarifying question
answers.

**Parameters:**

- `goal` (string): The user's prompt engineering goal
- `answers` (Record<string, string>): Key-value pairs of question IDs and user
  answers

**Returns:**

- `string`: A prompt template with variable placeholders

**Example:**

```typescript
const template = generatePromptTemplate(
    "Create a customer support chatbot",
    {
        context: "E-commerce platform",
        requirements: "Friendly, helpful tone",
        format: "Conversational responses",
    },
);
```

**Current Implementation:**

- Returns a hardcoded template structure (AI generation planned)
- Includes standard placeholders: [CONTEXT], [REQUIREMENTS], [FORMAT],
  [USER_REQUEST], [ADDITIONAL_NOTES]

---

### Variable Extraction Functions

#### `extractVariables(template: string): string[]`

**Location**: `app/page.tsx`

Extracts variable names from a prompt template.

**Parameters:**

- `template` (string): The prompt template containing [VARIABLE] placeholders

**Returns:**

- `string[]`: Array of unique variable names (without brackets)

**Example:**

```typescript
const vars = extractVariables("Hello [NAME], your order [ORDER_ID] is ready");
// Returns: ["NAME", "ORDER_ID"]
```

**Algorithm:**

- Uses regex pattern `/\[([^\]]+)\]/g` to match bracketed text
- Removes brackets and returns inner content
- Automatically deduplicates variables

---

## Component APIs

### GoalInput Component

#### Props Interface

```typescript
interface GoalInputProps {
    onSubmit: (goal: string) => void;
}
```

**Methods:**

- `handleSubmit`: Validates and submits the user's goal
- `fillExample`: Pre-fills the textarea with example goals

---

### ClarifyingQuestions Component

#### Props Interface

```typescript
interface ClarifyingQuestionsProps {
    goal: string;
    onComplete: (answers: Record<string, string>) => void;
}
```

**State Management:**

- Tracks answers for each question
- Validates all questions are answered before submission

---

### PromptTemplate Component

#### Props Interface

```typescript
interface PromptTemplateProps {
    template: string;
    variables: string[];
    onComplete: (values: Record<string, string>) => void;
}
```

**Features:**

- Real-time variable value tracking
- Copy template functionality
- Progress validation

---

### PromptTesting Component

#### Props Interface

```typescript
interface PromptTestingProps {
    template: string;
    variables: string[];
    variableValues: Record<string, string>;
}
```

**Methods:**

- `resolvedPrompt`: Replaces variables with actual values
- `handleTestPrompt`: Simulates LLM API call
- `handleCopyPrompt`: Copies resolved prompt to clipboard
- `handleCopyResult`: Copies test result to clipboard

---

### ModelSelection Component

#### Props Interface

```typescript
interface ModelSelectionProps {
    selectedModel: string;
    onModelChange: (model: string) => void;
    temperature: number;
    onTemperatureChange: (temperature: number) => void;
}
```

**Available Models:**

```typescript
const models = [
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
];
```

---

## Utility Functions

### Theme Utilities

**Location**: `components/theme-provider.tsx`

Provides dark mode support using next-themes.

```typescript
interface ThemeProviderProps {
    children: React.ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
}
```

---

### UI Utilities

**Location**: `lib/utils.ts`

#### `cn(...inputs: ClassValue[]): string`

Merges class names with Tailwind CSS support.

**Example:**

```typescript
cn("px-4 py-2", isActive && "bg-primary", className);
```

---

## Data Structures

### Workflow Types

```typescript
// Step progression types
type Step = "landing" | "goal" | "questions" | "template" | "testing";

// Model configuration
interface ModelConfig {
    id: string;
    name: string;
    provider: "OpenAI" | "Anthropic";
    description: string;
}

// Question-answer pairs
type Answers = Record<string, string>;

// Variable values mapping
type VariableValues = Record<string, string>;
```

---

## State Management

### Application State Flow

1. **Landing State**
   - No persisted data
   - Entry point to workflow

2. **Goal State**
   - Stores: `goal: string`
   - Validates non-empty input

3. **Questions State**
   - Stores: `answers: Record<string, string>`
   - Requires all questions answered

4. **Template State**
   - Stores: `promptTemplate: string`, `variables: string[]`
   - Extracts variables automatically

5. **Testing State**
   - Stores: `variableValues: Record<string, string>`
   - Maintains model selection and parameters

---

## Event Handlers

### Common Patterns

```typescript
// Step progression
const handleNextStep = (data: any) => {
    // Store data in component state
    // Advance to next workflow step
    setCurrentStep(nextStep);
};

// Copy to clipboard
const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    // Show success feedback
};

// Form submission
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate data
    // Call parent callback
    onSubmit(data);
};
```

---

## Planned API Endpoints

### LLM Integration (Future)

```typescript
// POST /api/generate-template
interface GenerateTemplateRequest {
    goal: string;
    answers: Record<string, string>;
}

// POST /api/test-prompt
interface TestPromptRequest {
    prompt: string;
    model: string;
    temperature: number;
    maxTokens?: number;
}

// GET /api/models
interface ModelsResponse {
    models: ModelConfig[];
}
```

### User Management (Future)

```typescript
// POST /api/auth/signup
// POST /api/auth/login
// POST /api/auth/logout

// GET /api/user/prompts
// POST /api/user/prompts
// DELETE /api/user/prompts/:id
```

---

## Error Handling

### Current Implementation

- Client-side validation for required fields
- Basic error boundaries for component crashes
- Console logging for debugging

### Planned Improvements

- Structured error types
- User-friendly error messages
- Retry mechanisms for API calls
- Error tracking service integration

---

## Performance Considerations

### Optimization Techniques

1. **Component Memoization**
   - Heavy components wrapped in React.memo
   - useMemo for expensive computations

2. **Debouncing**
   - Variable extraction debounced during typing
   - Search inputs debounced

3. **Lazy Loading**
   - Code splitting for route components
   - Dynamic imports for heavy dependencies

---

This API reference will be expanded as new features are implemented, especially
when database integration and real LLM APIs are added.
