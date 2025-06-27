"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Target } from "lucide-react"

interface GoalInputProps {
  onSubmit: (goal: string) => void
}

export default function GoalInput({ onSubmit }: GoalInputProps) {
  const [goal, setGoal] = useState("")

  const handleSubmit = () => {
    if (goal.trim()) {
      onSubmit(goal.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-16"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Target className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">What's your goal?</h1>
          <p className="text-muted-foreground">
            Describe what you want your prompt to accomplish. Be as specific as possible.
          </p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Prompt Goal</CardTitle>
              <CardDescription>
                Examples: "Create a customer service chatbot response", "Generate product descriptions", "Analyze user
                feedback sentiment"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="I want to create a prompt that..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[120px] resize-none"
                autoFocus
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Press Cmd/Ctrl + Enter to continue</p>
                <Button onClick={handleSubmit} disabled={!goal.trim()} size="lg">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
