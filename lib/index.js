import { definition } from './route-metadata.js';

/** Host half: a read-only projection; it never intercepts or changes requests. */
export const inject = ['sessionProjections'];

export function apply(ctx) {
  ctx.sessionProjections.register(definition);
}
export { definition } from './route-metadata.js';
