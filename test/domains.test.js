import assert from "node:assert/strict";
import test from "node:test";

import { defaultDomainId, domains, getDomainById, levels } from "../src/ctf/data/index.js";

test("every level belongs to an existing learning area", () => {
  const ids = new Set(domains.map((domain) => domain.id));
  for (const level of levels) assert.ok(ids.has(level.domainId), `${level.id} has unknown area ${level.domainId}`);
});

test("available areas have content and the default area is available", () => {
  assert.equal(getDomainById(defaultDomainId).available, true);
  assert.notEqual(getDomainById(defaultDomainId).preview, true);
  for (const domain of domains.filter((item) => item.available)) {
    assert.ok(levels.some((level) => level.domainId === domain.id), `${domain.id} is available but has no level`);
    assert.ok(domain.grades?.length, `${domain.id} has no grade ladder`);
  }
});

test("unknown area ids fall back to the default area", () => {
  assert.equal(getDomainById("does-not-exist").id, defaultDomainId);
});
