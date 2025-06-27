"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ArrowRight, Bot, User } from "lucide-react"

interface ClarifyingQuestionsProps {
  goal: string
  onComplete: (answers: Record<string, string>) => void
}

const questions = [
  {
    id: "context",
    question: "What context or background information should the AI consider?",
    placeholder: "Describe the setting, audience, or relevant background...",
  },
  {
    id: "requirements",
    question: "What are the specific requirements or constraints for the output?",
    placeholder: "Length, tone, format, specific elements to include/exclude...",
  },
  {
    id: "format",
    question: "What format should the output be in?",
    placeholder: "Paragraph, bullet points, JSON, table, specific structure...",
  },
]

export default function ClarifyingQuestions({ goal, onComplete }: ClarifyingQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [conversation, setConversation] = useState<Array<{ type: "bot" | "user"; content: string }>>([])

  useEffect(() => {
    // Add initial bot message
    setConversation([
      { type: "bot", content: `Great! I'll ask you a few questions to help create the perfect prompt for: "${goal}"` },
      { type: "bot", content: questions[0].question },
    ])
  }, [goal])

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return

    const currentQuestion = questions[currentQuestionIndex]
    const newAnswers = { ...answers, [currentQuestion.id]: currentAnswer }
    setAnswers(newAnswers)

    // Add user answer to conversation
    setConversation((prev) => [...prev, { type: "user", content: currentAnswer }])

    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      setCurrentAnswer("")

      // Add next question to conversation
      setTimeout(() => {
        setConversation((prev) => [...prev, { type: "bot", content: questions[nextIndex].question }])
      }, 500)
    } else {
      // All questions answered
      setTimeout(() => {
        setConversation((prev) => [
          ...prev,
          { type: "bot", content: "Perfect! I have everything I need to create your prompt template." },
        ])
        setTimeout(() => onComplete(newAnswers), 1000)
      }, 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAnswerSubmit()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Let&apos;s refine your prompt</h1>
          <Badge variant="secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </motion.div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {conversation.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {currentQuestionIndex < questions.length && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder={questions[currentQuestionIndex].placeholder}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[100px] resize-none"
                    autoFocus
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Press Cmd/Ctrl + Enter to continue</p>
                    <Button onClick={handleAnswerSubmit} disabled={!currentAnswer.trim()}>
                      {currentQuestionIndex === questions.length - 1 ? "Generate Prompt" : "Next Question"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
