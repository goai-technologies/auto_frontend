import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProviderLabel } from "@/lib/format";
import type { ProjectItem } from "@/lib/api/types";

export function ProjectSummaryCard({ project }: { project: ProjectItem }) {
  return (
    <Card className="bg-card/80 border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p className="font-mono text-xs text-muted-foreground">{project.id}</p>
        <p>
          Repo: <span className="font-mono">{project.repo_owner}/{project.repo_name}</span>
        </p>
        <p>Source: {getProviderLabel(project.ticket_source_type)} · {project.ticket_source_project_key}</p>
      </CardContent>
    </Card>
  );
}
