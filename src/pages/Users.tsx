import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageState } from "@/components/common/PageState";
import { EmptyState } from "@/components/common/EmptyState";
import { TablePagination } from "@/components/common/TablePagination";
import { useCreateUser, useUpdateUser, useUsers } from "@/hooks/api/useUsers";
import { UsersTable } from "@/components/users/UsersTable";
import { CreateUserDialog } from "@/components/users/CreateUserDialog";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { toast } from "@/hooks/use-toast";
import type { UserItem } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const usersQuery = useUsers({ page, page_size: 20 });
  const createMutation = useCreateUser();
  const [editingUser, setEditingUser] = useState<UserItem | undefined>();
  const updateMutation = useUpdateUser(editingUser?.id ?? "");

  const users = usersQuery.data?.items ?? [];
  const pagination = usersQuery.data?.pagination;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Admin-only user management</p>
        </div>
        <CreateUserDialog
          onSubmit={(payload) =>
            createMutation
              .mutateAsync(payload)
              .then(() => toast({ title: "User created" }))
              .catch((err: any) => toast({ title: "Create failed", description: err?.message }))
          }
        />
      </div>
      <Card className="bg-card/80 border-border/60 shadow-sm">
        <CardContent className="p-0">
          <PageState
            loading={usersQuery.isLoading}
            error={
              usersQuery.error instanceof ApiError && usersQuery.error.status === 403
                ? "You do not have permission to manage users."
                : usersQuery.isError
                  ? "Failed to load users."
                  : null
            }
            onRetry={() => usersQuery.refetch()}
          >
            <div className="space-y-2">
              <div className="overflow-x-auto">
                {users.length ? <UsersTable users={users} onEdit={setEditingUser} /> : <EmptyState message="No users found." />}
              </div>
              {pagination && <TablePagination page={pagination.page} totalPages={pagination.total_pages} onPageChange={setPage} />}
            </div>
          </PageState>
        </CardContent>
      </Card>
      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(undefined)}
        onSubmit={(payload) =>
          updateMutation
            .mutateAsync(payload)
            .then(() => toast({ title: "User updated" }))
            .catch((err: any) => toast({ title: "Update failed", description: err?.message }))
        }
      />
    </div>
  );
};

export default UsersPage;
