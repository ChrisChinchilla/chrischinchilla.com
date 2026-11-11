// Run with: node scripts/check-software-stats.mjs
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const snapshot = JSON.parse(readFileSync(new URL('../src/data/software-github.json', import.meta.url)));
const source = readFileSync(new URL('../src/utils/software-github.ts', import.meta.url), 'utf8').replace(
  "import snapshot from '../data/software-github.json';",
  `const snapshot = ${JSON.stringify(snapshot)};`
);
const code = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 });
const { getSoftwareStats } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const originalFetch = globalThis.fetch;
try {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return { ok: true, json: async () => ({ stargazers_count: 12, forks_count: 3 }) };
  };
  assert.equal((await getSoftwareStats('test/success')).stars, 12);
  await getSoftwareStats('test/success');
  assert.equal(calls, 1);
  globalThis.fetch = async () => {
    throw Error('offline');
  };
  assert.deepEqual(await getSoftwareStats('ChrisChinchilla/vale-vscode'), snapshot['ChrisChinchilla/vale-vscode']);
  assert.equal(await getSoftwareStats('test/missing'), undefined);
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ stargazers_count: -1, forks_count: 0 }) });
  assert.equal(await getSoftwareStats('test/invalid'), undefined);
  console.log('Software stats checks passed.');
} finally {
  globalThis.fetch = originalFetch;
}
