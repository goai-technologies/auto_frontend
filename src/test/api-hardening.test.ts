import { describe, expect, it } from "vitest";
import { getItems, isPaginated, unwrapData } from "@/lib/api/types";

describe("api hardening helpers", () => {
  it("unwrapData returns data for success envelopes", () => {
    const value = unwrapData({ data: { ok: true } });
    expect(value.ok).toBe(true);
  });

  it("getItems handles paginated payloads", () => {
    const rows = getItems({ items: [{ id: 1 }] });
    expect(rows).toHaveLength(1);
    expect(isPaginated({ items: rows, pagination: { page: 1, page_size: 20, total_items: 1, total_pages: 1 } })).toBe(true);
  });
});
