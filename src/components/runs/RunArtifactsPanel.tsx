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
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Artifacts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0 text-xs">
        {!artifacts?.length ? (
          <p className="rounded-md border border-border/40 px-2 py-1.5 text-muted-foreground">No artifacts found for this run.</p>
        ) : (
          <div className="overflow-hidden rounded-md border border-border/50">
            <table className="w-full text-xs">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 text-left font-medium">Artifact</th>
                  <th className="px-2 py-1.5 text-left font-medium">Type</th>
                  <th className="px-2 py-1.5 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {artifacts.map((artifact) => (
                  <tr key={artifact.id} className="border-t border-border/40">
                    <td className="max-w-[220px] truncate px-2 py-1.5 text-foreground" title={artifact.name ?? artifact.id}>
                      {artifact.name ?? artifact.id}
                    </td>
                    <td className="px-2 py-1.5 text-muted-foreground">{artifact.artifact_type}</td>
                    <td className="px-2 py-1 text-right">
                      <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => onSelect(artifact.id)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <TablePagination page={page} totalPages={Math.max(totalPages, 1)} onPageChange={onPageChange} />
      </CardContent>
    </Card>
  );
}
