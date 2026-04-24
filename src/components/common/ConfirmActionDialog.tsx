import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ConfirmActionDialog({
  title,
  description,
  triggerLabel,
  onConfirm,
  pending,
  triggerDisabled,
  triggerTitle,
  confirmLabel,
}: {
  title: string;
  description?: string;
  triggerLabel: string;
  onConfirm: () => void;
  pending?: boolean;
  triggerDisabled?: boolean;
  triggerTitle?: string;
  confirmLabel?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={triggerDisabled} title={triggerTitle}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onConfirm} disabled={pending}>
            {pending ? "Please wait..." : confirmLabel ?? "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
