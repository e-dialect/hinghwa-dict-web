# 亲戚数据结构 v1（Phase 2）

本阶段把 Phase 1 的 110 个关系角色迁移到版本化数据层，不改变现有页面的关系查表行为。升级计划见 [Issue #188](https://github.com/e-dialect/hinghwa-dict-web/issues/188)。

## 文件契约

两端 `src/data/kinship/v1/` 的六个文件必须字节相同：

|文件|职责|
|---|---|
|kinship.json|规范关系、词形、绑定、来源及版本|
|role-ids.json|显式冻结 110 个普通话旧名称到语义 ID 的映射|
|schema.json|JSON Schema 2020-12 的结构契约|
|validator.mjs|无需第三方依赖的 v1 专用结构及语义校验|
|adapter.mjs|两端与 Node 共用的 ES 模块兼容层|
|legacy-contract.json|Phase 1 导出对象与冻结 ID 表的 SHA256 契约|

`schemaVersion` 表示结构版本，当前为 `1.0.0`；`datasetVersion` 表示这份数据快照，当前为 `2026-10-13.1`。修改数据时必须明确考虑版本更新，不将较旧会话直接当成当前数据的会话。

## 角色与 ID

`nodes` 只描述关系角色。每个节点含：

- 显式的 `id`，例如 `daughter`、`paternal-grandson`、`maternal-grandson`。
- 可更改的显示标签 `label`，以及冻结兼容别名 `legacyName`。
- `sex` 为 `male`、`female` 或 `unknown`。未细分性别的子女角色保留 unknown。
- `kind` 为 `person`、`collective` 或 `unsupported`。祖先合称为 collective；person 表示亲属个人角色，不声称数据中的角色已经对应一个确定人物。
- 十个 `relations` 字段，以语义 ID 引用目标；值为单个 ID、候选 ID 数组或 null。
- `termIds` 引用词形；`provenance` 引用来源；可选 `note` 保留 Phase 1 限定说明。

运行时不会从中文标签、数组下标或词条 ID 计算角色 ID。v1 的 ID 不允许重新分配。标签重命名不会改变引擎 ID，也不会改变旧页面仍使用的 name 引用。显式 ID 表及校验契约一起防止误改。

## 词形和数据库绑定

123 个 `terms` 与 75 个 `bindings` 独立于角色存在。一个词形可被多个角色引用，但这不构成对这些角色用法的语言学确认。

|term.status|含义|数据库绑定|
|---|---|---|
|bound（75 项）|词形及正整数 ID 已与用户提供快照精确核对|bindingId 引用 bindings|
|missingWord（20 项）|旧图确有方言词形，但快照无确认对应词条|bindingId=null|
|rolePending（28 项）|只有普通话关系角色占位，兴化语称谓未确认|bindingId=null|

所有 `usage` 均为 `unknown`。本阶段不把图中的称谓审定为面称、背称、排行适用、父系/母系通用或其他使用方式。`displayDefinition` 仅用于保持 Phase 1 的待核/错误绑定说明，不替代数据库释义。

`bindings` 使用命名空间 `hinghwa-word`，保存正整数 `wordId`、快照中的 `snapshotWord`、状态 `snapshotExactMatch` 和来源。该状态只证明提供的 SQLite 快照中词形与 ID 相匹配，不证明某个关系角色可使用它，也不保证线上实时存在。

## 来源

`sources` 明确区分原图、旧数据、数据库快照与关系规范化推断；每个角色、词形、绑定通过 source ID 引用来源。具体出处和语言学未确定项见 [Phase 1 数据说明](kinship-data-completion.md)。

`role-normalization` 指从已有关系边规范化出来的普通话角色定义，不表示新发现了方言称谓。`sqlite-snapshot` 仅承载用户提供快照的精确绑定范围。不得通过把 rolePending 改成 missingWord 来生成待投稿的虚假方言词形。

## 消费接口

旧模块 `relative.js` 只负责导入 JSON 和共享 adapter，仍导出 `buttons`、`fieldName`、`relative`、`find`。这些 Phase 1 对象的完整 JSON SHA256 必须相同；页面无需理解规范结构。

同时导出 `dataset`、`engineDataset` 和 `roleIdByName`。Phase 3 使用 `engineDataset` 的版本、selfId 与角色图；引擎数据不包含词条绑定，不因缺词条停止关系计算。词条展示使用规范 terms/bindings，明确区分真正缺词条和普通话占位，rolePending 不请求词条 API。保留通用投稿入口，欢迎有来源的实际说法和纸面词形转为正式词条；不会把普通话占位预填为方言词形，也不会自动更新亲戚关系。

共享 adapter 使用标准 `.mjs` ES 模块，由 Vue 2/Webpack、uni/Vite 与 Node 直接消费；没有新增依赖，也没有独立的两套转换逻辑。ES 模块扩展名在旧 uni ESLint 的 import/extensions 规则上有一处带原因的局部豁免。

## 校验和 CI

```sh
npm run check:kinship
# Web checkout:
npm run check:kinship -- ../hinghwa-dict-uni-app
# uni checkout:
npm run check:kinship -- ../hinghwa-dict-web
```

校验包括：

- 版本、角色/词形/绑定 ID 唯一性、十字段、所有引用、空文本及来源引用。
- 冻结 ID 表、110 角色旧 API 完整 SHA256、显示标签重命名不影响 ID/兼容别名。
- bound、missingWord、rolePending 的绑定规则和 unknown 用法边界。
- 19 个无效数据负例，包括悬空引用、伪绑定、角色占位误算方言词、无来源、非正词条 ID、擅自声称用法和损坏结构。
- 两端共享数据、schema、adapter、validator、契约和检查脚本的字节一致性。
- 原 Phase 1 的关键关系路径、展示与异步回归。

`validator.mjs` 是与 v1 契约配套的专用校验器，不是任意 JSON Schema 解释器；JSON Schema 可用于支持 2020-12 的外部编辑器。语义引用、冻结 ID 和跨仓库一致性由专用检查负责。

新增 CI `kinship-data-check.yml` 不安装依赖，仅对亲戚数据、兼容入口、检查脚本或该 workflow 的变更触发；不因普通页面、文档或 package.json 变更给无关 PR 增加配对要求。

PR 先在 Node 22 下运行本地契约校验，再 checkout 另一前端的同名分支核对共享文件。两端数据变更应使用同名配对分支一起发布；如对应仓库使用不同名称，可设置仓库变量 `KINSHIP_PEER_REF` 为审定的对应 ref。不存在或不一致的对应分支会使配对检查失败，不静默退回 master 或跳过。

master push 只执行本地契约校验，不依赖另一仓库的合并时序。两仓配对 PR 通过后可分别合并；两端合并完成后，维护者应在刷新两个 master checkout 的基础上手动运行带 peer 参数的 `npm run check:kinship`，确认最终两端字节一致。CI 不把临时的跨仓合并先后差异视为 master 数据损坏。

本阶段没有修复聚合角色丢失人物来源等计算引擎限制；这些属于 Phase 3。数据结构通过检查不代表整张图已经完成语言学审定。
