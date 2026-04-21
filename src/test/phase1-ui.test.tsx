import { describe, expect, it } from "vitest";
import { getStatusColor } from "@/lib/format";

describe("phase1 ui mappings", () => {
  it("maps rejected status to destructive color", () => {
    expect(getStatusColor("rejected")).toContain("text-destructive");
  });
});
