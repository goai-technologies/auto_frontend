import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/common/TablePagination";
import type { RunArtifactItem } from "@/lib/api/types";

export function RunArtifactsPanel({
  artifacts,
  page,
  totalPages,
  onPageChange,
  onSelect,
}: {
  artifacts?: RunArtifactItem[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelect: (artifactId: string) => void;
}) {
  return (
    <Card className="bg-card/80 border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Artifacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {!artifacts?.length ? (
          <p className="text-muted-foreground">No artifacts found for this run.</p>
        ) : (
          artifacts.map((artifact) => (
            <div key={artifact.id} className="rounded border border-border/50 p-2">
              <p>{artifact.name ?? artifact.id}</p>
              <p className="text-muted-foreground">{artifact.artifact_type}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => onSelect(artifact.id)}>
                View detail
              </Button>
            </div>
          ))
        )}
        <TablePagination page={page} totalPages={Math.max(totalPages, 1)} onPageChange={onPageChange} />
      </CardContent>
    </Card>
  );
}
