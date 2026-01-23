import { useState } from "react";
import { ChevronDown, Settings, ListChecks, MessageSquare, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamConfig, Difficulty } from "@/types/exam";
import { cn } from "@/lib/utils";

interface ExamSettingsProps {
  config: ExamConfig;
  onChange: (config: ExamConfig) => void;
  disabled?: boolean;
}

export function ExamSettings({ config, onChange, disabled }: ExamSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const enabledCount = [
    config.mcqEnabled,
    config.shortAnswerEnabled,
    config.longQuestionEnabled,
  ].filter(Boolean).length;

  const updateConfig = (partial: Partial<ExamConfig>) => {
    onChange({ ...config, ...partial });
  };

  const handleToggleType = (type: "mcq" | "shortAnswer" | "longQuestion", checked: boolean) => {
    // Prevent disabling if it's the last enabled type
    if (!checked && enabledCount <= 1) {
      return;
    }

    if (type === "mcq") {
      updateConfig({ mcqEnabled: checked });
    } else if (type === "shortAnswer") {
      updateConfig({ shortAnswerEnabled: checked });
    } else {
      updateConfig({ longQuestionEnabled: checked });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-accent/50 disabled:opacity-50"
      >
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Exam Settings</span>
          <span className="text-xs text-muted-foreground">
            ({enabledCount} question type{enabledCount !== 1 ? "s" : ""} selected)
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 border-t border-border p-4">
            {/* MCQ Section */}
            <div
              className={cn(
                "rounded-lg border p-4 transition-all duration-200",
                config.mcqEnabled
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-muted/30 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="mcq-enabled"
                    checked={config.mcqEnabled}
                    onCheckedChange={(checked) =>
                      handleToggleType("mcq", checked as boolean)
                    }
                    disabled={disabled || (enabledCount <= 1 && config.mcqEnabled)}
                  />
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" />
                    <Label
                      htmlFor="mcq-enabled"
                      className="cursor-pointer font-medium"
                    >
                      Multiple Choice
                    </Label>
                  </div>
                </div>
                {config.mcqEnabled && (
                  <span className="text-sm font-medium text-primary">
                    {config.mcqCount} questions
                  </span>
                )}
              </div>
              {config.mcqEnabled && (
                <div className="mt-4 pl-7">
                  <Slider
                    value={[config.mcqCount]}
                    onValueChange={([value]) => updateConfig({ mcqCount: value })}
                    min={1}
                    max={30}
                    step={1}
                    disabled={disabled}
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>30</span>
                  </div>
                </div>
              )}
            </div>

            {/* Short Answer Section */}
            <div
              className={cn(
                "rounded-lg border p-4 transition-all duration-200",
                config.shortAnswerEnabled
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-muted/30 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="short-answer-enabled"
                    checked={config.shortAnswerEnabled}
                    onCheckedChange={(checked) =>
                      handleToggleType("shortAnswer", checked as boolean)
                    }
                    disabled={disabled || (enabledCount <= 1 && config.shortAnswerEnabled)}
                  />
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <Label
                      htmlFor="short-answer-enabled"
                      className="cursor-pointer font-medium"
                    >
                      Short Answer
                    </Label>
                  </div>
                </div>
                {config.shortAnswerEnabled && (
                  <span className="text-sm font-medium text-primary">
                    {config.shortAnswerCount} questions
                  </span>
                )}
              </div>
              {config.shortAnswerEnabled && (
                <div className="mt-4 pl-7">
                  <Slider
                    value={[config.shortAnswerCount]}
                    onValueChange={([value]) =>
                      updateConfig({ shortAnswerCount: value })
                    }
                    min={1}
                    max={15}
                    step={1}
                    disabled={disabled}
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>15</span>
                  </div>
                </div>
              )}
            </div>

            {/* Long Question Section */}
            <div
              className={cn(
                "rounded-lg border p-4 transition-all duration-200",
                config.longQuestionEnabled
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-muted/30 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="long-question-enabled"
                    checked={config.longQuestionEnabled}
                    onCheckedChange={(checked) =>
                      handleToggleType("longQuestion", checked as boolean)
                    }
                    disabled={disabled || (enabledCount <= 1 && config.longQuestionEnabled)}
                  />
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <Label
                      htmlFor="long-question-enabled"
                      className="cursor-pointer font-medium"
                    >
                      Long Questions
                    </Label>
                  </div>
                </div>
                {config.longQuestionEnabled && (
                  <span className="text-sm font-medium text-primary">
                    {config.longQuestionCount} questions
                  </span>
                )}
              </div>
              {config.longQuestionEnabled && (
                <div className="mt-4 pl-7">
                  <Slider
                    value={[config.longQuestionCount]}
                    onValueChange={([value]) =>
                      updateConfig({ longQuestionCount: value })
                    }
                    min={1}
                    max={5}
                    step={1}
                    disabled={disabled}
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>
              )}
            </div>

            {/* Hint message */}
            {enabledCount <= 1 && (
              <p className="text-center text-xs text-muted-foreground">
                ⚠️ At least one question type must be selected
              </p>
            )}

            {/* Difficulty */}
            <div className="space-y-3 pt-2">
              <Label>Difficulty</Label>
              <Select
                value={config.difficulty}
                onValueChange={(value: Difficulty) =>
                  updateConfig({ difficulty: value })
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
