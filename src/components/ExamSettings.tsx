import { useState } from "react";
import { ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

  const updateConfig = (partial: Partial<ExamConfig>) => {
    onChange({ ...config, ...partial });
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
          <div className="space-y-6 border-t border-border p-4">
            {/* MCQ Count */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Multiple Choice Questions</Label>
                <span className="text-sm font-medium text-primary">
                  {config.mcqCount}
                </span>
              </div>
              <Slider
                value={[config.mcqCount]}
                onValueChange={([value]) => updateConfig({ mcqCount: value })}
                min={0}
                max={30}
                step={1}
                disabled={disabled}
              />
            </div>

            {/* Short Answer Count */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Short Answer Questions</Label>
                <span className="text-sm font-medium text-primary">
                  {config.shortAnswerCount}
                </span>
              </div>
              <Slider
                value={[config.shortAnswerCount]}
                onValueChange={([value]) =>
                  updateConfig({ shortAnswerCount: value })
                }
                min={0}
                max={15}
                step={1}
                disabled={disabled}
              />
            </div>

            {/* Long Question Count */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Long Questions</Label>
                <span className="text-sm font-medium text-primary">
                  {config.longQuestionCount}
                </span>
              </div>
              <Slider
                value={[config.longQuestionCount]}
                onValueChange={([value]) =>
                  updateConfig({ longQuestionCount: value })
                }
                min={0}
                max={5}
                step={1}
                disabled={disabled}
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
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
