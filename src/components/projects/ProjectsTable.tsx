import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Play, Timer } from "lucide-react";
import { getProviderLabel } from "@/lib/format";
import type { ProjectItem } from "@/lib/api/types";

export function ProjectsTable({ projects }: { projects: ProjectItem[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/40 text-muted-foreground">
          <th className="text-left p-3 font-medium">Name</th>
          <th className="text-left p-3 font-medium">Repository</th>
          <th className="text-left p-3 font-medium">Issue Source</th>
          <th className="text-left p-3 font-medium">Workflow</th>
          <th className="text-right p-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
            <td className="p-3">
              <p className="font-medium text-foreground">{project.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{project.id}</p>
            </td>
            <td className="p-3">
              <p className="font-mono text-xs text-foreground">
                {project.repo_owner}/{project.repo_name}
              </p>
              <p className="text-xs text-muted-foreground">{project.repo_default_branch}</p>
            </td>
            <td className="p-3">
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                {getProviderLabel(project.ticket_source_type)} · {project.ticket_source_project_key}
              </span>
            </td>
            <td className="p-3 text-xs font-mono text-muted-foreground">{project.workflow_type}</td>
            <td className="p-3">
              <div className="flex items-center justify-end gap-1">
                <Link to={`/projects/${project.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link to={`/projects/${project.id}/run`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Run workflow">
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link to={`/projects/${project.id}/autopoll`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Auto-polling">
                    <Timer className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
