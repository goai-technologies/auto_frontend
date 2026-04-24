import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function IntegrationFormDialog({
  open,
  onOpenChange,
  title,
  name,
  secret,
  onNameChange,
  onSecretChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  name: string;
  secret: string;
  onNameChange: (value: string) => void;
  onSecretChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Name (optional)</Label>
          <Input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="provider-default"
          />
        </div>
        <div className="space-y-2">
          <Label>Credential</Label>
          <Input
            type="password"
            value={secret}
            onChange={(e) => onSecretChange(e.target.value)}
            placeholder="Leave blank to keep existing secret"
          />
        </div>
        <Button onClick={onSubmit}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
