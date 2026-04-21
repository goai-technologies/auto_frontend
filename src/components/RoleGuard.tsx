import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Role } from "@/lib/api/types";
import { useAuth } from "@/components/AuthProvider";

export function RoleGuard({
  allowed,
  children,
  fallback,
}: {
  allowed: Role[];
  children: JSX.Element;
  fallback?: JSX.Element;
}) {
  const { role } = useAuth();
  if (role && allowed.includes(role)) return children;
  return (
    fallback || (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Permission required</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Your role does not have access to this screen.
        </CardContent>
      </Card>
    )
  );
}
