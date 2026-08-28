import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');

test('registers only the additive header-actions seat under its own package id', () => {
  assert.match(source, /id: "dsh-subagent-route-badges"/);
  assert.match(source, /conversation\.session\.header\.actions/);
  assert.match(source, /dsh-subagent-route-badges-action/);
});

test('shadows nothing: no lineage/composer registration, no official module id', () => {
  assert.doesNotMatch(source, /conversation\.session\.header\.lineage/);
  assert.doesNotMatch(source, /conversation\.composer/);
  assert.doesNotMatch(source, /@deepseek-ai\/dsh-client-ui-subagent/);
});

test('unknown route degrades to a visible placeholder with accessible labels', () => {
  assert.match(source, /路由未知/);
  assert.match(source, /aria-label/);
  assert.match(source, /data-dsh-route-badge/);
  assert.match(source, /dsh-route-badge-/);
});
