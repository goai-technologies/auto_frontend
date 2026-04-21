import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OnboardingStepCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-card/80 border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  );
}
