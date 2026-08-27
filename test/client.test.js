import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
test('registers official additive slots and accessible compact badge', () => { assert.match(source, /conversation\.session\.header\.lineage/); assert.match(source, /conversation\.session\.header\.actions/); assert.match(source, /思考 \$\{effort\}/); assert.match(source, /aria-label/); assert.match(source, /dsh-route-badge-/); });
