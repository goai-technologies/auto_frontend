export function OnboardingStatusBanner({ complete }: { complete: boolean }) {
  return (
    <div
      className={`rounded-md border p-3 text-sm ${
        complete ? "border-success/40 bg-success/10 text-success" : "border-warning/40 bg-warning/10 text-foreground"
      }`}
    >
      {complete
        ? "Onboarding complete. Your workspace is ready."
        : "Onboarding is incomplete. Complete the remaining setup steps to run workflows reliably."}
    </div>
  );
}
