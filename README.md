# dsh-subagent-route-badges

独立 DSH 插件，在已打开子代理会话的 Header actions 区展示 `provider / model · 思考 effort` 路由徽章。它是纯展示插件，不拦截、不改写模型请求。

## 兼容性与安装

兼容 DSH `>=0.1.1-rc.2`，依赖的宿主接口均为 peer dependency。请从插件市场安装、更新和卸载；插件市场按包版本识别可用更新，更新后按市场提示重启 DSH。

## 实现方式（0.2.0 起）

客户端是纯 additive 实现：只以唯一 ID `dsh-subagent-route-badges-action` 注册 `conversation.session.header.actions`（list 型槽位）一个席位，不复制、不 shadow 官方 UI 组件，不竞争 single 型槽位，因此与官方包无 slot/locale/priority 冲突面。目录弹窗行内不做展示；如需查看路由，打开对应子代理会话看 Header。投影缺失时显示「路由未知」占位，便于肉眼确认组件已接管。

## 字段来源

服务端注册唯一投影 key `subagentRouteBadge`，只有在看到 `subagent/descriptor` 后才输出视图。最新 `request/header` 的 `data.header.config` 是 provider、model、reasoningEffort 的权威来源；`header.adapterDefaults.reasoningEffort === true` 将无 effort 标为 `adapter-default`；否则为 `unspecified`。`assistant/message.source` 仅回滚 provider/model，绝不会清除已知 effort。缺少投影显示「路由未知」，缺少 effort 显示「思考 默认」。

## 隐私与限制

只读取已进入会话事件与 projectionValues 的字段，不读取文件、凭据或消息正文，也不上传数据。徽章长文本省略，但完整值保留在 `title` 与 `aria-label` 中。
