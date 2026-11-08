// Run with: node scripts/check-raycast-stats.mjs
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const source = readFileSync(new URL('../src/utils/software-raycast.ts', import.meta.url), 'utf8');
const code = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 });
const { parseRaycastInstalls, getRaycastInstalls } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
);
assert.equal(parseRaycastInstalls('<span>7,013<!-- --> Installs</span>'), 7013);
assert.equal(parseRaycastInstalls('<span>0 Installs</span>'), 0);
assert.equal(parseRaycastInstalls('<span>Unavailable</span>'), undefined);
assert.equal(parseRaycastInstalls('<span>9007199254740992 Installs</span>'), undefined);
const originalFetch = globalThis.fetch;
try {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return { ok: true, text: async () => '<span>7,013<!-- --> Installs</span>' };
  };
  assert.equal(await getRaycastInstalls('https://example.com/live', 1), 7013);
  await getRaycastInstalls('https://example.com/live', 1);
  assert.equal(calls, 1);
  globalThis.fetch = async () => {
    throw Error('offline');
  };
  assert.equal(await getRaycastInstalls('https://example.com/offline', 7000), 7000);
  globalThis.fetch = async () => ({ ok: true, text: async () => '<span>Changed markup</span>' });
  assert.equal(await getRaycastInstalls('https://example.com/changed', 7001), 7001);
  console.log('Raycast stats checks passed.');
} finally {
  globalThis.fetch = originalFetch;
}
