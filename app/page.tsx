"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Copy, Settings } from "lucide-react"
import GoalInput from "@/components/goal-input"
import ClarifyingQuestions from "@/components/clarifying-questions"
import PromptTemplate from "@/components/prompt-template"
import PromptTesting from "@/components/prompt-testing"

type Step = "landing" | "goal" | "questions" | "template" | "testing"

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<Step>("landing")
  const [goal, setGoal] = useState("")
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [promptTemplate, setPromptTemplate] = useState("")
  const [variables, setVariables] = useState<string[]>([])
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [selectedModel, setSelectedModel] = useState("")

  const handleGetStarted = () => {
    setCurrentStep("goal")
  }

  const handleGoalSubmit = (userGoal: string) => {
    setGoal(userGoal)
    setCurrentStep("questions")
  }

  const handleQuestionsComplete = (userAnswers: Record<string, string>) => {
    setAnswers(userAnswers)
    // Generate prompt template based on goal and answers
    const template = generatePromptTemplate(goal, userAnswers)
    const extractedVars = extractVariables(template)
    setPromptTemplate(template)
    setVariables(extractedVars)
    setCurrentStep("template")
  }

  const handleTemplateComplete = (values: Record<string, string>) => {
    setVariableValues(values)
    setCurrentStep("testing")
  }

  const generatePromptTemplate = (goal: string, answers: Record<string, string>) => {
    // This would typically call an AI service to generate the template
    return `You are an expert assistant helping with ${goal}. 

Context: ${answers.context || "[CONTEXT]"}
Requirements: ${answers.requirements || "[REQUIREMENTS]"}
Output Format: ${answers.format || "[FORMAT]"}

Please provide a comprehensive response that addresses the user's request: [USER_REQUEST]

Additional considerations: [ADDITIONAL_NOTES]`
  }

  const extractVariables = (template: string) => {
    const matches = template.match(/\[([^\]]+)\]/g)
    return matches ? matches.map((match) => match.slice(1, -1)) : []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AnimatePresence mode="wait">
        {currentStep === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-16"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <Badge variant="secondary" className="mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Prompt Engineering
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold tracking-tight mb-6"
              >
                Create Perfect Prompts with <span className="text-primary">Meta-Prompting</span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                Transform your ideas into powerful, variable-driven prompts. Test across multiple LLM providers and copy
                ready-to-use templates in minutes.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
              >
                <Card>
                  <CardHeader>
                    <Sparkles className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Smart Generation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      AI-powered clarifying questions help create precise, effective prompts
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Settings className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Multi-LLM Testing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Test your prompts across OpenAI, Anthropic, and other leading providers
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Copy className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Ready to Use</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Copy optimized prompts and results directly to your workflow</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}

        {currentStep === "goal" && <GoalInput key="goal" onSubmit={handleGoalSubmit} />}

        {currentStep === "questions" && (
          <ClarifyingQuestions key="questions" goal={goal} onComplete={handleQuestionsComplete} />
        )}

        {currentStep === "template" && (
          <PromptTemplate
            key="template"
            template={promptTemplate}
            variables={variables}
            onComplete={handleTemplateComplete}
          />
        )}

        {currentStep === "testing" && (
          <PromptTesting
            key="testing"
            template={promptTemplate}
            variables={variables}
            variableValues={variableValues}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
