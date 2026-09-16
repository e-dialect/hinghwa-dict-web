# Third-Party Notices / 第三方声明

The root AGPL declaration applies only to code the project is authorized to
license. It does not replace the following file-level terms or resolve an
unrecorded upstream grant. Packages installed through `package.json` and
`yarn.lock` retain their own published licenses.

## Incremental deployment helper

- Local path: `scripts/incremental-diff.sh`.
- Copyright: 2022 Charlie Chiang.
- License: Apache License 2.0, as declared in the file header. The standard
  license text is preserved in [`LICENSES/Apache-2.0.txt`](LICENSES/Apache-2.0.txt).

## Speech-recognition WebAPI demo-derived files

- Local paths: `src/assets/IatRecorder.js` and
  `src/assets/transcode.worker.js`.
- Provenance: the structure, comments, endpoint, and helper names identify the
  files as copied or adapted from the iFLYTEK streaming voice-dictation WebAPI
  browser demo. The official API documentation links a JavaScript demo:
  <https://www.xfyun.cn/doc/asr/voicedictation/API.html>.
- Introduction record: PR #120 / commit
  `628a493733e14e9d4c30363b41696f2112504ec9`, contributed by
  [@123daxian](https://github.com/123daxian).
- License status: **`UNRESOLVED`**. Neither local file contains a copyright or
  license notice, and this audit did not establish an auditable open-source
  grant for the demo source. Public availability or a vendor documentation
  download is not itself permission to redistribute or relicense code.
- Current handling: the browser microphone-recognition UI, dependencies, and
  implementation structure are preserved for product continuity. Historical
  credential values are not republished by this PR; the three local constants
  use explicit inert placeholders with maintainer approval. A safe credential
  path is required before live provider calls can work again. These files are
  not declared to be project-original AGPL code and are excluded from any
  alternative commercial-license scope.
- Follow-up: provenance, authorization, and historical provider-credential
  rotation are tracked in
  [Issue #187](https://github.com/e-dialect/hinghwa-dict-web/issues/187),
  assigned to the original contributor. No credential value is reproduced in
  that Issue or this notice.

## Purchased illustration assets

- The maintainer confirmed during the 2026-09-16 governance review that the
  repository's illustration assets were purchased for project use.
- `src/assets/rewards.svg`, first added in `d4ac139`, remains in use under that
  purchased authorization. It is a media asset, not AGPL-covered software; its
  presence grants no standalone redistribution or alternative-commercial-
  relicensing right beyond the applicable purchase terms.
- `src/assets/timg.gif`, first added in `628a493`, is retained as a legacy media
  asset for functional and historical continuity. It remains outside the root
  software license and is governed by the applicable purchase terms.
- The private purchase record and applicable license terms should be retained
  for audit; this notice does not publish confidential transaction details.

**Current-tree unresolved paths: 2**, both isolated above and tracked by
Issue #187.

The WebAPI service itself is external and remains governed by the provider's
service terms. API credentials and user recordings are not licensed by this
repository.

---

根目录 AGPL 声明仅覆盖项目有权授权的代码。`scripts/incremental-diff.sh` 继续适用
其文件头声明的 Apache-2.0。两份语音识别 WebAPI 示例派生文件没有可核验的开源授权；
语音识别 UI、依赖和实现结构为保持产品连续性而保留，历史真实凭据不在本 PR 中重新
发布，三个本地常量经维护者同意改为不可用占位符。在建立安全凭据路径前，实时服务商
调用无法恢复。这些文件不声明为项目原创 AGPL 代码，也不纳入替代商业许可。来源、
授权及历史服务商凭据轮换由原贡献者通过
[Issue #187](https://github.com/e-dialect/hinghwa-dict-web/issues/187) 跟踪，本文不记录
任何凭据值。维护者确认仓库插画系为项目使用而购买；积分插画与作为历史媒体资产保留
的麦克风 GIF 继续适用购买条款且不纳入代码许可证。讯飞 WebAPI
服务、API 凭据与用户录音也不由本仓库授权。
