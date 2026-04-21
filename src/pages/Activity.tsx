import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useProjects } from "@/hooks/api/useProjects";
import { useRuns } from "@/hooks/api/useRuns";
import { RunsFilterBar } from "@/components/runs/RunsFilterBar";
import { RunsTable } from "@/components/runs/RunsTable";
import { TablePagination } from "@/components/common/TablePagination";
import { PageState } from "@/components/common/PageState";
import { EmptyState } from "@/components/common/EmptyState";

const ActivityPage = () => {
  const [params, setParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(params.get("q") ?? "");
  const projectFilter = params.get("project_id") ?? "all";
  const statusFilter = params.get("status") ?? "all";
  const workflowType = params.get("workflow_type") ?? "all";
  const confidenceDecision = params.get("confidence_decision") ?? "all";
  const hasPr = params.get("has_pr") ?? "all";
  const createdByUserId = params.get("created_by_user_id") ?? "";
  const sortBy = params.get("sort_by") ?? "created_at";
  const sortOrder = params.get("sort_order") ?? "desc";
  const page = Number(params.get("page") ?? "1");

  const projectsQuery = useProjects({ page: 1, page_size: 100 });
  const runsQuery = useRuns({
    page,
    page_size: 20,
    q: params.get("q") ?? undefined,
    project_id: projectFilter !== "all" ? projectFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    workflow_type: workflowType !== "all" ? workflowType : undefined,
    confidence_decision: confidenceDecision !== "all" ? (confidenceDecision as "approved" | "rejected") : undefined,
    has_pr: hasPr !== "all" ? hasPr === "true" : undefined,
    created_by_user_id: createdByUserId || undefined,
    sort_by: sortBy,
    sort_order: sortOrder as "asc" | "desc",
  });

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (searchInput.trim()) next.set("q", searchInput.trim());
      else next.delete("q");
      next.set("page", "1");
      setParams(next, { replace: true });
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const runs = runsQuery.data?.items ?? [];
  const pagination = runsQuery.data?.pagination;
  const projectItems = projectsQuery.data?.items ?? [];

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">All workflow runs across projects</p>
      </div>

      <RunsFilterBar
        projectId={projectFilter}
        status={statusFilter}
        workflowType={workflowType}
        confidenceDecision={confidenceDecision}
        hasPr={hasPr}
        createdByUserId={createdByUserId}
        sortBy={sortBy}
        sortOrder={sortOrder}
        search={searchInput}
        projects={projectItems}
        onSearchChange={setSearchInput}
        onProjectIdChange={(value) => {
          const next = new URLSearchParams(params);
          if (value === "all") next.delete("project_id");
          else next.set("project_id", value);
          next.set("page", "1");
          setParams(next);
        }}
        onStatusChange={(value) => {
          const next = new URLSearchParams(params);
          if (value === "all") next.delete("status");
          else next.set("status", value);
          next.set("page", "1");
          setParams(next);
        }}
        onWorkflowTypeChange={(value) => {
          const next = new URLSearchParams(params);
          if (value === "all") next.delete("workflow_type");
          else next.set("workflow_type", value);
          next.set("page", "1");
          setParams(next);
        }}
        onConfidenceDecisionChange={(value) => {
          const next = new URLSearchParams(params);
          if (value === "all") next.delete("confidence_decision");
          else next.set("confidence_decision", value);
          next.set("page", "1");
          setParams(next);
        }}
        onHasPrChange={(value) => {
          const next = new URLSearchParams(params);
          if (value === "all") next.delete("has_pr");
          else next.set("has_pr", value);
          next.set("page", "1");
          setParams(next);
        }}
        onCreatedByUserIdChange={(value) => {
          const next = new URLSearchParams(params);
          if (value.trim()) next.set("created_by_user_id", value.trim());
          else next.delete("created_by_user_id");
          next.set("page", "1");
          setParams(next);
        }}
        onSortByChange={(value) => {
          const next = new URLSearchParams(params);
          next.set("sort_by", value);
          next.set("page", "1");
          setParams(next);
        }}
        onSortOrderChange={(value) => {
          const next = new URLSearchParams(params);
          next.set("sort_order", value);
          next.set("page", "1");
          setParams(next);
        }}
      />

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-sm">
        <CardContent className="p-0">
          <PageState
            loading={runsQuery.isLoading}
            error={runsQuery.isError ? "Failed to load runs." : null}
            onRetry={() => runsQuery.refetch()}
          >
            <div className="space-y-2">
              <div className="overflow-x-auto">
                {runs.length ? <RunsTable runs={runs} /> : <EmptyState message="No runs match current filters." />}
              </div>
              {pagination && (
                <TablePagination
                  page={pagination.page}
                  totalPages={pagination.total_pages}
                  onPageChange={(nextPage) => {
                    const next = new URLSearchParams(params);
                    next.set("page", String(nextPage));
                    setParams(next);
                  }}
                />
              )}
            </div>
          </PageState>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityPage;

