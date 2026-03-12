import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockProjects } from "@/lib/mock-data";
import { getProviderLabel } from "@/lib/format";
import { Plus, Play, Timer, Eye } from "lucide-react";

const Projects = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your ticket → PR project mappings
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Project
        </Button>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Repository</th>
                  <th className="text-left p-3 font-medium">Issue Source</th>
                  <th className="text-left p-3 font-medium">Workflow</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProjects.map((project) => (
                  <tr
                    key={project.project_id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-foreground">{project.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {project.project_id}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-mono text-xs text-foreground">
                        {project.repo_owner}/{project.repo_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{project.default_branch}</p>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {getProviderLabel(project.issue_source)} · {project.issue_source_key}
                      </span>
                    </td>
                    <td className="p-3 text-xs font-mono text-muted-foreground">
                      {project.default_workflow}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/projects/${project.project_id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link to={`/projects/${project.project_id}/run`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Run workflow"
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link to={`/projects/${project.project_id}/autopoll`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Auto-polling"
                          >
                            <Timer className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Projects;

