export function ArtifactViewer({ value }: { value: unknown }) {
  return <pre className="whitespace-pre-wrap rounded border border-border/50 p-2 text-xs">{JSON.stringify(value, null, 2)}</pre>;
}
