import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProjectItem } from "@/lib/api/types";

export function RunsFilterBar({
  projectId,
  status,
  workflowType,
  confidenceDecision,
  hasPr,
  createdByUserId,
  sortBy,
  sortOrder,
  search,
  onProjectIdChange,
  onStatusChange,
  onWorkflowTypeChange,
  onConfidenceDecisionChange,
  onHasPrChange,
  onCreatedByUserIdChange,
  onSortByChange,
  onSortOrderChange,
  onSearchChange,
  projects,
}: {
  projectId: string;
  status: string;
  workflowType: string;
  confidenceDecision: string;
  hasPr: string;
  createdByUserId: string;
  sortBy: string;
  sortOrder: string;
  search: string;
  onProjectIdChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onWorkflowTypeChange: (value: string) => void;
  onConfidenceDecisionChange: (value: string) => void;
  onHasPrChange: (value: string) => void;
  onCreatedByUserIdChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  projects: ProjectItem[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search run id, ticket, project..."
        className="w-[240px]"
      />
      <Input
        value={createdByUserId}
        onChange={(e) => onCreatedByUserIdChange(e.target.value)}
        placeholder="Created by user id"
        className="w-[180px]"
      />
      <Select value={projectId} onValueChange={onProjectIdChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {["queued", "running", "succeeded", "failed", "skipped", "rejected"].map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={workflowType} onValueChange={onWorkflowTypeChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Workflow" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All workflows</SelectItem>
          <SelectItem value="jira-to-pr">jira-to-pr</SelectItem>
          <SelectItem value="linear-to-pr">linear-to-pr</SelectItem>
        </SelectContent>
      </Select>
      <Select value={confidenceDecision} onValueChange={onConfidenceDecisionChange}>
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="Confidence" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All confidence</SelectItem>
          <SelectItem value="approved">approved</SelectItem>
          <SelectItem value="rejected">rejected</SelectItem>
        </SelectContent>
      </Select>
      <Select value={hasPr} onValueChange={onHasPrChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Has PR" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any PR</SelectItem>
          <SelectItem value="true">has PR</SelectItem>
          <SelectItem value="false">no PR</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">created_at</SelectItem>
          <SelectItem value="updated_at">updated_at</SelectItem>
          <SelectItem value="status">status</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">desc</SelectItem>
          <SelectItem value="asc">asc</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
