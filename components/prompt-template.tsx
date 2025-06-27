"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, FileText, ArrowRight, Check } from "lucide-react"

interface PromptTemplateProps {
  template: string
  variables: string[]
  onComplete: (values: Record<string, string>) => void
}

export default function PromptTemplate({ template, variables, onComplete }: PromptTemplateProps) {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const handleVariableChange = (variable: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [variable]: value }))
  }

  const handleCopyTemplate = async () => {
    await navigator.clipboard.writeText(template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContinue = () => {
    onComplete(variableValues)
  }

  const allVariablesFilled = variables.every((variable) => variableValues[variable]?.trim())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
          <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Your Prompt Template</h1>
          <p className="text-muted-foreground">
            Here&apos;s your generated prompt with variables. Fill in sample values to test it.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Template</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleCopyTemplate}>
                    {copied ? (
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
                <CardDescription>
                  Variables are highlighted in brackets. Copy this template to use in your applications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">{template}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Variable Values</CardTitle>
                <CardDescription>Enter sample values for each variable to test your prompt.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {variables.map((variable, index) => (
                  <motion.div
                    key={variable}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Label htmlFor={variable}>{variable}</Label>
                      <Badge variant="secondary" className="text-xs">
                        Variable
                      </Badge>
                    </div>
                    <Input
                      id={variable}
                      placeholder={`Enter value for ${variable}...`}
                      value={variableValues[variable] || ""}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                    />
                  </motion.div>
                ))}

                <div className="pt-4">
                  <Button onClick={handleContinue} disabled={!allVariablesFilled} className="w-full" size="lg">
                    Test Prompt
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
