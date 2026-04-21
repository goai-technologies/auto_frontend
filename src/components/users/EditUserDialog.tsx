import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { UserItem } from "@/lib/api/types";

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSubmit,
}: {
  user?: UserItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { role: "admin" | "operator"; is_active: boolean }) => void;
}) {
  const [role, setRole] = useState<"admin" | "operator">(user?.role ?? "operator");
  const [isActive, setIsActive] = useState<boolean>(user?.is_active ?? true);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <select
            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "operator")}
          >
            <option value="operator">operator</option>
            <option value="admin">admin</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            active
          </label>
          <Button
            onClick={() => {
              onSubmit({ role, is_active: isActive });
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
