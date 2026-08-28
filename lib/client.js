window.__ModuleLoader__.load({
	id: "dsh-subagent-route-badges",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const React = require("react");
		const createElement = React.createElement;
		//#region client constants
		const NS = "dsh-subagent-route-badges";
		const ROUTE_BADGE_PREFIX = "dsh-route-badge-";
		const zh = {
			"badge.unknown": "路由未知",
			"badge.unknown.title": "路由元数据不可用（会话事件中未见 request/header）"
		};
		const en = {
			"badge.unknown": "route unknown",
			"badge.unknown.title": "route metadata unavailable (no request/header seen in session events)"
		};
		//#endregion
		//#region client badge
		/**
		* Compact route badge: `provider / model · 思考 effort`.
		* Missing projections degrade to a visible「路由未知」placeholder so the
		* occupant's presence is verifiable in the UI; full values stay in title/aria.
		*/
		function routeBadge(value) {
			const known = value !== null && typeof value === "object";
			const provider = known && typeof value.provider === "string" ? value.provider : null;
			const model = known && typeof value.model === "string" ? value.model : null;
			if (provider === null || model === null) {
				return createElement("span", {
					className: ROUTE_BADGE_PREFIX + "root",
					"data-dsh-route-badge": "true",
					"aria-label": "路由未知",
					title: "路由元数据不可用（会话事件中未见 request/header）"
				}, "路由未知");
			}
			const effort = known && typeof value.reasoningEffort === "string" ? value.reasoningEffort : "默认";
			const text = `${provider} / ${model} · 思考 ${effort}`;
			const title = known && value.reasoningSource === "adapter-default" ? `${text}（适配器默认）` : text;
			return createElement("span", {
				className: ROUTE_BADGE_PREFIX + "root",
				"data-dsh-route-badge": "true",
				"aria-label": text,
				title
			}, text);
		}
		/** Header-actions occupant: renders only inside an opened subagent session. */
		function RouteBadgeAction({ useSession }) {
			const session = useSession((state) => state);
			if (session === null || session === undefined || session.subagent === undefined || session.subagent === null) return null;
			return routeBadge(session.projectionValues ? session.projectionValues.subagentRouteBadge : undefined);
		}
		//#endregion
		//#region client plugin
		/** Required services for the additive header-actions seat. */
		const inject = [
			"slots",
			"locale"
		];
		function apply(ctx) {
			const badgeStyle = document.createElement("style");
			badgeStyle.dataset.dshRouteBadge = ROUTE_BADGE_PREFIX;
			badgeStyle.textContent = `[data-dsh-route-badge]{display:inline-flex;max-width:28rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left:6px;color:var(--dsw-alias-label-tertiary);font-size:11px}`;
			document.head.appendChild(badgeStyle);
			ctx.effect(() => () => badgeStyle.remove(), "route-badges: css");
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "route-badges: dictionaries");
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "dsh-subagent-route-badges-action",
				order: 90
			}, RouteBadgeAction));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
