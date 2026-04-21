import { Badge } from "@/components/ui/badge";

export function UserStatusBadge({ active }: { active: boolean }) {
  return <Badge variant={active ? "secondary" : "destructive"}>{active ? "active" : "inactive"}</Badge>;
}
