/** Fold provider/model/reasoning metadata without affecting model requests. */
const KEY = 'subagentRouteBadge';
const initialState = () => ({ descriptor: false, provider: null, model: null, effort: null, source: 'unspecified' });
const record = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const text = (v) => typeof v === 'string' && v.length > 0 ? v : null;

function apply(state, event) {
  if (!record(state) || !record(event) || typeof event.type !== 'string') return state;
  let next = state;
  if (event.type === 'subagent/descriptor') {
    // The event type is the descriptor gate; malformed payloads are ignored
    // for fields but must not prevent fail-soft display for the child.
    if (!state.descriptor) next = { ...state, descriptor: true };
  }
  if (!next.descriptor) return next;
  if (event.type === 'request/header') {
    const header = record(event.data) && record(event.data.header) ? event.data.header : null;
    const config = header && record(header.config) ? header.config : null;
    if (!config) return next;
    const provider = text(config.provider) ?? text(config.providerId);
    const model = text(config.model) ?? text(config.modelId);
    const defaults = header && record(header.adapterDefaults) ? header.adapterDefaults : null;
    const effort = text(config.reasoningEffort);
    const source = effort !== null && defaults?.reasoningEffort === true ? 'adapter-default' : effort !== null ? 'explicit' : 'unspecified';
    return { ...next, provider: provider ?? next.provider, model: model ?? next.model, effort, source };
  }
  if (event.type === 'assistant/message') {
    const source = record(event.data) && record(event.data.message) && record(event.data.message.source) ? event.data.message.source : null;
    if (!source) return next;
    return { ...next, provider: text(source.provider) ?? next.provider, model: text(source.model) ?? next.model };
  }
  return next;
}

function view(state) {
  if (!record(state) || state.descriptor !== true) return null;
  const provider = text(state.provider), model = text(state.model);
  if (provider === null || model === null) return null;
  return { provider, model, reasoningEffort: text(state.effort), reasoningSource: state.source === 'explicit' || state.source === 'adapter-default' ? state.source : 'unspecified' };
}
/** Validates an already-computed view (the host calls `parse(view(state))`); never re-derives it. */
const viewSchema = { parse(value) {
  if (value === null) return null;
  if (!record(value) || typeof value.provider !== 'string' || typeof value.model !== 'string') throw new Error('invalid route metadata');
  if (value.reasoningEffort !== null && typeof value.reasoningEffort !== 'string') throw new Error('invalid route metadata');
  if (!['explicit', 'adapter-default', 'unspecified'].includes(value.reasoningSource)) throw new Error('invalid route metadata');
  return { provider: value.provider, model: value.model, reasoningEffort: value.reasoningEffort, reasoningSource: value.reasoningSource };
} };
const definition = { key: KEY, stateVersion: 1, stateSchema: { parse: (v) => record(v) ? v : initialState() }, init: initialState, apply, wire: { viewSchema, view } };
export { KEY, initialState, apply, view, viewSchema, definition };
