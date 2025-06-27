"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"
import { DatabaseService, Model } from "@/lib/database"

interface ModelSelectionProps {
  selectedModel: string
  onModelChange: (model: string) => void
  temperature: number
  onTemperatureChange: (temperature: number) => void
}

export default function ModelSelection({
  selectedModel,
  onModelChange,
  temperature,
  onTemperatureChange,
}: ModelSelectionProps) {
  const [models, setModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const fetchedModels = await DatabaseService.getActiveModels()
        setModels(fetchedModels)
      } catch (error) {
        console.error('Error fetching models:', error)
        setModels([
          { id: "gpt-4", name: "GPT-4", provider: "OpenAI", description: "Most capable model", is_active: true, created_at: "", updated_at: "" },
          { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", description: "Fast and efficient", is_active: true, created_at: "", updated_at: "" },
          { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", description: "Excellent reasoning", is_active: true, created_at: "", updated_at: "" },
          { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic", description: "Balanced performance", is_active: true, created_at: "", updated_at: "" },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <CardTitle>Model Configuration</CardTitle>
        </div>
        <CardDescription>Choose your LLM provider and adjust parameters for optimal results.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Model</Label>
          <Select value={selectedModel} onValueChange={onModelChange} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading models..." : "Select a model"} />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {model.provider} • {model.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Temperature</Label>
            <Badge variant="secondary">{temperature}</Badge>
          </div>
          <Slider
            value={[temperature]}
            onValueChange={(value) => onTemperatureChange(value[0])}
            max={2}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>More focused</span>
            <span>More creative</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
