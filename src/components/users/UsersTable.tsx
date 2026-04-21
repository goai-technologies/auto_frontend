import { Button } from "@/components/ui/button";
import type { UserItem } from "@/lib/api/types";
import { UserStatusBadge } from "@/components/users/UserStatusBadge";

export function UsersTable({
  users,
  onEdit,
}: {
  users: UserItem[];
  onEdit: (user: UserItem) => void;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/40 text-muted-foreground">
          <th className="p-3 text-left font-medium">Name</th>
          <th className="p-3 text-left font-medium">Email</th>
          <th className="p-3 text-left font-medium">Role</th>
          <th className="p-3 text-left font-medium">Status</th>
          <th className="p-3 text-right font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-border/30 last:border-0">
            <td className="p-3">{user.name ?? user.id}</td>
            <td className="p-3">{user.email}</td>
            <td className="p-3">{user.role}</td>
            <td className="p-3">
              <UserStatusBadge active={user.is_active} />
            </td>
            <td className="p-3 text-right">
              <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
