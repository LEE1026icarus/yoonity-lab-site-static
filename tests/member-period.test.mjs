import assert from "node:assert/strict";
import test from "node:test";

test("member periods never render undefined for an incomplete end date", async () => {
  const membersList = await import("../src/components/members-list.tsx");

  assert.equal(typeof membersList.formatPeriod, "function");
  assert.equal(membersList.formatPeriod("25.11-20."), "2025.11");
});

test("member periods normalize complete ranges and open-ended dates", async () => {
  const { formatPeriod } = await import("../src/components/members-list.tsx");

  assert.equal(formatPeriod("24.12-25.11"), "2024.12 – 2025.11");
  assert.equal(formatPeriod("25.11-"), "2025.11 – 현재");
  assert.equal(formatPeriod("2025.11 – 현재"), "2025.11 – 현재");
});
