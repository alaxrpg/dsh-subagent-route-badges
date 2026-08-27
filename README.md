# dsh-subagent-route-badges

独立 DSH 插件，在 0.1.1-rc.2 的子代理目录健康行和已打开子代理 Header 展示 `provider / model · 思考 effort`。它是纯展示插件，不拦截、不改写模型请求。

## 兼容性与安装

兼容 DSH `>=0.1.1-rc.2`，依赖的宿主接口均为 peer dependency。请从插件市场安装、更新和卸载；插件市场按包版本识别可用更新，更新后按市场提示重启 DSH。

## 字段来源

插件只有在看到 `subagent/descriptor` 后才输出投影。最新 `request/header` 的 `data.header.config` 是 provider、model、reasoningEffort 的权威来源；`header.adapterDefaults.reasoningEffort === true` 将无 effort 标为 `adapter-default`；否则为 `unspecified`。`assistant/message.source` 仅回退 provider/model，绝不会清除已知 effort。缺少投影显示“路由未知”，缺少 effort 显示“思考 默认”。

## 冲突、隐私与限制

插件注册唯一投影 key `subagentRouteBadge`，并以唯一 ID shadow 官方 lineage occupant，同时通过 additive header action 添加徽章，不增加目录按钮；宿主 slot 冲突时以 DSH slot 排序/占用规则为准。只读取已进入会话事件与 projectionValues 的字段，不读取文件、凭据或消息正文，也不上传数据。徽章长文本省略，但完整值保留在 `title` 与 `aria-label` 中。
