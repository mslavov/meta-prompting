"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Play, Check, Loader2, TestTube } from "lucide-react"
import ModelSelection from "@/components/model-selection"

interface PromptTestingProps {
  template: string
  variables: string[]
  variableValues: Record<string, string>
}

export default function PromptTesting({ template, variables, variableValues }: PromptTestingProps) {
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [temperature, setTemperature] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState("")
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedResult, setCopiedResult] = useState(false)

  const resolvedPrompt = variables.reduce((prompt, variable) => {
    return prompt.replace(new RegExp(`\\[${variable}\\]`, "g"), variableValues[variable] || `[${variable}]`)
  }, template)

  const handleTestPrompt = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResult(`This is a simulated response from ${selectedModel}. In a real implementation, this would be the actual LLM response based on your prompt and the selected model parameters.

The response would be generated using:
- Model: ${selectedModel}
- Temperature: ${temperature}
- Your resolved prompt with all variables filled in.

This demonstrates how your prompt template works with real variable values and gives you a preview of the expected output quality and format.`)
      setIsLoading(false)
    }, 2000)
  }

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(resolvedPrompt)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const handleCopyResult = async () => {
    await navigator.clipboard.writeText(result)
    setCopiedResult(true)
    setTimeout(() => setCopiedResult(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <TestTube className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Test Your Prompt</h1>
          <p className="text-muted-foreground">
            Configure your model settings and test your prompt with real variable values.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <ModelSelection
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              temperature={temperature}
              onTemperatureChange={setTemperature}
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resolved Prompt</CardTitle>
                    <CardDescription>Your template with all variables filled in</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
                    {copiedPrompt ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {resolvedPrompt}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button onClick={handleTestPrompt} disabled={isLoading} size="lg" className="px-8">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test Prompt
                  </>
                )}
              </Button>
            </div>

            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Result</CardTitle>
                        <CardDescription>Response from {selectedModel}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Temperature: {temperature}</Badge>
                        <Button variant="outline" size="sm" onClick={handleCopyResult}>
                          {copiedResult ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {result}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
