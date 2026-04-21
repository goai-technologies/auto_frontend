import { CheckCircle2, Circle } from "lucide-react";

export function OnboardingChecklist({ steps }: { steps: Array<{ label: string; done: boolean }> }) {
  return (
    <div className="space-y-2">
      {steps.map((step) => (
        <div key={step.label} className="flex items-center gap-2 text-sm">
          {step.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
          <span className={step.done ? "text-foreground" : "text-muted-foreground"}>{step.label}</span>
        </div>
      ))}
    </div>
  );
}
