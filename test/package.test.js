import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import pkg from '../package.json' with { type: 'json' };

const require = createRequire(import.meta.url);

test('manifest is a light DSH plugin bundle with web client', () => {
  assert.equal(pkg.version, '0.2.0');
  assert.equal(pkg.dsh.plugin, true);
  assert.ok(pkg.keywords.includes('dsh-plugin'));
  assert.equal(pkg.dsh.client.platform, 'web');
  assert.deepEqual(pkg.dsh.bundle, { patch: './cordis.patch.yml' });
  assert.ok(pkg.files.includes('lib/*.js'));
  assert.ok(pkg.files.includes('cordis.patch.yml'));
});

test('exports expose ./package.json so the host loader can resolve the manifest', () => {
  const resolved = require.resolve('dsh-subagent-route-badges/package.json', {
    paths: [import.meta.dirname]
  });
  assert.match(resolved, /dsh-subagent-route-badges[\\/]package\.json$/);
});

test('host interfaces and react live in peerDependencies with >= ranges only', () => {
  const peers = pkg.peerDependencies;
  assert.equal(pkg.dependencies, undefined);
  assert.ok(peers['@deepseek-ai/cordis']);
  assert.ok(peers['@deepseek-ai/dsh-client-runtime']);
  assert.ok(peers['@deepseek-ai/dsh-client-ui-conversation']);
  assert.ok(peers['@deepseek-ai/dsh-session-projection']);
  assert.equal(peers.react, '>=18.2.0');
  assert.equal(peers['react-dom'], undefined);
  for (const range of Object.values(peers)) assert.match(range, /^>=/);
});
