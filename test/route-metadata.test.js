import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, apply, view, viewSchema } from '../lib/route-metadata.js';
const fold = (events) => events.reduce(apply, initialState());
test('viewSchema validates the computed view without re-deriving it (host calls parse(view(state)))', () => {
  const v = view(fold([{ type: 'subagent/descriptor' }, { type: 'request/header', data: { header: { config: { provider: 'zai-coding-cn', model: 'glm-5.3', reasoningEffort: 'max' }, adapterDefaults: { reasoningEffort: true } } } }]));
  assert.deepEqual(viewSchema.parse(v), v);
  assert.equal(viewSchema.parse(null), null);
  assert.throws(() => viewSchema.parse({ provider: 'p', model: 'm', reasoningEffort: null, reasoningSource: 'bogus' }), /invalid route metadata/);
});
test('descriptor and complete route gate projection', () => { assert.equal(view(fold([{ type: 'assistant/message', data: { message: { source: { provider: 'p' } } } }])), null); assert.equal(view(fold([{ type: 'subagent/descriptor', data: {} }])), null); });
test('header explicit/default/unspecified', () => { const base = { type: 'subagent/descriptor' }; assert.equal(view(fold([base, { type: 'request/header', data: { header: { config: { provider: 'p', model: 'm', reasoningEffort: 'high' }, adapterDefaults: { reasoningEffort: true } } } }])).reasoningSource, 'adapter-default'); assert.equal(view(fold([base, { type: 'request/header', data: { header: { config: { provider: 'p', model: 'm' }, adapterDefaults: { reasoningEffort: true } } } }])).reasoningSource, 'unspecified'); assert.equal(view(fold([base, { type: 'request/header', data: { header: { config: { provider: 'p', model: 'm' } } } }])).reasoningEffort, null); });
test('route switch and assistant fallback preserve effort', () => { const v = view(fold([{ type: 'subagent/descriptor' }, { type: 'request/header', data: { header: { config: { provider: 'a', model: 'one', reasoningEffort: 'low' } } } }, { type: 'assistant/message', data: { message: { source: { provider: 'b', model: 'two' } } } }])); assert.deepEqual(v, { provider: 'b', model: 'two', reasoningEffort: 'low', reasoningSource: 'explicit' }); });
test('malformed and unrelated events fail soft', () => { const s = fold([null, {}, { type: 'request/header', data: null }, { type: 'subagent/descriptor', data: null }, { type: 'other', data: [] }]); assert.equal(view(s), null); });
